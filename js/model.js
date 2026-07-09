// ============================================
// 1. МОДЕЛЬ (Model) - данные и логика игры
// ============================================

console.log('📦 Загрузка модели...');

// Создаем класс GameModel
class GameModel {
    // Конструктор - вызывается при создании объекта
    constructor() {
        console.log('🔄 Создание модели...');
        
        // ---------- Размеры игрового поля ----------
        this.width = 480;   // ширина canvas
        this.height = 720;  // высота canvas
        
        // ---------- Константы игры ----------
        this.GRAVITY = 0.35;        // сила гравитации
        this.JUMP_VELOCITY = -13.5; // скорость прыжка
        this.MOVE_SPEED = 4.5;      // скорость движения
        this.PLATFORM_WIDTH = 70;   // ширина платформы
        this.PLATFORM_HEIGHT = 14;  // высота платформы
        this.PLATFORM_GAP_MIN = 70; // минимальное расстояние между платформами
        this.PLATFORM_GAP_MAX = 130; // максимальное расстояние
        
        // ---------- Состояние игры ----------
        this.score = 0;        // текущий счет
        this.isRunning = false; // запущена ли игра
        this.isGameOver = false; // закончена ли игра
        
        // ---------- Объекты игры ----------
        this.player = null;    // игрок
        this.platforms = [];   // массив платформ
        
        // Инициализируем игру
        this.init();
    }
    
    // ============================================
    // ИНИЦИАЛИЗАЦИЯ ИГРЫ
    // ============================================
    init() {
        console.log('🔄 Инициализация игры...');
        
        // 1. Создаем игрока
        this.player = {
            x: this.width / 2 - 18,  // центр по горизонтали
            y: this.height - 120,    // 120px от низа
            width: 36,               // ширина игрока
            height: 36,              // высота игрока
            vx: 0,                  // скорость по X (горизонталь)
            vy: this.JUMP_VELOCITY  // скорость по Y (вертикаль)
        };
        
        // 2. Очищаем платформы
        this.platforms = [];
        this.score = 0;
        this.isRunning = true;
        this.isGameOver = false;
        
        // 3. Создаем стартовую платформу
        const startX = this.width / 2 - this.PLATFORM_WIDTH / 2;
        this.platforms.push({
            x: startX,
            y: this.height - 60,
            width: this.PLATFORM_WIDTH,
            height: this.PLATFORM_HEIGHT
        });
        
        // 4. Создаем остальные платформы
        this.generatePlatforms();
        
        console.log(`✅ Создано ${this.platforms.length} платформ`);
        console.log('👤 Игрок:', this.player);
    }
    
    // ============================================
    // ГЕНЕРАЦИЯ ПЛАТФОРМ
    // ============================================
    generatePlatforms() {
        // Начинаем с первой платформы
        let y = this.height - 60;
        let prevX = this.width / 2 - this.PLATFORM_WIDTH / 2;
        let count = 0;
        
        // Создаем платформы, пока не заполним весь экран
        while (y > -this.height) {
            // Вычисляем расстояние до следующей платформы
            y -= this.getRandomGap();
            
            // Вычисляем положение следующей платформы
            const x = this.getNextX(prevX);
            
            // Добавляем платформу
            this.platforms.push({
                x: x,
                y: y,
                width: this.PLATFORM_WIDTH,
                height: this.PLATFORM_HEIGHT
            });
            
            prevX = x;
            count++;
        }
        
        console.log(`➕ Добавлено ${count} платформ`);
    }
    
    // ============================================
    // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
    // ============================================
    
    // Случайное расстояние между платформами
    getRandomGap() {
        return Math.random() * (this.PLATFORM_GAP_MAX - this.PLATFORM_GAP_MIN) + this.PLATFORM_GAP_MIN;
    }
    
    // Вычисление позиции следующей платформы
    getNextX(prevX) {
        // Максимальное расстояние по горизонтали = 160
        const MAX_STEP = 160;
        
        // Ограничиваем, чтобы платформа не выходила за экран
        const min = Math.max(0, prevX - MAX_STEP);
        const max = Math.min(this.width - this.PLATFORM_WIDTH, prevX + MAX_STEP);
        
        // Случайная позиция в допустимом диапазоне
        return Math.random() * (max - min) + min;
    }
    
    // ============================================
    // ОБНОВЛЕНИЕ ИГРЫ (ГЛАВНАЯ ЛОГИКА)
    // ============================================
    update() {
        // Если игра не запущена или закончена - ничего не делаем
        if (!this.isRunning || this.isGameOver) return;
        
        // 1. Гравитация
        this.player.vy += this.GRAVITY;
        
        // 2. Движение
        this.player.y += this.player.vy;
        this.player.x += this.player.vx;
        
        // 3. Обертка по краям экрана
        if (this.player.x + this.player.width < 0) {
            this.player.x = this.width;
        }
        if (this.player.x > this.width) {
            this.player.x = -this.player.width;
        }
        
        // 4. Проверка столкновений с платформами
        this.checkCollisions();
        
        // 5. Движение камеры
        this.updateCamera();
        
        // 6. Проверка Game Over
        if (this.player.y > this.height) {
            this.isRunning = false;
            this.isGameOver = true;
            console.log('💀 GAME OVER! Счет:', this.score);
        }
    }
    
    // ============================================
    // ПРОВЕРКА СТОЛКНОВЕНИЙ
    // ============================================
    checkCollisions() {
        // Проверяем только когда игрок падает (скорость вниз)
        if (this.player.vy > 0) {
            for (let platform of this.platforms) {
                // Проверяем по горизонтали
                const withinX = this.player.x + this.player.width > platform.x && 
                               this.player.x < platform.x + platform.width;
                
                // Проверяем по вертикали
                const wasAbove = this.player.y + this.player.height - this.player.vy <= platform.y;
                const nowTouching = this.player.y + this.player.height >= platform.y && 
                                   this.player.y + this.player.height <= platform.y + platform.height + this.player.vy;
                
                // Если игрок коснулся платформы - прыгаем
                if (withinX && wasAbove && nowTouching) {
                    this.player.vy = this.JUMP_VELOCITY;
                    break;
                }
            }
        }
    }
    
    // ============================================
    // ДВИЖЕНИЕ КАМЕРЫ
    // ============================================
    updateCamera() {
        // Камера начинает двигаться, когда игрок достигает половины экрана
        const scrollThreshold = this.height / 2;
        
        if (this.player.y < scrollThreshold) {
            // Вычисляем смещение
            const diff = scrollThreshold - this.player.y;
            
            // Перемещаем игрока
            this.player.y = scrollThreshold;
            
            // Добавляем очки
            this.score += Math.round(diff);
            
            // Сдвигаем все платформы
            for (let platform of this.platforms) {
                platform.y += diff;
            }
            
            // Удаляем платформы, которые ушли вниз
            this.cleanPlatforms();
            
            // Добавляем новые платформы сверху
            this.addNewPlatforms();
        }
    }
    
    // ============================================
    // ОЧИСТКА СТАРЫХ ПЛАТФОРМ
    // ============================================
    cleanPlatforms() {
        const before = this.platforms.length;
        
        // Оставляем только платформы, которые видны на экране
        this.platforms = this.platforms.filter(p => p.y < this.height);
        
        const removed = before - this.platforms.length;
        if (removed > 0) {
            console.log(`🧹 Удалено ${removed} платформ (экономия памяти)`);
        }
    }
    
    // ============================================
    // ДОБАВЛЕНИЕ НОВЫХ ПЛАТФОРМ
    // ============================================
    addNewPlatforms() {
        // Находим самую верхнюю платформу
        let topPlatform = null;
        let highestY = Infinity;
        
        for (let p of this.platforms) {
            if (p.y < highestY) {
                highestY = p.y;
                topPlatform = p;
            }
        }
        
        if (!topPlatform) return;
        
        // Добавляем новые платформы выше самой верхней
        let y = topPlatform.y;
        let prevX = topPlatform.x;
        let count = 0;
        
        while (y > -this.PLATFORM_GAP_MAX) {
            y -= this.getRandomGap();
            const x = this.getNextX(prevX);
            
            this.platforms.push({
                x: x,
                y: y,
                width: this.PLATFORM_WIDTH,
                height: this.PLATFORM_HEIGHT
            });
            
            prevX = x;
            count++;
        }
        
        if (count > 0) {
            console.log(`➕ Добавлено ${count} новых платформ`);
        }
    }
}

// ============================================
// ЭКСПОРТ МОДЕЛИ
// ============================================

console.log('✅ Класс GameModel создан!');
console.log('🔍 Тип GameModel:', typeof GameModel);

// Для проверки создаем тестовый экземпляр
console.log('🧪 Тест: создаем модель...');
const testModel = new GameModel();
console.log('✅ Тест пройден! Модель работает.');
console.log('📊 Игрок:', testModel.player);
console.log('📊 Платформ:', testModel.platforms.length);