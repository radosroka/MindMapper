var objects = [];

//objects.push(new Image, new Image);

//objects[0].src = 'https://sc.mogicons.com/share/dreamy-emoticon-378.jpg';
//objects[1].src = 'https://www.smashingmagazine.com/wp-content/uploads/2015/06/10-dithering-opt.jpg';

function getRandomColor() {
	var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/* Select button was clicked if selectMode is true,
 * selectNode() function finds out, on which node user clicked then.
 */
var selectMode = false;
var selectedNode = -1;
var randomColor = false;
var textMode = true;
var nodeToMove = -1;

function selectNode(pt)
{
	for (var i = 0; i < objects.length; i++) {
		if (pt.x > objects[i].x-(objects[i].sizeX/2) && pt.x < objects[i].x+(objects[i].sizeX/2) &&
			pt.y > objects[i].y-(objects[i].sizeY/2) && pt.y < objects[i].y+(objects[i].sizeY/2))
		{
			selectedNode = i;

			/* Display tools menu. */
			document.getElementById("tools-container").style.display = 'block';
			break;
		}
	}
}

function selectNodeToMove(pt)
{
	for (var i = 0; i < objects.length; i++) {
		if (pt.x > objects[i].x-(objects[i].sizeX/2) && pt.x < objects[i].x+(objects[i].sizeX/2) &&
			pt.y > objects[i].y-(objects[i].sizeY/2) && pt.y < objects[i].y+(objects[i].sizeY/2))
		{
			nodeToMove = i;
			break;
		}
	}
}

/* Sets selectMode to true after user clicked on select button. */
function setSelectMode()
{
	if (objects.length > 0)
		selectMode = true;
}

function unsetSelectMode()
{
	selectMode = false;
	randomColor = false;
	selectedNode = -1;
	document.getElementById("tools-container").style.display = 'none';
}

function useRandomColor()
{
	randomColor = true;
}

function usePickerColor()
{
	randomColor = false;
}



function renderCanvas()
{	
	var canvas = document.getElementById('canvas');

	window.onload = function() 
	{

		canvas.width = window.innerWidth;
	    canvas.height = window.innerHeight;

		var ctx = canvas.getContext('2d');
		var correction = { y:canvas.height/(canvas.height-canvas.offsetTop),
						   x:canvas.width/(canvas.width-canvas.offsetLeft) }

		trackTransforms(ctx);

		function redraw() 
		{
			// Clear the canvas
			var p1 = ctx.transformedPoint(0, 0);
			var p2 = ctx.transformedPoint(canvas.width, canvas.height);
			ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

			// Draw an example image
			for (var i = 0; i < objects.length; i++) {
				if (objects[i].src) {
					ctx.drawImage(objects[i], 10 * (i*100), 10 * (i*100));
				} else {
					if (!objects[i].text) {
		        		ctx.beginPath();
						/*ctx.ellipse(objects[i].x, objects[i].y, 50, 50, 45 * Math.PI/180, 0, 2 * Math.PI);
						ctx.stroke();*/
						ctx.strokeStyle = objects[i].color;
						ctx.lineWidth = 5;
						ctx.strokeRect(objects[i].x-(objects[i].sizeX/2), objects[i].y-(objects[i].sizeY/2), objects[i].sizeX, objects[i].sizeY);
					} else {
						ctx.font = "20px Arial";
						var width = ctx.measureText(objects[i].text).width;
						
						ctx.beginPath();
						ctx.strokeStyle = objects[i].color;
						ctx.lineWidth = 5;
						objects[i].sizeX = width + 20;
						
						ctx.strokeRect(objects[i].x-(objects[i].sizeX/2), objects[i].y-(objects[i].sizeY/2), objects[i].sizeX, objects[i].sizeY);
						ctx.fillText(objects[i].text, objects[i].x-(objects[i].sizeX/2)+10, objects[i].y+10);
					}
				}
				
			}

			ctx.save();
		}
		redraw();
		
		var lastX = canvas.width / 2, lastY = canvas.height / 2;
		var dragStart, dragged;

		canvas.addEventListener('mousedown', function(evt) {
			document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
			lastX = (evt.pageX - canvas.offsetLeft) * correction.x;
			lastY = (evt.pageY - canvas.offsetTop) * correction.y;
			dragStart = ctx.transformedPoint(lastX, lastY);
			//if (selectMode) {
			selectNodeToMove(dragStart);
			//}
			dragged = false;
		}, false);

		canvas.addEventListener('mousemove', function(evt) {
			lastX = (evt.pageX - canvas.offsetLeft) * correction.x;
			lastY = (evt.pageY - canvas.offsetTop) * correction.y;
			dragged = true;
			if (dragStart) {
				var pt = ctx.transformedPoint(lastX, lastY);
				if (nodeToMove != -1) {
					objects[nodeToMove].x = pt.x;
					objects[nodeToMove].y = pt.y;
				}
				else {
					ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y);
				}
				redraw();
			}
		}, false);

		canvas.addEventListener('mouseup', function(evt) {
			dragStart = null;
			nodeToMove = -1;
			if (!dragged) {
				var x = (evt.pageX - canvas.offsetLeft) * correction.x
        		var y = (evt.pageY - canvas.offsetTop) * correction.y;
        		//some magic is necessary to put the circles to correct place 
				var pt = ctx.transformedPoint(x, y)
				if (selectMode) {
					selectNode(pt);
				} else {
	        		var obj={x:pt.x, y:pt.y, name:"Hello", color:getRandomColor(), sizeX:120, sizeY:60, text:""}
	        		if (!randomColor) {
	        			var color = $("#colors-picker").spectrum("get");
	        			obj.color = color.toHexString();
	        		}
	        		objects.push(obj);
	        		ctx.beginPath();
					/*ctx.ellipse(pt.x, pt.y, 50, 50, 45 * Math.PI/180, 0, 2 * Math.PI);
					ctx.stroke();*/
					ctx.strokeStyle = obj.color;
					ctx.lineWidth = 5;
					ctx.shadowBlur = 6;
	  				ctx.shadowOffsetX = 4;
					ctx.shadowOffsetY = 4;
					ctx.shadowColor = "gray";
					ctx.strokeRect(pt.x-(obj.sizeX/2), pt.y-(obj.sizeY/2), obj.sizeX, obj.sizeY);
				}
        		console.log('click');
			}
		}, false);

		canvas.addEventListener('mouseout', function(evt) {
			dragStart = null;
			if (!dragged) zoom(evt.shiftKey ? -1 : 1 );
		}, false);

		var scaleFactor = 1.1;
		var zoom = function(clicks) {
			var pt = ctx.transformedPoint(lastX, lastY);
			ctx.translate(pt.x, pt.y);
			var factor = Math.pow(scaleFactor, clicks);
			ctx.scale(factor, factor);
			ctx.translate(-pt.x, -pt.y);
			redraw();
		}

		var handleScrolling = function(evt) {
			var delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail : 0;
			if (delta) 
				zoom(delta);
			return evt.preventDefault() && false;
		};

		canvas.addEventListener('DOMMouseScroll', handleScrolling, false);
		canvas.addEventListener('mousewheel', handleScrolling, false);

		window.onkeypress = function(event) {
			if (textMode && selectedNode >= 0) {
				if (event.which == null) {
					objects[selectedNode].text += String.fromCharCode(event.keyCode); // IE
				} else if (event.which!=0 && event.charCode!=0) {
					objects[selectedNode].text += String.fromCharCode(event.which);   // the rest
				}
			}
			redraw();
		}
	};

	function trackTransforms(ctx) {
		var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
		var xform = svg.createSVGMatrix();
		ctx.getTransform = function() { return xform; };
		
		var savedTransforms = [];
		var save = ctx.save;
		ctx.save = function() {
			savedTransforms.push(xform.translate(0, 0));
			return save.call(ctx);
		};

		var restore = ctx.restore;
		ctx.restore = function() {
			xform = savedTransforms.pop();
			return restore.call(ctx);
		};

		var scale = ctx.scale;
		ctx.scale = function(sx, sy) {
			xform = xform.scaleNonUniform(sx, sy);
			return scale.call(ctx, sx, sy);
		};

		var rotate = ctx.rotate;
		ctx.rotate = function(radians) {
			xform = xform.rotate(radians * 180 / Math.PI);
			return rotate.call(ctx, radians);
		};

		var translate = ctx.translate;
		ctx.translate = function(dx, dy) {
			xform = xform.translate(dx, dy);
			return translate.call(ctx, dx, dy);
		};

		var transform = ctx.transform;
		ctx.transform = function(a, b, c, d, e, f) {
			var m2 = svg.createSVGMatrix();
			m2.a = a; m2.b = b; 
			m2.c = c; m2.d = d; 
			m2.e = e; m2.f = f;
			xform = xform.multiply(m2);
			return transform.call(ctx, a, b, c, d, e, f);
		};

		var setTransform = ctx.setTransform;
		ctx.setTransform = function(a, b, c, d, e, f) {
			xform.a = a; xform.b = b;
			xform.c = c; xform.d = d;
			xform.e = e; xform.f = f;
			return setTransform.call(ctx, a, b, c, d, e, f);
		};

		var pt  = svg.createSVGPoint();
		ctx.transformedPoint = function(x, y) {
			pt.x = x; pt.y = y;
			return pt.matrixTransform(xform.inverse());
		}
	}
}
