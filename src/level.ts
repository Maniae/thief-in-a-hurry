import { Block, BlockFactory } from "./blocks";
import { BonusConfig, EnnemyConfig, GameConfig } from "./config";
import { Vector2 } from "./utils";

export class Level {

	constructor(
		readonly start: Vector2,
		readonly direction: Vector2,
		readonly ennemies: EnnemyConfig[],
		readonly bonuses: BonusConfig[],
		readonly map: Block[],
	) {}

	static fromJson = (json: any) => {
		return new Level(
			new Vector2(json.start.x * GameConfig.SCALE, json.start.y * GameConfig.SCALE),
			Vector2.fromString(json.direction),
			json.ennemies.map((ennemy: any) => EnnemyConfig.fromJson(ennemy)),
			json.bonuses.map((bonus: any) => BonusConfig.fromJson(bonus)),
			json.map.map((block: any) => BlockFactory.fromJson(block)),
		);
	}
}
