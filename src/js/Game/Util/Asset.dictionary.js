export default {

    SPRITESHEET: {
        ISLAND_TILES: 'island-tiles2.png',
        SPRITE_ATLAS: 'tradewinds.png'
    },
    MAP: {
        LEVEL_1: 'testisland.json',
    },
    ATLAS_NAME: {
        SPRITE_ATLAS: 'tradewinds'
    },
    ATLAS: {
        SLOOP: {
            FULL_SAIL:   'schooner/full/',
            HALF_SAIL:   'schooner/half/',
            RAISED_SAIL: 'schooner/raised/'
        }
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
