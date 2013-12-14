;var TreeJS = function() {
	//Pass in a map of information to create a node
	//The possible Valid vals are - val, weight
	function Node(params) {
		if(!params) params = {};
		this.val = params.val ? params.val : 0;
		this.rank = params.rank ? params.rank : 0;
		return this;
	}
	
	//Returns the value or 'key' of the node. Used for find functions
	Node.prototype.Value = function() {
		return this.val;
	}
	
	//Use to compare two nodes. Less than is return value is < 0, equal if = 0, and greater if > 0
	Node.prototype.CompareTo = function(node) {
		return this.val - node.val;
	}
	
	//Use this to compare a node to a key value, same return values as CompareTo
	Node.prototype.CompareToValue = function(value) {
		return this.val - value;
	}
	
	return {
		Node : Node
	}
}();
