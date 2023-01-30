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
    },
    scaleX: 2,
    scaleY: 1,
    cameraZoom: 2,
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
    },

    boat: {
        sailHeightMin: 0.001,
        sailHeightMax: 1,

        // If wind % effectiveness is below this rate, boat may be moved at impulse power regardless of wind speed.
        impulseWindEffectivenessThreshold: 0.05,

        // The min height for the sail if the boat is to get impulse power.
        sailHeightMinForImpulsePower: 0.002,

        // The wind effectiveness delivered by impulse power.
        impulseWindEffectiveness: 0.05,

        // Speeds
        stopSpeed: 0,
        turnSpeed: 0.0025, // arc delta in radians, no need to convert
        sailChangeSpeed: 0.01,
        speed: 75
    },

    debugOptions: {
        messageVerticalPadding: 25,
        messageLeftPadding: 12,
        messageTopPadding: 12,
        messageFontSize: "32px",
        messageFillColor: "#fff"
    },

    tileMap: {
        defaultTileWidth: 32,
        defaultTileHeight: 32,
        defaultBackgroundTileFrame: 1,
        defaultTopLeft: { x: 0, y: 0 },
        mapPadding: 250
    },

    player: {
        width: 32,
        height: 32
    }

}