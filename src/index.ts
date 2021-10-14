/* eslint-disable require-jsdoc */
import Main from './components/Main'

import './style/index.css'
import './style/menu.css'
import './style/view.css'

window.onload = () => {
    const div = <HTMLDivElement> document.getElementById('main')!
    new Main(div)
}
