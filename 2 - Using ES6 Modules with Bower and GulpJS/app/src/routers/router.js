import Backbone from 'backbone';

import todos from 'app/collections/todo';

class TodoRouter extends Backbone.Router {

	constructor() {
		this.routes = {
			'*filter': 'setFilter'
		};
		super();
	}
	
	setFilter (param) {
		// Set the current filter to be used
		this.todoFilter = param || '';

		// Trigger a collection filter event, causing hiding/unhiding
		// of Todo view items
		todos.trigger('filter');
	}
}

export default new TodoRouter();