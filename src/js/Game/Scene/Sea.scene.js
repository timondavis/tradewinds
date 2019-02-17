import 'phaser';
import EventDictionary from '../Util/Event.dictionary';
import MapDictionary from '../Util/Map.dictionary';
import PlayModeDictionary from '../Util/PlayMode.dictionary';
import SceneDictionary from '../Util/Scene.dictionary';

import PlayerBoat from '../Sprite/PlayerBoat.sprite';

import WindMachine from '../Util/WindMachine';

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
    }

    create() {
        this.windMachine = new WindMachine(this);

        this.createMap();

        this.createPlayer();
        this.createControls();
        this.configureCamera();


           this.scene.launch(SceneDictionary.DEBUG);
    }

    update() {

        this.playerBoat.update(this.cursors, this.windMachine);

        if (this.cursors.space.isDown) {
            this.scene.launch(SceneDictionary.PAUSED);
            this.scene.pause();
        }
    }

    createMap() {
        // Paint a repeating water tile across breadth of map
        // @todo set width correctly by reading the map and using math to determine true w * h
        this.tileSprite = this.add.tileSprite(0, 0, 8192, 8192, MapDictionary.TILESET.ISLAND, 1);
        this.tileSprite.setScale(this.sys.game.config.scaleX, this.sys.game.config.scaleY);

        // Read in the tilemap (.json sourced) to the map for the level.
        this.map = this.make.tilemap({
            key: this._LEVELS[this._LEVEL]
        });

        // Add the tileset for the scene
        this.tiles = this.map.addTilesetImage(MapDictionary.TILESET.ISLAND);

        // Read map's tile layers and apply to the level map.
        this.landLayer = this.map.createStaticLayer(MapDictionary.LAYER.LAND, this.tiles, 0, 0);
        this.landLayer.setScale(this.sys.game.config.scaleX, this.sys.game.config.scaleY);
        this.blockedLayer = this.map.createStaticLayer(MapDictionary.LAYER.BLOCKED, this.tiles, 0, 0);
        this.blockedLayer.setScale(this.sys.game.config.scaleX, this.sys.game.config.scaleY);

        // Set Collidable tiles.  Land tiles will not be collidable unless steering a boat.
        if (this._PLAYMODE === PlayModeDictionary.BOAT) {
            this.landLayer.setCollisionByExclusion([-1]);
        }
        this.blockedLayer.setCollisionByExclusion([-1]);
    }

    createPlayer() {

        this.map.findObject(MapDictionary.LAYER.PLAYER, (boatStart) => {
            this.playerBoat = new PlayerBoat(this, boatStart.x, boatStart.y);
        })
    }

    createControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    configureCamera() {

        this.cameras.main.startFollow(this.playerBoat);
        this.cameras.main.zoom = 2;
    }
}

