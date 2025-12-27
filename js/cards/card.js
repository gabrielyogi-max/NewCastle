/**
 * EVAARIA SECUNDA - Sistema de Cartas
 * Classe Card e renderização visual
 */

class Card {
    constructor(data) {
        // Copiar dados base
        this.id = data.id;
        this.name = data.name;
        this.type = data.type;
        this.element = data.element;
        this.rarity = data.rarity;
        this.manaCost = data.manaCost;
        this.damage = data.damage || 0;
        this.defense = data.defense || 0;
        this.effects = data.effects || [];
        this.description = data.description;
        this.art = data.art;
        this.artEmoji = data.artEmoji || '❓';

        // ID de instância único
        this.instanceId = data.instanceId || `${this.id}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

        // Estado da carta
        this.isPlayable = true;
        this.isSelected = false;
    }

    /**
     * Verifica se a carta pode ser jogada
     */
    canPlay(currentMana) {
        return this.isPlayable && currentMana >= this.manaCost;
    }

    /**
     * Calcula dano considerando elemento
     */
    calculateDamage(targetElement, strengthModifier = 1) {
        let baseDamage = this.damage;

        // Modificador elemental
        const elementMod = window.getElementalModifier?.(this.element, targetElement) || 1;

        return Math.floor(baseDamage * elementMod * strengthModifier);
    }

    /**
     * Retorna cor da borda baseada na raridade
     */
    getRarityColor() {
        const colors = {
            common: '#9ca3af',
            uncommon: '#22c55e',
            rare: '#3b82f6',
            epic: '#a855f7',
            legendary: '#fbbf24'
        };
        return colors[this.rarity] || colors.common;
    }

    /**
     * Clona a carta
     */
    clone() {
        return new Card({
            ...this,
            instanceId: undefined // Gera novo ID
        });
    }
}

/**
 * Renderizador de cartas - cria elementos DOM
 */
const CardRenderer = {
    /**
     * Cria elemento DOM de uma carta
     */
    createCardElement(cardData, options = {}) {
        const card = cardData instanceof Card ? cardData : new Card(cardData);

        const el = document.createElement('div');
        el.className = `card ${card.rarity}`;
        el.dataset.cardId = card.instanceId;
        el.dataset.element = card.element;

        // Custo de mana
        const cost = document.createElement('div');
        cost.className = 'card-cost';
        cost.textContent = card.manaCost;
        el.appendChild(cost);

        // Arte da carta
        const art = document.createElement('div');
        art.className = 'card-art';

        if (card.art) {
            const img = document.createElement('img');
            img.src = card.art;
            img.alt = card.name;
            art.appendChild(img);
        } else {
            const placeholder = document.createElement('span');
            placeholder.className = 'card-art-placeholder';
            placeholder.textContent = card.artEmoji;
            art.appendChild(placeholder);
        }
        el.appendChild(art);

        // Nome da carta
        const name = document.createElement('div');
        name.className = 'card-name';
        name.textContent = card.name;
        el.appendChild(name);

        // Tipo e elemento
        const typeElement = document.createElement('div');
        typeElement.className = 'card-type-element';

        const typeSpan = document.createElement('span');
        typeSpan.className = 'card-type';
        typeSpan.textContent = window.TYPE_ICONS?.[card.type] || '';
        typeElement.appendChild(typeSpan);

        const elementSpan = document.createElement('span');
        elementSpan.className = 'card-element';
        elementSpan.textContent = window.ELEMENT_ICONS?.[card.element] || '';
        typeElement.appendChild(elementSpan);

        el.appendChild(typeElement);

        // Descrição
        const desc = document.createElement('div');
        desc.className = 'card-description';
        desc.textContent = card.description;
        el.appendChild(desc);

        // Stats (ataque/defesa)
        if (card.damage > 0 || card.defense > 0) {
            const stats = document.createElement('div');
            stats.className = 'card-stats';

            if (card.damage > 0) {
                const atk = document.createElement('span');
                atk.className = 'card-stat attack';
                atk.innerHTML = `⚔️ ${card.damage}`;
                stats.appendChild(atk);
            }

            if (card.defense > 0) {
                const def = document.createElement('span');
                def.className = 'card-stat defense';
                def.innerHTML = `🛡️ ${card.defense}`;
                stats.appendChild(def);
            }

            el.appendChild(stats);
        }

        // Event listeners
        if (!options.static) {
            el.addEventListener('click', () => {
                if (options.onClick) {
                    options.onClick(card, el);
                }
            });

            el.addEventListener('mouseenter', () => {
                if (options.onHover) {
                    options.onHover(card, el);
                }
            });
        }

        // Aplicar estado
        if (!card.isPlayable) {
            el.classList.add('disabled');
        }

        if (card.isSelected) {
            el.classList.add('selected');
        }

        return el;
    },

    /**
     * Atualiza estado visual de uma carta
     */
    updateCardState(cardElement, card, currentMana) {
        if (!cardElement || !card) return;

        const canPlay = card.canPlay(currentMana);

        if (canPlay) {
            cardElement.classList.remove('disabled');
        } else {
            cardElement.classList.add('disabled');
        }

        if (card.isSelected) {
            cardElement.classList.add('selected');
        } else {
            cardElement.classList.remove('selected');
        }
    },

    /**
     * Cria verso de carta (para deck do inimigo)
     */
    createCardBack() {
        const el = document.createElement('div');
        el.className = 'enemy-card-back';
        return el;
    },

    /**
     * Anima carta sendo jogada
     */
    animateCardPlay(cardElement, targetArea) {
        if (!cardElement || !targetArea) return;

        const rect = cardElement.getBoundingClientRect();
        const targetRect = targetArea.getBoundingClientRect();

        // Clonar carta para animação
        const clone = cardElement.cloneNode(true);
        clone.style.position = 'fixed';
        clone.style.left = `${rect.left}px`;
        clone.style.top = `${rect.top}px`;
        clone.style.zIndex = '1000';
        clone.style.transition = 'all 0.3s ease-out';

        document.body.appendChild(clone);

        // Animar para o centro
        requestAnimationFrame(() => {
            clone.style.left = `${targetRect.left + targetRect.width / 2 - rect.width / 2}px`;
            clone.style.top = `${targetRect.top + targetRect.height / 2 - rect.height / 2}px`;
            clone.style.transform = 'scale(0.8)';
            clone.style.opacity = '0.5';
        });

        // Remover após animação
        setTimeout(() => {
            clone.remove();
        }, 300);
    }
};

// Exportar para uso global
window.Card = Card;
window.CardRenderer = CardRenderer;
