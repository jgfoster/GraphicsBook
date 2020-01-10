Blockly.JavaScript['graphics_createpath'] = function(block) {
  return 'graphics.beginPath();\n';
};

Blockly.JavaScript['graphics_moveto'] = function(block) {
  var number_x = block.getFieldValue('X');
  var number_y = block.getFieldValue('Y');
  return 'graphics.moveTo(' + number_x + ', ' + number_y + ');\n';
};

Blockly.JavaScript['graphics_movetoex'] = function(block) {
  var number_x = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_ATOMIC);
  var number_y = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_ATOMIC);
  return 'graphics.moveTo(' + number_x + ', ' + number_y + ');\n';
}

Blockly.JavaScript['graphics_lineto'] = function(block) {
  var number_x = block.getFieldValue('X');
  var number_y = block.getFieldValue('Y');
  return 'graphics.lineTo(' + number_x + ', ' + number_y + ');\n';
};

Blockly.JavaScript['graphics_linetoex'] = function(block) {
  var number_x = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_ATOMIC);
  var number_y = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_ATOMIC);
  return 'graphics.lineTo(' + number_x + ', ' + number_y + ');\n';
};

Blockly.JavaScript['graphics_closepath'] = function(block) {
  return 'graphics.closePath();\n';
};

Blockly.JavaScript['graphics_stroke'] = function(block) {
  return 'graphics.stroke();\n';
};

Blockly.JavaScript['graphics_translate'] = function(block) {
  var number_x = block.getFieldValue('X');
  var number_y = block.getFieldValue('Y');
  return 'graphics.translate(' + number_x + ', ' + number_y + ');\n';
};

Blockly.JavaScript['graphics_translateex'] = function(block) {
  var number_x = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_ATOMIC);
  var number_y = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_ATOMIC);
  return 'graphics.translate(' + number_x + ', ' + number_y + ');\n';
};

Blockly.JavaScript['graphics_rotate'] = function(block) {
  var number_angle = block.getFieldValue('ANGLE');
  return 'graphics.rotate(' + (number_angle * (Math.PI / 180)) + ');\n';
};

Blockly.JavaScript['graphics_rotateex'] = function(block) {
  var number_angle = Blockly.JavaScript.valueToCode(block, 'ANGLE', Blockly.JavaScript.ORDER_ATOMIC);
  return 'graphics.rotate(' + (number_angle * (Math.PI / 180)) + ');\n';
};

Blockly.JavaScript['graphics_scale'] = function(block) {
  var number_x = block.getFieldValue('X');
  var number_y = block.getFieldValue('Y');
  return 'graphics.scale(' + number_x + ', ' + number_y + ');\n';
};

Blockly.JavaScript['graphics_scaleex'] = function(block) {
  var number_x = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_ATOMIC);
  var number_y = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_ATOMIC);
  return 'graphics.scale(' + number_x + ', ' + number_y + ');\n';
};

