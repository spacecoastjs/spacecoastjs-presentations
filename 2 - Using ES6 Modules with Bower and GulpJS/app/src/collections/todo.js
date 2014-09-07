import Backbone from 'backbone';
import BackboneLocalStorage from 'backbone.localStorage';

import Todo from 'app/models/todo'

// Todo Collection
// ---------------

// The collection of todos is backed by *localStorage* instead of a remote
// server.
class Todos extends Backbone.Collection {

	constructor () {
		// Reference to this collection's model.
		this.model = Todo;
	
		// Save all of the todo items under the `"todos"` namespace.
		this.localStorage = new BackboneLocalStorage('todos-backbone');

		// Todos are sorted by their original insertion order.
		this.comparator = 'order';

		super();
	}

	// Filter down the list of all todo items that are finished.
	completed () {
		return this.where({completed: true});
	}

	// Filter down the list to only todo items that are still not finished.
	remaining () {
		return this.where({completed: false});
	}

	// We keep the Todos in sequential order, despite being saved by unordered
	// GUID in the database. This generates the next order number for new items.
	nextOrder () {
		return this.length ? this.last().get('order') + 1 : 1;
	}
}

// Create our global collection of **Todos**.
export default new Todos();