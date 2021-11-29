/* eslint-disable require-jsdoc */
import { trslnData } from '../@types/mat4GL'

import Config from '../Config'

export const calculateTranslation = (): trslnData => {
    const xTranslation = 
        Config.game.strafeLeft || Config.game.strafeRight
            ? (
                + Config.game.strafeRight -
                + Config.game.strafeLeft
            ) * (0.1 + (+ Config.game.isRunning) * 0.2)
            : 0

    const zTranslation = 
        Config.game.moveForward || Config.game.moveBackward
            ? (
                + Config.game.moveBackward -
                + Config.game.moveForward
            ) * (0.1 + (+ Config.game.isRunning) * 0.2)
            : 0

    const yRotation = 
        Config.game.rotateLeft || Config.game.rotateRight
            ? (
                + Config.game.rotateLeft -
                + Config.game.rotateRight
            ) * Math.PI / 72 * (1 + +Config.game.isRunning)
            : 0

    return [xTranslation, zTranslation, yRotation]
}
