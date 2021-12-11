/* eslint-disable require-jsdoc */
import Config from '../Config'

import { perspective } from './mat4GL'
import { trslnData, mat4 } from '../@types/mat4GL'

const fov = Math.PI / 3
const aspect = Config.engine.canvasWidth / Config.engine.canvasHeight
const zNear = 1
const zFar = 100

export const calculateTranslation = (): trslnData => {
    const xTranslation = 
        Config.game.strafeLeft || Config.game.strafeRight
            ? (
                + Config.game.strafeRight -
                + Config.game.strafeLeft
            ) * (0.15 + (+ Config.game.isRunning) * 0.15)
            : 0

    const zTranslation = 
        Config.game.moveForward || Config.game.moveBackward
            ? (
                + Config.game.moveBackward -
                + Config.game.moveForward
            ) * (0.15 + (+ Config.game.isRunning) * 0.15)
            : 0

    const yRotation = 
        Config.game.rotateLeft || Config.game.rotateRight
            ? (
                + Config.game.rotateLeft -
                + Config.game.rotateRight
            ) * Math.PI / 72 * (1 + (+ Config.game.isRunning) * 1)
            : 0

    return [xTranslation, zTranslation, yRotation]
}

export const createProjectionMatrix = (): mat4 => {
    return perspective(
        fov, aspect, zNear, zFar
    )
}
