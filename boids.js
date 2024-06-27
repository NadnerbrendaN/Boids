const canvas = document.getElementById("boidLand");
const ctx = canvas.getContext("2d");
const numS = document.getElementById("numS");
var boids = [];
var visualRange = 30;
var visualRangeSq = visualRange*visualRange;
var protRange = 15;
var protRangeSq = protRange*protRange;
var centering_factor = 0.005;
var avoidfactor = 0.07;
var matching_factor = 0.3;
var maxspeed = 3;
var minspeed = 2;
var turnfactor = 0.75;

class boid {
	x = 0;
	y = 0;
	vx = 0;
	vy = 0;
}

function start(){
	boids = [];
	for (i=0;i<numS.value;i++){
		boids[i] = new boid();
		switch(Math.round(Math.random()*3)){
			case 0:
				boids[i].x = -10;
				boids[i].y = Math.round(Math.random()*canvas.height);
				break;
			case 1:
				boids[i].x = Math.round(Math.random()*canvas.width);
				boids[i].y = -10;
				break;
			case 2:
				boids[i].x = canvas.width + 10;
				boids[i].y = Math.round(Math.random()*canvas.height);
				break;
			case 3:
				boids[i].x = Math.round(Math.random()*canvas.width);
				boids[i].y = canvas.height +10;
				break;
		}
		//ctx.fillStyle = "#000000";
		//ctx.fillRect(boids[i].x,boids[i].y,8,8);
	}
}

setInterval(tick,16); // repeats first param function every second param ms

function tick(){
	//console.log(boids);
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	//console.log("Tick!");
	for (i=0;i<boids.length;i++){ // Do for each boid
		//console.log(i);
		let xpos_avg = 0, ypos_avg = 0, xvel_avg = 0, yvel_avg = 0, neighboring_boids = 0, close_dx = 0, close_dy = 0, dx = 0, dy = 0;
		let boid = boids[i];
	//	if (i == 0){
		//	for (k=-visualRange*2;k<visualRange*2;k++){
			//	for (l=-visualRange*2;l<visualRange*2;l++){
				//	if ((k * k + l * l) < visualRangeSq){
					//	ctx.fillStyle = "#00ff00";
						//ctx.fillRect(boid.x+k,boid.y+l,1,1);
					//}
					//if ((k * k + l * l) < protRangeSq){
						//ctx.fillStyle = "#ff0000";
						//ctx.fillRect(boid.x+k,boid.y+l,1,1);
					//}
				//}
			//}
		//}
		for (k=0;k<boids.length;k++){ // Do for each other boid
			//console.log(i + " " + k);
			if (k!=i){ // Make sure not comparing to self
				//console.log("Not self!");
				otherboid = boids[k];
				dx = boid.x - otherboid.x;
				dy = boid.y - otherboid.y;
				//console.log(boids[i].x + " " + boid.x);
				if (Math.abs(dx)<visualRange && Math.abs(dy) < visualRange){ // See if both values are smaller than visual range
					//console.log("Smaller!");
					squaredDistance = dx*dx + dy*dy; // Squared distance makes it check in a circle I think
					if (squaredDistance < protRangeSq){ // See if it's in the protected range
						//console.log("Run!");
						close_dx += boid.x - otherboid.x;
						close_dy += boid.y - otherboid.y;
					}
					else if (squaredDistance < visualRangeSq){ // See if it's in the visual range
						//console.log("Following!");
						xpos_avg += otherboid.x;
						ypos_avg += otherboid.y;
						xvel_avg += otherboid.vx;
						yvel_avg += otherboid.vy;
						neighboring_boids++;
					}
				}
			}
		}
		if (neighboring_boids > 0){ // If we can see any boids
			//console.log(neighboring_boids + " boids spotted");
			xpos_avg = xpos_avg/neighboring_boids; // Average positions and velocities
			ypos_avg = ypos_avg/neighboring_boids;
			xvel_avg = xvel_avg/neighboring_boids;
			yvel_avg = yvel_avg/neighboring_boids;
			
			boid.vx = (boid.vx + 
                   (xpos_avg - boid.x)*centering_factor + 
                   (xvel_avg - boid.vx)*matching_factor);
			// Do some magic to match positions and velocities
			boid.vy = (boid.vy + 
                   (ypos_avg - boid.y)*centering_factor + 
                   (yvel_avg - boid.vy)*matching_factor);
		}
		boid.vx = boid.vx + (close_dx*avoidfactor);
		boid.vy = boid.vy + (close_dy*avoidfactor);
		
		if (boid.x < 50){// Avoid edges
			boid.vx += turnfactor;
		}
		else if (boid.x > canvas.width-50){
			boid.vx -= turnfactor;
		}
		else if (boid.y < 50){
			boid.vy += turnfactor;
		}
		else if (boid.y > canvas.height-50){
			boid.vy -= turnfactor;
		}
		speed = Math.sqrt(boid.vx*boid.vx + boid.vy*boid.vy);
		
		if (speed < minspeed){
			boid.vx = (boid.vx/speed)*minspeed;
			boid.vy = (boid.vy/speed)*maxspeed;
		}
		if (speed > maxspeed){
			boid.vx = (boid.vx/speed)*maxspeed
			boid.vy = (boid.vy/speed)*maxspeed
		}
		boid.x = boid.x + boid.vx;
		boid.y = boid.y + boid.vy;
		boids[i].x = boid.x;
		boids[i].y = boid.y;
		//if (i == 50){
			//console.log(boids[i].y);
			//console.log(boid.y);
		//}
		ctx.fillStyle = "#000000";
		ctx.fillRect(boid.x-2.5,boid.y-2.5,5,5);
	}
}