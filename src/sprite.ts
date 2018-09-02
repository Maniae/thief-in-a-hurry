const FRAME_PER_SECOND = 60;

export interface SpriteInfo {
	// image: HTMLImageElement;
	sx: number;
	sy: number;
	width: number;
	height: number;
}
export class Sprite {

	private _currentAnimation: number | null = null;
	private _currentSprite = 0;
	private tick = 0;

	constructor(
		// readonly image: HTMLImageElement,
		readonly width: number,
		readonly height: number,
		readonly assetW: number,
		readonly assetH: number,
		readonly framePerImage = 15) {}

		getSpriteInfo = (animation: number): SpriteInfo => {
			if (animation !== this._currentAnimation) {
				this.tick = 0;
				this._currentAnimation = animation;
			}
			if (this.tick % FRAME_PER_SECOND > this.framePerImage) {
				this.tick = 0;
				this._currentSprite = (this._currentSprite + 1) % this.width;
			}
			const sx = this._currentSprite * this.assetW;
			const sy = this._currentAnimation * this.assetH;
			this.tick ++;
			return {
				// image: this.image,
				sx,
				sy,
				width: this.assetW,
				height: this.assetH,
			};
		}
	}
