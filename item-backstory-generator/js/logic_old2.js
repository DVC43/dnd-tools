// js/logic.js
// Generation + DOM hookup (reads from window.BACKSTORY_DATA)
(() => {
    const DATA = window.BACKSTORY_DATA;
    if (!DATA) throw new Error("BACKSTORY_DATA not found. Ensure data.js is loaded before logic.js.");
    // ---------- Utilities ----------
    const rand = (n) => Math.floor(Math.random() * n);
    const pick = (arr) => arr[rand(arr.length)];

    function alignmentAdjective(alignment) {
        const list = DATA.ALIGNMENT_ADJECTIVES[alignment] || ["strange"];
        return pick(list);
    }

    function chooseCreatorDetailSentence(creator, alignment) {
        // 1) Prefer creator-specific sentences if present
        if (Array.isArray(creator.extraSentences) && creator.extraSentences.length) {
            return pick(creator.extraSentences);
        }
        // 2) Fallback sentences based on alignment tone
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

    function chooseCreator(rarity, tone) {
        const band = DATA.RARITY_POWER[rarity];
        const monstrousChance = DATA.MONSTROUS_CHANCE[rarity] ?? 0.25;

        const poolName = Math.random() < monstrousChance ? "monstrous" : "mortal";

        // Base pool: respects rarity band
        const basePool = DATA.CREATOR_POOLS[poolName].filter((c) => c.power >= band.min && c.power <= band.max);

        // Group size preference (data-driven), with fallback to basePool
        const desiredGroup = chooseGroupSizeForRarity(rarity);
        const sizedPool = basePool.filter((c) => (c.groupSize || "solo") === desiredGroup);
        const groupPool = sizedPool.length ? sizedPool : basePool;

        // If a tone is selected, enforce creators that support it
		let finalPool = groupPool;

		if (tone) {
		  const tonePool = groupPool.filter((c) => (c.alignWeights?.[tone] || 0) > 0);

		  if (tonePool.length) {
			finalPool = tonePool;
		  } else {
			// Expand search within the rarity band (across both mortal+monstrous),
			// relaxing groupSize preference, but still enforcing tone.
			const allCreators = [].concat(DATA.CREATOR_POOLS.mortal, DATA.CREATOR_POOLS.monstrous);
			const bandPool = allCreators.filter((c) => c.power >= band.min && c.power <= band.max);
			const bandTonePool = bandPool.filter((c) => (c.alignWeights?.[tone] || 0) > 0);

			finalPool = bandTonePool.length ? bandTonePool : groupPool; // last resort: ignore tone
		  }
		}

        const allowed = creator.alignWeights ? Object.keys(creator.alignWeights) : [];

        // If tone is provided and allowed, use it. Otherwise pick from creator's allowed alignments.
        let alignment = null;

        if (tone && allowed.includes(tone)) {
            alignment = tone;
        } else if (allowed.length) {
            alignment = weightedPickKey(creator.alignWeights);
        } else {
            // Only if a creator has no alignWeights at all (should be rare)
            alignment = "N";
        }

        const creatorDetail = chooseCreatorDetailSentence(creator, alignment);
        const groupSize = creator.groupSize || "solo";

        return { creatorName: creator.name, alignment, creatorDetail, groupSize };
    }

    function alignmentTwist(alignment) {
        const good = ["LG", "NG", "CG"].includes(alignment);
        const evil = ["LE", "NE", "CE"].includes(alignment);
        const lawful = ["LG", "LN", "LE"].includes(alignment);
        const chaotic = ["CG", "CN", "CE"].includes(alignment);
        let options;
        if (good) {
            options = lawful ? DATA.ALIGNMENT_TWISTS.good.lawful : DATA.ALIGNMENT_TWISTS.good.nonlawful;
        } else if (evil) {
            options = lawful ? DATA.ALIGNMENT_TWISTS.evil.lawful : DATA.ALIGNMENT_TWISTS.evil.nonlawful;
        } else {
            options = chaotic ? DATA.ALIGNMENT_TWISTS.neutral.chaotic : DATA.ALIGNMENT_TWISTS.neutral.nonchaotic;
        }
        return pick(options);
    }

    function chooseGroupSizeForRarity(rarity) {
        const weights = DATA.GROUP_SIZE_WEIGHTS_BY_RARITY?.[rarity];
        return weightedPickKey(weights) || "solo";
    }

    function motiveFor(rarity, alignment) {
        const adj = alignmentAdjective(alignment);

        const good = ["LG", "NG", "CG"].includes(alignment);
        const evil = ["LE", "NE", "CE"].includes(alignment);

        let alignmentKey = "neutral";
        if (good) alignmentKey = "good";
        else if (evil) alignmentKey = "evil";

        const options = DATA.MOTIVE_BASE[rarity]?.[alignmentKey] || DATA.MOTIVE_BASE[rarity]?.neutral || [];

        const clause = (pick(options) || "").replace("{adj}", adj);

        return {
            alignmentKey, // <-- reuse this for provenance/twists
            sentence: applyOpener(DATA.OPENERS.motive, clause),
        };
    }

    function normalizeSentenceForInline(s) {
        if (!s) return "";

        // Normalize whitespace first
        const cleaned = inlineWhitespace(s.trim());

        // Remove epistemic opener
        const noLead = stripLeadingOpener(cleaned);

        // Ensure proper sentence casing and single terminal period
        return ensureSentenceCase(noLead).replace(/[.!?]\s*$/, "") + ".";
    }

    function cleanSentence(s) {
        const t = (s || "").trim();
        return t.endsWith(".") ? t.slice(0, -1) : t;
    }

    function decapitalizeForEmbedding(s) {
        const t = (s || "").trim();
        if (!t) return t;
        // If it starts with a quote, leave it alone
        if (t.startsWith('"') || t.startsWith("“") || t.startsWith("'")) return t;
        // Don’t lower-case obvious proper-starts (expand this list over time if you want)
        if (/^(I\b|I'm\b|I’ve\b|I’d\b|I’ll\b)/.test(t)) return t;
        return t[0].toLowerCase() + t.slice(1);
    }

    function ensureSentenceCase(s) {
        const t = (s || "").trim();
        if (!t) return t;
        return t[0].toUpperCase() + t.slice(1);
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

            // If next already starts with a transition like "Afterward," prefer a simple space
            const nextHasTransition =
                /^(afterward|in time|from the start|notably|for reasons never fully explained|even now|some records claim|it’s said|whispers insist|tradition holds|the tale goes|at its heart|its purpose was|the intention was clear|it was made to|it was created to)\b/i.test(
                    next
                );

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
            if ((connector === "; " || connector === " — ") && left.endsWith(".")) {
                left = left.slice(0, -1);
            }

            let joinedNext = next;

            if (connector === " — " || connector === "; ") {
                // Continue the sentence; don't force capitalization
                joinedNext = next.charAt(0).toLowerCase() + next.slice(1);
            } else {
                joinedNext = ensureSentenceCase(next);
            }
            out = left + connector + joinedNext;
        }

        return out.replace(/\s+/g, " ").trim();
    }

    function stripLeadingOpener(s) {
        return s.replace(
            /^(It’s said|Those who know of it say|Those close to the story say|Whispers insist|For reasons never fully explained)[: ,]\s+/i,
            ""
        );
    }

    function hasTemporalLead(s) {
        return /^(even now|to this day|long after|from the start|in time|afterward)/i.test(s.trim());
    }

    function isShortSentence(s, maxWords = 12) {
        return (s || "").split(/\s+/).length <= maxWords;
    }

    function inlineWhitespace(s) {
        return (s || "")
            .replace(/\s*\n+\s*/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

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

    function chooseWeightedConnector(style) {
        const weights = DATA.CONNECTOR_WEIGHTS_BY_STYLE?.[style]?.default ||
            DATA.CONNECTOR_WEIGHTS_BY_STYLE?.plainspoken?.default || { " ": 1 };

        return weightedPickKey(weights) || " ";
    }

    function renderWithTemplate(style, beats) {
        const steps = DATA.PARAGRAPH_TEMPLATES[style] || DATA.PARAGRAPH_TEMPLATES.plainspoken;

        const paragraphs = [];

        for (const step of steps) {
            if (step.type === "solo") {
                const text = (beats[step.beat] || "").trim();
                if (!text) {
                    if (step.optional) continue;
                    continue;
                }
                paragraphs.push(ensureSentenceCase(text));
            }

            if (step.type === "merge") {
                // Legendary refinement: avoid merging long mythic beats
                if (
                    step.type === "merge" &&
                    style === "mythic" &&
                    beats.creator &&
                    beats.detail &&
                    !isShortSentence(beats.detail)
                ) {
                    paragraphs.push(ensureSentenceCase(beats.creator));
                    paragraphs.push(ensureSentenceCase(beats.detail));
                    continue;
                }

                const mergedParts = [];
                for (const b of step.beats) {
                    let t = (beats[b] || "").trim();
                    if (mergedParts.length > 0) {
                        t = ensureSentenceCase(stripLeadingOpener(t));
                    }
                    if (t) mergedParts.push(t);
                }

                if (!mergedParts.length) {
                    if (step.optional) continue;
                    continue;
                }

                const merged = joinWithConnectors(mergedParts, style);
                paragraphs.push(merged);
            }
        }

        // If a style produced too little (e.g., optional beats missing), fall back gracefully
        if (paragraphs.length < 2) {
            const fallbackParts = [beats.creator, beats.detail, beats.motive, beats.provenance].filter(Boolean);

            return joinWithConnectors(fallbackParts, style);
        }
        return paragraphs.join("\n\n");
    }

    function chooseTemplateStyle(rarity) {
        const weights = DATA.TEMPLATE_STYLE_WEIGHTS_BY_RARITY?.[rarity];
        return weightedPickKey(weights) || "plainspoken";
    }

    function applyOpener(openerPool, sentence) {
        const opener = pick(openerPool);
        const embedded = decapitalizeForEmbedding(cleanSentence(sentence));
        const line = opener.replace("{s}", embedded);
        // Ensure exactly one period at the end
        return line.endsWith(".") ? line : line + ".";
    }

    function creatorIntroLine(creatorName, alignmentEnding) {
        const template = pick(DATA.OPENERS.creator);

        return template.replace("{creator}", creatorName).replace("{ending}", cleanSentence(alignmentEnding));
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

    function buildBackstory(rarity, tone) {
        const { creatorName, alignment, creatorDetail } = chooseCreator(rarity, tone);

        const alignmentEnding = creatorAlignmentEnding(alignment);
        const creatorSentence = creatorIntroLine(creatorName, alignmentEnding);

        // Detail: keep as a plain sentence (avoid rumor openers in the opening paragraph)
        const detailSentence = normalizeSentenceForInline(creatorDetail);

        // Motive: motiveFor() returns both alignmentKey and a sentence
        const { alignmentKey, sentence: motiveLine } = motiveFor(rarity, alignment);
        const motiveSentence = normalizeSentenceForInline(motiveLine);

        // Provenance: optional, alignment-aware pool
        let provenanceSentence = "";
        const provenancePool =
            DATA.PROVENANCE_DETAILS[rarity]?.[alignmentKey] || DATA.PROVENANCE_DETAILS[rarity]?.neutral || [];

        if (provenancePool.length && Math.random() < 0.6) {
            const raw = pick(provenancePool);
            const provLine = hasTemporalLead(raw) ? raw : applyOpener(DATA.OPENERS.provenance, raw);

            provenanceSentence = normalizeSentenceForInline(provLine);
        }

        // Build the opening paragraph: creator + detail + motive + provenance
        // No line breaks; weighted connectors handle punctuation between sentences.
        const parts = [inlineWhitespace(creatorSentence), detailSentence, motiveSentence, provenanceSentence].filter(
            Boolean
        );

        // Use a connector style based on rarity (you already have chooseTemplateStyle weighted)
        const style = chooseTemplateStyle(rarity);
        return joinWithConnectors(parts, style);
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
