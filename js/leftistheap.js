//Represents a leftist-heap
//Allows for quicker merging

function LeftistHeap() {
	this.root = null;
	this.count = 0;
}

LeftistHeap.prototype.Clear = function() {
	this.root = null;
	this.count = 0;
}

LeftistHeap.prototype.Clone = function() {
	if(this.root) {
		var heap = new LeftistHeap();
		heap.root = this.CloneInner(this.root);
		heap.count = this.count;
		return heap;
	} 
}

LeftistHeap.prototype.CloneInner = function(node) {
	if(node) {
		var newNode = $.extend(true, new TreeJS.Node(), node);
		newNode.left = this.CloneInner(newNode.left);
		newNode.right = this.CloneInner(newNode.right);
	
		return newNode;
	}
}

LeftistHeap.prototype.Count = function() {
	return this.count;
}

LeftistHeap.prototype.GetRoot = function() {
	return this.root;
}

//Currently non-destructive - Can be changed by removing deepCopy lines
LeftistHeap.prototype.GetSortedArray = function() {
	var sortedArray = [];
	var deepCopy = this.Clone();
	
	//Heap sort here
	var top = this.Pop();
	while(top != null) {
		sortedArray.push(top.Value());
		top = this.Pop();
	}
	
	this.root = deepCopy.root;
	this.count = deepCopy.count;
	return sortedArray;
}

LeftistHeap.prototype.Insert = function(node) {
	this.root = this.Merge(this.root, node);
	this.count += 1;
}

LeftistHeap.prototype.Merge = function(h1, h2) {
	//Check if we are trying to merge null nodes
	if(h1 == null) {
		h1 = h2;
		return h1;				
	}
	if(h2 == null) {
		return h1;
	}
	
	// make sure that the val of h1 is ot larger than the h1 of h2
	if(h2.CompareTo(h1) > 0) {
		var temp = h1;
		h1 = h2;
		h2 = temp;
	}

	// now, val of h1 is the val of the merged heap; merge the rest of h1 with h2
	if(h1.right == null) {
		h1.right = h2;
	} else {
		h1.right = this.Merge(h1.right, h2);
	}

	// make sure the leftis property is preserved: rank of left >= rank of right
	// assume rank of nil to be 0 - all leaves are nil-nodes
	if(h1.left == null && h1.right.rank >= 0) {
		h1.left = h1.right;
		h1.right = null;
	} else if (h1.left != null && h1.left.rank < h1.right.rank) {
		var temp = h1.left;
		h1.left = h1.right;
		h1.right = temp;	
	}

	// adjust rank of the h1 - since rank of right child is never greater than left, 
	// then it is 1+rank of right child
	if(h1.right != null) h1.rank = h1.right.rank + 1;

	return h1;
}

LeftistHeap.prototype.Pop = function() {
	if(this.root == null) return null;
	var min = this.root;
	this.root = this.Merge(this.root.left, this.root.right);
	this.count -= 1;
	return min;
}