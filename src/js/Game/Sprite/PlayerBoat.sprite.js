import 'phaser';
import AssetDictionary from '../Util/Asset.dictionary';
import MapDictionary from '../Util/Map.dictionary';
import WindMachine from '../Util/WindMachine';

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

        this.bearing = 0.001 * Math.PI;
        this.maxBearing = 2 * Math.PI;
        this.minBearing = 0.001;
        this.sailHeight = 1;
        this.maxSailHeight = 1;
        this.minSailHeight = 0.01;
    }

    update(cursors) {

        this.handleNavigation(cursors);
        this.handleWind();
    }

    handleWind() {

        let windCaughtPercentage = WindMachine.instance.getWindCatchPercentage(this.bearing);

        windCaughtPercentage *= this.sailHeight;
        const boatSpeed = 75; //this.scene.sys.game.config.boatSpeed;

        let magnitude = 0;
        if (windCaughtPercentage < 0.05 && this.sailHeight > 0.1) {
            windCaughtPercentage = 0.05;
        }
        if (this.sailHeight === this.minSailHeight) {
            magnitude = 0;
        } else {
            magnitude = windCaughtPercentage * boatSpeed;
        }

        let bodyVelocityX = Math.sin(this.bearing) * magnitude;
        let bodyVelocityY = -1 * Math.cos(this.bearing) * magnitude;

        this.body.setVelocityX(bodyVelocityX);
        this.body.setVelocityY(bodyVelocityY);

        if (this.scene.debug) {
            this.scene.debugScene.setReadout('BOAT', '-------------------------');
            this.scene.debugScene.setReadout('Bearing', (this.bearing / Math.PI).toFixed(3));
            this.scene.debugScene.setReadout('Wind Caught', (windCaughtPercentage * 100).toFixed(2) + '%');
            this.scene.debugScene.setReadout('Speed (avg)', ((this.body.velocity.x + this.body.velocity.y)/2).toFixed(3));
        }
    }

    handleNavigation(cursors) {

        let turnSpeed = 0.0025;
        let sailChangeSpeed = 0.01;

        if (cursors.right.isDown) {
            this.bearing = Phaser.Math.Wrap(this.bearing + turnSpeed * Math.PI, this.minBearing, this.maxBearing);
        }
        else if (cursors.left.isDown) {
            this.bearing = Phaser.Math.Wrap(this.bearing - turnSpeed * Math.PI, this.minBearing, this.maxBearing);
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