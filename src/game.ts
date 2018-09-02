import one from "./data/levels/one.json";
import { Drawer } from "./drawer";
import { Bonus, Ennemy } from "./entities";
import { Input } from "./input";
import { Level } from "./level";
import { SceneManager } from "./sceneManager";
import { Vector2 } from "./utils";

export class Game {

	readonly sceneManager: SceneManager;
	readonly drawer: Drawer;
	private frozen = false;
	private level!: Level;
	tick = 0;

	constructor() {
		this.sceneManager = new SceneManager(this);
		this.drawer = new Drawer(this);
	}

	start = async () => {
		await this.init();
		this.startLevel();
	}

	init = async () => {
		Input.init();
		this.level = Level.fromJson(one);
		await this.drawer.init(this.level.map);
		this.sceneManager.init(this.level.map);
	}

	startLevel = () => {
		this.tick = 0;
		this.frozen = false;
		this.sceneManager.clearEntities();
		this.sceneManager.spawnPlayer(this.level.start);
		this.level.ennemies.map(ennemyConfig => this.sceneManager.spawn(Ennemy, undefined, ennemyConfig));
		this.level.bonuses.map(bonusConfig => this.sceneManager.spawn(Bonus, undefined, bonusConfig));
		requestAnimationFrame(this.update);
	}

	update = () => {
		this.tick ++;
		this.sceneManager.update();
		this.drawer.update();
		if (!this.frozen) {
			requestAnimationFrame(this.update);
		}
	}

	freeze = () => {
		this.frozen = true;
		setTimeout(this.startLevel, 1000);
	}
}
