/* eslint-disable require-jsdoc */
import WebGLRenderer from '../../api/WebGLRenderer'
import HTMLItem from '../HTMLItem'

export default class Game extends HTMLItem {
    private webglRenderer: WebGLRenderer

    constructor(container: HTMLElement) {
        super(container, 'canvas', null, 'game')
        const canvas = <HTMLCanvasElement>this.dom
        canvas.width = 960
        canvas.height = 600

        this.webglRenderer = new WebGLRenderer(canvas.getContext('webgl')!)
    }

    public render(): void {
        super.render()
        // this.webglRenderer.render()
    }

    public update(): void {
        super.update()
        this.webglRenderer.update()
    }
}
