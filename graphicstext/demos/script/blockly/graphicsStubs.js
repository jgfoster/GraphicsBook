Blockly.JavaScript['graphics_createpath'] = function(block) {
  return 'graphics.beginPath();\n';
};

Blockly.JavaScript['graphics_moveto'] = function(block) {
  var number_x = block.getFieldValue('X');
  var number_y = block.getFieldValue('Y');
  return 'graphics.moveTo(' + number_x + ', ' + number_y + ');\n';
}

Blockly.JavaScript['graphics_lineto'] = function(block) {
  var number_x = block.getFieldValue('X');
  var number_y = block.getFieldValue('Y');
  return 'graphics.lineTo(' + number_x + ', ' + number_y + ');\n';
};

Blockly.JavaScript['graphics_closepath'] = function(block) {
  return 'graphics.closePath();\n';
};

Blockly.JavaScript['graphics_stroke'] = function(block) {
  return 'graphics.stroke();\n';
};
