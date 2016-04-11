// By Simon Sarris
// www.simonsarris.com
// sarris@acm.org
//
// Last update December 2011
//
// Free to use and distribute at will
// So long as you are nice to people, etc

// Constructor for Shape objects to hold data for all drawn objects.
// For now they will just be defined as rectangles.
function Shape(x, y, w, h, fill, rotated = false, rotation_origin_x = 0, rotation_origin_y = 0, angle = 0) {
  // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
  // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
  // But we aren't checking anything else! We could put "Lalala" for the value of x
  this.x = x || 0;
  this.y = y || 0;
  this.w = w || 1;
  this.h = h || 1;
  this.fill = fill || '#AAAAAA';
  this.rotated = rotated;
  this.rotation_origin_x = rotation_origin_x;
  this.rotation_origin_y = rotation_origin_y;
  this.angle = angle;
}

// Draws this shape to a given context
Shape.prototype.draw = function(ctx) {
  if(this.rotated) {
     ctx.save();
     //Set the origin to the center of the image
     ctx.translate(this.x, this.y);
     ctx.translate(0, this.rotation_origin_y);
     ctx.rotate(0.5);
     ctx.fillStyle = this.fill;
     ctx.fillRect(0,-this.rotation_origin_y, this.w, this.h);
     // draw your object
     ctx.restore();
  }
  else {
  ctx.fillStyle = this.fill;
  ctx.fillRect(this.x, this.y, this.w, this.h);
 }
}

// Determine if a point is inside the shape's bounds
Shape.prototype.contains = function(mx, my) {
  // All we have to do is make sure the Mouse X,Y fall in the area between
  // the shape's X and (X + Width) and its Y and (Y + Height)
  return  (this.x <= mx) && (this.x + this.w >= mx) &&
          (this.y <= my) && (this.y + this.h >= my);
}

function CanvasState(canvas) {
  // **** First some setup! ****
  this.base_image = new Image();
  this.base_image.src = 'img/fire_door.jpg';
  canvas.width = this.base_image.naturalWidth;
  canvas.height = this.base_image.naturalHeight;

  this.canvas = canvas;
  this.width = canvas.width;
  this.height = canvas.height;
  this.ctx = canvas.getContext('2d');

  // This complicates things a little but but fixes mouse co-ordinate problems
  // when there's a border or padding. See getMouse for more detail
  var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
  if (document.defaultView && document.defaultView.getComputedStyle) {
    this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
    this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
    this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
    this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
  }
  // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
  // They will mess up mouse coordinates and this fixes that
  var html = document.body.parentNode;
  this.htmlTop = html.offsetTop;
  this.htmlLeft = html.offsetLeft;

  // **** Keep track of state! ****

  this.valid = false; // when set to false, the canvas will redraw everything
  this.shapes = [];  // the collection of things to be drawn
  this.dragging = false; // Keep track of when we are dragging
  this.createShapeGrid = false;
  this.shapeClickX = 0;
  this.shapeClickY = 0;
  this.isResizeDrag = false;
  this.expectResize = -1; // New, will save the # of the selection handle if the mouse is over one.

  // the current selected object. In the future we could turn this into an array for multiple selection
  this.selection = null;
  this.dragoffx = 0; // See mousedown and mousemove events for explanation
  this.dragoffy = 0;
  // New, holds the 8 tiny boxes that will be our selection handles
  // the selection handles will be in this order:
  // 0  1  2
  // 3     4
  // 5  6  7
  this.selectionHandles = [];
  // set up the selection handle boxes
  for (var i = 0; i < 8; i ++) {
    var rect = new Shape;
    this.selectionHandles.push(rect);
  }


  // **** Then events! ****

  // This is an example of a closure!
  // Right here "this" means the CanvasState. But we are making events on the Canvas itself,
  // and when the events are fired on the canvas the variable "this" is going to mean the canvas!
  // Since we still want to use this particular CanvasState in the events we have to save a reference to it.
  // This is our reference!
  var myState = this;

  //fixes a problem where double clicking causes text to get selected on the canvas
  canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
  // Up, down, and move are for dragging
  canvas.addEventListener('mousedown', function(e) {
    var mouse = myState.getMouse(e);

    //we are over a selection box
    if (myState.expectResize !== -1) {
      myState.isResizeDrag = true;
      return;
    }

    var mx = mouse.x;
    var my = mouse.y;
    var shapes = myState.shapes;
    var l = shapes.length;
    for (var i = l-1; i >= 0; i--) {
      if (shapes[i].contains(mx, my)) {
        var mySel = shapes[i];
        // Keep track of where in the object we clicked
        // so we can move it smoothly (see mousemove)
        myState.dragoffx = mx - mySel.x;
        myState.dragoffy = my - mySel.y;
        myState.shapeClickX = mx - mySel.x;
        myState.shapeClickY = my - mySel.y;
        myState.dragging = true;
        myState.createShapeGrid = true;
        myState.selection = mySel;
        myState.valid = false;
        return;
      }
    }
    // havent returned means we have failed to select anything.
    // If there was an object selected, we deselect it
    if (myState.selection) {
      myState.selection = null;
      myState.valid = false; // Need to clear the old selection border
    }
  }, true);
  canvas.addEventListener('mousemove', function(e) {
    var mouse = myState.getMouse(e);
    var mx = mouse.x;
    var my = mouse.y;

    if (myState.dragging){
      // We don't want to drag the object by its top-left corner, we want to drag it
      // from where we clicked. Thats why we saved the offset and use it here
      myState.selection.x = mouse.x - myState.dragoffx;
      myState.selection.y = mouse.y - myState.dragoffy;
      myState.valid = false; // Something's dragging so we must redraw
    } else if (myState.isResizeDrag) {
      // time ro resize!
      var oldx = myState.selection.x;
      var oldy = myState.selection.y;

      // 0  1  2
      // 3     4
      // 5  6  7
      mySel = myState.selection;
      switch (myState.expectResize) {
        case 0:
          mySel.x = mx;
          mySel.y = my;
          mySel.w += oldx - mx;
          mySel.h += oldy - my;
          break;
        case 1:
          mySel.y = my;
          mySel.h += oldy - my;
          break;
        case 2:
          mySel.y = my;
          mySel.w = mx - oldx;
          mySel.h += oldy - my;
          break;
        case 3:
          mySel.x = mx;
          mySel.w += oldx - mx;
          break;
        case 4:
          mySel.w = mx - oldx;
          break;
        case 5:
          mySel.x = mx;
          mySel.w += oldx - mx;
          mySel.h = my - oldy;
          break;
        case 6:
          mySel.h = my - oldy;
          break;
        case 7:
          mySel.w = mx - oldx;
          mySel.h = my - oldy;
          break;
      }
      myState.valid = false;
    }
    if (myState.selection !== null && !myState.isResizeDrag) {
      for (var i = 0; i < 8; i++) {
        // 0  1  2
        // 3     4
        // 5  6  7

        var cur = myState.selectionHandles[i];

        // we dont need to use the ghost context because
        // selection handles will always be rectangles
        if (mx >= cur.x && mx <= cur.x + myState.selectionBoxSize &&
            my >= cur.y && my <= cur.y + myState.selectionBoxSize) {
          // we found one!
          myState.expectResize = i;
          myState.valid = false;
          switch (i) {
            case 0:
              this.style.cursor='nw-resize';
              break;
            case 1:
              this.style.cursor='n-resize';
              break;
            case 2:
              this.style.cursor='ne-resize';
              break;
            case 3:
              this.style.cursor='w-resize';
              break;
            case 4:
              this.style.cursor='e-resize';
              break;
            case 5:
              this.style.cursor='sw-resize';
              break;
            case 6:
              this.style.cursor='s-resize';
              break;
            case 7:
              this.style.cursor='se-resize';
              break;
          }
          return;
        }

      }
      // not over a selection box, return to normal
      myState.isResizeDrag = false;
      myState.expectResize = -1;
      this.style.cursor='auto';
    }

  }, true);
  canvas.addEventListener('mouseup', function(e) {
    myState.dragging = false;
    myState.isResizeDrag = false;
    myState.expectResize = -1;
  }, true);
  // double click for making new shapes
  canvas.addEventListener('dblclick', function(e) {
    var mouse = myState.getMouse(e);
    myState.addShape(new Shape(mouse.x - 10, mouse.y - 10, 20, 20, 'rgba(0,255,0,.6)'));
  }, true);

  // **** Options! ****

  this.selectionColor = '#CC0000';
  this.selectionWidth = 2;
  this.selectionBoxColor = 'darkred'; // New for selection boxes
  this.selectionBoxSize = 6;
  this.interval = 30;
  setInterval(function() { myState.draw(); }, myState.interval);
}

CanvasState.prototype.addShape = function(shape) {
  this.shapes.push(shape);
  this.valid = false;
}
/*
Listen to events from outside the canvas
*/
CanvasState.prototype.listenForEvents = function(e) {
  if (this.selection != null) {

    var ctx = this.ctx;
    var mySel = this.selection;
    var angle = (Math.PI/180)*(-20);
    this.addShape(new Shape(mySel.x, mySel.y, mySel.w, mySel.h, 'rgba(245, 222, 179, .7)', true, this.shapeClickX, this.shapeClickY, angle));
  }
}


CanvasState.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.width, this.height);
}

// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
CanvasState.prototype.draw = function() {
  // if our state is invalid, redraw and validate!
  if (!this.valid) {
    var ctx = this.ctx;
    var shapes = this.shapes;
    var base_image = this.base_image;
    this.clear();

    // ** Add stuff you want drawn in the background all the time here **
  //   var raster = new Raster(base_image);
  //   // Move the raster to the center of the view
  //   raster.position = view.center;
  //   var path1 = new Path.Rectangle({
  //    point: [0, 0],
  //    size: [640, 480],
  //   });
  //  raster.fitBounds(path1.bounds);
  //  raster.sendToBack();


    var width = base_image.naturalWidth; // this will be 300
    var height = base_image.naturalHeight; // this will be 400
    ctx.drawImage(base_image, 0, 0, width, height);

    // draw all shapes
    var l = shapes.length;
    for (var i = 0; i < l; i++) {
      var shape = shapes[i];
      // We can skip the drawing of elements that have moved off the screen:
      if (shape.x > this.width || shape.y > this.height ||
          shape.x + shape.w < 0 || shape.y + shape.h < 0) continue;
      shapes[i].draw(ctx);
    }

    // draw selection
    // right now this is just a stroke along the edge of the selected Shape
    if (this.selection != null) {
      ctx.strokeStyle = this.selectionColor;
      ctx.lineWidth = this.selectionWidth;
      var mySel = this.selection;
      ctx.strokeRect(mySel.x,mySel.y,mySel.w,mySel.h);
      if (this.createShapeGrid == true) {
        ctx.beginPath();
        ctx.moveTo(mySel.x, mySel.y + this.shapeClickY);
        ctx.lineTo(mySel.x + mySel.w, mySel.y + this.shapeClickY);
        ctx.moveTo(mySel.x + this.shapeClickX, mySel.y);
        ctx.lineTo(mySel.x + this.shapeClickX, mySel.y + mySel.h);
        ctx.closePath();
         ctx.strokeStyle = "#eee";
         ctx.stroke();
         this.createShapeGrid = false;
      }

      // draw the boxes

      var half = this.selectionBoxSize / 2;

      // 0  1  2
      // 3     4
      // 5  6  7
      // top left, middle, right
      this.selectionHandles[0].x = mySel.x-half;
      this.selectionHandles[0].y = mySel.y-half;

      this.selectionHandles[1].x = mySel.x+mySel.w/2-half;
      this.selectionHandles[1].y = mySel.y-half;

      this.selectionHandles[2].x = mySel.x+mySel.w-half;
      this.selectionHandles[2].y = mySel.y-half;

      //middle left
      this.selectionHandles[3].x = mySel.x-half;
      this.selectionHandles[3].y = mySel.y+mySel.h/2-half;

      //middle right
      this.selectionHandles[4].x = mySel.x+mySel.w-half;
      this.selectionHandles[4].y = mySel.y+mySel.h/2-half;

      //bottom left, middle, right
      this.selectionHandles[6].x = mySel.x+mySel.w/2-half;
      this.selectionHandles[6].y = mySel.y+mySel.h-half;

      this.selectionHandles[5].x = mySel.x-half;
      this.selectionHandles[5].y = mySel.y+mySel.h-half;

      this.selectionHandles[7].x = mySel.x+mySel.w-half;
      this.selectionHandles[7].y = mySel.y+mySel.h-half;

      ctx.fillStyle = this.selectionBoxColor;
      for (var i = 0; i < 8; i ++) {
        var cur = this.selectionHandles[i];
        ctx.fillRect(cur.x, cur.y, this.selectionBoxSize, this.selectionBoxSize);
      }

    }

    // ** Add stuff you want drawn on top all the time here **

    this.valid = true;
  }
}


// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
CanvasState.prototype.getMouse = function(e) {
  var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;

  // Compute the total offset
  if (element.offsetParent !== undefined) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }

  // Add padding and border style widths to offset
  // Also add the <html> offsets in case there's a position:fixed bar
  offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
  offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;

  // We return a simple javascript object (a hash) with x and y defined
  return {x: mx, y: my};
}

// If you dont want to use <body onLoad='init()'>
// You could uncomment this init() reference and place the script reference inside the body tag
//init();

function init() {
  var s = new CanvasState(document.getElementById('canvas1'));
  s.addShape(new Shape(125,80,30,80, 'rgba(245, 222, 179, .7)'));
  $('#rotateBtn').on('click', function (e) {

    s.listenForEvents(e);

  });

}
init();
// Now go make something amazing!
