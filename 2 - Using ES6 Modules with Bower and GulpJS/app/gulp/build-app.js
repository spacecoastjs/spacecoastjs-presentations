
var traceur    = require('gulp-traceur'),
	foreach    = require('gulp-foreach'),
	path       = require('path');

module.exports = function () {

	return foreach(function (stream, file) {

		// the "app" directory 
		var pathPrefix = path.resolve(file.cwd, 'app');

		// first, make the path relative.
		var modName = file.history[0].substring(pathPrefix.length + 1); // extra +1 for an additional '/' after 'app'.

		// then, strip off the file extension.
		modName = modName.substring(0, modName.lastIndexOf('.'));

		// finally, each file needs to be run through Traceur using the appropriate module name.
		return stream
	        .pipe(traceur({
		    	modules: 'instantiate',
		    	moduleName: 'app/' + modName
	        }));
	})
};