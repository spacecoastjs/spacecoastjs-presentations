import Backbone from 'backbone';

// Todo Model
// ----------

// Our basic **Todo** model has `title`, `order`, and `completed` attributes.
class TodoModel extends Backbone.Model {

	constructor (attributes, options) {
		// Default attributes for the todo
		// and ensure that each todo created has `title` and `completed` keys.
		this.defaults = {
			title: '',
			completed: false
		};

		super(attributes, options);
	}

	// Toggle the `completed` state of this todo item.
	toggle () {
		this.save({
			completed: !this.get('completed')
		});
	}
}

export default TodoModel;