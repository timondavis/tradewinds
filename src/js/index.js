import '../style/style.scss';

let Phaser = require('phaser');
let LoadingScene = require('./Game/Scene/Loading.scene');

let conveyorScene = new LoadingScene('Loading');

console.log(conveyorScene);


let game = new Phaser.Game({
   type: Phaser.AUTO,
   width: 800,
   height: 600,
   scene: [conveyorScene],
   pixelArt: true,
   backgroundColor: '000'
});



