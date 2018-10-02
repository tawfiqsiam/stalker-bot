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
	duration: 3400,
    origin: 'right',
    easing: 'ease-in-out',
    distance: '35%'
};

const LeftOptions = {
	duration: 3400,
    origin: 'left',
    easing: 'ease-in-out',
    distance: '35%'
};

const TopOptions = {
	duration: 3400,
    origin: 'top',
    easing: 'ease-in-out',
    distance: '35%'
};

const BottomOptions = {
	duration: 3400,
    origin: 'bottom',
    easing: 'ease-in-out',
    distance: '35%'
};

document.addEventListener('DOMContentLoaded', function(event) {
    ScrollReveal(SRSettings);
	ScrollReveal().reveal('.right-reveal', RightOptions);
	ScrollReveal().reveal('.left-reveal', LeftOptions);
	ScrollReveal().reveal('.top-reveal', TopOptions);
	ScrollReveal().reveal('.bot-reveal', BottomOptions);
});