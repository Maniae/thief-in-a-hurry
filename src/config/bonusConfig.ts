import { Vector2 } from "../utils";

const ONE_SECOND = 1000;

export type bonusName = "speed" | "invisibility" | "freeze" | "unknown";

export class BonusConfig {

	constructor(
		readonly name: bonusName,
		readonly position: Vector2,
		readonly time: number,
		readonly value?: number,
	) {}

	static fromJson = (json: any) => {
		return new BonusConfig(
			json.name,
			Vector2.fromJson(json.position),
			json.time * ONE_SECOND,
			json.value,
		);
	}
}
