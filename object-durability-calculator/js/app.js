(() => {
  "use strict";

  const STORE_KEY = "objectDurabilityCalculatorState_v1";
  const DEFAULT_STATE = {
    substance: "cloth",
    size: "Tiny",
    trait: "Fragile"
  };

  const SUBSTANCE_AC = {
    cloth: { name: "Cloth, paper, rope", ac: 11 },
    crystal: { name: "Crystal, glass, ice", ac: 13 },
    wood: { name: "Wood, bone", ac: 15 },
    stone: { name: "Stone", ac: 17 },
    iron: { name: "Iron, steel", ac: 19 },
    mithral: { name: "Mithral", ac: 21 },
    adamantine: { name: "Adamantine", ac: 23 }
  };

  const SIZE_DATA = {
    Tiny: {
      space: "2½ ft × 2½ ft",
      fragile: "2 hp (1d4)",
      resilient: "5 hp (2d4)",
      threshold: null
    },
    Small: {
      space: "5 ft × 5 ft",
      fragile: "3 hp (1d6)",
      resilient: "10 hp (3d6)",
      threshold: null
    },
    Medium: {
      space: "5 ft × 5 ft",
      fragile: "4 hp (1d8)",
      resilient: "18 hp (4d8)",
      threshold: null
    },
    Large: {
      space: "10 ft × 10 ft",
      fragile: "5 hp (1d10)",
      resilient: "27 hp (5d10)",
      threshold: null
    },
    Huge: {
      space: "15 ft × 15 ft",
      fragile: null,
      resilient: null,
      threshold: "5–15 per damaging hit"
    },
    Gargantuan: {
      space: "20 ft × 20 ft or larger",
      fragile: null,
      resilient: null,
      threshold: "15–30 per damaging hit"
    }
  };

  const refs = {
    objSubstance: document.getElementById("objSubstance"),
    objSize: document.getElementById("objSize"),
    objTrait: document.getElementById("objTrait"),
    resetBtn: document.getElementById("resetDurabilityBtn"),
    kpiAc: document.getElementById("kpiAc"),
    kpiAcNote: document.getElementById("kpiAcNote"),
    kpiHp: document.getElementById("kpiHp"),
    kpiHpNote: document.getElementById("kpiHpNote"),
    kpiSpace: document.getElementById("kpiSpace"),
    kpiSpaceNote: document.getElementById("kpiSpaceNote"),
    kpiThreshold: document.getElementById("kpiThreshold"),
    kpiThresholdNote: document.getElementById("kpiThresholdNote"),
    resultSummary: document.getElementById("resultSummary"),
    resultGuidance: document.getElementById("resultGuidance"),
    resultGuidanceSecondary: document.getElementById("resultGuidanceSecondary")
  };

  if (Object.values(refs).some((value) => !value)) {
    return;
  }

  function getState() {
    return {
      substance: refs.objSubstance.value,
      size: refs.objSize.value,
      trait: refs.objTrait.value
    };
  }

  function applyState(state) {
    const next = { ...DEFAULT_STATE, ...(state || {}) };
    refs.objSubstance.value = next.substance;
    refs.objSize.value = next.size;
    refs.objTrait.value = next.trait;
  }

  function persistState() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(getState()));
    } catch (_error) {
      // Ignore storage issues in restricted contexts.
    }
  }

  function restoreState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) {
        applyState(DEFAULT_STATE);
        return;
      }

      applyState(JSON.parse(raw));
    } catch (_error) {
      applyState(DEFAULT_STATE);
    }
  }

  function toLowerLabel(value) {
    return String(value || "").charAt(0).toLowerCase() + String(value || "").slice(1);
  }

  function render() {
    const state = getState();
    const substance = SUBSTANCE_AC[state.substance];
    const sizeInfo = SIZE_DATA[state.size];

    if (!substance || !sizeInfo) {
      refs.resultSummary.textContent = "Invalid selection";
      refs.resultGuidance.textContent = "Choose a valid substance, size, and object characteristic.";
      refs.resultGuidanceSecondary.textContent = "";
      return;
    }

    const sizeLabel = state.size;
    const traitLabel = state.trait;
    const hpValue = traitLabel === "Fragile" ? sizeInfo.fragile : sizeInfo.resilient;
    const summaryLabel = `${sizeLabel} ${toLowerLabel(traitLabel)} ${substance.name.toLowerCase()} object`;

    refs.kpiAc.textContent = String(substance.ac);
    refs.kpiAcNote.textContent = `${substance.name}.`;
    refs.kpiSpace.textContent = sizeInfo.space;
    refs.kpiSpaceNote.textContent = `${sizeLabel} object.`;

    if (hpValue) {
      refs.kpiHp.textContent = hpValue;
      refs.kpiHpNote.textContent = `${traitLabel} ${sizeLabel} object.`;
      refs.kpiThreshold.textContent = "None";
      refs.kpiThresholdNote.textContent = "Assign one only for especially tough objects.";
      refs.resultGuidance.textContent = `A ${summaryLabel} typically has AC ${substance.ac}, ${hpValue}, and occupies a ${sizeInfo.space} space on the grid.`;
      refs.resultGuidanceSecondary.textContent = "By default it has no damage threshold, though you can assign one when the object is unusually reinforced or central to the scene.";
    } else {
      refs.kpiHp.textContent = "Scene-based";
      refs.kpiHpNote.textContent = "Use sections or narrative handling.";
      refs.kpiThreshold.textContent = sizeInfo.threshold;
      refs.kpiThresholdNote.textContent = "Damage below this from a single hit is usually ignored.";
      refs.resultGuidance.textContent = `${sizeLabel} objects do not have fixed hit points in the DMG. Instead, break the object into sections or assign values that fit the scene and the pace you want at the table.`;
      refs.resultGuidanceSecondary.textContent = `A suggested damage threshold of ${sizeInfo.threshold} helps large objects ignore minor hits while still letting meaningful damage matter.`;
    }

    refs.resultSummary.textContent = summaryLabel.charAt(0).toUpperCase() + summaryLabel.slice(1);
  }

  function handleChange() {
    persistState();
    render();
  }

  function handleReset() {
    applyState(DEFAULT_STATE);
    persistState();
    render();
  }

  function initEvents() {
    refs.objSubstance.addEventListener("change", handleChange);
    refs.objSize.addEventListener("change", handleChange);
    refs.objTrait.addEventListener("change", handleChange);
    refs.resetBtn.addEventListener("click", handleReset);
  }

  function init() {
    restoreState();
    initEvents();
    render();
  }

  init();
})();
