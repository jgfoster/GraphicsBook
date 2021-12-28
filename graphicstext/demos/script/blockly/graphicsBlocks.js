Blockly.Blocks['graphics_createpath'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("createPath()");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("start a new, empty path");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['graphics_moveto'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("moveTo(")
        .appendField(new Blockly.FieldNumber(0), "X")
        .appendField(",")
        .appendField(new Blockly.FieldNumber(0), "Y")
        .appendField(")");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("move the pen to the point (x,y), without adding a segment to the path; that is, without drawing anything");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['graphics_movetoex'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("moveTo()");
    this.appendValueInput("X")
        .setCheck("Number");
    this.appendValueInput("Y")
        .setCheck("Number");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("move the pen to the point (x,y), without adding a segment to the path; that is, without drawing anything");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['graphics_lineto'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("lineTo(")
        .appendField(new Blockly.FieldNumber(0), "X")
        .appendField(",")
        .appendField(new Blockly.FieldNumber(0), "Y")
        .appendField(")");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("add a line segment to the path that starts at the current pen location and ends at the point (x, y), and move the pen to (x, y)");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['graphics_linetoex'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("lineTo()");
    this.appendValueInput("X")
        .setCheck("Number");
    this.appendValueInput("Y")
        .setCheck("Number");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("add a line segment to the path that starts at the current pen location and ends at the point (x, y), and move the pen to (x, y)");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['graphics_closepath'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("closePath()");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("add a line segment from the current pen location back to the starting point, unless the pen is already there, producing a closed path");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['graphics_stroke'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("stroke()");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("Drawing the outline of a shape, as if a pen is dragged along the boundary of the shape. For a shape with no interior, such as a line segment, stroking the shape simply means dragging the pen along the shape.");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['graphics_translate'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("translate(")
        .appendField(new Blockly.FieldNumber(0), "X")
        .appendField(",")
        .appendField(new Blockly.FieldNumber(0), "Y")
        .appendField(")");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("Move every point by a certain amount horizontally and a certain amount vertically");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['graphics_translateex'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("translate()");
    this.appendValueInput("X")
        .setCheck("Number");
    this.appendValueInput("Y")
        .setCheck("Number");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("Move every point by a certain amount horizontally and a certain amount vertically");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['graphics_rotate'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("rotate(")
        .appendField(new Blockly.FieldNumber(0), "ANGLE")
        .appendField(")");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("rotate each point about the origin");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['graphics_rotateex'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("rotate()");
    this.appendValueInput("ANGLE")
        .setCheck("Number");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("rotate each point about the origin");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['graphics_scale'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("scale(")
        .appendField(new Blockly.FieldNumber(1), "X")
        .appendField(",")
        .appendField(new Blockly.FieldNumber(1), "Y")
        .appendField(")");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("multiply each x-coordinate by a given amount and each y-coordinate by a certain amount");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['graphics_scaleex'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("scale()");
    this.appendValueInput("X")
        .setCheck("Number");
    this.appendValueInput("Y")
        .setCheck("Number");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("multiply each x-coordinate by a given amount and each y-coordinate by a certain amount");
 this.setHelpUrl("");
  }
};

