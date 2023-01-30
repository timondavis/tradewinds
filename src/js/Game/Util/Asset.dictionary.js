export default {

    SPRITESHEET: {
        ISLAND_TILES: 'island-tiles2.png',
        BOAT_ATLAS: 'boatatlas.png',
        SPRITE_ATLAS: 'tradewinds.png',
    },
    MAP: {
        LEVEL_1: 'demo-1.json',
    },
    ATLAS_NAME: {
        BOAT_ATLAS: 'boatatlas',
        SPRITE_ATLAS: 'tradewinds'
    },
    ATLAS: {
        SLOOP: {
            FULL_SAIL:   'schooner/full/',
            HALF_SAIL:   'schooner/half/',
            RAISED_SAIL: 'schooner/raised/',
        },
        TOP_DOWN_HERO: "Hero.png",
    },
    PATH: {
        IMAGE: 'asset/image/',
        MAP : 'asset/map/',
        ATLAS: 'asset/atlas/'
    },
    generateAssetPath: (path, filename) => {
        return path + filename;
    }
};
