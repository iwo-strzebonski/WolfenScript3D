/* eslint-disable require-jsdoc */
import Config from '../Config'

import Cube from './primitives/Cube'
import Decoration from './objects/Decoration'
import Plane from './primitives/Plane'
import Primitive from './primitives/Primitive'
import Gate from './objects/Gate'

import { mapTile, rotations } from '../@types/MapLoader'
import { vec3 } from '../@types/mat4GL'

export default class MapLoader {
    public map: Array<Primitive> = []
    private mapsList: Array<mapTile>
    private playerRot: rotations = 'up'

    public playerStartingPos: vec3 = [0, 0, 0]

    constructor(mapNumber: number) {
        this.mapsList = this.getMaps()
        this.loadMap = mapNumber
    }

    private getMaps(): mapTile[] {
        function importAll(r: __WebpackModuleApi.RequireContext): mapTile[] {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return r.keys().map(r).map((el: any) => el)
        }

        const context = require.context('/public/maps', false, /\.(ya?ml)$/)

        return <mapTile[]> importAll(context)
    }

    public get playerStartingRot(): number {
        switch (this.playerRot) {
        case 'up':
            return 0
        case 'down':
            return Math.PI
        case 'left':
            return Math.PI / 2
        case 'right':
            return Math.PI * 3 / 2
        }
    }

    public set loadMap(mapNo: number) {
        this.map = []

        let door: Array<Gate>

        const map: Array<Primitive | null | Primitive[]> = []

        for (const i in this.mapsList[mapNo]) {
            const tile: mapTile = this.mapsList[mapNo][i]
            const size = Config.engine.tileSize

            switch (tile.type) {
            case 'wall':
                map.push(new Cube(size, tile.color, false))
                break

            case 'elevator':
                map.push(new Plane(size, <boolean>tile.rotation!, tile.color))
                break

            case 'door':
                door = [
                    new Gate(size, <boolean>tile.rotation!, 0, tile.color),
                    new Gate(size, <boolean>tile.rotation!, 1, tile.color),
                    new Gate(size, <boolean>tile.rotation!, 2, tile.color),
                ]

                door[0].pos = [tile.x * size, 0, tile.z * size]
                door[1].pos = [tile.x * size, 0, tile.z * size]
                door[2].pos = [tile.x * size, 0, tile.z * size]

                map.push(door)
                break

            case 'decoration':
                map.push(new Decoration(size, 'decoration'))
                break
            
            case 'pickupable':
                map.push(new Decoration(size, 'pickupable'))
                break

            case 'start':
                this.playerStartingPos = [
                    tile.x * size + Config.engine.tileSize / 2,
                    -Config.engine.tileSize / 2,
                    tile.z * size - Config.engine.tileSize / 2
                ]

                this.playerRot = <rotations>('' + tile.rotation)
                map.push(null)
                break
            }

            if (tile.type !== 'start') {
                map[i].pos = [tile.x * size, 0, tile.z * size]
            }
        }

        this.map = <Array<Primitive>> map.filter(el => el).flat()
    }
}
