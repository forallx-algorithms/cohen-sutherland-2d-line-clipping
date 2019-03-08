const {expect} = require('chai');
const {cohenSutherland2dLineClipping} = require('./cohen_sutherland_2d_line_clipping');

describe('cohenSutherland2dLineClipping', () => {
    const windowA = [1, 2];
    const windowB = [2, 1];

    it('should return null if line to the left of clipping window', () => {
        const result = cohenSutherland2dLineClipping([0, 1], [0, 2], windowA, windowB);
        expect(result).to.eql(null);
    });

    it('should return null if line to the right of clipping window', () => {
        const result = cohenSutherland2dLineClipping([3, 1], [3, 2], windowA, windowB);
        expect(result).to.eql(null);
    });

    it('should return null if line at the bottom of clipping window', () => {
        const result = cohenSutherland2dLineClipping([1, 0], [2, 0], windowA, windowB);
        expect(result).to.eql(null);
    });

    it('should return null if line at the top of clipping window', () => {
        const result = cohenSutherland2dLineClipping([1, 3], [2, 3], windowA, windowB);
        expect(result).to.eql(null);
    });

    it('should clip line', () => {
        const result = cohenSutherland2dLineClipping([0, 3], [3, 0], windowA, windowB);
        expect(result).to.eql([[1, 2], [2, 1]]);
    });
});
