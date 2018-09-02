import { Block } from "./blocks";
import { GameConfig } from "./config";
import { Entity, Player } from "./entities";
import { Game } from "./game";
import { Child, Vector2 } from "./utils";

export class SceneManager {

	player!: Player;
	entities: Entity[] = [];
	map: Block[] = [];

	constructor(private readonly game: Game) {
		this.player = new Player(this);
	}

	init() {}

	setLevelMap(map: Block[]) {
		this.map = map;
	}

	update() {
		this.player.update();
		this.entities.map(it => it.update());
	}

	spawn = (EntityClass: Child<Entity>, position?: Vector2, config?: any) => {
		const entity = new EntityClass(this);
		if (position) {
			entity.position = position;
		}
		entity.init(config);
		this.entities.push(entity);
	}

	spawnPlayer = (position: Vector2) => {
		const offset = GameConfig.SCALE / 2 - GameConfig.ENTITY_SIZE / 2;
		this.player = new Player(this);
		this.player.position = position.plus(new Vector2(offset, offset));
		this.player.init();
	}

	destroy = (entity: Entity) => {
		const i = this.entities.indexOf(entity);
		if (i < 0) {
			throw Error("Couldn't find the entity to delete");
		}
		this.entities.splice(i, 1);
	}

	clearEntities = () => {
		this.entities = [];
	}

	getEntities = <T extends Entity>(EntityClass: Child<T>) => {
		return this.entities.filter(it => (it instanceof EntityClass)) as T[];
	}

	freeze(finish?: boolean) {
		this.game.freeze(finish);
	}
}
