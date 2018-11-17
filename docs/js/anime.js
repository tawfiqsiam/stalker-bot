/* eslint-disable */
let lineDraw = anime({
	targets: '#lineDrawing path',
	strokeDashoffset: [anime.setDashoffset, 0],
	easing: 'easeInOutSine',
	duration: 1500,
	delay: function(el, i) { return i * 250; },
	direction: 'alternate',
});
