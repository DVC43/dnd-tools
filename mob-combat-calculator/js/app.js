(() => {
  "use strict";

  const MOB_CALC_STORE_KEY = "mobCombatCalculatorState_v1";

  const table = document.getElementById("mobTable");
  if (!table) return;

  const tbody = table.querySelector("tbody");
  const addRowBtn = document.getElementById("addRowBtn");
  const removeRowBtn = document.getElementById("removeRowBtn");
  const resetMobBtn = document.getElementById("resetMobBtn");
  const templateRow = tbody.querySelector("tr").cloneNode(true);

  function attackersFromRoll(minRoll) {
    if (minRoll <= 5) return 1;
    if (minRoll <= 12) return 2;
    if (minRoll <= 14) return 3;
    if (minRoll <= 16) return 4;
    if (minRoll <= 18) return 5;
    if (minRoll === 19) return 10;
    return 20;
  }

  function getRowParts(tr) {
    return {
      pcName: tr.querySelector(".pc-name"),
      pcAc: tr.querySelector(".pc-ac"),
      mobName: tr.querySelector(".mob-name"),
      mobBonus: tr.querySelector(".mob-bonus"),
      mobMembers: tr.querySelector(".mob-members"),
      minRoll: tr.querySelector(".min-roll"),
      mobCount: tr.querySelector(".mob-count"),
      mobHits: tr.querySelector(".mob-hits")
    };
  }

  function clearOutputs(tr) {
    const { minRoll, mobCount, mobHits } = getRowParts(tr);
    tr.classList.remove("insufficient-mob");
    if (minRoll) minRoll.textContent = "";
    if (mobCount) mobCount.textContent = "";
    if (mobHits) mobHits.textContent = "";
  }

  function recalcRow(tr) {
    const parts = getRowParts(tr);
    const ac = parseInt(parts.pcAc.value, 10);
    const bonus = parseInt(parts.mobBonus.value, 10);
    const mobMembers = parseInt(parts.mobMembers.value, 10);

    tr.classList.remove("insufficient-mob");

    if (Number.isNaN(ac) || Number.isNaN(bonus)) {
      clearOutputs(tr);
      return;
    }

    let needed = ac - bonus;
    if (needed < 1) needed = 1;
    if (needed > 20) needed = 20;

    const attackers = attackersFromRoll(needed);
    parts.minRoll.textContent = String(needed);
    parts.mobCount.textContent = String(attackers);

    if (Number.isNaN(mobMembers) || attackers <= 0) {
      parts.mobHits.textContent = "";
      return;
    }

    if (mobMembers < attackers) {
      parts.mobHits.textContent = "0";
      tr.classList.add("insufficient-mob");
      return;
    }

    parts.mobHits.textContent = String(Math.floor(mobMembers / attackers));
  }

  function recalcAll() {
    tbody.querySelectorAll("tr").forEach(recalcRow);
  }

  function rowStateFromTr(tr) {
    const parts = getRowParts(tr);
    return {
      pcName: parts.pcName ? parts.pcName.value : "",
      pcAC: parts.pcAc ? parts.pcAc.value : "",
      mobName: parts.mobName ? parts.mobName.value : "",
      mobBonus: parts.mobBonus ? parts.mobBonus.value : "",
      mobMembers: parts.mobMembers ? parts.mobMembers.value : ""
    };
  }

  function saveMobCalcState() {
    const rows = Array.from(tbody.querySelectorAll("tr"), rowStateFromTr);

    try {
      localStorage.setItem(MOB_CALC_STORE_KEY, JSON.stringify({ rows }));
    } catch (error) {
      console.warn("Could not save mob calc state:", error);
    }
  }

  function buildRow(state) {
    const tr = templateRow.cloneNode(true);
    const parts = getRowParts(tr);

    clearOutputs(tr);

    if (state) {
      if (parts.pcName) parts.pcName.value = state.pcName ?? "";
      if (parts.pcAc) parts.pcAc.value = state.pcAC ?? "";
      if (parts.mobName) parts.mobName.value = state.mobName ?? "";
      if (parts.mobBonus) parts.mobBonus.value = state.mobBonus ?? "";
      if (parts.mobMembers) parts.mobMembers.value = state.mobMembers ?? "";
    }

    return tr;
  }

  function loadMobCalcState() {
    try {
      const stored = localStorage.getItem(MOB_CALC_STORE_KEY);
      if (!stored) return false;

      const data = JSON.parse(stored);
      if (!data.rows || !Array.isArray(data.rows) || data.rows.length === 0) {
        return false;
      }

      tbody.innerHTML = "";
      data.rows.forEach((rowState) => {
        tbody.appendChild(buildRow(rowState));
      });
      recalcAll();
      return true;
    } catch (error) {
      console.warn("Could not load mob calc state:", error);
      return false;
    }
  }

  function addBlankRow() {
    const row = buildRow({
      pcName: "",
      pcAC: "",
      mobName: "",
      mobBonus: "",
      mobMembers: ""
    });

    tbody.appendChild(row);
    recalcRow(row);
    saveMobCalcState();
  }

  function removeLastRow() {
    const rows = tbody.querySelectorAll("tr");
    if (rows.length <= 1) return;

    tbody.removeChild(rows[rows.length - 1]);
    recalcAll();
    saveMobCalcState();
  }

  function resetCalculator() {
    try {
      localStorage.removeItem(MOB_CALC_STORE_KEY);
    } catch (error) {
      console.warn("Could not clear mob calc state:", error);
    }

    tbody.innerHTML = "";
    tbody.appendChild(templateRow.cloneNode(true));
    clearOutputs(tbody.querySelector("tr"));
    recalcAll();
    saveMobCalcState();
  }

  tbody.addEventListener("input", (event) => {
    const target = event.target;
    const tr = target.closest("tr");
    if (!tr) return;

    if (
      target.classList.contains("pc-ac") ||
      target.classList.contains("mob-bonus") ||
      target.classList.contains("mob-members") ||
      target.classList.contains("pc-name") ||
      target.classList.contains("mob-name")
    ) {
      recalcRow(tr);
      saveMobCalcState();
    }
  });

  if (addRowBtn) {
    addRowBtn.addEventListener("click", addBlankRow);
  }

  if (removeRowBtn) {
    removeRowBtn.addEventListener("click", removeLastRow);
  }

  if (resetMobBtn) {
    resetMobBtn.addEventListener("click", resetCalculator);
  }

  if (!loadMobCalcState()) {
    recalcAll();
  }
})();
