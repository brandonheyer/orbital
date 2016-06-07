import { Injectable } from '@angular/core';

/**
 * The configuration service
 *
 * Acts as storage place for general settings as well as animation controller
 */
@Injectable()
export class ConfigurationService {
    private _zoom: number = 1;
    private _animating: boolean = true;
    private _interval: any;
    private _time: number;

    callback: ( number );

    xScale: number;
    yScale: number;

    centerX: number;
    centerY: number;

    timeScale: number = 2;
    planetaryScale: number = 2500;
    solarScale: number = 1

    screenWidth: number;
    screenHeight: number;
    worldWidth: number;
    worldHeight: number;

    randomPlanetCallback: any;
    solarSystemCallback: any;

    /**
     * Get a scaled radius
     */
    radius( value: number ) {
        return this.xScale * value;
    }

    /**
     * Get a scaled x-value
     */
    x( value: number ) {
        return this.xScale * value - ( ( ( this.screenWidth * this._zoom ) - this.screenWidth ) / 2 );
    }

    /**
     * Get a scaled y-value
     */
    y( value: number ) {
        var height = Math.max( this.screenHeight, this.worldHeight );

        return this.yScale * value - ( ( ( this.screenHeight * this._zoom ) - this.screenHeight ) / 2 );
    }

    /**
     * Update the scales, typically after screen or world dimensions change
     */
    updateScales( zoom:number = 1 ) {
        this.xScale = Math.min( this.screenWidth, this.worldWidth ) / Math.max( this.screenWidth, this.worldWidth ) * zoom;
        this.yScale = Math.min( this.screenHeight, this.worldHeight ) / Math.max( this.screenHeight, this.worldHeight ) * zoom;
    }

    /**
     * Set the world dimensions
     */
    world( width: number, height: number ) {
        this.worldWidth = width;
        this.worldHeight = height;

        this.updateScales();
    }

    /**
     * Set the screen dimensions
     */
    screen( width: number, height: number ) {
        this.screenWidth = width;
        this.screenHeight = height;

        this.updateScales();
    }

    /**
     * Start or stop the animation
     */
    toggleAnimation() {
        this._animating = !this._animating;

        if ( this._animating ) {
            this.startAnimation();
        } else {
            this.stopAnimation();
        }
    }

    isPaused() {
        return !this._animating;
    }

    /**
     * Start the animation
     *
     * @param  {Function}   callback - the function to call for each tick
     */
    startAnimation( callback? ) {
        this.callback = this.callback || callback;

        this._time = +( new Date() );
        this._interval = setInterval( () => {
            this.tick( this.callback );
        }, 0 );
    }

    /**
     * Stop the animation
     */
    stopAnimation() {
        clearInterval( this._interval );
    }

    /**
     * Update the animation by a tick, will update all entities by providing
     * them the number of ms (delta) since the last tick. This allows for
     * consistent movement regardless of framerate
     */
    tick( callback ) {
        var time = +( new Date() ),
            delta = time - this._time;

        // This probably will never happen
        if ( delta === 0 ) { delta = 1; }

        if ( callback ) {
            callback( delta );
        }

        // Update the time
        this._time = time;
    }

    set zoom( value: number ) {
        this._zoom = value;
        this.updateScales( value );
    }

    get zoom() {
        return this._zoom;
    }
}
