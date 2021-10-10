/* eslint-disable require-jsdoc */
import Main from './components/Main'

import './style/index.css'
import './style/menu.css'
import './style/view.css'

const div: HTMLDivElement = <HTMLDivElement> document.getElementById('main')!

new Main(div)
