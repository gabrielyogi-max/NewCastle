/**
 * EVAARIA SECUNDA - Database de Cartas
 * Todas as cartas do jogo com seus atributos
 */

// Tipos de carta
const CardType = {
    ATTACK: 'attack',
    DEFENSE: 'defense',
    MAGIC: 'magic',
    SUPPORT: 'support',
    CURSE: 'curse',
    RELIC: 'relic'
};

// Elementos
const Element = {
    FIRE: 'fire',
    WATER: 'water',
    EARTH: 'earth',
    AIR: 'air',
    LIGHT: 'light',
    DARK: 'dark',
    NEUTRAL: 'neutral'
};

// Raridades
const Rarity = {
    COMMON: 'common',
    UNCOMMON: 'uncommon',
    RARE: 'rare',
    EPIC: 'epic',
    LEGENDARY: 'legendary'
};

// Tipos de efeito
const EffectType = {
    BURN: 'burn',
    POISON: 'poison',
    FROZEN: 'frozen',
    STUNNED: 'stunned',
    STRENGTHENED: 'strengthened',
    WEAKENED: 'weakened',
    REGENERATION: 'regeneration',
    SHIELD: 'shield',
    DRAW: 'draw',
    DISCARD: 'discard',
    MANA: 'mana'
};

// Ícones por tipo
const TYPE_ICONS = {
    [CardType.ATTACK]: '⚔️',
    [CardType.DEFENSE]: '🛡️',
    [CardType.MAGIC]: '✨',
    [CardType.SUPPORT]: '💚',
    [CardType.CURSE]: '💀',
    [CardType.RELIC]: '🔮'
};

// Ícones por elemento
const ELEMENT_ICONS = {
    [Element.FIRE]: '🔥',
    [Element.WATER]: '💧',
    [Element.EARTH]: '🌿',
    [Element.AIR]: '💨',
    [Element.LIGHT]: '☀️',
    [Element.DARK]: '🌙',
    [Element.NEUTRAL]: '⚪'
};

// Database de cartas
const CARDS_DATABASE = {
    // ==========================================
    // CARTAS BÁSICAS (STARTER)
    // ==========================================

    strike: {
        id: 'strike',
        name: 'Golpe',
        type: CardType.ATTACK,
        element: Element.NEUTRAL,
        rarity: Rarity.COMMON,
        manaCost: 1,
        damage: 6,
        defense: 0,
        effects: [],
        description: 'Um golpe básico com sua arma.',
        art: null, // Placeholder para arte
        artEmoji: '⚔️'
    },

    defend: {
        id: 'defend',
        name: 'Defender',
        type: CardType.DEFENSE,
        element: Element.NEUTRAL,
        rarity: Rarity.COMMON,
        manaCost: 1,
        damage: 0,
        defense: 5,
        effects: [
            { type: EffectType.SHIELD, value: 5, duration: 1 }
        ],
        description: 'Levanta sua guarda. Ganha 5 de escudo.',
        art: null,
        artEmoji: '🛡️'
    },

    spark: {
        id: 'spark',
        name: 'Faísca',
        type: CardType.MAGIC,
        element: Element.FIRE,
        rarity: Rarity.COMMON,
        manaCost: 1,
        damage: 4,
        defense: 0,
        effects: [],
        description: 'Uma pequena faísca de fogo.',
        art: null,
        artEmoji: '✨'
    },

    heal: {
        id: 'heal',
        name: 'Curar',
        type: CardType.SUPPORT,
        element: Element.LIGHT,
        rarity: Rarity.COMMON,
        manaCost: 1,
        damage: 0,
        defense: 0,
        effects: [
            { type: EffectType.REGENERATION, value: 5, duration: 0, instant: true }
        ],
        description: 'Restaura 5 pontos de vida.',
        art: null,
        artEmoji: '💚'
    },

    // ==========================================
    // CARTAS DE FOGO (INCOMUNS)
    // ==========================================

    fireball: {
        id: 'fireball',
        name: 'Bola de Fogo',
        type: CardType.ATTACK,
        element: Element.FIRE,
        rarity: Rarity.UNCOMMON,
        manaCost: 2,
        damage: 8,
        defense: 0,
        effects: [
            { type: EffectType.BURN, value: 2, duration: 2 }
        ],
        description: 'Lança uma bola de fogo. Causa 2 de queimadura por 2 turnos.',
        art: null,
        artEmoji: '🔥'
    },

    flame_shield: {
        id: 'flame_shield',
        name: 'Escudo de Chamas',
        type: CardType.DEFENSE,
        element: Element.FIRE,
        rarity: Rarity.UNCOMMON,
        manaCost: 2,
        damage: 0,
        defense: 4,
        effects: [
            { type: EffectType.SHIELD, value: 4, duration: 1 },
            { type: EffectType.BURN, value: 3, duration: 1, onHit: true }
        ],
        description: 'Ganha 4 escudo. Inimigos que atacam recebem queimadura.',
        art: null,
        artEmoji: '🔥'
    },

    // ==========================================
    // CARTAS DE ÁGUA (INCOMUNS)
    // ==========================================

    ice_shard: {
        id: 'ice_shard',
        name: 'Estilhaço de Gelo',
        type: CardType.ATTACK,
        element: Element.WATER,
        rarity: Rarity.UNCOMMON,
        manaCost: 2,
        damage: 6,
        defense: 0,
        effects: [
            { type: EffectType.FROZEN, value: 0, duration: 1, chance: 0.3 }
        ],
        description: 'Ataque de gelo. 30% de chance de congelar por 1 turno.',
        art: null,
        artEmoji: '❄️'
    },

    tidal_wave: {
        id: 'tidal_wave',
        name: 'Onda',
        type: CardType.MAGIC,
        element: Element.WATER,
        rarity: Rarity.UNCOMMON,
        manaCost: 3,
        damage: 12,
        defense: 0,
        effects: [],
        description: 'Uma onda poderosa que causa alto dano.',
        art: null,
        artEmoji: '🌊'
    },

    // ==========================================
    // CARTAS DE TERRA (INCOMUNS)
    // ==========================================

    stone_wall: {
        id: 'stone_wall',
        name: 'Muralha de Pedra',
        type: CardType.DEFENSE,
        element: Element.EARTH,
        rarity: Rarity.UNCOMMON,
        manaCost: 2,
        damage: 0,
        defense: 10,
        effects: [
            { type: EffectType.SHIELD, value: 10, duration: 1 }
        ],
        description: 'Ergue uma muralha. Ganha 10 de escudo.',
        art: null,
        artEmoji: '🧱'
    },

    earthquake: {
        id: 'earthquake',
        name: 'Terremoto',
        type: CardType.ATTACK,
        element: Element.EARTH,
        rarity: Rarity.UNCOMMON,
        manaCost: 3,
        damage: 10,
        defense: 0,
        effects: [
            { type: EffectType.STUNNED, value: 0, duration: 1, chance: 0.2 }
        ],
        description: 'Tremor devastador. 20% de chance de atordoar.',
        art: null,
        artEmoji: '🌋'
    },

    // ==========================================
    // CARTAS RARAS
    // ==========================================

    inferno: {
        id: 'inferno',
        name: 'Inferno',
        type: CardType.ATTACK,
        element: Element.FIRE,
        rarity: Rarity.RARE,
        manaCost: 4,
        damage: 15,
        defense: 0,
        effects: [
            { type: EffectType.BURN, value: 4, duration: 3 }
        ],
        description: 'Chamas do inferno. Causa queimadura intensa.',
        art: null,
        artEmoji: '🔥'
    },

    blizzard: {
        id: 'blizzard',
        name: 'Nevasca',
        type: CardType.MAGIC,
        element: Element.WATER,
        rarity: Rarity.RARE,
        manaCost: 4,
        damage: 10,
        defense: 0,
        effects: [
            { type: EffectType.FROZEN, value: 0, duration: 1 }
        ],
        description: 'Congela o inimigo por 1 turno.',
        art: null,
        artEmoji: '❄️'
    },

    divine_light: {
        id: 'divine_light',
        name: 'Luz Divina',
        type: CardType.SUPPORT,
        element: Element.LIGHT,
        rarity: Rarity.RARE,
        manaCost: 3,
        damage: 0,
        defense: 0,
        effects: [
            { type: EffectType.REGENERATION, value: 15, duration: 0, instant: true },
            { type: EffectType.STRENGTHENED, value: 1.5, duration: 2 }
        ],
        description: 'Cura 15 HP e aumenta dano em 50% por 2 turnos.',
        art: null,
        artEmoji: '✨'
    },

    shadow_strike: {
        id: 'shadow_strike',
        name: 'Golpe Sombrio',
        type: CardType.ATTACK,
        element: Element.DARK,
        rarity: Rarity.RARE,
        manaCost: 3,
        damage: 12,
        defense: 0,
        effects: [
            { type: EffectType.WEAKENED, value: 0.5, duration: 2 }
        ],
        description: 'Ataque das sombras. Enfraquece inimigo por 2 turnos.',
        art: null,
        artEmoji: '🌑'
    },

    // ==========================================
    // CARTAS ÉPICAS
    // ==========================================

    phoenix_flame: {
        id: 'phoenix_flame',
        name: 'Chama da Fênix',
        type: CardType.MAGIC,
        element: Element.FIRE,
        rarity: Rarity.EPIC,
        manaCost: 5,
        damage: 20,
        defense: 0,
        effects: [
            { type: EffectType.BURN, value: 5, duration: 3 },
            { type: EffectType.REGENERATION, value: 5, duration: 3 }
        ],
        description: 'Chamas da ressurreição. Causa dano massivo e cura você.',
        art: null,
        artEmoji: '🔥'
    },

    absolute_zero: {
        id: 'absolute_zero',
        name: 'Zero Absoluto',
        type: CardType.MAGIC,
        element: Element.WATER,
        rarity: Rarity.EPIC,
        manaCost: 5,
        damage: 15,
        defense: 0,
        effects: [
            { type: EffectType.FROZEN, value: 0, duration: 2 }
        ],
        description: 'Congela completamente o inimigo por 2 turnos.',
        art: null,
        artEmoji: '❄️'
    },

    void_curse: {
        id: 'void_curse',
        name: 'Maldição do Vazio',
        type: CardType.CURSE,
        element: Element.DARK,
        rarity: Rarity.EPIC,
        manaCost: 4,
        damage: 5,
        defense: 0,
        effects: [
            { type: EffectType.POISON, value: 6, duration: 4 },
            { type: EffectType.WEAKENED, value: 0.5, duration: 3 }
        ],
        description: 'Maldição devastadora. Veneno intenso e enfraquecimento.',
        art: null,
        artEmoji: '💀'
    },

    // ==========================================
    // CARTAS LENDÁRIAS
    // ==========================================

    dragon_breath: {
        id: 'dragon_breath',
        name: 'Sopro do Dragão',
        type: CardType.ATTACK,
        element: Element.FIRE,
        rarity: Rarity.LEGENDARY,
        manaCost: 6,
        damage: 30,
        defense: 0,
        effects: [
            { type: EffectType.BURN, value: 8, duration: 3 }
        ],
        description: 'O poder de um dragão. Dano devastador e queimadura intensa.',
        art: null,
        artEmoji: '🐉'
    },

    celestial_judgment: {
        id: 'celestial_judgment',
        name: 'Julgamento Celestial',
        type: CardType.MAGIC,
        element: Element.LIGHT,
        rarity: Rarity.LEGENDARY,
        manaCost: 7,
        damage: 25,
        defense: 0,
        effects: [
            { type: EffectType.STUNNED, value: 0, duration: 1 },
            { type: EffectType.REGENERATION, value: 10, duration: 0, instant: true }
        ],
        description: 'Poder divino puro. Dano massivo, atordoa e cura.',
        art: null,
        artEmoji: '⚡'
    },

    eternal_darkness: {
        id: 'eternal_darkness',
        name: 'Trevas Eternas',
        type: CardType.CURSE,
        element: Element.DARK,
        rarity: Rarity.LEGENDARY,
        manaCost: 6,
        damage: 20,
        defense: 0,
        effects: [
            { type: EffectType.POISON, value: 10, duration: 5 },
            { type: EffectType.STUNNED, value: 0, duration: 1 }
        ],
        description: 'Escuridão absoluta. Veneno mortal e atordoamento.',
        art: null,
        artEmoji: '🌑'
    },

    world_tree: {
        id: 'world_tree',
        name: 'Árvore do Mundo',
        type: CardType.RELIC,
        element: Element.EARTH,
        rarity: Rarity.LEGENDARY,
        manaCost: 5,
        damage: 0,
        defense: 15,
        effects: [
            { type: EffectType.SHIELD, value: 15, duration: 1 },
            { type: EffectType.REGENERATION, value: 5, duration: 5 },
            { type: EffectType.DRAW, value: 2, duration: 0, instant: true }
        ],
        description: 'Proteção da natureza. Escudo, regeneração e compra 2 cartas.',
        art: null,
        artEmoji: '🌳'
    }
};

// Tabela de forças e fraquezas elementais
const ELEMENTAL_TABLE = {
    [Element.FIRE]: { strong: Element.EARTH, weak: Element.WATER },
    [Element.WATER]: { strong: Element.FIRE, weak: Element.AIR },
    [Element.EARTH]: { strong: Element.AIR, weak: Element.FIRE },
    [Element.AIR]: { strong: Element.WATER, weak: Element.EARTH },
    [Element.LIGHT]: { strong: Element.DARK, weak: Element.DARK },
    [Element.DARK]: { strong: Element.LIGHT, weak: Element.LIGHT },
    [Element.NEUTRAL]: { strong: null, weak: null }
};

/**
 * Calcula modificador de dano baseado nos elementos
 */
function getElementalModifier(attackerElement, defenderElement) {
    const relation = ELEMENTAL_TABLE[attackerElement];
    if (!relation) return 1;

    if (relation.strong === defenderElement) return 1.5;  // 50% mais dano
    if (relation.weak === defenderElement) return 0.5;    // 50% menos dano
    return 1;
}

/**
 * Retorna todas as cartas de uma raridade específica
 */
function getCardsByRarity(rarity) {
    return Object.values(CARDS_DATABASE).filter(card => card.rarity === rarity);
}

/**
 * Retorna todas as cartas de um elemento específico
 */
function getCardsByElement(element) {
    return Object.values(CARDS_DATABASE).filter(card => card.element === element);
}

/**
 * Retorna uma carta aleatória
 */
function getRandomCard(rarity = null) {
    let cards = Object.values(CARDS_DATABASE);
    if (rarity) {
        cards = cards.filter(card => card.rarity === rarity);
    }
    return cards[Math.floor(Math.random() * cards.length)];
}

/**
 * Retorna uma carta baseada nas probabilidades de drop
 */
function getRandomCardByDropRate() {
    const roll = Math.random() * 100;

    if (roll < 1) return getRandomCard(Rarity.LEGENDARY);
    if (roll < 5) return getRandomCard(Rarity.EPIC);
    if (roll < 20) return getRandomCard(Rarity.RARE);
    if (roll < 50) return getRandomCard(Rarity.UNCOMMON);
    return getRandomCard(Rarity.COMMON);
}

// Exportar para uso global
window.CardType = CardType;
window.Element = Element;
window.Rarity = Rarity;
window.EffectType = EffectType;
window.TYPE_ICONS = TYPE_ICONS;
window.ELEMENT_ICONS = ELEMENT_ICONS;
window.CARDS_DATABASE = CARDS_DATABASE;
window.ELEMENTAL_TABLE = ELEMENTAL_TABLE;
window.getElementalModifier = getElementalModifier;
window.getCardsByRarity = getCardsByRarity;
window.getCardsByElement = getCardsByElement;
window.getRandomCard = getRandomCard;
window.getRandomCardByDropRate = getRandomCardByDropRate;
