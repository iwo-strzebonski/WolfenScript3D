/* eslint-disable require-jsdoc */
import Config from '../Config'

export default class Keyboard {
    container: HTMLElement

    constructor(container: HTMLElement) {
        this.container = container
        document.body.onkeydown = (e) => this.onKeyDown(e)
        document.body.onkeyup = (e) => this.onKeyUp(e)
    }

    private onKeyDown(e: KeyboardEvent): void {
        e.preventDefault()

        switch (e.key) {
        case Config.controls.noClip:
            Config.game.noClip = !Config.game.noClip
            break

        case Config.controls.fire:
            if (Config.game.started) {
                Config.game.fireUp = false

                if (Config.game.weapon > 1) {
                    Config.game.fireable = true
                }

                if (Config.game.fireable) {
                    Config.game.fire = true

                    if (!Config.game.ammo) {
                        Config.game.weapon = 0
                    }
                }
            }
            break

        case '1':
        case '2':
        case '3':
        case '4':
            Config.game.fire = false
            Config.game.weapon = parseInt(e.key) - 1 <= Config.game.bestWeapon
                ? parseInt(e.key) - 1
                : Config.game.weapon
            break

        case 'r':
            location.reload()
            break

        case Config.controls.forward:
            Config.game.moveForward = true
            break

        case Config.controls.backward:
            Config.game.moveBackward = true
            break

        case Config.controls.strafeLeft:
            Config.game.strafeLeft = true
            break

        case Config.controls.strafeRight:
            Config.game.strafeRight = true
            break

        case Config.controls.strafe:
            Config.game.strafe = true
            if (Config.game.rotateLeft) {
                Config.game.strafeLeft = true
                Config.game.rotateLeft = false
            }

            if (Config.game.rotateRight) {
                Config.game.strafeRight = true
                Config.game.rotateRight = false
            }
            break

        case Config.controls.rotateLeft:
            if (Config.game.strafe) Config.game.strafeLeft = true
            else Config.game.rotateLeft = true
            break

        case Config.controls.rotateRight:
            if (Config.game.strafe) Config.game.strafeRight = true
            else Config.game.rotateRight = true
            break

        case Config.controls.run:
            Config.game.isRunning = true
            break
        }
    }

    private onKeyUp(e: KeyboardEvent): void {
        e.preventDefault()

        switch (e.key) {
        case Config.controls.fire:
            if (Config.game.started) {
                Config.game.fireable = true
                Config.game.fireUp = true
            }
            break
            
        case Config.controls.forward:
            Config.game.moveForward = false
            break

        case Config.controls.backward:
            Config.game.moveBackward = false
            break

        case Config.controls.strafeLeft:
            Config.game.strafeLeft = false
            break
    
        case Config.controls.strafeRight:
            Config.game.strafeRight = false
            break

        case Config.controls.strafe:
            Config.game.strafe = false
            Config.game.strafeLeft = false
            Config.game.strafeRight = false
            break

        case Config.controls.rotateLeft:
            Config.game.rotateLeft = false
            if (Config.game.strafeLeft) Config.game.strafeLeft = false
            break

        case Config.controls.rotateRight:
            Config.game.rotateRight = false
            if (Config.game.strafeRight) Config.game.strafeRight = false
            break

        case Config.controls.run:
            Config.game.isRunning = false
            break
        }
    }
}
