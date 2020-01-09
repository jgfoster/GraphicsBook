Blockly.JavaScript['graphics_createpath'] = function(block) {
  return 'graphics.beginPath();\n';
};

Blockly.JavaScript['graphics_moveto'] = function(block) {
  var number_x = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_ATOMIC);
  var number_y = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_ATOMIC);
  return 'graphics.moveTo(' + number_x + ', ' + number_y + ');\n';
}

Blockly.JavaScript['graphics_lineto'] = function(block) {
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
