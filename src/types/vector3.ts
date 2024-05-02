class Vector3 {
    x: number;
    y: number;
    z: number;

    public constructor(
        x: number = 0,
        y: number = 0,
        z: number = 0
    ) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public getVector(): [number, number, number] {
        return [this.x, this.y, this.z];
    }

    public setVector(x: number, y: number, z: number): void {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public equals(v3: Vector3): boolean {
        return this.x === v3.x && this.y === v3.y && this.z === v3.z;
    }

    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    // VECTOR OPERATIONS
    public add(v3: Vector3) {
        return new Vector3(this.x + v3.x, this.y + v3.y, this.z + v3.z);
    }

    public substract(v3: Vector3) {
        return new Vector3(this.x - v3.x, this.y - v3.y, this.z - v3.z);
    }

    public mul(factor: number) {
        return new Vector3(this.x * factor, this.y * factor, this.z * factor);
    }

    // VECTOR METHODS
    public cross(v3: Vector3): Vector3 {
        return new Vector3(
            this.y * v3.z - this.z * v3.y,
            this.z * v3.x - this.x * v3.z,
            this.x * v3.y - this.y * v3.x
        );
    }

    public dot(v3: Vector3): number {
        return this.x * v3.x + this.y * v3.y + this.z * v3.z;
    }

    public normalize(): Vector3 {
        const length = this.length();
        return new Vector3(this.x / length, this.y / length, this.z / length);
    }

    public multiplyScalar(scalar: number): Vector3 {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    public projectOnto(v3: Vector3): Vector3 {
        const scalar = this.dot(v3) / Math.pow(v3.length(), 2);
        return v3.multiplyScalar(scalar);
    }

    public angleTo(v3: Vector3): number {
        const dotProduct = this.dot(v3);
        const lengthProduct = this.length() * v3.length();
        return Math.acos(dotProduct / lengthProduct);
    }

    public scale(v3: Vector3): Vector3 {
        return new Vector3(this.x * v3.x, this.y * v3.y, this.z * v3.z);
    }
}

export default Vector3;
