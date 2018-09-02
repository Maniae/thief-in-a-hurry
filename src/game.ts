import { levels } from "./data/levels";
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
	private levelNumber = 0;
	private level!: Level;

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
		this.sceneManager.init();
		await this.drawer.init();
	}

	startLevel = () => {
		this.frozen = false;
		this.level = Level.fromJson(levels[this.levelNumber]);
		this.sceneManager.setLevelMap(this.level.map);
		this.drawer.setLevelMap(this.level.map);
		this.sceneManager.clearEntities();
		this.sceneManager.spawnPlayer(this.level.start);
		this.level.ennemies.map(ennemyConfig => this.sceneManager.spawn(Ennemy, undefined, ennemyConfig));
		this.level.bonuses.map(bonusConfig => this.sceneManager.spawn(Bonus, undefined, bonusConfig));
		requestAnimationFrame(this.update);
	}

	update = () => {
		this.sceneManager.update();
		this.drawer.update();
		if (!this.frozen) {
			requestAnimationFrame(this.update);
		}
	}

	freeze = (finish?: boolean) => {
		this.frozen = true;
		if (finish) {
			this.levelNumber ++;
			if (levels.length <= this.levelNumber) {
				return;
			}
		}
		setTimeout(this.startLevel, 1000);
	}
}
