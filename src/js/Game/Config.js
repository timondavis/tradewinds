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
            debug: true
        },
    },
    boatSpeed : 1,
    scaleX: 2,
    scaleY: 1,
    wind: {
        msBetweenWindUpdate: 2500,

        // Intensity Scale
        defaultIntensityRange: 0.50, // Max wind strength when initializing

        // Min/Max wind intensity
        intensityMin: 0.001,
        intensityMax: 1,

        // Wind Direction and Intensity Behaviors.  Angles Must be multiplied by PI when consumed
        angleDeltaMax: 0.3,
        intensityDeltaMax: 0.1,

        // Wind arc interaction metadata
        arcOfInfluence: 1.5,  // Must be multiplied by Math.PI

        // The point between the extremes in the arc of influence where contact is at 100%.
        // 0 Is natural default.
        windDirectionZero: 0
    },

    geom: {

        // Arc measurements must be multiplied by PI in program
        arcMin: 0.001,  // Smallest possible angle on the unit circle
        arcMax: 2,      // Greatest possible angle on the unit circle
    }

}