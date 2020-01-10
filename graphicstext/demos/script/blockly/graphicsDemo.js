function injectBlockly(params = { width: 200, height: 500 }) {
	const options = { 
		toolbox : graphicsToolbox(), 
		collapse : true, 
		comments : true, 
		disable : true, 
		maxBlocks : Infinity, 
		trashcan : true, 
		horizontalLayout : false, 
		toolboxPosition : 'start', 
		css : true, 
		media : '../script/blockly/msg/media/', 
		rtl : false, 
		scrollbars : true, 
		sounds : true, 
		oneBasedIndex : true
	};
	
	/* Inject your workspace */ 
	const workspace = Blockly.inject('blocklyDiv', options);
	
	/* Load Workspace Blocks from XML to workspace */
	const workspaceBlocks = document.getElementById("workspaceBlocks"); 
	Blockly.Xml.domToWorkspace(workspaceBlocks, workspace);

	function myUpdateFunction(event) {
		const graphics = document.getElementById("canvas").getContext("2d");
		graphics.setTransform(1, 0, 0, 1, 0, 0);
		graphics.clearRect(0, 0, params.width, params.height);
		graphics.fillStyle = "#F8F8F8";
		graphics.fillRect(0, 0, params.width, params.height);
		if ('before' in params) {
			params.before(graphics);
		}
		const userCode = Blockly.JavaScript.workspaceToCode(workspace);
		const block = Function('graphics', userCode);
		block(graphics);
		if ('after' in params) {
			params.after(graphics, userCode);
		}
	}
	
	workspace.addChangeListener(myUpdateFunction);
	return workspace;
}
