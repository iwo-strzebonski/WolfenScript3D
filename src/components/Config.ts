const FPS = 70

const Config = {
    controls: {
        forward: 'ArrowUp',
        backward: 'ArrowDown',
        rotateLeft: 'ArrowLeft',
        rotateRight: 'ArrowRight',
        strafe: 'Alt',
        strafeLeft: 'q',
        strafeRight: 'e',
        run: 'Shift',
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
        strafe: false,
        strafeLeft: false,
        strafeRight: false,
        
        bestWeapon: 2,
        weapon: 1,
        // ammo: 8,
        ammo: 999,
    }
}

export default Config
