import '../style/style.scss';
import 'phaser';
import config from './Game/Config';

import SceneDictionary from './Game/Util/Scene.dictionary';

import LoadingScene from './Game/Scene/Loading.scene';
import SeaScene from './Game/Scene/Sea.scene';

class Game extends Phaser.Game {

    constructor(config) {
        super(config);
        this.scene.add(SceneDictionary.LOADING, LoadingScene);
        this.scene.add(SceneDictionary.SEA, SeaScene);
        this.scene.start(SceneDictionary.LOADING);
    }
}


let game = new Game(config);



