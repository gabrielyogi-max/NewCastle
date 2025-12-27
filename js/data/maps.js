/**
 * EVAARIA SECUNDA - Database de Mapas
 */

// Tipos de tile
const TileType = {
    GRASS: 'grass',
    FOREST: 'forest',
    WATER: 'water',
    MOUNTAIN: 'mountain',
    PATH: 'path',
    SAND: 'sand',
    LAVA: 'lava',
    WALL: 'wall',
    FLOOR: 'floor',
    ENTRANCE: 'entrance',
    EXIT: 'exit'
};

// Propriedades dos tiles
const TILE_PROPERTIES = {
    [TileType.GRASS]: { walkable: true, icon: '🌿', encounterRate: 0.1 },
    [TileType.FOREST]: { walkable: true, icon: '🌲', encounterRate: 0.2 },
    [TileType.WATER]: { walkable: false, icon: '🌊', encounterRate: 0 },
    [TileType.MOUNTAIN]: { walkable: false, icon: '⛰️', encounterRate: 0 },
    [TileType.PATH]: { walkable: true, icon: '', encounterRate: 0.05 },
    [TileType.SAND]: { walkable: true, icon: '', encounterRate: 0.08 },
    [TileType.LAVA]: { walkable: false, icon: '🔥', encounterRate: 0 },
    [TileType.WALL]: { walkable: false, icon: '', encounterRate: 0 },
    [TileType.FLOOR]: { walkable: true, icon: '', encounterRate: 0.15 },
    [TileType.ENTRANCE]: { walkable: true, icon: '🚪', encounterRate: 0, isPortal: true },
    [TileType.EXIT]: { walkable: true, icon: '🚪', encounterRate: 0, isPortal: true }
};

// Atalhos para criar mapas
const T = TileType;

// Mapas do jogo
const MAPS_DATABASE = {
    // ==========================================
    // FLORESTA INICIAL (Área 1)
    // ==========================================

    starting_forest: {
        id: 'starting_forest',
        name: 'Floresta Sombria',
        width: 15,
        height: 12,
        playerStart: { x: 7, y: 10 },
        area: 'forest',
        tiles: [
            // Linha 0 (topo)
            [T.FOREST, T.FOREST, T.FOREST, T.MOUNTAIN, T.MOUNTAIN, T.MOUNTAIN, T.FOREST, T.EXIT, T.FOREST, T.MOUNTAIN, T.MOUNTAIN, T.MOUNTAIN, T.FOREST, T.FOREST, T.FOREST],
            // Linha 1
            [T.FOREST, T.GRASS, T.GRASS, T.FOREST, T.WATER, T.WATER, T.GRASS, T.PATH, T.GRASS, T.WATER, T.WATER, T.FOREST, T.GRASS, T.GRASS, T.FOREST],
            // Linha 2
            [T.FOREST, T.GRASS, T.PATH, T.PATH, T.PATH, T.GRASS, T.GRASS, T.PATH, T.GRASS, T.GRASS, T.PATH, T.PATH, T.PATH, T.GRASS, T.FOREST],
            // Linha 3
            [T.FOREST, T.GRASS, T.PATH, T.FOREST, T.PATH, T.FOREST, T.GRASS, T.PATH, T.GRASS, T.FOREST, T.PATH, T.FOREST, T.PATH, T.GRASS, T.FOREST],
            // Linha 4
            [T.FOREST, T.GRASS, T.PATH, T.PATH, T.PATH, T.GRASS, T.GRASS, T.PATH, T.GRASS, T.GRASS, T.PATH, T.PATH, T.PATH, T.GRASS, T.FOREST],
            // Linha 5
            [T.FOREST, T.GRASS, T.GRASS, T.GRASS, T.GRASS, T.GRASS, T.PATH, T.PATH, T.PATH, T.GRASS, T.GRASS, T.GRASS, T.GRASS, T.GRASS, T.FOREST],
            // Linha 6
            [T.WATER, T.WATER, T.GRASS, T.GRASS, T.GRASS, T.PATH, T.PATH, T.GRASS, T.PATH, T.PATH, T.GRASS, T.GRASS, T.GRASS, T.WATER, T.WATER],
            // Linha 7
            [T.FOREST, T.GRASS, T.GRASS, T.FOREST, T.PATH, T.PATH, T.GRASS, T.GRASS, T.GRASS, T.PATH, T.PATH, T.FOREST, T.GRASS, T.GRASS, T.FOREST],
            // Linha 8
            [T.FOREST, T.GRASS, T.PATH, T.PATH, T.PATH, T.GRASS, T.GRASS, T.GRASS, T.GRASS, T.GRASS, T.PATH, T.PATH, T.PATH, T.GRASS, T.FOREST],
            // Linha 9
            [T.FOREST, T.GRASS, T.PATH, T.GRASS, T.GRASS, T.GRASS, T.GRASS, T.PATH, T.GRASS, T.GRASS, T.GRASS, T.GRASS, T.PATH, T.GRASS, T.FOREST],
            // Linha 10
            [T.FOREST, T.GRASS, T.GRASS, T.GRASS, T.GRASS, T.GRASS, T.PATH, T.PATH, T.PATH, T.GRASS, T.GRASS, T.GRASS, T.GRASS, T.GRASS, T.FOREST],
            // Linha 11 (base)
            [T.FOREST, T.FOREST, T.FOREST, T.FOREST, T.FOREST, T.ENTRANCE, T.PATH, T.GRASS, T.PATH, T.ENTRANCE, T.FOREST, T.FOREST, T.FOREST, T.FOREST, T.FOREST]
        ],
        entities: [
            { type: 'enemy', enemyId: 'goblin', x: 3, y: 3 },
            { type: 'enemy', enemyId: 'wolf', x: 11, y: 3 },
            { type: 'enemy', enemyId: 'slime', x: 7, y: 5 },
            { type: 'npc', npcId: 'merchant', x: 2, y: 8, icon: '🧙' },
            { type: 'item', itemType: 'chest', x: 12, y: 8, icon: '📦' }
        ],
        connections: {
            'exit_0_7': { map: 'dark_caves', entrance: 'entrance_from_forest' },
            'entrance_11_5': { map: 'village', entrance: 'exit_to_forest' },
            'entrance_11_9': { map: 'village', entrance: 'exit_to_forest' }
        },
        ambience: 'forest_ambient'
    },

    // ==========================================
    // VILA (Hub)
    // ==========================================

    village: {
        id: 'village',
        name: 'Vila de Evaaria',
        width: 12,
        height: 10,
        playerStart: { x: 6, y: 8 },
        area: 'village',
        tiles: [
            [T.GRASS, T.GRASS, T.WALL, T.WALL, T.WALL, T.WALL, T.WALL, T.WALL, T.WALL, T.WALL, T.GRASS, T.GRASS],
            [T.GRASS, T.WALL, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.WALL, T.GRASS],
            [T.WALL, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.WALL],
            [T.WALL, T.FLOOR, T.FLOOR, T.FLOOR, T.PATH, T.PATH, T.PATH, T.PATH, T.FLOOR, T.FLOOR, T.FLOOR, T.WALL],
            [T.WALL, T.FLOOR, T.FLOOR, T.FLOOR, T.PATH, T.FLOOR, T.FLOOR, T.PATH, T.FLOOR, T.FLOOR, T.FLOOR, T.WALL],
            [T.WALL, T.FLOOR, T.FLOOR, T.FLOOR, T.PATH, T.FLOOR, T.FLOOR, T.PATH, T.FLOOR, T.FLOOR, T.FLOOR, T.WALL],
            [T.WALL, T.FLOOR, T.FLOOR, T.FLOOR, T.PATH, T.PATH, T.PATH, T.PATH, T.FLOOR, T.FLOOR, T.FLOOR, T.WALL],
            [T.GRASS, T.WALL, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.PATH, T.FLOOR, T.FLOOR, T.FLOOR, T.WALL, T.GRASS],
            [T.GRASS, T.GRASS, T.WALL, T.WALL, T.WALL, T.WALL, T.EXIT, T.WALL, T.WALL, T.WALL, T.GRASS, T.GRASS],
            [T.GRASS, T.GRASS, T.GRASS, T.GRASS, T.GRASS, T.GRASS, T.PATH, T.GRASS, T.GRASS, T.GRASS, T.GRASS, T.GRASS]
        ],
        entities: [
            { type: 'npc', npcId: 'elder', x: 5, y: 2, icon: '👴' },
            { type: 'npc', npcId: 'merchant', x: 3, y: 5, icon: '🛒' },
            { type: 'npc', npcId: 'healer', x: 9, y: 5, icon: '💚' }
        ],
        connections: {
            'exit_8_6': { map: 'starting_forest', entrance: 'entrance_from_village' }
        },
        ambience: 'village_ambient'
    },

    // ==========================================
    // CAVERNAS ESCURAS (Área 2)
    // ==========================================

    dark_caves: {
        id: 'dark_caves',
        name: 'Cavernas Profundas',
        width: 14,
        height: 11,
        playerStart: { x: 7, y: 9 },
        area: 'caves',
        tiles: [
            [T.WALL, T.WALL, T.WALL, T.WALL, T.WALL, T.EXIT, T.FLOOR, T.EXIT, T.WALL, T.WALL, T.WALL, T.WALL, T.WALL, T.WALL],
            [T.WALL, T.FLOOR, T.FLOOR, T.FLOOR, T.WALL, T.FLOOR, T.FLOOR, T.FLOOR, T.WALL, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.WALL],
            [T.WALL, T.FLOOR, T.LAVA, T.FLOOR, T.WALL, T.FLOOR, T.FLOOR, T.FLOOR, T.WALL, T.FLOOR, T.LAVA, T.LAVA, T.FLOOR, T.WALL],
            [T.WALL, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.WALL, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.WALL],
            [T.WALL, T.WALL, T.FLOOR, T.WALL, T.WALL, T.FLOOR, T.WALL, T.FLOOR, T.WALL, T.WALL, T.FLOOR, T.WALL, T.WALL, T.WALL],
            [T.WALL, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.WALL],
            [T.WALL, T.FLOOR, T.WALL, T.WALL, T.FLOOR, T.WALL, T.WALL, T.WALL, T.FLOOR, T.WALL, T.WALL, T.FLOOR, T.FLOOR, T.WALL],
            [T.WALL, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.WALL],
            [T.WALL, T.FLOOR, T.FLOOR, T.WALL, T.WALL, T.WALL, T.FLOOR, T.FLOOR, T.WALL, T.WALL, T.WALL, T.FLOOR, T.FLOOR, T.WALL],
            [T.WALL, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.ENTRANCE, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.FLOOR, T.WALL],
            [T.WALL, T.WALL, T.WALL, T.WALL, T.WALL, T.WALL, T.WALL, T.WALL, T.WALL, T.WALL, T.WALL, T.WALL, T.WALL, T.WALL]
        ],
        entities: [
            { type: 'enemy', enemyId: 'skeleton', x: 2, y: 1 },
            { type: 'enemy', enemyId: 'bat', x: 11, y: 1 },
            { type: 'enemy', enemyId: 'skeleton', x: 5, y: 5 },
            { type: 'enemy', enemyId: 'dark_mage', x: 7, y: 3, isBoss: true },
            { type: 'item', itemType: 'chest', x: 12, y: 7, icon: '📦' }
        ],
        connections: {
            'entrance_9_7': { map: 'starting_forest', entrance: 'exit_to_caves' },
            'exit_0_5': { map: 'volcano', entrance: 'entrance_from_caves' },
            'exit_0_7': { map: 'volcano', entrance: 'entrance_from_caves' }
        },
        ambience: 'cave_ambient'
    }
};

// Database de NPCs
const NPCS_DATABASE = {
    elder: {
        id: 'elder',
        name: 'Ancião',
        icon: '👴',
        dialogues: [
            {
                text: 'Bem-vindo a Evaaria Secunda, jovem aventureiro. Tempos sombrios se aproximam...',
                options: [
                    { text: 'O que devo fazer?', next: 1 },
                    { text: 'Até logo.', end: true }
                ]
            },
            {
                text: 'Você deve explorar as terras e derrotar os monstros que as infestam. Suas cartas são sua força.',
                options: [
                    { text: 'Entendido!', end: true }
                ]
            }
        ]
    },

    merchant: {
        id: 'merchant',
        name: 'Mercador',
        icon: '🛒',
        dialogues: [
            {
                text: 'Olá! Tenho itens raros à venda. Quer dar uma olhada?',
                options: [
                    { text: 'Ver loja', action: 'openShop' },
                    { text: 'Não, obrigado.', end: true }
                ]
            }
        ]
    },

    healer: {
        id: 'healer',
        name: 'Curandeira',
        icon: '💚',
        dialogues: [
            {
                text: 'Você parece cansado. Posso restaurar sua saúde gratuitamente.',
                options: [
                    { text: 'Curar-me', action: 'heal' },
                    { text: 'Estou bem, obrigado.', end: true }
                ]
            }
        ]
    }
};

/**
 * Retorna um mapa pelo ID
 */
function getMap(mapId) {
    return MAPS_DATABASE[mapId];
}

/**
 * Verifica se um tile é caminhável
 */
function isTileWalkable(tileType) {
    return TILE_PROPERTIES[tileType]?.walkable || false;
}

/**
 * Retorna taxa de encontro de um tile
 */
function getTileEncounterRate(tileType) {
    return TILE_PROPERTIES[tileType]?.encounterRate || 0;
}

/**
 * Gera um mapa simples de dungeon procedural
 */
function generateSimpleDungeon(width = 15, height = 12) {
    const tiles = [];

    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            // Bordas são paredes
            if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
                row.push(TileType.WALL);
            } else {
                // Interior é chão com algumas paredes aleatórias
                if (Math.random() < 0.15) {
                    row.push(TileType.WALL);
                } else {
                    row.push(TileType.FLOOR);
                }
            }
        }
        tiles.push(row);
    }

    // Garantir entrada e saída
    tiles[height - 1][Math.floor(width / 2)] = TileType.ENTRANCE;
    tiles[0][Math.floor(width / 2)] = TileType.EXIT;

    return {
        id: 'procedural_dungeon',
        name: 'Dungeon Aleatória',
        width,
        height,
        playerStart: { x: Math.floor(width / 2), y: height - 2 },
        area: 'caves',
        tiles,
        entities: []
    };
}

// Exportar para uso global
window.TileType = TileType;
window.TILE_PROPERTIES = TILE_PROPERTIES;
window.MAPS_DATABASE = MAPS_DATABASE;
window.NPCS_DATABASE = NPCS_DATABASE;
window.getMap = getMap;
window.isTileWalkable = isTileWalkable;
window.getTileEncounterRate = getTileEncounterRate;
window.generateSimpleDungeon = generateSimpleDungeon;
