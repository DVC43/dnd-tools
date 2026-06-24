(() => {
  "use strict";

  const GROUP_STEALTH_STORE_KEY = "groupStealthCalculatorState_v1";

  const leaderMod = document.getElementById("leaderMod");
  const pb = document.getElementById("pb");
  const partySize = document.getElementById("partySize");
  const enemyDC = document.getElementById("enemyDC");
  const sitA = document.getElementById("sitA");
  const sitB = document.getElementById("sitB");
  const useCappedAdjustments = document.getElementById("useCappedAdjustments");
  const rolled = document.getElementById("rolled");
  const rolledTotal = document.getElementById("rolledTotal");
  const diffPassive = document.getElementById("diffPassive");
  const diffRolled = document.getElementById("diffRolled");
  const kpiSituational = document.getElementById("kpiSituational");
  const kpiSituationalNote = document.getElementById("kpiSituationalNote");
  const kpiGroupAdj = document.getElementById("kpiGroupAdj");
  const kpiGroupAdjNote = document.getElementById("kpiGroupAdjNote");
  const kpiGroupAdjRaw = document.getElementById("kpiGroupAdjRaw");
  const kpiAdjustedMod = document.getElementById("kpiAdjustedMod");
  const kpiPassive = document.getElementById("kpiPassive");
  const outPassive = document.getElementById("outPassive");
  const outRolled = document.getElementById("outRolled");
  const partyBody = document.getElementById("partyBody");
  const resetBtn = document.getElementById("groupStealthResetBtn");
  let cachedMemberStates = [];

  if (
    !leaderMod ||
    !pb ||
    !partySize ||
    !enemyDC ||
    !sitA ||
    !sitB ||
    !useCappedAdjustments ||
    !rolled ||
    !rolledTotal ||
    !diffPassive ||
    !diffRolled ||
    !kpiSituational ||
    !kpiSituationalNote ||
    !kpiGroupAdj ||
    !kpiGroupAdjNote ||
    !kpiGroupAdjRaw ||
    !kpiAdjustedMod ||
    !kpiPassive ||
    !outPassive ||
    !outRolled ||
    !partyBody
  ) {
    return;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function getInt(value, fallback) {
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  function situationalValue(value) {
    if (value === "Advantage") {
      return 5;
    }

    if (value === "Disadvantage") {
      return -5;
    }

    return 0;
  }

  function formatSigned(value) {
    return `${value >= 0 ? "+" : ""}${value}`;
  }

  function outcomeLabel(delta) {
    if (delta >= 0) {
      return { text: "Good (hidden)", cls: "ok" };
    }

    if (delta > -5) {
      return { text: "Mediocre (suspicious)", cls: "warn" };
    }

    return { text: "Bad (spotted)", cls: "danger" };
  }

  function defaultMemberState(index) {
    return {
      name: `Member ${index + 1}`,
      proficient: true,
      heavyArmor: false
    };
  }

  function rowStateFromTr(tr, index) {
    const nameInput = tr.querySelector(".member-name");
    const proficientInput = tr.querySelector(".member-proficient");
    const heavyArmorInput = tr.querySelector(".member-heavy");

    return {
      name: nameInput ? nameInput.value : defaultMemberState(index).name,
      proficient: proficientInput ? proficientInput.checked : true,
      heavyArmor: heavyArmorInput ? heavyArmorInput.checked : false
    };
  }

  function getMemberStates() {
    return Array.from(partyBody.querySelectorAll("tr")).map((tr, index) => rowStateFromTr(tr, index));
  }

  function ensureCachedMemberStates(size) {
    for (let index = 0; index < size; index += 1) {
      if (!cachedMemberStates[index]) {
        cachedMemberStates[index] = defaultMemberState(index);
      }
    }
  }

  function syncCacheFromRows() {
    const visibleStates = getMemberStates();
    visibleStates.forEach((state, index) => {
      cachedMemberStates[index] = state;
    });
  }

  function buildCell(label, className) {
    const td = document.createElement("td");
    td.dataset.label = label;
    if (className) {
      td.className = className;
    }
    return td;
  }

  function buildPartyRows(size, existingStates = []) {
    partyBody.innerHTML = "";

    for (let index = 0; index < size; index += 1) {
      const state = existingStates[index] || defaultMemberState(index);
      const tr = document.createElement("tr");

      const indexCell = buildCell("#");
      indexCell.textContent = String(index + 1);

      const nameCell = buildCell("Name");
      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.className = "member-name";
      nameInput.value = state.name;
      nameInput.setAttribute("aria-label", `Party member ${index + 1} name`);
      nameCell.appendChild(nameInput);

      const proficientCell = buildCell("Stealth Proficient", "member-prof-cell");
      const proficientWrap = document.createElement("div");
      proficientWrap.className = "checkbox-wrap";
      const proficientInput = document.createElement("input");
      proficientInput.type = "checkbox";
      proficientInput.className = "checkbox member-proficient";
      proficientInput.checked = state.proficient;
      proficientInput.setAttribute("aria-label", `Party member ${index + 1} stealth proficient`);
      proficientWrap.appendChild(proficientInput);
      proficientCell.appendChild(proficientWrap);

      const heavyArmorCell = buildCell("Heavy Armor", "member-heavy-cell");
      const heavyArmorWrap = document.createElement("div");
      heavyArmorWrap.className = "checkbox-wrap";
      const heavyArmorInput = document.createElement("input");
      heavyArmorInput.type = "checkbox";
      heavyArmorInput.className = "checkbox member-heavy";
      heavyArmorInput.checked = state.heavyArmor;
      heavyArmorInput.setAttribute("aria-label", `Party member ${index + 1} heavy armor`);
      heavyArmorWrap.appendChild(heavyArmorInput);
      heavyArmorCell.appendChild(heavyArmorWrap);

      const profAdjCell = buildCell("Prof. Adj", "member-prof-adj");
      const armorAdjCell = buildCell("Armor / Disadv.", "member-armor-adj");
      const netAdjCell = buildCell("Net Member Adj", "member-net-adj");

      tr.appendChild(indexCell);
      tr.appendChild(nameCell);
      tr.appendChild(proficientCell);
      tr.appendChild(heavyArmorCell);
      tr.appendChild(profAdjCell);
      tr.appendChild(armorAdjCell);
      tr.appendChild(netAdjCell);

      partyBody.appendChild(tr);
    }
  }

  function updateOutcomePill(element, delta) {
    const outcome = outcomeLabel(delta);
    element.textContent = outcome.text;
    element.className = `pill ${outcome.cls}`;
    return outcome.cls;
  }

  function compute() {
    const size = clamp(getInt(partySize.value, 1), 1, 12);
    syncCacheFromRows();
    ensureCachedMemberStates(size);

    if (partyBody.children.length !== size) {
      buildPartyRows(size, cachedMemberStates);
    }
    partySize.value = String(size);

    const proficiencyBonus = getInt(pb.value, 3);
    const nonProficientPenalty = Math.floor(proficiencyBonus / 2);
    const useCaps = useCappedAdjustments.value !== "false";
    let rawGroupAdjustment = 0;

    Array.from(partyBody.querySelectorAll("tr")).forEach((tr) => {
      const proficient = tr.querySelector(".member-proficient").checked;
      const heavyArmor = tr.querySelector(".member-heavy").checked;
      const profAdjustment = proficient ? proficiencyBonus : -nonProficientPenalty;
      const armorAdjustment = heavyArmor ? -5 : 0;
      const netAdjustment = profAdjustment + armorAdjustment;

      tr.querySelector(".member-prof-adj").textContent = formatSigned(profAdjustment);
      tr.querySelector(".member-armor-adj").textContent = formatSigned(armorAdjustment);
      tr.querySelector(".member-net-adj").textContent = formatSigned(netAdjustment);

      rawGroupAdjustment += netAdjustment;
    });

    const rawSituational = situationalValue(sitA.value) + situationalValue(sitB.value);
    const appliedGroupAdjustment = useCaps ? clamp(rawGroupAdjustment, -5, 5) : rawGroupAdjustment;
    const appliedSituational = useCaps ? clamp(rawSituational, -5, 5) : rawSituational;
    const adjustedModifier = getInt(leaderMod.value, 0) + appliedGroupAdjustment;
    const passiveStealth = 10 + adjustedModifier + appliedSituational;
    const rolledTotalValue = getInt(rolled.value, 10) + adjustedModifier + appliedSituational;
    const perceptionDc = getInt(enemyDC.value, 10);
    const passiveDelta = passiveStealth - perceptionDc;
    const rolledDelta = rolledTotalValue - perceptionDc;

    kpiSituational.textContent = formatSigned(appliedSituational);
    kpiSituationalNote.textContent = useCaps ? `Raw total ${formatSigned(rawSituational)}, capped to +/-5.` : "Using uncapped situational total.";
    kpiGroupAdj.textContent = formatSigned(appliedGroupAdjustment);
    kpiGroupAdjNote.textContent = useCaps ? "Using capped totals." : "Using uncapped totals.";
    kpiGroupAdjRaw.textContent = `Raw total: ${formatSigned(rawGroupAdjustment)}`;
    kpiAdjustedMod.textContent = formatSigned(adjustedModifier);
    kpiPassive.textContent = String(passiveStealth);
    rolledTotal.value = String(rolledTotalValue);
    diffPassive.value = String(passiveDelta);
    diffRolled.value = String(rolledDelta);

    const passiveClass = updateOutcomePill(outPassive, passiveDelta);
    updateOutcomePill(outRolled, rolledDelta);

    const passiveTile = kpiPassive.closest(".tile-passive");
    if (passiveTile) {
      passiveTile.classList.remove("tint-ok", "tint-warn", "tint-danger");
      passiveTile.classList.add(
        passiveClass === "ok" ? "tint-ok" : passiveClass === "warn" ? "tint-warn" : "tint-danger"
      );
    }
  }

  function saveState() {
    syncCacheFromRows();
    const state = {
      leaderMod: leaderMod.value,
      pb: pb.value,
      partySize: partySize.value,
      enemyDC: enemyDC.value,
      sitA: sitA.value,
      sitB: sitB.value,
      useCappedAdjustments: useCappedAdjustments.value,
      rolled: rolled.value,
      members: cachedMemberStates.slice(0, 12)
    };

    try {
      localStorage.setItem(GROUP_STEALTH_STORE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn("Could not save group stealth state:", error);
    }
  }

  function applyState(state) {
    if (!state) {
      cachedMemberStates = [];
      buildPartyRows(4);
      compute();
      return;
    }

    leaderMod.value = state.leaderMod ?? "7";
    pb.value = state.pb ?? "3";
    partySize.value = state.partySize ?? "4";
    enemyDC.value = state.enemyDC ?? "13";
    sitA.value = state.sitA ?? "None";
    sitB.value = state.sitB ?? "None";
    if (state.useCappedAdjustments === false) {
      useCappedAdjustments.value = "false";
    } else if (state.useCappedAdjustments === true) {
      useCappedAdjustments.value = "true";
    } else {
      useCappedAdjustments.value = state.useCappedAdjustments ?? "true";
    }
    rolled.value = state.rolled ?? "10";

    const size = clamp(getInt(partySize.value, 4), 1, 12);
    cachedMemberStates = Array.isArray(state.members) ? state.members.slice(0, 12) : [];
    ensureCachedMemberStates(size);
    buildPartyRows(size, cachedMemberStates);
    compute();
  }

  function loadState() {
    try {
      const stored = localStorage.getItem(GROUP_STEALTH_STORE_KEY);
      if (!stored) {
        applyState(null);
        return;
      }

      applyState(JSON.parse(stored));
    } catch (error) {
      console.warn("Could not load group stealth state:", error);
      applyState(null);
    }
  }

  function resetCalculator() {
    try {
      localStorage.removeItem(GROUP_STEALTH_STORE_KEY);
    } catch (error) {
      console.warn("Could not clear group stealth state:", error);
    }

    applyState({
      leaderMod: "7",
      pb: "3",
      partySize: "4",
      enemyDC: "13",
      sitA: "None",
      sitB: "None",
      useCappedAdjustments: "true",
      rolled: "10",
      members: [
        defaultMemberState(0),
        defaultMemberState(1),
        defaultMemberState(2),
        defaultMemberState(3)
      ]
    });
    saveState();
  }

  function rebuildRowsPreservingState() {
    const size = clamp(getInt(partySize.value, 1), 1, 12);
    syncCacheFromRows();
    ensureCachedMemberStates(size);
    buildPartyRows(size, cachedMemberStates);
    compute();
    saveState();
  }

  partySize.addEventListener("change", rebuildRowsPreservingState);
  partySize.addEventListener("input", rebuildRowsPreservingState);

  [leaderMod, pb, enemyDC, sitA, sitB, useCappedAdjustments, rolled].forEach((element) => {
    element.addEventListener("input", () => {
      compute();
      saveState();
    });
    element.addEventListener("change", () => {
      compute();
      saveState();
    });
  });

  partyBody.addEventListener("input", () => {
    compute();
    saveState();
  });

  partyBody.addEventListener("change", () => {
    compute();
    saveState();
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", resetCalculator);
  }

  loadState();
})();
