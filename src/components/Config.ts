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
        musicVolume: 0.5
    },
    engine: {
        interval: 1000 / FPS
    },
    game: {
        started: false,
        isRunning: false,
        fire: false,
        fireable: true,
        fireUp: true,
        bestWeapon: 2,
        weapon: 1,
        ammo: 8,
    }
}

export default Config
