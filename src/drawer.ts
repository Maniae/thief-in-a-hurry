import { Block } from "./blocks";
import { GameConfig } from "./config";
import { Bonus, Ennemy, Player } from "./entities";
import { Game } from "./game";
import { Shadow } from "./shadow";
import { Sprite } from "./sprite";
import { Vector2 } from "./utils";

const WIDTH = 1440;
const HEIGHT = 720;

const playerImage = new Image();
playerImage.src = "/assets/player.png";

const ennemyImage = new Image();
ennemyImage.src = "/assets/ennemy.png";

const invisibilityImage = new Image();
invisibilityImage.src = "/assets/invisibility.png";

const freezeImage = new Image();
freezeImage.src = "/assets/freeze.png";

const wallImage = new Image();
wallImage.src = "/assets/wall.png";

const floorImage = new Image();
floorImage.src = "/assets/floor.png";

export class Drawer {

	private ctx!: CanvasRenderingContext2D;
	private map!: Block[];

	constructor(private readonly game: Game) {}

	init = async () => {
		const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;
		if (!canvas) {
			throw Error("Canvas element misisng");
		}
		this.ctx = canvas.getContext("2d")!;
		await this.loadImage(playerImage);
		await this.loadImage(ennemyImage);
		await this.loadImage(invisibilityImage);
		await this.loadImage(freezeImage);
	}

	setLevelMap(map: Block[]) {
		this.map = map;
	}

	loadImage = async (image: HTMLImageElement) => new Promise<HTMLImageElement>((resolve, reject) => {
		image.onload = () => {
			resolve(image);
		};
		if (image.complete) {
			resolve(image);
		}
	})

	update = () => {
		this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
		this.drawBackground();
		this.drawMap();
		this.game.sceneManager.player.draw(this);
		this.game.sceneManager.entities.map(it => it.draw(this));
		this.darken();
	}

	draw = (drawing: (c: CanvasRenderingContext2D) => void) => {
		const c = this.ctx;
		c.save();
		c.beginPath();
		drawing(c);
		c.closePath();
		c.restore();
	}

	drawBackground = () => {
		this.draw(c => {
			c.fillStyle = "#3b2e1d";
			c.fillRect(0, 0, WIDTH, HEIGHT);
		});
	}

	darken = () => {
		this.draw(c => {
			c.fillStyle = "#211188";
			c.globalAlpha = 0.2;
			c.fillRect(0, 0, WIDTH, HEIGHT);
			c.globalAlpha = 1;
		});
	}

	drawPlayer = (player: Player) => {
		if (player.fallen) {
			return;
		}
		this.draw(c => {
			const { x, y } = player.direction;
			const { sx, sy, width, height } = player.sprite.getSpriteInfo(y < 0 ? 2 : x > 0 ? 0 : 1);
			const image = playerImage;
			if (player.invisible) {
				c.globalAlpha = 0.2;
				c.shadowColor = "white";
				c.shadowBlur = 4;
			}
			if (player.speed === 0) {
				c.shadowColor = "#36F1CD";
				c.shadowBlur = 4;
			}
			c.drawImage(image, sx, sy, width, height, player.position.x, player.position.y, width, height);
		});
	}

	drawEnnemy = (ennemy: Ennemy) => {
		this.draw(c => {
			c.shadowColor = "#6B0504";
			c.shadowBlur = 2;
			const { x, y } = ennemy.direction;
			const { sx, sy, width, height } = ennemy.sprite.getSpriteInfo(y < 0 ? 2 : x > 0 ? 0 : 1);
			const image = ennemyImage;
			c.drawImage(image, sx, sy, width, height, ennemy.position.x, ennemy.position.y, width, height);
		});
		this.drawLight(ennemy.position.plus(new Vector2(16, 16)), ennemy.direction, ennemy.color);
	}

	drawLight(position: Vector2, direction: Vector2, color: string) {
		const { x, y } = position;
		const lightLength = 200;
		const lightThickness = 120;
		const lightCurve = 50;
		this.draw(c => {
			c.globalCompositeOperation = "lighter";
			c.save();
			c.translate(x, y);
			c.rotate(Math.atan2(direction.y, direction.x));

			const rnd = 0.05 * Math.sin(1.1 * Date.now() / 1000);
			const radius = 200 * (1 + rnd);
			const radialGradient = c.createRadialGradient(0, 0, 0, 0, 0, radius);
			const start = Math.abs(direction.x) > 0 ? 0.05 : 0.08;
			radialGradient.addColorStop(0.0, "#000");
			radialGradient.addColorStop(start, "#000");
			radialGradient.addColorStop(start + 0.01, "#fff");
			radialGradient.addColorStop(0.7 + rnd, "#ffffff88");
			radialGradient.addColorStop(0.90 + rnd, "#ffffff44");
			radialGradient.addColorStop(1, "#ffffff22");
			c.fillStyle = color || radialGradient;
			c.beginPath();
			c.lineTo(lightLength, -lightThickness);
			c.bezierCurveTo(
				lightLength + lightCurve, -lightThickness,
				lightLength + lightCurve, lightThickness,
				lightLength, lightThickness,
			);
			c.lineTo(0, 0);
			c.closePath();
			c.fill();
			c.restore();
		});
	}

	drawMap = () => {
		this.map.map(block => {
			if (block) {
				const { position: {x, y}, width, height, name } = block;
				switch (name) {
					case "wall":
						this.drawWall(x, y, width, height);
						break;
					case "randomObject":
						this.drawRandomObject(x, y, width, height);
						break;
					case "hole":
						this.drawHole(x, y, width, height);
						break;
					case "finish":
						this.drawFinish(x, y, width, height);
						break;
				}
			}
		});
	}

	drawBonus(bonus: Bonus) {
		const { position: {x, y}, name, value } = bonus;
		this.draw(c => {
			if (!bonus.sprite) {
				throw Error(`Sprite missing for bonus ${bonus}`);
			}
			c.shadowColor = "#36F1CD";
			c.shadowBlur = 4;
			const { sx, sy, width, height} = bonus.sprite.getSpriteInfo(0);
			const image = name === "freeze" ? freezeImage : invisibilityImage;
			c.drawImage(image, sx, sy, width, height, bonus.position.x, bonus.position.y, width, height);
		});
	}

	drawWall(x: number, y: number, width: number, height: number) {
		this.texturize(wallImage, x, y, width, height);
	}

	drawRandomObject(x: number, y: number, width: number, height: number) {

		this.texturize(wallImage, x, y, width, height);

		this.game.sceneManager.getEntities(Ennemy).map(ennemy => {
			Shadow.castFromRectangle(
				this.ctx,
				ennemy.position,
				x,
				y,
				width,
				height,
				3);
		});
	}

	drawHole(x: number, y: number, width: number, height: number) {
		this.draw(c => {
			c.fillStyle = "#000";
			c.shadowColor = "#000";
			c.shadowBlur = 10;
			c.rect(x, y, width, height);
			c.fill();
		});
	}

	drawFinish(x: number, y: number, width: number, height: number) {
		this.draw(c => {
			c.fillStyle = "#3b2e1d";
			c.shadowColor = "#36F1CD";
			c.shadowBlur = 50;
			c.rect(x, y, width, height);
			c.fill();
		});
	}

	texturize = (texture: HTMLImageElement, x: number, y: number, width: number, height: number) => {
		this.draw(c => {
			for (let xx = x; xx < x + width; xx += GameConfig.SCALE) {
				for (let yy = y; yy < y + height; yy += GameConfig.SCALE) {
					c.drawImage(texture, xx, yy, GameConfig.SCALE, GameConfig.SCALE);
				}
			}
		});
	}
}
