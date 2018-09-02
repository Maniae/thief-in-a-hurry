import { GameConfig } from "../config";
import { Vector2 } from "../utils";
import { Finish } from "./finish";
import { Hole } from "./hole";
import { RandomObject } from "./randomObject";
import { Wall } from "./wall";

export class BlockFactory {

	static fromJson = (json: any) => {
		const { x, y, width, height, name } = json;
		const pos = new Vector2(GameConfig.SCALE * x, GameConfig.SCALE * y);
		const sw = GameConfig.SCALE * width;
		const sh = GameConfig.SCALE * height;
		if (name === "wall") {
			return new Wall(pos, sw, sh);
		}
		if (name === "randomObject") {
			return new RandomObject(pos, sw, sh);
		}
		if (name === "hole") {
			return new Hole(pos, sw, sh);
		}
		if (name === "finish") {
			return new Finish(pos, sw, sh);
		}
		throw Error("Unknown block");
	}
}
