import 'phaser';
import EventDictionary from '../Util/Event.dictionary';
import MapDictionary from '../Util/Map.dictionary';
import SceneDictionary from '../Util/Scene.dictionary';
import PlayerBoat from '../Sprite/PlayerBoat.sprite';
import WindMachine from '../Util/WindMachine';
import Config from '../Config';

/**
 * @class
 *
 * The main game scene for sailing, interacting and exploring the high seas!
 */
export default class SeaScene extends Phaser.Scene {

    /**
     * Standard scene init() method callback
     *
     * @param data
     */
    init(data) {
        // Initialize level data
        this.level = data.level;
        this.levels = data.levels;
        this.newGame = data.newGame;
        this.playMode = data.playMode;

        // If this is a new game, broadcast the new game event to listeners.
        if (this.newGame) {
            this.events.emit(EventDictionary.EVENTS.NEW_GAME);
        }

        // Map Stuff
        this.landLayer = null;
        this.blockedLayer = null;
        this.map = null;
        this.tileSprite = null;

        // Player Vars
        this.playerBoat = null;

        // Debug Vars
        this.debug = this.sys.game.config.physics.arcade.debug;
        this._debugScene = null;

        // Track whether or not the pause button is locked.  It is locked when pause is started until the key isreleased,
        // which prevents fast-alternation of pause state while the button is down.
        this.isPauseLocked = false;
    }

    /**
     * Standard scene create() method callback.
     */
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

        // Create game components, controls, and environment.
        this.createMap();
        this.createPlayer();
        this.createCollisions();
        this.createControls();
        this.configureCamera();
    }

    /**
     * Standard scene update() method callback
     */
    update() {

        // Update actors.
        this.playerBoat.update(this.cursors);

        // Listen for pause.  When pause, activate own pause() method.  Pause the scene and launch the pause scene.
        if (this.cursors.space.isDown) {
            if (!this.isPauseLocked) {
                this.scene.launch(SceneDictionary.PAUSED);
                this.pause();
            }
        } else {
            // Unlock the pause button when pause button is not being held down.
            this.isPauseLocked = false;
        }
    }

    /**
     * Scene pause.  Pauses scene and manages state as needed.
     */
    pause() {
        // Pause this scene. Lock the pause button and pause the WindMachine.
        this.scene.pause();
        this.isPauseLocked = true;
        WindMachine.instance.pause();
    }

    /**
     * Unpause the scene.  Maintains state as needed
     */
    unpause() {
        // Unpause the WindMachine.
        WindMachine.instance.unpause();
    }

    /**
     * Create the map on which action will take place.
     */
    createMap() {

        // Read in the tilemap (.json sourced) to the map for the level.
        this.map = this.make.tilemap({
            key: this.levels[this.level]
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

        // Read map's tile layers and apply to the level map.  Adjust as needed.
        this.landLayer = this.map.createStaticLayer(MapDictionary.LAYER.LAND, this.tiles,
            Config.tileMap.defaultTopLeft.x, Config.tileMap.defaultTopLeft.y);
        this.landLayer.setScale(this.sys.game.config.scaleX, this.sys.game.config.scaleY);

        this.blockedLayer = this.map.createStaticLayer(MapDictionary.LAYER.BLOCKED, this.tiles,
            Config.tileMap.defaultTopLeft.x, Config.tileMap.defaultTopLeft.y);
        this.blockedLayer.setScale(this.sys.game.config.scaleX, this.sys.game.config.scaleY);

        // Set Collidable tiles.  Land tiles will not be collidable unless steering a boat.
        this.landLayer.setCollisionByExclusion([-1]);
        this.blockedLayer.setCollisionByExclusion([-1]);

        // Set the world boundaries based on the level data passed in.
        this.physics.world.setBounds(Config.tileMap.defaultTopLeft.x, Config.tileMap.defaultTopLeft.y,
            this.map.widthInPixels, this.map.heightInPixels, true, true, true, true);
    }

    /**
     * Create and configure the game objects used directly by the player.
     */
    createPlayer() {
        // Seek the boat starting point on the map and instantiate player at that point.
        this.map.findObject(MapDictionary.LAYER.PLAYER, (boatStart) => {
            this.playerBoat = new PlayerBoat(this, boatStart.x, boatStart.y);
        })
    }

    /**
     * Register gameObjects/groups of gameObjects for collisions with one another.
     */
    createCollisions() {
        // Player boat and land layer, blocked layer collide.
        this.physics.add.collider(this.playerBoat, [this.landLayer, this.blockedLayer]);
    }

    /**
     * Create the controls which will take inputs from the player.
     */
    createControls() {
        // Up, Down, Left, Right, Space
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    /**
     * Set the camera to follow around the ship.  Set the default level of zoom.
     */
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

