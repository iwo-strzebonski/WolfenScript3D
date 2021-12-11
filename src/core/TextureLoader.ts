/* eslint-disable require-jsdoc */

import wall1 from '../img/textures/gray/01.png'
import wall2 from '../img/textures/gray/02.png'

export default class TextureLoader {
    private readonly gl: WebGLRenderingContext
    private readonly textures: any[] = []

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl
    }

    private initTextures(): void {
        'pass'
    }

    public getTexture(color: string): string {
        console.log(color)
        return color
    }

    public loadTextures(): void {
        const texture = this.gl.createTexture()
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture)

        this.gl.texImage2D(
            this.gl.TEXTURE_2D,
            0,
            this.gl.RGBA,
            1, 1,
            0,
            this.gl.RGBA,
            this.gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 0, 255])
        )

        const img = new Image()
        img.crossOrigin = ''
        img.src = wall1
        img.width = 64
        img.height = 64
        img.onload = () => {
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
            this.gl.texImage2D(
                this.gl.TEXTURE_2D,
                0,
                this.gl.RGBA,
                this.gl.RGBA,
                this.gl.UNSIGNED_BYTE,
                img
            )
            this.gl.generateMipmap(this.gl.TEXTURE_2D)
        }
        
        // img.crossOrigin = ''
        img.src = wall2
        // img.width = 64
        // img.height = 64
        // img.onload = () => {
        //     gl.bindTexture(gl.TEXTURE_2D, texture)
        //     gl.texImage2D(
        //         gl.TEXTURE_2D,
        //         0,
        //         gl.RGBA,
        //         gl.RGBA,
        //         gl.UNSIGNED_BYTE,
        //         img
        //     )
        //     gl.generateMipmap(gl.TEXTURE_2D)
        // }
    }
}
