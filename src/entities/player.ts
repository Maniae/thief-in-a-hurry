import { Drawer } from "../drawer";
import { Input } from "../input";
import { Sprite } from "../sprite";
import { Vector2 } from "../utils";
import { Bonus } from "./bonus";
import { Entity } from "./entity";

export class Player extends Entity {

	private moveDelay = 200;
	private moveTimeout = 0;
	sprite = new Sprite(4, 3, 32, 32);

	invisible = false;

	init = () => {
		this.speed = 5;
		this.direction = new Vector2(1, 0);
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
			|| this.blockCollisions.length > 0
		) {
			this.direction = this.direction.scalar(-1);
			this.throttle();
			this.position = prevPos;
		}
		this.checkBonuses();
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
		if (Input.isPressed("d")) {
			this.direction = new Vector2(1, 0);
		}
		if (Input.isPressed("z")) {
			this.direction = new Vector2(0, -1);
		}
		if (Input.isPressed("q")) {
			this.direction = new Vector2(-1, 0);
		}
		if (Input.isPressed("s")) {
			this.direction = new Vector2(0, 1);
		}
	}
}
