/* eslint-disable require-jsdoc */
import HTMLItem from '../HTMLItem'
import Cube from './Cube'

export default class Game extends HTMLItem {
    private cube: Cube
    constructor(container: HTMLDivElement) {
        super(container, 'canvas', null, 'game')
        this.cube = new Cube(
            (<HTMLCanvasElement>this.dom).getContext('webgl')
        )
    }

    public render(): void {
        super.render()
    }
}
