// ============================================
// 4. ГЛАВНЫЙ ФАЙЛ - запуск
// ============================================

console.log('🚀 ЗАПУСК ПРИЛОЖЕНИЯ');

// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM загружен');
    
    try {
        // Проверяем классы
        console.log('📋 Проверка:');
        console.log('  GameModel:', typeof GameModel);
        console.log('  GameView:', typeof GameView);
        console.log('  GameController:', typeof GameController);
        
        // Создаем компоненты
        const model = new GameModel();
        const view = new GameView();
        const controller = new GameController(model, view);
        
        // Сохраняем для отладки
        window.game = { model, view, controller };
        
        console.log('🎉 ИГРА ГОТОВА!');
        console.log('👤 Игрок:', model.player);
        console.log('📊 Платформ:', model.platforms.length);
        console.log('🎮 Нажмите "Начать игру"');
        
    } catch (error) {
        console.error('❌ Ошибка:', error);
    }
});