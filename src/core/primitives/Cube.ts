/* eslint-disable require-jsdoc */
import Primitive from './Primitive'

export default class Cube extends Primitive {
    public secret: boolean
    public readonly color: string

    constructor(size: number, color: string, secret?: boolean) {
        const positions = new Float32Array([
            0, 0, 0,
            0, size, 0,
            size, 0, 0,
            0, size, 0,
            size, size, 0,
            size, 0, 0,
    
            0, 0, size,
            0, size, size,
            size, 0, size,
            0, size, size,
            size, size, size,
            size, 0, size,
    
            0, 0, 0,
            size, 0, 0,
            0, 0, size,
            size, 0, 0,
            size, 0, size,
            0, 0, size,
    
            0, size, 0,
            size, size, 0,
            0, size, size,
            size, size, 0,
            size, size, size,
            0, size, size,
    
            0, 0, 0,
            0, size, 0,
            0, 0, size,
            0, size, 0,
            0, size, size,
            0, 0, size,
    
            size, 0, 0,
            size, size, 0,
            size, 0, size,
            size, size, 0,
            size, size, size,
            size, 0, size
        ])

        super(positions)

        this.color = color
        this.secret = secret || false
    }
}
