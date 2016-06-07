import { Input, Component } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ConfigurationService } from '../services/configuration';
import { PlanetService } from '../services/planet';

import { PlanetConfigComponent } from './planet.configuration';
import { Planet } from '../planet';

/**
 * Component to display general configruation and control elements
 */
@Component( {
    selector: 'configuration',
    templateUrl: 'templates/configuration.html',
    directives: [ PlanetConfigComponent ]
} )

export class ConfigurationComponent {
    @Input()
    planets: Planet[];

    planetSub: Subscription;

    constructor( public configuration:ConfigurationService, public planetService:PlanetService ) {
        this.planetSub = planetService.receivedPlanets$.subscribe( ( planets ) => {
            this.planets = planets;
        } );
    }

    /**
     * Click handler to load a random planet
     */
    loadRandom() {
        this.configuration.randomPlanetCallback();
    }

    /**
     * Click handler to load the solar system
     */
    loadAll() {
        this.configuration.solarSystemCallback();
    }

    /**
     * Click handler to toggle animation
     */
    toggleAnimation() {
        this.configuration.toggleAnimation();
    }
}
