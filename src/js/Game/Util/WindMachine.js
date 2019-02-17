import 'phaser';
import SceneDictionary from "./Scene.dictionary";

/**
 * @class
 *
 * The WindMachine generates data about the wind blowing along the surface of the water.
 * It also supplies convenience functions which can be used to simplify interactions of game objects
 * with the wind (such as measuring the effectiveness of a boat's sail which is pointed at a given bearing.
 */
export default class WindMachine {

    constructor(debugScene = null) {
        this.windVector = new Phaser.Math.Vector2(0, 0);
        this.initWindVector();
        this.windTimer = null;
        this.debug = (debugScene) ? true : false;
        this.debugScene = debugScene;
    }

    /**
     * Initialize the values for the direction and intensity of the wind.
     */
    initWindVector() {

        // Set direction in radians. -1, 1 rads.
        let windDirection = (Math.random() * 2) - 1;

        // wind factor starts between 0.25 and 0.5.
        let windFactor = (Math.random() * 0.25) + 0.25;

        this.windVector = new Phaser.Math.Vector2(windDirection * Math.PI, windFactor);

        this.windTimer = new Phaser.Time.TimerEvent({
            delay: 1000,
            callback: () => {
                this.updateWindVector();
            },
            callbackScope: this,
            repeat: -1,
        });
    }

    /**
     * Shift the direction and intensity of the wind.
     */
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

    /**
     * 360 degree angle bearing of a given game object which interacts with the wind.
     *
     * @param number bearing  Between 0 and 360 in a circle, where 0 is true North.
     */
    getWindCatchPercentage(bearing) {
        // Break down wind direction and vector
        let windVector = this.windVector;
        let windDirection = Phaser.Math.Wrap(Phaser.Math.RadToDeg(windVector.x), 0, 359);
        let windFactor = windVector.y;

        let windAngle = 270;
        let minWindAngle = -1 * (windAngle/2);
        let maxWindAngle = windAngle/2;
        let adjustedWindDirection = 0;

        let adjustedBearing = this.shiftCircle(bearing - windDirection);

        /**
        this.debugScene.bearing.setText( 'Bearing: ' + bearing.toFixed(3));
        this.debugScene.windDirection.setText( 'Wind Direction: ' + windDirection.toFixed(3));
        this.debugScene.adjustedBearing.setText( 'Adjusted Bearing: ' + adjustedBearing.toFixed(3));
        this.debugScene.adjustedWindDirection.setText( 'Adjusted Wind Direction: ' + adjustedWindDirection.toFixed(3));
        this.debugScene.minWindCone.setText( 'Min Wind Cone: ' + minWindAngle.toFixed(3) );
        this.debugScene.maxWindCone.setText( 'Max Wind Cone: ' + maxWindAngle.toFixed(3) );
         */

        // Compare ships heading to the arc of wind power, then account for the config's boat speed and
        // the height of the sails.
        let windCaughtPercentage = Phaser.Math.Percent(adjustedBearing, minWindAngle, adjustedWindDirection, maxWindAngle);
        /*this.debugScene.windCaughtPct.setText( 'Wind Caught: ' + (windCaughtPercentage * 100).toFixed(2) + '%')*/

        return windCaughtPercentage;
    }

    /**
     * Move the angle so that it represents a point on a circle with angles ranging from -180 through 180.
     * @param angle
     * @returns {number}
     */
    shiftCircle(angle) {
        return ((angle + 180 + 360) % 360) - 180;
    }
}