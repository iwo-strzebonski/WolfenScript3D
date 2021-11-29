/* eslint-disable require-jsdoc */
import WebGLCore from '../../lib/WebGLCore'
import HTMLItem from '../HTMLItem'

export default class Game extends HTMLItem {
    private webglCore: WebGLCore

    constructor(container: HTMLElement) {
        super(container, 'canvas', null, 'game')
        const canvas = <HTMLCanvasElement>this.dom
        canvas.width = 960
        canvas.height = 600

        this.webglCore = new WebGLCore(canvas.getContext('webgl')!)
    }

    public render(): void {
        super.render()
    }

    public update(): void {
        super.update()
        this.webglCore.update()
    }
}
