/* eslint-disable require-jsdoc */
import Config from '../Config'

export default class Hitscan {
    private static rand(): number {
        return Math.floor(Math.random() * 256)
    }

    private static enemyHit(
        dist: number,
        isVisible: boolean
    ): boolean {
        return (
            this.rand() < (
                // hitchance
                (Config.game.isRunning ? 160 : 256) -
                (dist * (isVisible ? 16 : 8))
            )
        )
    }

    public static enemyDamage(
        dist: number,
        isVisible: boolean
    ): number {
        if (this.enemyHit(dist, isVisible)) {
            if (dist < 2) {
                return this.rand() >> 2
            } else if (dist < 4) {
                return this.rand() >> 3
            }

            return this.rand() >> 4
        }

        return 0
    }

    public static playerDamage(
        dist: number
    ): number {
        if (dist < 2) {
            return this.rand() >> 2
        } else if ((dist < 4) || (dist < this.rand() / 3 >> 2)) {
            return this.rand() / 3 >> 1
        }
        return 0
    }
}
