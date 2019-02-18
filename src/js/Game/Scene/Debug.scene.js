import Config from '../Config';

export default class DebugScene extends Phaser.Scene {

    constructor(config) {
        super(config);
        this.verticalPadding = Config.debugOptions.messageVerticalPadding; // PX spacing between each declared readout
        this.readouts = {};
        this.texts = {};
    }

    get ReadoutModes() {
        return {
            TEXT: 'text',
            PI_RADIANS: 'pi_radians'
        };
    }

    setReadout(key, value) {
        if (!this.readouts.hasOwnProperty(key)) {
            this.readouts[key] = new Report();
        }

        this.readouts[key].mode = this.ReadoutModes.TEXT;
        this.readouts[key].value = value;
    }

    setReadoutInPiRadians(key, value) {
        if (!this.readouts.hasOwnProperty(key)) {
            this.readouts[key] = new Report();
        }

        this.readouts[key].value = value;
        this.readouts[key].mode = this.ReadoutModes.PI_RADIANS;
    }

    update() {

        const startingHeight = 12;
        let currentHeight = startingHeight;

        Object.keys(this.readouts).forEach((key) => {

            let readout = this.readouts[key];
            let value = readout.value;
            const mode = readout.mode;

            switch (mode) {

                case(this.ReadoutModes.PI_RADIANS): {
                    value = (value / Math.PI).toFixed(3 ) + ' Pi';
                    break;
                }

                case(this.ReadoutModes.TEXT):
                default: { break; }
            }

            if (this.texts.hasOwnProperty(key)) {
                this.texts[key].setText(key + ': ' + value);
            } else {
                this.texts[key] = this.add.text(12, currentHeight, key + ': ' + value, {
                    fontSize: Config.debugOptions.messageFontSize,
                    fill: Config.debugOptions.messageFillColor
                });
            }

            currentHeight += this.verticalPadding;
        });
    }
}

class Report {

    constructor() {
        this.value = null;
        this.mode = null;
    }
}