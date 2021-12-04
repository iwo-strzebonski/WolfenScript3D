const FPS = 60

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
        soundVolume: 0.5,
        musicVolume: 0.2
    },
    engine: {
        interval: 1000 / FPS,
        playerHeight: 1,
        canvasWidth: 960,
        canvasHeight: 600,
        tileSize: 2
    },
    game: {
        started: false,
        map: 0,

        fire: false,
        fireable: true,
        fireUp: true,
        
        isRunning: false,
        moveForward: false,
        moveBackward: false,
        rotateLeft: false,
        rotateRight: false,
        strafe: false,
        strafeLeft: false,
        strafeRight: false,
        
        // bestWeapon: 1,
        bestWeapon: 2,
        weapon: 1,
        // ammo: 8,
        ammo: 999,
    }
}

export default Config
