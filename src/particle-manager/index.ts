import CanvasPainter, { Point, Bounds } from "../canvas-painter";

export default class ParticleManager {
	private readonly painter: CanvasPainter;
	private particles: Particle[];
	private edges: Edge[];
	no: number;
	speed: [number, number];
	lastFrameTimestamp: number;
	deltaT: number = 100 / 6; // 60 FPS
	distance: number;
	
	constructor(painter: CanvasPainter, no: number, speed: [number, number], distance: number) {
		this.painter = painter;
		this.particles = [];
		this.edges = [];
		this.no = no;
		this.speed = speed;
		this.distance = distance;
	}

	randomizeParticles(no: number): Particle[] {
		const bounds = this.painter.getBounds();
		const width = bounds.xmax - bounds.xmin;
		const height = bounds.ymax - bounds.ymin;
		return new Array(no).fill({}).map(() => {
			const point = {
				x: Math.random() * width + bounds.xmin,
				y: Math.random() * height + bounds.ymin,
				h: 1,
				w: 1
			}
			const isMovingHorizontally = Math.random() > .5;
			const v = Math.random() * this.speed[1] + this.speed[0];
			return new Particle(point, isMovingHorizontally ? v : 0, isMovingHorizontally ? 0 : v);
		});
	}

	randomizeEdges(): Edge[] {
		return this.particles.map((particle) => {
			const idx = Math.round(Math.random() * (this.particles.length -1))
			return new Edge(particle, this.particles[idx]);
		}).filter(edge => {
			return edge.particles[0].distance(edge.particles[1]) < 1000;
		})
	}

	calcEdges(distance): Edge[] {
		const edges: Edge[] = [];
		for (let i = 0; i < this.particles.length; i++) {
			for (let j = 0; j < i; j++) {
				if (this.particles[i].distance(this.particles[j]) < distance) {
					edges.push(new Edge(this.particles[i], this.particles[j]));
				}
			}
		}
		return edges;
	}

	init(time: number) {
		this.lastFrameTimestamp = time;
		this.particles = this.randomizeParticles(this.no);
		this.edges = this.randomizeEdges();
	}

	draw() {
		this.painter.clear();
		this.painter.drawPoints(this.particles.map((particle) => particle.point));
		this.painter.drawLines(this.edges.map(edge => {
			return {
				x1: edge.particles[0].point.x,
				x2: edge.particles[1].point.x,
				y1: edge.particles[0].point.y,
				y2: edge.particles[1].point.y,
			}
		}))
	}

	step(time: number) {
		this.particles.forEach((particle) => {
			particle.checkBounds(this.painter.getBounds());
			particle.step(time);
		})
		this.edges = this.calcEdges(this.distance);
		this.draw();
	}

	nextFrame(time: number) {
		window.requestAnimationFrame((t) => this.nextFrame(t));
		if (time - this.lastFrameTimestamp < this.deltaT) {
			return;
		}

		this.lastFrameTimestamp = time;
		this.step(this.deltaT);

	}
}

class Particle {
	point: Point;
	vx: number;
	vy: number;

	constructor(point: Point, vx: number, vy: number) {
		this.point = point;
		this.vx = vx;
		this.vy = vy;
	}

	checkBounds(bounds: Bounds) {
		if (this.point.x <= bounds.xmin || this.point.x >= bounds.xmax) {
			this.vx = -this.vx;
		}

		if (this.point.y <= bounds.ymin || this.point.y >= bounds.ymax) {
			this.vy = -this.vy;
		}
	}

	step(time: number) {
		this.point.x += this.vx * time;
		this.point.y += this.vy * time;
	}

	distance(other: Particle): number {
		const asq = Math.pow((this.point.x - other.point.x), 2);
		const bsq = Math.pow((this.point.y - other.point.y), 2);
		return Math.sqrt(asq + bsq);
	}
}

class Edge {
	particles: [Particle, Particle]
	constructor(particle1: Particle, particle2: Particle) {
		this.particles = [particle1, particle2];
	}
}