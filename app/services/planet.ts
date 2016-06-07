import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Subject } from 'rxjs/Subject'

import 'rxjs/add/operator/toPromise';

import { Planet } from '../planet';
import { IEntity } from '../interfaces/entity';
import { RGBColor } from '../rgb-color';
import { ConfigurationService } from './configuration';

@Injectable()
export class PlanetService {
    private url = 'api/planets';
    private planetSource = new Subject<Planet[]>();

    planets: Planet[];
    receivedPlanets$ = this.planetSource.asObservable();

    private handleError( error: any ) {
        this.planets = [];

        console.error( 'An error occurred', error );
        return Promise.reject( error.message || error );
    }

    constructor( private http: Http, private configuration: ConfigurationService ) { }

    /**
     * Create a planet from a definition
     *
     * @param  {Object} planet - the planet definition
     * @param  {IEntity} parent - the body the planet orbits, theoretically we
     *                            can easily have moons
     */
    createPlanet( planet, parent ) {
        planet.parent = parent;
        planet.color = new RGBColor( planet.color.r, planet.color.g, planet.color.b );

        // Scale down to kM from AU
        planet.majorAxis = planet.majorAxis / 0.00000000668459;

        return new Planet( planet, this.configuration )
    }

    /**
     * Parse the planet response
     */
    parsePlanets( response, parent: IEntity ): Planet[] {
        var planets: Planet[] = [];

        planets = response.data.map( ( planet ) => {
            return this.createPlanet( planet, parent );
        } );

        return planets;
    }

    /**
     * Fetch planets from backend
     */
    getPlanets( parent ): Promise<Planet[]> {
        return this.http.get( this.url )
            .toPromise()
            .then( ( response ) => {
                this.planets = this.parsePlanets( response.json(), parent );

                this.planetSource.next( this.planets );

                return this.planets;
            } )
            .catch( this.handleError );
    }

    /**
     * Fetch a random planet from the backend
     */
    getRandomPlanet( parent ): Promise<Planet[]> {
        return this.http.get( this.url + '/random' )
            .toPromise()
            .then( ( response ) => {
                this.planets = this.parsePlanets( response.json(), parent );

                this.planetSource.next( this.planets );

                return this.planets;
            } )
            .catch( this.handleError );
    }

    /**
     * Get the host star
     */
    getHostStar( parent ): Promise<Planet> {
        return new Promise( ( resolve, reject ) => {
            setTimeout( () => {
                resolve(
                    this.createPlanet( {
                        name: 'Sun',
                        period: 0,
                        rotation: 24.47,
                        radius: 432288,
                        color: new RGBColor( 252, 216, 58 ),
                        majorAxis: 0,
                        eccentricity: 0,
                        isStar: true
                    }, parent )
                );
            } );
        } );
    }

    /**
     * Update the planets
     */
    update( delta: number ) {
        this.planets.forEach( ( planet ) => {
            planet.update( delta );
        } );
    }
}
