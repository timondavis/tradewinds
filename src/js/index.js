import '../style/style.scss';
import 'phaser';
import config from './Game/Config';

import SceneDictionary from './Game/Util/Scene.dictionary';

import LoadingScene from './Game/Scene/Loading.scene';
import SeaScene from './Game/Scene/Sea.scene';
import PauseScene from './Game/Scene/Pause.scene';
import DebugScene from './Game/Scene/Debug.scene';

class Game extends Phaser.Game {

    constructor(config) {
        super(config);
        this.scene.add(SceneDictionary.LOADING, LoadingScene);
        this.scene.add(SceneDictionary.SEA, SeaScene);
        this.scene.add(SceneDictionary.PAUSED, PauseScene);
        this.scene.add(SceneDictionary.DEBUG, DebugScene);
        this.scene.start(SceneDictionary.LOADING);
    }
}


let game = new Game(config);



