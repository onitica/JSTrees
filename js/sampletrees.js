//sample tree to draw
//binary trees should be converted to this format
var SampleTree = {
	val : "R",
	left : {
		val : "A",
		left : {
			val : "B",
			left : null,
			right : null
		},
		right : {
			val : "C",
			left : null,
			right : null
		}
	},
	right : {
		val : "D",
		left : {
			val : "E",
			left : {
				val : "G",
				left : null,
				right : null
			},
			right : null
		},
		right : {
			val : "F",
			left : null,
			right : null
		}	
	}
}

var SampleBTree = {
	val: "A",
	children : [
		{val: "B",
		 children : [
			{val: "C",
			 children: null}
		]},
		{val: "D",
		 children : [
			{val: "E1",
			 children: null},
			{val: "E2",
			children: null},
			{val: "E3",
			children: null},
			{val: "E4",
			 children: null}
		]},
		{val: "F",
		children : null}
	]
}