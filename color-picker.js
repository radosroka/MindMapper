$(function() {
	$("#colors-picker").spectrum({
    	flat: false,
    	showInput: true,
    	preferredFormat: "rgb",
    	change: function() {unsetRandomColor()},
	});
});