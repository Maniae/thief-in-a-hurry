import { Block, blockName } from "./block";

export class Wall extends Block {
	name: blockName = "wall";
	solid = true;
	rotation = this.getRandomRotation();

	private getRandomRotation() {
		return Math.floor(Math.random() * 4) * Math.PI;
	}
}
