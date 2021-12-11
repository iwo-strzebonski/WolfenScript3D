export type mapTile = {
    readonly x: number,
    readonly z: number,
    readonly type: string,
    readonly color: string,
    readonly rotation?: string | boolean
}

export type rotations =
    | 'up'
    | 'down'
    | 'left'
    | 'right'
