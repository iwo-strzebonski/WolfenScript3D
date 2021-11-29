/* eslint-disable require-jsdoc */
import { 
    perspective
} from './mat4GL'
import { mat4 } from '../@types/mat4GL'

export default class WebGLRenderer {
    public fov = Math.PI / 3
    public aspect: number
    public zNear = 1
    public zFar = 100

    constructor(gl: WebGLRenderingContext) {
        this.aspect = gl.canvas.width / gl.canvas.height
    }

    public createProjectionMatrix(): mat4 {
        return perspective(
            this.fov, this.aspect, this.zNear, this.zFar
        )
    }
}
