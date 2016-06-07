import { Input, Component } from '@angular/core';

import { Planet } from '../planet';

/**
 * Component to display configuration settings for a single planet
 */
@Component( {
    selector: 'planet-config',
    templateUrl: 'templates/planet.configuration.html'
} )

export class PlanetConfigComponent {
    @Input()
    planet: Planet;

    /**
     * Whether or not the component is active
     * @type {boolean}
     */
    active: boolean = false;

    /**
     * Select handler to hide or show the form items
     */
    onSelect() {
        this.active = !this.active;
    }
};
