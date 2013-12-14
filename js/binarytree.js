//Represents your basic binary tree
//Will allow duplicate keys

function BinaryTree() {	
	this.root = null;
	this.count = 0;
}

BinaryTree.prototype.Clear = function() {
	this.root = null;
	this.count = 0;
}

BinaryTree.prototype.Count = function() {
	return this.count;
}

//Returns true if a node was deleted, false otherwise
BinaryTree.prototype.Delete = function(val) {
	var node = this.Find(val);
	if(node == null) return false;
	var isRoot = false;
	
	//Special case for root node
	if(!node.parent) {
		if(!node.left && !node.right) { //Only one node delete the tree
			this.root = null;
			this.count = 0;
			return true;
		}
		
		isRoot = true;
	}
   
    if(node.left && node.right) { //Case if two children
		var minNode = this.Min(node.right);
		var sameNode = minNode == node.right;
		
		//Remove minNode from parent
		if(minNode.parent.left && (minNode.parent.left.Value() == minNode.Value())) {
			minNode.parent.left = null;
		} else minNode.parent.right = null;
		
		//Copy node child properties
		if(!sameNode) {
			minNode.right = node.right;
			minNode.right.parent = minNode;
		}
		minNode.parent = node.parent;
		minNode.left = node.left;
		minNode.left.parent = minNode;
		
		//Add minNode to where parent used to be
		if(!isRoot) {
			if(node.parent.left && (node.parent.left.Value() == node.Value())) {
				node.parent.left = minNode;
			} else node.parent.right = minNode;
		} else {
			this.root = minNode;
		}
	} else if(!isRoot && node.parent.left && (node.parent.left.Value() == node.Value())) { //Case left child only
		var bubbleNode = node.right ? node.right : node.left;
		if(bubbleNode) {
			bubbleNode.parent = node.parent;
		} 
		node.parent.left = bubbleNode;
	} else { //Case right child and root with only one side of children
		var bubbleNode = node.right ? node.right : node.left;
		if(!isRoot) { //Case right child only
			if(bubbleNode) {
				bubbleNode.parent = node.parent;
			}
			node.parent.right = bubbleNode;
		} else { //Case root with only one branch
			bubbleNode.parent = null;
			this.root = bubbleNode;
		}
	}
	
	node.parent = null;
	node.left = null;
	node.right = null;
	this.count -= 1;
	return true;
}

BinaryTree.prototype.Find = function(val) {
	if(this.root == null) return null;
	var node = this.root;
	while(node) {
		var comp = node.CompareToValue(val); 
		if(comp == 0) return node;
		else if(comp < 0) node = node.right;
		else node = node.left;	
	}
	return null;
}

BinaryTree.prototype.GetRoot = function() {
	return this.root;
}

//Does an insertion sort as it recurses through the tree
BinaryTree.prototype.GetSortedArray = function() {
	var array = [];
	if(this.root) {
		return this.GetSortedArrayInner(this.root, array);
	}
}

BinaryTree.prototype.GetSortedArrayInner = function(node, array) {
	if(!node) {
		return array;
	}
	
	this.OrderedArrayInsert(node.Value(), array);
	array = this.GetSortedArrayInner(node.left, array);
	return this.GetSortedArrayInner(node.right, array);
}

BinaryTree.prototype.OrderedArrayInsert = function(value, array) {
	for(var i = 0; i < array.length; i++) {
		if(array[i] > value) {
			array.splice(i, 0, value);
			return;
		}	
	}
	array.push(value);
}

BinaryTree.prototype.Insert = function(node) {
	if(this.root == null) {
		this.root = node;
		this.count = 1;
		return;
	}
	
	var treeNode = this.root;
	while(true) {
		var comp = node.CompareTo(treeNode);
		if(comp > 0) {
			if(treeNode.right == null) {
				treeNode.right = node;
				node.parent = treeNode;
				break;
			} else treeNode = treeNode.right;
		}
		else {
			if(treeNode.left == null) {
				treeNode.left = node;
				node.parent = treeNode;
				break;
			} else treeNode = treeNode.left;
		}
	} 
	
	this.count += 1;
}

BinaryTree.prototype.Min = function(startNode) {
	var node = startNode ? startNode : this.root;
	if(node == null) return null;
	while(node.left) {
		node = node.left;
	}
	return node;
}

BinaryTree.prototype.Max = function(startNode) {
	var node = startNode ? startNode : this.root;
	if(node == null) return null;
	var node = this.root;
	while(node.right) {
		node = node.right;
	}
	return node;
}

BinaryTree.prototype.Pop = function() {
	var node = this.root;
	if(node) this.Delete(node.Value());
	return node;
}