export default {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    backgroundColor: 'dfdfdf',
    roundPixels: true,
    physics : {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        },
    }
}