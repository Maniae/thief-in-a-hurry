import { Block, blockName } from "./block";

export class Wall extends Block {
	name: blockName = "wall";
	solid = true;
}
