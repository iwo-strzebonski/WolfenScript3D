/* eslint-disable require-jsdoc */
import Config from './Config'

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

        case Config.controls.forward:
            Config.game.moveForward = true
            break

        case Config.controls.backward:
            Config.game.moveBackward = true
            break

        case Config.controls.left:
            Config.game.rotateLeft = true
            break

        case Config.controls.right:
            Config.game.rotateRight = true
            break

        case Config.controls.run:
            Config.game.isRunning = true
            break
        }
    }

    private onKeyUp(e: KeyboardEvent): void {
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

        case Config.controls.left:
            Config.game.rotateLeft = false
            break

        case Config.controls.right:
            Config.game.rotateRight = false
            break


        case Config.controls.run:
            Config.game.isRunning = false
            break
        }
    }
}