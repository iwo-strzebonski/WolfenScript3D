/* eslint-disable require-jsdoc */
export default class HTMLItem {
    private readonly container: HTMLElement
    protected readonly dom: HTMLElement

    public state: number

    constructor(
        container: HTMLElement,
        tag: string,
        className?: string,
        id?: string,
        innerText?: string
    ) {
        this.state = -1
        this.container = container
        this.dom = document.createElement(tag)

        if (innerText) {
            this.dom.innerText = innerText
        }

        if (id) {
            this.dom.id = id
        }

        if (className) {
            this.dom.className = className
        }
    }

    public render(): void {
        this.container.appendChild(this.dom)
    }

    protected onTransitionEnd(): void {
        this.state += 0.5
    }

    public update(): void { null }

    public hide(): void {
        this.dom.style.display = 'none'
        // this.dom.style.opacity = '0'
        // this.dom.style.zIndex = '-1'
    }

    public show(): void {
        this.dom.style.display = 'block'
        // this.dom.style.opacity = '1'
        // this.dom.style.zIndex = '999'
    }
}
