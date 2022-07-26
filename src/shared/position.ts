export class Position {
	x: number;
	y: number;
	z: number;

	constructor(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	getAngleFromPositions(toPos: Position): number {
		// Returns angle in radians from 0 to 2Pi. -1 means positions are equal.
		const dx = toPos.x - this.x;
		const dy = toPos.y - this.y;
		if (dx == 0 && dy == 0) {
			return -1;
		}

		let angle = Math.atan2(dy * -1, dx);

		if (angle < 0) {
			angle += 2 * Math.PI;
		}

		return angle;
	}

	getDirectionFromPositions(toPos: Position, simple = false): number {
		const angle = this.getAngleFromPositions(toPos) * (180 / Math.acos(-1));

		if (angle >= 360 - 22.5 || angle < 0 + 22.5)
			return 1;

		if (angle >= 45 - 22.5 && angle < 45 + 22.5)
			return simple ? 1 : 4;

		if (angle >= 90 - 22.5 && angle < 90 + 22.5)
			return 0;

		if (angle >= 135 - 22.5 && angle < 135 + 22.5)
			return simple ? 3 : 7;

		if (angle >= 180 - 22.5 && angle < 180 + 22.5)
			return 3;

		if (angle >= 225 - 22.5 && angle < 225 + 22.5)
			return simple ? 3 : 6;

		if (angle >= 270 - 22.5 && angle < 270 + 22.5)
			return 2;

		if (angle >= 315 - 22.5 && angle < 315 + 22.5)
			return simple ? 1 : 5;

		return 8;
	}
}
