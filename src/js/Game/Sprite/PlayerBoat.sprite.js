import 'phaser';
import AssetDictionary from '../Util/Asset.dictionary';
import MapDictionary from '../Util/Map.dictionary';
import SceneDictionary from '../Util/Scene.dictionary';

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

        this.bearing = 0.01;
        this.maxBearing = 360;
        this.minBearing = 0.01;
        this.sailHeight = 1;
        this.maxSailHeight = 1;
        this.minSailHeight = 0.01;

        this.debug = this.scene.sys.game.config.debug;
    }

    update(cursors, windMachine) {

        this.handleNavigation(cursors);
        this.handleWind(windMachine);
    }

    handleWind(windMachine) {

        let windCaughtPercentage = windMachine.getWindCatchPercentage(this.bearing);

        windCaughtPercentage *= this.sailHeight;
        //console.log(windCaughtPercentage);
        const boatSpeed = 75; //this.scene.sys.game.config.boatSpeed;

        let magnitude = 0;
        if (windCaughtPercentage < 0.05 && this.sailHeight > 0.1) {
            windCaughtPercentage = 0.05;
        }
        if (this.sailHeight == this.minSailHeight) {
            magnitude = 0;
        } else {
            magnitude = windCaughtPercentage * boatSpeed;
        }

        let bodyVelocityX = Math.sin(Phaser.Math.DegToRad(this.bearing)) * magnitude;
        let bodyVelocityY = -1 * Math.cos(Phaser.Math.DegToRad(this.bearing)) * magnitude;

        this.body.setVelocityX(bodyVelocityX);
        this.body.setVelocityY(bodyVelocityY);

        /*debugScene.velocity.setText( 'Velocity: ' + ((this.body.velocity.x + this.body.velocity.y) / 2).toFixed());*/
    }

    handleNavigation(cursors) {

        if (cursors.right.isDown) {
            this.bearing += 0.5;
        }
        else if (cursors.left.isDown) {
            this.bearing -= 0.5;
        }

        if (cursors.up.isDown) {
            this.sailHeight -= 0.01;
        } else if (cursors.down.isDown) {
            this.sailHeight += 0.01;
        }

        if (this.bearing > this.maxBearing) { this.bearing = this.minBearing  }
        if (this.bearing < this.minBearing) { this.bearing = this.maxBearing }

        if (this.sailHeight >= this.maxSailHeight) { this.sailHeight = this.maxSailHeight; }
        if (this.sailHeight <= this.minSailHeight) { this.sailHeight = this.minSailHeight; }

        let oneSixteenthBearing = this.maxBearing / 16;
        let oneThirdSailHeight = this.maxSailHeight / 3;

        let directionId = Math.ceil(this.bearing / oneSixteenthBearing);
        let heightId = Math.ceil(this.sailHeight / oneThirdSailHeight);

        this.setFrame(SailHeights[heightId] + MapDictionary.DIRECTION_NAMES[directionId] + '.png');
    }


}