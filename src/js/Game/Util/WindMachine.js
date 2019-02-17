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
        this.windDirection = 0;
        this.windIntensity = 0;
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
        this.windDirection = (Math.random() * 2);

        // wind factor starts between 0.25 and 0.5.
        this.windIntensity = (Math.random() * 0.25) + 0.25;

        this.windTimer = new Phaser.Time.TimerEvent({
            delay: 1000,
            callback: () => {
                this.updateWind();
            },
            callbackScope: this,
            repeat: -1,
        });
    }

    /**
     * Shift the direction and intensity of the wind.
     */
    updateWind() {
        const windDirectionDelta = (Math.random() * 0.6) -0.3 ;
        const windIntensityDelta = (Math.random() * 0.2) - 0.1;

        this.windDirection = Phaser.Math.Wrap(this.windDirection + windDirectionDelta, 0.001, 2);
        this.windIntensity = Phaser.Math.Clamp(this.windIntensity + windIntensityDelta, 0.001, 1);
    }

    /**
     * 360 degree angle bearing of a given game object which interacts with the wind.
     *
     * @param number bearing  Between 0 and 360 in a circle, where 0 is true North.
     */
    getWindCatchPercentage(bearing) {
        // Break down wind direction and vector

        let windAngle = 1.5 * Math.PI;
        let minWindAngle = -1 * (windAngle/2);
        let maxWindAngle = windAngle/2;
        let adjustedWindDirection = 0;

        let adjustedBearing = this.shiftCircle(bearing - this.windDirection);

        /**
        this.debugScene.bearing.setText( 'Bearing: ' + bearing.toFixed(3));
        this.debugScene.windDirection.setText( 'Wind Direction: ' + windDirection.toFixed(3));
        this.debugScene.adjustedBearing.setText( 'Adjusted Bearing: ' + adjustedBearing.toFixed(3));
        this.debugScene.adjustedWindDirection.setText( 'Adjusted Wind Direction: ' + adjustedWindDirection.toFixed(3));
        this.debugScene.minWindCone.setText( 'Min Wind Cone: ' + minWindAngle.toFixed(3) );
        this.debugScene.maxWindCone.setText( 'Max Wind Cone: ' + maxWindAngle.toFixed(3) );
         */

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
        return Phaser.Math.DegToRad(((Phaser.Math.RadToDeg(angle) + 180 + 360) % 360) - 180);
    }
}