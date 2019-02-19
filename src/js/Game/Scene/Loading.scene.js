import 'phaser';
import Config from '../Config';

import AssetDictionary from '../Util/Asset.dictionary';
import SceneDictionary from '../Util/Scene.dictionary';
import LevelDictionary from '../Util/Level.dictionary';
import MapDictionary from '../Util/Map.dictionary';
import PlayModeDictionary from '../Util/PlayMode.dictionary';

/**
 * @class
 *
 * Responsible for loading the global resources used by other scenes.  Calls on the Sea scene to start game when loading
 * is complete.
 */
export default class LoadingScene extends Phaser.Scene {

    constructor(config) {
        super(config);
    }

    preload() {
        // Multi-atlas image collections are paired with JSON file to define textures and framenames en masse.
        this.load.multiatlas(AssetDictionary.ATLAS_NAME.SPRITE_ATLAS,
            AssetDictionary.PATH.ATLAS + AssetDictionary.ATLAS_NAME.SPRITE_ATLAS + '.json',
            AssetDictionary.PATH.ATLAS);

        // TILED tilemaps include a tile definition image file, as well as a json file describing how those tiles
        // are arranged in order to make a layered map.  This is the JSON file part (one map).
        this.load.tilemapTiledJSON(LevelDictionary[1],
            AssetDictionary.generateAssetPath(
                AssetDictionary.PATH.MAP,
                AssetDictionary.MAP.LEVEL_1
            )
        );

        // Spritesheets to feed the tile images to tile maps.
        this.load.spritesheet(
            MapDictionary.TILESET.ISLAND,
            AssetDictionary.generateAssetPath(
                AssetDictionary.PATH.IMAGE,
                AssetDictionary.SPRITESHEET.ISLAND_TILES),
            {frameWidth: Config.tileMap.defaultTileWidth, frameHeight: Config.tileMap.defaultTileHeight}
        );
    }

    create() {

        // Init the sea scene and start the game.
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