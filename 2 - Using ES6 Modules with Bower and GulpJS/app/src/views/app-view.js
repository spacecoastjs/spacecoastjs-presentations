import $ from 'jquery';
import Backbone from 'backbone';
import _ from 'underscore';

import todos from 'app/collections/todo';
import router from 'app/routers/router';
import TodoView from 'app/views/todo-view';
import templates from 'app/templates';

var ENTER_KEY = 13;

// The Application
// ---------------

// Our overall **AppView** is the top-level piece of UI.
class AppView extends Backbone.View {

	constructor (options) {
		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		this.el = '#todoapp';

		// Our template for the line of statistics at the bottom of the app.
		this.statsTemplate = templates.stats;

	// Delegated events for creating new items, and clearing completed ones.
		this.events = {
			'keypress #new-todo': 'createOnEnter',
			'click #clear-completed': 'clearCompleted',
			'click #toggle-all': 'toggleAllComplete'
		};

		super(options);
	}

	// At initialization we bind to the relevant events on the `Todos`
	// collection, when items are added or changed. Kick things off by
	// loading any preexisting todos that might be saved in *localStorage*.
	initialize () {		
		this.allCheckbox = this.$('#toggle-all')[0];
		this.$input = this.$('#new-todo');
		this.$footer = this.$('#footer');
		this.$main = this.$('#main');
		this.$list = $('#todo-list');

		this.listenTo(todos, 'add', this.addOne);
		this.listenTo(todos, 'reset', this.addAll);
		this.listenTo(todos, 'change:completed', this.filterOne);
		this.listenTo(todos, 'filter', this.filterAll);
		this.listenTo(todos, 'all', this.render);

		// Suppresses 'add' events with {reset: true} and prevents the app view
		// from being re-rendered for every model. Only renders when the 'reset'
		// event is triggered at the end of the fetch.
		todos.fetch({reset: true});
	}

	// Re-rendering the App just means refreshing the statistics -- the rest
	// of the app doesn't change.
	render () {
		var completed = todos.completed().length;
		var remaining = todos.remaining().length;

		if (todos.length) {
			this.$main.show();
			this.$footer.show();

			this.$footer.html(this.statsTemplate({
				completed: completed,
				remaining: remaining
			}));

			this.$('#filters li a')
				.removeClass('selected')
				.filter('[href="#/' + (router.todoFilter || '') + '"]')
				.addClass('selected');
		} else {
			this.$main.hide();
			this.$footer.hide();
		}

		this.allCheckbox.checked = !remaining;
	}

	// Add a single todo item to the list by creating a view for it, and
	// appending its element to the `<ul>`.
	addOne (todo) {
		var view = new TodoView({ model: todo });
		this.$list.append(view.render().el);
	}

	// Add all items in the **Todos** collection at once.
	addAll () {
		this.$list.html('');
		todos.each(this.addOne, this);
	}

	filterOne (todo) {
		todo.trigger('visible');
	}

	filterAll () {
		todos.each(this.filterOne, this);
	}

	// Generate the attributes for a new Todo item.
	newAttributes () {
		return {
			title: this.$input.val().trim(),
			order: todos.nextOrder(),
			completed: false
		};
	}

	// If you hit return in the main input field, create new **Todo** model,
	// persisting it to *localStorage*.
	createOnEnter (e) {
		if (e.which === ENTER_KEY && this.$input.val().trim()) {
			todos.create(this.newAttributes());
			this.$input.val('');
		}
	}

	// Clear all completed todo items, destroying their models.
	clearCompleted () {
		_.invoke(todos.completed(), 'destroy');
		return false;
	}

	toggleAllComplete () {
		var completed = this.allCheckbox.checked;

		todos.each(todo => todo.save({
				completed: completed
			}));
	}
}

export default AppView;