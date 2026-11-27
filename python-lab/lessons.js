window.FLOWBENCH_LESSONS = Object.freeze({
  "01": {
    "key": "01",
    "lessonNumber": 1,
    "lessonId": "py-m1-01-variables-types-and-smart-io",
    "moduleTitle": "Module 1: Core Python Foundations (Zero to Confident)",
    "title": "Python Course #1: Variables, Data Types & Smart Calculators (Zero to Real Code)",
    "analogy": "Think of a variable as a labeled glass jar—not a mystery math box—where the label tells you what it means and Python's type badge (str, int, float, bool) tells you what rules apply inside.",
    "quizPrompt": "Pause for 3 seconds: what does Python print when you evaluate '25' * 3 versus int('25') * 3?",
    "exercise": "Build a Freelance Hourly & Tax Estimator that reads hours worked and hourly rate via input(), deducts 15% tax, and prints gross pay, tax reserved, and net take-home to two decimals.",
    "expectedStdout": "total=$150.45|each=$37.61|dollars=37|rem=1|pow=8",
    "docsRef": [
      {
        "sig": "input(prompt) -> str",
        "note": "Always returns text — wrap in int() or float() for math."
      },
      {
        "sig": "type(obj) -> class badge",
        "note": "Inspects runtime data type (<class 'str'>, <class 'int'>, <class 'float'>, <class 'bool'>)."
      },
      {
        "sig": "x // y (floor division) & x % y (modulo remainder)",
        "note": "Splits whole units (hours/dollars) from leftover remainder."
      },
      {
        "sig": "f\"{val:.2f}\" (2-decimal currency formatting)",
        "note": "Rounds and pads float/Decimal numbers to two exact decimal places."
      }
    ],
    "sampleSource": {
      "title": "Table 7 Bistro Receipt (Raw Input)",
      "caption": "3 lines consumed in order by input(): dinner bill ($), tip percent (%), and diners.",
      "rawDisplay": "Receipt #T7 — Bistro Dinner\nDinner bill ($) : 127.50\nTip percent (%) : 18\nNumber of people: 4",
      "stdin": "127.50\n18\n4\n"
    },
    "stages": [
      {
        "id": "s1_vars",
        "label": "Stage 1: Variables & Types",
        "stdin": "",
        "code": "# Lesson 01 — Stage 1: Labeled Variables & the 4 Core Data Types\ndinner_bill = 127.50       # float  (decimal number)\ntip_percent = 18           # int    (whole number)\ndiners = 4                 # int    (headcount)\ntable_label = 'Table 7'    # str    (text in quotes)\nsplit_evenly = True        # bool   (True or False)\n\nprint('Label:', table_label, '->', type(table_label))\nprint('Bill :', dinner_bill, '->', type(dinner_bill))\nprint('Diners:', diners, '->', type(diners))\nprint('Split?:', split_evenly, '->', type(split_evenly))\n"
      },
      {
        "id": "s2_input_trap",
        "label": "Stage 2: input() String Trap",
        "stdin": "50\n10\n",
        "code": "# Lesson 01 — Stage 2: Why '50' + '10' Prints '5010' (and the 1-Word Fix)\nraw_bill = input('Enter bill ($): ').strip()\nraw_tip = input('Enter tip ($): ').strip()\n\n# TRAP: input() always returns text (str), so + glues text together!\nwrong_total = raw_bill + raw_tip\nprint('String trap :', repr(wrong_total))\n\n# FIX: Convert text into numbers with float() or int() before math\nclean_total = float(raw_bill) + float(raw_tip)\nprint(f'Numeric fix : ${clean_total:.2f}')\n"
      },
      {
        "id": "s3_calculator",
        "label": "Stage 3: Smart Bill Calculator",
        "stdin": "127.50\n18\n4\n",
        "code": "# Lesson 01 — Stage 3: Complete Smart Bill, Tip & Change Calculator\nbill = float(input('Dinner bill ($): ').strip())\ntip_pct = int(input('Tip percent (%): ').strip())\npeople = int(input('Number of people: ').strip())\n\ngrand_total = bill * (1 + tip_pct / 100)\neach_share = grand_total / people\nwhole_dollars = int(each_share) // 1\nextra_minutes_hours = 135 // 60\nextra_minutes_rem = 135 % 60\n\nprint(f'Grand total   : ${grand_total:.2f}')\nprint(f'Each pays     : ${each_share:.2f} (whole dollars: ${whole_dollars})')\nprint(f'135m duration : {extra_minutes_hours}h {extra_minutes_rem}m | 2**3 = {2 ** 3}')\n"
      },
      {
        "id": "s4_quiz",
        "label": "3s Quiz: '25' * 3",
        "stdin": "",
        "code": "# Predict BEFORE clicking Run: What is the difference between line A and line B?\ntext_value = '25'\n\nprint('Line A (str * 3):', text_value * 3)\nprint('Line B (int * 3):', int(text_value) * 3)\n"
      },
      {
        "id": "s5_challenge",
        "label": "Hands-On Challenge",
        "stdin": "32\n45.00\n",
        "code": "# CHALLENGE: Freelance Hourly & 15% Tax Estimator\n# Read hours worked and hourly rate via input(), reserve 15% tax,\n# and print gross, tax, and net formatted to 2 decimals.\nhours = float(input('Hours worked: ').strip())\nrate = float(input('Hourly rate ($): ').strip())\n\ngross = hours * rate\ntax = gross * 0.15\nnet = gross - tax\nprint(f'Gross: ${gross:.2f} | Tax (15%): ${tax:.2f} | Net: ${net:.2f}')\n"
      }
    ]
  },
  "02": {
    "key": "02",
    "lessonNumber": 2,
    "lessonId": "py-m1-02-conditionals-boolean-and-match",
    "moduleTitle": "Module 1: Core Python Foundations (Zero to Confident)",
    "title": "Python Course #2: if/elif/else, Boolean Logic & match-case Decision Engines",
    "analogy": "Think of if/elif/else like airport security lanes: each traveler enters the FIRST lane whose sign matches and skips all remaining lanes.",
    "quizPrompt": "Quick prediction: if score = 92 and you put `if score >= 60:` BEFORE `elif score >= 90:`, which grade gets printed?",
    "exercise": "Build a SaaS Plan & Tax Router using if/elif/else for discount tiers and match-case for region tax codes ('US', 'EU', 'VN', and fallback '_').",
    "expectedStdout": "VIP:10%:False PLUS:0%:False",
    "stages": [
      {
        "id": "s1_starter",
        "label": "Verified Lesson Code",
        "stdin": "",
        "code": "def tier_and_tax(spend: float, region: str) -> str:\n    if spend >= 100 and spend > 0:\n        tier = 'VIP'\n    elif spend >= 50:\n        tier = 'PLUS'\n    else:\n        tier = 'STD'\n    match region:\n        case 'US' | 'CA':\n            rate = 8\n        case 'VN':\n            rate = 10\n        case _:\n            rate = 0\n    return f'{tier}:{rate}%:{bool(\"\")}'\n\nprint(tier_and_tax(120.0, 'VN'), tier_and_tax(60.0, 'OTHER'))\n"
      }
    ]
  },
  "03": {
    "key": "03",
    "lessonNumber": 3,
    "lessonId": "py-m1-03-loops-iteration-and-enumerate",
    "moduleTitle": "Module 1: Core Python Foundations (Zero to Confident)",
    "title": "Python Course #3: for & while Loops, range(), enumerate() & Loop Control",
    "analogy": "A `for` loop is a conveyor belt processing every item on the tray; a `while` loop is a thermostat running until a target condition changes.",
    "quizPrompt": "Pause and predict: how many numbers does `list(range(2, 10, 3))` produce, and what is the last number?",
    "exercise": "Write a loan payoff simulator using a bounded `while` loop that applies monthly payments + interest, skips $0 holiday months via `continue`, and stops with `break` once paid off.",
    "expectedStdout": "1:Ops|3:QA 100 [2, 5, 8] 3",
    "stages": [
      {
        "id": "s1_starter",
        "label": "Verified Lesson Code",
        "stdin": "",
        "code": "names = ['Ops', 'Sales', 'QA']\nvals = [40, -1, 60]\ntotal = 0\nkept = []\nfor idx, (n, v) in enumerate(zip(names, vals), start=1):\n    if v < 0:\n        continue\n    total += v\n    kept.append(f'{idx}:{n}')\n    if total >= 100:\n        break\ntries = 0\nwhile tries < 3:\n    tries += 1\nprint('|'.join(kept), total, list(range(2, 10, 3)), tries)\n"
      }
    ]
  },
  "04": {
    "key": "04",
    "lessonNumber": 4,
    "lessonId": "py-m1-04-lists-tuples-slicing-comprehensions",
    "moduleTitle": "Module 1: Core Python Foundations (Zero to Confident)",
    "title": "Python Course #4: Lists, Tuples, Slicing & List Comprehensions",
    "analogy": "A list is a whiteboard checklist you can reorder and erase; a tuple is a laminated ID badge sealed the moment it is printed.",
    "quizPrompt": "Pause for 3 seconds: if `a = [1, 2, 3]`, `b = a`, and we run `b.append(4)`, what is `len(a)`?",
    "exercise": "Take raw response times `[120, -5, 340, 85, 910, 45, 210]`, filter out negative errors via a list comprehension, keep a safe copy, and return the top 3 fastest times plus median.",
    "expectedStdout": "orig_first=120|last=45|top2=45,85|len_copy=4",
    "stages": [
      {
        "id": "s1_starter",
        "label": "Verified Lesson Code",
        "stdin": "",
        "code": "raw = [120, -5, 340, 85, 45]\nclean = [ms for ms in raw if ms >= 0]\nsafe_copy = clean.copy()\ntop2 = sorted(clean)[:2]\nfirst, second = tuple(top2)\nprint(f'orig_first={raw[0]}|last={clean[-1]}|top2={first},{second}|len_copy={len(safe_copy)}')\n"
      }
    ]
  },
  "05": {
    "key": "05",
    "lessonNumber": 5,
    "lessonId": "py-m1-05-dictionaries-sets-and-o1-lookups",
    "moduleTitle": "Module 1: Core Python Foundations (Zero to Confident)",
    "title": "Python Course #5: Dictionaries, Sets & Instant O(1) Deduplication",
    "analogy": "Searching a list is walking down every hotel hallway knocking on doors; a dictionary or set is handing the front desk a room key to jump straight to the exact door in O(1) time.",
    "quizPrompt": "Quick check: what does `{}` create in Python — an empty set or an empty dictionary?",
    "exercise": "Given two signup lists and an opt-out list, normalize emails to lowercase, remove opt-outs via set subtraction, and count domain frequencies with `Counter`.",
    "expectedStdout": "['alice@co.com', 'dan@io.dev']|1|free|1",
    "stages": [
      {
        "id": "s1_starter",
        "label": "Verified Lesson Code",
        "stdin": "",
        "code": "from collections import Counter, defaultdict\nsignups = ['Alice@Co.com', 'bob@co.com', 'alice@co.com', 'dan@io.dev']\noptout = {'bob@co.com'}\nactive = sorted({e.lower() for e in signups} - optout)\ndomains = Counter(e.split('@')[1] for e in active)\ngroups = defaultdict(list)\nfor e in active:\n    groups[e.split('@')[1]].append(e)\nmeta = {'plan': 'pro'}\nprint(f\"{active}|{domains['co.com']}|{meta.get('tier', 'free')}|{len(groups['io.dev'])}\")\n"
      }
    ]
  },
  "06": {
    "key": "06",
    "lessonNumber": 6,
    "lessonId": "py-m2-06-functions-scope-typing-and-lambda",
    "moduleTitle": "Module 2: Clean Functions, Text Parsing, Exceptions & Testing",
    "title": "Python Course #6: Clean Functions, Type Hints, *args/**kwargs & lambda Sorting",
    "analogy": "A pure function is a coffee espresso machine: beans and water go in through parameters, espresso comes out via `return`—never `print`—without messing up the kitchen.",
    "quizPrompt": "Pause and predict: what happens if a function has NO `return` statement and you assign `result = my_func()`?",
    "exercise": "Write a typed `rank_deals(*deals, min_value: float = 100.0, **meta)` function that filters deals above `min_value` and returns them sorted descending via `key=lambda`.",
    "expectedStdout": "['a'] ['b'] ('p2', 35)",
    "stages": [
      {
        "id": "s1_starter",
        "label": "Verified Lesson Code",
        "stdin": "",
        "code": "def add_tag(tag: str, bucket: list[str] | None = None) -> list[str]:\n    if bucket is None:\n        bucket = []\n    bucket.append(tag)\n    return bucket\n\ndef rank_scores(*scores: int, bonus: int = 0, **meta: str) -> list[tuple[str, int]]:\n    items = [(f'p{i}', s + bonus) for i, s in enumerate(scores, 1)]\n    return sorted(items, key=lambda x: (-x[1], x[0]))\n\nprint(add_tag('a'), add_tag('b'), rank_scores(10, 30, 20, bonus=5, env='prod')[0])\n"
      }
    ]
  },
  "07": {
    "key": "07",
    "lessonNumber": 7,
    "lessonId": "py-m2-07-strings-and-regex-extraction",
    "moduleTitle": "Module 2: Clean Functions, Text Parsing, Exceptions & Testing",
    "title": "Python Course #7: String Methods & Readable Regex (`re.VERBOSE`) for Text Extraction",
    "analogy": "String methods (`.strip()`, `.split()`, `.partition()`) are kitchen knives for neat ingredients; `re.VERBOSE` regular expressions are precision cookie cutters stamped with comments.",
    "quizPrompt": "Pause and check: on `'<b>one</b><b>two</b>'`, what is the difference between matching `<.*>` versus `<.*?>`?",
    "exercise": "Write a `re.VERBOSE` parser that extracts `invoice_id`, `iso_date`, and `currency_amount` from messy multi-line email bodies and redacts card digits with `re.sub`.",
    "expectedStdout": "INV-2048 89.50 2 Paid-INV-2048",
    "stages": [
      {
        "id": "s1_starter",
        "label": "Verified Lesson Code",
        "stdin": "",
        "code": "import re\npat = re.compile(r'''\n    (?P<id>INV-\\d{4})\\s+.*?\\$(?P<amt>\\d+\\.\\d{2})\n''', re.VERBOSE)\ntxt = '  Paid INV-2048 Ref:[x] $89.50 card 4111-2222  '.strip()\nm = pat.search(txt)\nmasked = re.sub(r'\\d{4}-\\d{4}', 'XXXX-XXXX', txt)\nparts = '-'.join(masked.split()[:2])\nprint(m.group('id'), m.group('amt'), len(re.findall(r'<.*?>', '<a><b>')), parts)\n"
      }
    ]
  },
  "08": {
    "key": "08",
    "lessonNumber": 8,
    "lessonId": "py-m2-08-exceptions-tracebacks-and-validation",
    "moduleTitle": "Module 2: Clean Functions, Text Parsing, Exceptions & Testing",
    "title": "Python Course #8: try/except/else/finally, Tracebacks & Bulletproof Validation",
    "analogy": "Narrow `try/except` is a circuit breaker wired to one outlet so a toaster fault never plunges the whole building into darkness.",
    "quizPrompt": "Pause and think: why should `else:` be used instead of putting 10 extra lines of code inside the `try:` block?",
    "exercise": "Build `validate_orders(rows)` with a custom `OrderSchemaError` that returns `(valid_orders, quarantine_errors)` with exact row index and reason.",
    "expectedStdout": "8 ['2:ValueError', '3:OrderError'] 4",
    "stages": [
      {
        "id": "s1_starter",
        "label": "Verified Lesson Code",
        "stdin": "",
        "code": "class OrderError(Exception):\n    pass\n\ndef parse_qty(raw: str) -> int:\n    val = int(raw)\n    if val <= 0:\n        raise OrderError('non_positive')\n    return val\n\ngood, quarantine, cleanup = [], [], 0\nfor idx, item in enumerate(['3', 'bad', '-2', '5'], 1):\n    try:\n        q = parse_qty(item)\n    except (ValueError, OrderError) as exc:\n        quarantine.append(f'{idx}:{'OrderError' if isinstance(exc, OrderError) else 'ValueError'}')\n    else:\n        good.append(q)\n    finally:\n        cleanup += 1\nprint(sum(good), quarantine, cleanup)\n"
      }
    ]
  },
  "09": {
    "key": "09",
    "lessonNumber": 9,
    "lessonId": "py-m2-09-unit-testing-and-edge-cases",
    "moduleTitle": "Module 2: Clean Functions, Text Parsing, Exceptions & Testing",
    "title": "Python Course #9: Automated Unit Tests, Edge Cases & Bug-Proof Code",
    "analogy": "Unit tests are automated crash-test dummies strapped to every function so any future edit sounds an alarm in 0.05 seconds before shipping.",
    "quizPrompt": "Quick question: why does `assert (0.1 + 0.2) == 0.3` fail immediately in a Python test suite?",
    "exercise": "Write a 6-case table-driven test suite for `calculate_shipping(weight_kg, country)` verifying zero, boundary `5.0`, heavy `50.0`, and negative-weight `ValueError`.",
    "expectedStdout": "passed=3|raised=True",
    "stages": [
      {
        "id": "s1_starter",
        "label": "Verified Lesson Code",
        "stdin": "",
        "code": "import math\nfrom decimal import Decimal\n\ndef apply_discount(price: Decimal, pct: int) -> Decimal:\n    if pct < 0 or pct > 80:\n        raise ValueError('bad pct')\n    return (price * Decimal(100 - pct) / Decimal(100)).quantize(Decimal('0.01'))\n\ncases = [(Decimal('100.00'), 0, Decimal('100.00')), (Decimal('49.99'), 20, Decimal('39.99')), (Decimal('0.00'), 50, Decimal('0.00'))]\nfor price, pct, exp in cases:\n    assert apply_discount(price, pct) == exp\nassert math.isclose(0.1 + 0.2, 0.3, rel_tol=1e-9)\nraised = False\ntry:\n    apply_discount(Decimal('10.00'), 95)\nexcept ValueError:\n    raised = True\nassert raised\nprint(f'passed={len(cases)}|raised={raised}')\n"
      }
    ]
  },
  "10": {
    "key": "10",
    "lessonNumber": 10,
    "lessonId": "py-m2-10-modules-stdlib-venv-and-cli",
    "moduleTitle": "Module 2: Clean Functions, Text Parsing, Exceptions & Testing",
    "title": "Python Course #10: Modules, Standard Library Tour, `venv`/`pip` & CLI Flags",
    "analogy": "A virtual environment (`venv`) is a clean, isolated kitchen counter per recipe so spicy chili from Project A never contaminates vanilla cake in Project B.",
    "quizPrompt": "Pause for 3 seconds: why does naming your own file `csv.py` immediately break `import csv` with `AttributeError`?",
    "exercise": "Build a CLI KPI & SLA Reporter module guarded by `if __name__ == '__main__':` that computes UTC SLA deadlines and prints mean vs median ticket resolution minutes.",
    "expectedStdout": "2026-11-27T08:00Z|med=20|mean=50",
    "stages": [
      {
        "id": "s1_starter",
        "label": "Verified Lesson Code",
        "stdin": "",
        "code": "from datetime import datetime, timedelta, timezone\nimport statistics\n\ndef kpi_summary(start_iso: str, mins: list[int]) -> str:\n    dt0 = datetime.fromisoformat(start_iso).astimezone(timezone.utc)\n    due = dt0 + timedelta(hours=24)\n    return f\"{due.strftime('%Y-%m-%dT%H:%MZ')}|med={statistics.median(mins)}|mean={statistics.mean(mins)}\"\n\nif __name__ == '__main__':\n    print(kpi_summary('2026-11-26T08:00:00+00:00', [10, 15, 20, 25, 180]))\n"
      }
    ]
  },
  "11": {
    "key": "11",
    "lessonNumber": 11,
    "lessonId": "py-m3-11-file-io-utf8-and-paths",
    "moduleTitle": "Module 3: Real-World Files, Excel/CSV, APIs, Streaming & OOP",
    "title": "Python Course #11: File I/O (`with open`), UTF-8 Encoding & Cross-Platform Paths",
    "analogy": "A `with` context manager is an automatic spring-loaded door: even if someone trips halfway through the doorway (an exception), the door still closes cleanly behind them.",
    "quizPrompt": "Pause and predict: if two files have DIFFERENT names (`invoice_final.pdf` and `copy_2.pdf`) but identical bytes, are their SHA-256 hashes identical?",
    "exercise": "Write a pure `plan_folder_cleanup(file_entries)` planner that groups filenames by lowercase extension, skips SHA-256 duplicates, and returns a deterministic dry-run rename plan.",
    "expectedStdout": "report_q1.pdf:2cf24dba|notes.md:486ea462",
    "stages": [
      {
        "id": "s1_starter",
        "label": "Verified Lesson Code",
        "stdin": "",
        "code": "import hashlib, io\n\nraw_stream = '\\ufeffreport_q1.PDF|hello\\ncopy.pdf|hello\\nnotes.MD|world\\n'\nseen_hashes = set()\nkept = []\nwith io.StringIO(raw_stream) as buf:\n    clean_text = buf.getvalue().lstrip('\\ufeff')\nfor line in clean_text.strip().splitlines():\n    name, body = line.split('|', 1)\n    stem, dot, ext = name.rpartition('.')\n    digest = hashlib.sha256(body.encode('utf-8')).hexdigest()[:8]\n    if digest in seen_hashes:\n        continue\n    seen_hashes.add(digest)\n    kept.append(f'{stem.lower()}.{ext.lower()}:{digest}')\nprint('|'.join(kept))\n"
      }
    ]
  },
  "12": {
    "key": "12",
    "lessonNumber": 12,
    "lessonId": "py-m3-12-excel-csv-and-decimal-automation",
    "moduleTitle": "Module 3: Real-World Files, Excel/CSV, APIs, Streaming & OOP",
    "title": "Python Course #12: Automate Messy Excel & CSV Reports (`csv` & Exact `Decimal` Math)",
    "analogy": "Binary `float` is a stretchy rubber ruler that drifts by tiny fractions; `decimal.Decimal` is a steel accounting ledger locked to exact base-10 pennies.",
    "quizPrompt": "Pause for 3 seconds: what happens in standard `csv.DictReader` when there is a single space right after a comma before a quoted field like `, \"$1,200.50\"`?",
    "exercise": "Extend the cleaner to compute a 10% tax column with `ROUND_HALF_UP`, include valid row counts per department, and output the top 3 departments via `csv.DictWriter`.",
    "expectedStdout": "Ops,115.03 [4]",
    "stages": [
      {
        "id": "s1_starter",
        "label": "Verified Lesson Code",
        "stdin": "",
        "code": "import csv, io\nfrom collections import defaultdict\nfrom decimal import Decimal, InvalidOperation, ROUND_HALF_UP\n\nraw = ' vendor , dept , amount \\n\"Acme, Inc.\", Ops , \"$1,200.50\"\\nGamma, Ops , (50.25)\\nBad, Sales , N/A\\n'\ntotals = defaultdict(Decimal)\nquarantine = []\nfor line_no, r in enumerate(csv.DictReader(io.StringIO(raw), skipinitialspace=True), start=2):\n    row = {k.strip().lower(): (v or '').strip() for k, v in r.items() if k}\n    s = row['amount'].replace('$', '').replace(',', '')\n    neg = s.startswith('(') and s.endswith(')')\n    s = s[1:-1].strip() if neg else s\n    try:\n        val = Decimal(s)\n        totals[row['dept']] += (-val if neg else val)\n    except InvalidOperation:\n        quarantine.append(line_no)\nout = io.StringIO()\nw = csv.DictWriter(out, fieldnames=['dept', 'tax'])\nw.writeheader()\ntax = (totals['Ops'] * Decimal('0.10')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)\nw.writerow({'dept': 'Ops', 'tax': f'{tax:.2f}'})\nprint(out.getvalue().strip().splitlines()[1], quarantine)\n"
      }
    ]
  },
  "13": {
    "key": "13",
    "lessonNumber": 13,
    "lessonId": "py-m3-13-json-webhooks-and-rest-apis",
    "moduleTitle": "Module 3: Real-World Files, Excel/CSV, APIs, Streaming & OOP",
    "title": "Python Course #13: Nested JSON, REST API Payloads & Safe URL Builders",
    "analogy": "JSON is universal shipping-container foam: nested dicts and lists pack cleanly into UTF-8 text across any language, as long as you unpack optional boxes gently.",
    "quizPrompt": "Pause and spot the bug: if `payload = {'customer': None}`, why does `payload.get('customer', {}).get('email')` STILL crash with `AttributeError`?",
    "exercise": "Flatten a 3-order nested webhook payload (including one `customer: null` order) into normalized rows, verify its HMAC-SHA256 header, and emit a `urlencode` pagination link.",
    "expectedStdout": "o1:UNK:Ax2 q=R%26D+100%25&page=2 True",
    "stages": [
      {
        "id": "s1_starter",
        "label": "Verified Lesson Code",
        "stdin": "",
        "code": "import hashlib, hmac, json\nfrom urllib.parse import urlencode\n\nraw = json.dumps({'orders': [{'id': 'o1', 'customer': None, 'line_items': [{'sku': 'A', 'qty': 2}]}]})\ndoc = json.loads(raw)\nflattened = []\nfor o in doc.get('orders') or []:\n    country = (o.get('customer') or {}).get('country') or 'UNK'\n    for li in o.get('line_items') or []:\n        flattened.append(f\"{o['id']}:{country}:{li['sku']}x{li['qty']}\")\nq = urlencode({'q': 'R&D 100%', 'page': 2})\nsig = hmac.new(b'k', raw.encode(), hashlib.sha256).hexdigest()\nok = hmac.compare_digest(sig, sig)\nprint(flattened[0], q, ok)\n"
      }
    ]
  },
  "14": {
    "key": "14",
    "lessonNumber": 14,
    "lessonId": "py-m3-14-generators-itertools-and-streaming",
    "moduleTitle": "Module 3: Real-World Files, Excel/CSV, APIs, Streaming & OOP",
    "title": "Python Course #14: Generators (`yield`), `itertools` & `heapq` for Million-Row Data",
    "analogy": "A list is filling a swimming pool before washing one dish; a generator (`yield`) is turning on the kitchen faucet so water flows one cup at a time on demand.",
    "quizPrompt": "Pause and predict: if `gen = (x * 2 for x in [1, 2, 3])` and you call `sum(gen)` TWICE in a row, what does the second `sum(gen)` return?",
    "exercise": "Chain three generator stages (`parse_line -> only_500_errors -> extract_latency`) and return the top 3 slowest requests via `heapq.nlargest`.",
    "expectedStdout": "420 [880, 310] 0 [('a', 2), ('b', 1)]",
    "stages": [
      {
        "id": "s1_starter",
        "label": "Verified Lesson Code",
        "stdin": "",
        "code": "import heapq, itertools\n\ndef stream_latencies(rows):\n    for r in rows:\n        code, ms = r.split(':')\n        if code == '500':\n            yield int(ms)\n\nsample = ['200:15', '500:420', '500:190', '200:12', '500:880', '500:310']\ngen = stream_latencies(sample)\nfirst = next(gen)\nrest_top2 = heapq.nlargest(2, itertools.islice(gen, 10))\nexhausted_sum = sum(gen)\ngroups = [(k, len(list(g))) for k, g in itertools.groupby(sorted(['a', 'b', 'a']))]\nprint(first, rest_top2, exhausted_sum, groups)\n"
      }
    ]
  },
  "15": {
    "key": "15",
    "lessonNumber": 15,
    "lessonId": "py-m3-15-oop-classes-dataclasses-and-enums",
    "moduleTitle": "Module 3: Real-World Files, Excel/CSV, APIs, Streaming & OOP",
    "title": "Python Course #15: Classes, `@dataclass` & `Enum` Without Boilerplate",
    "analogy": "A raw dictionary is a sticky note where anyone can misspell field names; a `@dataclass` with `Enum` is a molded control panel where only valid switches fit.",
    "quizPrompt": "Pause and check: why does Python's `@dataclass` explicitly reject `tags: list[str] = []` with a `ValueError` at import time?",
    "exercise": "Build an `Invoice` `@dataclass` composed of `LineItem` objects and an `InvoiceStatus(Enum)` that blocks transitioning `DRAFT` directly to `PAID`.",
    "expectedStdout": "demo-01 live 0",
    "stages": [
      {
        "id": "s1_starter",
        "label": "Verified Lesson Code",
        "stdin": "",
        "code": "from dataclasses import dataclass, field\nfrom enum import Enum\n\nclass Status(Enum):\n    DRAFT = 'draft'\n    REVIEW = 'review'\n    LIVE = 'live'\n\n@dataclass\nclass Job:\n    slug: str\n    status: Status = Status.DRAFT\n    notes: list[str] = field(default_factory=list)\n\n    def __post_init__(self) -> None:\n        if not self.slug.strip():\n            raise ValueError('empty slug')\n\n    def advance(self, nxt: Status) -> None:\n        allowed = {Status.DRAFT: Status.REVIEW, Status.REVIEW: Status.LIVE}\n        if allowed.get(self.status) != nxt:\n            raise ValueError('bad transition')\n        self.status = nxt\n\nj = Job('demo-01')\nj.notes.append('ok')\nj.advance(Status.REVIEW)\nj.advance(Status.LIVE)\nprint(j.slug, j.status.value, len(Job('demo-02').notes))\n"
      }
    ]
  },
  "16": {
    "key": "16",
    "lessonNumber": 16,
    "lessonId": "py-m4-16-html-table-extraction-to-markdown",
    "moduleTitle": "Module 4: Web/Report Automation, Data Modeling, Algorithms & AI Capstone",
    "title": "Python Course #16: Extract HTML Tables & Clean Markdown Briefs in Pure Python",
    "analogy": "HTML markup is scaffolding around a building; structured parsing strips the scaffolding cleanly while keeping every room and column intact.",
    "quizPrompt": "Pause and check: what happens to a 3-column Markdown table row if a product title contains `Pro | Annual` and you forget to escape `|`?",
    "exercise": "Parse an HTML table containing `\\xa0` spaces and a `'Starter | Free'` plan cell into both a pipe-safe Markdown table and CSV.",
    "expectedStdout": "| Pro \\| Team | $29 |",
    "stages": [
      {
        "id": "s1_starter",
        "label": "Verified Lesson Code",
        "stdin": "",
        "code": "import re, unicodedata\n\nhtml = '<tr><th>Plan</th><th>Price</th></tr><tr><td>Pro | Team</td><td>$29</td></tr>'\nrows = []\nfor tr in re.findall(r'<tr>(.*?)</tr>', html):\n    cells = []\n    for raw_c in re.findall(r'<t[hd]>(.*?)</t[hd]>', tr):\n        clean = ' '.join(unicodedata.normalize('NFKC', raw_c).split()).replace('|', r'\\|')\n        cells.append(clean)\n    rows.append('| ' + ' | '.join(cells) + ' |')\nsep = '| --- | --- |'\nout = [rows[0], sep, *rows[1:]]\nprint(out[2])\n"
      }
    ]
  },
  "17": {
    "key": "17",
    "lessonNumber": 17,
    "lessonId": "py-m4-17-automated-kpi-and-executive-reports",
    "moduleTitle": "Module 4: Web/Report Automation, Data Modeling, Algorithms & AI Capstone",
    "title": "Python Course #17: Auto-Generate Executive KPI Dashboards & Anomaly Alerts",
    "analogy": "Arithmetic mean is a balance beam easily tipped by one boulder on the end; median + quartiles show where the real crowd actually stands.",
    "quizPrompt": "Pause and predict: what happens if a new product cohort has only `1` order so far and you call `statistics.stdev([49.0])` without checking `len`?",
    "exercise": "Compute `mean`, `median`, `Q1/Q3`, and `IQR` outliers across 10 daily revenue numbers and render a 3-row Markdown KPI summary.",
    "expectedStdout": "KPI med=49.0 mean=102.8 outliers=[490] sd1=0.0",
    "stages": [
      {
        "id": "s1_starter",
        "label": "Verified Lesson Code",
        "stdin": "",
        "code": "import statistics, textwrap\n\nvals = [40, 42, 45, 48, 50, 52, 55, 490]\nq1, q2, q3 = statistics.quantiles(vals, n=4)\niqr = q3 - q1\noutliers = [v for v in vals if v > q3 + 1.5 * iqr]\nsd_single = statistics.stdev([10]) if len([10]) >= 2 else 0.0\nbrief = textwrap.dedent(f'KPI med={q2:.1f} mean={statistics.mean(vals):.1f} outliers={outliers} sd1={sd_single}')\nprint(brief.strip())\n"
      }
    ]
  },
  "18": {
    "key": "18",
    "lessonNumber": 18,
    "lessonId": "py-m4-18-relational-tables-joins-and-safe-queries",
    "moduleTitle": "Module 4: Web/Report Automation, Data Modeling, Algorithms & AI Capstone",
    "title": "Python Course #18: Relational Data Joins, Indexing & SQL-Injection-Safe Queries",
    "analogy": "A primary-key index is a library call-number catalog; parameterized `?` placeholders are locked mail slots that treat user text strictly as data, never executable commands.",
    "quizPrompt": "Pause and think: if 3 paid invoices belong to a deleted `customer_id`, what happens to your total revenue in an INNER JOIN versus a LEFT JOIN?",
    "exercise": "Left-join an `orders` table against `customers`, flag any order whose `customer_id` is missing as `'ORPHAN'`, and return plan totals plus a parameterized SQL insert tuple.",
    "expectedStdout": "50 20 ['x2'] True",
    "stages": [
      {
        "id": "s1_starter",
        "label": "Verified Lesson Code",
        "stdin": "",
        "code": "from collections import defaultdict\n\ndef left_join_orders(customers, orders):\n    cust_index = {c['id']: c for c in customers}\n    by_plan = defaultdict(int)\n    orphans = []\n    for o in orders:\n        cust = cust_index.get(o['cid'])\n        if cust is None:\n            orphans.append(o['oid'])\n            by_plan['ORPHAN'] += o['amt']\n        else:\n            by_plan[cust['plan']] += o['amt']\n    sql_pair = ('SELECT id FROM customers WHERE email = ?', ('a@b.com',))\n    return dict(by_plan), orphans, '?' in sql_pair[0]\n\nres, orph, has_q = left_join_orders([{'id': 1, 'plan': 'pro'}], [{'oid': 'x1', 'cid': 1, 'amt': 50}, {'oid': 'x2', 'cid': 99, 'amt': 20}])\nprint(res['pro'], res['ORPHAN'], orph, has_q)\n"
      }
    ]
  },
  "19": {
    "key": "19",
    "lessonNumber": 19,
    "lessonId": "py-m4-19-big-o-bisect-and-lru-cache",
    "moduleTitle": "Module 4: Web/Report Automation, Data Modeling, Algorithms & AI Capstone",
    "title": "Python Course #19: Make Slow Python 1,000x Faster (`Big-O`, `bisect` & `@lru_cache`)",
    "analogy": "Linear scan `O(N)` flips every page of a 1,000-page dictionary from Page 1; binary search `bisect` `O(log N)` opens the middle and halves the book in just 10 flips.",
    "quizPrompt": "Pause and guess: to find 1 item among 1,000,000 sorted rows, roughly how many comparisons does `bisect` need at most — 20, 1,000, or 500,000?",
    "exercise": "Build a `volume_tier(units)` lookup using `bisect_right` over `[10, 100, 1000]` and cache `compound_rebate(tier, months)` with `@lru_cache`, printing `.cache_info().hits`.",
    "expectedStdout": "STARTER SCALE 55 True",
    "stages": [
      {
        "id": "s1_starter",
        "label": "Verified Lesson Code",
        "stdin": "",
        "code": "import bisect, functools\n\nBREAKS = [10, 100, 1000]\nTIERS = ['STARTER', 'GROWTH', 'SCALE', 'ENTERPRISE']\n\ndef get_tier(units: int) -> str:\n    return TIERS[bisect.bisect_right(BREAKS, units)]\n\n@functools.lru_cache(maxsize=128)\ndef rebate_schedule(n: int) -> int:\n    return n if n < 2 else rebate_schedule(n - 1) + rebate_schedule(n - 2)\n\nval = rebate_schedule(10)\n_ = rebate_schedule(10)\ninfo = rebate_schedule.cache_info()\nprint(get_tier(9), get_tier(100), val, info.hits > 0)\n"
      }
    ]
  },
  "20": {
    "key": "20",
    "lessonNumber": 20,
    "lessonId": "py-m4-20-capstone-python-and-ai-ops-pipeline",
    "moduleTitle": "Module 4: Web/Report Automation, Data Modeling, Algorithms & AI Capstone",
    "title": "Python Course #20 (Capstone): End-to-End Operations & AI Briefing Pipeline",
    "analogy": "Python is your deterministic flight computer handling exact math and safety checks; the AI model is the narrator reading your verified cockpit instrument panel.",
    "quizPrompt": "Final capstone check: why should you NEVER ask an LLM to sum 500 invoice rows directly when Python can compute `Decimal` totals in 1 millisecond first?",
    "exercise": "Extend the capstone pipeline with region-level breakdown, `1.5 * IQR` anomaly flags, and a `--dry-run` Markdown executive summary alongside the SHA-256 receipt.",
    "expectedStdout": "220.00 99.50 [5] 12",
    "stages": [
      {
        "id": "s1_starter",
        "label": "Verified Lesson Code",
        "stdin": "",
        "code": "import csv, dataclasses, hashlib, io, json, statistics\nfrom collections import defaultdict\nfrom decimal import Decimal, InvalidOperation\n\n@dataclasses.dataclass\nclass Tx:\n    dept: str\n    amount: Decimal\n\nraw = 'dept,amount\\nOps,120.50\\nSales,80.00\\nOps,99.50\\nBad,N/A\\n'\nvalid, quarantine = [], []\nfor idx, r in enumerate(csv.DictReader(io.StringIO(raw)), start=2):\n    try:\n        valid.append(Tx(r['dept'].strip(), Decimal(r['amount'].strip())))\n    except InvalidOperation:\n        quarantine.append(idx)\nby_dept = defaultdict(Decimal)\nfor tx in valid:\n    by_dept[tx.dept] += tx.amount\npayload = {\n    'totals': {k: f'{v:.2f}' for k, v in sorted(by_dept.items())},\n    'median': f\"{statistics.median([float(t.amount) for t in valid]):.2f}\",\n    'quarantineLines': quarantine,\n}\nblob = json.dumps(payload, sort_keys=True, separators=(',', ':'))\nreceipt = hashlib.sha256(blob.encode('utf-8')).hexdigest()[:12]\nprint(payload['totals']['Ops'], payload['median'], quarantine, len(receipt))\n"
      }
    ]
  }
});
