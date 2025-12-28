// js/data.js
// Pure data + configuration (no DOM, no generation logic)

window.BACKSTORY_DATA = {
    ALIGNMENTS: ["LG", "NG", "CG", "LN", "N", "CN", "LE", "NE", "CE"],

    RARITY_POWER: {
        common: { min: 1, max: 2 },
        uncommon: { min: 2, max: 3 },
        rare: { min: 3, max: 4 },
        "very rare": { min: 4, max: 5 },
        legendary: { min: 5, max: 5 },
    },

    // Rarity-based chance to choose a monstrous creator
    MONSTROUS_CHANCE: {
        common: 0.1,
        uncommon: 0.2,
        rare: 0.4,
        "very rare": 0.6,
        legendary: 0.75,
    },
	
	GROUP_SIZES: ["solo", "pair", "small_group", "organization", "court"],

	GROUP_SIZE_WEIGHTS_BY_RARITY: {
	  common:       { solo: 80, pair: 10, small_group: 8, organization: 2, court: 0 },
	  uncommon:     { solo: 60, pair: 12, small_group: 18, organization: 8, court: 2 },
	  rare:         { solo: 35, pair: 10, small_group: 25, organization: 20, court: 10 },
	  "very rare":  { solo: 20, pair: 5,  small_group: 20, organization: 25, court: 30 },
	  legendary:    { solo: 20, pair: 3,  small_group: 17, organization: 25, court: 35 }
	},


    CREATOR_POOLS: {
        monstrous: [
            // Fey & shadow
            {
                name: "an archfey retinue",
                power: 5,
				groupSize: "court",
                alignWeights: { CG: 3, CN: 3, CE: 2 },
                extraSentences: [
                    "Time behaved strangely during its making, as if the hours were negotiable.",
                    "Those present remembered music where none was playing.",
                ],
            },
            {
                name: "a coven of hags",
                power: 4,
				groupSize: "small_group",
                alignWeights: { CE: 4, NE: 3, CN: 2, N: 1 },
                extraSentences: [
                    "No one agreed on the payment—only on what it would cost.",
                    "Witnesses describe the process as a bargain woven with soul-rot.",
                ],
            },
            {
                name: "a conclave of dark elves",
                power: 4,
				groupSize: "small_group",
                alignWeights: { LE: 3, NE: 3, CE: 1 },
                extraSentences: [
                    "The work was completed behind veils and wards meant to mislead the curious.",
                    "Its creation was treated as both ceremony and warning.",
                ],
            },

            // Infernal / abyssal
            {
                name: "a devil’s artisan",
                power: 5,
				groupSize: "solo",
                alignWeights: { LE: 6, NE: 2, LN: 1 },
                extraSentences: [
                    "Every step was recorded as if craft and contract were the same thing.",
                    "Those involved insisted on exact wording, even when no one was speaking.",
                ],
            },
            {
                name: "an abyssal cult circle",
                power: 4,
				groupSize: "small_group",
                alignWeights: { CE: 6, NE: 2, CN: 1 },
                extraSentences: [
                    "The making was more frenzy than ritual, yet somehow it still held together.",
                    "The air around the work felt wrong for days afterward.",
                ],
            },
            {
                name: "a yugoloth broker",
                power: 5,
				groupSize: "solo",
                alignWeights: { NE: 6, LE: 2, N: 1 },
                extraSentences: [
                    "The maker treated the work like a transaction, not a tradition.",
                    "Payment changed hands more than once before the work was finished.",
                ],
            },

            // Undead / death
            {
                name: "a lich",
                power: 5,
				groupSize: "solo",
                alignWeights: { LE: 4, NE: 3 },
                extraSentences: [
                    "Its maker recorded every step in a ledger written to outlast flesh and ink.",
                    "The craft was treated like a proof: immaculate, cold, and difficult to argue with.",
                ],
            },
            {
                name: "a deathless court of ancient spirits",
                power: 5,
                alignWeights: { LN: 3, N: 3, LE: 2, NG: 1 },
                extraSentences: [
                    "The work was performed with solemn patience, as if time itself were an offering.",
                    "Those present spoke in vows, not in plans.",
                ],
            },
            {
                name: "a vampire lord",
                power: 4,
                alignWeights: { LE: 4, NE: 3 },
                extraSentences: [
                    "The work was done by lamplight and secrecy, with servants sworn to silence.",
                    "The maker demanded discretion as part of the craft.",
                ],
            },

            // Dragons & giants
            {
                name: "an ancient dragon",
                power: 5,
                alignWeights: { LE: 3, NG: 3, NE: 2, CE: 2, LG: 1, N: 1 },
                extraSentences: [
                    "Its creation was treated as tribute, whether or not tribute was asked.",
                    "Those who assisted later disagreed on whether they had been honored or used.",
                ],
            },
            {
                name: "a giant thane’s forge-clan",
                power: 4,
                alignWeights: { LN: 3, LG: 2, N: 2, LE: 1 },
                extraSentences: [
                    "The work was tested against force and weather before anyone called it finished.",
                    "Each step was measured by tradition older than most kingdoms.",
                ],
            },

            // Elemental / outsider courts
            {
                name: "a marid court",
                power: 5,
				groupSize: "court",
                alignWeights: { LN: 3, N: 2, CN: 2, LG: 1 },
                extraSentences: [
                    "The making was as much performance as craft, witnessed by those who mattered.",
                    "The work was sealed with formalities that felt older than law.",
                ],
            },
            {
                name: "an efreeti foundry-house",
                power: 5,
                alignWeights: { LE: 4, LN: 3, NE: 1 },
                extraSentences: [
                    "The work was completed under strict terms and hotter tempers.",
                    "Those who watched swore the heat carried meaning, not just pain.",
                ],
            },
            {
                name: "a dao crystal-ledger syndicate",
                power: 5,
                alignWeights: { LE: 3, NE: 3, LN: 2 },
                extraSentences: [
                    "The maker spoke of value the way priests speak of sin.",
                    "The work was weighed and appraised at every stage, as if it could be audited.",
                ],
            },

            // Aberrant / ancient
            {
                name: "a mind flayer enclave",
                power: 5,
                alignWeights: { LE: 2, NE: 6 },
                extraSentences: [
                    "Those involved struggled to recall the process in a coherent sequence.",
                    "The making left behind a discomfort that lingered like a half-remembered dream.",
                ],
            },
            {
                name: "a beholder’s paranoid workshop",
                power: 4,
                alignWeights: { NE: 4, CE: 3, CN: 1 },
                extraSentences: [
                    "The work was revised obsessively, as if the maker expected betrayal from the material itself.",
                    "No two witnesses described the same sequence of steps.",
                ],
            },

            // Celestial (still “monstrous” per your rule—no classes)
            {
                name: "a celestial choir",
                power: 5,
                alignWeights: { LG: 5, NG: 3, LN: 2 },
                extraSentences: [
                    "The work was accompanied by rites that felt like law written in song.",
                    "Those present described the process as cleansing, even when it was difficult.",
                ],
            },
        ],

        mortal: [
            // Common / Uncommon core peoples
            {
                name: "a human artisan",
                power: 1,
                alignWeights: { LG: 2, LN: 2, N: 2, NG: 1 },
                extraSentences: [
                    "The maker’s mark was small, but unmistakably proud.",
                    "The work was finished quickly, yet not carelessly.",
                ],
            },
            {
                name: "a halfling merchant guild",
                power: 1,
				groupSize: "organization",
                alignWeights: { LN: 2, NG: 2, N: 2 },
                extraSentences: [
                    "There were receipts, witnesses, and a paper trail—until there suddenly weren’t.",
                    "The commission was treated like routine business, which made later questions awkward.",
                ],
            },
            {
                name: "a dwarven runesmith",
                power: 2,
				groupSize: "solo",
                alignWeights: { LG: 2, LN: 3, N: 1 },
                extraSentences: [
                    "Every decision was measured twice—once for function, once for pride.",
                    "The maker refused to sign their name until the last mark was perfect.",
                ],
            },
            {
                name: "an elven loremaster",
                power: 3,
                alignWeights: { NG: 2, LG: 1, N: 2, LN: 1 },
                extraSentences: [
                    "The work was surrounded by annotations, corrections, and marginal warnings.",
                    "The maker treated the process as scholarship as much as craft.",
                ],
            },
            {
                name: "a half-elf wizard",
                power: 3,
                alignWeights: { NG: 2, CG: 2, N: 2, CN: 1 },
                extraSentences: [
                    "The maker worked from conviction more than instruction, guided by conscience over custom.",
                    "The work was interrupted more than once by insight that demanded revision.",
                ],
            },
            {
                name: "a gnomish enchanter",
                power: 2,
                alignWeights: { CG: 2, NG: 2, N: 2, CN: 1 },
                extraSentences: [
                    "The process was methodical, but punctuated by sudden leaps of inspiration.",
                    "The maker tested the work obsessively, delighted whenever it behaved unexpectedly.",
                ],
            },
            {
                name: "a goliath oath-keeper",
                power: 2,
                alignWeights: { LG: 2, LN: 2, NG: 1, N: 1 },
                extraSentences: [
                    "The maker treated the craft like a promise that could be carried.",
                    "Nothing about the process was rushed, as if speed would be disrespect.",
                ],
            },

            // Higher-power mortal makers
            // --- Low-power mortal creators (Common/Uncommon) ---
            {
                name: "a village hedge-mage",
                power: 1,
                alignWeights: { NG: 2, N: 3, CG: 1, LN: 1 },
                extraSentences: [
                    "The work was done between chores and favors, with practical improvisation.",
                    "The maker used familiar tools and uncommon patience.",
                ],
            },
            {
                name: "a traveling peddler-artificer",
                power: 1,
                alignWeights: { CN: 2, N: 3, NG: 1, LN: 1 },
                extraSentences: [
                    "The work was assembled on the road, tested whenever the weather changed.",
                    "The maker treated the craft like a trick worth perfecting.",
                ],
            },
            {
                name: "a town apothecary",
                power: 1,
                alignWeights: { NG: 2, N: 3, LN: 1 },
                extraSentences: [
                    "The maker insisted on careful measurements, even when no one was watching.",
                    "The process smelled of herbs, ink, and stubborn diligence.",
                ],
            },
            {
                name: "a roadside shrine-keeper",
                power: 1,
                alignWeights: { LG: 2, NG: 2, LN: 1, N: 1 },
                extraSentences: [
                    "The work was completed as an act of service, not ambition.",
                    "Those present described the process as quiet, reverent, and practical.",
                ],
            },
            {
                name: "a local temple sacristan",
                power: 1,
                alignWeights: { LG: 3, LN: 2, NG: 1 },
                extraSentences: [
                    "The commission came with rules, blessings, and a list of things not to do.",
                    "The maker treated cleanliness and order as part of the craft.",
                ],
            },
            {
                name: "a city watch armorer",
                power: 1,
                alignWeights: { LN: 3, LG: 1, N: 2 },
                extraSentences: [
                    "The maker favored reliability over flair, and proved it with tests.",
                    "Every choice was justified as if it might be reviewed later.",
                ],
            },
            {
                name: "a dockside ropewright and chandlers’ cooperative",
                power: 1,
                alignWeights: { N: 3, LN: 2, NG: 1 },
                extraSentences: [
                    "The work was treated like a matter of livelihood, not legend.",
                    "The maker valued sturdiness, because failure would be public and costly.",
                ],
            },
            {
                name: "a frontier trapper’s kin-clan",
                power: 1,
                alignWeights: { N: 3, CN: 2, NG: 1 },
                extraSentences: [
                    "The work was practical first, shaped by hard lessons and harsher weather.",
                    "Those involved argued about details the way families argue about stories.",
                ],
            },
            {
                name: "a dwarven journeyman smith",
                power: 1,
                alignWeights: { LN: 3, LG: 1, N: 2 },
                extraSentences: [
                    "The maker followed guild habits even when no guildhall was near.",
                    "The work shows the confidence of someone learning by doing.",
                ],
            },
            {
                name: "an elven village craft-singer",
                power: 2,
                alignWeights: { NG: 2, CG: 2, N: 2, LG: 1 },
                extraSentences: [
                    "The maker treated the process as tradition performed, not merely work completed.",
                    "Witnesses recalled repetition, patience, and a sense of inherited practice.",
                ],
            },
            {
                name: "a halfling family tinker",
                power: 1,
                alignWeights: { NG: 2, CG: 2, N: 2, CN: 1 },
                extraSentences: [
                    "The maker tested the work in everyday ways, then quietly improved it.",
                    "Nothing about the process looked impressive—until it proved reliable.",
                ],
            },
            {
                name: "a gnomish clock-shop apprentice",
                power: 1,
                alignWeights: { NG: 2, N: 2, CG: 2, CN: 1 },
                extraSentences: [
                    "The maker’s notes were messy, but the work itself was careful.",
                    "The craft shows the enthusiasm of someone still delighted by how things function.",
                ],
            },
            {
                name: "a human scribe of minor ordinances",
                power: 1,
                alignWeights: { LN: 3, N: 2, LG: 1 },
                extraSentences: [
                    "The commission was documented with excessive thoroughness for something so small.",
                    "The maker treated procedure as a kind of safety.",
                ],
            },
            {
                name: "a goblin salvage-collector",
                power: 1,
                alignWeights: { CN: 2, N: 2, NE: 2, CG: 1 },
                extraSentences: [
                    "The work was pieced together from what was available and what was stolen back.",
                    "The maker’s methods were questionable; the result was harder to dismiss.",
                ],
            },
            {
                name: "a half-orc caravan guard-captain",
                power: 1,
                alignWeights: { N: 3, LN: 2, NG: 1, CN: 1 },
                extraSentences: [
                    "The work was designed with travel in mind and danger assumed.",
                    "Those involved cared less about beauty than about survival.",
                ],
            },
            {
                name: "a rural midwife with old charms",
                power: 1,
                alignWeights: { NG: 3, N: 2, CG: 1 },
                extraSentences: [
                    "The work was made with steady hands and a practical kind of kindness.",
                    "The maker spoke of tradition the way others speak of medicine.",
                ],
            },
            {
                name: "a fisher-priest of the river saints",
                power: 1,
                alignWeights: { NG: 2, LG: 1, N: 3 },
                extraSentences: [
                    "The work was completed between tides, with rituals that looked like habit.",
                    "The maker treated luck as something you could cultivate with patience.",
                ],
            },
            {
                name: "a borderland storyteller-scrivener",
                power: 1,
                alignWeights: { CN: 2, N: 2, NG: 1, CG: 2 },
                extraSentences: [
                    "The work was shaped as much by story as by need.",
                    "Those present argued about what it meant long before they agreed it was finished.",
                ],
            },
            {
                name: "a municipal lamplighter’s guild",
                power: 1,
                alignWeights: { LN: 3, N: 2, NG: 1 },
                extraSentences: [
                    "The commission was treated like civic maintenance, not heroics.",
                    "The maker cared deeply about small failures, because small failures multiply.",
                ],
            },
            {
                name: "a retired soldier turned small-town smith",
                power: 1,
                alignWeights: { N: 3, LN: 2, NG: 1, LG: 1 },
                extraSentences: [
                    "The work reflects hard experience: simple choices, thoroughly tested.",
                    "The maker built it the way they once packed a kit—only what mattered.",
                ],
            },
            {
                name: "a dwarven brewer with runic labels",
                power: 1,
                alignWeights: { N: 2, NG: 2, LN: 2, CG: 1 },
                extraSentences: [
                    "The work began as a joke, then became tradition, then became serious.",
                    "The maker insisted the small details were the whole point.",
                ],
            },
            {
                name: "a tiefling bookbinder",
                power: 1,
                alignWeights: { N: 2, CN: 2, NE: 2, NG: 1 },
                extraSentences: [
                    "The work was finished with meticulous care that made others uneasy.",
                    "The maker preferred quiet labor and locked doors.",
                ],
            },
            {
                name: "an elven orchard-warden",
                power: 2,
                alignWeights: { NG: 2, N: 3, LG: 1, CG: 1 },
                extraSentences: [
                    "The work was treated like stewardship—patient, seasonal, and deliberate.",
                    "Those involved spoke of balance more than victory.",
                ],
            },
            {
                name: "a human innkeeper with a talent for small enchantments",
                power: 1,
                alignWeights: { NG: 2, N: 2, CG: 1, LN: 1 },
                extraSentences: [
                    "The work was made between guests and interruptions, which forced clever shortcuts.",
                    "The maker swore it was nothing special, even when it clearly was.",
                ],
            },
            {
                name: "a young noble dilettante",
                power: 1,
                alignWeights: { CN: 2, N: 2, LN: 2, NE: 1 },
                extraSentences: [
                    "The work was commissioned more for reputation than necessity.",
                    "The maker’s involvement was enthusiastic, inconsistent, and expensive.",
                ],
            },
            {
                name: "a tiefling warlock",
                power: 4,
                alignWeights: { CN: 2, NE: 2, N: 1, CE: 1 },
                extraSentences: [
                    "The work was finished with the air of someone repaying a debt they didn’t fully acknowledge.",
                    "A witness later insisted the maker negotiated with an empty corner of the room.",
                ],
            },
            {
                name: "a dragonborn oath-sworn knight",
                power: 3,
                alignWeights: { LG: 2, LN: 2, LE: 1, NG: 1 },
                extraSentences: [
                    "The commission was treated like a duty, not a favor.",
                    "Those involved spoke more about honor than about success.",
                ],
            },
            {
                name: "a human court arcanist",
                power: 4,
                alignWeights: { LN: 3, LG: 1, LE: 1, N: 1 },
                extraSentences: [
                    "The work was conducted under supervision, with rules posted like prayers.",
                    "The maker’s notes read like policy, which made the result feel inevitable.",
                ],
            },
            {
                name: "a dwarven high priest-artisan",
                power: 4,
                alignWeights: { LG: 3, LN: 2, NG: 1 },
                extraSentences: [
                    "The work was treated as sacred labor, and interruptions were not welcomed.",
                    "Those present described the process as both craft and confession.",
                ],
            },
            {
                name: "an elven bladesinger",
                power: 4,
                alignWeights: { CG: 2, NG: 2, LG: 1, CN: 1 },
                extraSentences: [
                    "The maker moved as though the process were choreography, not labor.",
                    "The work was revised until it felt effortless—then revised again.",
                ],
            },

            // Organizations / patrons (still mortal)
            {
                name: "a human noble house",
                power: 2,
                alignWeights: { LN: 2, LG: 1, LE: 1, N: 1 },
                extraSentences: [
                    "The commission came with etiquette, witnesses, and carefully chosen words.",
                    "There was more politics in the paperwork than in the craft.",
                ],
            },
            {
                name: "a dwarven mining consortium",
                power: 2,
                alignWeights: { LN: 3, N: 2, LE: 1 },
                extraSentences: [
                    "The work was valued for reliability, not beauty—at least officially.",
                    "The commission was framed as practical necessity, though the stakes suggested otherwise.",
                ],
            },
            {
                name: "a secretive arcane cabal",
                power: 4,
                alignWeights: { LN: 2, N: 2, NE: 2, LE: 1 },
                extraSentences: [
                    "The work was divided into stages so no single person understood the whole.",
                    "Witnesses described the process as controlled, careful, and unnervingly quiet.",
                ],
            },
        ],
    },

    CREATOR_FALLBACK_SENTENCES: {
        good: {
            lawful: [
                "The work was undertaken as a duty, with care taken to avoid needless harm.",
                "The maker treated the craft like an oath: precise, deliberate, and meant to endure.",
            ],
            nonlawful: [
                "The maker worked from conviction more than instruction, guided by conscience over custom.",
                "It was created with an earnest intent, even if the method was unconventional.",
            ],
        },
        evil: {
            lawful: [
                "The work followed strict terms—each step a clause, each choice a restraint turned into leverage.",
                "The maker kept the process orderly, as though cruelty could be made respectable by rules.",
            ],
            nonlawful: [
                "The work was driven by appetite rather than principle, and restraint never entered the design.",
                "The maker treated consequences as someone else’s problem, and called it freedom.",
            ],
        },
        neutral: {
            chaotic: [
                "The work was improvised in bursts of inspiration, changing course whenever it needed to.",
                "The maker seemed more interested in what might happen than in what should.",
            ],
            nonchaotic: [
                "The maker approached the work pragmatically, valuing results over reputation.",
                "The craft was careful and unsentimental, built to serve its purpose and nothing more.",
            ],
        },
    },

    ALIGNMENT_ADJECTIVES: {
        LG: ["upright", "vowed", "steadfast"],
        NG: ["kindly", "protective", "patient"],
        CG: ["defiant", "bright-hearted", "reckless"],
        LN: ["formal", "dutiful", "precise"],
        N: ["measured", "pragmatic", "unmoved"],
        CN: ["unruly", "impulsive", "laughing"],
        LE: ["unyielding", "calculating", "severe"],
        NE: ["cold", "self-serving", "unsparing"],
        CE: ["ravaging", "spiteful", "blasphemous"],
    },

    // Which paragraph template styles are allowed per rarity
    TEMPLATE_STYLE_WEIGHTS_BY_RARITY: {
        common: {
            plainspoken: 90,
            chronicle: 10,
        },
        uncommon: {
            plainspoken: 55,
            chronicle: 35,
            scholarly: 10,
        },
        rare: {
            chronicle: 45,
            scholarly: 40,
            mythic: 15,
        },
        "very rare": {
            mythic: 55,
            scholarly: 35,
            chronicle: 10,
        },
        legendary: {
            mythic: 65,
            scholarly: 30,
            chronicle: 5,
            plainspoken: 0,
        },
    },

    // Paragraph templates define how beats are grouped/merged
    // Available beat keys: creator, detail, motive, provenance
    // "merge" joins multiple beats into one paragraph with a connector.
    PARAGRAPH_TEMPLATES: {
        plainspoken: [
            { type: "solo", beat: "creator" },
            { type: "merge", beats: ["motive", "provenance"], connector: " " },
            { type: "solo", beat: "detail", optional: true },
        ],

        chronicle: [
            { type: "solo", beat: "creator" },
            { type: "solo", beat: "detail" },
            { type: "merge", beats: ["motive", "provenance"], connector: " " },
        ],

        mythic: [
            { type: "merge", beats: ["creator", "detail"], connector: " " },
            { type: "solo", beat: "motive" },
            { type: "solo", beat: "provenance", optional: true },
        ],

        scholarly: [
            { type: "solo", beat: "creator" },
            { type: "merge", beats: ["detail", "provenance"], connector: " " },
            { type: "solo", beat: "motive" },
        ],
    },

    OPENERS: {
        creator: [
            "Created by {creator}, {ending}.",
			"Wrought by {creator}, {ending}.",
			"Fashioned by {creator}, {ending}.",
			"Brought into being by {creator}, {ending}."
        ],

        // Use these for creatorDetail / provenance / motive lines (when they’re single sentences)
        detail: [
            "{s}",
            "The tale goes that {s}",
            "Some records claim {s}",
            "Tradition holds that {s}",
            "Those close to the story say {s}",
            "It’s said {s}",
        ],

        motive: [
            "It was made to {s}",
            "It was created to {s}",
            "Its purpose was to {s}",
            "The intention was clear: {s}",
            "At its heart, it was meant to {s}",
        ],

        provenance: [
            "Afterward, {s}",
            "In time, {s}",
            "From the start, {s}",
            "Later accounts agree on one detail: {s}",
            "Notably, {s}",
        ],
    },

    // Connectors let you merge two thoughts without repeating a new sentence starter
    CONNECTORS: {
        soft: ["and", "while", "though", "even as"],
        consequence: ["so that", "ensuring that", "in the hope that", "with the expectation that"],
    },

    CONNECTOR_WEIGHTS_BY_STYLE: {
        plainspoken: {
            default: { " ": 80, " — ": 10, "; ": 10 },
        },
        chronicle: {
            default: { " ": 55, "; ": 35, " — ": 10 },
        },
        mythic: {
            default: { " — ": 45, "; ": 35, " ": 20 },
        },
        scholarly: {
            default: { "; ": 55, " ": 35, " — ": 10 },
        },
    },

    MOTIVE_BASE: {
        common: {
            good: [
                "provide reliable aid without drawing attention",
                "serve an everyday need with quiet care for others",
            ],
            neutral: [
                "fulfill a modest commission with no expectation of legacy",
                "serve a practical purpose and little more",
            ],
            evil: [
                "satisfy a small demand whose consequences belonged to someone else",
                "meet a request without concern for how it might later be used",
            ],
        },

        uncommon: {
            good: [
                "answer a personal request and settle a small debt of honor",
                "quietly help someone who could not ask openly",
            ],
            neutral: [
                "support a local rite meant to ward off a familiar fear",
                "serve a purpose shaped as much by tradition as by need",
            ],
            evil: [
                "fulfill a private request best left unrecorded",
                "serve a purpose its commissioner preferred not to explain",
            ],
        },

        rare: {
            good: [
                "honor a specific deed and bind gratitude into lasting form",
                "stand as proof that sacrifice had been seen and remembered",
            ],
            neutral: [
                "mark a significant deed while concealing its full cost",
                "complete a serious ritual whose success affected more than one life",
            ],
            evil: [
                "reward loyalty while ensuring it could not be withdrawn",
                "commemorate a victory others were encouraged to forget",
            ],
        },

        "very rare": {
            good: [
                "avert a catastrophe even if no one would ever know it succeeded",
                "stand against a future too grim to risk unchallenged",
            ],
            neutral: ["seal a pact and endure its consequences", "prevent disaster while deferring its true price"],
            evil: [
                "formalize a bargain whose terms favored only one side",
                "ensure a coming disaster unfolded in a controllable way",
            ],
        },

        legendary: {
            good: [
                "change the course of history for the better regardless of cost",
                "defy prophecy to give mortals one last chance",
            ],
            neutral: [
                "tip the balance of an age or prevent it from tipping at all",
                "reshape the future through will rather than permission",
            ],
            evil: [
                "secure dominion that time and death could not erode",
                "ensure that when the world broke, it broke in the right direction",
            ],
        },
    },

    PROVENANCE_DETAILS: {
        uncommon: [
            "The commission was handled discreetly, with few records kept.",
            "The maker required that it pass through as few hands as possible.",
        ],
        rare: [
            "Only a small circle witnessed its completion, and not all of them approved.",
            "Its creation was documented, then deliberately obscured.",
        ],
        "very rare": [
            "Its making required concessions that could not be fully undone.",
            "Those involved disagreed on whether it should ever be used.",
        ],
        legendary: [
            "Accounts of its creation contradict one another in troubling ways.",
            "Even now, scholars debate whether it was meant to be found.",
        ],
    },

    ALIGNMENT_TWISTS: {
        good: {
            lawful: [
                "It was meant to protect others—even from themselves.",
                "It was meant to uphold a vow no one else could keep.",
            ],
            nonlawful: [
                "It was meant to free someone who could not be freed by ordinary means.",
                "It was meant to restore what rules and rulers refused to return.",
            ],
        },
        evil: {
            lawful: [
                "It was meant to bind a promise no one could safely break.",
                "It was meant to turn duty into a leash.",
            ],
            nonlawful: [
                "It was meant to take what could not be taken openly.",
                "It was meant to make a lesson out of resistance.",
            ],
        },
        neutral: {
            chaotic: [
                "It was meant to upend a stalemate and see what survived.",
                "It was meant to test fate by giving it something sharp to trip over.",
            ],
            nonchaotic: [
                "It was meant to keep the scales from tipping too far in any direction.",
                "It was meant to endure—useful to whoever held it, and loyal to no one.",
            ],
        },
    },

    CREATOR_ALIGNMENT_ENDINGS: {
        good: {
            lawful: [
                "known for a strict sense of duty and carefully kept vows",
                "whose work reflected a belief that order exists to protect others",
            ],
            nonlawful: [
                "guided more by conscience than tradition",
                "compassion often outweighed respect for custom",
            ],
        },
        evil: {
            lawful: [
                "methods were precise, contractual, and unforgiving",
                "believed control was simply another form of responsibility",
            ],
            nonlawful: [
                "driven by ambition with little concern for consequence",
                "actions were guided by appetite rather than restraint",
            ],
        },
        neutral: {
            chaotic: [
                "priorities shifted as easily as circumstance allowed",
                "more curious about outcomes than obligations",
            ],
            nonchaotic: [
                "known for a pragmatic outlook and measured decisions",
                "valued results over reputation or ideology",
            ],
        },
    },
};
