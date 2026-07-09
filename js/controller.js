// ============================================
// 3. КОНТРОЛЛЕР (Controller) - управление
// ============================================

console.log('🎮 Загрузка контроллера...');

class GameController {
    constructor(model, view) {
        console.log('🔄 Создание контроллера...');
        
        this.model = model;
        this.view = view;
        
        // Состояние клавиш
        this.keys = {
            left: false,
            right: false
        };
        
        this.animationId = null;
        
        // Настраиваем обработчики
        this.setupControls();
        
        // Показываем стартовый экран
        this.view.showStartScreen();
        
        console.log('✅ Контроллер создан!');
    }
    
    // ============================================
    // НАСТРОЙКА УПРАВЛЕНИЯ
    // ============================================
    setupControls() {
        console.log('⌨️ Настройка управления...');
        
        // Клавиатура
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                this.keys.left = true;
                e.preventDefault();
            }
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                this.keys.right = true;
                e.preventDefault();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                this.keys.left = false;
                e.preventDefault();
            }
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                this.keys.right = false;
                e.preventDefault();
            }
        });
        
        // Кнопки
        const startBtn = document.getElementById('startBtn');
        const restartBtn = document.getElementById('restartBtn');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                console.log('🖱️ Нажата кнопка "Начать игру"');
                this.startGame();
            });
        }
        
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                console.log('🖱️ Нажата кнопка "Играть снова"');
                this.startGame();
            });
        }
        
        console.log('✅ Управление настроено');
    }
    
    // ============================================
    // ЗАПУСК ИГРЫ
    // ============================================
    startGame() {
        console.log('🎮 ЗАПУСК ИГРЫ!');
        
        // Сбрасываем игру
        this.model.init();
        this.view.hideAllScreens();
        
        // Останавливаем старый цикл
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Запускаем новый цикл
        this.gameLoop();
    }
    
    // ============================================
    // ИГРОВОЙ ЦИКЛ
    // ============================================
    gameLoop() {
        // 1. Обновляем модель
        this.update();
        
        // 2. Отрисовываем
        this.view.render(this.model);
        
        // 3. Проверяем Game Over
        if (this.model.isGameOver) {
            console.log('💀 GAME OVER! Счет:', this.model.score);
            this.view.showGameOverScreen(this.model.score);
            return;
        }
        
        // 4. Продолжаем цикл
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }
    
    // ============================================
    // ОБНОВЛЕНИЕ
    // ============================================
    update() {
        // Если игра не запущена или закончена - не обновляем
        if (!this.model.isRunning || this.model.isGameOver) return;
        
        // Применяем управление
        if (this.keys.left) {
            this.model.player.vx = -this.model.MOVE_SPEED;
        } else if (this.keys.right) {
            this.model.player.vx = this.model.MOVE_SPEED;
        } else {
            this.model.player.vx = 0;
        }
        
        // Обновляем модель
        this.model.update();
    }
}

console.log('✅ Класс GameController создан!');
console.log('🔍 Тип GameController:', typeof GameController);