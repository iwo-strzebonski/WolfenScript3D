/**
 * Four-dimensional matrix
 */
export type mat4 = [
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
]

/**
 * x: {number} - distance in X axis
 * 
 * y: {number} - distance in Y axis
 * 
 * z: {number} - distance in X axis
 */
export type vec3 = [
    number, number, number
]

/**
 * x: {number} - distance in X axis
 * 
 * y: {number} - distance in Y axis
 * 
 * z: {number} - distance in X axis
 * 
 * angle {number} - angle in radians
 */
export type vec4 = [
    number, number, number, number
]

/**
 * m: {number} - forward/backward movement
 * 
 * s: {number} - left/right strafe
 * 
 * r: {number} - left/right rotation
 */
export type trslnData = [
    number, number, number
]

export type posType = {
    x: number,
    z: number
}
