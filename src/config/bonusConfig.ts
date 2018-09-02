import { Vector2 } from "../utils";
import { GameConfig } from "./gameConfig";

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
		const offset = GameConfig.SCALE / 2 - GameConfig.BONUS_SIZE / 2;
		return new BonusConfig(
			json.name,
			Vector2.fromJson(json.position).plus(new Vector2(offset, offset)),
			json.time * ONE_SECOND,
			json.value,
		);
	}
}
