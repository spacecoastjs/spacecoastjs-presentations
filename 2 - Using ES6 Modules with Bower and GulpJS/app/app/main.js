import $ from 'jquery';
import _ from 'lodash';

import data from 'app/data';

var HEADER_TEXT = 'Everything is awesome in ES6!';

$(() => {
	
	var $body = $('body');

	$body
		.append(`<h1>${HEADER_TEXT}</h1>`)
		.css('background-color', 'green');

	_(data)
		.filter(i => (i % 3 === 0))
		.forEach(i => $body.append(`<li>${i}</li>`));
});