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
        common: { solo: 80, pair: 10, small_group: 8, organization: 2, court: 0 },
        uncommon: { solo: 60, pair: 12, small_group: 18, organization: 8, court: 2 },
        rare: { solo: 35, pair: 10, small_group: 25, organization: 20, court: 10 },
        "very rare": { solo: 20, pair: 5, small_group: 20, organization: 25, court: 30 },
        legendary: { solo: 20, pair: 3, small_group: 17, organization: 25, court: 35 },
    },

    CREATOR_POOLS: {
        monstrous: [
            // Minor monstrous creators
            {
                name: "a minor fae trickster",
                power: 2,
                groupSize: "solo",
                alignWeights: { CN: 3, CG: 2, CE: 1 },
                extraSentences: [
                    "The work was shaped by whim more than plan.",
                    "Those involved later disagreed on whether it was a gift or a joke.",
                ],
            },
            {
                name: "an impish contract-scrivener",
                power: 2,
                groupSize: "solo",
                alignWeights: { LE: 4, NE: 2 },
                extraSentences: [
                    "The terms were clear, even if their implications were not.",
                    "No effort was made to explain what would happen if they were broken.",
                ],
            },
            {
                name: "a mephit coterie",
                power: 2,
                groupSize: "small_group",
                alignWeights: { CN: 3, NE: 2 },
                extraSentences: [
                    "The work showed signs of frequent revision and disagreement.",
                    "Completion seemed more accidental than planned.",
                ],
            },
            {
                name: "a minor celestial watcher",
                power: 2,
                groupSize: "solo",
                alignWeights: { LG: 3, NG: 2 },
                extraSentences: [
                    "The work was completed with care meant to avoid unintended harm.",
                    "Its maker acted under guidance rather than authority.",
                ],
            },
            {
                name: "a band of industrious pechs",
                power: 2,
                groupSize: "small_group",
                alignWeights: { LN: 4, LG: 1 },
                extraSentences: [
                    "The work followed terms established long before the maker was summoned.",
                    "Completion was considered an obligation rather than a choice.",
                ],
            },
            {
                name: "a pseudodragon",
                power: 2,
                groupSize: "solo",
                alignWeights: { LG: 2, NG: 2, LN: 1 },
                extraSentences: [
                    "The work bore signs of restraint imposed by older rules.",
                    "Its maker showed little interest in recognition.",
                ],
            },
            {
                name: "a celestial warden",
                power: 3,
                groupSize: "solo",
                alignWeights: { LG: 4, LN: 1 },
                extraSentences: [
                    "The work was undertaken as a duty rather than a favor.",
                    "Failure was not considered an acceptable outcome.",
                ],
            },
            {
                name: "a lesser celestial envoy",
                power: 3,
                groupSize: "solo",
                alignWeights: { LG: 3, NG: 2 },
                extraSentences: [
                    "The work followed a mandate that allowed little flexibility.",
                    "Its maker believed restraint was the highest form of mercy.",
                ],
            },
            {
                name: "an oathbound construct-adjudicator",
                power: 3,
                groupSize: "solo",
                alignWeights: { LN: 4, N: 1 },
                extraSentences: [
                    "The work was evaluated against strict predefined terms.",
                    "Its maker required frequent clarifications and definitions.",
                ],
            },
            {
                name: "a spriggan grove-warden",
                power: 3,
                groupSize: "solo",
                alignWeights: { CG: 2, NG: 2, CN: 2 },
                extraSentences: [
                    "The work bore marks of the wild rather than the workshop.",
                    "Its creation followed cycles not recorded in any calendar.",
                ],
            },
            {
                name: "a lamia atelier",
                power: 3,
                groupSize: "small_group",
                alignWeights: { NE: 3, CE: 2 },
                extraSentences: [
                    "The work was designed to entice before it constrained.",
                    "Those involved later questioned when consent truly ended.",
                ],
            },
            {
                name: "a lesser fiendish notary",
                power: 3,
                groupSize: "solo",
                alignWeights: { LE: 3, NE: 2 },
                extraSentences: [
                    "Every step was recorded, though not all records were shared.",
                    "The maker insisted the arrangement was entirely fair.",
                ],
            },
            {
                name: "a lesser angelic tribunal",
                power: 4,
                groupSize: "small_group",
                alignWeights: { LG: 4, LN: 1 },
                extraSentences: [
                    "The work was debated extensively before any action was taken.",
                    "Consensus was reached only after concessions were made.",
                ],
            },
            {
                name: "an ancient treant guardian",
                power: 4,
                groupSize: "solo",
                alignWeights: { NG: 4, N: 1 },
                extraSentences: [
                    "The work followed cycles indifferent to mortal urgency.",
                    "Its maker valued continuity over resolution.",
                ],
            },
            {
                name: "an exalted fey champion",
                power: 4,
                groupSize: "solo",
                alignWeights: { CG: 4, CN: 1 },
                extraSentences: [
                    "The work was shaped by passion rather than patience.",
                    "Its maker acted without waiting for permission.",
                ],
            },
            // Fey & shadow
            {
                name: "an archfey retinue",
                power: 5,
                groupSize: "court",
                alignWeights: { CG: 3, CN: 3, CE: 2, NE: 1 },
                extraSentences: [
                    "Time behaved strangely during its making, as if the hours were negotiable.",
                    "Those present remembered music where none was playing.",
                ],
            },
            {
                name: "a coven of hags",
                power: 4,
                groupSize: "small_group",
                alignWeights: { CE: 4, NE: 3 },
                extraSentences: [
                    "The cost of its creation would be discussed, and taken, at a later time.",
                    "Witnesses describe the process as a bargain woven with soul-rot.",
                ],
            },
            {
                name: "a green hag",
                power: 3,
                groupSize: "solo",
                alignWeights: { CE: 4, NE: 3 },
                extraSentences: [
                    "The cost of its creation would be discussed, and taken, at a later time.",
                    "Witnesses describe the creation as a treacherous cauldron-born bargain.",
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
                groupSize: "court",
                alignWeights: { LN: 3, N: 3, LE: 2, NG: 1 },
                extraSentences: [
                    "The work was performed with solemn patience, as if time itself were an offering.",
                    "Those present spoke in vows, not in plans.",
                ],
            },
            {
                name: "a vampire lord",
                power: 4,
                groupSize: "solo",
                alignWeights: { LE: 4, NE: 3 },
                extraSentences: [
                    "The work was done by lamplight and secrecy, with servants sworn to silence.",
                    "The maker demanded discretion as part of the craft.",
                ],
            },

            // Dragons & giants
            {
                name: "an ancient metallic dragon",
                power: 5,
                groupSize: "solo",
                alignWeights: { LG: 4, NG: 4, CG: 2, LN: 1 },
                extraSentences: [
                    "Its creation was treated as a duty that outlived kingdoms.",
                    "Those who assisted later disagreed on whether they had been honored or tested.",
                ],
            },
            {
                name: "an ancient chromatic dragon",
                power: 5,
                groupSize: "solo",
                alignWeights: { CE: 4, NE: 4, LE: 2, CN: 1 },
                extraSentences: [
                    "Its creation was treated as tribute, whether or not tribute was asked.",
                    "Those who assisted later disagreed on whether they had been honored or used.",
                ],
            },
            {
                name: "an ancient dragon of inscrutable design",
                power: 5,
                groupSize: "solo",
                alignWeights: { N: 5, LN: 2, CN: 2, NG: 1, NE: 1 },
                extraSentences: [
                    "The work proceeded with unsettling patience, as if the outcome mattered more than the era.",
                    "Those who watched could not agree whether the maker was benevolent or merely careful.",
                ],
            },
            {
                name: "a giant thane’s forge-clan",
                power: 4,
                groupSize: "small_group",
                alignWeights: { LN: 3, LG: 2, N: 2, LE: 1 },
                extraSentences: [
                    "The work was tested against force and weather before anyone called it finished.",
                    "Each step was measured by tradition older than most kingdoms.",
                ],
            },

            // Elemental / outsider courts
            {
                name: "a bound dao artisan",
                power: 3,
                groupSize: "solo",
                alignWeights: { N: 4, LN: 2 },
                extraSentences: [
                    "The work was shaped to endure rather than adapt.",
                    "Its maker showed little interest in how it would be perceived.",
                ],
            },
            {
                name: "an elemental conclave of ash and wind",
                power: 4,
                groupSize: "small_group",
                alignWeights: { N: 3, CN: 2, NE: 1 },
                extraSentences: [
                    "The work bore signs of competing priorities resolved by force.",
                    "Completion coincided with an event no one planned to repeat.",
                ],
            },
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
                groupSize: "organization",
                alignWeights: { LE: 4, LN: 3, NE: 1 },
                extraSentences: [
                    "The work was completed under strict terms and hotter tempers.",
                    "Those who watched swore the heat carried meaning, not just pain.",
                ],
            },
            {
                name: "a dao crystal-ledger syndicate",
                power: 5,
                groupSize: "organization",
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
                groupSize: "small_group",
                alignWeights: { LE: 2, NE: 6 },
                extraSentences: [
                    "Those involved struggled to recall the process in a coherent sequence.",
                    "The making left behind a discomfort that lingered like a half-remembered dream.",
                ],
            },
            {
                name: "a beholder’s paranoid workshop",
                power: 4,
                groupSize: "small_group",
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
                groupSize: "small_group",
                alignWeights: { LG: 5, NG: 3, LN: 2 },
                extraSentences: [
                    "The work was accompanied by rites that felt like law written in song.",
                    "Those present described the process as cleansing, even when it was difficult.",
                ],
            },
            // Mythic / legendary
            {
                name: "a wandering demigod in exile",
                power: 5,
                groupSize: "solo",
                alignWeights: { LG: 2, NG: 3, CG: 2, LN: 1, N: 2, CN: 1, LE: 1, NE: 2, CE: 1 },
                extraSentences: [
                    "Those who knew the maker best claimed the work was both confession and wager.",
                    "The making ended abruptly, as if the creator feared what success would require next.",
                ],
            },
            {
                name: "a vast druidic circle",
                power: 5,
                groupSize: "court",
                alignWeights: { NG: 4, N: 4, CG: 2, CN: 2, LG: 1 },
                extraSentences: [
                    "The work was shaped under open sky, with witnesses sworn by wind and root.",
                    "No single hand could claim authorship; the circle insisted that was the point.",
                ],
            },
            {
                name: "a celestial emissary of disputed mandate",
                power: 5,
                groupSize: "solo",
                alignWeights: { LG: 4, NG: 3, LN: 2, N: 1, LE: 1 },
                extraSentences: [
                    "Those present argued over whether the act was mercy, law, or something colder.",
                    "The maker refused praise, insisting the result mattered more than the reasons.",
                ],
            },
            {
                name: "a lost titan",
                power: 5,
                groupSize: "solo",
                alignWeights: { N: 5, CN: 3, LN: 2, NE: 2, CE: 1 },
                extraSentences: [
                    "The work felt less like craft than aftermath—something the world remembered into being.",
                    "Witnesses later insisted the air grew heavy, as if gravity itself were listening.",
                ],
            },
        ],

        mortal: [
            // Common / Uncommon core peoples
            {
                name: "a street enforcer of local repute",
                power: 1,
                groupSize: "solo",
                alignWeights: { CE: 4, CN: 1 },
                extraSentences: [
                    "The work favored intimidation over discretion.",
                    "Its maker saw fear as a practical tool.",
                ],
            },
            {
                name: "a sadistic hedge-artisan",
                power: 1,
                groupSize: "solo",
                alignWeights: { CE: 4, NE: 1 },
                extraSentences: [
                    "The work reflected enjoyment more than necessity.",
                    "Its maker showed little concern for how it would be received.",
                ],
            },
            {
                name: "a volunteer firewarden",
                power: 1,
                groupSize: "solo",
                alignWeights: { CG: 3, NG: 2 },
                extraSentences: [
                    "The work was meant to be used quickly rather than preserved.",
                    "Its maker expected no recognition.",
                ],
            },
            {
                name: "a shrine-maintainer of local repute",
                power: 1,
                groupSize: "solo",
                alignWeights: { LG: 3, NG: 2 },
                extraSentences: [
                    "The work followed forms older than its maker.",
                    "Care was taken to avoid unnecessary embellishment.",
                ],
            },
            {
                name: "a traveling freedom-preacher",
                power: 2,
                groupSize: "solo",
                alignWeights: { CG: 4, NG: 1 },
                extraSentences: [
                    "The work was shaped by urgency rather than polish.",
                    "Its maker believed delay would have been its own kind of harm.",
                ],
            },
            {
                name: "a black-market factor",
                power: 2,
                groupSize: "solo",
                alignWeights: { NE: 3, LE: 2 },
                extraSentences: [
                    "The work passed through several hands before anyone admitted involvement.",
                    "Responsibility was carefully divided to ensure no one bore it alone.",
                ],
            },
            {
                name: "a debtor-guild clerk",
                power: 1,
                groupSize: "solo",
                alignWeights: { LE: 4, NE: 1 },
                extraSentences: [
                    "The work was justified as procedure rather than choice.",
                    "Its creation was considered routine within the guild.",
                ],
            },
            {
                name: "a roadside bandit-captain",
                power: 2,
                groupSize: "small_group",
                alignWeights: { CE: 3, CN: 2, NE: 1 },
                extraSentences: [
                    "The work favored intimidation over subtlety.",
                    "Those involved saw it as an investment in future leverage.",
                ],
            },
            {
                name: "a petty cult scribe",
                power: 2,
                groupSize: "solo",
                alignWeights: { NE: 3, CE: 2 },
                extraSentences: [
                    "The work drew from borrowed doctrine rather than deep understanding.",
                    "Its maker believed accuracy mattered less than devotion.",
                ],
            },
            {
                name: "a human artisan",
                power: 1,
                groupSize: "solo",
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
                groupSize: "solo",
                alignWeights: { NG: 2, LG: 1, N: 2, LN: 1 },
                extraSentences: [
                    "The work was surrounded by annotations, corrections, and marginal warnings.",
                    "The maker treated the process as scholarship as much as craft.",
                ],
            },
            {
                name: "a half-elf wizard",
                power: 3,
                groupSize: "solo",
                alignWeights: { NG: 2, CG: 2, N: 2, CN: 1 },
                extraSentences: [
                    "The maker worked from conviction more than instruction, guided by conscience over custom.",
                    "The work was interrupted more than once by insight that demanded revision.",
                ],
            },
            {
                name: "a gnomish enchanter",
                power: 2,
                groupSize: "solo",
                alignWeights: { CG: 2, NG: 2, N: 2, CN: 1 },
                extraSentences: [
                    "The process was methodical, but punctuated by sudden leaps of inspiration.",
                    "The maker tested the work obsessively, delighted whenever it behaved unexpectedly.",
                ],
            },
            {
                name: "a goliath shaman",
                power: 2,
                groupSize: "solo",
                alignWeights: { LG: 2, LN: 2, NG: 1, N: 1 },
                extraSentences: [
                    "The maker treated the craft like a promise that could be carried.",
                    "Nothing about the process was rushed, as if speed would be disrespect.",
                ],
            },
            // --- Low-power mortal creators (Common/Uncommon) ---
            {
                name: "a village hedge-mage",
                power: 1,
                groupSize: "solo",
                alignWeights: { NG: 2, N: 3, CG: 1, LN: 1 },
                extraSentences: [
                    "The work was done between chores and favors, with practical improvisation.",
                    "The maker used familiar tools and uncommon patience.",
                ],
            },
            {
                name: "a traveling peddler-artificer",
                power: 1,
                groupSize: "solo",
                alignWeights: { CN: 2, N: 3, NG: 1, LN: 1 },
                extraSentences: [
                    "The work was assembled on the road, tested whenever the weather changed.",
                    "The maker treated the craft like a trick worth perfecting.",
                ],
            },
            {
                name: "a town apothecary",
                power: 1,
                groupSize: "solo",
                alignWeights: { NG: 2, N: 3, LN: 1 },
                extraSentences: [
                    "The maker insisted on careful measurements, even when no one was watching.",
                    "The process smelled of herbs, ink, and stubborn diligence.",
                ],
            },
            {
                name: "a roadside shrine-keeper",
                power: 1,
                groupSize: "solo",
                alignWeights: { LG: 2, NG: 2, LN: 1, N: 1 },
                extraSentences: [
                    "The work was completed as an act of service, not ambition.",
                    "Those present described the process as quiet, reverent, and practical.",
                ],
            },
            {
                name: "a local temple sacristan",
                power: 1,
                groupSize: "solo",
                alignWeights: { LG: 3, LN: 2, NG: 1 },
                extraSentences: [
                    "The commission came with rules, blessings, and a list of things not to do.",
                    "The maker treated cleanliness and order as part of the craft.",
                ],
            },
            {
                name: "a city watch armorer",
                power: 1,
                groupSize: "solo",
                alignWeights: { LN: 3, LG: 1, N: 2 },
                extraSentences: [
                    "The maker favored reliability over flair, and proved it with tests.",
                    "Every choice was justified as if it might be reviewed later.",
                ],
            },
            {
                name: "a dockside ropewright and chandlers’ cooperative",
                power: 1,
                groupSize: "organization",
                alignWeights: { N: 3, LN: 2, NG: 1 },
                extraSentences: [
                    "The work was treated like a matter of livelihood, not legend.",
                    "The maker valued sturdiness, because failure would be public and costly.",
                ],
            },
            {
                name: "a frontier trapper’s kin-clan",
                power: 1,
                groupSize: "small_group",
                alignWeights: { N: 3, CN: 2, NG: 1 },
                extraSentences: [
                    "The work was practical first, shaped by hard lessons and harsher weather.",
                    "Those involved argued about details the way families argue about stories.",
                ],
            },
            {
                name: "a dwarven journeyman smith",
                power: 1,
                groupSize: "solo",
                alignWeights: { LN: 3, LG: 1, N: 2 },
                extraSentences: [
                    "The maker followed guild habits even when no guildhall was near.",
                    "The work shows the confidence of someone learning by doing.",
                ],
            },
            {
                name: "an elven village bard",
                power: 2,
                groupSize: "solo",
                alignWeights: { NG: 2, CG: 2, N: 2, LG: 1 },
                extraSentences: [
                    "The maker treated the process as tradition performed, not merely work completed.",
                    "Witnesses recalled repetition, patience, and a sense of inherited practice.",
                ],
            },
            {
                name: "a halfling family tinker",
                power: 1,
                groupSize: "solo",
                alignWeights: { NG: 2, CG: 2, N: 2, CN: 1 },
                extraSentences: [
                    "The maker tested the work in everyday ways, then quietly improved it.",
                    "Nothing about the process looked impressive—until it proved reliable.",
                ],
            },
            {
                name: "a gnomish clock-shop apprentice",
                power: 1,
                groupSize: "solo",
                alignWeights: { NG: 2, N: 2, CG: 2, CN: 1 },
                extraSentences: [
                    "The maker’s notes were messy, but the work itself was careful.",
                    "The craft shows the enthusiasm of someone still delighted by how things function.",
                ],
            },
            {
                name: "a human scribe who dabbles in the arcane",
                power: 1,
                groupSize: "solo",
                alignWeights: { LN: 3, N: 2, LG: 1 },
                extraSentences: [
                    "The commission was documented with excessive thoroughness for something so small.",
                    "The maker treated procedure as a kind of safety.",
                ],
            },
            {
                name: "a goblin salvage-collector",
                power: 1,
                groupSize: "solo",
                alignWeights: { CN: 2, N: 2, NE: 2, CG: 1 },
                extraSentences: [
                    "The work was pieced together from what was available and what was stolen back.",
                    "The maker’s methods were questionable; the result was harder to dismiss.",
                ],
            },
            {
                name: "a half-orc caravan guard-captain",
                power: 1,
                groupSize: "solo",
                alignWeights: { N: 3, LN: 2, NG: 1, CN: 1 },
                extraSentences: [
                    "The work was designed with travel in mind and danger assumed.",
                    "Those involved cared less about beauty than about survival.",
                ],
            },
            {
                name: "a rural midwife who dabbles in charms",
                power: 1,
                groupSize: "solo",
                alignWeights: { NG: 3, N: 2, CG: 1 },
                extraSentences: [
                    "The work was made with steady hands and a practical kind of kindness.",
                    "The maker spoke of tradition the way others speak of medicine.",
                ],
            },
            {
                name: "a fisher-priest of rural waterways",
                power: 1,
                groupSize: "solo",
                alignWeights: { NG: 2, LG: 1, N: 3 },
                extraSentences: [
                    "The work was completed between tides, with rituals that looked like habit.",
                    "The maker treated luck as something you could cultivate with patience.",
                ],
            },
            {
                name: "a borderland storyteller-scrivener",
                power: 1,
                groupSize: "solo",
                alignWeights: { CN: 2, N: 2, NG: 1, CG: 2 },
                extraSentences: [
                    "The work was shaped as much by story as by need.",
                    "Those present argued about what it meant long before they agreed it was finished.",
                ],
            },
            {
                name: "a municipal lamplighter’s guild",
                power: 1,
                groupSize: "organization",
                alignWeights: { LN: 3, N: 2, NG: 1 },
                extraSentences: [
                    "The commission was treated like civic maintenance, not heroics.",
                    "The maker cared deeply about small failures, because small failures multiply.",
                ],
            },
            {
                name: "a retired soldier turned small-town smith",
                power: 1,
                groupSize: "solo",
                alignWeights: { N: 3, LN: 2, NG: 1, LG: 1 },
                extraSentences: [
                    "The work reflects hard experience: simple choices, thoroughly tested.",
                    "The maker built it the way they once packed a kit—only what mattered.",
                ],
            },
            {
                name: "a dwarven brewer who dabbles in runes",
                power: 1,
                groupSize: "solo",
                alignWeights: { N: 2, NG: 2, LN: 2, CG: 1 },
                extraSentences: [
                    "The work began as a joke, then became tradition, then became serious.",
                    "The maker insisted the small details were the whole point.",
                ],
            },
            {
                name: "a tiefling bookbinder",
                power: 1,
                groupSize: "solo",
                alignWeights: { N: 2, CN: 2, NE: 2, NG: 1 },
                extraSentences: [
                    "The work was finished with meticulous care that made others uneasy.",
                    "The maker preferred quiet labor and locked doors.",
                ],
            },
            {
                name: "an elven orchard-warden",
                power: 2,
                groupSize: "solo",
                alignWeights: { NG: 2, N: 3, LG: 1, CG: 1 },
                extraSentences: [
                    "The work was treated like stewardship—patient, seasonal, and deliberate.",
                    "Those involved spoke of balance more than victory.",
                ],
            },
            {
                name: "a human innkeeper with a talent for small enchantments",
                power: 1,
                groupSize: "solo",
                alignWeights: { NG: 2, N: 2, CG: 1, LN: 1 },
                extraSentences: [
                    "The work was made between guests and interruptions, which forced clever shortcuts.",
                    "The maker swore it was nothing special, even when it clearly was.",
                ],
            },
            {
                name: "a young noble dilettante",
                power: 1,
                groupSize: "solo",
                alignWeights: { CN: 2, N: 2, LN: 2, NE: 1 },
                extraSentences: [
                    "The work was commissioned more for reputation than necessity.",
                    "The maker’s involvement was enthusiastic, inconsistent, and expensive.",
                ],
            },
            {
                name: "a tiefling warlock",
                power: 4,
                groupSize: "solo",
                alignWeights: { CN: 2, NE: 2, N: 1, CE: 1 },
                extraSentences: [
                    "The work was finished with the air of someone repaying a debt they didn’t fully acknowledge.",
                    "A witness later insisted the maker negotiated with an empty corner of the room.",
                ],
            },
            {
                name: "a dragonborn oath-sworn knight",
                power: 3,
                groupSize: "solo",
                alignWeights: { LG: 2, LN: 2, LE: 1, NG: 1 },
                extraSentences: [
                    "The commission was treated like a duty, not a favor.",
                    "Those involved spoke more about honor than about success.",
                ],
            },
            {
                name: "a human court arcanist",
                power: 4,
                groupSize: "solo",
                alignWeights: { LN: 3, LG: 1, LE: 1, N: 1 },
                extraSentences: [
                    "The work was conducted under supervision, with rules posted like prayers.",
                    "The maker’s notes read like policy, which made the result feel inevitable.",
                ],
            },
            {
                name: "a city magistrate’s black office",
                power: 3,
                groupSize: "organization",
                alignWeights: { LE: 4, LN: 1 },
                extraSentences: [
                    "The work was justified as lawful procedure.",
                    "Responsibility was distributed to avoid accountability.",
                ],
            },
            {
                name: "a private inquisitor-for-hire",
                power: 3,
                groupSize: "solo",
                alignWeights: { NE: 4, LE: 1 },
                extraSentences: [
                    "The work was pursued without regard for public judgment.",
                    "Its maker valued results over legality.",
                ],
            },
            {
                name: "a renegade war-band smith",
                power: 3,
                groupSize: "small_group",
                alignWeights: { CE: 4, CN: 1 },
                extraSentences: [
                    "The work was meant to survive violent use.",
                    "Its maker expected it to change hands forcibly.",
                ],
            },
            {
                name: "a dwarven high priest-artisan",
                power: 4,
                groupSize: "solo",
                alignWeights: { LG: 3, LN: 2, NG: 1 },
                extraSentences: [
                    "The work was treated as sacred labor, and interruptions were not welcomed.",
                    "Those present described the process as both craft and confession.",
                ],
            },
            {
                name: "an elven bladesinger",
                power: 4,
                groupSize: "solo",
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
                groupSize: "court",
                alignWeights: { LN: 2, LG: 1, LE: 1, N: 1 },
                extraSentences: [
                    "The commission came with etiquette, witnesses, and carefully chosen words.",
                    "There was more politics in the paperwork than in the craft.",
                ],
            },
            {
                name: "a dwarven mining consortium",
                power: 2,
                groupSize: "organization",
                alignWeights: { LN: 3, N: 2, LE: 1 },
                extraSentences: [
                    "The work was valued for reliability, not beauty—at least officially.",
                    "The commission was framed as practical necessity, though the stakes suggested otherwise.",
                ],
            },
            {
                name: "a secretive arcane cabal",
                power: 4,
                groupSize: "small_group",
                alignWeights: { LN: 2, N: 2, NE: 2, LE: 1 },
                extraSentences: [
                    "The work was divided into stages so no single person understood the whole.",
                    "Witnesses described the process as controlled, careful, and unnervingly quiet.",
                ],
            },
            {
                name: "a borderland healer-circle",
                power: 4,
                groupSize: "small_group",
                alignWeights: { NG: 4, LG: 1 },
                extraSentences: [
                    "The work was shaped by necessity rather than doctrine.",
                    "Its maker expected it to be used without ceremony.",
                ],
            },
            {
                name: "a revolutionary artisan collective",
                power: 4,
                groupSize: "organization",
                alignWeights: { CG: 4, NG: 1 },
                extraSentences: [
                    "The work was created in defiance of accepted authority.",
                    "Its maker believed change required visible action.",
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
            "Produced by {creator}, {ending}.",
            "Fashioned by {creator}, {ending}.",
            "Crafted by {creator}, {ending}.",
            "Designed by {creator}, {ending}.",
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
            default: { " ": 85, "; ": 10, " — ": 5 },
        },
        chronicle: {
            default: { " ": 60, "; ": 30, " — ": 10 },
        },
        scholarly: {
            default: { "; ": 55, " ": 40, " — ": 5 },
        },
        mythic: {
            default: { " — ": 30, "; ": 40, " ": 30 },
        },
    },

    MOTIVE_BASE: {
        common: {
            good: [
                "provide reliable aid without drawing attention",
                "serve an everyday need with quiet care for others",
                "offer comfort to the weary without asking anything in return",
                "protect ordinary folk from minor harms most never notice",
                "make a hard task easier for those with too little help",
                "lend reassurance in uncertain moments",
                "help someone keep a simple promise",
                "bring a little safety to places where it is usually absent",
            ],
            neutral: [
                "fulfill a modest commission with no expectation of legacy",
                "serve a practical purpose and little more",
                "meet a routine need according to local custom",
                "complete an order exactly as requested and promptly delivered",
                "prove a technique or settle a small professional rivalry",
                "test a method that worked on paper but not yet in practice",
                "mark a minor occasion without inviting attention",
                "earn a fair price in honest trade",
            ],
            evil: [
                "satisfy a small demand whose consequences belonged to someone else",
                "meet a request without concern for how it might later be used",
                "enable a petty scheme that required plausible deniability",
                "make intimidation easier without requiring open threats",
                "solve a personal inconvenience at another’s expense",
                "ensure someone else carried the risk if things went wrong",
                "serve a buyer who asked too few questions",
                "turn a minor cruelty into an everyday convenience",
            ],
        },

        uncommon: {
            good: [
                "answer a personal request and settle a small debt of honor",
                "quietly help someone who could not ask openly",
                "repay a kindness that could not be acknowledged in public",
                "protect a household or small community from a recurring danger",
                "aid a traveler whose journey mattered more than their name",
                "support a vow made in private and kept with effort",
                "help someone endure a season of hardship",
                "restore what was lost without demanding recognition",
            ],
            neutral: [
                "support a local rite meant to ward off a familiar fear",
                "serve a purpose shaped as much by tradition as by need",
                "fulfill a commission tied to ceremony rather than utility",
                "solve a problem that had become inconveniently persistent",
                "confirm a theory by putting it into use",
                "satisfy a patron who valued results over explanation",
                "reinforce an old boundary whose meaning had been forgotten",
                "complete a work expected by custom even if few understood why",
            ],
            evil: [
                "fulfill a private request best left unrecorded",
                "serve a purpose its commissioner preferred not to explain",
                "create leverage where none had existed before",
                "make a quiet threat feel inevitable",
                "punish resistance without leaving clear evidence of intent",
                "enable a deed that required a cleaner conscience than the commissioner possessed",
                "bind someone to a promise they should not have made",
                "ensure a rival’s setbacks looked like misfortune",
            ],
        },

        rare: {
            good: [
                "honor a specific deed and bind gratitude into lasting form",
                "stand as proof that sacrifice had been seen and remembered",
                "protect a worthy life from an undeserved end",
                "preserve a fragile peace when force would have shattered it",
                "reward courage in a way that could not be counterfeited",
                "carry hope through a time when hope was treated as weakness",
                "ensure a just cause survived the loss of its champions",
                "give a name to bravery that would otherwise be forgotten",
            ],
            neutral: [
                "mark a significant deed while concealing its full cost",
                "complete a serious ritual whose success affected more than one life",
                "seal an agreement that required more than words to hold",
                "prevent a crisis while keeping its true stakes obscured",
                "stabilize a dangerous truth by containing it rather than destroying it",
                "fulfill a condition demanded by precedent and enforced by tradition",
                "create a tool meant for a single moment of necessity",
                "preserve balance by denying any side an easy victory",
            ],
            evil: [
                "reward loyalty while ensuring it could not be withdrawn",
                "commemorate a victory others were encouraged to forget",
                "make obedience easier than defiance",
                "secure a secret by attaching consequences to curiosity",
                "turn a rival’s triumph into a dependency",
                "ensure that betrayal carried a price paid in silence",
                "grant power while keeping the recipient controllable",
                "prove that mercy could be used as a weakness",
            ],
        },

        "very rare": {
            good: [
                "avert a catastrophe even if no one would ever know it succeeded",
                "stand against a future too grim to risk unchallenged",
                "preserve a city or sanctuary when walls and armies would fail",
                "give the innocent a chance they had been denied by fate",
                "undo a wrong that history insisted was permanent",
                "shield a people from a threat they could not name",
                "carry a safeguard meant to outlast its maker",
                "turn certain loss into a narrow possibility of survival",
            ],
            neutral: [
                "seal a pact and endure its consequences",
                "prevent disaster while deferring its true price",
                "contain a force that could not be safely destroyed",
                "maintain a fragile equilibrium by making every option costly",
                "bind an outcome to conditions no one could easily satisfy",
                "complete a rite whose success demanded concessions that could not be reclaimed",
                "preserve a secret that would unravel kingdoms if spoken aloud",
                "ensure a dangerous legacy remained dormant until a specific hour",
            ],
            evil: [
                "formalize a bargain whose terms favored only one side",
                "ensure a coming disaster unfolded in a controllable way",
                "secure power by making refusal impossible",
                "make suffering predictable, measurable, and therefore usable",
                "turn fear into a tool that could be carried anywhere",
                "set a trap for the virtuous that punished them for acting",
                "guarantee a debt would be collected regardless of who owed it",
                "arrange a downfall that looked like destiny",
            ],
        },

        legendary: {
            good: [
                "change the course of history for the better regardless of cost",
                "defy prophecy to give mortals one last chance",
                "preserve the light of a cause when the world insisted it should go out",
                "end a war in a way that left no room for vengeance",
                "redeem a cursed lineage by breaking its oldest pattern",
                "open a path where none had existed, for those who could not wait",
                "make a sacrifice meaningful enough to echo through generations",
                "give hope a victory so undeniable it became a legend",
            ],
            neutral: [
                "tip the balance of an age or prevent it from tipping at all",
                "reshape the future through will rather than permission",
                "anchor an era to a single unbreakable condition",
                "ensure a turning point occurred on precise terms",
                "bind history to an outcome that could not be negotiated away",
                "place a lock on fate and hide the key in plain sight",
                "set a boundary the world could not cross without changing forever",
                "make the impossible possible, once, at the cost of certainty",
            ],
            evil: [
                "secure dominion that time and death could not erode",
                "ensure that when the world broke, it broke in the right direction",
                "make conquest permanent by turning memory into obedience",
                "bind a realm to a ruler it could never truly escape",
                "arrange the fall of heroes so their virtues became liabilities",
                "make despair feel like the only rational choice",
                "claim a victory so absolute that resistance became folklore",
                "set history on rails and punish anything that tried to derail it",
            ],
        },
    },

    PROVENANCE_DETAILS: {
        uncommon: {
            good: [
                "The commission was handled discreetly to avoid unnecessary harm.",
                "The maker discouraged attention, preferring the work speak quietly for itself.",
                "Only those who needed to know were informed of its completion.",
                "Its transfer was arranged with care to prevent misuse.",
                "Records were kept minimal out of respect for those involved.",
            ],
            neutral: [
                "The commission was handled discreetly, with few records kept.",
                "The maker required that it pass through as few hands as possible.",
                "Payment was exchanged quietly, without witnesses or written terms.",
                "The work was completed outside normal channels of trade.",
                "Details of its creation were considered unremarkable at the time.",
            ],
            evil: [
                "The commission was arranged to leave no clear trail of responsibility.",
                "Those involved avoided documenting their roles in its creation.",
                "The maker discouraged questions about its purpose or destination.",
                "Its delivery was handled in a way that prevented accountability.",
                "Any records that did exist were intentionally vague.",
            ],
        },

        rare: {
            good: [
                "Only a small circle witnessed its completion, and not all of them approved.",
                "Those present debated the necessity of its creation long after it was finished.",
                "Care was taken to limit who could claim responsibility for the work.",
                "Some involved questioned whether the outcome justified the means.",
                "The maker imposed conditions meant to prevent misuse.",
            ],
            neutral: [
                "Its creation was documented, then deliberately obscured.",
                "Those present understood the significance but disagreed on the justification.",
                "Several parties later denied involvement despite evidence to the contrary.",
                "Some details of its making were omitted from the official account.",
                "Its final form differed from the original commission in subtle but important ways.",
            ],
            evil: [
                "The work was completed under conditions that limited outside scrutiny.",
                "Those involved ensured blame could be plausibly shifted if needed.",
                "Records were altered to favor one version of events.",
                "The maker insisted on terms that complicated oversight.",
                "Participation was secured through leverage rather than consent.",
            ],
        },

        "very rare": {
            good: [
                "Its making required sacrifices that some believed went too far.",
                "Those involved disagreed on whether its use could ever be justified.",
                "The process left lasting consequences for at least one participant.",
                "Completion was delayed by doubts that could not be easily resolved.",
                "Responsibility for its creation was shared to prevent any single party bearing the cost.",
            ],
            neutral: [
                "Its making required concessions that could not be fully undone.",
                "Those involved disagreed on whether it should ever be used.",
                "The final stage of its creation demanded a choice with no clean outcome.",
                "Its existence was acknowledged only after its effects became impossible to ignore.",
                "Those who understood its function argued over who should bear responsibility.",
            ],
            evil: [
                "The process ensured that consequences would fall on someone else.",
                "Those involved accepted outcomes they knew they would not personally endure.",
                "Completion was rushed once opposition became inconvenient.",
                "Any dissent was resolved before the final stage began.",
                "The work concluded in a way that prevented reversal.",
            ],
        },

        legendary: {
            good: [
                "Later generations argued over whether its creation was justified at all.",
                "Some accounts suggest it was never meant to survive its first use.",
                "Those responsible believed no one should possess it for long.",
                "Its creation is remembered as an act of desperate restraint.",
                "The truth of its origin was deliberately simplified to prevent repetition.",
            ],
            neutral: [
                "Accounts of its creation contradict one another in troubling ways.",
                "Even now, scholars debate whether it was meant to be found.",
                "Much of what is known comes from fragmented or unreliable sources.",
                "Its creation is often cited as a turning point, though opinions differ on why.",
                "No single account fully explains how all necessary conditions were met.",
            ],
            evil: [
                "The truth of its origin has been revised repeatedly to excuse those responsible.",
                "Some records suggest it was always meant to outlast its makers.",
                "Later accounts minimize the suffering involved in its creation.",
                "Those who survived its making ensured their version of events endured.",
                "Its creation became a precedent others would later regret following.",
            ],
        },
    },

    ALIGNMENT_TWISTS: {
        good: {
            lawful: [
                "It was meant to protect others—even from themselves.",
                "It was meant to uphold a vow no one else could keep.",
                "It was meant to enforce restraint where good intentions had failed.",
                "It was meant to ensure mercy did not become negligence.",
                "It was meant to stand firm when compassion alone was not enough.",
                "It was meant to impose limits for the sake of the vulnerable.",
                "It was meant to carry responsibility when no one else would.",
                "It was meant to ensure that justice arrived even if it was unwelcome.",
            ],
            nonlawful: [
                "It was meant to free someone who could not be freed by ordinary means.",
                "It was meant to restore what rules and rulers refused to return.",
                "It was meant to give relief where procedure offered none.",
                "It was meant to act when waiting would only cause harm.",
                "It was meant to save a life regardless of permission.",
                "It was meant to bypass authority in service of compassion.",
                "It was meant to answer suffering that had gone unanswered too long.",
                "It was meant to choose kindness over compliance.",
            ],
        },

        evil: {
            lawful: [
                "It was meant to bind a promise no one could safely break.",
                "It was meant to turn duty into a leash.",
                "It was meant to formalize obedience and make deviation costly.",
                "It was meant to ensure consequences were inevitable, not optional.",
                "It was meant to weaponize obligation.",
                "It was meant to make compliance feel virtuous.",
                "It was meant to replace choice with procedure.",
                "It was meant to ensure power could be exercised without question.",
            ],
            nonlawful: [
                "It was meant to take what could not be taken openly.",
                "It was meant to make a lesson out of resistance.",
                "It was meant to reward cruelty that proved effective.",
                "It was meant to satisfy desire without delay or apology.",
                "It was meant to ensure fear did the work of persuasion.",
                "It was meant to encourage betrayal by making it profitable.",
                "It was meant to turn chaos into opportunity.",
                "It was meant to punish hesitation.",
            ],
        },

        neutral: {
            chaotic: [
                "It was meant to upend a stalemate and see what survived.",
                "It was meant to test fate by giving it something sharp to trip over.",
                "It was meant to disrupt patterns that had grown too comfortable.",
                "It was meant to force change where stagnation had taken root.",
                "It was meant to invite consequence and observe the result.",
                "It was meant to see what happened when certainty was removed.",
                "It was meant to unsettle an outcome everyone assumed was fixed.",
                "It was meant to provoke motion where stillness had become dangerous.",
            ],
            nonchaotic: [
                "It was meant to keep the scales from tipping too far in any direction.",
                "It was meant to endure—useful to whoever held it, and loyal to no one.",
                "It was meant to maintain balance even when balance displeased everyone.",
                "It was meant to persist beyond the ambitions of its makers.",
                "It was meant to serve as a constant in an unstable situation.",
                "It was meant to function regardless of who claimed ownership.",
                "It was meant to moderate extremes rather than choose sides.",
                "It was meant to remain relevant long after its original context faded.",
            ],
        },
    },

    CREATOR_ALIGNMENT_ENDINGS: {
        good: {
            lawful: [
                "known for a strict sense of duty and carefully kept vows",
                "known for a belief that order exists to protect others",
                "guided by principles they refused to compromise",
                "committed to obligations even when doing so proved costly",
                "known for honoring oaths long after their usefulness had passed",
                "guided by a conviction that responsibility outweighs convenience",
                "recognized for consistency in word, deed, and expectation",
                "believed structure was the surest defense against harm",
            ],
            nonlawful: [
                "known for letting conscience outrank tradition",
                "known for compassion that outran custom",
                "guided by empathy rather than instruction",
                "inclined to act first and justify the act later",
                "known for placing people above process",
                "driven by an instinct to help regardless of approval",
                "willing to bend expectations in service of mercy",
                "guided by personal conviction more than external authority",
            ],
        },

        evil: {
            lawful: [
                "methods were precise, contractual, and unforgiving",
                "believed control was simply another form of responsibility",
                "known for treating authority as a tool rather than a duty",
                "guided by rules designed to favor their position",
                "valued obedience as proof of correctness",
                "known for enforcing order without regard for consent",
                "believed structure existed to be exploited, not shared",
                "viewed compliance as a moral good in itself",
            ],
            nonlawful: [
                "driven by ambition with little concern for consequence",
                "actions were guided by appetite rather than restraint",
                "known for pursuing desire without patience or reflection",
                "inclined to seize advantage wherever it appeared",
                "guided by impulse sharpened into intent",
                "valued outcome over method and survival over loyalty",
                "known for discarding limits once they became inconvenient",
                "motivated by hunger that reason rarely tempered",
            ],
        },

        neutral: {
            chaotic: [
                "priorities shifted as easily as circumstance allowed",
                "more curious about outcomes than obligations",
                "guided by curiosity rather than consistency",
                "known for adapting readily to changing conditions",
                "inclined to follow opportunity wherever it led",
                "valued flexibility over planning",
                "guided by intuition more than precedent",
                "comfortable with uncertainty as a working state",
            ],
            nonchaotic: [
                "known for a pragmatic outlook and measured decisions",
                "known for valuing results over reputation or ideology",
                "guided by assessment rather than belief",
                "inclined to weigh cost and benefit before committing",
                "known for avoiding extremes in favor of stability",
                "valued predictability when chaos offered no advantage",
                "guided by what worked rather than what inspired",
                "recognized for restraint in both success and failure",
            ],
        },
    },
};
