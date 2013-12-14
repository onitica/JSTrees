//Represents a splay tree
//Elements most recently accessed rise to the top of the tree for faster access
//Wikipedia has some nice implementations: http://en.wikipedia.org/wiki/Splay_tree
//WARNING: Does not allow addition of duplicates. Will splay duplicates to the top though

function SplayTree() {	
	this.root = null;
	this.count = 0;
}

SplayTree.prototype.Clear = function() {
	this.root = null;
	this.count = 0;
}

SplayTree.prototype.Count = function() {
	return this.count;
}

//Returns true if managed to delete node, false otherwise
SplayTree.prototype.Delete = function(val) {
	var node = this.Find(val);
	if(!node) {
		return false;
	}
	
	this.Splay(node);
	
	if(node.left && node.right) {
		var min = node.left;
		while(min.right) {
			min = min.right;
		}
		min.right = node.right;
		node.right.parent = min;
		node.left.parent = null;
		this.root = node.left;
	} else if(node.right) {
		node.right.parent = null;
		this.root = node.right;
	} else if(node.left) {
		node.left.parent = null;
		this.root = node.left;
	} else {
		this.root = null;
	}
	
	node.parent = null;
	node.left = null;
	node.right = null;
	this.count -= 1;
	return true;
}

SplayTree.prototype.Find = function(val) {
	if(this.root == null) return null;
	var node = this.root;
	while(node) {
		var comp = node.CompareToValue(val); 
		if(comp == 0) {
			this.Splay(node);
			return node;
		}
		else if(comp < 0) node = node.right;
		else node = node.left;	
	}
	return null;
}

SplayTree.prototype.GetRoot = function() {
	return this.root;
}

SplayTree.prototype.GetSortedArray = function() {
	var array = [];
	if(this.root) {
		return this.GetSortedArrayInner(this.root, array);
	}
}

SplayTree.prototype.GetSortedArrayInner = function(node, array) {
	if(!node) {
		return array;
	}
	
	this.OrderedArrayInsert(node.Value(), array);
	array = this.GetSortedArrayInner(node.left, array);
	return this.GetSortedArrayInner(node.right, array);
}

SplayTree.prototype.OrderedArrayInsert = function(value, array) {
	for(var i = 0; i < array.length; i++) {
		if(array[i] > value) {
			array.splice(i, 0, value);
			return;
		}	
	}
	array.push(value);
}

//Returns true if new insertion, false otherwise
SplayTree.prototype.Insert = function(node) {
	if(!this.root) {
		this.root = node;
		this.count = 1;
		return true;
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
		else if(comp < 0){
			if(treeNode.left == null) {
				treeNode.left = node;
				node.parent = treeNode;
				break;
			} else treeNode = treeNode.left;
		} else {
			this.Splay(treeNode);
			return false;
		}
	}
	
	this.Splay(node);
	this.count += 1;
	return true;
}

SplayTree.prototype.MakeLeftChildParent = function(node, parent) {
	var grandParent = parent.parent;
	if(grandParent) {
		if(grandParent.left && grandParent.left.Value() == parent.Value()) {
			grandParent.left = node;
		} else {
			grandParent.right = node;
		}
	}
	if(node.right) {
		node.right.parent = parent;
	}
	node.parent = grandParent;
	parent.parent = node;
	parent.left = node.right;
	node.right = parent;
}

SplayTree.prototype.MakeRightChildParent = function(node, parent) {
	var grandParent = parent.parent;
	if(grandParent) {
		if(grandParent.left && grandParent.left.Value() == parent.Value()) {
			grandParent.left = node;
		} else {
			grandParent.right = node;
		}
	}
	if(node.left) {
		node.left.parent = parent;
	}
	node.parent = grandParent;
	parent.parent = node;
	parent.right = node.left;
	node.left = parent;
}

SplayTree.prototype.Pop = function() {
	var node = this.root;
	if(node) this.Delete(node.Value());
	return node;
}

SplayTree.prototype.Splay = function(node) {
	while(node.parent) {
		var parent = node.parent;
		var grandParent = parent.parent;
		
		if(!grandParent) {
			if(parent.left && parent.left.Value() == node.Value()) {
				this.MakeLeftChildParent(node, parent);
			} else {
				this.MakeRightChildParent(node, parent);
			}
		} else {
			if(parent.left && parent.left.Value() == node.Value()) {
				if(grandParent.left && grandParent.left.Value() == parent.Value()) {
					this.MakeLeftChildParent(parent, grandParent);
					this.MakeLeftChildParent(node, parent);
				} else {
					this.MakeLeftChildParent(node, node.parent);
					this.MakeRightChildParent(node, node.parent);
				}
			} else {
				if(grandParent.left && grandParent.left.Value() == parent.Value()) {
					this.MakeRightChildParent(node, node.parent);
					this.MakeLeftChildParent(node, node.parent);
				} else {
					this.MakeRightChildParent(parent, grandParent);
					this.MakeRightChildParent(node, parent);
				}
			}
		}	
	}
	
	this.root = node;
}