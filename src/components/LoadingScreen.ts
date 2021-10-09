/* eslint-disable require-jsdoc */
import logo from '../img/wolfenstein3d-logo.png'
import pc13 from '../img/pc13.png'
import sound from './music/01 - Horst-Wessel-Lied.mp3'

export default class Loading {
    private container: HTMLDivElement
    private dom: HTMLDivElement
    private audio: HTMLAudioElement //TODO: Add Sound class
    
    public pressedNo: number

    constructor(container: HTMLDivElement) {
        this.container = container

        this.dom = <HTMLDivElement> document.createElement('div')
        this.dom.id = 'loading-screen'
        this.dom.onclick = this.onMouseClick.bind(this)
        this.dom.ontransitionend = this.onTransitionEnd.bind(this)

        this.audio = new Audio(sound)
        this.audio.loop = true

        this.pressedNo = 0
    }

    private onMouseClick(): void {
        this.pressedNo += 0.5

        switch (this.pressedNo) {
        case 0.5:
            this.dom.style.opacity = '0'
            break
        case 1.5:
            break
        
        case 2.5:
            this.dom.style.opacity = '0'
            break
        }
    }

    private onTransitionEnd(): void {
        let img, span
        this.pressedNo += 0.5

        switch (this.pressedNo) {
        case 1:
            this.dom.replaceChildren()
            this.dom.style.opacity = '1'
            this.dom.style.backgroundColor = '#20a8fc'

            img = <HTMLImageElement> document.createElement('img')
            img.id = 'pc13'
            img.src = pc13
            img.style.position = 'absolute'
            img.style.bottom = '64px'
            img.style.right = '32px'

            this.dom.appendChild(img)

            break
        case 2:
            break
        case 3:
            this.dom.remove()
            this.audio.pause()
            break
        }
    }

    render(): void {
        this.dom.style.backgroundColor = '#dcdcdc'
        this.dom.style.transition = 'opacity 1s ease'
        const img = <HTMLImageElement> document.createElement('img')
        img.src = logo

        this.dom.appendChild(img)
        this.container.appendChild(this.dom)
    }
}
