// Fantasy Item Backstory Generator (static, seedable, tag-aware)
// No build step. Designed for GitHub Pages.
//
// Data lives in /data/*.json

const $ = (sel) => document.querySelector(sel);
const el = (tag, attrs = {}, children = []) => {
  const n = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") n.className = v;
    else if (k === "html") n.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") n.addEventListener(k.slice(2), v);
    else if (v !== undefined && v !== null) n.setAttribute(k, v);
  });
  for (const c of children) n.append(c);
  return n;
};

// ---------- Seedable RNG ----------
function xmur3(str) {
  // string -> 32-bit seed
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}
function mulberry32(a) {
  return function () {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function makeRng(seedStr) {
  const seedFn = xmur3(seedStr);
  return mulberry32(seedFn());
}
function randomSeed() {
  // short-ish friendly seed
  const words = ["ash","storm","thorn","candle","salt","moon","hollow","vigil","ember","glass","oath","quiet","veil","tide"];
  const w1 = words[Math.floor(Math.random() * words.length)];
  const w2 = words[Math.floor(Math.random() * words.length)];
  const n = Math.floor(Math.random() * 9999);
  return `${w1}-${w2}-${n}`;
}

// ---------- Weighted choice with tag/tone boosting ----------
function boostedWeight(entry, selectedTags, selectedTone) {
  const base = entry.weight ?? 1;
  let w = base;

  const entryTags = new Set(entry.tags ?? []);
  const entryTones = new Set(entry.tone ?? []);

  // Boost if matches selected tags
  let tagHits = 0;
  for (const t of selectedTags) {
    if (entryTags.has(t)) tagHits++;
  }
  if (tagHits > 0) w *= 1 + Math.min(0.9, tagHits * 0.25); // up to +90%

  // Softly downweight if entry has tone specified and doesn't include chosen tone
  if (entryTones.size > 0 && selectedTone && !entryTones.has(selectedTone)) {
    w *= 0.55;
  }

  // Optional excludes
  if (entry.excludes) {
    for (const ex of entry.excludes) {
      if (selectedTags.includes(ex)) return 0;
    }
  }
  return Math.max(0, w);
}

function weightedPick(rng, arr, weightFn) {
  const weights = arr.map((e) => Math.max(0, weightFn(e)));
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum <= 0) {
    // fallback: uniform
    return arr[Math.floor(rng() * arr.length)];
  }
  let roll = rng() * sum;
  for (let i = 0; i < arr.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return arr[i];
  }
  return arr[arr.length - 1];
}

// ---------- Token replacement ----------
function formatText(text, tokens) {
  return text
    .replaceAll("{place}", tokens.place)
    .replaceAll("{faction}", tokens.faction)
    .replaceAll("{maker}", tokens.maker)
    .replaceAll("{event}", tokens.event)
    .replaceAll("{Place}", tokens.place)
    .replaceAll("{Faction}", tokens.faction)
    .replaceAll("{Maker}", tokens.maker)
    .replaceAll("{Event}", tokens.event);
}

// ---------- Name generation ----------
function pickFrom(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}
function titleCase(s) {
  return s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1));
}
function makeName(rng, namesData, tokens) {
  const tpl = weightedPick(rng, namesData.templates, (e) => e.weight ?? 1);
  const parts = namesData.parts;

  const ctx = {
    Adj: pickFrom(rng, parts.Adj),
    Noun: pickFrom(rng, parts.Noun),
    Verb: pickFrom(rng, parts.Verb),
    PlaceThing: pickFrom(rng, parts.PlaceThing),
    Place: tokens.place,
    Maker: tokens.maker
  };

  let name = tpl.text;
  for (const [k, v] of Object.entries(ctx)) {
    name = name.replaceAll(`{${k}}`, v);
  }
  // polish double spaces
  name = name.replace(/\s+/g, " ").trim();
  return titleCase(name);
}

// ---------- Length profiles ----------
const LENGTH_PROFILES = {
  short: {
    include: ["origin", "purpose", "history_event"],
    hookExtraChance: 0.0,
    makerExtraChance: 0.0
  },
  medium: {
    include: ["origin", "creator", "purpose", "history_event", "quirk"],
    hookExtraChance: 0.0,
    makerExtraChance: 0.25
  },
  long: {
    include: ["origin", "creator", "purpose", "history_event", "quirk"],
    hookExtraChance: 0.25,
    makerExtraChance: 0.5
  }
};

// ---------- App state ----------
const STORAGE_KEY = "itemBackstoryGen_v1";
let DATA = null;

let state = {
  itemType: "wondrous",
  tone: "mysterious",
  tags: [],
  length: "medium",
  seed: "",
  include: { hook: true, makerDetails: true, boon: true, complication: false },
  locks: {
    name: false,
    origin: false,
    creator: false,
    purpose: false,
    history_event: false,
    hook: false,
    quirk: false,
    boon: false,
    complication: false,
    tokens: false
  },
  last: null // last generated output object
};

// ---------- Persistence ----------
function saveState() {
  const safe = JSON.parse(JSON.stringify(state));
  // Avoid saving bulky raw data
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
}
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const obj = JSON.parse(raw);
    state = { ...state, ...obj };
  } catch {
    // ignore
  }
}

// ---------- Data loading ----------
async function loadJson(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}
async function loadAllData() {
  const [
    tags, itemTypes, tones, names, tokens,
    origin, creator, purpose, history_event, hook, quirk, boon, complication
  ] = await Promise.all([
    loadJson("./data/tags.json"),
    loadJson("./data/item_types.json"),
    loadJson("./data/tones.json"),
    loadJson("./data/names.json"),
    loadJson("./data/tokens.json"),
    loadJson("./data/origin.json"),
    loadJson("./data/creator.json"),
    loadJson("./data/purpose.json"),
    loadJson("./data/history_event.json"),
    loadJson("./data/hook.json"),
    loadJson("./data/quirk.json"),
    loadJson("./data/boon.json"),
    loadJson("./data/complication.json")
  ]);

  return {
    tags, itemTypes, tones, names, tokens,
    tables: {
      origin: origin.origin,
      creator: creator.creator,
      purpose: purpose.purpose,
      history_event: history_event.history_event,
      hook: hook.hook,
      quirk: quirk.quirk,
      boon: boon.boon,
      complication: complication.complication
    }
  };
}

// ---------- Generator ----------
function chooseTokens(rng, tokensData) {
  return {
    place: pickFrom(rng, tokensData.places),
    faction: pickFrom(rng, tokensData.factions),
    maker: pickFrom(rng, tokensData.makers),
    event: pickFrom(rng, tokensData.events)
  };
}

function generateSection(rng, key, table, selectedTags, selectedTone, tokens) {
  const entry = weightedPick(rng, table, (e) => boostedWeight(e, selectedTags, selectedTone));
  return {
    id: entry.id ?? null,
    text: formatText(entry.text, tokens),
    tags: entry.tags ?? [],
    tone: entry.tone ?? []
  };
}

function computeIncludedSections() {
  const profile = LENGTH_PROFILES[state.length] ?? LENGTH_PROFILES.medium;
  const keys = new Set(profile.include);

  // toggles adjust inclusion
  if (state.include.hook) keys.add("hook");
  if (!state.include.makerDetails) keys.delete("creator");

  // "long" may add an extra hook line, handled at render/export time
  if (state.include.boon) keys.add("boon");
  if (state.include.complication) keys.add("complication");

  return Array.from(keys);
}

function buildOutput({ rng, useExistingTokens = false }) {
  const selectedTags = state.tags;
  const selectedTone = state.tone;

  const out = state.last ? JSON.parse(JSON.stringify(state.last)) : null;

  // tokens
  const tokens = (state.locks.tokens && out && out.tokens) || useExistingTokens
    ? (out?.tokens ?? chooseTokens(rng, DATA.tokens))
    : chooseTokens(rng, DATA.tokens);

  // name
  const name =
    (state.locks.name && out?.name) ? out.name : makeName(rng, DATA.names, tokens);

  // sections
  const included = computeIncludedSections();

  const sections = out?.sections ? { ...out.sections } : {};
  for (const key of included) {
    if (state.locks[key] && sections[key]) continue;
    sections[key] = generateSection(rng, key, DATA.tables[key], selectedTags, selectedTone, tokens);
  }

  // If something was previously generated but is no longer included, keep it in state.last
  // (so locks won't break), but mark not-included at render/export time.
  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    seed: state.seed,
    itemType: state.itemType,
    tone: state.tone,
    tags: [...state.tags],
    length: state.length,
    include: { ...state.include },
    tokens,
    name,
    sections
  };
}

// ---------- Render ----------
const SECTION_LABELS = {
  origin: "Origin",
  creator: "Creator",
  purpose: "Purpose",
  history_event: "History",
  hook: "Plot Hook",
  quirk: "Quirk",
  boon: "Minor Boon",
  complication: "Curse / Complication"
};

function isSectionIncluded(key) {
  return computeIncludedSections().includes(key);
}

function render(output) {
  state.last = output;
  saveState();

  $("#outName").textContent = output.name;
  $("#outType").textContent = labelFor(DATA.itemTypes.item_types, output.itemType);
  $("#outTone").textContent = labelFor(DATA.tones.tones, output.tone);

  // pills
  const pillRow = $("#pillRow");
  pillRow.innerHTML = "";
  pillRow.append(
    el("span", { class: "pill" }, [document.createTextNode(`Seed: ${output.seed || "random"}`)]),
    el("span", { class: "pill" }, [document.createTextNode(`Place: ${output.tokens.place}`)]),
    el("span", { class: "pill" }, [document.createTextNode(`Event: ${output.tokens.event}`)])
  );

  // sections
  const container = $("#sections");
  container.innerHTML = "";

  const order = ["origin","creator","purpose","history_event","hook","quirk","boon","complication"];
  for (const key of order) {
    if (!output.sections[key]) continue;
    if (!isSectionIncluded(key)) continue;

    const sec = output.sections[key];
    const lockId = `lock_${key}`;

    const lockCheckbox = el("input", {
      type: "checkbox",
      id: lockId,
      ...(state.locks[key] ? { checked: "" } : {})
    });
    lockCheckbox.addEventListener("change", () => {
      state.locks[key] = lockCheckbox.checked;
      saveState();
    });

    container.append(
      el("div", { class: "section" }, [
        el("div", { class: "section-title" }, [
          el("h4", {}, [document.createTextNode(SECTION_LABELS[key] ?? key)]),
          el("label", { class: "lock", for: lockId }, [
            lockCheckbox,
            document.createTextNode("Lock")
          ])
        ]),
        el("p", {}, [document.createTextNode(sec.text)])
      ])
    );
  }

  // raw json
  $("#rawJson").textContent = JSON.stringify(output, null, 2);
}

function labelFor(list, id) {
  const found = list.find((x) => x.id === id);
  return found ? found.label : id;
}

// ---------- Export / Copy ----------
function toMarkdown(output) {
  // Foundry-friendly: simple markdown with headings + bold labels
  const lines = [];
  lines.push(`# ${output.name}`);
  lines.push(`**Type:** ${labelFor(DATA.itemTypes.item_types, output.itemType)}  `);
  lines.push(`**Tone:** ${labelFor(DATA.tones.tones, output.tone)}  `);
  if (output.tags.length) {
    lines.push(`**Themes:** ${output.tags.map(t => labelFor(DATA.tags.tags, t)).join(", ")}  `);
  }
  lines.push(`**Seed:** ${output.seed || "random"}  `);
  lines.push("");
  lines.push(`**Tokens:** Place: ${output.tokens.place} • Faction: ${output.tokens.faction} • Maker: ${output.tokens.maker} • Event: ${output.tokens.event}`);
  lines.push("");

  const order = ["origin","creator","purpose","history_event","hook","quirk","boon","complication"];
  for (const key of order) {
    if (!output.sections[key]) continue;
    if (!isSectionIncluded(key)) continue;
    lines.push(`## ${SECTION_LABELS[key] ?? key}`);
    lines.push(output.sections[key].text);
    lines.push("");
  }
  return lines.join("\n").trim() + "\n";
}

function toPlainText(output) {
  const md = toMarkdown(output);
  // simple markdown -> plain-ish
  return md
    .replace(/^#\s+/gm, "")
    .replace(/^##\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .trim() + "\n";
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    flashButton($("#btnCopy"), "Copied!");
  } catch {
    // fallback
    const ta = el("textarea", { style: "position:fixed;left:-9999px;top:-9999px;" });
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    flashButton($("#btnCopy"), "Copied!");
  }
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = el("a", { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function flashButton(btn, label) {
  const old = btn.textContent;
  btn.textContent = label;
  setTimeout(() => (btn.textContent = old), 900);
}

// ---------- UI wiring ----------
function syncControlsToState() {
  $("#itemType").value = state.itemType;
  $("#tone").value = state.tone;
  $("#length").value = state.length;
  $("#seed").value = state.seed ?? "";

  $("#incHook").checked = !!state.include.hook;
  $("#incMakerDetails").checked = !!state.include.makerDetails;
  $("#incBoon").checked = !!state.include.boon;
  $("#incComplication").checked = !!state.include.complication;
}

function readControlsIntoState() {
  state.itemType = $("#itemType").value;
  state.tone = $("#tone").value;
  state.length = $("#length").value;
  state.seed = ($("#seed").value || "").trim();

  state.include.hook = $("#incHook").checked;
  state.include.makerDetails = $("#incMakerDetails").checked;
  state.include.boon = $("#incBoon").checked;
  state.include.complication = $("#incComplication").checked;

  // tags from checkbox list
  const tags = [];
  document.querySelectorAll('input[name="tagCheck"]').forEach((c) => {
    if (c.checked) tags.push(c.value);
  });
  state.tags = tags;
}

function buildTagList() {
  const tagList = $("#tagList");
  tagList.innerHTML = "";
  for (const t of DATA.tags.tags) {
    const id = `tag_${t.id}`;
    const cb = el("input", {
      type: "checkbox",
      name: "tagCheck",
      id,
      value: t.id
    });
    cb.checked = state.tags.includes(t.id);
    cb.addEventListener("change", () => {
      readControlsIntoState();
      saveState();
    });

    const chip = el("label", { class: "tag", for: id }, [
      cb,
      document.createTextNode(t.label)
    ]);
    tagList.append(chip);
  }
}

function buildSelect(selectEl, list, currentId) {
  selectEl.innerHTML = "";
  for (const opt of list) {
    selectEl.append(el("option", { value: opt.id }, [document.createTextNode(opt.label)]));
  }
  selectEl.value = currentId;
}

function generate({ mode }) {
  readControlsIntoState();

  // handle seed rules
  if (!state.seed) {
    state.seed = randomSeed();
    $("#seed").value = state.seed;
  } else if (mode === "new-seed") {
    // If user provided a seed, keep it. If blank, we already set one above.
  }

  const rng = makeRng(state.seed + "|" + state.itemType + "|" + state.tone + "|" + state.tags.join(",") + "|" + state.length);

  // build output; mode controls how we respect existing tokens/locks
  const output = buildOutput({
    rng,
    useExistingTokens: mode === "same-seed"
  });

  render(output);
}

function rerollUnlocked() {
  readControlsIntoState();
  // New seed to create fresh output, while respecting locks.
  // If the user typed a seed, we keep it but perturb with a suffix unless they want deterministic behavior.
  // We'll always generate a new derived seed and display it, so sharing is easy.
  const baseSeed = state.seed || randomSeed();
  const newSeed = baseSeed + "-r" + Math.floor(Math.random() * 9999);
  state.seed = newSeed;
  $("#seed").value = state.seed;

  const rng = makeRng(state.seed + "|" + state.itemType + "|" + state.tone + "|" + state.tags.join(",") + "|" + state.length);
  const output = buildOutput({ rng, useExistingTokens: false });
  render(output);
}

function rerollSameSeed() {
  readControlsIntoState();
  if (!state.seed) {
    state.seed = randomSeed();
    $("#seed").value = state.seed;
  }
  const rng = makeRng(state.seed + "|" + state.itemType + "|" + state.tone + "|" + state.tags.join(",") + "|" + state.length);
  const output = buildOutput({ rng, useExistingTokens: true });
  render(output);
}

// ---------- Init ----------
async function init() {
  loadState();
  DATA = await loadAllData();

  buildSelect($("#itemType"), DATA.itemTypes.item_types, state.itemType);
  buildSelect($("#tone"), DATA.tones.tones, state.tone);
  syncControlsToState();
  buildTagList();

  // wire control events
  $("#itemType").addEventListener("change", () => { readControlsIntoState(); saveState(); });
  $("#tone").addEventListener("change", () => { readControlsIntoState(); saveState(); });
  $("#length").addEventListener("change", () => { readControlsIntoState(); saveState(); });
  $("#seed").addEventListener("input", () => { readControlsIntoState(); saveState(); });

  $("#incHook").addEventListener("change", () => { readControlsIntoState(); saveState(); });
  $("#incMakerDetails").addEventListener("change", () => { readControlsIntoState(); saveState(); });
  $("#incBoon").addEventListener("change", () => { readControlsIntoState(); saveState(); });
  $("#incComplication").addEventListener("change", () => { readControlsIntoState(); saveState(); });

  $("#btnGenerate").addEventListener("click", () => generate({ mode: "new" }));
  $("#btnRerollUnlocked").addEventListener("click", () => rerollUnlocked());
  $("#btnRerollSameSeed").addEventListener("click", () => rerollSameSeed());

  $("#btnCopy").addEventListener("click", async () => {
    if (!state.last) return;
    await copyToClipboard(toPlainText(state.last));
  });

  $("#btnExportMd").addEventListener("click", () => {
    if (!state.last) return;
    downloadText(`${safeFileName(state.last.name)}.md`, toMarkdown(state.last));
  });

  $("#btnExportJson").addEventListener("click", () => {
    if (!state.last) return;
    downloadText(`${safeFileName(state.last.name)}.json`, JSON.stringify(state.last, null, 2));
  });

  // Restore previous output if present
  if (state.last) {
    // ensure seed field matches
    $("#seed").value = state.seed ?? "";
    render(state.last);
  } else {
    // generate a first item
    generate({ mode: "new" });
  }
}

function safeFileName(name) {
  return (name || "item")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

init().catch((err) => {
  console.error(err);
  alert("Failed to load generator data. If you're opening index.html directly, try running a local server so fetch() works.");
});
