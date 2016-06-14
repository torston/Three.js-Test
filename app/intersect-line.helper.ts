class IntersectLineHelper {
    private static eps = 0.0000001;
    private static between(a: number, b: number, c: number): boolean {
        return a - IntersectLineHelper.eps <= b && b <= c + IntersectLineHelper.eps;
    }
    public static segment_intersection(lineOneStart: THREE.Vector2, lineOneEnd: THREE.Vector2, lineTwoStart: THREE.Vector2, lineTwoEnd: THREE.Vector2): boolean {
        var x = ((lineOneStart.x * lineOneEnd.y - lineOneStart.y * lineOneEnd.x) * (lineTwoStart.x - lineTwoEnd.x) - (lineOneStart.x - lineOneEnd.x) * (lineTwoStart.x * lineTwoEnd.y - lineTwoStart.y * lineTwoEnd.x)) /
            ((lineOneStart.x - lineOneEnd.x) * (lineTwoStart.y - lineTwoEnd.y) - (lineOneStart.y - lineOneEnd.y) * (lineTwoStart.x - lineTwoEnd.x));
        var y = ((lineOneStart.x * lineOneEnd.y - lineOneStart.y * lineOneEnd.x) * (lineTwoStart.y - lineTwoEnd.y) - (lineOneStart.y - lineOneEnd.y) * (lineTwoStart.x * lineTwoEnd.y - lineTwoStart.y * lineTwoEnd.x)) /
            ((lineOneStart.x - lineOneEnd.x) * (lineTwoStart.y - lineTwoEnd.y) - (lineOneStart.y - lineOneEnd.y) * (lineTwoStart.x - lineTwoEnd.x));
        if (isNaN(x) || isNaN(y)) {
            return false;
        } else {
            if (lineOneStart.x >= lineOneEnd.x) {
                if (!this.between(lineOneEnd.x, x, lineOneStart.x)) { return false; }
            } else {
                if (!this.between(lineOneStart.x, x, lineOneEnd.x)) { return false; }
            }
            if (lineOneStart.y >= lineOneEnd.y) {
                if (!this.between(lineOneEnd.y, y, lineOneStart.y)) { return false; }
            } else {
                if (!this.between(lineOneStart.y, y, lineOneEnd.y)) { return false; }
            }
            if (lineTwoStart.x >= lineTwoEnd.x) {
                if (!this.between(lineTwoEnd.x, x, lineTwoStart.x)) { return false; }
            } else {
                if (!this.between(lineTwoStart.x, x, lineTwoEnd.x)) { return false; }
            }
            if (lineTwoStart.y >= lineTwoEnd.y) {
                if (!this.between(lineTwoEnd.y, y, lineTwoStart.y)) { return false; }
            } else {
                if (!this.between(lineTwoStart.y, y, lineTwoEnd.y)) { return false; }
            }
        }
        return true;
    }
}