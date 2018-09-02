import { Drawer } from "../drawer";
import { SceneManager } from "../sceneManager";
import { Sprite } from "../sprite";
import { Vector2 } from "../utils";

const collisionDistance = 10;

export abstract class Entity {

	protected _sceneManager: SceneManager;
	protected _position: Vector2;
	protected _direction: Vector2;
	speed: number;
	sprite?: Sprite;

	constructor(sceneManager: SceneManager) {
		this._sceneManager = sceneManager;
		this._position = new Vector2();
		this._direction = new Vector2();
		this.speed = 0;
	}

	init = (config?: any) => {

	}

	update = () => {

	}

	draw = (drawer: Drawer) => {

	}

	get position() {
		return this._position;
	}

	set position(position: Vector2) {
		this._position = Vector2.copy(position);
	}

	get direction() {
		return this._direction;
	}

	set direction(direction: Vector2) {
		this._direction = Vector2.copy(direction);
	}

	get entityCollisions() {
		return this._sceneManager.entities.filter(it => this.collide(
			this.position.x, this.position.y, it.position.x, it.position.y, 10, 10,
		));
	}

	get blockCollisions() {
		return this._sceneManager.map.filter(block => block.solid && this.collide(
			this.position.x, this.position.y, block.position.x, block.position.y, block.width, block.height,
		));
	}

	collide = (x: number, y: number, dx: number, dy: number, dw: number, dh: number) => {
		if (x < dx - 10 || x > dx + dw + 10) {
			return false;
		}
		if (y < dy - 10 || y > dy + dh + 10) {
			return false;
		}
		return true;
	}

	destroy = () => {
		this._sceneManager.destroy(this);
		this.onDestroy();
	}

	onDestroy = () => {

	}

	moveTo = (direction: Vector2, speed: number) => {
		const dir = direction.normalize();
		const { x, y } = this.position;
		this.position = new Vector2(x + speed * dir.x, y + speed * dir.y);
	}

	loadImage = async (image: HTMLImageElement) => new Promise<HTMLImageElement>(resolve => {
		image.onload = () => {
			resolve(image);
		};
		if (image.complete) {
			resolve(image);
		}
	})
}
