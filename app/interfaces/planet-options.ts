import { RGBColor } from '../rgb-color';
import { IEntity } from './entity';

/**
 * Interface describing a planet's options
 */
export interface IPlanetOptions {
    name: string;

    period: number;
    rotation: number;
    radius: number;
    majorAxis: number;
    eccentricity: number;

    color: RGBColor;
    parent: IEntity;

    isStar?: boolean;
}
