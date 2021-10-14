/* eslint-disable require-jsdoc */
import Config from './Config'

export default class Keyboard {
    container: HTMLDivElement

    constructor(container: HTMLDivElement) {
        this.container = container
        document.body.onkeydown = (e) => this.onKeyDown(e)
        document.body.onkeyup = (e) => this.onKeyUp(e)
    }

    private onKeyDown(e: KeyboardEvent): void {
        if (!['Control', 'Shift', 'c'].includes(e.key)) {
            // e.preventDefault()
        }

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
            Config.game.weapon = parseInt(e.key) - 1

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
        }
    }
}
