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
        return null;
    }
};

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

const clipLineAtPoint = (code, s, e, xmin, xmax, ymin, ymax) => {
    if (code & LEFT_CODE !== 0) {
        return calculateLineintersection(s, e, [xmin, ymin], [xmin, ymax]);
    } else if (code & RIGHT_CODE !== 0) {
        return calculateLineintersection(s, e, [xmax, ymin], [xmax, ymax]);
    } else if (code & BOTTOM_CODE !== 0) {
        return calculateLineintersection(s, e, [xmin, ymin], [xmax, ymin]);
    } else {
        return calculateLineintersection(s, e, [xmin, ymax], [xmax, ymax]);
    }
};

/**
 * @param {[number, number]} s
 * @param {[number, number]} e
 * @param {[number, number]} windowA First point of the window
 * @param {[number, number]} windowB Second point of the window
 * @returns {[[number, number], [number, number]] | null} clipped line or null if line is completely outside clipping window
 */
const cohenSutherland2dLineClipping = (s, e, windowA, windowB) => {
    const xmin = Math.min(windowA[0], windowB[0]);
    const xmax = Math.max(windowA[0], windowB[0]);
    const ymin = Math.min(windowA[1], windowB[1]);
    const ymax = Math.max(windowA[1], windowB[1]);

    let scode = calculateCodeForPoint(s);
    let ecode = calculateCodeForPoint(e);

    while (true) {
        if (scode | ecode === 0) {
            return [s, e];
        } else if (scode & ecode !== 0) {
            return null;
        } else if (scode !== 0) {
            s = clipLineAtPoint(scode, s, e, xmin, xmax, ymin, ymax);
            scode = calculateCodeForPoint(s, xmin, xmax, ymin, ymax);
        } else {
            e = clipLineAtPoint(ecode, s, e, xmin, xmax, ymin, ymax);
            ecode = calculateCodeForPoint(e, xmin, xmax, ymin, ymax);
        }
    };
};

module.exports = {
    cohenSutherland2dLineClipping
};
