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
  const vscodeBtn = document.getElementById("toggle-vscode-btn");
  const vscodeDrawer = document.getElementById("vscode-drawer");

  let worker = null;
  let runSeq = 0;
  let currentLessonKey = "01";
  let currentStageIdx = 0;

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

  vscodeBtn.addEventListener("click", () => {
    vscodeDrawer.classList.toggle("open");
  });

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
