/**
 * EVAARIA SECUNDA - Sistema de Mapa/Exploração
 */

class MapSystem {
    constructor() {
        this.game = null;
        this.currentMap = null;
        this.playerPosition = { x: 0, y: 0 };
        this.entities = [];

        // DOM
        this.elements = {};
        this.tileSize = 48;

        // Estado
        this.isMoving = false;
        this.dialogActive = false;
        this.currentDialog = null;
        this.currentDialogIndex = 0;
    }

    /**
     * Inicializa o sistema de mapa
     */
    init(game) {
        this.game = game;
        this.cacheDOM();
        this.setupEventListeners();
        console.log('🗺️ Sistema de mapa inicializado');
    }

    /**
     * Cacheia elementos DOM
     */
    cacheDOM() {
        this.elements = {
            mapScreen: document.getElementById('map-screen'),
            mapContainer: document.getElementById('map-container')
        };
    }

    /**
     * Configura event listeners
     */
    setupEventListeners() {
        // Movimento por teclado
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    /**
     * Carrega um mapa
     */
    loadMap(mapId) {
        const mapData = window.getMap(mapId);
        if (!mapData) {
            console.error(`❌ Mapa não encontrado: ${mapId}`);
            return;
        }

        this.currentMap = mapData;
        this.playerPosition = { ...mapData.playerStart };
        this.entities = [...(mapData.entities || [])];

        console.log(`🗺️ Carregando mapa: ${mapData.name}`);

        this.renderMap();
        this.renderEntities();
        this.renderPlayer();
        this.updateUI();
    }

    /**
     * Renderiza o mapa
     */
    renderMap() {
        if (!this.elements.mapContainer || !this.currentMap) return;

        // Limpar container
        this.elements.mapContainer.innerHTML = '';

        // Criar estrutura
        const header = this.createHeader();
        const viewport = document.createElement('div');
        viewport.className = 'map-viewport';
        viewport.id = 'map-viewport';

        const grid = document.createElement('div');
        grid.className = 'map-grid';
        grid.id = 'map-grid';
        grid.style.gridTemplateColumns = `repeat(${this.currentMap.width}, ${this.tileSize}px)`;
        grid.style.gridTemplateRows = `repeat(${this.currentMap.height}, ${this.tileSize}px)`;

        // Renderizar tiles
        this.currentMap.tiles.forEach((row, y) => {
            row.forEach((tileType, x) => {
                const tile = this.createTile(tileType, x, y);
                grid.appendChild(tile);
            });
        });

        viewport.appendChild(grid);
        this.elements.mapContainer.appendChild(header);
        this.elements.mapContainer.appendChild(viewport);

        // Criar UI adicional
        this.createMapUI();

        // Centrar na posição do jogador
        this.centerOnPlayer();
    }

    /**
     * Cria header do mapa
     */
    createHeader() {
        const header = document.createElement('div');
        header.className = 'map-header';

        const title = document.createElement('h2');
        title.className = 'map-title';
        title.textContent = this.currentMap.name;

        const stats = document.createElement('div');
        stats.className = 'player-stats-bar';
        stats.innerHTML = `
            <div class="stat-item">
                <span class="icon">❤️</span>
                <span class="value" id="map-hp">${this.game.player.hp}/${this.game.player.maxHp}</span>
            </div>
            <div class="stat-item">
                <span class="icon">⭐</span>
                <span class="value" id="map-level">Nv.${this.game.player.level}</span>
            </div>
            <div class="stat-item">
                <span class="icon">💰</span>
                <span class="value" id="map-gold">${this.game.player.gold}</span>
            </div>
        `;

        const menuBtn = document.createElement('button');
        menuBtn.className = 'back-btn';
        menuBtn.textContent = '☰ Menu';
        menuBtn.addEventListener('click', () => this.openPauseMenu());

        header.appendChild(title);
        header.appendChild(stats);
        header.appendChild(menuBtn);

        return header;
    }

    /**
     * Cria um tile
     */
    createTile(tileType, x, y) {
        const tile = document.createElement('div');
        tile.className = `tile ${tileType}`;
        tile.dataset.x = x;
        tile.dataset.y = y;
        tile.dataset.type = tileType;

        const props = window.TILE_PROPERTIES[tileType];

        if (props?.walkable) {
            tile.classList.add('walkable');
            tile.addEventListener('click', () => this.onTileClick(x, y));
        } else {
            tile.classList.add('blocked');
        }

        // Ícone do tile (se tiver)
        if (props?.icon) {
            tile.textContent = props.icon;
        }

        return tile;
    }

    /**
     * Cria UI adicional do mapa
     */
    createMapUI() {
        // Mini health bar
        const healthMini = document.createElement('div');
        healthMini.className = 'map-health-mini';
        healthMini.id = 'map-health-mini';
        healthMini.innerHTML = `
            <span>❤️</span>
            <div class="health-bar">
                <div class="health-fill player-health" style="width: ${(this.game.player.hp / this.game.player.maxHp) * 100}%"></div>
            </div>
        `;

        // Botões de ação
        const actions = document.createElement('div');
        actions.className = 'map-actions';
        actions.innerHTML = `
            <button class="map-action-btn" id="btn-inventory">📦 Inventário</button>
            <button class="map-action-btn" id="btn-deck">🃏 Deck</button>
        `;

        this.elements.mapContainer.appendChild(healthMini);
        this.elements.mapContainer.appendChild(actions);

        // Event listeners
        document.getElementById('btn-inventory')?.addEventListener('click', () => {
            console.log('Inventário (em breve)');
        });

        document.getElementById('btn-deck')?.addEventListener('click', () => {
            this.game.changeState(window.GameState.COLLECTION);
        });
    }

    /**
     * Renderiza entidades no mapa
     */
    renderEntities() {
        const viewport = document.getElementById('map-viewport');
        if (!viewport) return;

        // Remover entidades antigas
        viewport.querySelectorAll('.entity-enemy, .entity-npc, .entity-item, .entity-portal').forEach(e => e.remove());

        // Renderizar cada entidade
        this.entities.forEach((entity, index) => {
            const el = document.createElement('div');
            el.className = `entity-${entity.type}`;
            el.dataset.index = index;
            el.style.setProperty('--tile-size', `${this.tileSize}px`);
            el.style.left = `${entity.x * this.tileSize}px`;
            el.style.top = `${entity.y * this.tileSize}px`;

            // Ícone baseado no tipo
            if (entity.type === 'enemy') {
                const enemyData = window.ENEMIES_DATABASE[entity.enemyId];
                el.textContent = enemyData?.portrait || '👹';
            } else if (entity.type === 'npc') {
                el.textContent = entity.icon || '🧑';
            } else if (entity.type === 'item') {
                el.textContent = entity.icon || '📦';
            }

            // Click handler
            el.addEventListener('click', () => this.onEntityClick(entity, index));

            viewport.appendChild(el);
        });
    }

    /**
     * Renderiza o jogador
     */
    renderPlayer() {
        const viewport = document.getElementById('map-viewport');
        if (!viewport) return;

        // Remover jogador antigo
        viewport.querySelector('.entity-player')?.remove();

        // Criar jogador
        const player = document.createElement('div');
        player.className = 'entity-player';
        player.id = 'player-entity';
        player.textContent = '🧙';
        player.style.setProperty('--tile-size', `${this.tileSize}px`);
        player.style.left = `${this.playerPosition.x * this.tileSize}px`;
        player.style.top = `${this.playerPosition.y * this.tileSize}px`;

        viewport.appendChild(player);
    }

    /**
     * Move o jogador
     */
    movePlayer(dx, dy) {
        if (this.isMoving || this.dialogActive) return;

        const newX = this.playerPosition.x + dx;
        const newY = this.playerPosition.y + dy;

        console.log(`🚶 Tentando mover para (${newX}, ${newY})`);

        // Verificar limites
        if (newX < 0 || newX >= this.currentMap.width ||
            newY < 0 || newY >= this.currentMap.height) {
            console.log('❌ Fora dos limites');
            return;
        }

        // Verificar se tile é caminhável
        const tileType = this.currentMap.tiles[newY][newX];
        if (!window.isTileWalkable(tileType)) {
            console.log('❌ Tile não caminhável');
            return;
        }

        // Verificar se tem inimigo no caminho
        const enemyAtPos = this.entities.find(e =>
            e.type === 'enemy' && e.x === newX && e.y === newY
        );

        if (enemyAtPos) {
            console.log('⚔️ Inimigo encontrado! Iniciando batalha...');
            this.initiateEncounter(enemyAtPos);
            return;
        }

        // Mover
        this.isMoving = true;
        this.playerPosition.x = newX;
        this.playerPosition.y = newY;

        console.log(`✅ Movido para (${newX}, ${newY})`);

        // Atualizar posição visual
        const playerEl = document.getElementById('player-entity');
        if (playerEl) {
            playerEl.style.left = `${newX * this.tileSize}px`;
            playerEl.style.top = `${newY * this.tileSize}px`;
        }

        // Centrar câmera
        this.centerOnPlayer();

        // Verificar inimigos adjacentes (para facilitar encontros)
        this.checkAdjacentEnemies(newX, newY);

        // Verificar encontro aleatório
        this.checkRandomEncounter(tileType);

        // Verificar portal
        this.checkPortal(newX, newY, tileType);

        // Verificar item
        this.checkItem(newX, newY);

        // Verificar NPC adjacente
        this.checkNearbyNPC();

        setTimeout(() => {
            this.isMoving = false;
        }, 200);
    }

    /**
     * Verifica se há inimigos adjacentes ao jogador
     */
    checkAdjacentEnemies(x, y) {
        const adjacentPositions = [
            { x: x - 1, y }, { x: x + 1, y },
            { x, y: y - 1 }, { x, y: y + 1 }
        ];

        const adjacentEnemy = this.entities.find(e =>
            e.type === 'enemy' &&
            adjacentPositions.some(pos => pos.x === e.x && pos.y === e.y)
        );

        if (adjacentEnemy) {
            console.log(`👹 Inimigo adjacente detectado em (${adjacentEnemy.x}, ${adjacentEnemy.y})`);
        }
    }

    /**
     * Centra a câmera no jogador
     */
    centerOnPlayer() {
        const viewport = document.getElementById('map-viewport');
        const grid = document.getElementById('map-grid');
        if (!viewport || !grid) return;

        const viewportRect = viewport.getBoundingClientRect();
        const centerX = viewportRect.width / 2;
        const centerY = viewportRect.height / 2;

        const playerPixelX = this.playerPosition.x * this.tileSize + this.tileSize / 2;
        const playerPixelY = this.playerPosition.y * this.tileSize + this.tileSize / 2;

        const offsetX = centerX - playerPixelX;
        const offsetY = centerY - playerPixelY;

        grid.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }

    /**
     * Handler de tecla
     */
    handleKeyDown(e) {
        if (this.game.currentState !== window.GameState.MAP) return;

        if (this.dialogActive) {
            if (e.key === 'Enter' || e.key === ' ') {
                this.advanceDialog();
            }
            return;
        }

        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                this.movePlayer(0, -1);
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                this.movePlayer(0, 1);
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.movePlayer(-1, 0);
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.movePlayer(1, 0);
                break;
            case 'Escape':
                this.openPauseMenu();
                break;
        }
    }

    /**
     * Handler de clique em tile
     */
    onTileClick(x, y) {
        // Movimento simples - um passo por vez
        const dx = Math.sign(x - this.playerPosition.x);
        const dy = Math.sign(y - this.playerPosition.y);

        // Prioriza movimento horizontal/vertical
        if (Math.abs(x - this.playerPosition.x) > Math.abs(y - this.playerPosition.y)) {
            if (dx !== 0) this.movePlayer(dx, 0);
            else if (dy !== 0) this.movePlayer(0, dy);
        } else {
            if (dy !== 0) this.movePlayer(0, dy);
            else if (dx !== 0) this.movePlayer(dx, 0);
        }
    }

    /**
     * Handler de clique em entidade
     */
    onEntityClick(entity, index) {
        // Verificar distância
        const distance = Math.abs(entity.x - this.playerPosition.x) +
            Math.abs(entity.y - this.playerPosition.y);

        if (distance > 1) {
            // Mover em direção à entidade
            const dx = Math.sign(entity.x - this.playerPosition.x);
            const dy = Math.sign(entity.y - this.playerPosition.y);
            this.movePlayer(dx, dy);
            return;
        }

        // Interagir
        switch (entity.type) {
            case 'enemy':
                this.initiateEncounter(entity);
                break;
            case 'npc':
                this.startDialog(entity);
                break;
            case 'item':
                this.collectItem(entity, index);
                break;
        }
    }

    /**
     * Verifica encontro aleatório
     */
    checkRandomEncounter(tileType) {
        const encounterRate = window.getTileEncounterRate(tileType);

        if (Math.random() < encounterRate) {
            // Flash de encontro
            this.showEncounterFlash();

            // Iniciar batalha
            setTimeout(() => {
                const enemyData = window.getRandomEnemy(
                    window.EnemyType.NORMAL,
                    this.currentMap.area
                );
                window.battleSystem.currentMapId = this.currentMap.id;
                window.battleSystem.returnToMap = true;
                this.game.changeState(window.GameState.BATTLE);
            }, 500);
        }
    }

    /**
     * Inicia encontro com inimigo específico
     */
    initiateEncounter(entity) {
        this.showEncounterFlash();

        setTimeout(() => {
            const enemyData = window.ENEMIES_DATABASE[entity.enemyId];

            // Guardar referência para remover depois da batalha
            window.battleSystem.currentMapId = this.currentMap.id;
            window.battleSystem.currentEnemyEntity = entity;
            window.battleSystem.returnToMap = true;

            // Iniciar batalha com esse inimigo específico
            this.game.changeState(window.GameState.BATTLE);
            window.battleSystem.startBattle(enemyData);
        }, 500);
    }

    /**
     * Flash de encontro
     */
    showEncounterFlash() {
        const flash = document.createElement('div');
        flash.className = 'encounter-flash';
        document.body.appendChild(flash);

        setTimeout(() => flash.remove(), 500);
    }

    /**
     * Verifica portal/porta
     */
    checkPortal(x, y, tileType) {
        if (tileType === window.TileType.ENTRANCE || tileType === window.TileType.EXIT) {
            const connectionKey = `${tileType}_${y}_${x}`;
            const connection = this.currentMap.connections?.[connectionKey];

            if (connection) {
                console.log(`🚪 Transição para: ${connection.map}`);
                this.loadMap(connection.map);
            }
        }
    }

    /**
     * Verifica item
     */
    checkItem(x, y) {
        const itemIndex = this.entities.findIndex(e =>
            e.type === 'item' && e.x === x && e.y === y
        );

        if (itemIndex !== -1) {
            this.collectItem(this.entities[itemIndex], itemIndex);
        }
    }

    /**
     * Coleta item
     */
    collectItem(entity, index) {
        console.log('📦 Item coletado!');

        // Dar recompensa
        if (entity.itemType === 'chest') {
            // Carta aleatória
            const card = window.getRandomCardByDropRate();
            this.game.player.collection.push({ ...card });
            console.log(`🃏 Nova carta: ${card.name}`);

            // Também um pouco de ouro
            const gold = Math.floor(Math.random() * 30) + 10;
            this.game.player.gold += gold;
        }

        // Remover do mapa
        this.entities.splice(index, 1);
        this.renderEntities();
        this.updateUI();
    }

    /**
     * Verifica NPC próximo
     */
    checkNearbyNPC() {
        // Não auto-iniciar diálogo, apenas destacar
    }

    /**
     * Inicia diálogo com NPC
     */
    startDialog(entity) {
        const npcData = window.NPCS_DATABASE[entity.npcId];
        if (!npcData) return;

        this.dialogActive = true;
        this.currentDialog = npcData;
        this.currentDialogIndex = 0;

        this.showDialog(npcData.dialogues[0], npcData.name);
    }

    /**
     * Mostra caixa de diálogo
     */
    showDialog(dialogData, speakerName) {
        // Remover diálogo anterior
        document.querySelector('.dialog-box')?.remove();

        const dialog = document.createElement('div');
        dialog.className = 'dialog-box';
        dialog.innerHTML = `
            <p class="dialog-speaker">${speakerName}</p>
            <p class="dialog-text">${dialogData.text}</p>
            ${dialogData.options ? this.createDialogOptions(dialogData.options) :
                '<span class="dialog-continue">▼ Pressione ENTER</span>'}
        `;

        this.elements.mapContainer.appendChild(dialog);

        // Adicionar listeners às opções
        if (dialogData.options) {
            dialog.querySelectorAll('.dialog-option').forEach((opt, i) => {
                opt.addEventListener('click', () => this.selectDialogOption(dialogData.options[i]));
            });
        }
    }

    /**
     * Cria opções de diálogo
     */
    createDialogOptions(options) {
        return `
            <div class="dialog-options">
                ${options.map((opt, i) => `
                    <button class="dialog-option" data-index="${i}">${opt.text}</button>
                `).join('')}
            </div>
        `;
    }

    /**
     * Seleciona opção de diálogo
     */
    selectDialogOption(option) {
        if (option.end) {
            this.endDialog();
            return;
        }

        if (option.action) {
            this.executeDialogAction(option.action);
        }

        if (option.next !== undefined) {
            this.currentDialogIndex = option.next;
            this.showDialog(
                this.currentDialog.dialogues[this.currentDialogIndex],
                this.currentDialog.name
            );
        } else {
            this.endDialog();
        }
    }

    /**
     * Avança diálogo
     */
    advanceDialog() {
        if (!this.dialogActive) return;

        // Se diálogo atual não tem opções, avançar
        const currentDialogData = this.currentDialog.dialogues[this.currentDialogIndex];
        if (!currentDialogData.options) {
            this.endDialog();
        }
    }

    /**
     * Executa ação de diálogo
     */
    executeDialogAction(action) {
        switch (action) {
            case 'heal':
                this.game.player.hp = this.game.player.maxHp;
                console.log('💚 Curado completamente!');
                this.updateUI();
                break;
            case 'openShop':
                console.log('Loja (em breve)');
                break;
        }
    }

    /**
     * Encerra diálogo
     */
    endDialog() {
        document.querySelector('.dialog-box')?.remove();
        this.dialogActive = false;
        this.currentDialog = null;
        this.currentDialogIndex = 0;
    }

    /**
     * Abre menu de pausa
     */
    openPauseMenu() {
        // Por enquanto, volta ao menu principal
        this.game.changeState(window.GameState.MENU);
    }

    /**
     * Atualiza UI
     */
    updateUI() {
        const hpEl = document.getElementById('map-hp');
        const levelEl = document.getElementById('map-level');
        const goldEl = document.getElementById('map-gold');
        const healthMini = document.querySelector('#map-health-mini .health-fill');

        if (hpEl) hpEl.textContent = `${this.game.player.hp}/${this.game.player.maxHp}`;
        if (levelEl) levelEl.textContent = `Nv.${this.game.player.level}`;
        if (goldEl) goldEl.textContent = this.game.player.gold;
        if (healthMini) healthMini.style.width = `${(this.game.player.hp / this.game.player.maxHp) * 100}%`;
    }

    /**
     * Remove inimigo derrotado do mapa
     */
    removeDefeatedEnemy(entity) {
        const index = this.entities.findIndex(e => e === entity);
        if (index !== -1) {
            this.entities.splice(index, 1);
        }
    }
}

// Singleton global
window.mapSystem = new MapSystem();
window.MapSystem = MapSystem;
