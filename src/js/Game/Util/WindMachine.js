import 'phaser';
import SceneDictionary from "./Scene.dictionary";

let instance = null;

let windTimer = null;
let windDirection = 0;
let windIntensity = 0;

/**
 * @class
 *
 * Singleton.  Invoke with ::instance() method.
 *
 * The WindMachine generates data about the wind blowing along the surface of the water.
 * It also supplies convenience functions which can be used to simplify interactions of game objects
 * with the wind (such as measuring the effectiveness of a boat's sail which is pointed at a given bearing.
 */
export default class WindMachine {

    constructor() {
        this.debugScene = null;
    }

    static get instance() {
        if (instance === null) {
            instance = new WindMachine();
            instance.initWindVector();
        }
        return instance;
    }

    pause() {
        clearInterval(windTimer);
    }

    unpause() {
        windTimer = setInterval(this.updateWind, 1000);
    }

    /**
     * Activate debugging capabilities.  Requires the DebugScene instance to write to.
     * @param debugScene {DebugScene}
     */
    activateDebug(debugScene) {
        this.debugScene = debugScene;
    }

    /**
     * Initialize the values for the direction and intensity of the wind.
     */
    initWindVector() {
        // Set direction in radians. -1, 1 rads.
        windDirection = (Math.random() * 2 * Math.PI);

        // wind factor starts between 0.25 and 0.5.
        windIntensity = (Math.random() * 0.25) + 0.25;

        windTimer = setInterval(this.updateWind, 1000);
    }

    /**
     * Shift the direction and intensity of the wind.
     */
    updateWind() {
        const windDirectionDelta = (Math.random() * 0.6 * Math.PI) - 0.3 * Math.PI;
        const windIntensityDelta = (Math.random() * 0.2) - 0.1;

        windDirection = Phaser.Math.Wrap(windDirection + windDirectionDelta, 0.001, 2 * Math.PI);
        windIntensity = Phaser.Math.Clamp(windIntensity + windIntensityDelta, 0.001, 1);
    }

    /**
     * Bearing of a given game object which interacts with the wind.
     *
     * @param bearing number | Between 0 and 2 radians in a circle, where 0 and 2 are true North.
     * @param debugScene {Phaser.Scene} | If debugScene output is desired, pass in the debugScene.
     */
    getWindCatchPercentage(bearing) {
        // Break down wind direction and vector.
        let windAngle = 1.5 * Math.PI;
        let minWindAngle = (-1 * (windAngle/2));
        let maxWindAngle = (windAngle/2);
        let adjustedWindDirection = 0;

        let adjustedBearing = this.shiftCircle(bearing - windDirection);

        if (this.debugScene) {
            // Send out all numbers as pi radians
            this.debugScene.setReadout('WIND CAUGHT', '------------------------');
            this.debugScene.setReadoutInPiRadians('Wind Direction', windDirection);
            this.debugScene.setReadoutInPiRadians('Adjusted Object Bearing', adjustedBearing);
            this.debugScene.setReadoutInPiRadians('Adjusted Wind Direction', adjustedWindDirection);
            this.debugScene.setReadoutInPiRadians('Min Wind Cone', minWindAngle);
            this.debugScene.setReadoutInPiRadians('Max Wind Cone', maxWindAngle);
        }

        return Phaser.Math.Percent(adjustedBearing, minWindAngle, adjustedWindDirection, maxWindAngle);
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