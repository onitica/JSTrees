;var TreeJSRenderer = function() {
	//stcolumn must be reset to 0 before redrawing
	var stcolumn = 0;

	//Default values for tree nodes
	var TREE_NODE_RADIUS = 30;
	var TREE_NODE_MARGIN = 10;
	var DrawTreeNodeDefaults = {
		 level : 0,
		 column : 0,
		 left : null,
		 right : null,
		 children : null,
		 val : "N/A"
	}

	function CreateDrawTreeNode(params) {
		var node = $.extend({}, DrawTreeNodeDefaults, params);
		return node;
	}

	//Build a tree with extra information for drawing from the original binary tree
	//Based on algorithm from here: http://facultyfp.salisbury.edu/despickler/personal/Resources/AdvancedDataStructures/Handouts/drawingTrees.pdf
	function BuildBinaryShadowTree(node, level) {
		var newNode = null;
	
		if(node != null) {
			newNode = CreateDrawTreeNode();
		
			newNode.left = BuildBinaryShadowTree(node.left, level+1);
			newNode.val = node.val;
			newNode.level = level;
			newNode.column = stcolumn++;

			newNode.right = BuildBinaryShadowTree(node.right, level+1);
		}
	
		return newNode;
	}

	function DrawBinaryShadowNode(node, ctx, highlightVal) {
		if(node != null) {
			var y = node.level * TREE_NODE_RADIUS * 2;
			var x = node.column * TREE_NODE_RADIUS;
			DrawNodeBubble(node, ctx, x, y, highlightVal)
		
			if(node.left != null) {
				var newY = node.left.level * TREE_NODE_RADIUS * 2;
				var newX = node.left.column * TREE_NODE_RADIUS;
				ctx.beginPath();
				ctx.moveTo(x+TREE_NODE_RADIUS/2,y+TREE_NODE_RADIUS);
				ctx.lineTo(newX+TREE_NODE_RADIUS/2,newY);
				ctx.stroke();
			}
			if(node.right != null) {
				var newY = node.right.level * TREE_NODE_RADIUS * 2;
				var newX = node.right.column * TREE_NODE_RADIUS;
				ctx.beginPath();
				ctx.moveTo(x+TREE_NODE_RADIUS/2,y+TREE_NODE_RADIUS);
				ctx.lineTo(newX+TREE_NODE_RADIUS/2,newY);
				ctx.stroke();
			}
			DrawBinaryShadowNode(node.left, ctx, highlightVal);
			DrawBinaryShadowNode(node.right,ctx, highlightVal);
		}
	}

	//More general adaptation of the binary tree draw
	function BuildGeneralShadowTree(node, level) {
		var newNode = null;
	
		if(node != null) {
			newNode = CreateDrawTreeNode();
		
			if(node.children == null || node.children.length == 0) {
				newNode.val = node.val;
				newNode.level = level;
				newNode.column = stcolumn++;
			} else {
				var middle = Math.floor(node.children.length/2);
				newNode.children = new Array(node.children.length);
				for(var i = 0, count = node.children.length; i < count; i++) {
					newNode.children[i] = BuildGeneralShadowTree(node.children[i], level+1);
					if(i == middle) {
						newNode.val = node.val;
						newNode.level = level;
						newNode.column = stcolumn++;
					}
				}
			}
		}
	
		return newNode;
	}

	function DrawGeneralShadowNode(node, ctx, highlightVal) {
		if(node != null) {
			var y = node.level * TREE_NODE_RADIUS * 2;
			var x = node.column * TREE_NODE_RADIUS;
			DrawNodeBubble(node, ctx, x, y, highlightVal);
		
			if(node.children != null) {
				for(var i = 0, icount = node.children.length; i < icount; i++) {
					var newY = node.children[i].level * TREE_NODE_RADIUS * 2;
					var newX = node.children[i].column * TREE_NODE_RADIUS;
					ctx.beginPath();
					ctx.moveTo(x+TREE_NODE_RADIUS/2,y+TREE_NODE_RADIUS);
					ctx.lineTo(newX+TREE_NODE_RADIUS/2,newY);
					ctx.stroke();
				}
				for(var j = 0, jcount = node.children.length; j < jcount; j++) {
					DrawGeneralShadowNode(node.children[j], ctx, highlightVal);
				}
			}
		}
	}

	function DrawNodeBubble(node, ctx, x, y, highlightVal) {
		if(node.val == highlightVal) {
			ctx.fillStyle = "Yellow";
			ctx.beginPath();
			ctx.arc(x+TREE_NODE_RADIUS/2,y+TREE_NODE_RADIUS/2, TREE_NODE_RADIUS/2, 0, 2 * Math.PI, false);
			ctx.fill();
			ctx.fillStyle = "Black";
		}
		ctx.beginPath();
		ctx.arc(x+TREE_NODE_RADIUS/2,y+TREE_NODE_RADIUS/2, TREE_NODE_RADIUS/2, 0, 2 * Math.PI, false);
		ctx.stroke();
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(node.val,x+TREE_NODE_RADIUS/2,y+TREE_NODE_RADIUS/2,TREE_NODE_RADIUS);
	}

	//Use this to draw a tree to a canvas
	//A tree is made up of node objects defined earlier in this file
/*
	* @tree - The tree object
	* @canvas - The canvas object
	* @isBinary - Whether or not the tree is a binary tree or not, necessary for proper rendering
	* @highlightVal - Highlight the node in the tree with this value when drawn
*/
	function DrawTree(tree, canvas, isBinary, highlightVal) {
		ctx = canvas.getContext("2d");
		ctx.save();
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.translate(TREE_NODE_MARGIN,TREE_NODE_MARGIN);
		stcolumn = 0;
		if(isBinary == true) { //Draw binary tree
			var ShadowTree = BuildBinaryShadowTree(tree, 0);
			DrawBinaryShadowNode(ShadowTree,ctx,highlightVal);
		} else { //Draw general tree
			var ShadowTree = BuildGeneralShadowTree(tree, 0);
			DrawGeneralShadowNode(ShadowTree,ctx,highlightVal);
		}
		ctx.restore();
	}
	
	return {
		DrawTree : DrawTree
	}
}();

