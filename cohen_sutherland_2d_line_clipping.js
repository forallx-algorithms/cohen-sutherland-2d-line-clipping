const LEFT_CODE = 8;
const RIGHT_CODE = 4;
const BOTTOM_CODE = 2;
const TOP_CODE = 1;

const calculateLineintersection = (g1, g2, t1, t2) => {
    const a1 = g2[1] - g1[1];
    const b1 = g1[0] - g2[0];
    const c1 = a1 * g1[0] + b1 * g1[1];

    const a2 = t2[1] - t1[1];
    const b2 = t1[0] - t2[0];
    const c2 = a2 * t1[0] + b2 * t1[1];

    const d = a1 * b2 - a2 * b1;

    if (Math.abs(d) > 1e-6) {
        const x = (b2 * c1 - b1 * c2) / d;
        const y = (c2 * a1 - c1 * a2) / d;
        return [x, y];
    } else {
        throw new Error(`Lines are parralel or collinear g=[${g1} ${g2}] t=[${t1} ${t2}]`);
    }
};

/**
 * @param {number} code Code for a point
 * @param {[number, number]} g1 First point of a line
 * @param {[number, number]} g2 Second point of a line
 * @param {number} xmin Minimum x value of the clipping window
 * @param {number} xmax Maximum x value of the clipping window
 * @param {number} ymin Minimum y value of the clipping window
 * @param {number} ymax Maximum y value of the clipping window
 * @returns {[number, number]} Intersection point
 */
const clipLineByCode = (code, g1, g2, xmin, xmax, ymin, ymax) => {
    if ((code & LEFT_CODE) !== 0) {
        return calculateLineintersection(g1, g2, [xmin, ymin], [xmin, ymax]);
    } else if ((code & RIGHT_CODE) !== 0) {
        return calculateLineintersection(g1, g2, [xmax, ymin], [xmax, ymax]);
    } else if ((code & BOTTOM_CODE) !== 0) {
        return calculateLineintersection(g1, g2, [xmin, ymin], [xmax, ymin]);
    } else {
        return calculateLineintersection(g1, g2, [xmin, ymax], [xmax, ymax]);
    }
};

/**
 * @param {[number, number]} p Point
 * @param {number} xmin Minimum x value of the clipping window
 * @param {number} xmax Maximum x value of the clipping window
 * @param {number} ymin Minimum y value of the clipping window
 * @param {number} ymax Maximum y value of the clipping window
 * @returns {number} Code for a given point
 */
const calculateCodeForPoint = (p, xmin, xmax, ymin, ymax) => {
    let result = 0;

    if (p[0] < xmin) {
        result |= LEFT_CODE;
    } else if (p[0] > xmax) {
        result |= RIGHT_CODE;
    }

    if (p[1] < ymin) {
        result |= BOTTOM_CODE;
    } else if (p[1] > ymax) {
        result |= TOP_CODE;
    }

    return result;
};

/**
 * @param {[number, number]} g1 First point of a line
 * @param {[number, number]} g2 Second point of a line
 * @param {[number, number]} windowA First point of the window
 * @param {[number, number]} windowB Second point of the window
 * @returns {[[number, number], [number, number]] | null} clipped line or null if line is completely outside clipping window
 */
const cohenSutherland2dLineClipping = (g1, g2, windowA, windowB) => {
    const xmin = Math.min(windowA[0], windowB[0]);
    const xmax = Math.max(windowA[0], windowB[0]);
    const ymin = Math.min(windowA[1], windowB[1]);
    const ymax = Math.max(windowA[1], windowB[1]);

    let g1code = calculateCodeForPoint(g1, xmin, xmax, ymin, ymax);
    let g2code = calculateCodeForPoint(g2, xmin, xmax, ymin, ymax);

    while (true) {
        if ((g1code | g2code) === 0) {
            return [g1, g2];
        } else if ((g1code & g2code) !== 0) {
            return null;
        } else if (g1code !== 0) {
            g1 = clipLineByCode(g1code, g1, g2, xmin, xmax, ymin, ymax);
            g1code = calculateCodeForPoint(g1, xmin, xmax, ymin, ymax);
        } else {
            g2 = clipLineByCode(g2code, g1, g2, xmin, xmax, ymin, ymax);
            g2code = calculateCodeForPoint(g2, xmin, xmax, ymin, ymax);
        }
    };
};

module.exports = {
    cohenSutherland2dLineClipping
};
