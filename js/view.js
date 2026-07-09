// ============================================
// 2. ПРЕДСТАВЛЕНИЕ (View) - отображение игры
// ============================================

console.log('🎨 Загрузка представления...');

class GameView {
    constructor() {
        console.log('🔄 Создание представления...');
        
        // Получаем элементы из HTML
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreDisplay = document.getElementById('scoreDisplay');
        this.startScreen = document.getElementById('startScreen');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.finalScore = document.getElementById('finalScore');
        
        // Размеры
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        console.log('✅ Представление создано!');
        console.log('  Canvas:', this.canvas);
        console.log('  ScoreDisplay:', this.scoreDisplay);
        console.log('  StartScreen:', this.startScreen);
        console.log('  GameOverScreen:', this.gameOverScreen);
    }
    
    // Отрисовка игры
    render(model) {
        // Очищаем экран
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Фон
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#bdeaff');
        gradient.addColorStop(1, '#eaf9ff');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Платформы
        this.drawPlatforms(model.platforms);
        
        // Игрок
        this.drawPlayer(model.player);
        
        // Счет
        this.updateScore(model.score);
    }
    
    // Рисование платформ
    drawPlatforms(platforms) {
        this.ctx.fillStyle = '#5b8c3e';
        
        for (let p of platforms) {
            this.ctx.fillRect(p.x, p.y, p.width, p.height);
        }
    }
    
    // Рисование игрока (упрощенный вариант)
    drawPlayer(player) {
        if (!player) return;
        
        // Просто синий круг
        this.ctx.fillStyle = '#3ba7ff';
        this.ctx.beginPath();
        this.ctx.arc(
            player.x + player.width / 2,
            player.y + player.height / 2,
            player.width / 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        
        // Глаза (белые точки)
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(player.x + 10, player.y + 12, 5, 0, Math.PI * 2);
        this.ctx.arc(player.x + 26, player.y + 12, 5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Зрачки (черные точки)
        this.ctx.fillStyle = 'black';
        this.ctx.beginPath();
        this.ctx.arc(player.x + 11, player.y + 12, 2, 0, Math.PI * 2);
        this.ctx.arc(player.x + 27, player.y + 12, 2, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    // Обновление счета
    updateScore(score) {
        if (this.scoreDisplay) {
            this.scoreDisplay.textContent = score;
        }
    }
    
    // Показать стартовый экран
    showStartScreen() {
        console.log('📺 Показываем стартовый экран');
        if (this.startScreen) {
            this.startScreen.style.display = 'flex';
        }
        if (this.gameOverScreen) {
            this.gameOverScreen.style.display = 'none';
        }
    }
    
    // Показать экран Game Over
    showGameOverScreen(score) {
        console.log('📺 Показываем Game Over, счет:', score);
        if (this.finalScore) {
            this.finalScore.textContent = score;
        }
        if (this.startScreen) {
            this.startScreen.style.display = 'none';
        }
        if (this.gameOverScreen) {
            this.gameOverScreen.style.display = 'flex';
        }
    }
    
    // Скрыть все экраны
    hideAllScreens() {
        console.log('📺 Скрываем все экраны');
        if (this.startScreen) {
            this.startScreen.style.display = 'none';
        }
        if (this.gameOverScreen) {
            this.gameOverScreen.style.display = 'none';
        }
    }
}

console.log('✅ Класс GameView создан!');
console.log('🔍 Тип GameView:', typeof GameView);