let width = window.innerWidth;
let height = window.innerHeight;

let circleItems = [];
const minCircles = 12;
const maxCircles = 12;

window.onload = function(){

	let ballElement;
	for(let i = 0; i < maxCircles; i++){
		ballElement = document.createElement("div");
		ballElement.className = "ball";
		ballElement.id = "ball"+i;
		ballElement.style.visibility = "hidden";
		document.body.appendChild(ballElement);
		circleItems.push(ballElement);
	}

	for(let i = 0; i < minCircles; i++){
		circleItems[i].style.visibility = "visible";
	}

	let numberOfBalls = minCircles;
	let time = 0;
	let delta;
	let start = new Date();

	function update(){
		
		let now = new Date();
		delta = now - start;
		start = now;
		time += delta*0.001

		for(let i = 0; i < numberOfBalls; i++){
			let offset = 2*i*Math.PI/numberOfBalls;
			let x = Math.cos(time+offset);
			let y = Math.sin(time+offset);
			circleItems[i].style.top = (height/2 + y*(height/2.5))+"px";
			circleItems[i].style.left = (width/2 + x*(width/2.5))+"px";
			//circleItems[i].style.transform = "rotate("+deg+"deg)";
		}

		//call next update
		window.requestAnimationFrame(update);
	}

	window.requestAnimationFrame(update);
}