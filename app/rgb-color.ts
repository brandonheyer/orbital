export class RGBColor {
    constructor( public r: number = 0, public g: number = 0, public b: number = 0 ) {

    }

    lighten( val: number ) {
        var r = Math.min( this.r + val, 255 ),
            g = Math.min( this.g + val, 255 ),
            b = Math.min( this.b + val, 255 );

        return new RGBColor( r, g, b );
    }

    darken( val: number ) {
        var r = Math.max( this.r - val, 0 ),
            g = Math.max( this.g - val, 0 ),
            b = Math.max( this.b - val, 0 );

        return new RGBColor( r, g, b );
    }

    toCSS() {
        return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
    }
}
