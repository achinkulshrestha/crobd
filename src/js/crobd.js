// // Empty JS for your own code to be here
var img = new Image();
img.src = 'img/door.jpg';
//image object is onload
img.onload = function(){
   var raster = new Raster(img);
   // Move the raster to the center of the view
   raster.position = view.center;
   var path1 = new Path.Rectangle({
    point: [0, 0],
    size: [640, 480],
   });
  raster.fitBounds(path1.bounds);
  raster.sendToBack();

};



var position = new Point(320, 480);
// The amount we will move when one of the keys is pressed:
var step = 10;
var path = new Path();
path.strokeColor = 'red';
path.strokeWidth = '5';
path.add(position);

function onKeyDown(event) {
  if(event.key == 'a') {
    position.x -= step;
  }

  if(event.key == 'd') {
    position.x += step;
  }

  if(event.key == 'w') {
    position.y -= step;
  }

  if(event.key == 's') {
    position.y += step;
  }
  path.add(position);
}
