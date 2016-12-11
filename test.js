function paint(argument) {
	var canvas = this.__canvas = new fabric.Canvas('canvas');
  fabric.Object.prototype.transparentCorners = false;

  window.addEventListener('resize', resizeCanvas, false);

  function resizeCanvas() {
    canvas.setHeight(window.innerHeight);
    canvas.setWidth(window.innerWidth);
    canvas.renderAll();
  }

  // resize on init
  resizeCanvas();

  canvas.selection = false;

  var panning = false;
  var clicked_object = false;
canvas.on('mouse:up', function (e) {
    panning = false;
});

canvas.on('mouse:down', function (e) {
  if(!clicked_object){
    panning = true;
  }
});
canvas.on('mouse:move', function (e) {
    if (panning && e && e.e) {
        var units = 10;
        var delta = new fabric.Point(e.e.movementX, e.e.movementY);
        canvas.relativePan(delta);
    }
});

  canvas.on('mouse:over', function(e) {
    e.target.setFill('red');
    clicked_object = true;
    canvas.renderAll();
  });

  canvas.on('mouse:out', function(e) {
    e.target.setFill('green');
    clicked_object = false;
    canvas.renderAll();
  });

  canvas.on('mouse:wheel', function(e) {
    var objs = canvas.getObjects();
    var delta = e.originalEvent.wheelDelta / 120;

    for (var i = objs.length - 1; i >= 0; i--) {
      objs[i]
      objs[i].scaleX += delta;
        objs[i].scaleY += delta;
       /* 
        // constrain
        if (objs[i].scaleX < 0.1) {
            objs[i].scaleX = 0.1;
            objs[i].scaleY = 0.1;
        }
        // constrain
        if (objs[i].scaleX > 10) {
            objs[i].scaleX = 10;
            objs[i].scaleY = 10;
        }*/
        objs[i].setFill("blue");
    }
    canvas.renderAll();
  });

  // add random objects
  for (var i = 15; i--; ) {
    var dim = fabric.util.getRandomInt(30, 60);
    var klass = ['Rect', 'Triangle', 'Circle'][fabric.util.getRandomInt(0,2)];
    var options = {
      top: fabric.util.getRandomInt(0, 600),
      left: fabric.util.getRandomInt(0, 600),
      fill: 'green'
    };
    if (klass === 'Circle') {
      options.radius = dim;
    }
    else {
      options.width = dim;
      options.height = dim;
    }
    var item = new fabric[klass](options);
    canvas.add(item);
  }
}