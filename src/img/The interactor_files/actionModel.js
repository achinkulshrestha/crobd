var actionModel = function (sequence) {
  this.sequence = sequence;
};

actionModel.prototype.valid = function(callback, retFunc){
    var sequence = this.sequence;
    $.getJSON('js/graph.json',function(json){
      console.log(json);// Check sequence and graph
      console.log(sequence);
      res = performDFS(json, sequence);
      callback(res, retFunc);
    });
};

function performDFS(json, sequence) {
var start = sequence[0];
var arr_idx = 1;
var stack = [];
stack.push(start);
while (stack.length > 0) {
  var element = stack.pop();
  var prev_idx = arr_idx;
  if (arr_idx == sequence.length) {
    break;
  }
  var node = json[element];
  for (var key in node) {
    if (arr_idx < sequence.length && sequence[arr_idx] == node[key]){
      stack.push(node);
      arr_idx += 1;
      break;
    }
  }
}
if (arr_idx < sequence.length) {
    return {error: "Invalid action sequence, check the descriptions on the right for the actions you chose", isValid: false};
}
else {
  return {error: "Everything is ok!", isValid: true};
}
}
