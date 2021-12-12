/* eslint-disable require-jsdoc */
export default class SpriteLoader {
    public static getSprite(set: number): HTMLImageElement {
        const context = 
            require.context('/public/img/sprites/', false, /\.(png)$/)

        const r: string[] = <string[]> context.keys().map(context)

        const img = document.createElement('img')
        img.src = r[set]

        return img
    }
}
