/**
 * EVAARIA SECUNDA - Main Entry Point
 */

// Inicialização quando DOM carrega
document.addEventListener('DOMContentLoaded', () => {
    console.log('╔════════════════════════════════════════╗');
    console.log('║     EVAARIA SECUNDA - RPG Card Battle  ║');
    console.log('╚════════════════════════════════════════╝');

    // Criar instância do jogo
    const game = new Game();

    // Inicializar sistema de batalha
    window.battleSystem.init(game);

    // Inicializar sistema de mapa
    window.mapSystem.init(game);

    // Iniciar jogo
    game.init();

    // Expor globalmente para debug
    window.game = game;

    console.log('🎮 Jogo iniciado! Use window.game para debug.');
});

// Prevenir scroll com setas
window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }
});
