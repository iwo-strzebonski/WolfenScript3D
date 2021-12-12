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
        soundVolume: 1,
        musicVolume: 1
    },
    engine: {
        viewRange: 24,          // in tiles
        interval: 1000 / FPS,
        canvasWidth: 960,
        canvasHeight: 600,
        tileSize: 4
    },
    menu: {
        menuActive: false,
        selectedOption: 0,
        selectable: {
            start: true,
            options: true,
            load: true,
            save: false,
            readme: true,
            scores: true,
            demo: false,
            close: true
        }
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
