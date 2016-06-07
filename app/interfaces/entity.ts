/**
 * Interface which describes an animated entity
 */
export interface IEntity {
    xPos: number;
    yPos: number;

    update( delta:number );
}
