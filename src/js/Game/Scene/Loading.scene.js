import 'phaser';
import Config from '../Config';

import AssetDictionary from '../Util/Asset.dictionary';
import AnimationDictionary from '../Util/Animation.dictionary';
import SceneDictionary from '../Util/Scene.dictionary';
import LevelDictionary from '../Util/Level.dictionary';
import MapDictionary from '../Util/Map.dictionary';
import PlayModeDictionary from '../Util/PlayMode.dictionary';


module.exports =
    class LoadingScene extends Phaser.Scene {

        constructor(config) {
            super(config);
        }

        init() {
            console.log( 'init' );
        }

        preload() {
            this.load.multiatlas(AssetDictionary.ATLAS_NAME.SPRITE_ATLAS,
                AssetDictionary.PATH.ATLAS + AssetDictionary.ATLAS_NAME.SPRITE_ATLAS + '.json',
                AssetDictionary.PATH.ATLAS);

            this.load.tilemapTiledJSON( LevelDictionary[1],
                AssetDictionary.generateAssetPath(
                    AssetDictionary.PATH.MAP,
                    AssetDictionary.MAP.LEVEL_1
                )
            );

            this.load.spritesheet(
                MapDictionary.TILESET.ISLAND,
                AssetDictionary.generateAssetPath(
                    AssetDictionary.PATH.IMAGE,
                    AssetDictionary.SPRITESHEET.ISLAND_TILES),
                {frameWidth: Config.tileMap.defaultTileWidth, frameHeight: Config.tileMap.defaultTileHeight}
            );
        }

        create() {

            this.scene.start(SceneDictionary.SEA, {
                level: 1,
                levels: LevelDictionary,
                newGame: true,
                playMode: PlayModeDictionary.BOAT
            });
        }

        update() {
        }
    };