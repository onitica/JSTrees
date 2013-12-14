//A max or min Binary Heap. Often used for priority queues.
//Implementation based on pseudocode from here: http://courses.csail.mit.edu/6.006/fall10/handouts/recitation10-8.pdf
function BinaryHeap() {
	this.data = [];
}

BinaryHeap.prototype.Clear = function() {
	this.data = [];
}

BinaryHeap.prototype.Count = function() {
	return this.data.length;
}

BinaryHeap.prototype.Pop = function() {
	if(this.data.length > 1) {
		var top = this.data[0];
		this.data[0] = this.data.pop();
		this.Heapify(0); 
		return top;
	} else if(this.data.length == 1) {
		return this.data.shift();
	}
	else return null;
}

BinaryHeap.prototype.Heapify = function(index) {
	var leftIdx = this.LeftChild(index);
	var rightIdx = this.RightChild(index);
	var topIdx = index;
	
	if(leftIdx != null && (this.data[leftIdx].CompareTo(this.data[index]) > 0)) {
		topIdx = leftIdx;
	}
    if(rightIdx != null && (this.data[rightIdx].CompareTo(this.data[topIdx]) > 0)) {
		topIdx = rightIdx;
	}
	if(topIdx != index) {
		var swap = this.data[index];
		this.data[index] = this.data[topIdx];
		this.data[topIdx] = swap;
		this.Heapify(topIdx);
	}
}

BinaryHeap.prototype.Parent = function(index) {
	return Math.floor(index/2);	
}

BinaryHeap.prototype.Insert = function(node) {
	if(!node) return;
	
	this.data.push(node);
	var nodeIndex = this.data.length - 1;
	var ParentIndex = this.Parent(nodeIndex);
	while(nodeIndex > 0) {
		if(node.CompareTo(this.data[ParentIndex]) > 0) {
			this.data[nodeIndex] = this.data[ParentIndex];
			nodeIndex = ParentIndex;
			this.data[ParentIndex] = node;
			ParentIndex = this.Parent(nodeIndex);
		} else break;
	}
}
			
BinaryHeap.prototype.LeftChild = function(index) {
	if(2*index+1 <= this.data.length-1) {
		return 2*index+1;
	} else return null;
}

BinaryHeap.prototype.RightChild = function(index) {
	if(2*index+2 <= this.data.length-1) {
		return 2*index+2;
	} else return null;
}

BinaryHeap.prototype.ConvertToLinkedListTree = function(node, index) {
	if(node != null) {
		var leftIdx = this.LeftChild(index);
		var rightIdx = this.RightChild(index);
		node.left = this.data[leftIdx];
		node.right = this.data[rightIdx];
		this.ConvertToLinkedListTree(node.left, leftIdx);
		this.ConvertToLinkedListTree(node.right, rightIdx);
		return node;
	}
}

BinaryHeap.prototype.GetRoot = function() {
	return this.ConvertToLinkedListTree(this.data[0], 0);
}

//Could simply return the sorted inner array - However I wanted to implement heap sort
//Remove the lines with deepCopy to have a destructive sort
BinaryHeap.prototype.GetSortedArray = function() {
	//Save state since popping is destructive
	var deepCopy = [];
	this.data.forEach(function(e) {
		deepCopy.push($.extend(true, {}, e));
	});
	
	//Heap sort here
	var sortedArray = [];
	var top = this.Pop();
	while(top != null) {
		sortedArray.push(top.Value());
		top = this.Pop();
	}
	
	this.data = deepCopy; //Restore previous state
	return sortedArray;
}
