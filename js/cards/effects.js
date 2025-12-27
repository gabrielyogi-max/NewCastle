/**
 * EVAARIA SECUNDA - Sistema de Efeitos
 * Processamento de efeitos de status
 */

class EffectsManager {
    constructor() {
        // Mapeamento de ícones
        this.icons = {
            burn: '🔥',
            poison: '☠️',
            frozen: '❄️',
            stunned: '💫',
            strengthened: '💪',
            weakened: '📉',
            regeneration: '💚',
            shield: '🛡️'
        };

        // Cores de efeito
        this.colors = {
            burn: '#f97316',
            poison: '#22c55e',
            frozen: '#06b6d4',
            stunned: '#fbbf24',
            strengthened: '#f97316',
            weakened: '#9ca3af',
            regeneration: '#22c55e',
            shield: '#3b82f6'
        };
    }

    /**
     * Aplica um efeito a um alvo
     */
    applyEffect(target, effect) {
        if (!target.effects) {
            target.effects = [];
        }

        // Efeitos instantâneos
        if (effect.instant) {
            return this.processInstantEffect(target, effect);
        }

        // Verificar se efeito já existe (stackar ou substituir)
        const existingIndex = target.effects.findIndex(e => e.type === effect.type);

        if (existingIndex !== -1) {
            // Atualizar duração se maior
            const existing = target.effects[existingIndex];
            if (effect.duration > existing.duration) {
                existing.duration = effect.duration;
            }
            // Stack de valor para alguns efeitos
            if (['poison', 'burn'].includes(effect.type)) {
                existing.value += effect.value;
            }
        } else {
            // Adicionar novo efeito
            target.effects.push({
                type: effect.type,
                value: effect.value,
                duration: effect.duration,
                onHit: effect.onHit || false
            });
        }

        console.log(`✨ ${target.name || 'Alvo'} recebeu ${this.icons[effect.type] || ''} ${effect.type}`);

        return { type: effect.type, applied: true };
    }

    /**
     * Processa efeito instantâneo
     */
    processInstantEffect(target, effect) {
        switch (effect.type) {
            case 'regeneration':
                const healAmount = effect.value;
                const oldHp = target.hp;
                target.hp = Math.min(target.hp + healAmount, target.maxHp);
                const healed = target.hp - oldHp;
                console.log(`💚 ${target.name || 'Alvo'} curou ${healed} HP`);
                return { type: 'heal', value: healed };

            case 'draw':
                // Será tratado no sistema de batalha
                return { type: 'draw', value: effect.value };

            case 'mana':
                return { type: 'mana', value: effect.value };

            default:
                return { type: effect.type, value: effect.value };
        }
    }

    /**
     * Processa todos os efeitos no início do turno
     */
    processStartOfTurn(target) {
        if (!target.effects || target.effects.length === 0) {
            return { canAct: true, damage: 0, healing: 0 };
        }

        let canAct = true;
        let damage = 0;
        let healing = 0;

        // Processar cada efeito
        target.effects.forEach(effect => {
            switch (effect.type) {
                case 'burn':
                    damage += effect.value;
                    console.log(`🔥 ${target.name} sofre ${effect.value} de queimadura`);
                    break;

                case 'poison':
                    damage += effect.value;
                    // Veneno aumenta a cada turno
                    effect.value = Math.ceil(effect.value * 1.2);
                    console.log(`☠️ ${target.name} sofre ${effect.value} de veneno`);
                    break;

                case 'frozen':
                    canAct = false;
                    console.log(`❄️ ${target.name} está congelado!`);
                    break;

                case 'stunned':
                    canAct = false;
                    console.log(`💫 ${target.name} está atordoado!`);
                    break;

                case 'regeneration':
                    healing += effect.value;
                    console.log(`💚 ${target.name} regenera ${effect.value} HP`);
                    break;
            }
        });

        // Aplicar dano/cura
        if (damage > 0) {
            target.hp = Math.max(0, target.hp - damage);
        }
        if (healing > 0) {
            target.hp = Math.min(target.maxHp, target.hp + healing);
        }

        // Decrementar durações
        this.decrementDurations(target);

        return { canAct, damage, healing };
    }

    /**
     * Decrementa durações e remove efeitos expirados
     */
    decrementDurations(target) {
        if (!target.effects) return;

        target.effects = target.effects.filter(effect => {
            effect.duration--;

            if (effect.duration <= 0) {
                console.log(`⏰ ${this.icons[effect.type] || ''} ${effect.type} expirou em ${target.name}`);
                return false;
            }
            return true;
        });
    }

    /**
     * Calcula modificador de dano baseado em efeitos
     */
    getDamageModifier(attacker) {
        if (!attacker.effects) return 1;

        let modifier = 1;

        attacker.effects.forEach(effect => {
            if (effect.type === 'strengthened') {
                modifier *= effect.value; // ex: 1.5 = +50% dano
            }
            if (effect.type === 'weakened') {
                modifier *= effect.value; // ex: 0.5 = -50% dano
            }
        });

        return modifier;
    }

    /**
     * Retorna escudo atual
     */
    getShield(target) {
        if (!target.effects) return 0;

        const shieldEffect = target.effects.find(e => e.type === 'shield');
        return shieldEffect ? shieldEffect.value : 0;
    }

    /**
     * Consome escudo ao receber dano
     */
    consumeShield(target, damage) {
        const shieldIndex = target.effects?.findIndex(e => e.type === 'shield');
        if (shieldIndex === -1 || shieldIndex === undefined) {
            return { absorbed: 0, remaining: damage };
        }

        const shield = target.effects[shieldIndex];
        const absorbed = Math.min(shield.value, damage);
        shield.value -= absorbed;

        if (shield.value <= 0) {
            target.effects.splice(shieldIndex, 1);
        }

        console.log(`🛡️ Escudo absorveu ${absorbed} de dano`);

        return {
            absorbed,
            remaining: damage - absorbed
        };
    }

    /**
     * Limpa todos os efeitos de um alvo
     */
    clearEffects(target) {
        target.effects = [];
    }

    /**
     * Verifica se alvo tem efeito específico
     */
    hasEffect(target, effectType) {
        return target.effects?.some(e => e.type === effectType) || false;
    }

    /**
     * Renderiza indicadores de efeito no DOM
     */
    renderEffects(target, containerElement) {
        if (!containerElement) return;

        containerElement.innerHTML = '';

        if (!target.effects || target.effects.length === 0) return;

        target.effects.forEach(effect => {
            const el = document.createElement('div');
            el.className = `status-effect ${effect.type}`;
            el.style.setProperty('--status-color', this.colors[effect.type] || '#9ca3af');
            el.innerHTML = `
                <span class="effect-icon">${this.icons[effect.type] || '?'}</span>
                <span class="duration">${effect.duration}</span>
            `;
            el.title = `${effect.type}: ${effect.value || ''} (${effect.duration} turnos)`;
            containerElement.appendChild(el);
        });
    }
}

// Singleton global
window.effectsManager = new EffectsManager();
window.EffectsManager = EffectsManager;
