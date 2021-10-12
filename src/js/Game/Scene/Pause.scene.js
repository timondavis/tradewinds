import SceneDictionary from '../Util/Scene.dictionary';

/**
 * @class
 *
 * Temporary scene use to implement the 'pause' screen, and implement pause screen features/feedback.
 */
export default class PauseScene extends Phaser.Scene {

    constructor(config) {
        super(config);
    }

    init() {
        this.lockPauseKey = true;
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.cursors.space.isDown && !this.lockPauseKey) {
            this.scene.resume(SceneDictionary.SEA);
            this.scene.get(SceneDictionary.SEA).unpause();
            this.lockPauseKey = true;
            this.scene.stop();
        }

        if (!this.cursors.space.isDown) {
            this.lockPauseKey = false;
        }
    }

}