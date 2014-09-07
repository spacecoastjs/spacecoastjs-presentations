import $ from 'jquery';
import Backbone from 'backbone';

import router from 'app/routers/router';
import templates from 'app/templates';

var 	ENTER_KEY = 13,
		ESC_KEY   = 27;

// Todo Item View
// --------------

// The DOM element for a todo item...
class TodoView extends Backbone.View {

	constructor (options) {

		//... is a list tag.
		this.tagName = 'li';

		// Cache the template function for a single item.
		this.template = templates.item;

		// The DOM events specific to an item.
		this.events = {
			'click .toggle': 'toggleCompleted',
			'dblclick label': 'edit',
			'click .destroy': 'clear',
			'keypress .edit': 'updateOnEnter',
			'keydown .edit': 'revertOnEscape',
			'blur .edit': 'close'
		};

		super(options);
	}

	// The TodoView listens for changes to its model, re-rendering. Since
	// there's a one-to-one correspondence between a **Todo** and a
	// **TodoView** in this app, we set a direct reference on the model for
	// convenience.
	initialize () {
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
		this.listenTo(this.model, 'visible', this.toggleVisible);
	}

	// Re-render the titles of the todo item.
	render () {
		// Backbone LocalStorage is adding `id` attribute instantly after
		// creating a model.  This causes our TodoView to render twice. Once
		// after creating a model and once on `id` change.  We want to
		// filter out the second redundant render, which is caused by this
		// `id` change.  It's known Backbone LocalStorage bug, therefore
		// we've to create a workaround.
		// https://github.com/tastejs/todomvc/issues/469
		if (this.model.changed.id !== undefined) {
			return;
		}

		this.$el.html(this.template(this.model.toJSON()));
		this.$el.toggleClass('completed', this.model.get('completed'));
		this.toggleVisible();
		this.$input = this.$('.edit');
		return this;
	}

	toggleVisible () {
		this.$el.toggleClass('hidden', this.isHidden());
	}

	isHidden () {
		var isCompleted = this.model.get('completed');
		return (// hidden cases only
			(!isCompleted && router.todoFilter === 'completed') ||
			(isCompleted && router.todoFilter === 'active')
		);
	}

	// Toggle the `"completed"` state of the model.
	toggleCompleted () {
		this.model.toggle();
	}

	// Switch this view into `"editing"` mode, displaying the input field.
	edit () {
		this.$el.addClass('editing');
		this.$input.focus();
	}

	// Close the `"editing"` mode, saving changes to the todo.
	close () {
		var value = this.$input.val();
		var trimmedValue = value.trim();

		// We don't want to handle blur events from an item that is no
		// longer being edited. Relying on the CSS class here has the
		// benefit of us not having to maintain state in the DOM and the
		// JavaScript logic.
		if (!this.$el.hasClass('editing')) {
			return;
		}

		if (trimmedValue) {
			this.model.save({ title: trimmedValue });

			if (value !== trimmedValue) {
				// Model values changes consisting of whitespaces only are
				// not causing change to be triggered Therefore we've to
				// compare untrimmed version with a trimmed one to check
				// whether anything changed
				// And if yes, we've to trigger change event ourselves
				this.model.trigger('change');
			}
		} else {
			this.clear();
		}

		this.$el.removeClass('editing');
	}

	// If you hit `enter`, we're through editing the item.
	updateOnEnter (e) {
		if (e.which === ENTER_KEY) {
			this.close();
		}
	}

	// If you're pressing `escape` we revert your change by simply leaving
	// the `editing` state.
	revertOnEscape (e) {
		if (e.which === ESC_KEY) {
			this.$el.removeClass('editing');
			// Also reset the hidden input back to the original value.
			this.$input.val(this.model.get('title'));
		}
	}

	// Remove the item, destroy the model from *localStorage* and delete its view.
	clear () {
		this.model.destroy();
	}
}

export default TodoView;