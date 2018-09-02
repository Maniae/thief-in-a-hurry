import { BonusConfig, bonusName } from "../config/bonusConfig";
import { Drawer } from "../drawer";
import { Sprite } from "../sprite";
import { Entity } from "./entity";
import { Player } from "./player";

export class Bonus extends Entity {
	name!: bonusName;
	time!: number;
	value?: number;

	init = (config: BonusConfig) => {
		this.name = config.name;
		this.position = config.position;
		this.time = config.time;
		this.value = config.value;

		this.sprite = new Sprite(4, 1, 16, 16);
	}

	applyBonus = (player: Player) => {
		switch (this.name) {
			case "speed":
				if (!this.value) {
					throw Error("Speed bonus lacks value");
				}
				player.modifySpeed(this.value, this.time);
				break;
			case "invisibility":
				player.vanish(this.time);
				break;
			case "freeze":
				player.freeze(this.time);
				break;
		}
		this.destroy();
	}

	draw = (drawer: Drawer) => {
		drawer.drawBonus(this);
	}
}
