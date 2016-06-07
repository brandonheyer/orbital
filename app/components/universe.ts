import { Component, OnInit } from '@angular/core';

import { IEntity } from '../interfaces/entity';

import { PlanetComponent } from './planet';
import { OrbitComponent } from './orbit';

import { ConfigurationService } from '../services/configuration';
import { PlanetService } from '../services/planet';

import { Planet } from '../planet';

/**
 * A component representing the "known" universe
 *
 * Currently this is only a host star -- the "sun" -- and any
 * number of orbiting bodies (and recursively, any of their orbiting bodies)
 */
@Component( {
    selector: 'universe',
    templateUrl: 'templates/universe.html',
    directives: [ PlanetComponent, OrbitComponent ]
} )

export class UniverseComponent implements IEntity, OnInit {
    sun: Planet;
    planets: Planet[] = [];

    constructor(
        public configuration: ConfigurationService,
        public planetService: PlanetService
    ) {
        configuration.solarSystemCallback = () => { this.loadSolarSystem(); };
        configuration.randomPlanetCallback = () => { this.loadRandomPlanet(); };
    }

    /**
     * Load the solar system by default
     */
    ngOnInit() {
        this.loadSolarSystem();
    }

    /**
     * Load a random planet
     */
    loadRandomPlanet() {
        this.getHostStar().then( () => {
            return this.getRandomPlanet();
        } ).then( () => {
            this.render()
        } );
    }

    /**
     * Load the solar system
     */
    loadSolarSystem() {
        this.getHostStar().then( () => {
            return this.getPlanets();
        } ).then( () => {
            this.render()
        } );
    }

    /**
     * Get the host star / sun
     *
     * Failure here will just render an empty universe
     */
    getHostStar() {
        return this.planetService.getHostStar( this ).then( ( sun ) => {
            this.sun = sun;
        } ).catch( () => {
            this.render();
        } );
    }

    /**
     * Get a random planet
     *
     * Failure here will just render the host star / sun
     */
    getRandomPlanet() {
        return this.planetService.getRandomPlanet( this.sun ).then(
            ( planes ) => { }
        ).catch( () => {
            this.render();
        } );
    }

    /**
     * Get all of the solar system's planets
     *
     * Failure here will just render the host star / sun
     */
    getPlanets() {
        return this.planetService.getPlanets( this.sun ).then(
            ( planets ) => { }
        ).catch( () => {
            this.render();
        } );
    }

    /**
     * Render the initial system and start the animation
     */
    render() {
        var maxWidth = this.sun.radius * 2;;

        // Locate the largest major-axis orbital diameter
        this.planetService.planets.forEach( ( planet ) => {
            maxWidth = Math.max( maxWidth, planet.maxWidth );
        } );

        // Add in the major-axis diameter for the host star in case
        // it happens to be moving and scale by 5% for some padding
        maxWidth = ( maxWidth + ( this.sun.rA * 2 ) ) * 1.05 ;

        // Display universe at appropriate size
        this.resize();

        // Store the world dimensions to properly scale
        this.configuration.world( maxWidth, maxWidth );

        this.configuration.startAnimation( ( delta ) => {
            this.update( delta );
        } );
    }

    /**
     * Update the positions of the stellar bodies
     * @param  {number} delta   - time since last tick
     */
    update( delta ) {
        this.sun.update( delta );
        this.planetService.update( delta );
    }

    /**
     * Update the screen size in configuration to enable proper scaling
     *
     * There is some wierd issue with sizing and the media query, where there
     * is a slight stutter around 920 to 960px wide. I think it's a play off the
     * height of the window finally trumping, but I'd rather get this to you guys
     * then waste time polishing that little bit, sorry!
     */
    resize() {
        var rect = document.getElementById( 'container' ).getBoundingClientRect(),
            size = Math.min( rect.width * ( ( rect.width < 870 ) ? 1 : 0.6 ), rect.height );

        this.configuration.screen( size, size );
    }

    /**
     * Screen resize event handler
     */
    onResize() {
        this.resize();
    }

    /**
     * Return center x-point of universe
     */
    get xPos() {
        return this.configuration.worldWidth / 2;
    }

    /**
     * Return center y-point of universe
     */
    get yPos() {
        return this.configuration.worldHeight / 2;
    }
}
