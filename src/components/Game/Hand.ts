/* eslint-disable require-jsdoc */
import AudioController from '../../core/audio/AudioController'
import Config from '../../Config'
import HTMLItem from '../HTMLItem'
import SpriteLoader from './SpriteLoader'

// Track 46 - Knife
// Track 06 - Pistol 
// Track 04 - Machine Gun
// Track 10 - Chain Gun

export default class Hand extends HTMLItem {
    private readonly audioController: AudioController
    private readonly img: HTMLImageElement
    private readonly ctx: CanvasRenderingContext2D
    private then = 0

    constructor(container: HTMLElement) {
        super(container, 'canvas', 'hand')
        this.img = SpriteLoader.getSprite(0)
        this.audioController = new AudioController()
        this.state = 0

        const canvas = (<HTMLCanvasElement>this.dom)
        canvas.width = 512
        canvas.height = 512

        this.ctx = canvas.getContext('2d')!
        this.ctx.imageSmoothingEnabled = false
    }

    public render(): void {
        super.render()

        this.img.onload = () => {
            this.ctx.drawImage(
                this.img,
                0, 64,
                63, 63,
                0, 0,
                512, 512
            )
        }
    }

    public update(): void {
        super.update()
        let interval: number = Config.engine.interval / 2

        switch (Config.game.weapon) {
        case 0:
            interval /= 1
            break

        case 1:
            interval /= 2
            break

        case 2:
            interval /= 1.375
            break

        case 3:
            interval /= 1.5
            break
        }

        if (Config.game.fire) {
            if (!Config.game.ammo) {
                Config.game.weapon = 0
            }

            if (this.then === 0) {
                Config.game.ammo -= + (Config.game.weapon === 1)
                this.then = Date.now()

                switch (Config.game.weapon) {
                case 0:
                    this.audioController.play(46)
                    break

                case 1:
                    this.audioController.play(6)
                    break

                case 2:
                    this.audioController.play(4)
                    break

                case 3:
                    this.audioController.play(10)
                    break
                }
            }

            if (Date.now() - this.then > interval * 10) {
                this.then = Date.now()

                if (this.state < 4) {
                    this.state++

                    if (
                        Config.game.weapon > 1 &&
                        this.state === 4 &&
                        !Config.game.fireUp
                    ) {
                        this.state = 1
                        if (Config.game.weapon === 2) {
                            this.audioController.play(4)
                        } else {
                            this.audioController.play(10)
                        }

                        Config.game.ammo--

                        if (!Config.game.ammo) this.audioController.play(46)
                    }
                } else {
                    this.state = 0
                    this.then = 0
                    Config.game.fire = 
                        (Config.game.weapon > 1) && (!Config.game.fireUp)
                    Config.game.fireable = Config.game.fireUp
                }
            }
        }

        this.ctx.clearRect(0, 0, 512, 512)

        this.ctx.drawImage(
            this.img,
            64 * this.state,
            64 * Config.game.weapon,
            63, 63,
            0, 0,
            512, 512
        )
    }
}
