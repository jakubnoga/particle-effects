import CanvasPainter from "./canvas-painter"
import ParticleManager from "./particle-manager";

window.onload = (event) => {
	const painter = new CanvasPainter(document.getElementById("app") as HTMLCanvasElement);
	const manager = new ParticleManager(painter, 100, [.5, 1], 100);
	const distanceInput = document.getElementById("distance") as HTMLInputElement;
	distanceInput.addEventListener("input", event => {
		manager.distance = parseFloat((<HTMLInputElement> event.target).value);
	})

	manager.init(new Date().getMilliseconds());
	
	window.requestAnimationFrame((time) => manager.nextFrame(time));
}

