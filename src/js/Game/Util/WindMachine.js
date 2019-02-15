import 'phaser';

let instance = null;

export default class WindMachine {

    constructor(scene) {
        this.windVector = new Phaser.Math.Vector2(0, 0);
        this.initWindVector();
        this.windTimer = null;
        this.scene = scene;
    }

    initWindVector() {

        // Set direction in radians. -1, 1 rads.
        let windDirection = (Math.random() * 2) - 1;

        // wind factor starts between 0.25 and 0.5.
        let windFactor = (Math.random() * 0.25) + 0.25;

        this.windVector = new Phaser.Math.Vector2(windDirection * Math.PI, windFactor);

        this.windTimer = this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                this.updateWindVector();
            },
            callbackScope: this,
            repeat: -1,
        });
    }

    updateWindVector() {
        const windDirectionDelta = (Math.random() * 0.6) -0.3 ;
        const windFactorDelta = (Math.random() * 0.2) - 0.1;

        let windDirection = this.windVector.x += windDirectionDelta;
        if (windDirection > 1) { windDirection = 1; }
        if (windDirection < -1) { windDirection = -1; }

        let windFactor = this.windVector.y += windFactorDelta;
        if (windFactor > 1) { windFactor = 1; }
        if (windFactor < 0) { windFactor = 0; }

        this.windVector = new Phaser.Math.Vector2(windDirection, windFactor);
    }
}