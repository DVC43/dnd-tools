
(async function(){
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  // --- UI elements ---
  const outputEl = $("#output");
  const toastEl = $("#toast");
  const raceField = $("#raceField");
  const classField = $("#classField");
  const professionField = $("#professionField");
  const alignmentField = $("#alignmentField");
  const intelligenceField = $("#intelligenceField");
  const monsterField = $("#monsterField");
  const monsterRoleModeField = $("#monsterRoleModeField");

  const raceSelect = $("#raceSelect");
  const classSelect = $("#classSelect");
  const professionSelect = $("#professionSelect");
  const professionCategorySelect = $("#professionCategorySelect");
  const professionSelectWrap = $("#professionSelectWrap");
  const professionDetails = $("#professionDetails");
  const alignmentSelect = $("#alignmentSelect");
  const intelligenceSelect = $("#intelligenceSelect");
  const monsterSelect = $("#monsterSelect");
  const monsterRoleMode = $("#monsterRoleMode");
  const epithetMode = $("#epithetMode");
  const npcTypeSelect = $("#npcTypeSelect");

  const generateBtn = $("#generateBtn");
  const clearBtn = $("#clearBtn");
  const ALIGNMENTS = ["LG","NG","CG","LN","N","CN","LE","NE","CE"];

  // --- Small helpers ---
  function toast(msg, ok=true){
    toastEl.textContent = msg;
    toastEl.style.borderColor = ok ? "rgba(52,211,153,.55)" : "rgba(251,113,133,.55)";
    toastEl.classList.add("show");
    setTimeout(()=>toastEl.classList.remove("show"), 1400);
  }

  function escapeHTML(s){
    return (s ?? "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

  function pick(arr, rng){
    if (!arr || arr.length === 0) return "";
    return arr[Math.floor(rng() * arr.length)];
  }

  function option(label, value){
    const o = document.createElement("option");
    o.value = value;
    o.textContent = label;
    return o;
  }

  function ensureNeverOption(selectEl){
    if (!selectEl) return;
    const existing = selectEl.querySelector('option[value="never"]');
    if (existing) return;
    const neverOpt = option("Never", "never");
    // place after Random if possible
    const randomOpt = selectEl.querySelector('option[value="random"]');
    if (randomOpt && randomOpt.nextSibling){
      selectEl.insertBefore(neverOpt, randomOpt.nextSibling);
    } else if (randomOpt){
      selectEl.appendChild(neverOpt);
    } else {
      selectEl.insertBefore(neverOpt, selectEl.firstChild);
    }
  }

  function removeNeverOption(selectEl){
    if (!selectEl) return;
    const existing = selectEl.querySelector('option[value="never"]');
    if (!existing) return;
    if (selectEl.value === "never") selectEl.value = "random";
    existing.remove();
  }

  function toBandFromInt(intScore){
    const n = Number(intScore);
    if (Number.isNaN(n)) return {id:"avg", label:"8–11 (Average)"};
    if (n <= 7) return {id:"low", label:"≤7 (Low / inarticulate)"};
    if (n <= 11) return {id:"avg", label:"8–11 (Average)"};
    if (n <= 15) return {id:"high", label:"12–15 (Principled)"};
    if (n <= 17) return {id:"vhigh", label:"16–17 (Personal philosophy)"};
    return {id:"genius", label:"18+ (Genius / philosopher)"};
  }

  const INT_BANDS = [
    {id:"random", label:"Random"},
    {id:"low", label:"≤7 (Low / inarticulate)"},
    {id:"avg", label:"8–11 (Average)"},
    {id:"high", label:"12–15 (Principled)"},
    {id:"vhigh", label:"16–17 (Personal philosophy)"},
    {id:"genius", label:"18+ (Genius / philosopher)"}
  ];

  function normalizeAlignment(raw, rng){
    const s = String(raw || "").trim().toUpperCase();
    if (ALIGNMENTS.includes(s)) return s;

    // Common monster-manual style buckets
    const evil = ["LE","NE","CE"];
    const good = ["LG","NG","CG"];
    const lawful = ["LG","LN","LE"];
    const chaotic = ["CG","CN","CE"];
    const nonGood = ["LN","N","CN","LE","NE","CE"];
    const nonEvil = ["LG","NG","CG","LN","N","CN"];
    const nonLawful = ["NG","CG","N","CN","NE","CE"];
    const nonChaotic = ["LG","NG","LN","N","LE","NE"];

    if (s === "ANY") return pick(ALIGNMENTS, rng);
    if (s === "ANY EVIL") return pick(evil, rng);
    if (s === "ANY GOOD") return pick(good, rng);
    if (s === "ANY LAWFUL") return pick(lawful, rng);
    if (s === "ANY CHAOTIC") return pick(chaotic, rng);
    if (s === "NOT GOOD") return pick(nonGood, rng);
    if (s === "NOT EVIL") return pick(nonEvil, rng);
    if (s === "NOT LAWFUL") return pick(nonLawful, rng);
    if (s === "NOT CHAOTIC") return pick(nonChaotic, rng);
    if (s === "UNCHANGED" || s === "UNALIGNED") return "N";

    // Slash or OR lists: "CG/NE" or "CG OR NE"
    const parts = s.replaceAll(" OR ", "/").split("/").map(x=>x.trim()).filter(Boolean);
    const valid = parts.filter(p => ALIGNMENTS.includes(p));
    if (valid.length) return pick(valid, rng);

    // Fall back
    return pick(ALIGNMENTS, rng);
  }

  function csvParse(text){
    // Minimal CSV parser with quotes
    const rows = [];
    let row = [];
    let cell = "";
    let inQuotes = false;

    for (let i=0;i<text.length;i++){
      const c = text[i];
      const next = text[i+1];

      if (inQuotes){
        if (c === '"' && next === '"'){
          cell += '"'; i++;
        } else if (c === '"'){
          inQuotes = false;
        } else {
          cell += c;
        }
      } else {
        if (c === '"'){
          inQuotes = true;
        } else if (c === ","){
          row.push(cell); cell = "";
        } else if (c === "\n"){
          row.push(cell); rows.push(row);
          row = []; cell = "";
        } else if (c === "\r"){
          // ignore
        } else {
          cell += c;
        }
      }
    }
    if (cell.length || row.length){
      row.push(cell);
      rows.push(row);
    }
    return rows;
  }

  function fillTemplate(str, ctx){
    return String(str).replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key) => {
      const v = ctx[key];
      return (v === undefined || v === null) ? `{${key}}` : String(v);
    });
  }

  function titleCase(s){
    return s.split(" ").map(w=>w ? w[0].toUpperCase()+w.slice(1) : w).join(" ");
  }

  // --- Load data ---
  async function loadJSON(path){
    const r = await fetch(path, {cache:"no-store"});
    if (!r.ok) throw new Error("Failed to load " + path);
    return await r.json();
  }
  async function loadText(path){
    const r = await fetch(path, {cache:"no-store"});
    if (!r.ok) throw new Error("Failed to load " + path);
    return await r.text();
  }

  const races = await loadJSON("data/races.json");
  const classes = await loadJSON("data/classes.json");
  const professionsCatalog = await loadJSON("data/professions_catalog.json");
  const fragments = await loadJSON("data/fragments.json");
  const namesData = await loadJSON("data/names.json");
  const alignmentData = await loadJSON("data/alignment_pools.json");

  // Professions: catalog (group -> category -> professions w/ details)
  const professionCategoryMap = {}; // categoryId -> {id,name,groupName,professions:[{id,name,detail}]}
  const professionById = {};        // professionId -> {id,name,detail,categoryId,categoryName,groupName}
  const allProfessions = [];        // flattened professions with category info

  (professionsCatalog.groups || []).forEach(group => {
    (group.categories || []).forEach(cat => {
      professionCategoryMap[cat.id] = {
        id: cat.id,
        name: cat.name,
        groupName: group.name,
        professions: cat.professions || []
      };
      (cat.professions || []).forEach(p => {
        const full = {
          id: p.id,
          name: p.name,
          detail: p.detail || "",
          categoryId: cat.id,
          categoryName: cat.name,
          groupName: group.name
        };
        professionById[p.id] = full;
        allProfessions.push(full);
      });
    });
  });

  // Monstrous CSV
  const monsterCSV = await loadText("data/monstrous_npcs.csv");
  const parsed = csvParse(monsterCSV);
  const header = parsed[0];
  const monsterRows = parsed.slice(1)
    .filter(r => r.length && r.some(x => String(x).trim().length))
    .map(r => Object.fromEntries(header.map((h, idx) => [h, r[idx] ?? ""])));

  // --- Populate selects ---
  function populate(){
    // Race
    raceSelect.innerHTML = "";
    raceSelect.appendChild(option("Random", "random"));
    races.forEach(r => raceSelect.appendChild(option(r.label, r.id)));

    // Class / Profession
    classSelect.innerHTML = "";
    classSelect.appendChild(option("Random", "random"));
    classes.forEach(c => classSelect.appendChild(option(c, c)));

    
    // Profession category -> profession (w/ details)
    if (professionCategorySelect){
      professionCategorySelect.innerHTML = "";
      professionCategorySelect.appendChild(option("Any category (random)", "any"));

      (professionsCatalog.groups || []).forEach(group => {
        const og = document.createElement("optgroup");
        og.label = group.name;
        (group.categories || []).forEach(cat => {
          og.appendChild(option(cat.name, cat.id));
        });
        professionCategorySelect.appendChild(og);
      });

      if (!professionCategorySelect.value) professionCategorySelect.value = "any";
    }

    // Profession list is populated based on category + mode (Monstrous can add "Never")
    if (professionSelect){
      professionSelect.innerHTML = "";
      professionSelect.appendChild(option("Random", "random"));
    }
// Alignment
    alignmentSelect.innerHTML = "";
    alignmentSelect.appendChild(option("Random", "random"));
    ALIGNMENTS.forEach(a => {
      const desc = alignmentData.descriptions?.[a] ? ` — ${alignmentData.descriptions[a].split("—")[0]}` : "";
      alignmentSelect.appendChild(option(a + desc, a));
    });

    // Intelligence
    intelligenceSelect.innerHTML = "";
    INT_BANDS.forEach(b => intelligenceSelect.appendChild(option(b.label, b.id)));

    // Monsters
    monsterSelect.innerHTML = "";
    monsterSelect.appendChild(option("Random", "random"));
    // sort by name
    const sorted = [...monsterRows].sort((a,b)=>String(a["Name"]||"").localeCompare(String(b["Name"]||"")));
    sorted.forEach(m => {
      const name = String(m["Name"]||"").trim();
      const type = String(m["Type"]||"").trim();
      const align = String(m["Align."]||"").trim();
      const intv = String(m["INT"]||"").trim();
      monsterSelect.appendChild(option(`${name} (${type}; ${align}; INT ${intv})`, name));
    });
  }
  populate();

  // --- UI: segmented control ---
  let npcType = "race_class";


  // --- Profession UI (category -> profession -> details) ---
  function allowNeverForProfession(){
    return (npcType === "monstrous" && monsterRoleMode && monsterRoleMode.value === "profession");
  }

  function professionsForCategory(catId){
    if (!catId || catId === "any") return [];
    return professionCategoryMap[catId]?.professions || [];
  }

  function rebuildProfessionSelectOptions(){
    if (!professionSelect || !professionCategorySelect) return;

    const catId = professionCategorySelect.value || "any";
    const allowNever = allowNeverForProfession();

    if (professionSelectWrap){
      professionSelectWrap.style.display = "";
    }

    professionSelect.innerHTML = "";
    professionSelect.appendChild(option("Random", "random"));
    if (allowNever){
      professionSelect.appendChild(option("Never", "never"));
    }

    const list = professionsForCategory(catId);
    if (list.length){
      list.forEach(p => {
        const d = String(p.detail || "").trim();
        const short = d.length > 72 ? (d.slice(0, 69) + "…") : d;
        professionSelect.appendChild(option(short ? `${p.name} — ${short}` : p.name, p.id));
      });
    } else {
      // In "any" category, you can still generate a random profession, but browsing is category-based.
      const hintOpt = option("— Pick a specific category to browse professions —", "hint");
      hintOpt.disabled = true;
      professionSelect.appendChild(hintOpt);
      professionSelect.value = "random";
    }

    updateProfessionDetailsUI();
  }

  function updateProfessionDetailsUI(){
    if (!professionDetails || !professionCategorySelect || !professionSelect) return;

    const catId = professionCategorySelect.value || "any";
    const sel = professionSelect.value;

    if (sel === "never"){
      professionDetails.style.display = "";
      professionDetails.innerHTML = `<b>No profession:</b> This monstrous NPC will be generated without a profession role.`;
      return;
    }

    if (sel === "random" || sel === "hint"){
      const pool = (catId && catId !== "any") ? professionsForCategory(catId) : allProfessions;
      const catName = (catId && catId !== "any") ? (professionCategoryMap[catId]?.name || catId) : "Any category";
      const examples = pool.length ? pool.slice(0, 3).map(p => escapeHTML(p.name)).join(", ") : "—";
      professionDetails.style.display = "";
      professionDetails.innerHTML = `<b>Random profession</b> from <b>${escapeHTML(catName)}</b> (${pool.length} options). <span style="color:var(--muted)">Examples:</span> ${examples}`;
      return;
    }

    const p = professionById[sel];
    if (!p){
      professionDetails.style.display = "none";
      professionDetails.innerHTML = "";
      return;
    }

    professionDetails.style.display = "";
    professionDetails.innerHTML =
      `<b>${escapeHTML(p.name)}</b><br>` +
      `<span style="color:var(--muted)"><b>Category:</b> ${escapeHTML(p.categoryName)} • ${escapeHTML(p.groupName)}</span><br/>` +
      `${escapeHTML(p.detail)}`;
  }

  if (professionCategorySelect){
    professionCategorySelect.addEventListener("change", rebuildProfessionSelectOptions);
  }
  if (professionSelect){
    professionSelect.addEventListener("change", updateProfessionDetailsUI);
  }

  function updateMonsterRoleVisibility(){
    if (npcType !== "monstrous") return;
    const mode = (monsterRoleMode && monsterRoleMode.value) ? monsterRoleMode.value : "class";
    classField.style.display = (mode === "class") ? "" : "none";
    professionField.style.display = (mode === "profession") ? "" : "none";
    rebuildProfessionSelectOptions();
  }

  function setNPCType(next){
    npcType = next;
    if (npcTypeSelect) npcTypeSelect.value = next;
    $$(".seg-btn").forEach(b => b.classList.toggle("active", b.dataset.npcType === next));

    const isRaceClass = next === "race_class";
    const isRaceProf = next === "race_profession";
    const isMon = next === "monstrous";

    raceField.style.display = isMon ? "none" : "";
    alignmentField.style.display = isMon ? "none" : "";
    intelligenceField.style.display = isMon ? "none" : "";
    monsterField.style.display = isMon ? "" : "none";
    monsterRoleModeField.style.display = isMon ? "" : "none";

    // Default visibility (race modes)
    classField.style.display = isRaceClass ? "" : "none";
    professionField.style.display = isRaceProf ? "" : "none";

    if (isMon){
      // Monstrous: choose whether we optionally add a class OR a profession.
      // Both dropdowns get a Monstrous-only "Never" option; only the chosen role-type is shown.
      ensureNeverOption(classSelect);
      updateMonsterRoleVisibility();
    } else {
      // In non-monstrous modes, role is required (Race+Class/Profession), so hide "Never"
      removeNeverOption(classSelect);
    }

    // Refresh profession options (adds/removes Monstrous-only "Never")
    rebuildProfessionSelectOptions();
  }

  if (npcTypeSelect){
    npcTypeSelect.addEventListener("change", () => setNPCType(npcTypeSelect.value));
  }
  // Legacy support (if segmented buttons exist)
  $$(".seg-btn").forEach(btn => btn.addEventListener("click", () => setNPCType(btn.dataset.npcType)));
  if (monsterRoleMode){
    monsterRoleMode.addEventListener("change", updateMonsterRoleVisibility);
  }
  setNPCType(npcTypeSelect ? npcTypeSelect.value : "race_class");
  rebuildProfessionSelectOptions();

  function getNamePoolForRace(raceId){
    const r = races.find(x => x.id === raceId);
    return r?.namePool || "human";
  }

  function makePersonName(alignment, raceId, rng){
    const poolKey = getNamePoolForRace(raceId);
    const pool = (namesData.namesByRace?.[poolKey] || namesData.names?.[poolKey] || namesData.namesByRace?.human || namesData.names?.human);
    const first = pick(pool.first, rng) || "Nameless";
    const last = pick(pool.last, rng) || "";
    const base = (last && !last.startsWith("of ")) ? `${first} ${last}` : `${first} ${last}`.trim();

    const mode = epithetMode.value;
    const roll = rng();
    const wantsEpithet =
      mode === "always" ? true :
      mode === "never" ? false :
      (roll < 0.35);

    if (!wantsEpithet) return base;

    const epiList = (namesData.epithetsByAlignment?.[alignment] || []);
    const epi = pick(epiList, rng) || pick(namesData.names?.monstrous?.last, rng) || "the Unnamed";
    // Epithet formatting: ensure "the ..." prefix
    const epithet = epi.startsWith("the ") ? epi : ("the " + epi);
    return `${base}, ${epithet}`;
  }

  
  function monsterTypeToNameSource(monster, rng){
    const name = String((monster && (monster["Name"] || monster.Name)) || "").trim();
    const typeRaw = String((monster && (monster["Type"] || monster.Type)) || "").trim();
    const typeLower = typeRaw.toLowerCase();

    // 1) Explicit overrides by creature name
    if (/hag/i.test(name)) return { kind: "flavor", key: "hag" };

    // 2) Fiend subtypes (the CSV often encodes these in Type)
    if (typeLower.includes("yugoloth")) return { kind: "flavor", key: "yugoloth" };
    if (typeLower.includes("devil")) return { kind: "flavor", key: "infernal" };
    if (typeLower.includes("demon")) return { kind: "flavor", key: "abyssal" };
    if (typeLower.includes("fiend")) return { kind: "flavor", key: "infernal" };

    // 3) Humanoid subtypes (Humanoid (Elf), Humanoid (Dwarf), etc.)
    if (typeLower.startsWith("humanoid")){
      const m = typeRaw.match(/\(([^)]+)\)/);
      if (m){
        const inner = m[1].trim();
        const innerLower = inner.toLowerCase();

        if (innerLower === "any race"){
          const keys = Object.keys(namesData.namesByRace || {}).filter(k => k !== "monstrous");
          const raceKey = pick(keys, rng) || "human";
          return { kind: "race", key: raceKey };
        }

        // If multiple tags exist (e.g., "Demon,Orc"), use the first tag.
        const tag = inner.split(",")[0].trim();
        const tagLower = tag.toLowerCase();

        const raceAlias = {
          "yuan-ti": "yuanti",
          "yuan ti": "yuanti",
          "yuanti": "yuanti",
          "half-orc": "orc",
          "halforc": "orc",
          "dragonborn": "dragonborn",
          "tiefling": "tiefling",
          "aasimar": "aasimar",
          "halfling": "halfling",
          "gnome": "gnome",
          "dwarf": "dwarf",
          "elf": "elf",
          "orc": "orc",
          "goblin": "goblin",
          "kobold": "kobold",
          "tabaxi": "tabaxi",
          "triton": "triton",
          "genasi": "genasi",
          "goliath": "goliath",
          "firbolg": "firbolg",
          "kenku": "kenku"
        };

        const mapped = raceAlias[tagLower];
        if (mapped && (namesData.namesByRace?.[mapped] || namesData.names?.[mapped])){
          return { kind: "race", key: mapped };
        }
      }
      return { kind: "flavor", key: "humanoid_monstrous" };
    }

    // 4) Monstrosity subtypes (Monstrosity (Yuan-Ti))
    if (typeLower.startsWith("monstrosity")){
      const m = typeRaw.match(/\(([^)]+)\)/);
      if (m){
        const tag = m[1].split(",")[0].trim().toLowerCase();
        if ((tag === "yuan-ti" || tag === "yuan ti" || tag === "yuanti") && (namesData.namesByRace?.yuanti || namesData.names?.yuanti)){
          return { kind: "race", key: "yuanti" };
        }
      }
      return { kind: "flavor", key: "monstrosity" };
    }

    // 5) Base type mapping
    const base = typeLower.split("(")[0].trim(); // e.g. "giant", "aberration"
    const typeMap = {
      "aberration": "aberrant",
      "beast": "bestial",
      "celestial": "celestial",
      "construct": "construct",
      "dragon": "draconic",
      "elemental": "elemental",
      "fey": "fey",
      "giant": "giantkin",
      "humanoid": "humanoid_monstrous",
      "monstrosity": "monstrosity",
      "ooze": "ooze",
      "plant": "plant",
      "undead": "undead"
    };

    const key = typeMap[base];
    if (key) return { kind: "flavor", key };

    // 6) Fallback: generic monstrous pool
    return { kind: "fallback", key: "monstrous" };
  }

  function makeMonsterPersonName(alignment, monster, rng){
    const src = monsterTypeToNameSource(monster, rng);

    let pool = null;
    let epiList = null;

    if (src.kind === "race"){
      pool = (namesData.namesByRace?.[src.key] || namesData.names?.[src.key] || namesData.namesByRace?.human || namesData.names?.human);
      epiList = (namesData.epithetsByAlignment?.[alignment] || []);
    } else if (src.kind === "flavor"){
      const flavor = namesData.monstrousNameFlavors?.[src.key];
      pool = flavor || namesData.names?.monstrous;
      epiList = (flavor && Array.isArray(flavor.epithets) && flavor.epithets.length)
        ? flavor.epithets
        : (namesData.epithetsByAlignment?.[alignment] || []);
    } else {
      pool = namesData.names?.monstrous;
      epiList = (namesData.epithetsByAlignment?.[alignment] || []);
    }

    const first = pick(pool?.first || [], rng) || "X";
    const last = pick(pool?.last || [], rng) || "";
    const base = (last ? `${first} ${last}` : first).trim();

    const mode = epithetMode.value;
    const roll = rng();
    const wantsEpithet =
      mode === "always" ? true :
      mode === "never" ? false :
      (roll < 0.55); // monsters a bit more likely

    if (!wantsEpithet) return base;

    const epiFallback = pick(namesData.names?.monstrous?.last || [], rng) || "the Unnamed";
    let epi = pick(epiList || [], rng) || pick(namesData.epithetsByAlignment?.[alignment] || [], rng) || epiFallback;

    // Normalize epithet formatting
    epi = String(epi || "").trim();
    let epithet = epi;
    const lower = epi.toLowerCase();
    if (!(lower.startsWith("the ") || lower.startsWith("of ") || lower.startsWith("of the "))){
      epithet = "the " + epi;
    }

    return `${base}, ${epithet}`;
  }


  function buildContext({raceLabel, roleLabel, alignment, monster} , rng){
    const ctx = {};
    // copy fragments
    Object.entries(fragments).forEach(([k, arr]) => { ctx[k] = pick(arr, rng); });
    ctx.city = pick(fragments.cities, rng);
    ctx.region = pick(fragments.regions, rng);
    ctx.faction = pick(fragments.factions, rng);
    ctx.order = pick(fragments.orders, rng);
    ctx.deity = pick(fragments.deities, rng);
    ctx.artifact = pick(fragments.artifacts, rng);
    ctx.threats = pick(fragments.threats, rng);
    ctx.vice = pick(fragments.vices, rng);
    ctx.virtue = pick(fragments.virtues, rng);
    ctx.stakes = pick(fragments.stakes, rng);

    ctx.race = raceLabel || "Unknown";
    ctx.role = roleLabel || "wanderer";
    if (monster){
      ctx.creature = monster["Name"] || "Monster";
      ctx.creatureType = monster["Type"] || "";
      ctx.size = monster["Size"] || "";
    }
    return ctx;
  }

  function pickFromPools(alignment, key, ctx, rng){
    const list = alignmentData.pools?.[alignment]?.[key] || [];
    return fillTemplate(pick(list, rng), ctx);
  }

  function buildFraming(alignment, bandId){
    // Framing comes from data/alignment_pools.json descriptions: text AFTER the em dash (—)
    const desc = (alignmentData && alignmentData.descriptions && alignmentData.descriptions[alignment]) ? alignmentData.descriptions[alignment] : "";
    let framingText = "";
    if (typeof desc === "string" && desc.length){
      const em = desc.indexOf("—");
      if (em !== -1) framingText = desc.slice(em + 1).trim();
      else {
        const hy = desc.indexOf(" - ");
        framingText = (hy !== -1) ? desc.slice(hy + 3).trim() : desc.trim();
      }
    }

    // Mind comes from data/alignment_pools.json (mind mapping by INT band)
    const mindMap = (alignmentData && (alignmentData.mind || alignmentData.minds)) ? (alignmentData.mind || alignmentData.minds) : {};
    const mind = (mindMap && mindMap[bandId]) ? mindMap[bandId] : "";

    return { axis: framingText, mind };
  }


  function renderNPC(npc){
    const card = document.createElement("article");
    card.className = "npc-card";
    card.dataset.npcId = npc.id;

    const metaBits = [];
    if (npc.race) metaBits.push(`<span class="badge">Race: <b>${escapeHTML(npc.race)}</b></span>`);
    if (npc.creature) metaBits.push(`<span class="badge">Creature: <b>${escapeHTML(npc.creature)}</b></span>`);
    if (npc.role) {
      const roleLabel = npc.roleKind ? `${npc.roleKind}: ${npc.role}` : npc.role;
      metaBits.push(`<span class="badge">Role: <b>${escapeHTML(roleLabel)}</b></span>`);
    }
    metaBits.push(`<span class="badge">Alignment: <b>${escapeHTML(npc.alignment)}</b></span>`);
    if (npc.intelligenceText) metaBits.push(`<span class="badge">INT: <b>${escapeHTML(npc.intelligenceText)}</b></span>`);

	// vice shown in UI as flaw
	// tell shown in UI as habit
    card.innerHTML = `
      <h3>${escapeHTML(npc.name)}</h3>
      <div class="meta">${metaBits.join(" ")}</div>
      <div class="framing"><b>Worldview:</b> ${escapeHTML(npc.framing.axis)}<br><span><b>Mentality:</b> ${escapeHTML(npc.framing.mind)}</span></div>
      ${npc.roleKind==="Profession" && npc.roleDetail ? `<div class="role-extra"><b>Profession category:</b> ${escapeHTML(npc.roleCategory)}<br><b>Profession detail:</b> ${escapeHTML(npc.roleDetail)}</div>` : ""}
      <ul>
        <li><b>Introduction<span class="qmark" title="Suggested first encounter scene with the NPC.">?</span>:</b> ${escapeHTML(npc.introduction || "")}</li>
        <li><b>Immediate goal<span class="qmark" title="What they want most now?">?</span>:</b> ${escapeHTML(npc.goal)}</li>
        <li><b>Bond<span class="qmark" title="Who/what matters most to them?">?</span>:</b> ${escapeHTML(npc.bond)}</li>
		<li><b>Fear<span class="qmark" title="What could break them?">?</span>:</b> ${escapeHTML(npc.fear)}</li>
        <li><b>Leverage<span class="qmark" title="What can be used to sway or manipulate them?">?</span>:</b> ${escapeHTML(npc.leverage)}</li>
        <li><b>Habit<span class="qmark" title="What is a habitual gesture or phrase they have?">?</span>:</b> ${escapeHTML(npc.tell)}</li>
        <li><b>Flaw<span class="qmark" title="What self-defeating flaw trips them up?">?</span>:</b> ${escapeHTML(npc.vice)}</li>
		<li><b>Complication<span class="qmark" title="How they could collide with the PCs?">?</span>:</b> ${escapeHTML(npc.complication)}</li>
      </ul>
      <div class="card-actions">
        <button type="button" data-action="download-html">Download .html</button>
      </div>
    `;
card.querySelector('[data-action="download-html"]').addEventListener("click", () => downloadHTML(card, npc));

    return card;
  }

  // Copy helpers removed: this build is intended for embedded contexts
  // (e.g., Google Sites) where clipboard APIs are often blocked.

  function cloneForExport(cardEl){
    const clone = cardEl.cloneNode(true);
    // Remove UI-only controls/icons from exports
    clone.querySelectorAll(".card-actions").forEach(el => el.remove());
    clone.querySelectorAll(".qmark").forEach(el => el.remove());
    return clone;
  }

  // cardToPlainText and copyText removed (unused with copy buttons stripped).

  function downloadHTML(cardEl, npc){
    const clone = cloneForExport(cardEl);
    const doc = `<!doctype html><meta charset="utf-8"><title>${escapeHTML(npc.name)}</title>` +
                `<body style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;">` +
                clone.outerHTML +
                `</body>`;
    const blob = new Blob([doc], {type:"text/html"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (npc.name || "npc").replace(/[^a-z0-9\- _]/gi,"_") + ".html";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // latestCard / copy-latest handlers removed.

  clearBtn.addEventListener("click", () => {
    outputEl.innerHTML = `<div class="empty">Generate an NPC to see output here.</div>`;
    toast("Cleared.");
  });

  // --- Generation logic ---
  function resolveRace(rng){
    const selected = raceSelect.value;
    if (selected === "random") return pick(races, rng);
    return races.find(r => r.id === selected) || pick(races, rng);
  }

  function resolveRole(kind, rng){
  // kind: "class" | "profession" | "either" | "optional"
  // UI determines the normal flow; `kind` is a defensive fallback.

  function pickRandomProfessionFull(catId){
    if (catId && catId !== "any" && professionCategoryMap[catId]?.professions?.length){
      const picked = pick(professionCategoryMap[catId].professions, rng);
      return professionById[picked.id] || null;
    }
    return pick(allProfessions, rng) || null;
  }

  function resolveProfessionRole(allowNever){
    const catId = (professionCategorySelect && professionCategorySelect.value) ? professionCategorySelect.value : "any";
    const sel = professionSelect ? professionSelect.value : "random";

    if (allowNever && sel === "never") return {kind:"", label:""};

    let p = null;
    if (sel === "random" || sel === "hint"){
      p = pickRandomProfessionFull(catId);
    } else {
      p = professionById[sel] || null;
    }

    if (!p){
      // last resort
      p = pickRandomProfessionFull("any");
    }

    return {
      kind: "Profession",
      label: p?.name || "",
      categoryName: p?.categoryName || "",
      groupName: p?.groupName || "",
      detail: p?.detail || ""
    };
  }

  if (npcType === "monstrous"){
    // Monstrous NPCs: optionally add ONE role, chosen by monsterRoleMode (Class or Profession).
    const mode = (monsterRoleMode && monsterRoleMode.value) ? monsterRoleMode.value : "class";

    if (mode === "class"){
      const c = classSelect.value;
      if (c === "never") return {kind:"", label:""};
      if (c === "random") return {kind:"Class", label: pick(classes, rng)};
      return {kind:"Class", label: c};
    } else {
      return resolveProfessionRole(true);
    }
  }

  if (npcType === "race_class"){
    const c = classSelect.value;
    if (c === "random") return {kind:"Class", label: pick(classes, rng)};
    return {kind:"Class", label: c};
  }

  if (npcType === "race_profession"){
    return resolveProfessionRole(false);
  }

  // Fallbacks (shouldn't happen)
  if (kind === "class") return {kind:"Class", label: pick(classes, rng)};
  if (kind === "profession"){
    const p = pick(allProfessions, rng);
    return {kind:"Profession", label: p?.name || "", categoryName: p?.categoryName || "", groupName: p?.groupName || "", detail: p?.detail || ""};
  }
  if (kind === "either"){
    return (rng() < 0.5)
      ? {kind:"Class", label: pick(classes, rng)}
      : (() => {
          const p = pick(allProfessions, rng);
          return {kind:"Profession", label: p?.name || "", categoryName: p?.categoryName || "", groupName: p?.groupName || "", detail: p?.detail || ""};
        })();
  }

  // optional
  if (rng() < 0.35) return {kind:"", label:""};
  return (rng() < 0.5)
    ? {kind:"Class", label: pick(classes, rng)}
    : (() => {
        const p = pick(allProfessions, rng);
        return {kind:"Profession", label: p?.name || "", categoryName: p?.categoryName || "", groupName: p?.groupName || "", detail: p?.detail || ""};
      })();
}

function resolveAlignment(rng){
    const a = alignmentSelect.value;
    if (a === "random") return pick(ALIGNMENTS, rng);
    return a;
  }

  function resolveIntBand(rng){
    const b = intelligenceSelect.value;
    if (b === "random") return pick(INT_BANDS.filter(x=>x.id!=="random"), rng).id;
    return b;
  }

  function pickMonster(rng){
    const selectedName = monsterSelect.value;
    if (selectedName === "random"){
      return pick(monsterRows, rng);
    }
    // Find by exact Name
    return monsterRows.find(m => String(m["Name"]||"").trim() === selectedName) || pick(monsterRows, rng);
  }

  function buildNPC(){
    const rng = Math.random;
    const id = "npc_" + Math.floor(rng()*1e9).toString(16);

    if (npcType === "monstrous"){
      const monster = pickMonster(rng);

      const alignment = normalizeAlignment(monster["Align."], rng);
      const intScore = Number(monster["INT"]);
      const band = toBandFromInt(intScore);
      const framing = buildFraming(alignment, band.id);

      const role = resolveRole("optional", rng);
      const roleLabel = role.label ? `${role.kind ? role.kind + ": " : ""}${role.label}` : "";

      const name = makeMonsterPersonName(alignment, monster, rng);
      const ctx = buildContext({alignment, roleLabel: role.label || "monster", monster}, rng);

      return {
        id,
        name,
        creature: monster["Name"] || "",
        race: "",
        roleKind: role.kind || "",
        role: role.label || "",
        roleCategory: role.categoryName || "",
        roleGroup: role.groupName || "",
        roleDetail: role.detail || "",
        alignment,
        intelligenceText: Number.isFinite(intScore) ? `${intScore} (${band.label})` : band.label,
        framing,
        vice: pickFromPools(alignment, "vice", ctx, rng),
        introduction: pickFromPools(alignment, "introduction", ctx, rng),
        goal: pickFromPools(alignment, "goal", ctx, rng),
        fear: pickFromPools(alignment, "fear", ctx, rng),
        bond: pickFromPools(alignment, "bond", ctx, rng),
        leverage: pickFromPools(alignment, "leverage", ctx, rng),
        tell: pickFromPools(alignment, "tell", ctx, rng),
        complication: pickFromPools(alignment, "complication", ctx, rng),
      };
    }

    // Race NPCs
    const race = resolveRace(rng);
    const role = resolveRole("either", rng);

    const alignment = resolveAlignment(rng);
    const bandId = resolveIntBand(rng);
    const framing = buildFraming(alignment, bandId);

    const name = makePersonName(alignment, race.id, rng);
    const ctx = buildContext({raceLabel: race.label, roleLabel: role.label, alignment}, rng);

    return {
      id,
      name,
      race: race.label,
      creature: "",
      roleKind: role.kind || "",
      role: role.label,
      roleCategory: role.categoryName || "",
      roleGroup: role.groupName || "",
      roleDetail: role.detail || "",
      alignment,
      intelligenceText: INT_BANDS.find(b=>b.id===bandId)?.label || "",
      framing,
      vice: pickFromPools(alignment, "vice", ctx, rng),
      introduction: pickFromPools(alignment, "introduction", ctx, rng),
      goal: pickFromPools(alignment, "goal", ctx, rng),
      fear: pickFromPools(alignment, "fear", ctx, rng),
      bond: pickFromPools(alignment, "bond", ctx, rng),
      leverage: pickFromPools(alignment, "leverage", ctx, rng),
      tell: pickFromPools(alignment, "tell", ctx, rng),
      complication: pickFromPools(alignment, "complication", ctx, rng),
    };
  }

  generateBtn.addEventListener("click", () => {
    const npc = buildNPC();
    const card = renderNPC(npc);

    // Clear empty placeholder if present
    const empty = outputEl.querySelector(".empty");
    if (empty) empty.remove();

    outputEl.appendChild(card);
    card.scrollIntoView({behavior:"smooth", block:"start"});
    toast("Generated.");
  });

})();