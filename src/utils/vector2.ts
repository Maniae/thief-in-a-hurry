import { GameConfig } from "../config";

export type directionString = "right" | "up" | "left" | "down";

export class Vector2 {
	constructor(readonly x: number = 0, readonly y: number = 0) {}

	static copy(other: Vector2) {
		return new Vector2(other.x, other.y);
	}

	get norm(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	normalize = () => {
		if (this.norm === 0) {
			return new Vector2();
		}
		return this.scalar(1 / this.norm);
	}

	scalar = (a: number) => {
		return new Vector2(a * this.x, a * this.y);
	}

	distanceTo = (other: Vector2) => {
		return this.minus(other).norm;
	}

	minus = (other: Vector2) => {
		return new Vector2(this.x - other.x, this.y - other.y);
	}

	plus = (other: Vector2) => {
		return new Vector2(this.x + other.x, this.y + other.y);
	}

	dot(other: Vector2): number {
		return this.x * other.x + this.y * other.y;
	}

	static fromJson = (json: any) => {
		return new Vector2(json.x * GameConfig.SCALE, json.y * GameConfig.SCALE);
	}

	static fromString = (direction: directionString) => {
		if (direction === "right") {
			return new Vector2(1, 0);
		}
		if (direction === "up") {
			return new Vector2(0, -1);
		}
		if (direction === "left") {
			return new Vector2(-1, 0);
		}
		if (direction === "down") {
			return new Vector2(0, 1);
		}
		throw Error("Unknown direction");
	}
}
