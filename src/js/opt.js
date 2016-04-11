// var canvas = document.getElementById('myCanvas'),
// context = canvas.getContext('2d');
//
// make_base();
//
// function make_base()
// {
  // base_image = new Image();
  // base_image.src = 'latch.png';
  // var width = base_image.naturalWidth; // this will be 300
  // var height = base_image.naturalHeight; // this will be 400
  // base_image.onload = function(){
  //   context.drawImage(base_image, 0, 0, width, height);
//   }
// }
(function(){
  var graph = new joint.dia.Graph;

     var paper = new joint.dia.Paper({
         el: $('#myholder'),
         width: 600,
         height: 200,
         model: graph,
         gridSize: 1
     });

     var rect = new joint.shapes.basic.Rect({
         position: { x: 100, y: 30 },
         size: { width: 150, height: 50 }
     });
     rect.attr({
         rect: { fill: '#2ECC71', rx: 0, ry: 0, 'stroke-width': 1, stroke: 'black', 'stroke-dasharray': '10,2' },
         text: {
             text: 'Move forward 25 steps', fill: 'black',
             'font-size': 13, 'font-weight': 'normal'
         }
     });

     var rect2 = rect.clone();
     rect2.translate(300);
     rect2.attr({
       text: {
           text: 'Turn right 45 deg', fill: 'black',
           'font-size': 13, 'font-weight': 'normal'
       }
     });

     var link = new joint.dia.Link({
         source: { id: rect.id },
         target: { id: rect2.id }
     });

     graph.addCells([rect, rect2, link]);
})();

(function elementStyling() {

    var graph = new joint.dia.Graph;
    var paper = new joint.dia.Paper({
        el: $('#paper-element-styling'),
        width: 600,
        height: 50,
        model: graph,
        gridSize: 1
    });

    var rect = new joint.shapes.basic.Rect({
        position: { x: 10, y: 10 },
        size: { width: 100, height: 30 },
        attrs: { rect: { width: 100, height: 30 } }
    });
    var rect2 = rect.clone();
    rect2.translate(120);
    var rect3 = rect2.clone();
    rect3.translate(120);
    var rect4 = rect3.clone();
    rect4.translate(120);
    var rect5 = rect4.clone();
    rect5.translate(120);

    rect.attr({
        rect: { fill: '#2C3E50', rx: 5, ry: 5, 'stroke-width': 2, stroke: 'black' },
        text: {
            text: 'my label', fill: '#3498DB',
            'font-size': 18, 'font-weight': 'bold', 'font-variant': 'small-caps', 'text-transform': 'capitalize'
        }
    });

    rect2.attr({
        rect: { fill: '#E74C3C', rx: 20, ry: 20, 'stroke-width': 0 },
        text: {
            text: 'my label', fill: '#ECF0F1',
            'font-size': 11, 'font-weight': 'normal', 'font-variant': 'small-caps', 'text-transform': 'capitalize'
        }
    });

    rect3.attr({
        rect: { fill: '#8E44AD', rx: 0, ry: 0, 'stroke-width': 0 },
        text: {
            text: 'my label', fill: 'white',
            'font-size': 13, 'font-weight': 'normal'
        }
    });

    rect4.attr({
        rect: { fill: '#2ECC71', rx: 0, ry: 0, 'stroke-width': 1, stroke: 'black', 'stroke-dasharray': '10,2' },
        text: {
            text: 'my label', fill: 'black',
            'font-size': 13, 'font-weight': 'normal'
        }
    });

    rect5.attr({
        rect: { fill: '#F39C12', rx: 20, ry: 20, 'stroke-width': 1, stroke: 'black', 'stroke-dasharray': '1,1' },
        text: {
            text: 'my label', fill: 'gray',
            'font-size': 18, 'font-weight': 'bold', 'font-variant': 'small-caps', 'text-transform': 'capitalize',
            style: { 'text-shadow': '1px 1px 1px black' }
        }
    });

    graph.addCell(rect).addCell(rect2).addCell(rect3).addCell(rect4).addCell(rect5);

}());
