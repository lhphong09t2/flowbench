(function () {
  "use strict";
  const LESSONS = window.FLOWBENCH_LESSONS || {};
  const LESSON_KEY_RE = /^(?:0?[1-9]|1[0-9]|20)$/;
  const params = new URLSearchParams(window.location.search);
  if (params.get("aspect") === "9x16") {
    document.body.classList.add("portrait-9x16");
  }

  const pickerEl = document.getElementById("lesson-picker");
  const stageTabsEl = document.getElementById("stage-tabs");
  const editorEl = document.getElementById("code-editor");
  const stdinEl = document.getElementById("stdin-box");
  const outputEl = document.getElementById("output-console");
  const timingEl = document.getElementById("exec-timing");
  const statusEl = document.getElementById("runtime-status");
  const filenameEl = document.getElementById("editor-filename");
  const guideEl = document.getElementById("lesson-guide");
  const runBtn = document.getElementById("run-btn");
  const stopBtn = document.getElementById("stop-btn");
  const resetBtn = document.getElementById("reset-btn");
  const docsBtn = document.getElementById("toggle-docs-btn");
  const docsDrawer = document.getElementById("docs-drawer");
  const docsRefListEl = document.getElementById("docs-ref-list");
  const sampleTitleEl = document.getElementById("sample-data-title");
  const sampleCaptionEl = document.getElementById("sample-data-caption");
  const samplePreviewEl = document.getElementById("sample-data-preview");
  const copySampleBtn = document.getElementById("copy-sample-stdin-btn");
  const vscodeBtn = document.getElementById("toggle-vscode-btn");
  const vscodeDrawer = document.getElementById("vscode-drawer");

  const CODE_DOC_RULES = [
    { re: /\binput\s*\(/, sig: "input(prompt) -> str", note: "Always returns text — wrap in int() or float() for math." },
    { re: /\btype\s*\(/, sig: "type(obj) -> class badge", note: "Returns the runtime class of any value." },
    { re: /\bmatch\b|\bcase\b/, sig: "match subject: / case pattern:", note: "Structural pattern matching with '_' wildcard fallback." },
    { re: /\benumerate\s*\(/, sig: "enumerate(iterable, start=1)", note: "Pairs 1-based counter index with each item cleanly." },
    { re: /\brange\s*\(/, sig: "range(start, stop, step)", note: "Generates integer steps up to (excluding) stop." },
    { re: /\.copy\s*\(|\bsorted\s*\(/, sig: "sorted(seq) & list.copy()", note: "Returns a new ordered list without mutating originals." },
    { re: /\bCounter\b|\bdefaultdict\b/, sig: "Counter(seq) & defaultdict(list)", note: "O(1) frequency counting and automatic bucket grouping." },
    { re: /\blambda\b/, sig: "sorted(items, key=lambda x: ...)", note: "Custom inline sort key without mutating input items." },
    { re: /\bre\.VERBOSE\b|\bre\.sub\b/, sig: "re.compile(pat, re.VERBOSE) & re.sub()", note: "Readable named-group regex extraction and redaction." },
    { re: /\btry\s*:|\bexcept\b/, sig: "try / except / else / finally", note: "Catches narrow errors while isolating normal & cleanup logic." },
    { re: /\bDecimal\b/, sig: "Decimal(str_val).quantize(Decimal('0.01'))", note: "Exact base-10 currency arithmetic with zero binary float drift." },
    { re: /\bfromisoformat\b|\btimedelta\b/, sig: "datetime.fromisoformat() + timedelta()", note: "Timezone-aware ISO timestamp parsing and deadline math." },
    { re: /\bsha256\b/, sig: "hashlib.sha256(data).hexdigest()", note: "Deterministic content fingerprint for duplicate detection." },
    { re: /\bDictReader\b|\bDictWriter\b/, sig: "csv.DictReader(f, skipinitialspace=True)", note: "Parses quoted CSV columns cleanly by header name." },
    { re: /\bjson\.loads\b|\burlencode\b/, sig: "json.loads(raw) & urlencode(params)", note: "Parses nested JSON payloads and encodes safe query strings." },
    { re: /\byield\b|\bnlargest\b/, sig: "yield item & heapq.nlargest(k, seq)", note: "Streams rows lazily in O(1) memory and keeps top-k values." },
    { re: /@dataclass|\bEnum\b/, sig: "@dataclass & field(default_factory=list)", note: "Typed record classes with safe per-instance mutable defaults." },
    { re: /\bunicodedata\.normalize\b/, sig: "unicodedata.normalize('NFKC', text)", note: "Normalizes non-breaking spaces and compatibility glyphs." },
    { re: /\bquantiles\b|\bmedian\b/, sig: "statistics.median() & quantiles(vals, n=4)", note: "Outlier-resistant center and interquartile range metrics." },
    { re: /\bdefaultdict\(int\)|WHERE\s+\w+\s*=\s*\?/, sig: "dict.get(key) & SQL '?' placeholders", note: "O(1) hash-index joins and parameterized query tuples." },
    { re: /\bbisect_right\b|\blru_cache\b/, sig: "bisect.bisect_right() & @lru_cache", note: "O(log N) sorted tier lookup and memoized function calls." }
  ];

  let worker = null;
  let runSeq = 0;
  let currentLessonKey = "01";
  let currentStageIdx = 0;
  let activeSampleStdin = "";
  let copyFlashTimer = null;

  function normalizeLessonKey(raw) {
    const s = String(raw || "").trim();
    if (!LESSON_KEY_RE.test(s)) return "01";
    const n = parseInt(s, 10);
    const k = n < 10 ? "0" + n : String(n);
    return Object.prototype.hasOwnProperty.call(LESSONS, k) ? k : "01";
  }

  function spawnWorker() {
    if (worker) {
      try { worker.terminate(); } catch (_e) {}
    }
    statusEl.classList.remove("ready");
    statusEl.textContent = "Initializing Python 3.12...";
    worker = new Worker("./worker.js");
    worker.onmessage = (ev) => {
      const d = ev.data || {};
      if (d.type === "status") {
        statusEl.textContent = String(d.detail || "Python 3.12");
        statusEl.classList.toggle("ready", d.status === "ready");
        return;
      }
      if (d.type === "result") {
        if (Number(d.runId) !== runSeq) return;
        timingEl.textContent = String(d.elapsedMs || 0) + " ms";
        const outTxt = String(d.stdout || "");
        const errTxt = String(d.stderr || "");
        if (d.ok) {
          outputEl.classList.remove("has-error");
          outputEl.textContent = outTxt || "(Program finished with zero printed output)";
        } else {
          outputEl.classList.add("has-error");
          outputEl.textContent = (outTxt ? outTxt + "\n\n" : "") + errTxt;
        }
      }
    };
    worker.onerror = (err) => {
      statusEl.classList.remove("ready");
      statusEl.textContent = "Worker error (click Stop Loop to reset)";
      outputEl.classList.add("has-error");
      outputEl.textContent = "Python worker failed to initialize: " + String(err && err.message ? err.message : "network or runtime error");
    };
    worker.postMessage({ type: "warmup" });
  }

  function deriveDocsEntries(lesson, stage) {
    if (Array.isArray(lesson.docsRef) && lesson.docsRef.length > 0) {
      return lesson.docsRef;
    }
    const src = String((stage && stage.code) || "") + "\n" + String(lesson.exercise || "");
    const matched = CODE_DOC_RULES.filter((r) => r.re.test(src)).slice(0, 4);
    if (matched.length < 3) {
      matched.push({
        sig: "print(f\"{label}: {value}\")",
        note: "Formats readable variables and expressions directly into output."
      });
    }
    return matched;
  }

  function deriveSampleSource(lessonKey, lesson, stage) {
    const explicit = (stage && stage.sampleSource) || lesson.sampleSource;
    const stageStdin = String((stage && stage.stdin) || "");
    if (explicit) {
      const useStdin = stageStdin || String(explicit.stdin || "");
      return {
        title: String(explicit.title || "Raw Sample Input / Receipt"),
        caption: String(explicit.caption || "Click Load into Test Inputs to populate stdin lines."),
        rawDisplay: stageStdin && stageStdin !== String(explicit.stdin || "")
          ? "Stage Test Lines:\n" + stageStdin.trimEnd()
          : String(explicit.rawDisplay || useStdin.trimEnd()),
        stdin: useStdin
      };
    }
    const fallbackStdin = stageStdin || ("sample_lesson_" + lessonKey + "\n100\n");
    return {
      title: "Lesson " + lessonKey + " Sample Input",
      caption: stageStdin
        ? "1 line per input() call for this stage."
        : "Optional stdin lines (load to test interactive input() calls).",
      rawDisplay: fallbackStdin.trimEnd(),
      stdin: fallbackStdin
    };
  }

  function renderDocsDrawer(lessonKey, lesson, stage) {
    if (!docsRefListEl || !sampleTitleEl || !sampleCaptionEl || !samplePreviewEl) return;
    docsRefListEl.textContent = "";
    const docsItems = deriveDocsEntries(lesson, stage);
    docsItems.forEach((entry) => {
      const li = document.createElement("li");
      const codeEl = document.createElement("code");
      codeEl.textContent = entry.sig;
      const sep = document.createTextNode(" — " + entry.note);
      li.append(codeEl, sep);
      docsRefListEl.appendChild(li);
    });
    const sample = deriveSampleSource(lessonKey, lesson, stage);
    activeSampleStdin = sample.stdin;
    sampleTitleEl.textContent = sample.title;
    sampleCaptionEl.textContent = sample.caption;
    samplePreviewEl.textContent = sample.rawDisplay;
    if (copySampleBtn) {
      copySampleBtn.classList.remove("loaded");
      copySampleBtn.textContent = "Load into Test Inputs";
    }
  }

  function renderGuide(lesson) {
    guideEl.textContent = "";
    const b1 = document.createElement("strong");
    b1.textContent = "Mental Model: ";
    const s1 = document.createElement("span");
    s1.textContent = lesson.analogy + "  ";
    const b2 = document.createElement("strong");
    b2.textContent = "Practice Goal: ";
    const s2 = document.createElement("span");
    s2.textContent = lesson.exercise;
    guideEl.append(b1, s1, b2, s2);
  }

  function loadStage(lessonKey, stageIdx) {
    const lesson = LESSONS[lessonKey];
    if (!lesson) return;
    runSeq += 1;
    const stages = lesson.stages || [];
    const idx = Math.max(0, Math.min(stages.length - 1, stageIdx));
    currentLessonKey = lessonKey;
    currentStageIdx = idx;
    const st = stages[idx];
    filenameEl.textContent = "lesson_" + lessonKey + ".py";
    editorEl.value = st.code;
    stdinEl.value = st.stdin || "";
    timingEl.textContent = "0 ms";
    outputEl.classList.remove("has-error");
    outputEl.textContent = 'Ready. Click "Run Python" (or press Ctrl+Enter) to execute.';

    stageTabsEl.textContent = "";
    stages.forEach((item, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "stage-btn" + (i === idx ? " active" : "");
      b.dataset.stageId = item.id;
      b.textContent = item.label;
      b.addEventListener("click", () => loadStage(lessonKey, i));
      stageTabsEl.appendChild(b);
    });
    renderGuide(lesson);
    renderDocsDrawer(lessonKey, lesson, st);
  }

  Object.keys(LESSONS).sort().forEach((k) => {
    const opt = document.createElement("option");
    opt.value = k;
    opt.textContent = LESSONS[k].title;
    pickerEl.appendChild(opt);
  });

  const initialLesson = normalizeLessonKey(params.get("lesson"));
  const rawStage = parseInt(params.get("stage") || "0", 10);
  const initialStage = Number.isFinite(rawStage) && rawStage >= 0 && rawStage < 10 ? rawStage : 0;
  pickerEl.value = initialLesson;
  loadStage(initialLesson, initialStage);
  spawnWorker();

  pickerEl.addEventListener("change", () => {
    const nextKey = normalizeLessonKey(pickerEl.value);
    const url = new URL(window.location.href);
    url.searchParams.set("lesson", nextKey);
    window.history.replaceState(null, "", url.toString());
    loadStage(nextKey, 0);
  });

  function runCurrentCode() {
    if (!worker) spawnWorker();
    runSeq += 1;
    outputEl.classList.remove("has-error");
    outputEl.textContent = "Running Python 3.12...";
    worker.postMessage({
      type: "run",
      runId: runSeq,
      code: editorEl.value,
      stdin: stdinEl.value,
    });
  }

  runBtn.addEventListener("click", runCurrentCode);
  editorEl.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      runCurrentCode();
    }
  });

  stopBtn.addEventListener("click", () => {
    runSeq += 1;
    spawnWorker();
    outputEl.classList.add("has-error");
    outputEl.textContent = "[Stopped] Worker terminated cleanly and reset to a fresh Python 3.12 runtime.";
  });

  resetBtn.addEventListener("click", () => {
    loadStage(currentLessonKey, currentStageIdx);
  });

  if (docsBtn && docsDrawer) {
    docsBtn.addEventListener("click", () => {
      docsDrawer.classList.toggle("open");
    });
  }

  if (copySampleBtn) {
    copySampleBtn.addEventListener("click", () => {
      stdinEl.value = activeSampleStdin;
      stdinEl.dispatchEvent(new Event("input", { bubbles: true }));
      copySampleBtn.classList.add("loaded");
      copySampleBtn.textContent = "Loaded into Test Inputs \u2713";
      if (copyFlashTimer) clearTimeout(copyFlashTimer);
      copyFlashTimer = setTimeout(() => {
        copySampleBtn.classList.remove("loaded");
        copySampleBtn.textContent = "Load into Test Inputs";
      }, 1800);
    });
  }

  vscodeBtn.addEventListener("click", () => {
    vscodeDrawer.classList.toggle("open");
  });

  if (params.get("docs") === "1" && docsDrawer) {
    docsDrawer.classList.add("open");
  }

  if (params.get("setup") === "1") {
    vscodeDrawer.classList.add("open");
  }

  if (params.get("autorun") === "1") {
    const scheduledLesson = currentLessonKey;
    const scheduledStage = currentStageIdx;
    setTimeout(() => {
      if (currentLessonKey === scheduledLesson && currentStageIdx === scheduledStage) {
        runCurrentCode();
      }
    }, 400);
  }
})();
