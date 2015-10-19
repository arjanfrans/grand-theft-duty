class Vector2 {
    constructor (x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    /**
     * Copy values of another Vector2 into this Vector2.
     *
     * @param {Vector2} vector - Vector2 to copy from.
     *
     * @returns {Vector2} Reference to this Vector2.
     */
    copy (vector) {
        this.x = vector.x;
        this.y = vector.y;

        return this;
    }

    clone () {
        return new Vector2(this.x, this.y);
    }

    /**
     * Add another Vector2 to this Vector2.
     *
     * @param {Vector2} vector - Other Vector2.
     *
     * @returns {Vector2} Reference to this Vector2.
     */
    add (vector) {
        this.x += vector.x;
        this.y += vector.y;

        return this;
    }

    /**
     * Subtract another Vector2 from this Vector2.
     *
     * @param {Vector2} vector - Other Vector2.
     *
     * @returns {Vector2} Reference to this Vector2.
     */
    sub (vector) {
        this.x -= vector.x;
        this.y -= vector.y;

        return this;
    }
}
