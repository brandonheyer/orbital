import { Input, Component } from '@angular/core';

import { ConfigurationService } from '../services/configuration';

import { Planet } from '../planet';


/**
 * A component to display the oribatal path of a planet
 */
@Component( {
    selector: 'g.orbit',
    templateUrl: 'templates/orbit.html'
} )

export class OrbitComponent {
    @Input()
    planet: Planet;

    constructor( public configuration: ConfigurationService ) { }
}
