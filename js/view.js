// ============================================
// 2. ПРЕДСТАВЛЕНИЕ (View) - отображение
// ============================================

console.log('🎨 Загрузка представления...');

class GameView {
    constructor() {
        console.log('🔄 Создание представления...');
        
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreDisplay = document.getElementById('scoreDisplay');
        this.startScreen = document.getElementById('startScreen');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.finalScore = document.getElementById('finalScore');
        
        this.width = 480;
        this.height = 720;
        
        console.log('✅ Представление создано');
    }
    
    render(model) {
        // Очистка
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Фон
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#bdeaff');
        gradient.addColorStop(1, '#eaf9ff');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Платформы
        this.ctx.fillStyle = '#5b8c3e';
        for (let p of model.platforms) {
            this.ctx.fillRect(p.x, p.y, p.width, p.height);
        }
        
        // Игрок
        if (model.player) {
            const cx = model.player.x + model.player.width / 2;
            const cy = model.player.y + model.player.height / 2;
            const r = model.player.width / 2;
            
            this.ctx.fillStyle = '#3ba7ff';
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Глаза
            this.ctx.fillStyle = 'white';
            this.ctx.beginPath();
            this.ctx.arc(cx - 7, cy - 6, 5, 0, Math.PI * 2);
            this.ctx.arc(cx + 7, cy - 6, 5, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.fillStyle = 'black';
            this.ctx.beginPath();
            this.ctx.arc(cx - 6, cy - 5, 2, 0, Math.PI * 2);
            this.ctx.arc(cx + 8, cy - 5, 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Счет
        this.scoreDisplay.textContent = model.score;
    }
    
    showStartScreen() {
        if (this.startScreen) this.startScreen.style.display = 'flex';
        if (this.gameOverScreen) this.gameOverScreen.style.display = 'none';
    }
    
    showGameOverScreen(score) {
        if (this.finalScore) this.finalScore.textContent = score;
        if (this.startScreen) this.startScreen.style.display = 'none';
        if (this.gameOverScreen) this.gameOverScreen.style.display = 'flex';
    }
    
    hideAllScreens() {
        if (this.startScreen) this.startScreen.style.display = 'none';
        if (this.gameOverScreen) this.gameOverScreen.style.display = 'none';
    }
}

console.log('Класс GameView создан');