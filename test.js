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

  canvas.on('mouse:over', function(e) {
    e.target.setFill('red');
    canvas.renderAll();
  });

  canvas.on('mouse:out', function(e) {
    e.target.setFill('green');
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
    canvas.add(new fabric[klass](options));
  }
}