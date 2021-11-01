/* eslint-disable no-use-before-define */
/* eslint-disable require-jsdoc */

function main() {
    /** @type {HTMLCanvasElement} */
    let canvas = document.querySelector('#canvas')
    let gl = canvas.getContext('webgl')
    if (!gl) {
        return
    }
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
    
    const vsSource = `
    attribute vec4 a_position;
    attribute vec2 a_texcoord;
    uniform mat4 u_matrix;
    varying vec2 v_texcoord;

    void main() {
        gl_Position = u_matrix * a_position;
        v_texcoord = a_texcoord;
    }
    `

    const fsSource = `
    precision mediump float;
    varying vec2 v_texcoord;
    uniform sampler2D u_texture;
    
    void main() {
        gl_FragColor = texture2D(u_texture, v_texcoord);
    }
    `

    const program = initShaderProgram(
        gl, vsSource, fsSource
    )

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clearDepth(1.0)
    gl.enable(gl.DEPTH_TEST)
    // gl.enable(gl.CULL_FACE)
    gl.depthFunc(gl.LEQUAL)
    gl.useProgram(program)

    let positionLocation = gl.getAttribLocation(program, 'a_position')
    let texcoordLocation = gl.getAttribLocation(program, 'a_texcoord')
    let matrixLocation = gl.getUniformLocation(program, 'u_matrix')
    let textureLocation = gl.getUniformLocation(program, 'u_texture')

    let positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    setGeometry(gl)

    let texcoordBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)
    setTexcoords(gl)

    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)

    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1, 1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 0, 255])
    )

    let image = new Image()
    image.crossOrigin = ''
    image.src = 'https://i.ibb.co/BfMbWy7/wall1.png'
    image.width = 64
    image.height = 64
    image.objectFit = 'none'
    image.addEventListener('load', function() {
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            image
        )
        gl.generateMipmap(gl.TEXTURE_2D)
    })

    const fov = Math.PI / 3

    image.onload = () => drawScene()

    function drawScene() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        gl.enableVertexAttribArray(positionLocation)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)    

        let size, type, normalize, stride, offset

        size = 3
        type = gl.FLOAT
        normalize = false
        stride = 0
        offset = 0

        gl.vertexAttribPointer(
            positionLocation, size, type, normalize, stride, offset
        )
        gl.enableVertexAttribArray(texcoordLocation)
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)

        size = 2
        type = gl.FLOAT
        normalize = false
        stride = 0
        offset = 0

        gl.vertexAttribPointer(
            texcoordLocation,
            size,
            type,
            normalize,
            stride,
            offset
        )

        let numFs = 8
        let radius = 1

        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
        const zNear = 1
        const zFar = 100
        let projectionMatrix = m4.perspective(
            fov, aspect, zNear, zFar
        )

        // let cameraMatrix = m4.yRotation(0)
        // cameraMatrix = m4.xRotate(cameraMatrix, -1)
        // cameraMatrix = m4.translate(
        //     cameraMatrix, 0.5, 1, 4
        // )

        // cameraMatrix = m4.yRotation(time / 1000)
        // cameraMatrix = m4.translate(
        //     cameraMatrix,
        //     0.5, 1, 4
        // )

        document.body.onkeydown = (e) => {
            const xTranslation = 
                ['q', 'e'].includes(e.key)
                    // ? (e.key === 'q' ? -0.1 : 0.1)
                    ? (e.key === 'q' ? -1 : 1)
                    : 0

            const zTranslation =
                ['w', 's'].includes(e.key)
                    // ? (e.key === 'w' ? -0.1 : 0.1)
                    ? (e.key === 'w' ? -1 : 1)
                    : 0

            const yRotation = 
                ['a', 'd'].includes(e.key)
                    // ? (e.key === 'a' ? Math.PI / 32 : -Math.PI / 32)
                    ? (e.key === 'a' ? Math.PI / 16 : -Math.PI / 16)
                    : 0

            window.cameraMatrix = m4.translate(
                window.cameraMatrix,
                xTranslation, 0, zTranslation
            )

            window.cameraMatrix = m4.yRotate(
                window.cameraMatrix,
                yRotation
            )
        }

        let viewMatrix = m4.inverse(window.cameraMatrix)

        let viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix)

        for (let ii = 0; ii < numFs; ++ii) {
            let angle = ii * Math.PI * 2 / numFs
            let x = Math.cos(angle) * radius
            let z = Math.sin(angle) * radius

            let matrix = m4.translate(viewProjectionMatrix, x, 0, z)

            // let matrix = m4.translate(viewProjectionMatrix, ii * 4, 0, 0)

            gl.uniformMatrix4fv(matrixLocation, false, matrix)

            const offset = 0
            const count = 36
            gl.uniform1i(textureLocation, 0)
            gl.drawArrays(gl.TRIANGLES, offset, count)
        }

        requestAnimationFrame(drawScene.bind(this))
    }
}

const m4 = {
    perspective: function(fov, aspect, near, far) {
        let f = Math.tan(Math.PI * 0.5 - 0.5 * fov)
        let rangeInv = 1.0 / (near - far)

        return [
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0
        ]
    },

    projection: function(width, height, depth) {
        return [
            2 / width, 0, 0, 0,
            0, -2 / height, 0, 0,
            0, 0, 2 / depth, 0,
            -1, 1, 0, 1,
        ]
    },

    multiply: function(a, b) {
        let a00 = a[0 * 4 + 0]
        let a01 = a[0 * 4 + 1]
        let a02 = a[0 * 4 + 2]
        let a03 = a[0 * 4 + 3]
        let a10 = a[1 * 4 + 0]
        let a11 = a[1 * 4 + 1]
        let a12 = a[1 * 4 + 2]
        let a13 = a[1 * 4 + 3]
        let a20 = a[2 * 4 + 0]
        let a21 = a[2 * 4 + 1]
        let a22 = a[2 * 4 + 2]
        let a23 = a[2 * 4 + 3]
        let a30 = a[3 * 4 + 0]
        let a31 = a[3 * 4 + 1]
        let a32 = a[3 * 4 + 2]
        let a33 = a[3 * 4 + 3]
        let b00 = b[0 * 4 + 0]
        let b01 = b[0 * 4 + 1]
        let b02 = b[0 * 4 + 2]
        let b03 = b[0 * 4 + 3]
        let b10 = b[1 * 4 + 0]
        let b11 = b[1 * 4 + 1]
        let b12 = b[1 * 4 + 2]
        let b13 = b[1 * 4 + 3]
        let b20 = b[2 * 4 + 0]
        let b21 = b[2 * 4 + 1]
        let b22 = b[2 * 4 + 2]
        let b23 = b[2 * 4 + 3]
        let b30 = b[3 * 4 + 0]
        let b31 = b[3 * 4 + 1]
        let b32 = b[3 * 4 + 2]
        let b33 = b[3 * 4 + 3]
        return [
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
            b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
            b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
            b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
            b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
            b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
            b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
            b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
            b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
            b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
            b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
            b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
            b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
            b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
            b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
            b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
        ]
    },

    translation: function(tx, ty, tz) {
        return [
            1,  0,  0,  0,
            0,  1,  0,  0,
            0,  0,  1,  0,
            tx, ty, tz, 1,
        ]
    },

    xRotation: function(angleInRadians) {
        let c = Math.cos(angleInRadians)
        let s = Math.sin(angleInRadians)

        return [
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1,
        ]
    },

    yRotation: function(angleInRadians) {
        let c = Math.cos(angleInRadians)
        let s = Math.sin(angleInRadians)

        return [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1,
        ]
    },

    zRotation: function(angleInRadians) {
        let c = Math.cos(angleInRadians)
        let s = Math.sin(angleInRadians)

        return [
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]
    },

    scaling: function(sx, sy, sz) {
        return [
            sx, 0,  0,  0,
            0, sy,  0,  0,
            0,  0, sz,  0,
            0,  0,  0,  1,
        ]
    },

    translate: function(m, tx, ty, tz) {
        return m4.multiply(m, m4.translation(tx, ty, tz))
    },

    xRotate: function(m, angleInRadians) {
        return m4.multiply(m, m4.xRotation(angleInRadians))
    },

    yRotate: function(m, angleInRadians) {
        return m4.multiply(m, m4.yRotation(angleInRadians))
    },

    zRotate: function(m, angleInRadians) {
        return m4.multiply(m, m4.zRotation(angleInRadians))
    },

    scale: function(m, sx, sy, sz) {
        return m4.multiply(m, m4.scaling(sx, sy, sz))
    },

    inverse: function(m) {
        let m00 = m[0 * 4 + 0]
        let m01 = m[0 * 4 + 1]
        let m02 = m[0 * 4 + 2]
        let m03 = m[0 * 4 + 3]
        let m10 = m[1 * 4 + 0]
        let m11 = m[1 * 4 + 1]
        let m12 = m[1 * 4 + 2]
        let m13 = m[1 * 4 + 3]
        let m20 = m[2 * 4 + 0]
        let m21 = m[2 * 4 + 1]
        let m22 = m[2 * 4 + 2]
        let m23 = m[2 * 4 + 3]
        let m30 = m[3 * 4 + 0]
        let m31 = m[3 * 4 + 1]
        let m32 = m[3 * 4 + 2]
        let m33 = m[3 * 4 + 3]
        let tmp_0  = m22 * m33
        let tmp_1  = m32 * m23
        let tmp_2  = m12 * m33
        let tmp_3  = m32 * m13
        let tmp_4  = m12 * m23
        let tmp_5  = m22 * m13
        let tmp_6  = m02 * m33
        let tmp_7  = m32 * m03
        let tmp_8  = m02 * m23
        let tmp_9  = m22 * m03
        let tmp_10 = m02 * m13
        let tmp_11 = m12 * m03
        let tmp_12 = m20 * m31
        let tmp_13 = m30 * m21
        let tmp_14 = m10 * m31
        let tmp_15 = m30 * m11
        let tmp_16 = m10 * m21
        let tmp_17 = m20 * m11
        let tmp_18 = m00 * m31
        let tmp_19 = m30 * m01
        let tmp_20 = m00 * m21
        let tmp_21 = m20 * m01
        let tmp_22 = m00 * m11
        let tmp_23 = m10 * m01

        let t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
        (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31)
        let t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
        (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31)
        let t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
        (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31)
        let t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
        (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21)

        let d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3)

        return [
            d * t0,
            d * t1,
            d * t2,
            d * t3,
            d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
            (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
            d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
            (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
            d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
            (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
            d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
            (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
            d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
            (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
            d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
            (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
            d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
            (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
            d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
            (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
            d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
            (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
            d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
            (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
            d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
            (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
            d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
            (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
        ]
    },

    vectorMultiply: function(v, m) {
        let dst = []
        for (let i = 0; i < 4; ++i) {
            dst[i] = 0.0
            for (let j = 0; j < 4; ++j) {
                dst[i] += v[j] * m[j * 4 + i]
            }
        }
        return dst
    },

}

function setGeometry(gl) {
    const size = 1
    let positions = new Float32Array([
        0, 0, 0,
        0, size, 0,
        size, 0, 0,
        0, size, 0,
        size, size, 0,
        size, 0, 0,

        0, 0, size,
        0, size, size,
        size, 0, size,
        0, size, size,
        size, size, size,
        size, 0, size,

        0, 0, 0,
        size, 0, 0,
        0, 0, size,
        size, 0, 0,
        size, 0, size,
        0, 0, size,

        0, size, 0,
        size, size, 0,
        0, size, size,
        size, size, 0,
        size, size, size,
        0, size, size,

        0, 0, 0,
        0, size, 0,
        0, 0, size,
        0, size, 0,
        0, size, size,
        0, 0, size,

        size, 0, 0,
        size, size, 0,
        size, 0, size,
        size, size, 0,
        size, size, size,
        size, 0, size,
    ])

    let matrix = m4.xRotation(Math.PI)
    // matrix = m4.translate(matrix, 0, 1, 0)

    for (let ii = 0; ii < positions.length; ii += 3) {
        let vector = m4.vectorMultiply(
            [
                positions[ii + 0],
                positions[ii + 1],
                positions[ii + 2], 1
            ],
            matrix
        )
        positions[ii + 0] = vector[0]
        positions[ii + 1] = vector[1]
        positions[ii + 2] = vector[2]
    }

    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
}

function setTexcoords(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            0, 0,
            0, 1,
            1, 0,
            0, 1,
            1, 1,
            1, 0,

            0, 0,
            0, 1,
            1, 0,
            0, 1,
            1, 1,
            1, 0,

            0, 0,
            0, 1,
            1, 0,
            0, 1,
            1, 1,
            1, 0,

            0, 0,
            0, 1,
            1, 0,
            0, 1,
            1, 1,
            1, 0,

            0, 0,
            0, 1,
            1, 0,
            0, 1,
            1, 1,
            1, 0,

            0, 0,
            0, 1,
            1, 0,
            0, 1,
            1, 1,
            1, 0,
        ]),
        gl.STATIC_DRAW)
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type)

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader)
        return null
    }

    return shader
}

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(
        gl, gl.VERTEX_SHADER, vsSource
    )
    const fragmentShader = loadShader(
        gl, gl.FRAGMENT_SHADER, fsSource
    )
    const shaderProgram = gl.createProgram()
    
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        return null
    }

    return shaderProgram
}

window.cameraMatrix = m4.translation(
    0.5, 0, 4
)

main()
