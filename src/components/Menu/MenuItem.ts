/* eslint-disable require-jsdoc */
import HTMLItem from '../HTMLItem'
import IMenuImage from '../../api/IMenuImage'
import IMenuOption from '../../api/IMenuOption'

export default class MenuImage
    extends HTMLItem
    implements IMenuImage, IMenuOption {
    constructor(
        container: HTMLDivElement,
        tag: string,
        id: string | null = null,
        className: string | null = null
    ) {
        super(container, tag, id, className)
        if (tag === 'button') {
            this.dom.onclick = this.onClick.bind(this)
        }
    }

    public setSrc(src: string): void {
        (<HTMLImageElement>this.dom).src = src
    }

    public onClick(): void {
        window.close()
    }
}
