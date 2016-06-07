import { Component } from '@angular/core';

import { ConfigurationComponent } from './configuration';
import { UniverseComponent } from './universe';

import { ConfigurationService } from '../services/configuration';
import { PlanetService } from '../services/planet';

/**
 * The main application component
 */
@Component( {
    selector: 'orbital',
    templateUrl: './templates/app.html',
    directives: [ UniverseComponent, ConfigurationComponent ],
    providers: [ ConfigurationService, PlanetService ]
} )

export class AppComponent { }
