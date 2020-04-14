export default class CanvasPainter {
	private readonly canvas: HTMLCanvasElement;
	private readonly ctx: CanvasRenderingContext2D;
	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.ctx = canvas.getContext("2d");
		this.ctx.imageSmoothingEnabled = false;
	}

	drawPoints(points: Point[]) {
		points.forEach((point) => this.ctx.fillRect(point.x, point.y, point.w, point.h));
	}
	
	drawLines(lines: Line[]) {
		lines.forEach((line) => {
			this.ctx.beginPath();
			this.ctx.moveTo(line.x1, line.y1);
			this.ctx.lineTo(line.x2, line.y2);
			this.ctx.stroke()
		})
	}

	getBounds(): Bounds {
		return {
			xmin: 10,
			ymin: 10,
			ymax: this.canvas.height,
			xmax: this.canvas.width,
		}
	}

	clear() {
		this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
	}
}

export interface Point {
	x: number, y: number, w: number, h: number;
}

export interface Bounds {
	xmin: number, xmax: number, ymin: number, ymax: number;
}

export interface Line {
	x1: number,
	x2: number,
	y1: number,
	y2: number
}