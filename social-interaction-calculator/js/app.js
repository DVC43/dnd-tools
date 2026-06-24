(() => {
  "use strict";

  const ATTITUDE_TABLE = {
    Friendly: [
      {
        dc: 0,
        label: "No risk or sacrifice",
        text: "The creature does as asked without taking risks or making sacrifices."
      },
      {
        dc: 10,
        label: "Minor risk or sacrifice",
        text: "The creature accepts a minor risk or sacrifice to do as asked."
      },
      {
        dc: 20,
        label: "Significant risk or sacrifice",
        text: "The creature accepts a significant risk or sacrifice to do as asked."
      }
    ],
    Indifferent: [
      {
        dc: 0,
        label: "No help",
        text: "The creature offers no help but does no harm."
      },
      {
        dc: 10,
        label: "Help with no risk",
        text: "The creature does as asked as long as no risks or sacrifices are involved."
      },
      {
        dc: 20,
        label: "Minor risk or sacrifice",
        text: "The creature accepts a minor risk or sacrifice to do as asked."
      }
    ],
    Hostile: [
      {
        dc: 0,
        label: "Opposes the party",
        text: "The creature opposes the adventurers' actions and might take risks to do so."
      },
      {
        dc: 10,
        label: "No help, no harm",
        text: "The creature offers no help but does no harm."
      },
      {
        dc: 20,
        label: "Help with no risk",
        text: "The creature does as asked as long as no risks or sacrifices are involved."
      }
    ]
  };

  const REQUEST_OPTIONS = {
    Friendly: [
      {
        key: "friendly_simple",
        label: "Simple Favor (no real risk or sacrifice)",
        rowIndex: 0,
        description: "You are asking for something easy that costs the NPC little to nothing."
      },
      {
        key: "friendly_minor",
        label: "Minor Risk or Sacrifice",
        rowIndex: 1,
        description: "You are asking for a favor that carries a modest risk or cost for the NPC."
      },
      {
        key: "friendly_major",
        label: "Significant Risk or Sacrifice",
        rowIndex: 2,
        description: "You are asking for a big favor: real danger, serious cost, or major obligation."
      }
    ],
    Indifferent: [
      {
        key: "indiff_simple",
        label: "Simple Favor (no risks or sacrifices)",
        rowIndex: 1,
        description: "You are asking the NPC to help, but only in ways that do not cost them anything."
      },
      {
        key: "indiff_risky",
        label: "Risky Favor (minor risk or sacrifice)",
        rowIndex: 2,
        description: "You are asking the NPC to help in a way that costs them something or carries minor risk."
      }
    ],
    Hostile: [
      {
        key: "hostile_standdown",
        label: "Stand Down (no help, no harm)",
        rowIndex: 1,
        description: "You are trying to get the NPC to stop actively opposing you, but not to help you."
      },
      {
        key: "hostile_cautious",
        label: "Cautious Cooperation (help with no risks or sacrifices)",
        rowIndex: 2,
        description: "You are pushing for careful cooperation, doing as asked only if it carries no real risk."
      }
    ]
  };

  const SOCIAL_CALC_STORE_KEY = "socialInteractionCalculatorState_v1";

  const npcAttitudeSel = document.getElementById("npcAttitude");
  const requestTypeSel = document.getElementById("requestType");
  const charInput = document.getElementById("charCheck");
  const resultsDiv = document.getElementById("socialResults");
  const resetBtn = document.getElementById("socialResetBtn");

  if (!npcAttitudeSel || !requestTypeSel || !charInput || !resultsDiv) {
    return;
  }

  function renderPrompt(message) {
    resultsDiv.innerHTML = `<p class="empty-state">${message}</p>`;
  }

  function populateRequestOptions(preferredKey = "") {
    const attitude = npcAttitudeSel.value;
    const options = REQUEST_OPTIONS[attitude] || [];
    const selection = preferredKey || requestTypeSel.value;

    requestTypeSel.innerHTML = "";

    options.forEach((option) => {
      const element = document.createElement("option");
      element.value = option.key;
      element.textContent = option.label;
      if (option.key === selection) {
        element.selected = true;
      }
      requestTypeSel.appendChild(element);
    });

    if ((!requestTypeSel.value || requestTypeSel.selectedIndex === -1) && options.length > 0) {
      requestTypeSel.value = options[0].key;
    }
  }

  function computeAttitudeShift(startAttitude, success, roll, targetDc) {
    let newAttitude = startAttitude;
    let explanation = "";
    const failBy = targetDc - roll;

    if (success) {
      if (startAttitude === "Hostile") {
        newAttitude = "Indifferent";
        explanation = "Success improves the creature's attitude from hostile to indifferent.";
      } else if (startAttitude === "Indifferent") {
        newAttitude = "Friendly";
        explanation = "Success improves the creature's attitude from indifferent to friendly.";
      } else {
        explanation = "The creature is already friendly, and that goodwill is reinforced.";
      }
    } else if (failBy >= 5) {
      if (startAttitude === "Friendly") {
        newAttitude = "Indifferent";
        explanation = "A notably poor impression suggests the attitude may worsen from friendly to indifferent.";
      } else if (startAttitude === "Indifferent") {
        newAttitude = "Hostile";
        explanation = "A notably poor impression suggests the attitude may worsen from indifferent to hostile.";
      } else {
        explanation = "The creature is already hostile, and that hostility may be reinforced by this exchange.";
      }
    } else {
      explanation = "This result does not strongly suggest an attitude shift on its own. Use roleplay and context to decide whether the creature's outlook drifts over time.";
    }

    return { newAttitude, explanation };
  }

  function evaluateInteraction() {
    const attitude = npcAttitudeSel.value;
    const roll = parseInt(charInput.value, 10);

    if (Number.isNaN(roll)) {
      renderPrompt("Enter a Charisma check total to see the likely outcome.");
      return;
    }

    const options = REQUEST_OPTIONS[attitude] || [];
    const selectedKey = requestTypeSel.value;
    const requestOption = options.find((option) => option.key === selectedKey) || options[0];
    const table = ATTITUDE_TABLE[attitude];

    if (!requestOption || !table || !table[requestOption.rowIndex]) {
      renderPrompt("Choose a valid starting attitude and request type.");
      return;
    }

    const targetRow = table[requestOption.rowIndex];
    const targetDc = targetRow.dc;

    let achievedRow = table[0];
    table.forEach((row) => {
      if (roll >= row.dc) {
        achievedRow = row;
      }
    });

    const success = roll >= targetDc;
    const shift = computeAttitudeShift(attitude, success, roll, targetDc);
    const shiftLine =
      shift.newAttitude === attitude
        ? `${attitude} -> ${shift.newAttitude} (no automatic step change).`
        : `${attitude} -> ${shift.newAttitude} (one-step change).`;

    resultsDiv.innerHTML = `
      <div class="result-block">
        <div class="result-title">Starting Attitude</div>
        <p class="result-text">${attitude}</p>
      </div>
      <div class="result-block">
        <div class="result-title">Request You Are Making</div>
        <p class="result-text">${requestOption.description}</p>
      </div>
      <div class="result-block">
        <div class="result-title">Check Total and Target DC</div>
        <p class="result-text">Check total ${roll} against DC ${targetDc} (${targetRow.label}).</p>
      </div>
      <div class="result-block">
        <div class="result-title">Request Result</div>
        <p class="result-text">${success ? "Success: the NPC is willing to meet this level of request." : "Failure: the NPC is not willing to go as far as this level of request."}</p>
      </div>
      <div class="result-block">
        <div class="result-title">What the NPC Is Actually Willing to Do</div>
        <p class="result-text">${achievedRow.text}</p>
      </div>
      <div class="result-block">
        <div class="result-title">Attitude Change (Optional DM Guidance)</div>
        <p class="result-text">${shiftLine}<br>${shift.explanation}</p>
      </div>
    `;
  }

  function saveSocialCalcState() {
    const state = {
      npcAttitude: npcAttitudeSel.value,
      requestType: requestTypeSel.value,
      charCheck: charInput.value
    };

    try {
      localStorage.setItem(SOCIAL_CALC_STORE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn("Could not save social calc state:", error);
    }
  }

  function loadSocialCalcState() {
    try {
      const stored = localStorage.getItem(SOCIAL_CALC_STORE_KEY);
      if (!stored) {
        populateRequestOptions();
        return;
      }

      const state = JSON.parse(stored);

      if (state.npcAttitude) {
        npcAttitudeSel.value = state.npcAttitude;
      }

      populateRequestOptions(state.requestType || "");

      if (state.charCheck !== undefined && state.charCheck !== null) {
        charInput.value = state.charCheck;
      }
    } catch (error) {
      console.warn("Could not load social calc state:", error);
      populateRequestOptions();
    }
  }

  function resetCalculator() {
    try {
      localStorage.removeItem(SOCIAL_CALC_STORE_KEY);
    } catch (error) {
      console.warn("Could not clear social calc state:", error);
    }

    npcAttitudeSel.value = "Friendly";
    populateRequestOptions("friendly_simple");
    charInput.value = "";
    renderPrompt("Enter a Charisma check total to see the likely outcome.");
    saveSocialCalcState();
  }

  npcAttitudeSel.addEventListener("change", () => {
    populateRequestOptions();
    evaluateInteraction();
    saveSocialCalcState();
  });

  requestTypeSel.addEventListener("change", () => {
    evaluateInteraction();
    saveSocialCalcState();
  });

  charInput.addEventListener("input", () => {
    evaluateInteraction();
    saveSocialCalcState();
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", resetCalculator);
  }

  loadSocialCalcState();
  evaluateInteraction();
})();
