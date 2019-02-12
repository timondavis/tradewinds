import 'phaser';
import AssetDictionary from '../Util/Asset.dictionary';
import MapDictionary from '../Util/Map.dictionary';

const SailHeights = {
    1 : AssetDictionary.ATLAS.SLOOP.RAISED_SAIL,
    2 : AssetDictionary.ATLAS.SLOOP.HALF_SAIL,
    3 : AssetDictionary.ATLAS.SLOOP.FULL_SAIL
};

export default class PlayerBoat extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, AssetDictionary.ATLAS_NAME.SPRITE_ATLAS, AssetDictionary.ATLAS.SLOOP.FULL_SAIL + MapDictionary.DIRECTION_NAMES[1] + '.png');
        this.scene = scene;
        this.scene.add.existing(this);

        this.bearing = 0.01;
        this.maxBearing = 360;
        this.minBearing = 0.01;
        this.sailHeight = 1;
        this.maxSailHeight = 1;
        this.minSailHeight = 0.01;
    }

    update(cursors) {

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