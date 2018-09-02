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
		this.sceneManager.spawnPlayer(this.level.start, this.level.direction);
		this.level.ennemies.map(ennemyConfig => this.sceneManager.spawn(Ennemy, undefined, ennemyConfig));
		this.level.bonuses.map(bonusConfig => this.sceneManager.spawn(Bonus, undefined, bonusConfig));
		requestAnimationFrame(this.update);
	}

	gameOver = () => {
		document.getElementById("canvas")!.style.opacity = "0.1";
		document.getElementById("gameOver")!.style.opacity = "1";
		const button = document.querySelector("button")!;
		button.style.cursor = "pointer";
		button.addEventListener("click", this.restart);
	}

	restart = () => {
		document.getElementById("canvas")!.style.opacity = "1";
		document.getElementById("gameOver")!.style.opacity = "0";
		const button = document.querySelector("button")!;
		button.style.cursor = "none";
		button.removeEventListener("click", this.restart);
		setTimeout(this.startLevel, 1000);
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
				this.levelNumber = 0;
				setTimeout(this.gameOver, 1000);
				return;
			}
		}
		setTimeout(this.startLevel, 500);
	}
}
