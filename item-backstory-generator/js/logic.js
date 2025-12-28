// js/logic.js
// Generation + DOM hookup (reads from window.BACKSTORY_DATA)
(() => {
  const DATA = window.BACKSTORY_DATA;
  if (!DATA) throw new Error("BACKSTORY_DATA not found. Ensure data.js is loaded before logic.js.");

  // ---------- Utilities ----------
  const rand = (n) => Math.floor(Math.random() * n);
  const pick = (arr) => arr[rand(arr.length)];

  function weightedPickKey(weightMap) {
    const entries = Object.entries(weightMap || {}).filter(([, w]) => Number(w) > 0);
    if (!entries.length) return null;

    const total = entries.reduce((sum, [, w]) => sum + Number(w), 0);
    let r = Math.random() * total;

    for (const [key, w] of entries) {
      r -= Number(w);
      if (r <= 0) return key;
    }
    return entries[entries.length - 1][0];
  }

  function ensureSentenceCase(s) {
    const t = (s || "").trim();
    if (!t) return t;
    return t[0].toUpperCase() + t.slice(1);
  }

  function inlineWhitespace(s) {
    return (s || "")
      .replace(/\s*\n+\s*/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

	function cleanSentence(s) {
	  return (s || "")
		.trim()
		.replace(/[.!?]+$/, ""); // strip ALL trailing sentence punctuation
	}

  function decapitalizeForEmbedding(s) {
    const t = (s || "").trim();
    if (!t) return t;
    if (t.startsWith('"') || t.startsWith("“") || t.startsWith("'")) return t;
    if (/^(I\b|I'm\b|I’ve\b|I’d\b|I’ll\b)/.test(t)) return t;
    return t[0].toLowerCase() + t.slice(1);
  }

	function stripLeadingOpener(s) {
	  return (s || "").replace(
		/^(?:It['’]s said|Those who know of it say|Those close to the story say|Whispers insist|For reasons never fully explained|Some records claim|Tradition holds|The tale goes)(?:\s+that)?(?:[:,])?\s+/i,
		""
	  );
	}

  function hasTemporalLead(s) {
    return /^(even now|to this day|long after|from the start|in time|afterward)/i.test((s || "").trim());
  }

  function applyOpener(openerPool, sentence) {
    const opener = pick(openerPool);
    const embedded = decapitalizeForEmbedding(cleanSentence(sentence));
    const line = opener.replace("{s}", embedded);
    return line.endsWith(".") ? line : line + ".";
  }

  function alignmentAdjective(alignment) {
    const list = DATA.ALIGNMENT_ADJECTIVES[alignment] || ["strange"];
    return pick(list);
  }

  // ---------- Creator details ----------
  function chooseCreatorDetailSentence(creator, alignment) {
    if (Array.isArray(creator.extraSentences) && creator.extraSentences.length) {
      return pick(creator.extraSentences);
    }

    const good = ["LG", "NG", "CG"].includes(alignment);
    const evil = ["LE", "NE", "CE"].includes(alignment);
    const lawful = ["LG", "LN", "LE"].includes(alignment);
    const chaotic = ["CG", "CN", "CE"].includes(alignment);

    let options;
    if (good) {
      options = lawful
        ? DATA.CREATOR_FALLBACK_SENTENCES.good.lawful
        : DATA.CREATOR_FALLBACK_SENTENCES.good.nonlawful;
    } else if (evil) {
      options = lawful
        ? DATA.CREATOR_FALLBACK_SENTENCES.evil.lawful
        : DATA.CREATOR_FALLBACK_SENTENCES.evil.nonlawful;
    } else {
      options = chaotic
        ? DATA.CREATOR_FALLBACK_SENTENCES.neutral.chaotic
        : DATA.CREATOR_FALLBACK_SENTENCES.neutral.nonchaotic;
    }
    return pick(options);
  }

  function chooseGroupSizeForRarity(rarity) {
    const weights = DATA.GROUP_SIZE_WEIGHTS_BY_RARITY?.[rarity];
    return weightedPickKey(weights) || "solo";
  }

  function chooseCreator(rarity, tone) {
    const band = DATA.RARITY_POWER[rarity];
    const monstrousChance = DATA.MONSTROUS_CHANCE[rarity] ?? 0.25;

    // 1) Decide mortal vs monstrous (but be willing to fall back within-band if empty)
    const poolName = Math.random() < monstrousChance ? "monstrous" : "mortal";
    const desiredGroup = chooseGroupSizeForRarity(rarity);

    const allCreators = [].concat(DATA.CREATOR_POOLS.mortal, DATA.CREATOR_POOLS.monstrous);
    const bandPool = allCreators.filter((c) => c.power >= band.min && c.power <= band.max);

    const basePool = DATA.CREATOR_POOLS[poolName].filter((c) => c.power >= band.min && c.power <= band.max);
    const sizedPool = basePool.filter((c) => (c.groupSize || "solo") === desiredGroup);
    const groupPool = sizedPool.length ? sizedPool : basePool;

    // 2) If tone is selected, enforce it, relaxing constraints in this order:
    //    group-size -> mortal/monstrous choice -> (last resort) ignore tone
    let finalPool = groupPool;

    if (tone) {
      const tonePool = finalPool.filter((c) => (c.alignWeights?.[tone] || 0) > 0);

      if (tonePool.length) {
        finalPool = tonePool;
      } else {
        // Relax group-size preference but keep poolName + band
        const baseTonePool = basePool.filter((c) => (c.alignWeights?.[tone] || 0) > 0);

        if (baseTonePool.length) {
          finalPool = baseTonePool;
        } else {
          // Relax poolName (search across both mortal+monstrous) but keep band
          const bandTonePool = bandPool.filter((c) => (c.alignWeights?.[tone] || 0) > 0);

          finalPool = bandTonePool.length ? bandTonePool : groupPool; // last resort: ignore tone
        }
      }
    } else if (!finalPool.length) {
      // No tone: if chosen poolName had nothing in-band, fall back to bandPool
      finalPool = bandPool.length ? bandPool : allCreators;
    }

    // 3) Pick creator with band-preserving fallback
    const creator = finalPool.length ? pick(finalPool) : (bandPool.length ? pick(bandPool) : pick(allCreators));

    // 4) Alignment is RESTRICTED: only pick from allowed; tone only if allowed.
    const allowed = creator.alignWeights ? Object.keys(creator.alignWeights) : [];

    let alignment;
		if (tone && allowed.includes(tone)) alignment = tone;
		else if (allowed.length) alignment = weightedPickKey(creator.alignWeights);
		else alignment = pick(DATA.ALIGNMENTS); // should be rare

    const creatorDetail = chooseCreatorDetailSentence(creator, alignment);
    const groupSize = creator.groupSize || "solo";

    return { creatorName: creator.name, alignment, creatorDetail, groupSize };
  }

  function creatorAlignmentEnding(alignment) {
    const good = ["LG", "NG", "CG"].includes(alignment);
    const evil = ["LE", "NE", "CE"].includes(alignment);
    const lawful = ["LG", "LN", "LE"].includes(alignment);
    const chaotic = ["CG", "CN", "CE"].includes(alignment);

    let options;
    if (good) {
      options = lawful
        ? DATA.CREATOR_ALIGNMENT_ENDINGS.good.lawful
        : DATA.CREATOR_ALIGNMENT_ENDINGS.good.nonlawful;
    } else if (evil) {
      options = lawful
        ? DATA.CREATOR_ALIGNMENT_ENDINGS.evil.lawful
        : DATA.CREATOR_ALIGNMENT_ENDINGS.evil.nonlawful;
    } else {
      options = chaotic
        ? DATA.CREATOR_ALIGNMENT_ENDINGS.neutral.chaotic
        : DATA.CREATOR_ALIGNMENT_ENDINGS.neutral.nonchaotic;
    }
    return pick(options);
  }

  function creatorIntroLine(creatorName, alignmentEnding) {
    const template = pick(DATA.OPENERS.creator);
	const ending = cleanSentence(alignmentEnding).replace(/[.!?]\s*$/, "");
    return template
      .replace("{creator}", creatorName)
      .replace("{ending}", ending);
  }

  // ---------- Motive & provenance ----------
  function motiveFor(rarity, alignment) {
    const adj = alignmentAdjective(alignment);

    const good = ["LG", "NG", "CG"].includes(alignment);
    const evil = ["LE", "NE", "CE"].includes(alignment);

    let alignmentKey = "neutral";
    if (good) alignmentKey = "good";
    else if (evil) alignmentKey = "evil";

    const options = DATA.MOTIVE_BASE[rarity]?.[alignmentKey] || DATA.MOTIVE_BASE[rarity]?.neutral || [];
    const clause = (pick(options) || "").replace("{adj}", adj);

    return { alignmentKey, sentence: applyOpener(DATA.OPENERS.motive, clause) };
  }

  function normalizeSentenceForInline(s) {
    if (!s) return "";
    const cleaned = inlineWhitespace((s || "").trim());
    const noLead = stripLeadingOpener(cleaned);
    return ensureSentenceCase(noLead).replace(/[.!?]\s*$/, "") + ".";
  }

  // ---------- Connectors ----------
  function chooseWeightedConnector(style) {
    const weights =
      DATA.CONNECTOR_WEIGHTS_BY_STYLE?.[style]?.default ||
      DATA.CONNECTOR_WEIGHTS_BY_STYLE?.plainspoken?.default ||
      { " ": 1 };

    return weightedPickKey(weights) || " ";
  }

  function joinWithConnectors(parts, style) {
	  const cleaned = parts.map((s) => (s || "").trim()).filter(Boolean);
	  if (cleaned.length <= 1) return cleaned[0] || "";

	  let out = cleaned[0];

	  let usedDash = false;
	  let semicolonCount = 0;
	  const MAX_SEMICOLONS = 2;

	  for (let i = 1; i < cleaned.length; i++) {
		const prev = out.trim();
		const next = cleaned[i].trim();

		const nextHasTransition =
		  /^(afterward|in time|from the start|notably|for reasons never fully explained|even now|some records claim|it’s said|whispers insist|tradition holds|the tale goes|at its heart|its purpose was|the intention was clear|it was made to|it was created to)\b/i.test(next);

		let connector = nextHasTransition ? " " : chooseWeightedConnector(style);

		// Limit to one em dash per paragraph
		if (connector === " — ") {
		  if (usedDash) connector = "; ";
		  else usedDash = true;
		}

		// Limit semicolons per paragraph
		if (connector === "; ") {
		  if (semicolonCount >= MAX_SEMICOLONS) {
			connector = " ";
		  } else {
			semicolonCount += 1;
		  }
		}

		let left = prev;

		// If the connector supplies sentence punctuation, remove any existing terminal punctuation first
		if ((connector === "; " || connector === " — " || connector === ". ") && /[.!?]+$/.test(left)) {
		  left = left.replace(/[.!?]+$/, "");
		}

		let joinedNext;
		if (connector === " — " || connector === "; ") {
		  joinedNext = decapitalizeForEmbedding(next);
		} else {
		  joinedNext = ensureSentenceCase(next);
		}
		out = left + connector + joinedNext;
	  }

	  return out.replace(/\s+/g, " ").trim();
	}


  function chooseTemplateStyle(rarity) {
    const weights = DATA.TEMPLATE_STYLE_WEIGHTS_BY_RARITY?.[rarity];
    return weightedPickKey(weights) || "plainspoken";
  }

	function chooseConnectorStyleByRarity(rarity) {
	  switch (rarity) {
		case "common":
		  return "plainspoken";
		case "uncommon":
		  return "uncommon";
		case "rare":
		  return "rare";
		case "very rare":
		  return "veryRare";
		case "legendary":
		  return "legendary";
		default:
		  return "plainspoken";
	  }
	}


  // ---------- Backstory ----------
  function buildBackstory(rarity, tone) {
    const { creatorName, alignment, creatorDetail } = chooseCreator(rarity, tone);

    const alignmentEnding = creatorAlignmentEnding(alignment);
    const creatorSentence = creatorIntroLine(creatorName, alignmentEnding);

    const detailSentence = normalizeSentenceForInline(creatorDetail);

    const { alignmentKey, sentence: motiveLine } = motiveFor(rarity, alignment);
    const motiveSentence = normalizeSentenceForInline(motiveLine);

    let provenanceSentence = "";
    const provenancePool =
      DATA.PROVENANCE_DETAILS[rarity]?.[alignmentKey] ||
      DATA.PROVENANCE_DETAILS[rarity]?.neutral ||
      [];

    if (provenancePool.length && Math.random() < 0.6) {
      const raw = pick(provenancePool);
      const provLine = hasTemporalLead(raw) ? raw : applyOpener(DATA.OPENERS.provenance, raw);
      provenanceSentence = normalizeSentenceForInline(provLine);
    }

    const parts = [
      inlineWhitespace(creatorSentence),
      detailSentence,
      motiveSentence,
      provenanceSentence,
    ].filter(Boolean);

    const connectorStyle = chooseConnectorStyleByRarity(rarity);
	return joinWithConnectors(parts, connectorStyle);

  }

  // ---------- DOM ----------
  const rarityEl = document.getElementById("rarity");
  const toneEl = document.getElementById("tone");
  const outEl = document.getElementById("output");
  const btn = document.getElementById("generate");

  btn.addEventListener("click", () => {
    const rarity = rarityEl.value;
    const tone = toneEl.value || "";
    if (!rarity) {
      alert("Please choose an item rarity.");
      return;
    }
    outEl.value = buildBackstory(rarity, tone);
  });
})();
