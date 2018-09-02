import { Vector2 } from "../utils";
import { GameConfig } from "./gameConfig";

export class EnnemyConfig {

	constructor(
		readonly start: Vector2,
		readonly speed: number,
		readonly pattern: Movement[],
	) {}

	static fromJson = (json: any) => {
		return new EnnemyConfig(
			Vector2.fromJson(json.start),
			json.speed,
			json.pattern.map((movement: any) => Movement.fromJson(movement)),
		);
	}
}

export class Movement {

	constructor(
		readonly direction: Vector2,
		readonly length: number,
	) {}

	static fromJson = (json: any) => {
		return new Movement(
			Vector2.fromString(json.direction),
			json.length * GameConfig.SCALE,
		);
	}
}
