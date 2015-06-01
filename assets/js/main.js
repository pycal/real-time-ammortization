var has_focused = false;

var open_tip_modal = function () {
  $('#tip_modal').modal();
};


$(".form-control").click( function () {
	if (!has_focused) {
		open_tip_modal();
    has_focused = true;
	}
}); 