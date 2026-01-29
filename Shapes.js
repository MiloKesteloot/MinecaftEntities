class Cube {
    constructor(x, z, y, sx, sz, sy, px, pz, py, r, ax, az, ay) {
        this.type='cube';
        this.color = [0.2, 0.2, 0.2, 1];
        this.matrix = new Matrix4();
        this.children = [];

        if (px !== undefined) {

            // 1. move to pivot
            this.matrix.translate(px, py, pz);

            // 2. rotate around pivot
            this.matrix.rotate(eval(r), ax, ay, az);

            // 3. move back from pivot
            this.matrix.translate(-px, -py, -pz);
        }

        // cube.matrix.rotate(rotation[0], rotation[1], rotation[2], rotation[3])
        this.matrix.translate(x, y, z);
        this.matrix.scale(sx, sy, sz);
    }

    col(r, g, b, a) {
        this.color = [r/255.0, g/255.0, b/255.0, a/255.0];
        return this;
    }

    add(cube) {
        this.children.push(cube);
        return cube;
    }

    render() {
        let rgba = this.color;

        
        
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements)

        const col1 = rgba;
        const col2 = this.multColor(rgba, 0.85);
        const col3 = this.multColor(rgba, 0.7);
        const col4 = this.multColor(rgba, 0.55);
        const col5 = this.multColor(rgba, 0.4);
        const col6 = this.multColor(rgba, 0.35);

        Triangle3D.draw( [0,0,0,   1,1,0,   1,0,0], col1);
        Triangle3D.draw( [0,0,0,   0,1,0,   1,1,0], col1);

        Triangle3D.draw( [0,0,0,   0,1,1,   0,1,0], col2);
        Triangle3D.draw( [0,0,0,   0,0,1,   0,1,1], col2);

        Triangle3D.draw( [0,0,0,   1,0,1,   0,0,1], col3);
        Triangle3D.draw( [0,0,0,   1,0,0,   1,0,1], col3);

        Triangle3D.draw( [0,1,0,   0,1,1,   1,1,1], col4);
        Triangle3D.draw( [0,1,0,   1,1,1,   1,1,0], col4);

        Triangle3D.draw( [1,1,1,   0,1,0,   0,1,1], col4);
        Triangle3D.draw( [1,1,1,   1,1,0,   0,1,0], col4);

        Triangle3D.draw( [1,1,1,   1,0,0,   1,1,0], col5);
        Triangle3D.draw( [1,1,1,   1,0,1,   1,0,0], col5);

        Triangle3D.draw( [1,1,1,   0,0,1,   1,0,1], col6);
        Triangle3D.draw( [1,1,1,   0,1,1,   0,0,1], col6);

        for (const key in this.children) {
            this.children[key].render();
        }
    }

    multColor(rgba, m) {
        return [rgba[0]*m, rgba[1]*m, rgba[2]*m, rgba[3]];
    }
}

class Triangle3D {
    constructor(corners, rgb = [1, 0.5, 0.5, 1]) {
        this.type = "triangle";
        this.corners = [...corners];
        this.color = [...rgb, 1];
    }

    render() {
        Triangle3D.draw(this.corners, this.color);
    }

    static draw(corners, color = [1, 0.5, 1, 1]) {
        corners = corners.map(x => x - 0.5);

        var n = corners.length/2; // The number of vertices

        // Create a buffer object
        var vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
            console.error('Failed to create the buffer object');
            return -1;
        }

        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(corners), gl.STATIC_DRAW);

        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, ...color);

        gl.drawArrays(gl.TRIANGLES, 0, n);
    }
}

// const CubeMesh = (() => {
//     const vertices = new Float32Array([
//         // front
//         0,0,0, 1,1,0, 1,0,0,
//         0,0,0, 0,1,0, 1,1,0,
//         // left
//         0,0,0, 0,1,1, 0,1,0,
//         0,0,0, 0,0,1, 0,1,1,
//         // bottom
//         0,0,0, 1,0,1, 0,0,1,
//         0,0,0, 1,0,0, 1,0,1,
//         // top
//         0,1,0, 0,1,1, 1,1,1,
//         0,1,0, 1,1,1, 1,1,0,
//         // right
//         1,1,1, 1,0,0, 1,1,0,
//         1,1,1, 1,0,1, 1,0,0,
//         // back
//         1,1,1, 0,0,1, 1,0,1,
//         1,1,1, 0,1,1, 0,0,1,
//     ]);

//     let buffer;

//     function init() {
//         buffer = gl.createBuffer();
//         gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
//         gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
//     }

//     function bind() {
//         gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
//         gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
//         gl.enableVertexAttribArray(a_Position);
//     }

//     return { init, bind };
// })();


// class Cube {
//     constructor() {
//         this.color = [1, 1, 1, 1];
//         this.matrix = new Matrix4();
//     }

//     render() {
//         gl.uniformMatrix4fv(
//             u_ModelMatrix,
//             false,
//             this.matrix.elements
//         );

//         const c = this.color;
//         const shades = [1, 0.85, 0.7, 0.55, 0.4, 0.35];

//         // Bind geometry ONCE
//         CubeMesh.bind();

//         let face = 0;
//         for (let s of shades) {
//             gl.uniform4f(
//                 u_FragColor,
//                 c[0] * s,
//                 c[1] * s,
//                 c[2] * s,
//                 c[3]
//             );

//             gl.drawArrays(gl.TRIANGLES, face * 6, 6);
//             face++;
//         }
//     }
// }
