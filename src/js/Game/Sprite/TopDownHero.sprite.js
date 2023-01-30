import 'Phaser';
import AssetDictionary from '../Util/Asset.dictionary';

export default class TopDownHeroSprite extends Phaser.GameObjects.Sprite {

    constructor( scene, x, y ) {
        super( scene, x, y,
            AssetDictionary.ATLAS_NAME.SPRITE_ATLAS,
            AssetDictionary.ATLAS.TOP_DOWN_HERO );
        this.scene = scene;
        this.scene.physics.world.enable(this);
        this.scene.add.existing( this );
    }
}