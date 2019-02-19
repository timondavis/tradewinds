import Config from '../Config';

/**
 * @class
 *
 * This scene is used to store and display debug data
 */
export default class DebugScene extends Phaser.Scene {

    constructor(config) {
        super(config);
        this.readouts = {};  // Readout Data
        this.texts = {};     // Phaser Textbox Group

        // PX spacing between each declared readout
        this.verticalPadding = Config.debugOptions.messageVerticalPadding;
        this.startingHeight = Config.debugOptions.messageTopPadding;
    }

    /**
     * Each readout can be of a given mode.  TEXT is default.  This is the dictionary for those modes.
     *
     * @returns {{TEXT: string, PI_RADIANS: string}}
     * @constructor
     */
    get ReadoutModes() {
        return {
            TEXT: 'text',
            PI_RADIANS: 'pi_radians'
        };
    }

    /**
     * Public setter to add a readout to the scene.
     *
     * @param key
     * @param value
     */
    setReadout(key, value) {
        if (!this.readouts.hasOwnProperty(key)) {
            this.readouts[key] = new Report();
        }

        this.readouts[key].mode = this.ReadoutModes.TEXT;
        this.readouts[key].value = value;
    }

    /**
     * Public setter which adds a radian mode readout to the scene.
     *
     * @param key
     * @param value
     */
    setReadoutInPiRadians(key, value) {
        if (!this.readouts.hasOwnProperty(key)) {
            this.readouts[key] = new Report();
        }

        this.readouts[key].value = value;
        this.readouts[key].mode = this.ReadoutModes.PI_RADIANS;
    }

    /**
     * Standard scene update method.
     */
    update() {

        // Distance the top of the list is from the top of the screen.
        let currentHeight = startingHeight;

        // For each readout, configure the readout value and then print to screen.
        Object.keys(this.readouts).forEach((key) => {

            let readout = this.readouts[key];
            let value = readout.value;
            const mode = readout.mode;

            // This is where data-type conversions to the value take place.  TEXT mode is unaltered and the default.
            switch (mode) {

                case(this.ReadoutModes.PI_RADIANS): {
                    value = (value / Math.PI).toFixed(3) + ' Pi';
                    break;
                }

                case(this.ReadoutModes.TEXT):
                default: {
                    break;
                }
            }

            // Update or create phaser text outputs to report on readouts.
            if (this.texts.hasOwnProperty(key)) {
                this.texts[key].setText(key + ': ' + value);
            } else {
                this.texts[key] = this.add.text(Config.debugOptions.messageLeftPadding, currentHeight, key + ': ' + value, {
                    fontSize: Config.debugOptions.messageFontSize,
                    fill: Config.debugOptions.messageFillColor
                });
            }

            // Update distance from the top of the screen for the next line.
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