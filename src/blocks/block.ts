import { Vector2 } from "../utils";

export type blockName = "wall" | "randomObject" | "hole" | "finish" | "unknown";
export abstract class Block {
	name: blockName = "unknown";
	solid: boolean = false;
	rotation?: number;

	constructor(
		readonly position: Vector2,
		readonly width: number,
		readonly height: number,
	) {}
}
