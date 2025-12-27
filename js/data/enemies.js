/**
 * EVAARIA SECUNDA - Database de Inimigos
 */

// Tipos de inimigo
const EnemyType = {
    NORMAL: 'normal',
    ELITE: 'elite',
    BOSS: 'boss'
};

// Database de inimigos
const ENEMIES_DATABASE = {
    // ==========================================
    // INIMIGOS NORMAIS
    // ==========================================

    goblin: {
        id: 'goblin',
        name: 'Goblin',
        type: EnemyType.NORMAL,
        element: Element.EARTH,
        maxHp: 30,
        xpReward: 15,
        goldReward: [5, 15],
        portrait: '👺',
        deck: ['strike', 'strike', 'defend'],
        ai: 'aggressive',
        description: 'Um goblin pequeno mas irritante.'
    },

    skeleton: {
        id: 'skeleton',
        name: 'Esqueleto',
        type: EnemyType.NORMAL,
        element: Element.DARK,
        maxHp: 25,
        xpReward: 12,
        goldReward: [3, 10],
        portrait: '💀',
        deck: ['strike', 'strike', 'shadow_strike'],
        ai: 'balanced',
        description: 'Ossos reanimados por magia negra.'
    },

    slime: {
        id: 'slime',
        name: 'Slime',
        type: EnemyType.NORMAL,
        element: Element.WATER,
        maxHp: 35,
        xpReward: 10,
        goldReward: [2, 8],
        portrait: '🟢',
        deck: ['defend', 'defend', 'ice_shard'],
        ai: 'defensive',
        description: 'Uma gosma gelatinosa.'
    },

    wolf: {
        id: 'wolf',
        name: 'Lobo',
        type: EnemyType.NORMAL,
        element: Element.NEUTRAL,
        maxHp: 28,
        xpReward: 14,
        goldReward: [4, 12],
        portrait: '🐺',
        deck: ['strike', 'strike', 'strike'],
        ai: 'aggressive',
        description: 'Um lobo faminto.'
    },

    imp: {
        id: 'imp',
        name: 'Diabrete',
        type: EnemyType.NORMAL,
        element: Element.FIRE,
        maxHp: 22,
        xpReward: 18,
        goldReward: [8, 20],
        portrait: '😈',
        deck: ['spark', 'spark', 'fireball'],
        ai: 'magical',
        description: 'Um pequeno demônio travesso.'
    },

    bat: {
        id: 'bat',
        name: 'Morcego Gigante',
        type: EnemyType.NORMAL,
        element: Element.AIR,
        maxHp: 20,
        xpReward: 10,
        goldReward: [2, 6],
        portrait: '🦇',
        deck: ['strike', 'strike'],
        ai: 'aggressive',
        description: 'Um morcego das cavernas.'
    },

    // ==========================================
    // INIMIGOS ELITE
    // ==========================================

    orc_warrior: {
        id: 'orc_warrior',
        name: 'Guerreiro Orc',
        type: EnemyType.ELITE,
        element: Element.EARTH,
        maxHp: 60,
        xpReward: 40,
        goldReward: [20, 40],
        portrait: '👹',
        deck: ['strike', 'strike', 'strike', 'earthquake', 'stone_wall'],
        ai: 'aggressive',
        description: 'Um orc brutal e violento.'
    },

    dark_mage: {
        id: 'dark_mage',
        name: 'Mago Sombrio',
        type: EnemyType.ELITE,
        element: Element.DARK,
        maxHp: 45,
        xpReward: 50,
        goldReward: [25, 50],
        portrait: '🧙‍♂️',
        deck: ['shadow_strike', 'shadow_strike', 'void_curse', 'defend'],
        ai: 'magical',
        description: 'Um mago corrompido pelas trevas.'
    },

    ice_golem: {
        id: 'ice_golem',
        name: 'Golem de Gelo',
        type: EnemyType.ELITE,
        element: Element.WATER,
        maxHp: 80,
        xpReward: 45,
        goldReward: [30, 55],
        portrait: '🧊',
        deck: ['ice_shard', 'ice_shard', 'blizzard', 'defend', 'defend'],
        ai: 'defensive',
        description: 'Uma construção de gelo anciã.'
    },

    fire_elemental: {
        id: 'fire_elemental',
        name: 'Elemental de Fogo',
        type: EnemyType.ELITE,
        element: Element.FIRE,
        maxHp: 55,
        xpReward: 55,
        goldReward: [35, 60],
        portrait: '🔥',
        deck: ['fireball', 'fireball', 'inferno', 'flame_shield'],
        ai: 'magical',
        description: 'Pura essência de fogo.'
    },

    // ==========================================
    // BOSSES
    // ==========================================

    dragon: {
        id: 'dragon',
        name: 'Dragão Ancião',
        type: EnemyType.BOSS,
        element: Element.FIRE,
        maxHp: 150,
        xpReward: 200,
        goldReward: [100, 200],
        portrait: '🐉',
        deck: ['dragon_breath', 'dragon_breath', 'inferno', 'flame_shield', 'strike', 'strike'],
        ai: 'aggressive',
        description: 'O terror dos céus. Mestre do fogo.'
    },

    lich_king: {
        id: 'lich_king',
        name: 'Rei Lich',
        type: EnemyType.BOSS,
        element: Element.DARK,
        maxHp: 120,
        xpReward: 180,
        goldReward: [80, 180],
        portrait: '👑',
        deck: ['eternal_darkness', 'void_curse', 'shadow_strike', 'shadow_strike', 'heal'],
        ai: 'magical',
        description: 'Um rei morto-vivo com poderes necromânticos.'
    },

    titan: {
        id: 'titan',
        name: 'Titã da Terra',
        type: EnemyType.BOSS,
        element: Element.EARTH,
        maxHp: 200,
        xpReward: 250,
        goldReward: [150, 250],
        portrait: '🗿',
        deck: ['world_tree', 'earthquake', 'earthquake', 'stone_wall', 'stone_wall', 'strike'],
        ai: 'defensive',
        description: 'Um gigante anciã, guardião das montanhas.'
    },

    celestial: {
        id: 'celestial',
        name: 'Ser Celestial',
        type: EnemyType.BOSS,
        element: Element.LIGHT,
        maxHp: 100,
        xpReward: 300,
        goldReward: [200, 350],
        portrait: '👼',
        deck: ['celestial_judgment', 'celestial_judgment', 'divine_light', 'defend', 'heal'],
        ai: 'balanced',
        description: 'Um anjo caído, corrompido pelo poder.'
    }
};

// Encontros por área/nível
const ENCOUNTERS = {
    // Floresta (Nível 1-3)
    forest: {
        name: 'Floresta Sombria',
        normal: ['goblin', 'wolf', 'slime'],
        elite: ['orc_warrior'],
        boss: ['titan']
    },

    // Cavernas (Nível 4-6)
    caves: {
        name: 'Cavernas Profundas',
        normal: ['bat', 'skeleton', 'slime'],
        elite: ['ice_golem', 'dark_mage'],
        boss: ['lich_king']
    },

    // Vulcão (Nível 7-9)
    volcano: {
        name: 'Monte Vulcânico',
        normal: ['imp', 'skeleton', 'goblin'],
        elite: ['fire_elemental', 'orc_warrior'],
        boss: ['dragon']
    },

    // Santuário (Nível 10+)
    sanctuary: {
        name: 'Santuário Celestial',
        normal: ['imp', 'skeleton'],
        elite: ['dark_mage', 'fire_elemental', 'ice_golem'],
        boss: ['celestial']
    }
};

/**
 * Retorna um inimigo aleatório de um tipo específico
 */
function getRandomEnemy(type = EnemyType.NORMAL, area = null) {
    let enemies = Object.values(ENEMIES_DATABASE).filter(e => e.type === type);

    if (area && ENCOUNTERS[area]) {
        const areaEnemies = ENCOUNTERS[area][type === EnemyType.NORMAL ? 'normal' :
            type === EnemyType.ELITE ? 'elite' : 'boss'];
        enemies = enemies.filter(e => areaEnemies.includes(e.id));
    }

    return enemies[Math.floor(Math.random() * enemies.length)];
}

/**
 * Cria uma instância de inimigo com HP atual
 */
function createEnemyInstance(enemyData) {
    return {
        ...enemyData,
        hp: enemyData.maxHp,
        effects: [],
        deck: [...enemyData.deck], // Copia do deck
        hand: []
    };
}

// Exportar para uso global
window.EnemyType = EnemyType;
window.ENEMIES_DATABASE = ENEMIES_DATABASE;
window.ENCOUNTERS = ENCOUNTERS;
window.getRandomEnemy = getRandomEnemy;
window.createEnemyInstance = createEnemyInstance;
