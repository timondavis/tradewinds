import 'phaser';
import EventDictionary from '../Util/Event.dictionary';
import MapDictionary from '../Util/Map.dictionary';
import PlayModeDictionary from '../Util/PlayMode.dictionary';
import SceneDictionary from '../Util/Scene.dictionary';

import PlayerBoat from '../Sprite/PlayerBoat.sprite';

import WindMachine from '../Util/WindMachine';

import Config from '../Config';

export default class SeaScene extends Phaser.Scene {

    init(data) {
        this._LEVEL = data.level;
        this._LEVELS = data.levels;
        this._NEWGAME = data.newGame;
        this._PLAYMODE = data.playMode;

        if (this._NEWGAME) {
            this.events.emit(EventDictionary.EVENTS.NEW_GAME);
        }

        this.landLayer = null;
        this.blockedLayer = null;
        this.map = null;
        this.tileSprite = null;

        this.playerBoat = null;

        this.debug = this.sys.game.config.physics.arcade.debug;
        this._debugScene = null;

        this.isPauseLocked = false;
    }

    create() {

        // Setup environmental factors.
        let windMachine = WindMachine.instance;

        // Setup debugging
        this.debugScene = null;
        if (this.debug) {
            this.scene.launch(SceneDictionary.DEBUG);
            this.debugScene = this.scene.get(SceneDictionary.DEBUG);
            windMachine.activateDebug(this.debugScene);
        }

        // Create game components.
        this.createMap();
        this.createPlayer();
        this.createCollisions();
        this.createControls();
        this.configureCamera();
    }

    update() {

        this.playerBoat.update(this.cursors);

        if (this.cursors.space.isDown) {
            if (!this.isPauseLocked) {
                this.scene.launch(SceneDictionary.PAUSED);
                this.pause();
            }
        } else {
           this.isPauseLocked = false;
        }
    }

    pause() {
        this.scene.pause();
        this.isPauseLocked = true;
        WindMachine.instance.pause();
    }

    unpause() {
        WindMachine.instance.unpause();
    }

    createMap() {

        // Read in the tilemap (.json sourced) to the map for the level.
        this.map = this.make.tilemap({
            key: this._LEVELS[this._LEVEL]
        });

        // Paint a repeating water tile across breadth of map
        this.tileSprite = this.add.tileSprite(
            this.map.widthInPixels / 2,
            this.map.heightInPixels / 2,
            this.map.widthInPixels + Config.tileMap.mapPadding * 2,
            this.map.heightInPixels + Config.tileMap.mapPadding * 2,
            MapDictionary.TILESET.ISLAND, Config.tileMap.defaultBackgroundTileFrame);

        this.tileSprite.setScale(this.sys.game.config.scaleX, this.sys.game.config.scaleY);

        // Add the tileset for the scene
        this.tiles = this.map.addTilesetImage(MapDictionary.TILESET.ISLAND);

        // Read map's tile layers and apply to the level map.
        this.landLayer = this.map.createStaticLayer(MapDictionary.LAYER.LAND, this.tiles,
            Config.tileMap.defaultTopLeft.x, Config.tileMap.defaultTopLeft.y);
        this.landLayer.setScale(this.sys.game.config.scaleX, this.sys.game.config.scaleY);

        this.blockedLayer = this.map.createStaticLayer(MapDictionary.LAYER.BLOCKED, this.tiles,
            Config.tileMap.defaultTopLeft.x, Config.tileMap.defaultTopLeft.y);
        this.blockedLayer.setScale(this.sys.game.config.scaleX, this.sys.game.config.scaleY);

        // Set Collidable tiles.  Land tiles will not be collidable unless steering a boat.
        this.landLayer.setCollisionByExclusion([-1]);
        this.blockedLayer.setCollisionByExclusion([-1]);

        this.physics.world.setBounds(Config.tileMap.defaultTopLeft.x, Config.tileMap.defaultTopLeft.y,
            this.map.widthInPixels, this.map.heightInPixels, true, true, true, true);
    }

    createPlayer() {
        this.map.findObject(MapDictionary.LAYER.PLAYER, (boatStart) => {
            this.playerBoat = new PlayerBoat(this, boatStart.x, boatStart.y);
        })
    }

    createCollisions() {
        this.physics.add.collider(this.playerBoat, [this.landLayer]);
    }

    createControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    configureCamera() {
        this.cameras.main.startFollow(this.playerBoat);
        this.cameras.main.zoom = Config.cameraZoom;
    }

    // Things were weird without the getters and setters in place.  Consider review on ticket #9.
    get debugScene() {
        return this._debugScene;
    }

    set debugScene(value) {
        this._debugScene = value;
    }
}

