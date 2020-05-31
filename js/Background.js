$(function () {

	function deplace() {
		//console.log(pause);

			$('#fond').animate({
				left: '-=250'
			}, 1400, 'linear', function () {
				$('#fond').css('top', 0);
				deplace();
			});
	};

	deplace();

});
