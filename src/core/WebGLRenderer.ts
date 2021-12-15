/* eslint-disable require-jsdoc */
import Config from '../Config'
import {
    inverse,
    multiply,
    translation,
    translate,
    yRotate,
    getMatrixPos
} from '../lib/mat4GL'

import MapLoader from './MapLoader'
import WebGlColliders from './WebGLColliders'
import Plane from './primitives/Plane'
import Gate from './objects/Gate'

import WebGLCore from '../lib/WebGLCore'
import { createProjectionMatrix } from '../lib/WebGLHelpers'

import { mat4 } from '../@types/mat4GL'

export default class WebGLRenderer extends WebGLCore {
    private mapLoader = new MapLoader(Config.game.map)
    private webGLColliders = new WebGlColliders(this.mapLoader.map)

    private cameraRotationY = this.mapLoader.playerStartingRot
    private cameraMatrix = yRotate(
        translation(this.mapLoader.playerStartingPos),
        this.cameraRotationY
    )

    constructor(gl: WebGL2RenderingContext) {
        super(gl)
    }

    public render(viewProjectionMatrix: mat4): void {
        const playerPos = getMatrixPos(this.cameraMatrix)

        for (const i in this.mapLoader.map) {
            if (
                Math.sqrt(
                    (playerPos[0] - this.mapLoader.map[i].pos[0]) ** 2 +
                    (playerPos[2] - this.mapLoader.map[i].pos[2]) ** 2
                ) <= Config.engine.viewRange * Config.engine.tileSize
            ) {
                const points =
                this.mapLoader.map[i].getConstructionPoints
                const offset = 0
                const count = points.length / 3

                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)
                this.setGeometry(
                    this.mapLoader.map[i].getConstructionPoints
                )

                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer)
                this.setTexcoords(count / 6)

                let matrix = translate(
                    viewProjectionMatrix,
                    this.mapLoader.map[i].pos
                )

                if (
                    this.mapLoader.map[i] instanceof Plane &&
                    !(this.mapLoader.map[i] instanceof Gate)
                ) {
                    if ((<Plane>this.mapLoader.map[i]).rotate) {
                        matrix = translate(
                            matrix,
                            [Config.engine.tileSize / 2, 0, 0]
                        )

                        matrix = yRotate(
                            matrix, Math.PI / 2
                        )
                    } else {
                        matrix = translate(
                            matrix,
                            [0, 0, -Config.engine.tileSize / 2]
                        )
                    }
                } else if (
                    (this.mapLoader.map[i] instanceof Gate)
                ) {
                    if ((<Gate>this.mapLoader.map[i]).mode === 0) {
                        if ((<Plane>this.mapLoader.map[i]).rotate) {
                            matrix = translate(
                                matrix,
                                [Config.engine.tileSize / 2, 0, 0]
                            )
        
                            matrix = yRotate(
                                matrix, Math.PI / 2
                            )
                        } else {
                            matrix = translate(
                                matrix,
                                [0, 0, -Config.engine.tileSize / 2]
                            )
                        }
                    } else {
                        if ((<Plane>this.mapLoader.map[i]).rotate) {
                            matrix = translate(
                                matrix,
                                [(
                                    (<Gate>this.mapLoader.map[i]).mode === 1
                                        ? Config.engine.tileSize
                                        : 0
                                ),
                                0,
                                0
                                ]
                            )
        
                            matrix = yRotate(
                                matrix, Math.PI / 2
                            )
                        } else {
                            matrix = translate(
                                matrix,
                                [
                                    0,
                                    0,
                                    ((<Gate>this.mapLoader.map[i]).mode === 1
                                        ? -Config.engine.tileSize
                                        : 0
                                    )
                                ]
                            )
                        }
                    } 
                }

                this.gl.uniformMatrix4fv(this.matrixLocation, false, matrix)
                this.gl.uniform1i(this.textureLocation, 0)
                this.gl.drawArrays(this.gl.TRIANGLES, offset, count)
            }
        }
    }

    public update(): void {
        this.updateWebGL()

        const projectionMatrix = createProjectionMatrix()
        const viewMatrix = inverse(this.cameraMatrix)

        const viewProjectionMatrix = multiply(
            projectionMatrix, viewMatrix
        )

        this.render(viewProjectionMatrix)

        this.cameraMatrix = this.webGLColliders.collidePlayer(
            this.cameraMatrix,
            this.cameraRotationY
        )

        const temp = this.webGLColliders.rotatePlayer(
            this.cameraMatrix, this.cameraRotationY
        )

        this.cameraMatrix = temp[0]
        this.cameraRotationY = temp[1]
    }
}
