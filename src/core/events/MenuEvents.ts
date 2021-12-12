/* eslint-disable require-jsdoc */
import Config from '../../Config'

export const menuEvents = {
    start: (): void => {
        Config.game.started = true
        Config.menu.menuActive = false
    },

    close: (): void => {
        window.open('', '_self', '')!.window.close()
        // window.close()
    },

    events: (key: string): void => {
        const keys = Object.keys(Config.menu.selectable)

        switch (key) {
        case 'Enter':
            menuEvents[keys[Config.menu.selectedOption]]()

            break

        case 'ArrowUp':
            Config.menu.selectedOption--

            if (Config.menu.selectedOption < 0) {
                Config.menu.selectedOption = 7
            }
            
            while (!Config.menu.selectable[
                keys[Config.menu.selectedOption]
            ]) {
                Config.menu.selectedOption--
            }

            break

        case 'ArrowDown':
            Config.menu.selectedOption++

            if (Config.menu.selectedOption > 7) {
                Config.menu.selectedOption = 0
            }

            while (!Config.menu.selectable[
                keys[Config.menu.selectedOption]
            ]) {
                Config.menu.selectedOption++
            }

            break
        }
    }
}
