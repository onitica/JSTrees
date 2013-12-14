//Represents an AVL tree
//A self-balancing binary search tree
//Explanation: http://en.wikipedia.org/wiki/AVL_tree
//Useful C++ Implementation: http://en.wikibooks.org/wiki/Algorithm_Implementation/Trees/AVL_tree
//WARNING: Will ignore duplicate keys being inserted

function AVLTree() {	
	this.root = null;
	this.count = 0;
}

AVLTree.prototype.Clear = function() {
	this.root = null;
	this.count = 0;
}

AVLTree.prototype.Count = function() {
	return this.count;
}

//Returns true if successful, false otherwise
AVLTree.prototype.Delete = function(val) {
	if(!this.root) return false;
	
	var replacement = null, replacementParent = null, tempNode = null;
	var toBeRemoved = this.Find(val);
	if(!toBeRemoved) return false;
	
	var parent = toBeRemoved.parent;
	
	var leftSided = false;
	if(parent && parent.left && parent.left.Value() == val) {
		leftSided = true;
	}
	
	var balance = this.GetBalance(toBeRemoved);
	
	if(!toBeRemoved.left && !toBeRemoved.right) { //Case when no children
		if(parent) {
			if(leftSided) parent.left = null;
			else parent.right = null;
			
			this.UpdateRank(parent);
			this.BalanceAtNode(parent);
		} else {
			this.root = null;
		}
	} else if(!toBeRemoved.right) { //Case no right child
		if(parent) {
			if(leftSided) this.SetLeftChild(parent, toBeRemoved.left);
			else this.SetRightChild(parent, toBeRemoved.left);
			
			this.UpdateRank(parent);
			this.BalanceAtNode(parent);
		} else {
			this.SetRoot(toBeRemoved.left);
		}
	} else if(!toBeRemoved.left) { //Case no left child
		if(parent) {
			if(leftSided) this.SetLeftChild(parent, toBeRemoved.right);
			else this.SetRightChild(parent, toBeRemoved.right);
			
			this.UpdateRank(parent);
			this.BalanceAtNode(parent);
		} else {
			this.SetRoot(toBeRemoved.right);
		}
	} else { //Case both children
		if(balance > 0) {
			if(toBeRemoved.left && !toBeRemoved.left.right) {
				replacement = toBeRemoved.left;
				this.SetRightChild(toBeRemoved.right);
				
				tempNode = replacement;
			}
			else {
				replacement = toBeRemoved.left ? toBeRemoved.left.right : null;
				while(replacement && replacement.right) {
					replacement = replacement.right;
				}
				
				replacementParent = replacement.parent;
				this.SetRightChild(replacementParent, replacement.left);
				
				tempNode = replacementParent;
				
				this.SetLeftChild(replacement, toBeRemoved.left);
				this.SetRightChild(replacement, toBeRemoved.right);
			}
		} else {
			if(toBeRemoved.right && !toBeRemoved.right.left) {
				replacement = toBeRemoved.right;
				this.SetLeftChild(replacement, toBeRemoved.left);
				
				tempNode = replacement;
			} else {
				replacement = toBeRemoved.right ? toBeRemoved.right.left : null;
				while(replacement && replacement.left) {
					replacement = replacement.left;
				}
				
				replacementParent = replacement.parent;
				this.SetLeftChild(replacementParent, replacement.right);
				
				tempNode = replacementParent;
				
				this.SetLeftChild(replacement, toBeRemoved.left);
				this.SetRightChild(replacement, toBeRemoved.right);
			}
		}
		
		if(parent) {
			if(leftSided) this.SetLeftChild(parent, replacement);
			else this.SetRightChild(parent, replacement);
		} else {
			this.SetRoot(replacement);
		}

		this.BalanceAtNode(tempNode);
	}
	
	this.count -= 1;
	return true;
}

AVLTree.prototype.Find = function(val) {
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

AVLTree.prototype.GetBalance = function(node) {
	if(!node) return 0;
	return this.Rank(node.left) - this.Rank(node.right);
}

AVLTree.prototype.GetRoot = function() {
	return this.root;
}

AVLTree.prototype.GetSortedArray = function() {
	var array = [];
	if(this.root) {
		return this.GetSortedArrayInner(this.root, array);
	}
}

AVLTree.prototype.GetSortedArrayInner = function(node, array) {
	if(!node) {
		return array;
	}
	
	this.OrderedArrayInsert(node.Value(), array);
	array = this.GetSortedArrayInner(node.left, array);
	return this.GetSortedArrayInner(node.right, array);
}

AVLTree.prototype.OrderedArrayInsert = function(value, array) {
	for(var i = 0; i < array.length; i++) {
		if(array[i] > value) {
			array.splice(i, 0, value);
			return;
		}	
	}
	array.push(value);
}

AVLTree.prototype.BalanceAtNode = function(node) {
	var balance = this.GetBalance(node);
	
	if (balance > 1) {
		if(this.GetBalance(node.left) < 0) {
			this.RotateLeft(node.left);
		} 
		return this.RotateRight(node);
	} else if(balance < -1) {
		if(this.GetBalance(node.right) > 0) {
			this.RotateRight(node.right);
		} 
		return this.RotateLeft(node);
	}
	
	return node;
}

//returns false if insert failed because value already exists
AVLTree.prototype.Insert = function(node) {
	if(!this.root) {
		this.root = node;
	} else {
		var temp = this.root;
		var addedNode = null;
		
		while(true) {
			if(temp.Value() > node.Value()) {
				if(!temp.left) {
					addedNode = this.SetLeftChild(temp, node);
					break;
				} else {
					temp = temp.left;
				}
			} else if(temp.Value() < node.Value()) {
				if(!temp.right) {
					addedNode = this.SetRightChild(temp, node);
					break;
				} else {
					temp = temp.right;
				}
			} else {
				return false; //Value already exists
			}
		}
		temp = addedNode;
		while(temp)
		{
			this.UpdateRank(temp);
			this.BalanceAtNode(temp);
			temp = temp.parent;
		}
	}

	this.count += 1;
	return true;
}

AVLTree.prototype.Min = function(startNode) {
	var node = startNode ? startNode : this.root;
	if(node == null) return null;
	while(node.left) {
		node = node.left;
	}
	return node;
}

AVLTree.prototype.Max = function(startNode) {
	var node = startNode ? startNode : this.root;
	if(node == null) return null;
	var node = this.root;
	while(node.right) {
		node = node.right;
	}
	return node;
}

AVLTree.prototype.Pop = function() {
	var node = this.root;
	if(node) this.Delete(node.Value());
	return node;
}

AVLTree.prototype.Rank = function(node) {
	if(!node) return 0;
	else return node.rank;
}

AVLTree.prototype.RotateRight = function(node) {
	var leftNode = node.left;
	var leftRightNode = leftNode.right;
	
	var parent = node.parent;
	
	this.SetLeftChild(node, leftRightNode);
	this.SetRightChild(leftNode, node);
	
	if(parent) {
		leftNode.parent = parent;
		if(parent.left && parent.left.Value() == node.Value())	parent.left = leftNode;
		else parent.right = leftNode;
	} else {
		this.SetRoot(leftNode);
	}
	
	return leftNode;
}

AVLTree.prototype.RotateLeft = function(node) {
	var rightNode = node.right;
	var rightLeftNode = rightNode.left;
		
	var parent = node.parent;
	
	this.SetRightChild(node, rightLeftNode);
	this.SetLeftChild(rightNode, node);
	
	if(parent) {
		rightNode.parent = parent;
		if(parent.left && parent.left.Value() == node.Value()) parent.left = rightNode;
		else parent.right = rightNode;
	} else {
		this.SetRoot(rightNode);
	}
	
	return rightNode;
}

AVLTree.prototype.SetRightChild = function(parent, child) {
	if(child) child.parent = parent;
	parent.right = child;
	this.UpdateRank(parent);
	return child;
}

AVLTree.prototype.SetRoot = function(node) {
	this.root = node;
	node.parent = null;
}

AVLTree.prototype.SetLeftChild = function(parent, child) {
	if(child) child.parent = parent;
	parent.left = child;
	this.UpdateRank(parent);
	return child;	
}

AVLTree.prototype.UpdateRank = function(node) {
	node.rank = Math.max(this.Rank(node.left), this.Rank(node.right)) + 1;
}