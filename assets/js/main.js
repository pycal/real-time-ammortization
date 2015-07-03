var has_focused = false;
var has_seen_tip = localStorage.getItem("rta_tip");

var open_tip_modal = function () {
  $('#tip_modal').modal();
  localStorage.setItem("rta_tip", true);
};


$(".form-control").click( function () {
	if (!has_focused && !has_seen_tip) {
		open_tip_modal();
    has_focused = true;
	}
}); 