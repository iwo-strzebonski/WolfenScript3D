/* eslint-disable require-jsdoc */
import Config from '../Config'

import {
    getMatrixPos,
    translate,
    translation,
    yRotate,
} from './mat4GL'
import { vec3, mat4 } from '../@types/mat4GL'

import { calculateTranslation } from './WebGLHelpers' 

import Cube from './primitives/Cube'
import Plane from './primitives/Plane'
import Primitive from './primitives/Primitive'

export default class WebGlColliders {
    public colliders: Array<Primitive> = []

    constructor() {
        this.colliders.push(new Cube(2))
        this.colliders.push(new Cube(2))
        this.colliders.push(new Cube(2))
        this.colliders.push(new Cube(2))
        this.colliders.push(new Plane(2))
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

    // TODO: coś się popsuło przy kolizjach
    public movePlayer(cameraMatrix: mat4, cameraRotationY: number): mat4 {
        const trnsl: vec3 = calculateTranslation()
        let pos: vec3
        let toRotate = false
        let rot = cameraRotationY

        for (const i in this.colliders) {
            pos = getMatrixPos(cameraMatrix)

            const obj = [
                this.colliders[i].pos[0], 0, this.colliders[i].pos[2]
            ]

            const case1 = (
                ((pos[0] <= obj[0] + 3.5 && pos[0] >= obj[0] + 2) ||
                (pos[0] >= obj[0] - 1.5 && pos[0] <= obj[0])) &&
                ((pos[2] <= obj[2]) && (pos[2] >= obj[2] - 2))
            )

            const case2 = (
                ((pos[2] <= obj[2] + 1.5 && pos[2] >= obj[2]) ||
                (pos[2] >= obj[2] - 3.5) && pos[2] <= obj[2] - 2) &&
                ((pos[0] >= obj[0]) && (pos[0] <= obj[0] + 2))
            )

            if (rot > 0 && rot < Math.PI / 2) {
                rot = (case2 ? Math.PI / 2 : 0) - rot
            } else if (rot > Math.PI / 2 && rot < Math.PI) {
                rot = (case2 ? Math.PI / 2 : Math.PI) - rot
            } else if (rot > Math.PI && rot < 3 / 2 * Math.PI) {
                rot = (case2 ? Math.PI / 2 : 0) + Math.PI - rot
            } else if (rot > 3 / 2 * Math.PI && rot < 2 * Math.PI) {
                rot = (case2 ? 3 * Math.PI / 2 : 0) - rot
            }

            if (case1) {
                if ((pos[0] <= obj[0] + 2) && (pos[0] >= obj[0] - 1.5)) {
                    cameraMatrix = translation([
                        obj[0] - 1.5,
                        -Config.engine.playerHeight,
                        pos[2]
                    ])
                } else if (
                    (pos[0] <= obj[0] + 3.5) && (pos[0] >= obj[0] + 2)
                ) {
                    cameraMatrix = translation([
                        obj[0] + 3.5,
                        -Config.engine.playerHeight,
                        pos[2]
                    ])
                }

                if ((pos[0] >= obj[0] - 1.5) && (pos[0] <= obj[0] + 3.5)) {
                    cameraMatrix = yRotate(
                        cameraMatrix, cameraRotationY
                    )
                }
    
                if ((pos[0] === obj[0] + 3.5) || (pos[2] === obj[0] - 1.5)) {
                    cameraMatrix = yRotate(
                        cameraMatrix,
                        rot
                    )

                    toRotate = true
                }
                break
            } else if (case2) {
                if ((pos[2] >= obj[2] - 2) && (pos[2] <= obj[2] + 1.5)) {
                    cameraMatrix = translation([
                        pos[0],
                        -Config.engine.playerHeight,
                        obj[2] + 1.5
                    ])
    
                    cameraMatrix = yRotate(
                        cameraMatrix, cameraRotationY
                    )
                } else if (
                    (pos[0] >= obj[0] - 3.5) && (pos[0] <= obj[0] - 2)
                ) {
                    cameraMatrix = translation([
                        pos[0],
                        -Config.engine.playerHeight,
                        obj[2] - 3.5,
                    ])
    
                    cameraMatrix = yRotate(
                        cameraMatrix, cameraRotationY
                    )
                }
    
                if ((pos[0] >= obj[0] - 1.5) && (pos[0] <= obj[0] + 3.5)) {
                    cameraMatrix = yRotate(
                        cameraMatrix, cameraRotationY
                    )
                }

                if ((pos[2] === obj[2] + 1.5) || (pos[2] === obj[2] - 3.5)) {
                    cameraMatrix = yRotate(
                        cameraMatrix,
                        rot
                    )

                    toRotate = true
                }
                break
            }
        }

        cameraMatrix = translate(
            cameraMatrix,
            [trnsl[0], 0, trnsl[1]]
        )

        if (toRotate) {
            cameraMatrix = yRotate(
                cameraMatrix,
                rot
            )
        }

        return cameraMatrix
    }
}
