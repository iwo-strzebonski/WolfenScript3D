/* eslint-disable require-jsdoc */
import {
    getMatrixPos,
    translate,
    translation,
    yRotate,
} from '../lib/mat4GL'
import { vec3, mat4 } from '../@types/mat4GL'

import { calculateTranslation } from '../lib/WebGLHelpers' 

import Primitive from './primitives/Primitive'
import Config from '../Config'

export default class WebGlColliders {
    public colliders: Array<Primitive>

    constructor(colliders: Array<Primitive>) {
        this.colliders = colliders
    }

    public rotatePlayer(
        cameraMatrix: mat4,
        cameraRotationY: number
    ): [mat4, number] {
        const trnsl: vec3 = calculateTranslation()
        cameraRotationY += trnsl[2]

        cameraMatrix = yRotate(
            cameraMatrix,
            trnsl[2]
        )

        if (cameraRotationY > 2 * Math.PI) {
            cameraRotationY -= 2 * Math.PI
        } else if (cameraRotationY < 0) {
            cameraRotationY += 2 * Math.PI
        }

        return [cameraMatrix, cameraRotationY]
    }

    private movePlayer(cameraMatrix: mat4): mat4 {
        const trnsl: vec3 = calculateTranslation()
        return translate(
            cameraMatrix,
            [trnsl[0], 0, trnsl[1]]
        )
    }

    public collidePlayer(cameraMatrix: mat4, cameraRotationY: number): mat4 {
        let matrix = this.movePlayer(cameraMatrix)
        const pos = getMatrixPos(matrix)

        if (!Config.game.noClip) {
            for (const collider of this.colliders) {
                if (
                    pos[0] >= collider.pos[0] &&
                    pos[0] <= collider.pos[0] + 2
                ) {
                    if (
                        pos[2] < collider.pos[2] &&
                        pos[2] > collider.pos[2] - 3.35
                    ) {
                        pos[2] = collider.pos[2] - 3.35
                    } else if (
                        pos[2] > collider.pos[2] &&
                        pos[2] < collider.pos[2] + 1.35
                    ) {
                        pos[2] = collider.pos[2] + 1.35
                    }
                } else if (
                    pos[2] >= collider.pos[2] - 2 &&
                    pos[2] <= collider.pos[2]
                ) {
                    if (
                        pos[0] < collider.pos[0] &&
                        pos[0] > collider.pos[0] - 1.35
                    ) {
                        pos[0] = collider.pos[0] - 1.35
                    } else if (
                        pos[0] > collider.pos[0] &&
                        pos[0] < collider.pos[0] + 3.35
                    ) {
                        pos[0] = collider.pos[0] + 3.35
                    }
                }
            }

            matrix = translation(
                pos
            )

            matrix = yRotate(
                matrix,
                cameraRotationY
            )
        }

        return matrix
    }
}
