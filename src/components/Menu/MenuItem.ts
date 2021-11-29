/* eslint-disable require-jsdoc */
import HTMLItem from '../HTMLItem'
import IMenuImage from '../../interfaces/IMenuImage'
import IMenuOption from '../../interfaces/IMenuOption'

export default class MenuImage
    extends HTMLItem
    implements IMenuImage, IMenuOption {
    public selectable = true
    
    constructor(
        container: HTMLElement,
        tag: string,
        innerText: 
            | string
            | null = null,
        id: 
            | string
            | null = null,
        className: 
            | string
            | null = null
    ) {
        super(container, tag, innerText, id, className)
        if (tag === 'button') {
            this.dom.onclick = this.onClick.bind(this)
        }
    }

    public setSrc(src: string): void {
        (<HTMLImageElement>this.dom).src = src
    }

    public onClick(): void {
        if (this.selectable) {
            if (this.dom.id === 'close') {
                window.close()
            }
        }
    }
}
