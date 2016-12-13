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

function exportCanvas() {
	//var ctx = document.getElementById('canvas').getContext('2d');

	url = canvas.toDataURL({format : 'png' });
	document.getElementById("exportbtn").href = url;
}

function saveCanvas() {
	var data = JSON.stringify(objects);
	properties = {type: 'plain/text'}; // Specify the file's mime-type.
	try {
		// Specify the filename using the File constructor, but ...
		file = new File([data], "file.txt", properties);
	} catch (e) {
		// ... fall back to the Blob constructor if that isn't supported.
		file = new Blob([data], properties);
	}
	url = URL.createObjectURL(file);
	//$("#savebtn").attr("href", url);
	document.getElementById("savebtn").href = url;
}

/*function handleFileSelect(evt) {
	toLoad = evt.target.files[0];
    //set some content in name of map
}

document.getElementById('file-to-load').addEventListener('change', handleFileSelect, false);
*/

function handleLoadFile() {

	if (window.File && window.FileReader && window.FileList && window.Blob) {
	// Great success! All the File APIs are supported.
	} else {
		alert('The File APIs are not fully supported in this browser.');
	}

	var toLoad = document.getElementById('file-to-load').files[0];
	//toLoad = evt.target.files[0];

	properties = {type: 'plain/text'}; // Specify the file's mime-type.

	var reader = new FileReader();
	reader.onload = (function(theFile) {
		return function(e) {
			try {
				objects = JSON.parse(e.target.result);
                //Verify format

				//TODO: does not work at all canvas does not redraw
				document.dispatchEvent(new Event('doc-loaded'));
			} catch (e) {
				alert("Unexpected file format.")
			}
		};
	})(toLoad);

	reader.readAsText(toLoad);
}



var rootObj = {x:900, y:450, color:getRandomColor(), sizeX:120, sizeY:60, text:"Insert text", parent:-1, lWidth:5, visible:1};
objects.push(rootObj);

/* Select button was clicked if selectMode is true,
 * selectNode() function finds out, on which node user clicked then.
 */
var selectedNode = 0;
var randomColor = false;
var nodeToMove = -1;

function selectNode(pt)
{
	for (var i = 0; i < objects.length; i++) {
		if (pt.x > objects[i].x-(objects[i].sizeX/2) && pt.x < objects[i].x+(objects[i].sizeX/2) &&
			pt.y > objects[i].y-(objects[i].sizeY/2) && pt.y < objects[i].y+(objects[i].sizeY/2) &&
			objects[i].visible)
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

function isNode(pt)
{
	for (var i = 0; i < objects.length; i++) {
		if (pt.x > objects[i].x-(objects[i].sizeX/2) && pt.x < objects[i].x+(objects[i].sizeX/2) &&
			pt.y > objects[i].y-(objects[i].sizeY/2) && pt.y < objects[i].y+(objects[i].sizeY/2))
		{
			return true;
		}
	}
	return false;
}

function useRandomColor()
{
	randomColor = true;
}

function getHighlight()
{
	if (objects[selectedNode].parent == -1)
		return 4;
	else if (objects[selectedNode].parent == 0)
		return 3;
	else if (objects[selectedNode].parent == 1)
		return 2;
	else
		return 1.5;
}

function hideBranch(node)
{
	for (var i = 0; i < objects.length; i++) {
		if (objects[i].parent == node) {
			objects[i].visible = 0;
			hideBranch(i);
		}
	}
}

function showBranch(node)
{
	for (var i = 0; i < objects.length; i++) {
		if (objects[i].parent == node) {
			objects[i].visible = 1;
			showBranch(i);
		}
	}
}

function deleteBranch(node)
{
	for (var i = 0; i < objects.length; i++) {
		if (objects[i].parent == node) {
			deleteBranch(i);
			objects.splice(i, 1);
		}
	}
	objects.splice(node, 1);
}

function unsetRandomColor()
{
	randomColor = false;
}

function getEndPoints(i)
{
	var p = objects[i].parent;
	var pDiagonal = Math.sqrt(objects[p].sizeX*objects[p].sizeX + objects[p].sizeY*objects[p].sizeY);
	var iDiagonal = Math.sqrt(objects[i].sizeX*objects[i].sizeX + objects[i].sizeY*objects[i].sizeY);

	var iX = objects[i].x;
	var iY = objects[i].y;
	var pX = objects[p].x;
	var pY = objects[p].y;

	k = (objects[i].y - objects[p].y)/(objects[i].x - objects[p].x);
	q = objects[p].y - (k*objects[p].x);

	var d = iDiagonal/2;
	var dd = pDiagonal/2;

	if (iX > pX)
		var a1 = (-Math.sqrt(-Math.pow(iX,2)*k*k-2*iX*k*q+2*iX*k*iY+d*d*k*k+d*d-q*q+2*q*iY-Math.pow(iY,2))+iX-k*q+k*objects[i].y)/(k*k+1);
	else
		var a1 = (Math.sqrt(-Math.pow(iX,2)*k*k-2*iX*k*q+2*iX*k*iY+d*d*k*k+d*d-q*q+2*q*iY-Math.pow(iY,2))+iX-k*q+k*objects[i].y)/(k*k+1);

	var a2 = k * a1 + q;

	if (iX < pX)
		var b1 = (-Math.sqrt(-Math.pow(pX,2)*k*k-2*pX*k*q+2*pX*k*pY+dd*dd*k*k+dd*dd-q*q+2*q*pY-Math.pow(pY,2))+pX-k*q+k*pY)/(k*k+1);
	else
		var b1 = (Math.sqrt(-Math.pow(pX,2)*k*k-2*pX*k*q+2*pX*k*pY+dd*dd*k*k+dd*dd-q*q+2*q*pY-Math.pow(pY,2))+pX-k*q+k*pY)/(k*k+1);

	var b2 = k * b1 + q;

	var startP = {x:a1, y:a2};
	var endP = {x:b1, y:b2};

	var result = {start:startP, end:endP};

	return result;

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
				} else if (objects[i].visible) {
					if (i == selectedNode) {
						ctx.shadowBlur = 15;
		  				ctx.shadowOffsetX = 0;
						ctx.shadowOffsetY = 0;
						ctx.shadowColor = "red";
					} else {
						ctx.shadowBlur = 6;
		  				ctx.shadowOffsetX = 4;
						ctx.shadowOffsetY = 4;
						ctx.shadowColor = "gray";
					}

					if (!objects[i].text) {
		        		ctx.beginPath();
						/*ctx.ellipse(objects[i].x, objects[i].y, 50, 50, 45 * Math.PI/180, 0, 2 * Math.PI);
						ctx.stroke();*/
						ctx.strokeStyle = objects[i].color;
						ctx.lineWidth = objects[i].lWidth;
						ctx.strokeRect(objects[i].x-(objects[i].sizeX/2), objects[i].y-(objects[i].sizeY/2), objects[i].sizeX, objects[i].sizeY);
					} else {
						if (objects[i].parent == -1)
							ctx.font = "20px Arial";
						else if (objects[i].parent == 0)
							ctx.font = "19px Arial";
						else if (objects[i].parent == 1)
							ctx.font = "17px Arial";
						else
							ctx.font = "15px Arial";

						var width = ctx.measureText(objects[i].text).width;
						
						ctx.beginPath();
						ctx.strokeStyle = objects[i].color;
						ctx.lineWidth = objects[i].lWidth;
						objects[i].sizeX = width + 20;
						ctx.strokeRect(objects[i].x-(objects[i].sizeX/2), objects[i].y-(objects[i].sizeY/2), objects[i].sizeX, objects[i].sizeY);
						ctx.fillText(objects[i].text, objects[i].x-(objects[i].sizeX/2)+10, objects[i].y+10);
					}
					if (objects[i].parent != -1) {
						var endPoints = getEndPoints(i);
						drawArrow(ctx, endPoints.end, endPoints.start, objects[i].lWidth);
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
				var x = (evt.pageX - canvas.offsetLeft) * correction.x;
        		var y = (evt.pageY - canvas.offsetTop) * correction.y;
        		//some magic is necessary to put the circles to correct place 
				var pt = ctx.transformedPoint(x, y);
				var select = isNode(pt);
				if (select) {
					selectNode(pt);
					redraw();
				} else {
	        		var obj={x:pt.x, y:pt.y, color:getRandomColor(), sizeX:120, sizeY:60, text:"", parent:selectedNode, lWidth:getHighlight(), visible:1};
	        		if (!randomColor) {
	        			var color = $("#colors-picker").spectrum("get");
	        			obj.color = color.toHexString();
	        		}
	        		objects.push(obj);
	        		redraw();
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
			if (event.which == null) {
				objects[selectedNode].text += String.fromCharCode(event.keyCode); // IE
			} else if (event.which!=0 && event.charCode!=0) {
				objects[selectedNode].text += String.fromCharCode(event.which);   // the rest
			}
			redraw();
		}

		window.onkeydown = function(event) {
			var keyCode = ('which' in event) ? event.which : event.keyCode;
			if (keyCode == 32)
				objects[selectedNode].text += ' ';
			else if (keyCode == 8)
				objects[selectedNode].text = objects[selectedNode].text.substr(0, objects[selectedNode].text.length - 1);
			redraw();
		}


		document.getElementById("hide-btn").addEventListener("click", function() {
			hideBranch(selectedNode);
			redraw();
		})

		document.getElementById("show-btn").addEventListener("click", function() {
			showBranch(selectedNode);
			redraw();
		})

		document.getElementById("del-btn").addEventListener("click", function() {
			deleteBranch(selectedNode);
			redraw();
		})

		document.getElementById("chcol-btn").addEventListener("click", function() {
			objects[selectedNode].color = $("#colors-picker").spectrum("get");
			redraw();
		})

		document.getElementById("new-doc").addEventListener("click", function() {
			// Clear the canvas
			var p1 = ctx.transformedPoint(0, 0);
			var p2 = ctx.transformedPoint(canvas.width, canvas.height);
			ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
			objects.splice(0, objects.length);
			var newRoot = {x:900, y:450, color:getRandomColor(), sizeX:120, sizeY:60, text:"Insert text", parent:-1, lWidth:5, visible:1};
			objects.push(newRoot);
			redraw();
		})

		document.addEventListener('doc-loaded', redraw, false);

		//document.getElementById('file-to-load').addEventListener('change', handleLoadFile, false);

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
