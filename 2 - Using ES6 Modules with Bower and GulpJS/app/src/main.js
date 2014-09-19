import $ from 'jquery';
import AppView from 'app/views/app-view';
import templates from 'app/templates';

$(() => {
	// render the main content.
	$('body')
		.append(templates.main());

	// kick things off by creating the `App`
	new AppView();

	// start tracking history.
	Backbone.history.start();
});