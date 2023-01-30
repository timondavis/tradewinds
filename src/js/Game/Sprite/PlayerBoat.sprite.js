import 'phaser';
import AssetDictionary from '../Util/Asset.dictionary';
import MapDictionary from '../Util/Map.dictionary';
import WindMachine from '../Util/WindMachine';
import Config from '../Config';

const SailHeights = {
    1 : AssetDictionary.ATLAS.SLOOP.RAISED_SAIL,
    2 : AssetDictionary.ATLAS.SLOOP.HALF_SAIL,
    3 : AssetDictionary.ATLAS.SLOOP.FULL_SAIL
};

/**
 * @class
 *
 * Player's boat sprite.
 */
export default class PlayerBoat extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y) {
        // Satisfy requirements for sprite and body being added to scene.
        super(scene, x, y, AssetDictionary.ATLAS_NAME.BOAT_ATLAS,
            AssetDictionary.ATLAS.SLOOP.FULL_SAIL + MapDictionary.DIRECTION_NAMES[1] + '.png');
        this.scene = scene;
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);

        // Set config values on instance.
        this.bearing = Config.geom.arcMin;
        this.maxBearing = Config.geom.arcMax * Math.PI;
        this.minBearing = Config.geom.arcMin;
        this.sailHeight = Config.boat.sailHeightMax;
        this.maxSailHeight = Config.boat.sailHeightMax;
        this.minSailHeight = Config.boat.sailHeightMin;

        // Force the boat to respect the boundaries of the level.
        this.body.setCollideWorldBounds(true);
    }

    /**
     * Updates ship in sync with Scene update() method.
     *
     * @param cursors  {object}
     */
    update(cursors) {

        if ( !this.isActive) return;

        // Process player inputs
        this.handleNavigation(cursors);

        // Factor in environmental status
        this.handleWind();
    }

    /**
     * Determine and apply the effect that the environment's wind has on this ship.
     */
    handleWind() {

        // Initialize boat-specific factors.
        const boatSpeed = Config.boat.speed;

        // Pass in the ship's bearing to the WindMachine to determine the % of effect from the wind.
        let windCaughtPercentage = WindMachine.instance.getWindCatchPercentage(this.bearing);

        // Adjust wind caught % based on the amount the sails are open.
        windCaughtPercentage *= this.sailHeight;

        const magnitude = this.getShipMovementMagnitude(windCaughtPercentage, this.sailHeight, boatSpeed);

        // Apply magnitude (speed) to X and Y velocity based on current bearing.
        let bodyVelocityX = Math.sin(this.bearing) * magnitude;
        let bodyVelocityY = -1 * Math.cos(this.bearing) * magnitude;

        this.body.setVelocityX(bodyVelocityX);
        this.body.setVelocityY(bodyVelocityY);

        // Output debug variables, when applicable.
        if (this.scene.debug) {
            this.scene.debugScene.setReadout('BOAT', '-------------------------');
            this.scene.debugScene.setReadoutInPiRadians('Bearing', this.bearing);
            this.scene.debugScene.setReadout('Wind Caught', (windCaughtPercentage * 100).toFixed(2) + '%');
            this.scene.debugScene.setReadout('Speed (avg)', ((this.body.velocity.x + this.body.velocity.y)/2).toFixed(3));
        }
    }

    /**
     * Calculate and return  the magnitude (speed of movement along the current bearing) based on how much wind is being caught.
     *
     * If the sails are closed, no movement will be applied.  If sails are open but < X% of wind is being caught,
     * impulse speed will be applied instead.
     *
     * @input windCaughtPercentage decimal  0 - 1, percent of wind caught effectiveness
     * @input sailheight decimal  0 - 1, percent of sail height
     * @input boatSpeed number  Base speed for boat.
     */
    getShipMovementMagnitude(windCaughtPercentage, sailHeight, boatSpeed) {

        let magnitude = 0;

        if (windCaughtPercentage < Config.boat.impulseWindEffectivenessThreshold &&
            sailHeight > Config.boat.sailHeightMinForImpulsePower) {
            windCaughtPercentage = Config.boat.impulseWindEffectiveness;
        }
        if (sailHeight < Config.boat.sailHeightMinForImpulsePower) {
            magnitude = Config.boat.stopSpeed;
        } else {
            magnitude = windCaughtPercentage * boatSpeed;
        }

        return magnitude;
    }

    /**
     * Adjust ship's navigation state based on user input.
     *
     * @param cursors  The cursor keys provided by Phaser.
     */
    handleNavigation(cursors) {

        const turnSpeed = Config.boat.turnSpeed;
        const sailChangeSpeed = Config.boat.sailChangeSpeed;

        // Turn the ship based on constant change value, as prompted.
        if (cursors.right.isDown) {
            this.bearing = Phaser.Math.Wrap(this.bearing + (turnSpeed * Math.PI), this.minBearing, this.maxBearing);
        }
        else if (cursors.left.isDown) {
            this.bearing = Phaser.Math.Wrap(this.bearing - (turnSpeed * Math.PI), this.minBearing, this.maxBearing);
        }

        // Raise/Lower the sails based on constant change value, as prompted.
        if (cursors.up.isDown) {
            this.sailHeight = Phaser.Math.Clamp(this.sailHeight - sailChangeSpeed, this.minSailHeight, this.maxSailHeight);
        } else if (cursors.down.isDown) {
            this.sailHeight = Phaser.Math.Clamp(this.sailHeight + sailChangeSpeed, this.minSailHeight, this.maxSailHeight);
        }

        this.adjustBoatVisualsToNavigation();
    }

    /**
     * Change the boat's image based on sail height and current bearing.  This helps the boat to reflect it's state
     * and makes the gameplay experience more enjoyable.
     */
    adjustBoatVisualsToNavigation() {
        // Adjust boat visuals to account for bearing and sail height
        let oneSixteenthBearing = this.maxBearing / 16;
        let oneThirdSailHeight = this.maxSailHeight / 3;

        // Direction images are divided into 16 quarter-cardinal directions.  Sail hights are reflected over 3
        // visual states.  In both cases, the actual value is precise to 3 decimal places,
        // but the visuals are more general.
        let directionId = Math.ceil(this.bearing / oneSixteenthBearing);
        let heightId = Math.ceil(this.sailHeight / oneThirdSailHeight);

        this.setFrame(SailHeights[heightId] + MapDictionary.DIRECTION_NAMES[directionId] + '.png');
    }

    stop() {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }
}