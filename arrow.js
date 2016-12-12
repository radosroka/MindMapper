 function drawArrow(ctx, from, to) {
 	ctx.beginPath();

 	ctx.strokeStyle = "red";
 	ctx.fillStyle = "red";

 	var x_size = from.x - to.x;
 	var y_size = from.y - to.y;
 	var angle = Math.atan2(to.y, to.x) * 180/3.14;
 	var length = Math.sqrt(Math.pow(x_size, 2) + Math.pow(y_size, 2));

 	console.log(angle);
 	console.log(x_size);
 	console.log(y_size);

 	ctx.moveTo(from.x, from.y);
 	ctx.lineTo(to.x, to.y);

 	if (x_size > 0 && y_size > 0){
 		ctx.lineTo(to.x, to.y + length/10);
 		ctx.lineTo(to.x + length/10, to.y);
 		ctx.lineTo(to.x, to.y);
 	}
 	else if (x_size <= 0 && y_size <= 0){
 		ctx.lineTo(to.x, to.y - length/10);
 		ctx.lineTo(to.x - length/10, to.y);
 		ctx.lineTo(to.x, to.y);
 	}
 	else if (x_size > 0 && y_size <= 0){
 		ctx.lineTo(to.x, to.y - length/10);
 		ctx.lineTo(to.x + length/10, to.y);
 		ctx.lineTo(to.x, to.y);
 	}
 	else if (x_size <= 0 && y_size > 0){
 		ctx.lineTo(to.x, to.y + length/10);
 		ctx.lineTo(to.x - length/10, to.y);
 		ctx.lineTo(to.x, to.y);
 	}

 	ctx.fill();
 	ctx.stroke();
 }