export class Input {

	private static _pressedKeys = new Map<string, boolean>();
	private static _justPressedKeys = new Map<string, boolean>();

	static init() {
		document.addEventListener("keydown", e => {
			Input._justPressedKeys.set(e.key, true);
			Input._pressedKeys.set(e.key, true);
		});
		document.addEventListener("keypress", e => {
			Input._justPressedKeys.set(e.key, false);
		});
		document.addEventListener("keyup", e => {
			Input._justPressedKeys.set(e.key, false);
			Input._pressedKeys.set(e.key, false);
		});
	}

	static isPressed(key: string) {
		return !!Input._pressedKeys.get(key);
	}

	static isJustPressed(key: string) {
		return !!Input._justPressedKeys.get(key);
	}
}
