import { Input, Component, Injectable } from '@angular/core';

import { IEntity } from './interfaces/entity';
import { IPlanetOptions } from './interfaces/planet-options';
import { ConfigurationService } from './services/configuration';
import { RGBColor } from './rgb-color';

/**
 * A single planet object
 */
@Injectable()
export class Planet implements IEntity {
    private degree: number = 0;
    private elapsed: number = 0;
    private currentRotation: number = 0;
    private _rotation: number;
    private _period: number;
    private _radius: number;
    private _majorAxis: number = 1;
    private _eccentricity: number = 0;

    name: string;

    radiusScale: string;

    isStar: boolean;

    color: RGBColor;
    parent: IEntity;

    rA: number = 1;
    rB: number = 1;

    constructor( options:IPlanetOptions, public configuration: ConfigurationService ) {
        this.name = options.name;
        this.period = options.period;
        this.rotation = options.rotation;
        this.color = options.color;
        this.eccentricity = options.eccentricity;
        this.parent = options.parent;
        this.majorAxis = options.majorAxis;
        this.radius = options.radius;

        // I am knowingly using a flag isntead of polymorphism because the
        // radius scale factor is literally the only difference for now
        this.isStar = options.isStar || false;
        this.radiusScale =
            ( ( this.isStar ) ? 'solarScale' : 'planetaryScale' );
    }

    /**
     * Update the planet's position and rotation
     */
    update( delta ) {
        this.elapsed += delta;

        if ( this.rotation && this.rotation !== 0 ) {
            this.currentRotation = ( this.currentRotation + ( ( delta * this.configuration.timeScale ) / this.rotation ) ) % 360;
        } else {
            this.currentRotation = 0;
        }

        if ( this.period !== 0 ) {
            this.degree = ( this.degree + ( ( delta * this.configuration.timeScale  ) / this.period ) ) % 360;
        }
    }

    get xPos() {
        return this.rA * Math.cos( Math.PI * this.degree / 180 ) + this.parent.xPos;
    }

    get yPos() {
        return this.rB * Math.sin( Math.PI * this.degree / 180 ) + this.parent.yPos;
    }

    get sideRotationOne() {
        return this.currentRotation / 360 * 100;
    }

    get sideRotationTwo() {
        return 100 - this.sideRotationOne;
    }

    get maxWidth() {
        return ( this.rA * 2 ) + ( this.radius * 2 * this.configuration.planetaryScale );
    }

    get maxHeight() {
        return ( this.rB * 2 ) + ( this.radius * 2 * this.configuration.planetaryScale );
    }

    validate( value ) {
        return ( value > 0 ) ? value : 0.00001
    }

    set rotation( value ) {
        this._rotation = this.validate( value );
    }

    get rotation() {
        return this._rotation;
    }

    set period( value ) {
        this._period = this.validate( value );
    }

    get period() {
        return this._period;
    }

    set radius( value ) {
        this._radius = this.validate( value );
    }

    get radius() {
        return this._radius;
    }

    set majorAxis( value ) {
        this._majorAxis = ( value >= 0 ) ? value : 0;

        this.rA = this._majorAxis * ( 1 + this._eccentricity );
        this.rB = this._majorAxis * ( 1 - this._eccentricity );
    }

    get majorAxis() {
        return this._majorAxis;
    }

    set eccentricity( value:number ) {
        console.log( typeof value );
        this._eccentricity = ( value >= 0 && value < 1 ) ? value : 0;

        this.rA = this._majorAxis * ( 1 + this._eccentricity );
        this.rB = this._majorAxis * ( 1 - this._eccentricity );
    }

    get eccentricity() {
        return this._eccentricity;
    }
}
