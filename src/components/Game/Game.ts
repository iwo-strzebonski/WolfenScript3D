/* eslint-disable require-jsdoc */
import HTMLItem from '../HTMLItem'
import WebGL from '../../api/WebGL'

export default class Game extends HTMLItem {
    private webgl: WebGL
    private gl: WebGLRenderingContext
    // private cube: Cube

    constructor(container: HTMLElement) {
        super(container, 'canvas', null, 'game')
        const canvas = <HTMLCanvasElement>this.dom
        canvas.width = 960
        canvas.height = 600
        
        this.gl = canvas.getContext('webgl')!

        this.webgl = new WebGL(this.gl)
    }

    public render(): void {
        super.render()
        this.webgl.render()
    }

    public update(): void {
        super.update()
        this.webgl.update()
    }
}
