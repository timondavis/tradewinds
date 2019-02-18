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

export default class PlayerBoat extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, AssetDictionary.ATLAS_NAME.SPRITE_ATLAS, AssetDictionary.ATLAS.SLOOP.FULL_SAIL + MapDictionary.DIRECTION_NAMES[1] + '.png');
        this.scene = scene;
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);

        this.bearing = Config.geom.arcMin;
        this.maxBearing = Config.geom.arcMax * Math.PI;
        this.minBearing = Config.geom.arcMin;
        this.sailHeight = Config.boat.sailHeightMax;
        this.maxSailHeight = Config.boat.sailHeightMax;
        this.minSailHeight = Config.boat.sailHeightMin;

        this.body.setCollideWorldBounds(true);
    }

    update(cursors) {

        this.handleNavigation(cursors);
        this.handleWind();
    }

    handleWind() {

        let windCaughtPercentage = WindMachine.instance.getWindCatchPercentage(this.bearing);

        windCaughtPercentage *= this.sailHeight;
        const boatSpeed = Config.boat.speed;

        let magnitude = 0;
        if (windCaughtPercentage < Config.boat.impulseWindEffectivenessThreshold &&
            this.sailHeight > Config.boat.sailHeightMinForImpulsePower) {
                windCaughtPercentage = Config.boat.impulseWindEffectiveness;
        }
        if (this.sailHeight < Config.boat.sailHeightMinForImpulsePower) {
            magnitude = Config.boat.stopSpeed;
        } else {
            magnitude = windCaughtPercentage * boatSpeed;
        }

        let bodyVelocityX = Math.sin(this.bearing) * magnitude;
        let bodyVelocityY = -1 * Math.cos(this.bearing) * magnitude;

        this.body.setVelocityX(bodyVelocityX);
        this.body.setVelocityY(bodyVelocityY);

        if (this.scene.debug) {
            this.scene.debugScene.setReadout('BOAT', '-------------------------');
            this.scene.debugScene.setReadoutInPiRadians('Bearing', this.bearing);
            this.scene.debugScene.setReadout('Wind Caught', (windCaughtPercentage * 100).toFixed(2) + '%');
            this.scene.debugScene.setReadout('Speed (avg)', ((this.body.velocity.x + this.body.velocity.y)/2).toFixed(3));
        }
    }

    handleNavigation(cursors) {

        let turnSpeed = Config.boat.turnSpeed;
        let sailChangeSpeed = Config.boat.sailChangeSpeed;

        if (cursors.right.isDown) {
            this.bearing = Phaser.Math.Wrap(this.bearing + (turnSpeed * Math.PI), this.minBearing, this.maxBearing);
        }
        else if (cursors.left.isDown) {
            this.bearing = Phaser.Math.Wrap(this.bearing - (turnSpeed * Math.PI), this.minBearing, this.maxBearing);
        }

        if (cursors.up.isDown) {
            this.sailHeight = Phaser.Math.Clamp(this.sailHeight - sailChangeSpeed, this.minSailHeight, this.maxSailHeight);
        } else if (cursors.down.isDown) {
            this.sailHeight = Phaser.Math.Clamp(this.sailHeight + sailChangeSpeed, this.minSailHeight, this.maxSailHeight);
        }

        this.adjustBoatVisualsToNavigation();
    }

    adjustBoatVisualsToNavigation() {
        // Adjust boat visuals to account for bearing and sail height
        let oneSixteenthBearing = this.maxBearing / 16;
        let oneThirdSailHeight = this.maxSailHeight / 3;

        let directionId = Math.ceil(this.bearing / oneSixteenthBearing);
        let heightId = Math.ceil(this.sailHeight / oneThirdSailHeight);

        this.setFrame(SailHeights[heightId] + MapDictionary.DIRECTION_NAMES[directionId] + '.png');
    }
}