/* eslint-disable require-jsdoc */
import Config from '../Config'

import Cube from './primitives/Cube'
import Decoration from './objects/Decoration'
import Plane from './primitives/Plane'
import Primitive from './primitives/Primitive'
import Gate from './objects/Gate'

import { mapTile } from '../@types/MapLoader'
import { vec3 } from '../@types/mat4GL'

export default class MapLoader {
    public map: Array<Primitive> = []
    private mapsList: Array<mapTile>

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

        const context = require.context('../maps', false, /\.(json)$/)

        return <mapTile[]> importAll(context)
    }

    public set loadMap(mapNo: number) {
        this.map = []

        let gate: Array<Gate>

        // for (const tile of this.mapsList[mapNo]) {
        const map: Array<Primitive | null | Primitive[]> = []
        for (const i in this.mapsList[mapNo]) {
            const tile: mapTile = this.mapsList[mapNo][i]
            const size = Config.engine.tileSize

            switch (tile.type) {
            case 'wall':
                map.push(new Cube(size))
                break

            case 'plane':
                map.push(new Plane(size, tile.rotate!))
                break

            case 'gate':
                gate = [
                    new Gate(size, tile.rotate!, 0),
                    new Gate(size, tile.rotate!, 1),
                    new Gate(size, tile.rotate!, 2),
                ]

                gate[0].pos = [tile.x * size, 0, tile.z * size]
                gate[1].pos = [tile.x * size, 0, tile.z * size]
                gate[2].pos = [tile.x * size, 0, tile.z * size]

                map.push(gate)
                break

            case 'decoration':
                map.push(new Decoration(size, tile.isCollider!))
                break
            
            case 'pickupable':
                map.push(new Decoration(size, tile.itemType!))
                break

            case 'start':
                this.playerStartingPos = [
                    tile.x * size + 1,
                    -Config.engine.playerHeight,
                    tile.z * size - 1.2
                ]
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
