/**
 * EVAARIA SECUNDA - IA Inimiga
 * Comportamentos de IA para diferentes tipos de inimigos
 */

const EnemyAI = {
    /**
     * Escolhe a melhor carta baseado no comportamento
     */
    chooseCard(enemy, hand, playerState) {
        const behavior = enemy.ai || 'balanced';

        switch (behavior) {
            case 'aggressive':
                return this.aggressiveChoice(hand, playerState);
            case 'defensive':
                return this.defensiveChoice(hand, enemy);
            case 'magical':
                return this.magicalChoice(hand, playerState);
            case 'balanced':
            default:
                return this.balancedChoice(hand, enemy, playerState);
        }
    },

    /**
     * IA agressiva - prioriza dano
     */
    aggressiveChoice(hand, playerState) {
        // Ordenar por dano (maior primeiro)
        const sorted = [...hand].sort((a, b) => (b.damage || 0) - (a.damage || 0));

        // Escolher carta com maior dano
        const attackCards = sorted.filter(c => c.damage > 0);
        if (attackCards.length > 0) {
            return attackCards[0];
        }

        // Se não tem ataque, jogar qualquer coisa
        return hand[0];
    },

    /**
     * IA defensiva - prioriza defesa quando HP baixo
     */
    defensiveChoice(hand, enemy) {
        const hpPercent = enemy.hp / enemy.maxHp;

        // Se HP baixo, priorizar defesa
        if (hpPercent < 0.5) {
            const defenseCards = hand.filter(c => c.defense > 0 || c.type === 'defense');
            if (defenseCards.length > 0) {
                return defenseCards.sort((a, b) => (b.defense || 0) - (a.defense || 0))[0];
            }
        }

        // Se HP ok, atacar
        const attackCards = hand.filter(c => c.damage > 0);
        if (attackCards.length > 0) {
            return attackCards[0];
        }

        return hand[0];
    },

    /**
     * IA mágica - prioriza cartas com efeitos
     */
    magicalChoice(hand, playerState) {
        // Priorizar cartas com efeitos debuff
        const magicCards = hand.filter(c => c.effects && c.effects.length > 0);

        if (magicCards.length > 0) {
            // Priorizar efeitos de controle
            const controlEffects = ['frozen', 'stunned', 'weakened'];
            const controlCards = magicCards.filter(c =>
                c.effects.some(e => controlEffects.includes(e.type))
            );

            if (controlCards.length > 0) {
                return controlCards[0];
            }

            // Senão, efeitos de dano over time
            const dotCards = magicCards.filter(c =>
                c.effects.some(e => ['burn', 'poison'].includes(e.type))
            );

            if (dotCards.length > 0) {
                return dotCards[0];
            }

            return magicCards[0];
        }

        // Fallback para dano
        return hand.sort((a, b) => (b.damage || 0) - (a.damage || 0))[0];
    },

    /**
     * IA balanceada - mistura ataque e defesa
     */
    balancedChoice(hand, enemy, playerState) {
        const hpPercent = enemy.hp / enemy.maxHp;

        // Chance de defender aumenta conforme HP diminui
        const defendChance = (1 - hpPercent) * 0.7;

        if (Math.random() < defendChance) {
            const defenseCards = hand.filter(c => c.defense > 0);
            if (defenseCards.length > 0) {
                return defenseCards[0];
            }
        }

        // Senão, atacar
        const attackCards = hand.filter(c => c.damage > 0);
        if (attackCards.length > 0) {
            return attackCards[Math.floor(Math.random() * attackCards.length)];
        }

        return hand[0];
    },

    /**
     * Determina quantas cartas o inimigo vai jogar
     */
    getActionsCount(enemy) {
        switch (enemy.type) {
            case 'boss':
                return 2; // Bosses jogam 2 cartas
            case 'elite':
                return Math.random() < 0.3 ? 2 : 1; // Elites às vezes jogam 2
            default:
                return 1;
        }
    },

    /**
     * Determina se inimigo vai usar habilidade especial
     */
    shouldUseSpecialAbility(enemy, turn) {
        if (!enemy.specialAbility) return false;

        // Bosses usam habilidade especial a cada 3 turnos
        if (enemy.type === 'boss' && turn % 3 === 0) {
            return true;
        }

        return false;
    }
};

// Exportar para uso global
window.EnemyAI = EnemyAI;
