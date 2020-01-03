"use strict";

/*-----------------------------------------------------------------------------
 *   This section copied from gl-matrix.js (http://glmatrix.com). Just the
 * parts of mat4 that are needed by GLSim are included here. This section
 * is subject to the original license, reproduced below. The software has
 * been modified by deleting unneeded parts and by moving and renaming one
 * function from mat3 into mat4 (mat4.normalTransformMatrix). Also, vec4.transformMat4
 * has been moved to mat4 and renamed to mat4.applyToVec4
 */


var GLMAT_ARRAY_TYPE = Float32Array;  // For use in mat4
var GLMAT_EPSILON = 0.000001;


/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 4x4 Matrix
 * @name mat4
 */

var mat4 = {};

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
mat4.create = function() {
    var out = new GLMAT_ARRAY_TYPE(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
mat4.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};


/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
mat4.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};


/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
};

/**
 * Multiplies two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Cache only the current line of the second matrix
    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];  
    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    return out;
};

/**
 * Alias for {@link mat4.multiply}
 * @function
 */
mat4.mul = mat4.multiply;

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
mat4.translate = function (out, a, v) {
    var x = v[0], y = v[1], z = v[2],
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23;

    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
};

/**
 * Scales the mat4 by the dimensions in the given vec3
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
mat4.scale = function(out, a, v) {
    var x = v[0], y = v[1], z = v[2];

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Rotates a mat4 by the given angle
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
mat4.rotate = function (out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t,
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        b00, b01, b02,
        b10, b11, b12,
        b20, b21, b22;

    if (Math.abs(len) < GLMAT_EPSILON) { return null; }
    
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    return out;
};

/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.frustum = function (out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left),
        tb = 1 / (top - bottom),
        nf = 1 / (near - far);
    out[0] = (near * 2) * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = (near * 2) * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (far * near * 2) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.perspective = function (out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.ortho = function (out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right),
        bt = 1 / (bottom - top),
        nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
};

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
mat4.lookAt = function (out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
        eyex = eye[0],
        eyey = eye[1],
        eyez = eye[2],
        upx = up[0],
        upy = up[1],
        upz = up[2],
        centerx = center[0],
        centery = center[1],
        centerz = center[2];

    if (Math.abs(eyex - centerx) < GLMAT_EPSILON &&
        Math.abs(eyey - centery) < GLMAT_EPSILON &&
        Math.abs(eyez - centerz) < GLMAT_EPSILON) {
        return mat4.identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
};


/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat4.str = function (a) {
    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + 
                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
};


/**
* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
*
* This function is copied from mat3.normalFromMat4 in gl-matrix.js and
* is renamed and added here to the mat4 API. Modification made by D.Eck
*
* @param {Array} out an array of length 9 to receive operation result
* @param {mat4} a Mat4 to derive the normal matrix from
*
* @returns {Array} out
*/
mat4.normalTransformMatrix = function (out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

    out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

    out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

    return out;
};

mat4.applyToVec4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2], w = a[3];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
};


/*------------ END OF SECTION COPIED FROM gl-matrix.js ---------------------------------------*/


function GLSim(canvas, webglOptions) {
    if (!canvas) {
        GLSim.error("GLSim constructor requires a parameter to specify the canvas"); return;
    }
    var thecanvas = null;
    if (typeof canvas == "string") {
        thecanvas = document.getElementById(canvas);
        if (!thecanvas || ! thecanvas.getContext) {
            GLSim.error("GLSim parameter must be a canvas element or an ID for a canvas element"); return;
        }
    }
    else if (typeof canvas == 'object' && canvas.getContext) {
        thecanvas = canvas; 
    }
    else {
        GLSim.error("GLSim parameter must be a canvas element or an ID for a canvas element"); return;
    }
    var options = (webglOptions === undefined)? { preserveDrawingBuffer: true } : webglOptions;
    this.gl = thecanvas.getContext("webgl", options) || thecanvas.getContext("experimental-webgl", options);
    if (!this.gl) {
        GLSim.error("Cannot create WebGL context for canvas."); return;
    }
    var gl = this.gl;
    var vsh = gl.createShader( gl.VERTEX_SHADER );
    gl.shaderSource(vsh,GLSim.vertexShaderSource);
    gl.compileShader(vsh);
    if ( ! gl.getShaderParameter(vsh, gl.COMPILE_STATUS) ) {
       GLSim.error("Error in vertex shader:  " + gl.getShaderInfoLog(vsh));
    }
    var fsh = gl.createShader( gl.FRAGMENT_SHADER );
    gl.shaderSource(fsh, GLSim.fragmentShaderSource);
    gl.compileShader(fsh);
    if ( ! gl.getShaderParameter(fsh, gl.COMPILE_STATUS) ) {
       GLSim.error("Error in fragment shader:  " + gl.getShaderInfoLog(fsh));
    }
    var prog = gl.createProgram();
    gl.attachShader(prog,vsh);
    gl.attachShader(prog, fsh);
    gl.bindAttribLocation(prog,0,"coords");
    gl.linkProgram(prog);
    if ( ! gl.getProgramParameter( prog, gl.LINK_STATUS) ) {
       GLSim.error("Link error in program:  " + gl.getProgramInfoLog(prog));
    }
    gl.useProgram(prog);
    this.glprogram = prog;
    this.location = {
        coords: gl.getAttribLocation(prog,"coords"),
        color: gl.getAttribLocation(prog, "color"),
        normal: gl.getAttribLocation(prog, "normal"),
        front_ambient: gl.getUniformLocation(prog, "front_ambient"), 
        front_diffuse: gl.getUniformLocation(prog, "front_diffuse"), 
        front_specular: gl.getUniformLocation(prog, "front_specular"),
        front_emissive: gl.getUniformLocation(prog, "front_emissive"),
        front_shininess: gl.getUniformLocation(prog, "front_shininess"),
        back_ambient: gl.getUniformLocation(prog, "back_ambient"), 
        back_diffuse: gl.getUniformLocation(prog, "back_diffuse"), 
        back_specular: gl.getUniformLocation(prog, "back_specular"),
        back_emissive: gl.getUniformLocation(prog, "back_emissive"),
        back_shininess: gl.getUniformLocation(prog, "back_shininess"),
        modelview: gl.getUniformLocation(prog, "modelview"),
        projection: gl.getUniformLocation(prog, "projection"),
        normalMatrix: gl.getUniformLocation(prog, "normalMatrix"),
        unitNormals: gl.getUniformLocation(prog, "unitNormals"),
        pointSize: gl.getUniformLocation(prog, "pointSize"),
        lit: gl.getUniformLocation(prog, "lit"),
        twoSided: gl.getUniformLocation(prog, "twoSided"),
        pointMode: gl.getUniformLocation(prog, "pointMode"),
        localViewer: gl.getUniformLocation(prog, "localViewer"),
        globalAmbient: gl.getUniformLocation(prog, "globalAmbient"),
        light: new Array(GLSim.lightCount)
    };
    for (var i = 0; i < GLSim.lightCount; i++) {
        this.location.light[i] = {
            position: gl.getUniformLocation(prog, "light[" + i + "]." + "position"),
            ambient: gl.getUniformLocation(prog,  "light[" + i + "]." + "ambient"),
            specular: gl.getUniformLocation(prog,  "light[" + i + "]." + "specular"),
            diffuse: gl.getUniformLocation(prog,  "light[" + i + "]." + "diffuse"),
            enabled: gl.getUniformLocation(prog,  "light[" + i + "]." + "enabled")
        };
    }
    this.buffer = {
        coords: gl.createBuffer(),
        color: gl.createBuffer(),
        normal: gl.createBuffer(),
        index: gl.createBuffer()
    };
    this.canvas = thecanvas;
    thecanvas._glsimContext = this;
    GLSim.currentContext = this;
    this.color = [0,0,0,1];
    this.normal = [0,0,1];
    this.lineWidth = 1;
    this.pointSize = 1;
    this.frontMaterial = {
        shininess: 0,
        ambient: [0.2,0.2,0.2],
        diffuse: [0.8,0.8,0.8,1],
        specular: [0,0,0],
        emission: [0,0,0]
    };
    this.backMaterial = {
        shininess: 0,
        ambient: [0.2,0.2,0.2],
        diffuse: [0.8,0.8,0.8,1],
        specular: [0,0,0],
        emission: [0,0,0]
    };
    this.primitiveData = null;
    this.enabled = new Array(_GL_ENABLE_MAX);
    this.enabledClientState = new Array(_GL_ENABLE_CLIENT_STATE_MAX);
    this.arraysForDrawArrays = {
        vertexArray: null,
        normalArray: null,
        colorArray: null
    };
    if (!GL_SRC_ALPHA) {  // grab standard constants from WebGL context
        GL_SRC_ALPHA = gl.SRC_ALPHA;
        GL_ONE_MINUS_SRC_ALPHA = gl.ONE_MINUS_SRC_ALPHA;
        GL_CCW = gl.CCW;
        GL_CW = gl.CW;
        GL_FLOAT = gl.FLOAT;
        GL_UNSIGNED_BYTE = gl.UNSIGNED_BYTE;
    }
    this.lightModelAmbient = [0,0,0];
    this.lightModelTwoSide = 0;
    this.lightModelLocalViewer = 0;
    this.light = [];
    for (var i = 0; i < GLSim.lightCount; i++) {
        var d = {
            ambient: [0,0,0],
            diffuse: [0,0,0],
            specular: [0,0,0],
            position: [0,0,1,0]
        };
        this.light.push(d);
    }
    this.light[0].diffuse = [1,1,1];
    this.projectionMatrix = mat4.create();
    this.modelviewMatrix = mat4.create();
    this.projectionStack = [];
    this.modelviewStack = [];
    this.matrixMode = GL_MODELVIEW;
    this.currentMatrix = function() { return this.matrixMode == GL_MODELVIEW ? this.modelviewMatrix : this.projectionMatrix; };
    this._rotator = null;
    this._drawFunc = null;
}
GLSim.prototype._applyContextToShaderProgram = function(primitiveType) {
    var gl = this.gl;
    if (this.enabled[GL_DEPTH_TEST]) {
        gl.enable(gl.DEPTH_TEST);
    }
    else {
        gl.disable(gl.DEPTH_TEST);
    }
    if (this.enabled[GL_BLEND]) {
        gl.enable(gl.BLEND);
    }
    else {
        gl.disable(gl.BLEND);
    }
    gl.uniformMatrix4fv(this.location.modelview, 0, this.modelviewMatrix);
    gl.uniformMatrix4fv(this.location.projection, 0, this.projectionMatrix);
    var nm = new Float32Array(9);
    mat4.normalTransformMatrix(nm, this.modelviewMatrix);
    gl.uniformMatrix3fv(this.location.normalMatrix, 0, nm);
    gl.uniform1i(this.location.lit, this.enabled[GL_LIGHTING]? 1 : 0);
    gl.uniform1i(this.location.unitNormals, this.enabled[GL_NORMALIZE]? 1 : 0);
    gl.uniform3fv(this.location.front_ambient , this.frontMaterial.ambient);
    gl.uniform4fv(this.location.front_diffuse , this.frontMaterial.diffuse);
    gl.uniform3fv(this.location.front_specular , this.frontMaterial.specular);
    gl.uniform3fv(this.location.front_emissive , this.frontMaterial.emission);
    gl.uniform1f(this.location.front_shininess , this.frontMaterial.shininess);
    gl.uniform3fv(this.location.back_ambient , this.backMaterial.ambient);
    gl.uniform4fv(this.location.back_diffuse , this.backMaterial.diffuse);
    gl.uniform3fv(this.location.back_specular , this.backMaterial.specular);
    gl.uniform3fv(this.location.back_emissive , this.backMaterial.emission);
    gl.uniform1f(this.location.back_shininess , this.backMaterial.shininess);
    gl.uniform3fv(this.location.globalAmbient, this.lightModelAmbient);
    gl.uniform1i(this.location.twoSided, this.lightModelTwoSide);
    if (primitiveType != GL_POINTS) {
        gl.uniform1i(this.location.pointMode, 0);  // not drawing points
    }
    else if ( ! this.enabled[GL_POINT_SMOOTH]) {
        gl.uniform1i(this.location.pointMode, 1);  // drawing unaliased points
    }
    else {
        gl.uniform1i(this.location.pointMode, 2);  // drawing aliased points
    }
    gl.uniform1i(this.location.localViewer, this.lightModelLocalViewer);
    for (var i = 0; i < this.light.length; i++) {
        var light = this.light[i];
        var loc = this.location.light[i];
        gl.uniform1i(loc.enabled, this.enabled[GL_LIGHT0 + i]? 1 : 0);
        gl.uniform3fv(loc.ambient, light.ambient);
        gl.uniform3fv(loc.diffuse, light.diffuse);
        gl.uniform3fv(loc.specular, light.specular);
        gl.uniform4fv(loc.position, light.position);
    }
    gl.lineWidth(this.lineWidth);
    gl.uniform1f(this.location.pointSize, this.pointSize);
}
GLSim.prototype._convertPrimitiveType = function(myPrimitive) {
    var kind;
    var gl = this.gl;
    switch (myPrimitive) {
        case GL_POINTS:
            kind = gl.POINTS;
            break;
        case GL_LINES:
            kind = gl.LINES;
            break;
        case GL_LINE_LOOP:
            kind = gl.LINE_LOOP;
            break;
        case GL_LINE_STRIP:
            kind = gl.LINE_STRIP;
            break;
        case GL_TRIANGLES:
            kind = gl.TRIANGLES;
            break;
        case GL_TRIANGLE_STRIP:
            kind = gl.TRIANGLE_STRIP;
            break;
        case GL_TRIANGLE_FAN:
            kind = gl.TRIANGLE_FAN;
            break;
        case GL_QUAD_STRIP:
            kind = gl.TRIANGLE_STRIP;
            break;
        case GL_POLYGON:
            kind = gl.TRIANGLE_FAN;
            break;
        case GL_QUADS:
            kind = gl.TRIANGLES;
            break;
        default:
            kind = -1;
    }
    return kind;
}
GLSim.prototype._fixArrayForGL_QUADS = function(array, itemSize) {
    var quadCount = Math.floor(array.length/(itemSize*4));
    var vertexCount = quadCount*6;
    var newarray = new Float32Array(vertexCount*itemSize);
    for (var i = 0; i < quadCount; i++) {
        var quad = i*itemSize*4;
        var tri = i*itemSize*6;
        for (var j = 0; j < itemSize; j++) {
            newarray[tri+j] = array[quad+j];
            newarray[itemSize+tri+j] = array[itemSize+quad+j];
            newarray[2*itemSize+tri+j] = array[2*itemSize+quad+j];
            newarray[3*itemSize+tri+j] = array[quad+j];
            newarray[4*itemSize+tri+j] = array[2*itemSize+quad+j];
            newarray[5*itemSize+tri+j] = array[3*itemSize+quad+j];
        }
    }
    return newarray;
}
GLSim.lightCount = 4;
GLSim.error = function(message) { throw message; },
GLSim.currentContext = null;
GLSim.vertexShaderSource =
    "struct materialProperties {\n" +
    "     vec3 ambient;\n" +
    "     vec4 diffuse;\n" +
    "     vec3 specular;\n" +
    "     vec3 emissive;\n" +
    "     float shininess;\n" +
    "};\n" +
    "struct lightProperties {\n" +
    "   vec4 position;\n" +
    "   vec3 diffuse;\n" +
    "   vec3 specular;\n" +
    "   vec3 ambient;\n" +
    "   bool enabled;\n" +
    "};\n" +
    "attribute vec3 coords;\n" +
    "attribute vec3 normal;\n" +
    "attribute vec4 color;\n" +
    "uniform vec3 front_ambient; \n" +
    "uniform vec4 front_diffuse; \n" +
    "uniform vec3 front_specular;\n" +
    "uniform vec3 front_emissive;\n" +
    "uniform float front_shininess;\n" +
    "uniform vec3 back_ambient; \n" +
    "uniform vec4 back_diffuse; \n" +
    "uniform vec3 back_specular;\n" +
    "uniform vec3 back_emissive;\n" +
    "uniform float back_shininess;\n" +
    "uniform mat3 normalMatrix;\n" +
    "uniform bool unitNormals;\n" +
    "uniform bool lit;\n" +
    "uniform bool twoSided;\n" +
    "uniform bool localViewer;\n" +
    "uniform vec3 globalAmbient;\n" +
    "uniform lightProperties light[" + GLSim.lightCount + "];\n" +
    "uniform mat4 modelview;\n" +
    "uniform mat4 projection;\n" +
    "uniform mediump float pointSize;\n" +
    "varying vec4 frontColor;\n" +
    "varying vec4 backColor;\n" +
    "materialProperties material;\n" +
    "vec4 eyeCoords;\n" +
    "vec3 tnormal;\n" +
    "vec3 pointsToViewer;\n" +
    "vec4 lighting(vec3 vertex, vec3 V, vec3 N) {\n" +
    "       // A function to compute the color of this fragment using the lighting equation.\n" +
    "       // vertex contains the coords of the points; V is a unit vector pointing to viewer;\n" +
    "       // N is the normal vector. This function also uses the values in the global variables\n" +
    "       // material, globalAmbient, and light[0]..light[7].\n" +
    "   vec3 color = material.emissive + material.ambient * globalAmbient;\n" +
    "   for (int i = 0; i < " + GLSim.lightCount + "; i++) {\n" +
    "       if (light[i].enabled) {\n" +
    "           color += material.ambient * light[i].ambient;\n" +
    "           vec3 L;\n" +
    "           if (light[i].position.w == 0.0) {\n" +
    "              L = normalize( light[i].position.xyz );\n" +
    "           }\n" +
    "           else {\n" +
    "              L = normalize( light[i].position.xyz/light[i].position.w - vertex );\n" +
    "           }\n" +
    "           if ( dot(L,N) > 0.0) {\n" +
    "              vec3 R;\n" +
    "              R = (2.0*dot(N,L))*N - L;\n" +
    "              color += dot(N,L)*(light[i].diffuse*material.diffuse.rgb);\n" +
    "              if ( dot(V,R) > 0.0)\n" +
    "                 color += pow(dot(V,R),material.shininess) * (light[i].specular * material.specular);\n" +
    "           }\n" +
    "       }\n" +
    "   }\n" +
    "   return vec4(color, material.diffuse.a);\n" +
    "}\n" +
    "void main() {\n" +
    "     eyeCoords = modelview * vec4(coords,1.0);\n" +
    "     gl_Position = projection*eyeCoords;\n" +
    "     gl_PointSize = pointSize;\n" +
    "     if (!lit) {\n" +
    "          frontColor = color;\n" +
    "          return;\n" +
    "     }\n" +
    "     tnormal = normalMatrix*normal;\n" +
    "     if (unitNormals) {\n" +
    "          tnormal = normalize(tnormal);\n" +
    "     }\n" +
    "     if (localViewer) {\n" +
    "          pointsToViewer = normalize(-eyeCoords.xyz/eyeCoords.w);\n" +
    "     }\n" +
    "     else {\n" +
    "          pointsToViewer = vec3(0.0,0.0,1.0);\n" + 
    "     }\n" +
    "     if (twoSided) {\n" +
    "          material = materialProperties(back_ambient, back_diffuse, back_specular, back_emissive, back_shininess);\n" +
    "          backColor = lighting(eyeCoords.xyz/eyeCoords.w, pointsToViewer, -tnormal);\n" +
    "     }\n" +
    "     else {\n" +
    "          backColor = vec4(1.0);  // will not be used\n" +
    "     }\n" +
    "     material = materialProperties(front_ambient, front_diffuse, front_specular, front_emissive, front_shininess);\n" +
    "     frontColor = lighting(eyeCoords.xyz/eyeCoords.w, pointsToViewer, tnormal);\n" +
    "}\n";
GLSim.fragmentShaderSource =
    "precision mediump float;\n" +
    "uniform bool lit;\n" +
    "uniform bool twoSided;\n" +
    "uniform float pointSize;\n" +
    "uniform int pointMode;\n" +
    "varying vec4 frontColor;\n" +
    "varying vec4 backColor;\n" +
    "vec4 clr;\n" +
    "void main() {\n" +
    "     if (pointMode == 2 && pointSize > 1.5 && distance(gl_PointCoord,vec2(0.5)) > 0.5) {\n" +
    "          discard;\n" +
    "     }\n" +
    "     if (!lit || !twoSided || gl_FrontFacing) {\n" +
    "          clr = frontColor;\n" +
    "     }\n" +
    "     else {\n" +
    "          clr = backColor;\n" +
    "     }\n" +
    "     gl_FragColor = clr;\n" +
    "}\n";

var  // enable/disable constants (used as indices into an array)
    GL_DEPTH_TEST = 0,
    GL_MATERIAL_COLOR = 1,
    GL_BLEND = 2,
    GL_LIGHT0 = 3,
    GL_LIGHT1 = 4,
    GL_LIGHT2 = 5,
    GL_LIGHT3 = 6,
    GL_LIGHT4 = 7,
    GL_LIGHT5 = 8,
    GL_LIGHT6 = 9,
    GL_LIGHT7 = 10,
    GL_LIGHTING = 11,
    GL_NORMALIZE = 12,
    GL_POINT_SMOOTH = 13,
    _GL_ENABLE_MAX = 13;
    
var // enable/disable constants for glEnableClientState/glDisableClientState
    GL_VERTEX_ARRAY = 0,
    GL_NORMAL_ARRAY = 1,
    GL_COLOR_ARRAY = 2,
    _GL_ENABLE_CLIENT_STATE_MAX = 2;

var  // other constants
    GL_COLOR_BUFFER_BIT = 1,
    GL_DEPTH_BUFFER_BIT = 2,
    GL_TRUE = 0,
    GL_FALSE = 1,
    GL_POINTS = 0,
    GL_LINES = 1,
    GL_LINE_LOOP = 2,
    GL_LINE_STRIP = 3,
    GL_TRIANGLES = 4,
    GL_TRIANGLE_STRIP = 5,
    GL_TRIANGLE_FAN = 6,
    GL_QUADS = 7,
    GL_QUAD_STRIP = 8,
    GL_POLYGON = 9,
    GL_FRONT = 10,
    GL_BACK = 11,
    GL_FRONT_AND_BACK = 12,
    GL_SHININESS = 13,
    GL_AMBIENT = 14,
    GL_DIFFUSE = 15,
    GL_AMBIENT_AND_DIFFUSE = 16,
    GL_SPECULAR = 17,
    GL_EMISSION = 18,
    GL_POSITION = 19,
    GL_LIGHT_MODEL_AMBIENT = 20,
    GL_LIGHT_MODEL_TWO_SIDE = 21,
    GL_MODELVIEW = 22,
    GL_PROJECTION = 23,
    GL_INT = 24,
    GL_DOUBLE = 25,
    GL_LIGHT_MODEL_LOCAL_VIEWER = 25;
    
    
var // constants to be extracted from a WebGL context when the first one is created
    GL_SRC_ALPHA = null, GL_ONE_MINUS_SRC_ALPHA, GL_CW, GL_CCW, GL_FLOAT, GL_UNSIGNED_BYTE;
    
function glViewport(x,y,width,height) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    x = Number(x);
    y = Number(y);
    width = Number(width);
    height = Number(height);
    if (isNaN(x+y+width+height)) {
        GLSim.error("glViewport requires four numeric parameters"); return;
    }
    if (width <= 0 || height <= 0) {
        GLSim.error("width and height for glViewport must be positive"); return;
    }
    GLSim.currentContext.gl.viewport(x,y,width,height);
}
    
function glEnable(what) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    what = Number(what);
    if (isNaN(what)) {
        GLSim.error("Illegal non-numeric argument for glEnable")
    }
    what = Math.round(what);
    if (what < 0 || what > _GL_ENABLE_MAX) {
        GLSim.error("Unknow property passed as argument to glEnable"); return;
    }
    else {
        GLSim.currentContext.enabled[what] = true;
    }
}

function glDisable(what) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    what = Number(what);
    if (isNaN(what)) {
        GLSim.error("Illegal non-numeric argument for glEnable")
    }
    what = Math.round(what);
    if (what < 0 || what > _GL_ENABLE_MAX) {
        GLSim.error("Unknow property passed as argument to glEnable"); return;
    }
    else {
        GLSim.currentContext.enabled[what] = false;
    }
}

function glEnableClientState(what) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    what = Number(what);
    if (isNaN(what)) {
        GLSim.error("Illegal non-numeric argument for glEnableClientState")
    }
    what = Math.round(what);
    if (what < 0 || what > _GL_ENABLE_CLIENT_STATE_MAX) {
        GLSim.error("Unknow property passed as argument to glEnableClientState"); return;
    }
    else {
        GLSim.currentContext.enabledClientState[what] = true;
    }
}

function glDisableClientState(what) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    what = Number(what);
    if (isNaN(what)) {
        GLSim.error("Illegal non-numeric argument for glDisableClientState")
    }
    what = Math.round(what);
    if (what < 0 || what > _GL_ENABLE_CLIENT_STATE_MAX) {
        GLSim.error("Unknow property passed as argument to glDisableClientState"); return;
    }
    else {
        GLSim.currentContext.enabledClientState[what] = false;
    }
}

function glBlendFunc(a,b) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    GLSim.currentContext.gl.blendFunc(a,b);
}
function glFrontFace(face) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (face != GL_CW && face != GL_CCW) {
        GLSim.error("Argument to glFrontFace must be GL_CW or GL_CCW"); return;
    }
    GLSim.currentContext.gl.frontFace(face);
}
function glPolygonOffset(factor, units) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    factor = Number(factor);
    units = Number(units);
    if (isNaN(factor+units)) {
        GLSim.error("glPolygonOffset requires two numeric arguments"); return;
    }
    GLSim.currentContext.gl.polygonOffset(factor,units);
}

function glClearColor(r,g,b,a) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (isNaN(Number(r)+Number(g)+Number(b)+Number(a))) {
        GLSim.error("glClearColor requires four numeric parameters"); return;
    }
    GLSim.currentContext.gl.clearColor(r,g,b,a);
}

function glClear(mask) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (isNaN( Number(mask) )) {
        GLSim.error("parmeter to glClear must be numeric"); return;
    }
    var arg = 0;
    if (mask & GL_DEPTH_BUFFER_BIT) {
        arg = GLSim.currentContext.gl.DEPTH_BUFFER_BIT;
    }
    if (mask & GL_COLOR_BUFFER_BIT) {
        arg = arg | GLSim.currentContext.gl.COLOR_BUFFER_BIT;
    }
    GLSim.currentContext.gl.clear(arg);
}

function glLineWidth(width) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (isNaN(Number(width))) {
        GLSim.error("Argument to glLineWidth must be numeric"); return;
    }
    GLSim.currentContext.lineWidth = Number(width);
}

function glPointSize(size) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (isNaN(Number(size))) {
        GLSim.error("Argument to glLineWidth must be numeric"); return;
    }
    GLSim.currentContext.pointSize = Number(size);
}

function glColor3f(r,g,b) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (arguments.length != 3) {
        GLSim.error("Exactly three color components are required by glColor3*"); return;
    }
    glColor4f(r,g,b,1.0);
}
var glColor3d = glColor3f;
function glColor4f(r,g,b,a) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (arguments.length != 4) {
        GLSim.error("Exactly four color components are required by glColor4*"); return;
    }
    if (isNaN(Number(r)+Number(g)+Number(b)+Number(a))) {
        GLSim.error("parameters to glColor* must be numeric"); return;
    }
    r = Math.min(1,Math.max(Number(r),0));
    g = Math.min(1,Math.max(Number(g),0));
    b = Math.min(1,Math.max(Number(b),0));
    a = Math.min(1,Math.max(Number(a),0));
    GLSim.currentContext.color = [r,g,b,a];
}
var glColor4d = glColor4f;
function glColor3ub(r,g,b) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (arguments.length != 3) {
        GLSim.error("Exactly three color components are required by glColor3*"); return;
    }
    glColor4f(r/255,g/255,b/255, 1);    
}
function glColor4ub(r,g,b,a) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (arguments.length != 4) {
        GLSim.error("Exactly four color components are required by glColor4*"); return;
    }
    glColor4f(r/255,g/255,b/255, a/255);    
}

function glNormal3f(x,y,z) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (arguments.length != 3) {
        GLSim.error("Exactly three vertex coordinates are required by gNormal3*"); return;
    }
    if (isNaN(Number(x)+Number(y)+Number(z))) {
        GLSim.error("parameters to glNormal* must be numeric"); return;
    }
    GLSim.currentContext.normal = [Number(x),Number(y),Number(z)];
}
var glNormal3d = glNormal3f;

function glVertex3f(x,y,z) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (!GLSim.currentContext.primitiveData) {
        GLSim.error("glVertex* can only be called between glBegin and glEnd"); return;
    }
    if (arguments.length != 3) {
        GLSim.error("Exactly three vertex coordinates are required by glVertex3*"); return;
    }
    if (isNaN(Number(x)+Number(y)+Number(z))) {
        GLSim.error("parameters to glVertex* must be numeric"); return;
    }
    var context = GLSim.currentContext;
    context.primitiveData.vertices.push(Number(x),Number(y),Number(z));
    context.primitiveData.vertexColors.push(context.color[0],context.color[1],context.color[2],context.color[3]);
    context.primitiveData.vertexNormals.push(context.normal[0],context.normal[1],context.normal[2]);
}
var glVertex3d = glVertex3f;
var glVertex3i = glVertex3f;
function glVertex2f(x,y) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (arguments.length != 2) {
        GLSim.error("Exactly two vertex coordinates are required by glVertex2*"); return;
    }
    glVertex3f(x,y,0);
}
var glVertex2d = glVertex2f;
var glVertex2i = glVertex2f;

function glRectf(x1,y1,x2,y2) {
    if (isNaN(Number(x1)+Number(x2)+Number(y1)+Number(y2))) {
        GLSim.error("glRect* requires 4 numeric arguments"); return;
    }
    glBegin(GL_TRIANGLE_FAN);
    glVertex2f(x1,y1);
    glVertex2f(x2,y1);
    glVertex2f(x2,y2);
    glVertex2f(x1,y2);
    glEnd();
}
var glRectd = glRectf;
var glRecti = glRectf;

function glMaterialfv(side,property,value) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (side != GL_FRONT && side != GL_BACK && side != GL_FRONT_AND_BACK) {
        GLSim.error("Unknown value for first argument to glMaterialfv"); return;
    }
    if (property == GL_SHININESS) {
        GLSim.error("Can't set GL_SHININESS with glMaterialfv")
    }
    if (property != GL_AMBIENT && property != GL_DIFFUSE &&
        property != GL_SPECULAR && property != GL_EMISSION && property != GL_AMBIENT_AND_DIFFUSE) {
        GLSim.error("Unknown value for second parameter to glMaterialfv"); return;
    }
    if (value.length && value.length == 3) {
        value = [value[0], value[1], value[2], 1];
    }
    if (!value.length || value.length != 4 ||
        isNaN(Number(value[0])+Number(value[1])+Number(value[2])+Number(value[3]))) {
        GLSim.error("Third argument to glMaterialfv must be an array of three or four numbers"); return;
    }
    var v = [Number(value[0]), Number(value[1]), Number(value[2])];
    var v4;
    if (property == GL_DIFFUSE || property == GL_AMBIENT_AND_DIFFUSE) {
        v4 = [Number(value[0]), Number(value[1]), Number(value[2]), Number(value[3])];
    }
    var m = GLSim.currentContext.frontMaterial;
    if (side == GL_FRONT || side == GL_FRONT_AND_BACK) {
        switch (property) {
            case GL_AMBIENT: m.ambient = v; break;
            case GL_DIFFUSE: m.diffuse = v4; break;
            case GL_AMBIENT_AND_DIFFUSE: m.ambient = v; m.diffuse = v4; break;
            case GL_SPECULAR: m.specular = v; break;
            case GL_EMISSION: m.emission = v; break;
        }
    }
    m = GLSim.currentContext.backMaterial;
    if (side == GL_BACK || side == GL_FRONT_AND_BACK) {
        switch (property) {
            case GL_AMBIENT: m.ambient = v; break;
            case GL_DIFFUSE: m.diffuse = v4; break;
            case GL_AMBIENT_AND_DIFFUSE: m.ambient = v; m.diffuse = v4; break;
            case GL_SPECULAR: m.specular = v; break;
            case GL_EMISSION: m.emission = v; break;
        }
    }
}
function glMateriali(side,property,value) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (side != GL_FRONT && side != GL_BACK && side != GL_FRONT_AND_BACK) {
        GLSim.error("Unknown value for first argument to glMateriali"); return;
    }
    if (property != GL_SHININESS) {
        GLSim.error("Second argument to glMateriali must be GL_SHININESS")
    }
    var v = Number(value);
    if (isNaN(v)) {
        GLSim.error("Third parameter to glMateriali must be numeric")
    }
    if (side == GL_FRONT || side == GL_FRONT_AND_BACK) {
        GLSim.currentContext.frontMaterial.shininess = v;
    }
    if (side == GL_BACK || side == GL_FRONT_AND_BACK) {
        GLSim.currentContext.backMaterial.shininess = v;
    }
    if (GLSim.currentContext.primitiveData) {
        GLSim.currentContext.primitiveData.materialChanged = true;
    }
}
var glMaterialf = glMateriali;

function glLightfv(light,property,value) { 
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    light = Math.round(Number(light));
    if (isNaN(light) || light < GL_LIGHT0 || light >= GL_LIGHT0 + GLSim.currentContext.light.length) {
        GLSim.error("Unknown light number for first argument to glLightfv"); return;
    }
    if (property != GL_AMBIENT && property != GL_DIFFUSE &&
        property != GL_SPECULAR && property != GL_POSITION) {
        GLSim.error("Unknown property for second parameter to glLightfv"); return;
    }
    var v = [Number(value[0]), Number(value[1]), Number(value[2])];
    if ( isNaN(v[0]+v[1]+v[2]) || (value.length == 4 && isNaN(Number(value[3]))) ){
        GLSim.error("Third argument to glLightfv must be an array of three or four numbers"); return;
    }
    var li = GLSim.currentContext.light[light - GL_LIGHT0];
    switch (property) {
        case GL_POSITION: li.position = v; break;
        case GL_AMBIENT: li.ambient = v; break;
        case GL_DIFFUSE: li.diffuse = v; break;
        case GL_SPECULAR: li.specular = v; break;
    }
    if (property == GL_POSITION) {
        v.push( value.length == 4? Number(value[3]) : 0);
        mat4.applyToVec4(v,v,GLSim.currentContext.modelviewMatrix);
    }
}

function glLightModelfv(property, value) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (property != GL_LIGHT_MODEL_AMBIENT) {
        GLSim.error("Only GL_LIGHT_MODEL_AMBIENT is supported as the first argument of glLightModelfv"); return;
    }
    var v = [Number(value[0]), Number(value[1]), Number(value[2])];
    if (isNaN(value[0]+value[1]+value[2])) {
        GLSim.error("Values for glLightModelfv must be numeric"); return;
    }
    GLSim.currentContext.lightModelAmbient = v;
}
var glLightModeliv = glLightModelfv;
function glLightModeli(property, value) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (property != GL_LIGHT_MODEL_TWO_SIDE && property != GL_LIGHT_MODEL_LOCAL_VIEWER) {
        GLSim.error("First argument of glLightModeli must be GL_LIGHT_MODEL_TWO_SIDE or GL_LIGHT_MODEL_LOCAL_VIEWER"); return;
    }
    if (arguments.length != 2) {
        GLSim.error("glLightModeli requires two arguments"); return;
    }
    if (property == GL_LIGHT_MODEL_LOCAL_VIEWER) {
        GLSim.currentContext.lightModelLocalViewer = value ? 1 : 0;
    }
    else {
        GLSim.currentContext.lightModelTwoSide = value ? 1 : 0;
    }
}
var glLightModelf = glLightModeli;

function glPushMatrix() {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (GLSim.currentContext.matrixMode == GL_MODELVIEW) {
        GLSim.currentContext.modelviewStack.push( mat4.clone(GLSim.currentContext.modelviewMatrix) );
    }
    else {
        GLSim.currentContext.projectionStack.push( mat4.clone(GLSim.currentContext.projectionMatrix) );
    }
}
function glPopMatrix() {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (GLSim.currentContext.matrixMode == GL_MODELVIEW) {
        if (GLSim.currentContext.modelviewStack.length > 0) {
           GLSim.currentContext.modelviewMatrix = GLSim.currentContext.modelviewStack.pop();
        }
        else {
            GLSim.error("Attempt to pop from an empty modelview matrix stack"); return;
        }
    }
    else {
        if (GLSim.currentContext.projectionStack.length > 0) {
           GLSim.currentContext.projectionMatrix = GLSim.currentContext.projectionStack.pop();
        }
        else {
            GLSim.error("Attempt to pop from an empty projection matrix stack"); return;
        }
    }
}
function glMatrixMode(mode) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (mode != GL_PROJECTION && mode != GL_MODELVIEW) {
        GLSim.error("Unknown matrix mode in glMatrixMode"); return;
    }
    GLSim.currentContext.matrixMode = mode;
}

function glLoadIdentity() {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    mat4.identity(GLSim.currentContext.currentMatrix());
}
function glRotatef(degrees, axis_x, axis_y, axis_z) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    degrees = Number(degrees);
    axis_x = Number(axis_x);
    axis_y = Number(axis_y);
    axis_z = Number(axis_z);
    if (isNaN(degrees+axis_x+axis_y+axis_z)) {
        GLSim.error("glRotate* requires four numeric arguments."); return;
    }
    var mat = GLSim.currentContext.currentMatrix();
    mat4.rotate(mat,mat,degrees/180*Math.PI,[axis_x,axis_y,axis_z]);
}
var glRotated =glRotatef;
function glTranslatef(dx,dy,dz) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    dx = Number(dx);
    dy = Number(dy);
    dz = Number(dz);
    if (isNaN(dx+dy+dz)) {
        GLSim.error("glTranslate* requires three numeric arguments."); return;
    }
    var mat = GLSim.currentContext.currentMatrix();
    mat4.translate(mat,mat,[dx,dy,dz]);
}
var glTranslated = glTranslatef;
function glScalef(sx,sy,sz) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    sx = Number(sx);
    sy = Number(sy);
    sz = Number(sz);
    if (isNaN(sx+sy+sz)) {
        GLSim.error("glScale* requires three numeric arguments."); return;
    }
    var mat = GLSim.currentContext.currentMatrix();
    mat4.scale(mat,mat,[sx,sy,sz]);
}
var glScaled = glScalef;
function glMulMatrix(matrix) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    matrix = new Float32Array(matrix);
    if (matrix.length < 16) {
        GLSim.error("glMulMatrix requires an array of 16 numbers"); return;
    }
    for (var i = 0; i < 16; i++) {
        if (isNaN(matrix[i])) {
            GLSim.error("glMulMatrix requires an array of 16 numbers"); return;
        }
    }
    var mat = GLSim.currentContext.currentMatrix();
    mat4.multiply(mat,mat,matrix);
}

function glOrtho2D(xmin,xmax,ymin,ymax) {
    glOrtho(xmin,xmax,ymin,ymax,-1,1);
}
function glOrtho(xmin,xmax,ymin,ymax,near,far) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    xmin = Number(xmin);
    xmax = Number(xmax);
    ymin = Number(ymin);
    ymax = Number(ymax);
    near = Number(near);
    far = Number(far);
    if (isNaN(xmin+xmax+ymin+ymax+near+far)) {
        GLSim.error("glOrtho requires six numeric paramters"); return;
    }
    var mat = GLSim.currentContext.currentMatrix();
    var proj = mat4.create();
    mat4.ortho(proj,xmin,xmax,ymin,ymax,near,far);
    mat4.multiply(mat,mat,proj);
}
function glFrustum(xmin,xmax,ymin,ymax,near,far) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    xmin = Number(xmin);
    xmax = Number(xmax);
    ymin = Number(ymin);
    ymax = Number(ymax);
    near = Number(near);
    far = Number(far);
    if (isNaN(xmin+xmax+ymin+ymax+near+far)) {
        GLSim.error("glFrustum requires six numeric paramters"); return;
    }
    var mat = GLSim.currentContext.currentMatrix();
    var proj = mat4.create();
    mat4.frustum(proj,xmin,xmax,ymin,ymax,near,far);
    mat4.multiply(mat,mat,proj);
}
function gluPerspective(fovy, aspect, near, far) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    fovy = Number(fovy);
    aspect = Number(aspect);
    near = Number(near);
    far = Number(far);
    if (isNaN(fovy+aspect+near+far)) {
        GLSim.error("gluPerspective requires nine numeric parameters"); return;
    }
    fovy = fovy/180*Math.PI;
    var mat = GLSim.currentContext.currentMatrix();
    var proj = mat4.create();
    mat4.perspective(proj,fovy, aspect, near, far);
    mat4.multiply(mat,mat,proj);
}
function gluLookAt( eyeX,eyeY,eyeZ, refX,refY,refZ, upX,upY,ypZ ) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    eyeX = Number(eyeX);
    eyeY = Number(eyeY);
    eyeZ = Number(eyeZ);
    refX = Number(refX);
    refY = Number(refY);
    refZ = Number(refZ);
    upX = Number(upX);
    upY = Number(upY);
    upZ = Number(upZ);
    if (isNaN(eyeX+eyeY+eyeZ+refX+refY+refZ+upX+upY+upZ)) {
        GLSim.error("gluLookAt requires nine numeric parameters"); return;
    }
    var mat = GLSim.currentContext.currentMatrix();
    var proj = mat4.create();
    mat4.lookAt(proj,[eyeX,eyeY,eyeZ],[refX,refY,refZ],[upX,upY,upZ]);
    mat4.multiply(mat,mat,proj);
}

function glBegin(kind) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    var context = GLSim.currentContext;
    if (context.primitiveData) {
        GLSim.error("Calls to begin cannot be nested"); return;
    }
    if (kind != GL_POINTS && kind != GL_LINES && kind != GL_LINE_LOOP && kind != GL_LINE_STRIP &&
        kind != GL_TRIANGLES && kind != GL_TRIANGLE_STRIP && kind != GL_TRIANGLE_FAN &&
        kind != GL_QUADS && kind != GL_QUAD_STRIP && kind != GL_POLYGON) {
        GLSim.error("Unsupported primitive type in glBegin"); return;
    }
    context.primitiveData = {
        kind: kind,
        vertices: [],
        vertexNormals: [],
        vertexColors: [],
        vertexMaterials: [],
        colorChanged: false,
        materialChanged: false
    }
}

function glEnd() {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    var context = GLSim.currentContext;
    if (!context.primitiveData) {
        GLSim.error("glEnd with no matching glBegin"); return;
    }
    var data = context.primitiveData;
    context.primitiveData = null;
    var gl = GLSim.currentContext.gl;
    var kind = context._convertPrimitiveType(data.kind);
    var coords, normals, colors;
    if (data.kind == GL_QUADS) {
        coords = context._fixArrayForGL_QUADS(data.vertices, 3);
        normals = context._fixArrayForGL_QUADS(data.vertexNormals, 3);
        colors = context._fixArrayForGL_QUADS(data.vertexColors, 4);
    }
    else {
        coords = new Float32Array(data.vertices);
        normals = new Float32Array(data.vertexNormals);
        colors = new Float32Array(data.vertexColors);
    }
    context._applyContextToShaderProgram(kind);
    gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.coords);
    gl.bufferData(gl.ARRAY_BUFFER, coords, gl.STREAM_DRAW);
    gl.vertexAttribPointer(context.location.coords, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.normal);
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STREAM_DRAW);
    gl.vertexAttribPointer(context.location.normal, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.color);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STREAM_DRAW);
    gl.vertexAttribPointer(context.location.color, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(context.location.coords);
    gl.enableVertexAttribArray(context.location.color);
    gl.enableVertexAttribArray(context.location.normal);
    gl.drawArrays(kind, 0, coords.length/3);
}

function glVertexPointer(coordsPerVertex, dataType, stride, vertexArray) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (coordsPerVertex != 3 && coordsPerVertex != 2) {
        GLSim.error("The first parameter (coordsPerVertex) to glVertexPointer must be 2 or 3"); return;
    }
    if (dataType != GL_FLOAT && dataType != GL_INT && dataType != GL_DOUBLE) {
        GLSim.error("The second parameter (dataType) to glVertexPointer must be GL_FLOAT, GL_INT, or GL_DOUBLE"); return;
    }
    if (stride != 0) {
        GLSim.error("The third parameter (stride) to glVertexPointer must be 0"); return;
    }
    if (!vertexArray || !vertexArray.length) {
        GLSim.error("The fourth argument to glVertexPointer must be an array of numbers or a typed array"); return;
    }
    if (coordsPerVertex == 2) {  // add 0 as z-coord to each two-component vertex
        var newarray = new Float32Array( Math.floor((vertexArray.length/2) * 3) );
        var j = 0;
        for (var i = 0; i < vertexArray.length; i += 2) {
            newarray[j] = vertexArray[i];
            newarray[j+1] = vertexArray[i+1];
            newarray[j+2] = 0;
            j += 3;
        }
        vertexArray = newarray;
    }
    else if ( !(vertexArray instanceof Float32Array) ) {
        vertexArray = new Float32Array(vertexArray);
    }
    GLSim.currentContext.arraysForDrawArrays.vertexArray = vertexArray;
}

function glColorPointer(componentsPerColor, dataType, stride, colorArray) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (componentsPerColor != 3 && componentsPerColor != 4) {
        GLSim.error("The first parameter (componentsPerColor) to glColorPointer must be 3 or 4"); return;
    }
    if (dataType != GL_FLOAT && dataType != GL_DOUBLE && dataType != GL_INT && dataType != GL_UNSIGNED_BYTE) {
        GLSim.error("The third parameter (dataType) to glColorPointer must be GL_FLOAT, GL_INT, GL_DOUBLE, or GL_UNSIGNED_BYTE"); return;
    }
    if (stride != 0) {
        GLSim.error("The second parameter (stride) to glColorPointer must be 0"); return;
    }
    if (!colorArray || !colorArray.length) {
        GLSim.error("The fourth argument to glColorPointer must be an array of numbers or a typed array"); return;
    }
    if (dataType == GL_UNSIGNED_BYTE) {  // scale 0 to 255 to the range 0.0 to 1.0
        for (var k = 0; k < colorArray.length; k++) {
            colorArray[k] = colorArray[k]/255;
        }
    }
    if (componentsPerColor == 3) {  // add 1 as alpha component to each three-component color
        var newarray = new Float32Array( Math.floor((colorArray.length/3) * 4) );
        var j = 0;
        for (var i = 0; i < colorArray.length; i += 3) {
            newarray[j] = colorArray[i];
            newarray[j+1] = colorArray[i+1];
            newarray[j+2] = colorArray[i+2];
            newarray[j+3] = 1;
            j += 4;
        }
        colorArray = newarray;
    }
    else if ( !(colorArray instanceof Float32Array) ) {
        colorArray = new Float32Array(colorArray);
    }
    GLSim.currentContext.arraysForDrawArrays.colorArray = colorArray;
}

function glNormalPointer(dataType, stride, normalArray) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (dataType != GL_FLOAT && dataType != GL_INT && dataType != GL_DOUBLE) {
        GLSim.error("The first parameter (dataType) to glNormalPointer must be GL_FLOAT, GL_INT, or GL_DOUBLE"); return;
    }
    if (stride != 0) {
        GLSim.error("The second parameter (stride) to glNormalPointer must be 0"); return;
    }
    if (!normalArray || !normalArray.length) {
        GLSim.error("The fourth argument to glNormalPointer must be an array of numbers or a typed array"); return;
    }
    else if (normalArray instanceof Float32Array) {
        GLSim.currentContext.arraysForDrawArrays.normalArray = normalArray;
    }
    else {
        GLSim.currentContext.arraysForDrawArrays.normalArray = new Float32Array(normalArray);
    }
}

function glDrawArrays(primitive, start, count) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    start = Math.round(Number(start));
    count = Math.round(Number(count));
    if (isNaN(start+count)){
        GLSim.error("start and count for glDrawArrays must be integers"); return;
    }
    var context = GLSim.currentContext;
    var gl = context.gl;
    var coordArray = context.arraysForDrawArrays.vertexArray;
    if (coordArray == null || !context.enabledClientState[GL_VERTEX_ARRAY]) {// can't actually draw without coordinates!
        return;
    }
    var colorArray = context.arraysForDrawArrays.colorArray;
    var normalArray = context.arraysForDrawArrays.normalArray;
    var kind = context._convertPrimitiveType(primitive);
    if (kind < 0) {
        GLSim.error("unknown primiitve type in glDrawArrays"); return;
    }
    if (primitive == GL_QUADS) {
        if (coordArray) {
            coordArray = context._fixArrayForGL_QUADS(coordArray, 3);
        }
        if (colorArray) {
            colorArray = context._fixArrayForGL_QUADS(colorArray, 3);
        }
        if (normalArray) {
            normalArray = context._fixArrayForGL_QUADS(normalArray, 3);
        }
    }
    context._applyContextToShaderProgram(kind);
    gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.coords);
    gl.bufferData(gl.ARRAY_BUFFER, coordArray, gl.STREAM_DRAW);
    gl.vertexAttribPointer(context.location.coords, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(context.location.coords);
    if (context.enabledClientState[GL_NORMAL_ARRAY] && normalArray) {
        gl.enableVertexAttribArray(context.location.normal);
        gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.normal);
        gl.bufferData(gl.ARRAY_BUFFER, normalArray, gl.STREAM_DRAW);
        gl.vertexAttribPointer(context.location.normal, 3, gl.FLOAT, false, 0, 0);
    }
    else {
        gl.disableVertexAttribArray(context.location.normal);
        gl.vertexAttrib3fv(context.location.normal, context.normal);
    }
    if (context.enabledClientState[GL_COLOR_ARRAY] && colorArray) {
        gl.enableVertexAttribArray(context.location.color);
        gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.color);
        gl.bufferData(gl.ARRAY_BUFFER, colorArray, gl.STREAM_DRAW);
        gl.vertexAttribPointer(context.location.color, 4, gl.FLOAT, false, 0, 0);
    }
    else {
        gl.disableVertexAttribArray(context.location.color);
        gl.vertexAttrib3fv(context.location.color, context.color);
    }
    gl.drawArrays(kind, start, count);
}

function glDrawElements(primitive, vertexCount, indexType, indexArray) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    vertexCount = Math.round(Number(vertexCount));
    if (isNaN(vertexCount)){
        GLSim.error("the count for glDrawElements must be an integer"); return;
    }
    if (!indexArray || !indexArray.length) {
        GLSim.error("the fourth parameter to glDrawElements must be an array"); return;
    }
    var context = GLSim.currentContext;
    var gl = context.gl;
    var coordArray = context.arraysForDrawArrays.vertexArray;
    if (coordArray == null || !context.enabledClientState[GL_VERTEX_ARRAY]) {// can't actually draw without coordinates!
        return;
    }
    var colorArray = context.arraysForDrawArrays.colorArray;
    var normalArray = context.arraysForDrawArrays.normalArray;
    var kind = context._convertPrimitiveType(primitive);
    if (kind < 0) {
        GLSim.error("unknown primiitve type in glDrawElements"); return;
    }
    if (primitive == GL_QUADS) {
        indexArray = context.__fixArrayForGL_QUADS(indexArray,1);
    }
    if (! (indexArray instanceof Uint16Array)) {
        indexArray = new Uint16Array(indexArray);
    }
    context._applyContextToShaderProgram(kind);
    gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.coords);
    gl.bufferData(gl.ARRAY_BUFFER, coordArray, gl.STREAM_DRAW);
    gl.vertexAttribPointer(context.location.coords, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(context.location.coords);
    if (context.enabledClientState[GL_NORMAL_ARRAY] && normalArray) {
        gl.enableVertexAttribArray(context.location.normal);
        gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.normal);
        gl.bufferData(gl.ARRAY_BUFFER, normalArray, gl.STREAM_DRAW);
        gl.vertexAttribPointer(context.location.normal, 3, gl.FLOAT, false, 0, 0);
    }
    else {
        gl.disableVertexAttribArray(context.location.normal);
        gl.vertexAttrib3fv(context.location.normal, context.normal);
    }
    if (context.enabledClientState[GL_COLOR_ARRAY] && colorArray) {
        gl.enableVertexAttribArray(context.location.color);
        gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.color);
        gl.bufferData(gl.ARRAY_BUFFER, colorArray, gl.STREAM_DRAW);
        gl.vertexAttribPointer(context.location.color, 4, gl.FLOAT, false, 0, 0);
    }
    else {
        gl.disableVertexAttribArray(context.location.color);
        gl.vertexAttrib3fv(context.location.color, context.color);
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, context.buffer.index);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexArray, gl.STREAM_DRAW);
    gl.drawElements(kind, vertexCount, gl.UNSIGNED_SHORT, 0);
}

/*---------------------- glsim utility functions ------------------------------*/

function glsimUse(canvas, webglOptions) {
    if (!canvas) {
        GLSim.error("glsimUse requires a parameter to specify the canvas"); return;
    }
    var thecanvas = null;
    if (typeof canvas == "string") {
        thecanvas = document.getElementById(canvas);
        if (!thecanvas || ! thecanvas.getContext) {
            GLSim.error("glsimUse requires a canvas element or an ID for a canvas element"); return;
        }
    }
    else if (typeof canvas == 'object' && canvas.getContext) {
        thecanvas = canvas; 
    }
    else {
        GLSim.error("GLSim parameter must be a canvas element or an ID for a canvas element"); return;
    }
    if (thecanvas._glsimContext) {
        GLSim.currentContext = thecanvas._gslsimContext;
    }
    else {
        var options = (webglOptions === undefined)? { preserveDrawingBuffer: true } : webglOptions;
        new GLSim(canvas,options);
    }
}

function glsimDrawFunc(callback) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (callback != null && ! (typeof callback == "function")) {
        GLSim.error("A DrawFunc must be a function."); return;
    }
    GLSim.currentContext._drawFunc = callback;
}

function glsimRedisplay() {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (GLSim.currentContext._drawFunc) {
        GLSim.currentContext._drawFunc();
    }
}

function glsimInstallRotator(viewDirectionVector, viewUpVector, viewDistance) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    GLSim.currentContext._rotator = new SimpleRotator(GLSim.currentContext.canvas,
                   doRotate, viewDirectionVector, viewUpVector, viewDistance);
    doRotate();
    function doRotate() {
        GLSim.currentContext.modelviewMatrix = GLSim.currentContext._rotator.getViewMatrix();
        if (GLSim.currentContext._drawFunc) {
            GLSim.currentContext._drawFunc();
        }
    }
}

function glsimDrawModel(ifsModel) {  // ifsModel must have structure of objects from basic-objects-IFS.js
    var saveV = GLSim.currentContext.enabledClientState[GL_VERTEX_ARRAY];
    var saveN = GLSim.currentContext.enabledClientState[GL_NORMAL_ARRAY];
    glEnableClientState(GL_VERTEX_ARRAY);
    glVertexPointer(3,GL_FLOAT,0,ifsModel.vertexPositions);
    glEnableClientState(GL_NORMAL_ARRAY);
    glNormalPointer(GL_FLOAT, 0, ifsModel.vertexNormals);
    glDrawElements(GL_TRIANGLES, ifsModel.indices.length, GL_UNSIGNED_BYTE, ifsModel.indices);
    if (!GLSim.currentContext.enabledClientState[GL_VERTEX_ARRAY]) {
        glDisableClientState(GL_VERTEX_ARRAY);
    }
    if (!GLSim.currentContext.enabledClientState[GL_NORMAL_ARRAY]) {
       glDisableClientState(GL_NORMAL_ARRAY);
    }
}


/*------------- SimpleRotator, which can be used independently or through glsimInstallRotator -----*

/**
 * An object of type SimpleRotator can be used to implement a trackball-like mouse rotation
 * of a WebGL scene about the origin. Only the first parameter to the constructor is required.
 * When an object is created, mouse event handlers are set up on the canvas to respond to rotation.
 * The class defines the following methods for an object rotator of type SimpleRotator:
 *    rotator.setView(viewDirectionVector, viewUpVector, viewDistance) set up the view, where the
 * parameters are optional and are used in the same way as the corresponding parameters in the constructor;
 *    rotator.setViewDistance(viewDistance) sets the distance of the viewer from the origin without
 * changing the direction of view;
 *    rotator.getViewDistance() returns the viewDistance;
 *    rotator.getViewMatrix() returns a Float32Array representing the viewing transformation matrix
 * for the current view, suitable for use with gl.uniformMatrix4fv or for further transformation with
 * the glmatrix library mat4 class;
 *    rotator.getViewMatrixArray() returns the view transformation matrix as a regular JavaScript
 * array, but still represents as a 1D array of 16 elements, in column-major order.
 *
 * @param canvas the HTML canvas element used for WebGL drawing. The user will rotate the
 *    scene by dragging the mouse on this canvas. This parameter is required.
 * @param callback if present must be a function, which is called whenever the rotation changes.
 *    It is typically the function that draws the scene
 * @param viewDirectionVector if present must be an array of three numbers, not all zero. The
 *    view is from the direction of this vector towards the origin (0,0,0). If not present,
 *    the value [0,0,10] is used.
 * @param viewUpVector if present must be an array of three numbers. Gives a vector that will
 *    be seen as pointing upwards in the view. If not present, the value is [0,1,0].
 * @param viewDistance if present must be a positive number. Gives the distance of the viewer
 *    from the origin. If not present, the length of viewDirectionVector is used.
 */
function SimpleRotator(canvas, callback, viewDirectionVector, viewUpVector, viewDistance) {
    var unitx = new Array(3);
    var unity = new Array(3);
    var unitz = new Array(3);
    var viewZ;
    this.setView = function( viewDirectionVector, viewUpVector, viewDistance ) {
        var viewpoint = viewDirectionVector || [0,0,10];
        var viewup = viewUpVector || [0,1,0];
	if (viewDistance && typeof viewDistance == "number")
	    viewZ = viewDistance;
	else
	    viewZ = length(viewpoint);
        copy(unitz,viewpoint);
        normalize(unitz, unitz);
        copy(unity,unitz);
        scale(unity, unity, dot(unitz,viewup));
        subtract(unity,viewup,unity);
        normalize(unity,unity);
        cross(unitx,unity,unitz);
    }
    this.getViewMatrix = function (){
        return new Float32Array( this.getViewMatrixArray() );
    }
    this.getViewMatrixArray = function() {
	return [ unitx[0], unity[0], unitz[0], 0,
            unitx[1], unity[1], unitz[1], 0, 
            unitx[2], unity[2], unitz[2], 0,
	    0, 0, -viewZ, 1 ];
    }
    this.getViewDistance = function() {
	return viewZ;
    }
    this.setViewDistance = function(viewDistance) {
	viewZ = viewDistance;
    }
    function applyTransvection(e1, e2) {  // rotate vector e1 onto e2
        function reflectInAxis(axis, source, destination) {
        	var s = 2 * (axis[0] * source[0] + axis[1] * source[1] + axis[2] * source[2]);
		    destination[0] = s*axis[0] - source[0];
		    destination[1] = s*axis[1] - source[1];
		    destination[2] = s*axis[2] - source[2];
        }
        normalize(e1,e1);
        normalize(e2,e2);
        var e = [0,0,0];
        add(e,e1,e2);
        normalize(e,e);
        var temp = [0,0,0];
        reflectInAxis(e,unitz,temp);
	reflectInAxis(e1,temp,unitz);
	reflectInAxis(e,unitx,temp);
	reflectInAxis(e1,temp,unitx);
	reflectInAxis(e,unity,temp);
	reflectInAxis(e1,temp,unity);
    }
    var centerX = canvas.width/2;
    var centerY = canvas.height/2;
    var radius = Math.min(centerX,centerY);
    var radius2 = radius*radius;
    var prevx,prevy;
    var prevRay = [0,0,0];
    var dragging = false;
    function doMouseDown(evt) {
        if (dragging)
           return;
        dragging = true;
        document.addEventListener("mousemove", doMouseDrag, false);
        document.addEventListener("mouseup", doMouseUp, false);
        var box = canvas.getBoundingClientRect();
        prevx = evt.clientX - box.left;
        prevy = evt.clientY - box.top;
    }
    function doMouseDrag(evt) {
        if (!dragging)
           return;
        var box = canvas.getBoundingClientRect();
        var x = evt.clientX - box.left;
        var y = evt.clientY - box.top;
        var ray1 = toRay(prevx,prevy);
        var ray2 = toRay(x,y);
        applyTransvection(ray1,ray2);
        prevx = x;
        prevy = y;
	if (callback) {
	    callback();
	}
    }
    function doMouseUp(evt) {
        if (dragging) {
            document.removeEventListener("mousemove", doMouseDrag, false);
            document.removeEventListener("mouseup", doMouseUp, false);
	    dragging = false;
        }
    }
    function toRay(x,y) {
       var dx = x - centerX;
       var dy = centerY - y;
       var vx = dx * unitx[0] + dy * unity[0];  // The mouse point as a vector in the image plane.
       var vy = dx * unitx[1] + dy * unity[1];
       var vz = dx * unitx[2] + dy * unity[2];
       var dist2 = vx*vx + vy*vy + vz*vz;
       if (dist2 > radius2) {
          return [vx,vy,vz];
       }
       else {
          var z = Math.sqrt(radius2 - dist2);
          return  [vx+z*unitz[0], vy+z*unitz[1], vz+z*unitz[2]];
        }
    }
    function dot(v,w) {
	return v[0]*w[0] + v[1]*w[1] + v[2]*w[2];
    }
    function length(v) {
	return Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
    }
    function normalize(v,w) {
	var d = length(w);
	v[0] = w[0]/d;
	v[1] = w[1]/d;
	v[2] = w[2]/d;
    }
    function copy(v,w) {
	v[0] = w[0];
	v[1] = w[1];
	v[2] = w[2];
    }
    function add(sum,v,w) {
	sum[0] = v[0] + w[0];
	sum[1] = v[1] + w[1];
	sum[2] = v[2] + w[2];
    }
    function subtract(dif,v,w) {
	dif[0] = v[0] - w[0];
	dif[1] = v[1] - w[1];
	dif[2] = v[2] - w[2];
    }
    function scale(ans,v,num) {
	ans[0] = v[0] * num;
	ans[1] = v[1] * num;
	ans[2] = v[2] * num;
    }
    function cross(c,v,w) {
	var x = v[1]*w[2] - v[2]*w[1];
	var y = v[2]*w[0] - v[0]*w[2];
	var z = v[0]*w[1] - v[1]*w[0];
	c[0] = x;
	c[1] = y;
	c[2] = z;
    }
    this.setView(viewDirectionVector, viewUpVector, viewDistance);
    canvas.addEventListener("mousedown", doMouseDown, false);
}

