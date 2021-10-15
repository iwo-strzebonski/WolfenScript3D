const FPS = 70

const Config = {
    controls: {
        forward: 'ArrowUp',
        backward: 'ArrowDown',
        left: 'ArrowLeft',
        right: 'ArrowRight',
        run: 'Shift',
        strafe: 'Alt',
        fire: 'Control'
    },
    sound: {
        soundVolume: 1,
        musicVolume: 1
    },
    engine: {
        interval: 1000 / FPS
    },
    game: {
        started: false,
        weapon: 1,
        fire: false,
        fireable: true,
        fireUp: true,
        ammo: 8,
        isRunning: false
    }
}

export default Config
