/**
 * EVAARIA SECUNDA - Sistema de Batalha
 */

class BattleSystem {
    constructor() {
        // Referências
        this.game = null;
        this.playerDeck = null;
        this.enemyDeck = null;

        // Estado da batalha
        this.currentEnemy = null;
        this.turn = 0;
        this.phase = 'idle'; // idle, playerTurn, enemyTurn, victory, defeat

        // DOM
        this.elements = {};

        // Carta selecionada
        this.selectedCard = null;
    }

    /**
     * Inicializa o sistema de batalha
     */
    init(game) {
        this.game = game;
        this.cacheDOM();
        this.setupEventListeners();
        console.log('⚔️ Sistema de batalha inicializado');
    }

    /**
     * Cacheia elementos DOM
     */
    cacheDOM() {
        this.elements = {
            // Jogador
            playerHand: document.getElementById('player-hand'),
            playerHealth: document.getElementById('player-health'),
            playerHealthText: document.getElementById('player-health-text'),
            playerMana: document.getElementById('player-mana'),
            playerManaText: document.getElementById('player-mana-text'),
            playerEffects: document.getElementById('player-effects'),
            playerName: document.getElementById('player-name'),

            // Inimigo
            enemyCards: document.getElementById('enemy-cards'),
            enemyHealth: document.getElementById('enemy-health'),
            enemyHealthText: document.getElementById('enemy-health-text'),
            enemyEffects: document.getElementById('enemy-effects'),
            enemyName: document.getElementById('enemy-name'),
            enemyPortrait: document.getElementById('enemy-portrait'),
            enemyIntent: document.getElementById('enemy-intent'),

            // Deck/Descarte
            drawPile: document.getElementById('draw-pile'),
            discardPile: document.getElementById('discard-pile'),

            // Campo
            playedCards: document.getElementById('played-cards'),
            battleLog: document.getElementById('battle-log'),

            // Controles
            btnEndTurn: document.getElementById('btn-end-turn')
        };
    }

    /**
     * Configura event listeners
     */
    setupEventListeners() {
        this.elements.btnEndTurn?.addEventListener('click', () => {
            if (this.phase === 'playerTurn') {
                this.endPlayerTurn();
            }
        });
    }

    /**
     * Inicia uma nova batalha
     */
    startBattle(enemyData = null) {
        console.log('🎮 Iniciando batalha...');

        // Escolher inimigo
        if (!enemyData) {
            enemyData = window.getRandomEnemy(window.EnemyType.NORMAL);
        }
        this.currentEnemy = window.createEnemyInstance(enemyData);

        // Criar deck do jogador
        const playerCards = this.game.player.deck.map(c => ({ ...c }));
        this.playerDeck = new Deck(playerCards);

        // Criar deck do inimigo
        const enemyCards = this.currentEnemy.deck.map(cardId =>
            window.CARDS_DATABASE[cardId] ? { ...window.CARDS_DATABASE[cardId] } : null
        ).filter(Boolean);
        this.enemyDeck = new Deck(enemyCards);

        // Resetar estado
        this.turn = 0;
        this.phase = 'idle';
        this.game.player.hp = this.game.player.maxHp;
        this.game.player.mana = 3;
        this.game.player.effects = [];

        // Atualizar UI
        this.updateEnemyUI();
        this.updatePlayerUI();

        // Iniciar primeiro turno
        this.startPlayerTurn();
    }

    /**
     * Inicia turno do jogador
     */
    startPlayerTurn() {
        this.turn++;
        this.phase = 'playerTurn';

        console.log(`\n===== TURNO ${this.turn} =====`);
        this.showTurnIndicator('SEU TURNO');

        // Processar efeitos do início do turno
        const effectResult = window.effectsManager.processStartOfTurn(this.game.player);

        if (effectResult.damage > 0) {
            this.showDamageNumber(effectResult.damage, 'player');
        }
        if (effectResult.healing > 0) {
            this.showDamageNumber(effectResult.healing, 'player', 'heal');
        }

        // Verificar morte
        if (this.game.player.hp <= 0) {
            this.endBattle(false);
            return;
        }

        // Regenerar mana
        this.game.player.mana = Math.min(
            this.game.player.maxMana,
            this.game.player.mana + this.game.player.manaPerTurn
        );

        // Se congelado/atordoado, pular turno
        if (!effectResult.canAct) {
            console.log('❌ Jogador não pode agir!');
            setTimeout(() => this.endPlayerTurn(), 1500);
            return;
        }

        // Comprar carta
        if (this.turn === 1) {
            this.playerDeck.drawStartingHand();
        } else {
            this.playerDeck.draw();
        }

        // Atualizar UI
        this.updatePlayerUI();
        this.renderPlayerHand();
        this.updateDeckCounts();
        this.updateEnemyIntent();

        console.log(`Mana: ${this.game.player.mana}/${this.game.player.maxMana}`);
    }

    /**
     * Jogador joga uma carta
     */
    playCard(card) {
        if (this.phase !== 'playerTurn') return false;
        if (!card.canPlay(this.game.player.mana)) {
            console.log('❌ Mana insuficiente!');
            return false;
        }

        console.log(`🎴 Jogando: ${card.name}`);

        // Gastar mana
        this.game.player.mana -= card.manaCost;

        // Remover da mão
        this.playerDeck.play(card);

        // Calcular e aplicar dano
        if (card.damage > 0) {
            const damageModifier = window.effectsManager.getDamageModifier(this.game.player);
            const baseDamage = card.calculateDamage(this.currentEnemy.element, damageModifier);

            // Verificar escudo do inimigo
            const { remaining } = window.effectsManager.consumeShield(this.currentEnemy, baseDamage);

            if (remaining > 0) {
                this.currentEnemy.hp = Math.max(0, this.currentEnemy.hp - remaining);
                this.showDamageNumber(remaining, 'enemy');
            }

            console.log(`⚔️ Causou ${baseDamage} de dano ao ${this.currentEnemy.name}`);
        }

        // Aplicar defesa
        if (card.defense > 0) {
            window.effectsManager.applyEffect(this.game.player, {
                type: 'shield',
                value: card.defense,
                duration: 1
            });
        }

        // Aplicar efeitos da carta
        card.effects.forEach(effect => {
            if (effect.type === 'regeneration' && effect.instant) {
                // Cura no jogador
                window.effectsManager.applyEffect(this.game.player, effect);
                const healAmount = Math.min(effect.value, this.game.player.maxHp - this.game.player.hp);
                if (healAmount > 0) {
                    this.showDamageNumber(healAmount, 'player', 'heal');
                }
            } else if (['burn', 'poison', 'frozen', 'stunned', 'weakened'].includes(effect.type)) {
                // Debuffs no inimigo
                window.effectsManager.applyEffect(this.currentEnemy, effect);
            } else if (['strengthened', 'regeneration'].includes(effect.type) && !effect.instant) {
                // Buffs no jogador
                window.effectsManager.applyEffect(this.game.player, effect);
            } else if (effect.type === 'draw') {
                this.playerDeck.drawMultiple(effect.value);
            }
        });

        // Atualizar UI
        this.updatePlayerUI();
        this.updateEnemyUI();
        this.renderPlayerHand();
        this.updateDeckCounts();

        // Verificar vitória
        if (this.currentEnemy.hp <= 0) {
            this.endBattle(true);
            return true;
        }

        return true;
    }

    /**
     * Finaliza turno do jogador
     */
    endPlayerTurn() {
        console.log('⏩ Finalizando turno do jogador');

        // Descartar mão restante (opcional - depende das regras)
        // this.playerDeck.discardHand();

        // Iniciar turno do inimigo
        this.startEnemyTurn();
    }

    /**
     * Inicia turno do inimigo
     */
    startEnemyTurn() {
        this.phase = 'enemyTurn';
        this.showTurnIndicator('TURNO INIMIGO');

        console.log(`\n----- Turno do ${this.currentEnemy.name} -----`);

        // Processar efeitos
        const effectResult = window.effectsManager.processStartOfTurn(this.currentEnemy);

        if (effectResult.damage > 0) {
            this.showDamageNumber(effectResult.damage, 'enemy');
        }

        // Verificar morte por efeitos
        if (this.currentEnemy.hp <= 0) {
            this.endBattle(true);
            return;
        }

        // Atualizar UI
        this.updateEnemyUI();

        // Se congelado/atordoado, pular turno
        if (!effectResult.canAct) {
            console.log(`❄️ ${this.currentEnemy.name} não pode agir!`);
            setTimeout(() => this.startPlayerTurn(), 1500);
            return;
        }

        // IA executa ações
        setTimeout(() => {
            this.executeEnemyAI();
        }, 1000);
    }

    /**
     * Executa IA do inimigo
     */
    executeEnemyAI() {
        // Comprar carta
        this.enemyDeck.draw();

        // Escolher carta para jogar
        const hand = this.enemyDeck.hand;
        if (hand.length === 0) {
            console.log(`${this.currentEnemy.name} não tem cartas!`);
            this.startPlayerTurn();
            return;
        }

        // IA simples: jogar primeira carta disponível
        const card = hand[0];

        console.log(`🎴 ${this.currentEnemy.name} joga: ${card.name}`);

        // Remover da mão
        this.enemyDeck.play(card);

        // Calcular e aplicar dano ao jogador
        if (card.damage > 0) {
            const damageModifier = window.effectsManager.getDamageModifier(this.currentEnemy);
            const baseDamage = card.calculateDamage(this.game.player.element || 'neutral', damageModifier);

            // Verificar escudo do jogador
            const { remaining } = window.effectsManager.consumeShield(this.game.player, baseDamage);

            if (remaining > 0) {
                this.game.player.hp = Math.max(0, this.game.player.hp - remaining);
                this.showDamageNumber(remaining, 'player');
                this.shakeScreen();
            }

            console.log(`⚔️ ${this.currentEnemy.name} causou ${baseDamage} de dano!`);
        }

        // Aplicar efeitos da carta ao jogador
        card.effects.forEach(effect => {
            if (['burn', 'poison', 'frozen', 'stunned', 'weakened'].includes(effect.type)) {
                window.effectsManager.applyEffect(this.game.player, effect);
            } else if (['shield', 'strengthened', 'regeneration'].includes(effect.type)) {
                window.effectsManager.applyEffect(this.currentEnemy, effect);
            }
        });

        // Atualizar UI
        this.updatePlayerUI();
        this.updateEnemyUI();

        // Verificar derrota
        if (this.game.player.hp <= 0) {
            setTimeout(() => this.endBattle(false), 500);
            return;
        }

        // Próximo turno do jogador
        setTimeout(() => this.startPlayerTurn(), 1500);
    }

    /**
     * Finaliza a batalha
     */
    endBattle(victory) {
        this.phase = victory ? 'victory' : 'defeat';

        console.log(victory ? '🏆 VITÓRIA!' : '💀 DERROTA...');

        let rewards = {};

        if (victory) {
            // Calcular recompensas
            const xp = this.currentEnemy.xpReward;
            const gold = Math.floor(
                Math.random() * (this.currentEnemy.goldReward[1] - this.currentEnemy.goldReward[0]) +
                this.currentEnemy.goldReward[0]
            );

            // Chance de drop de carta
            let droppedCard = null;
            if (Math.random() < 0.3) { // 30% chance
                droppedCard = window.getRandomCardByDropRate();
            }

            rewards = {
                xp,
                gold,
                cards: droppedCard ? [droppedCard] : []
            };

            // Aplicar recompensas
            this.game.addXP(xp);
            this.game.player.gold += gold;

            if (droppedCard) {
                this.game.player.collection.push({ ...droppedCard });
            }
        }

        // Mostrar resultado
        setTimeout(() => {
            this.game.showResult(victory, rewards);
        }, 1000);
    }

    // ==========================================
    // Métodos de UI
    // ==========================================

    /**
     * Atualiza UI do jogador
     */
    updatePlayerUI() {
        const player = this.game.player;

        // Vida
        const healthPercent = (player.hp / player.maxHp) * 100;
        if (this.elements.playerHealth) {
            this.elements.playerHealth.style.width = `${healthPercent}%`;
        }
        if (this.elements.playerHealthText) {
            this.elements.playerHealthText.textContent = `${player.hp}/${player.maxHp}`;
        }

        // Mana
        const manaPercent = (player.mana / player.maxMana) * 100;
        if (this.elements.playerMana) {
            this.elements.playerMana.style.width = `${manaPercent}%`;
        }
        if (this.elements.playerManaText) {
            this.elements.playerManaText.textContent = `${player.mana}/${player.maxMana}`;
        }

        // Efeitos
        window.effectsManager.renderEffects(player, this.elements.playerEffects);
    }

    /**
     * Atualiza UI do inimigo
     */
    updateEnemyUI() {
        const enemy = this.currentEnemy;
        if (!enemy) return;

        // Nome
        if (this.elements.enemyName) {
            this.elements.enemyName.textContent = enemy.name;
        }

        // Portrait
        if (this.elements.enemyPortrait) {
            this.elements.enemyPortrait.innerHTML = `<span class="portrait-placeholder">${enemy.portrait}</span>`;
        }

        // Vida
        const healthPercent = (enemy.hp / enemy.maxHp) * 100;
        if (this.elements.enemyHealth) {
            this.elements.enemyHealth.style.width = `${healthPercent}%`;
        }
        if (this.elements.enemyHealthText) {
            this.elements.enemyHealthText.textContent = `${enemy.hp}/${enemy.maxHp}`;
        }

        // Efeitos
        window.effectsManager.renderEffects(enemy, this.elements.enemyEffects);
    }

    /**
     * Atualiza intenção do inimigo
     */
    updateEnemyIntent() {
        if (!this.elements.enemyIntent) return;

        const hand = this.enemyDeck?.hand || [];
        if (hand.length === 0) {
            this.elements.enemyIntent.innerHTML = '<span class="intent-icon">❓</span>';
            return;
        }

        // Mostrar próxima ação
        const nextCard = hand[0];
        if (nextCard.damage > 0) {
            this.elements.enemyIntent.innerHTML = `
                <span class="intent-icon">⚔️</span>
                <span class="intent-value">${nextCard.damage}</span>
            `;
        } else if (nextCard.defense > 0) {
            this.elements.enemyIntent.innerHTML = `
                <span class="intent-icon">🛡️</span>
                <span class="intent-value">${nextCard.defense}</span>
            `;
        } else {
            this.elements.enemyIntent.innerHTML = `
                <span class="intent-icon">✨</span>
            `;
        }
    }

    /**
     * Renderiza mão do jogador
     */
    renderPlayerHand() {
        if (!this.elements.playerHand) return;

        this.elements.playerHand.innerHTML = '';

        this.playerDeck.updatePlayableState(this.game.player.mana);

        this.playerDeck.hand.forEach(card => {
            const cardEl = window.CardRenderer.createCardElement(card, {
                onClick: (c, el) => this.onCardClick(c, el)
            });
            this.elements.playerHand.appendChild(cardEl);
        });
    }

    /**
     * Handler de clique em carta
     */
    onCardClick(card, element) {
        if (this.phase !== 'playerTurn') return;

        if (card.canPlay(this.game.player.mana)) {
            this.playCard(card);
        } else {
            console.log('❌ Não pode jogar esta carta!');
            element.classList.add('shake');
            setTimeout(() => element.classList.remove('shake'), 200);
        }
    }

    /**
     * Atualiza contadores de deck/descarte
     */
    updateDeckCounts() {
        const counts = this.playerDeck.getCounts();

        if (this.elements.drawPile) {
            this.elements.drawPile.querySelector('.pile-count').textContent = counts.draw;
        }
        if (this.elements.discardPile) {
            this.elements.discardPile.querySelector('.pile-count').textContent = counts.discard;
        }
    }

    /**
     * Mostra indicador de turno
     */
    showTurnIndicator(text) {
        const indicator = document.createElement('div');
        indicator.className = 'turn-indicator';
        indicator.textContent = text;
        document.getElementById('battle-screen')?.appendChild(indicator);

        setTimeout(() => indicator.remove(), 1500);
    }

    /**
     * Mostra número de dano flutuante
     */
    showDamageNumber(value, target, type = 'damage') {
        const isPlayer = target === 'player';
        const container = isPlayer ? this.elements.playerHealth : this.elements.enemyHealth;
        if (!container) return;

        const rect = container.getBoundingClientRect();

        const el = document.createElement('div');
        el.className = `damage-number ${type}`;
        el.textContent = type === 'heal' ? `+${value}` : `-${value}`;
        el.style.left = `${rect.left + rect.width / 2}px`;
        el.style.top = `${rect.top}px`;

        document.body.appendChild(el);

        setTimeout(() => el.remove(), 1000);
    }

    /**
     * Efeito de shake na tela
     */
    shakeScreen() {
        const battleScreen = document.getElementById('battle-screen');
        battleScreen?.classList.add('shake');
        setTimeout(() => battleScreen?.classList.remove('shake'), 400);
    }
}

// Singleton global
window.battleSystem = new BattleSystem();
window.BattleSystem = BattleSystem;
