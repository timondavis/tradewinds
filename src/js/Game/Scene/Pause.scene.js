import SceneDictionary from '../Util/Scene.dictionary';
export default class LoadingScene extends Phaser.Scene {

    constructor(config) {
        super(config);
    }

    create() {

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.cursors.space.isDown) {
            this.scene.resume(SceneDictionary.SEA);
            this.scene.stop();
        }
    }

}