import { GameConfig } from "../config";
import { Drawer } from "../drawer";
import { Input } from "../input";
import { Sprite } from "../sprite";
import { Vector2 } from "../utils";
import { Bonus } from "./bonus";
import { Entity } from "./entity";

export class Player extends Entity {

	private moveDelay = 200;
	private moveTimeout = 0;
	sprite = new Sprite(4, 3, GameConfig.ENTITY_SIZE, GameConfig.ENTITY_SIZE);
	fallen = false;

	invisible = false;

	init = () => {
		this.speed = 6;
	}

	update = () => {
		this.checkInputs();
		const prevPos = this.position;
		this.moveTo(this.direction, this.speed);
		if (
			this.position.x < 0
			|| this.position.x > 1440
			|| this.position.y > 720
			|| this.position.y < 0
			|| this.blockCollisions.filter(block => block.name === "wall").length > 0
		) {
			this.direction = this.direction.scalar(-1);
			this.throttle();
			this.position = prevPos;
		}
		this.checkBonuses();
		this.checkBlocks();
	}

	draw = (drawer: Drawer) => {
		drawer.drawPlayer(this);
	}

	throttle = () => {
		this.moveTimeout = setTimeout(() => this.moveTimeout = 0, this.moveDelay);
	}

	checkBonuses = () => {
		const bonuses = this.entityCollisions.filter(entity => entity.constructor === Bonus) as Bonus[];
		if (bonuses.length > 0) {
			bonuses.map(bonus => bonus.applyBonus(this));
		}
	}

	checkBlocks = () => {
		this.blockCollisions.map(block => {
			if (block.name === "hole") {
				this.fallen = true;
				this._sceneManager.freeze();
				return;
			}
		});

		this.blockIntersections.map(block => {
			if (block.name === "finish") {
				this._sceneManager.freeze(true);
				return;
			}
		});
	}

	modifySpeed = (value: number, time: number) => {
		const currentSpeed = this.speed;
		this.speed = this.speed + value;
		setTimeout(() => this.speed = currentSpeed, time);
	}

	vanish = (time: number) => {
		this.invisible = true;
		setTimeout(() => this.invisible = false, time);
	}

	freeze = (time: number) => {
		const currentSpeed = this.speed;
		this.speed = 0;
		setTimeout(() => this.speed = currentSpeed, time);
	}

	checkInputs = () => {
		if (this.moveTimeout) {
			return;
		}
		if (Input.isPressed("d") && this.direction.x >= 0) {
			this.direction = new Vector2(1, 0);
		}
		if ((Input.isPressed("z") || Input.isPressed("w")) && this.direction.y <= 0) {
			this.direction = new Vector2(0, -1);
		}
		if ((Input.isPressed("q") || Input.isPressed("a")) && this.direction.x <= 0) {
			this.direction = new Vector2(-1, 0);
		}
		if (Input.isPressed("s") && this.direction.y >= 0) {
			this.direction = new Vector2(0, 1);
		}
	}
}
