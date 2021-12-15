/* eslint-disable require-jsdoc */
import Config from '../../Config'
import WebGLRenderer from '../../core/WebGLRenderer'
import HTMLItem from '../HTMLItem'

export default class Game extends HTMLItem {
    private readonly webglRenderer: WebGLRenderer

    constructor(container: HTMLElement) {
        super(container, 'canvas', 'game')
        const canvas = <HTMLCanvasElement>this.dom
        canvas.width = Config.engine.canvasWidth
        canvas.height = Config.engine.canvasHeight

        this.webglRenderer = new WebGLRenderer(canvas.getContext('webgl2')!)
    }

    public render(): void {
        super.render()
    }

    public update(): void {
        super.update()
        this.webglRenderer.update()
    }
}
