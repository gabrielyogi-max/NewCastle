/**
 * EVAARIA SECUNDA - Sistema de Deck
 * Gerenciamento de deck, mão e descarte
 */

class Deck {
    constructor(cards = []) {
        // Pilha de compra (deck principal)
        this.drawPile = [];

        // Mão atual
        this.hand = [];

        // Pilha de descarte
        this.discardPile = [];

        // Configurações
        this.maxHandSize = 7;
        this.startingHandSize = 5;

        // Inicializar com cartas
        if (cards.length > 0) {
            this.initializeDeck(cards);
        }
    }

    /**
     * Inicializa o deck com uma lista de cartas
     */
    initializeDeck(cards) {
        this.drawPile = cards.map(cardData => {
            if (cardData instanceof Card) {
                return cardData.clone();
            }
            return new Card(cardData);
        });

        this.hand = [];
        this.discardPile = [];

        // Embaralhar
        this.shuffle();

        console.log(`📦 Deck inicializado com ${this.drawPile.length} cartas`);
    }

    /**
     * Embaralha a pilha de compra
     */
    shuffle() {
        for (let i = this.drawPile.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.drawPile[i], this.drawPile[j]] = [this.drawPile[j], this.drawPile[i]];
        }
        console.log('🔀 Deck embaralhado');
    }

    /**
     * Compra uma carta
     */
    draw() {
        // Se não tem cartas no deck, embaralhar descarte
        if (this.drawPile.length === 0) {
            if (this.discardPile.length === 0) {
                console.log('⚠️ Sem cartas para comprar!');
                return null;
            }
            this.reshuffleDiscardIntoDraw();
        }

        // Verificar limite de mão
        if (this.hand.length >= this.maxHandSize) {
            console.log('✋ Mão cheia!');
            return null;
        }

        // Comprar carta do topo
        const card = this.drawPile.pop();
        this.hand.push(card);

        console.log(`📤 Comprou: ${card.name}`);
        return card;
    }

    /**
     * Compra múltiplas cartas
     */
    drawMultiple(count) {
        const drawn = [];
        for (let i = 0; i < count; i++) {
            const card = this.draw();
            if (card) {
                drawn.push(card);
            }
        }
        return drawn;
    }

    /**
     * Compra mão inicial
     */
    drawStartingHand() {
        return this.drawMultiple(this.startingHandSize);
    }

    /**
     * Descarta uma carta da mão
     */
    discard(card) {
        const index = this.hand.findIndex(c => c.instanceId === card.instanceId);
        if (index !== -1) {
            const discarded = this.hand.splice(index, 1)[0];
            this.discardPile.push(discarded);
            console.log(`📥 Descartou: ${discarded.name}`);
            return discarded;
        }
        return null;
    }

    /**
     * Descarta toda a mão
     */
    discardHand() {
        while (this.hand.length > 0) {
            const card = this.hand.pop();
            this.discardPile.push(card);
        }
        console.log('📥 Mão descartada');
    }

    /**
     * Joga uma carta (remove da mão para área de jogo)
     */
    play(card) {
        const index = this.hand.findIndex(c => c.instanceId === card.instanceId);
        if (index !== -1) {
            const played = this.hand.splice(index, 1)[0];
            // Carta jogada vai pro descarte após resolver
            this.discardPile.push(played);
            console.log(`🎴 Jogou: ${played.name}`);
            return played;
        }
        return null;
    }

    /**
     * Embaralha descarte de volta no deck
     */
    reshuffleDiscardIntoDraw() {
        console.log('🔄 Embaralhando descarte no deck...');
        this.drawPile = [...this.discardPile];
        this.discardPile = [];
        this.shuffle();
    }

    /**
     * Retorna carta para o deck
     */
    returnToDeck(card, toTop = false) {
        if (toTop) {
            this.drawPile.push(card);
        } else {
            this.drawPile.unshift(card);
            this.shuffle();
        }
    }

    /**
     * Obtém uma carta específica da mão pelo instanceId
     */
    getCardFromHand(instanceId) {
        return this.hand.find(c => c.instanceId === instanceId);
    }

    /**
     * Verifica se tem cartas jogáveis na mão
     */
    hasPlayableCards(currentMana) {
        return this.hand.some(card => card.canPlay(currentMana));
    }

    /**
     * Retorna contagens atuais
     */
    getCounts() {
        return {
            draw: this.drawPile.length,
            hand: this.hand.length,
            discard: this.discardPile.length,
            total: this.drawPile.length + this.hand.length + this.discardPile.length
        };
    }

    /**
     * Atualiza estado das cartas baseado na mana disponível
     */
    updatePlayableState(currentMana) {
        this.hand.forEach(card => {
            card.isPlayable = card.manaCost <= currentMana;
        });
    }

    /**
     * Adiciona uma carta ao deck permanentemente
     */
    addCard(cardData) {
        const card = cardData instanceof Card ? cardData : new Card(cardData);
        this.drawPile.push(card);
        console.log(`➕ Carta adicionada ao deck: ${card.name}`);
    }

    /**
     * Remove uma carta do deck permanentemente
     */
    removeCard(instanceId) {
        // Procurar em todas as pilhas
        let index = this.drawPile.findIndex(c => c.instanceId === instanceId);
        if (index !== -1) {
            return this.drawPile.splice(index, 1)[0];
        }

        index = this.hand.findIndex(c => c.instanceId === instanceId);
        if (index !== -1) {
            return this.hand.splice(index, 1)[0];
        }

        index = this.discardPile.findIndex(c => c.instanceId === instanceId);
        if (index !== -1) {
            return this.discardPile.splice(index, 1)[0];
        }

        return null;
    }
}

// Exportar para uso global
window.Deck = Deck;
