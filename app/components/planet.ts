import { Input, Component } from '@angular/core';

import { ConfigurationService } from '../services/configuration';

import { Planet } from '../planet';

/**
 * A component representing the visual display of a planet
 */
@Component( {
    selector: 'g.planet',
    templateUrl: 'templates/planet.html'
} )

export class PlanetComponent {
    @Input()
    planet: Planet;

    constructor( public configuration: ConfigurationService ) { }
}
