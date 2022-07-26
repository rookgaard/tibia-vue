export class Canvas {
	canvas: HTMLCanvasElement;
	context: CanvasRenderingContext2D;

	constructor(elementId: string) {
		this.canvas = document.getElementById(elementId) as HTMLCanvasElement;
		const context = this.canvas.getContext('2d');

		if (!context || !(context instanceof CanvasRenderingContext2D)) {
			throw new Error('Failed to get 2D context');
		}

		this.context = context;
		this.context.imageSmoothingEnabled = false;
	}

	getWidth(): number {
		return this.canvas.width;
	}

	getHeight(): number {
		return this.canvas.height;
	}

	drawImage(img: HTMLImageElement, x: number, y: number, width: number, height: number): void {
		this.context.drawImage(img, x, y, width ?? 32, height ?? 32);
	}

	drawText(text: string, x: number, y: number, color: string) {
		this.context.imageSmoothingEnabled = false;
		this.context.fillStyle = color;
		this.context.strokeStyle = 'black';
		this.context.font = '12px TibiaFilled';
		this.context.fillText(text, x, y);
		this.context.strokeText(text, x, y);
		this.context.fill();
		this.context.stroke();
	}

	getTextWidth(text: string): number {
		this.context.font = '12px TibiaFilled';
		return this.context.measureText(text).width;
	}

	drawRect(x: number, y: number, width: number, height: number, color: string) {
		this.context.fillStyle = color;
		this.context.fillRect(x, y, width, height);
	}

	clear(): void {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}
