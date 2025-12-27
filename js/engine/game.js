/**
 * EVAARIA SECUNDA - Game Engine
 * Sistema de estados e loop principal do jogo
 */

const GameState = {
    LOADING: 'loading',
    MENU: 'menu',
    BATTLE: 'battle',
    MAP: 'map',
    COLLECTION: 'collection',
    SETTINGS: 'settings'
};

class Game {
    constructor() {
        this.currentState = GameState.LOADING;
        this.previousState = null;
        this.isRunning = false;

        // Dados do jogador
        this.player = {
            name: 'Herói',
            level: 1,
            xp: 0,
            xpToNext: 100,
            maxHp: 100,
            hp: 100,
            maxMana: 10,
            mana: 3,
            manaPerTurn: 1,
            deck: [],
            collection: [],
            gold: 0
        };

        // Referências DOM
        this.screens = {};
        this.elements = {};

        // Callbacks de estado
        this.stateCallbacks = {
            onEnter: {},
            onExit: {}
        };
    }

    /**
     * Inicializa o jogo
     */
    init() {
        console.log('🎮 Inicializando Evaaria Secunda...');

        // Cachear referências DOM
        this.cacheDOM();

        // Registrar callbacks de estado
        this.registerStateCallbacks();

        // Configurar event listeners
        this.setupEventListeners();

        // Iniciar loading
        this.startLoading();
    }

    /**
     * Cacheia elementos DOM para performance
     */
    cacheDOM() {
        // Telas
        this.screens = {
            loading: document.getElementById('loading-screen'),
            menu: document.getElementById('menu-screen'),
            battle: document.getElementById('battle-screen'),
            map: document.getElementById('map-screen'),
            collection: document.getElementById('collection-screen')
        };

        // Elementos específicos
        this.elements = {
            loadingProgress: document.querySelector('.loading-progress'),
            loadingText: document.querySelector('.loading-text'),
            resultOverlay: document.getElementById('result-overlay'),
            resultTitle: document.getElementById('result-title'),
            rewards: document.getElementById('rewards')
        };
    }

    /**
     * Registra callbacks para transições de estado
     */
    registerStateCallbacks() {
        // Ao entrar em cada estado
        this.stateCallbacks.onEnter[GameState.MENU] = () => {
            console.log('📋 Menu carregado');
        };

        this.stateCallbacks.onEnter[GameState.BATTLE] = () => {
            console.log('⚔️ Iniciando batalha...');
            // Batalha é iniciada pelo mapSystem ou manualmente
        };

        this.stateCallbacks.onEnter[GameState.MAP] = () => {
            console.log('🗺️ Entrando no mapa...');
            if (window.mapSystem && !window.mapSystem.currentMap) {
                window.mapSystem.loadMap('starting_forest');
            }
        };

        this.stateCallbacks.onEnter[GameState.COLLECTION] = () => {
            console.log('🃏 Abrindo coleção...');
            this.renderCollection();
        };

        // Ao sair de cada estado
        this.stateCallbacks.onExit[GameState.BATTLE] = () => {
            console.log('🏁 Finalizando batalha...');
        };
    }

    /**
     * Configura event listeners globais
     */
    setupEventListeners() {
        // Botões do menu
        document.getElementById('btn-new-game')?.addEventListener('click', () => {
            this.startNewGame();
        });

        document.getElementById('btn-continue')?.addEventListener('click', () => {
            this.continueGame();
        });

        document.getElementById('btn-collection')?.addEventListener('click', () => {
            this.changeState(GameState.COLLECTION);
        });

        document.getElementById('btn-settings')?.addEventListener('click', () => {
            // TODO: Implementar configurações
            console.log('Configurações ainda não implementadas');
        });

        // Voltar ao menu
        document.getElementById('btn-back-menu')?.addEventListener('click', () => {
            this.changeState(GameState.MENU);
        });

        // Resultado da batalha
        document.getElementById('btn-continue-result')?.addEventListener('click', () => {
            this.hideResultOverlay();
            // Voltar ao mapa se veio de lá
            if (window.battleSystem?.returnToMap) {
                this.changeState(GameState.MAP);
            } else {
                this.changeState(GameState.MENU);
            }
        });

        // Teclas globais
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    /**
     * Simula loading do jogo
     */
    startLoading() {
        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 15;

            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);

                this.elements.loadingProgress.style.width = '100%';
                this.elements.loadingText.textContent = 'Pronto!';

                // Transição para menu
                setTimeout(() => {
                    this.changeState(GameState.MENU);
                }, 500);
            } else {
                this.elements.loadingProgress.style.width = `${progress}%`;

                // Textos de loading
                if (progress > 80) {
                    this.elements.loadingText.textContent = 'Preparando batalha...';
                } else if (progress > 50) {
                    this.elements.loadingText.textContent = 'Carregando cartas...';
                } else if (progress > 20) {
                    this.elements.loadingText.textContent = 'Inicializando...';
                }
            }
        }, 100);
    }

    /**
     * Muda o estado do jogo
     */
    changeState(newState) {
        if (this.currentState === newState) return;

        console.log(`🔄 Mudando estado: ${this.currentState} -> ${newState}`);

        // Callback de saída
        if (this.stateCallbacks.onExit[this.currentState]) {
            this.stateCallbacks.onExit[this.currentState]();
        }

        // Esconder tela atual
        const currentScreen = this.getScreenByState(this.currentState);
        if (currentScreen) {
            currentScreen.classList.remove('active');
        }

        // Guardar estado anterior
        this.previousState = this.currentState;
        this.currentState = newState;

        // Mostrar nova tela
        const newScreen = this.getScreenByState(newState);
        if (newScreen) {
            // Pequeno delay para transição suave
            setTimeout(() => {
                newScreen.classList.add('active');
            }, 50);
        }

        // Callback de entrada
        if (this.stateCallbacks.onEnter[newState]) {
            setTimeout(() => {
                this.stateCallbacks.onEnter[newState]();
            }, 100);
        }
    }

    /**
     * Retorna a tela DOM correspondente ao estado
     */
    getScreenByState(state) {
        const stateToScreen = {
            [GameState.LOADING]: this.screens.loading,
            [GameState.MENU]: this.screens.menu,
            [GameState.BATTLE]: this.screens.battle,
            [GameState.MAP]: this.screens.map,
            [GameState.COLLECTION]: this.screens.collection
        };
        return stateToScreen[state];
    }

    /**
     * Inicia novo jogo
     */
    startNewGame() {
        console.log('🆕 Iniciando novo jogo...');

        // Resetar dados do jogador
        this.player = {
            name: 'Herói',
            level: 1,
            xp: 0,
            xpToNext: 100,
            maxHp: 100,
            hp: 100,
            maxMana: 10,
            mana: 3,
            manaPerTurn: 1,
            deck: [],
            collection: [],
            gold: 0
        };

        // Criar deck inicial
        this.createStarterDeck();

        // Ir para o mapa
        this.changeState(GameState.MAP);
    }

    /**
     * Continua jogo salvo
     */
    continueGame() {
        const savedGame = localStorage.getItem('evaaria_save');
        if (savedGame) {
            this.player = JSON.parse(savedGame);
            this.changeState(GameState.BATTLE);
        }
    }

    /**
     * Cria deck inicial do jogador
     */
    createStarterDeck() {
        // Adicionar cartas básicas
        const starterCards = [
            'strike', 'strike', 'strike', 'strike', 'strike',
            'defend', 'defend', 'defend', 'defend',
            'spark', 'spark',
            'heal'
        ];

        starterCards.forEach(cardId => {
            const cardData = window.CARDS_DATABASE?.[cardId];
            if (cardData) {
                this.player.deck.push({ ...cardData, instanceId: this.generateId() });
                this.player.collection.push({ ...cardData, instanceId: this.generateId() });
            }
        });

        console.log(`📦 Deck inicial criado com ${this.player.deck.length} cartas`);
    }

    /**
     * Renderiza a coleção de cartas
     */
    renderCollection() {
        const grid = document.getElementById('collection-grid');
        if (!grid) return;

        grid.innerHTML = '';

        // Contar quantidade de cada carta
        const cardCounts = {};
        this.player.collection.forEach(card => {
            cardCounts[card.id] = (cardCounts[card.id] || 0) + 1;
        });

        // Renderizar cartas únicas
        const uniqueCards = [...new Map(this.player.collection.map(c => [c.id, c])).values()];

        uniqueCards.forEach(card => {
            const cardEl = window.CardRenderer?.createCardElement(card);
            if (cardEl) {
                // Adicionar contador
                const count = cardCounts[card.id];
                if (count > 1) {
                    const counter = document.createElement('div');
                    counter.className = 'card-count';
                    counter.textContent = `x${count}`;
                    counter.style.cssText = `
                        position: absolute;
                        top: -8px;
                        right: -8px;
                        background: var(--color-primary);
                        color: var(--color-bg-dark);
                        font-size: 0.5rem;
                        padding: 2px 6px;
                        border: 2px solid var(--color-bg-dark);
                    `;
                    cardEl.appendChild(counter);
                }
                grid.appendChild(cardEl);
            }
        });
    }

    /**
     * Mostra overlay de resultado
     */
    showResult(victory, rewards = {}) {
        const overlay = this.elements.resultOverlay;
        const title = this.elements.resultTitle;
        const rewardsEl = this.elements.rewards;

        if (victory) {
            title.textContent = 'VITÓRIA!';
            title.classList.add('victory');
            title.classList.remove('defeat');
        } else {
            title.textContent = 'DERROTA';
            title.classList.add('defeat');
            title.classList.remove('victory');
        }

        // Renderizar recompensas
        if (rewards.xp || rewards.gold || rewards.cards) {
            let rewardsHtml = '';
            if (rewards.xp) rewardsHtml += `<p>+${rewards.xp} XP</p>`;
            if (rewards.gold) rewardsHtml += `<p>+${rewards.gold} Ouro</p>`;
            if (rewards.cards?.length) {
                rewardsHtml += '<p>Novas cartas:</p>';
                rewards.cards.forEach(card => {
                    rewardsHtml += `<p class="${card.rarity}">${card.name}</p>`;
                });
            }
            rewardsEl.innerHTML = rewardsHtml;
        } else {
            rewardsEl.innerHTML = '';
        }

        overlay.classList.add('active');
    }

    /**
     * Esconde overlay de resultado
     */
    hideResultOverlay() {
        this.elements.resultOverlay.classList.remove('active');
    }

    /**
     * Processa teclas
     */
    handleKeyPress(e) {
        // ESC - Voltar/Pausar
        if (e.key === 'Escape') {
            if (this.currentState === GameState.COLLECTION) {
                this.changeState(GameState.MENU);
            }
        }
    }

    /**
     * Salva o jogo
     */
    saveGame() {
        localStorage.setItem('evaaria_save', JSON.stringify(this.player));
        console.log('💾 Jogo salvo!');
    }

    /**
     * Gera ID único
     */
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Adiciona XP ao jogador
     */
    addXP(amount) {
        this.player.xp += amount;
        console.log(`✨ +${amount} XP (${this.player.xp}/${this.player.xpToNext})`);

        // Verificar level up
        while (this.player.xp >= this.player.xpToNext) {
            this.levelUp();
        }
    }

    /**
     * Sobe de nível
     */
    levelUp() {
        this.player.xp -= this.player.xpToNext;
        this.player.level++;
        this.player.xpToNext = Math.floor(this.player.xpToNext * 1.5);
        this.player.maxHp += 10;
        this.player.hp = this.player.maxHp;

        console.log(`⬆️ LEVEL UP! Nível ${this.player.level}`);
    }
}

// Exportar para uso global
window.Game = Game;
window.GameState = GameState;
