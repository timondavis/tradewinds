export default class DebugScene extends Phaser.Scene {

    constructor(config) {
        super(config);
    }

    create() {
        this.bearing = this.add.text(12, 12, 'Bearing: 0', {
            fontSize:'32px',
            fill: '#fff'
        });

        this.velocity = this.add.text(12, 37, 'Velocity: 0', {
            fontSize:'32px',
            fill: '#fff'
        });

        this.windDirection = this.add.text(12, 62, 'Wind Direction: 0', {
            fontSize:'32px',
            fill: '#fff'
        });

        this.adjustedBearing = this.add.text(12, 87, 'Adjusted Bearing: 0', {
            fontSize:'32px',
            fill: '#fff'
        });
        this.adjustedWindDirection = this.add.text(12, 112, 'Adjusted Wind Direction: 0', {
            fontSize:'32px',
            fill: '#fff'
        });
        this.minWindCone = this.add.text(12, 137, 'Min Wind Cone: 0', {
            fontSize:'32px',
            fill: '#fff'
        });
        this.maxWindCone = this.add.text(12, 162, 'Max Wind Cone: 0', {
            fontSize:'32px',
            fill: '#fff'
        });
        this.windCaughtPct = this.add.text(12, 187, 'Wind Caught %: 0', {
            fontSize:'32px',
            fill: '#fff'
        })
    }
}