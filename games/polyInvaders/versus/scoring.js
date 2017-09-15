function ScoreCounter() {
    this.score = 0;
    this.pointsEnemyKill = function() {
        this.score += 10;
    }
    this.pointsBossKill = function() {
        this.score += 50;
    }
    this.everyMinute = function() {
        this.score += 100;
    }
    this.everyTenSeconds = function() {
        this.score += 5;
    }
}