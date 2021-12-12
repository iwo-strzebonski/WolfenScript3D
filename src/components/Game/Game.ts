/* eslint-disable require-jsdoc */
import Config from '../../Config'
import WebGLCore from '../../core/WebGLCore'
import HTMLItem from '../HTMLItem'

export default class Game extends HTMLItem {
    private readonly webglCore: WebGLCore

    constructor(container: HTMLElement) {
        super(container, 'canvas', 'game')
        const canvas = <HTMLCanvasElement>this.dom
        canvas.width = Config.engine.canvasWidth
        canvas.height = Config.engine.canvasHeight

        this.webglCore = new WebGLCore(canvas.getContext('webgl2')!)
    }

    public render(): void {
        super.render()
    }

    public update(): void {
        super.update()
        this.webglCore.update()
    }
}
