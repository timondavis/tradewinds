export default class DebugScene extends Phaser.Scene {

    constructor(config) {
        super(config);
        this.verticalPadding = 25; // PX spacing between each declared readout
        this.readouts = {};
        this.texts = {};
    }

    setReadout(key, value) {
        this.readouts[key] = value;
    }

    update() {

        const startingHeight = 12;
        let currentHeight = startingHeight;

        Object.keys(this.readouts).forEach((key) => {

            if (this.texts.hasOwnProperty(key)) {
                this.texts[key].setText(key + ': ' + this.readouts[key]);
            } else {
                this.texts[key] = this.add.text(12, currentHeight, key + ': ' + this.readouts[key], {
                    fontSize: '32px',
                    fill: '#FFF'
                });
            }

            currentHeight += this.verticalPadding;
        });
    }
}