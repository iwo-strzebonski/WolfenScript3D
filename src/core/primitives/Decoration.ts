/* eslint-disable require-jsdoc */
import Plane from './Plane'

export default class Decoration extends Plane {
    public readonly isCollider: boolean

    constructor(size: number, isCollider: boolean, rotate?: boolean) {
        super(size, rotate || false)
        this.isCollider = isCollider
    }
}
