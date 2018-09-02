import { EnnemyConfig, GameConfig, Movement } from "../config";
import { Drawer } from "../drawer";
import { Sprite } from "../sprite";
import { Vector2 } from "../utils";
import { Entity } from "./entity";

export class Ennemy extends Entity {

	private pattern!: Movement[];
	private patternIndex = 0;
	private start!: Vector2;
	sprite = new Sprite(4, 3, GameConfig.ENTITY_SIZE, GameConfig.ENTITY_SIZE);
	color = "";

	init = (config: EnnemyConfig) => {
		this.speed = config.speed;
		this.start = config.start;
		this.pattern = config.pattern;

		this.position = this.start;
		this.direction = this.pattern[this.patternIndex].direction;
	}

	update = () => {
		this.checkArea();
		this.moveTo(this.direction, this.speed);
		if (this.position.distanceTo(this.start) > this.pattern[this.patternIndex].length) {
			this.start = this.start.plus(this.direction.scalar(this.pattern[this.patternIndex].length));
			this.position = this.start;
			this.patternIndex = (this.patternIndex + 1) % this.pattern.length;
			this.direction = this.pattern[this.patternIndex].direction;
		}
	}

	checkArea = () => {
		if (this._sceneManager.player.invisible) {
			return;
		}
		const lightLength = 200;
		const lightThickness = 120;
		const visionPoint = this.direction.scalar(lightLength);
		const playerPos = this._sceneManager.player.position;
		const theta = Math.abs(Math.atan2(lightThickness, lightLength));
		const alpha = Math.abs(Math.acos(
			visionPoint.normalize()
			.dot(playerPos.minus(this.position).normalize()),
		));
		if (this.position.distanceTo(playerPos) < lightLength && alpha < theta) {
			this.color = "orange";
			this._sceneManager.freeze();
		}
	}

	draw = (drawer: Drawer) => {
		drawer.drawEnnemy(this);
	}
}
