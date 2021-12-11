const FPS = 70                  // Default: 70

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
        fire: 'Control',
        noClip: 't'
    },
    sound: {
        soundVolume: 0.3,
        musicVolume: 0.2
    },
    engine: {
        viewRange: 30,          // in tiles
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
        bestWeapon: 3,
        weapon: 1,
        // ammo: 8,
        ammo: 99,

        noClip: false
    }
}

export default Config
