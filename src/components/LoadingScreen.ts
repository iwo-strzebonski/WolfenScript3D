/* eslint-disable require-jsdoc */
import HTMLItem from './HTMLItem'

import '../style/loadingScreen.css'

import logo from '../img/loading_screen/wolfenstein3d-logo.png'
import pc13 from '../img/loading_screen/pc13.png'
import welcome from '../img/loading_screen/welcome.png'

export default class LoadingScreen extends HTMLItem {
    constructor(container: HTMLDivElement) {
        super(container, 'div')
        this.dom.id = 'loading-screen'
        this.dom.onclick = this.onMouseClick.bind(this)
        this.dom.ontransitionend = this.onTransitionEnd.bind(this)

        this.state = -1
    }

    private onMouseClick(): void {
        this.state! += (this.state! | 0) === this.state! ? 0.5 : 0
        this.dom.style.opacity = '0'
    }

    public update(): void {
        let img
        if ((this.state! | 0) === this.state! && this.state! > 0) {
            this.dom.replaceChildren()
            this.dom.style.opacity = '1'
        }

        switch (this.state) {
        case -1:
            this.state = 0
            this.dom.style.backgroundColor = '#dcdcdc'
            img = <HTMLImageElement> document.createElement('img')
            img.id = 'logo'
            img.src = logo
    
            this.dom.appendChild(img)
            break
        case 1:
            this.dom.style.backgroundColor = '#20a8fc'

            img = <HTMLImageElement> document.createElement('img')
            img.id = 'pc13'
            img.src = pc13

            this.dom.appendChild(img)

            break
        case 2:
            this.dom.style.backgroundColor = '#707070'

            img = <HTMLImageElement> document.createElement('img')
            img.id = 'welcome'
            img.src = welcome
            img.width = this.dom.clientWidth
            img.height = this.dom.clientHeight

            this.dom.appendChild(img)
            break
        }
    }
}
