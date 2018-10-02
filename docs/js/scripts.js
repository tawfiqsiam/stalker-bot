/* eslint-disable */
$(function() {
	$('[data-toggle="tooltip"]').tooltip();
});

const SRSettings = {
    reset: true,
    useDelay: 'onload',
	// ? this will affect Mobile performance? Need More Test
	mobile: true,
};

const SrClassOptions = {
    duration: 4600,
    scale: 0.85,
    easing: 'ease-in-out',
}

const RightOptions = {
	duration: 4500,
    origin: 'right'/*,
    easing: 'ease-in-out'*/
};

const LeftOptions = {
	duration: 4500,
    origin: 'left' /*,
    easing: 'ease-in-out'*/
};

const TopOptions = {
	duration: 4500,
    origin: 'top'/*,
    easing: 'ease-in-out'*/
};

const BottomOptions = {
	duration: 4500,
    origin: 'bottom'/*,
    easing: 'ease-in-out'*/
};

document.addEventListener('DOMContentLoaded', function(event) {
    ScrollReveal(SRSettings);
	ScrollReveal().reveal('.right-reveal', RightOptions);
	ScrollReveal().reveal('.left-reveal', LeftOptions);
	ScrollReveal().reveal('.top-reveal', TopOptions);
	ScrollReveal().reveal('.bot-reveal', BottomOptions);
});