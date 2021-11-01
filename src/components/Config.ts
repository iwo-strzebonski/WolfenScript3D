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
        interval: 1000 / FPS,
        playerHeight: 1
    },
    game: {
        started: false,
        isRunning: false,

        fire: false,
        fireable: true,
        fireUp: true,
        
        moveForward: false,
        moveBackward: false,
        rotateLeft: false,
        rotateRight: false,
        strafeLeft: false,
        strafeRight: false,
        
        bestWeapon: 2,
        weapon: 1,
        // ammo: 8,
        ammo: 999,
    }
}

export default Config
