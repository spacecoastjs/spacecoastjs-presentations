
calculator = {};

/**
 * @public
 * Adds the given numbers.
 */
calculator.add = function (num1, num2) {
	return num1 + num2;
};

/**
 * @public
 * Subtracts the given numbers.
 */
calculator.subtract = function (num1, num2) {
	return num1 - num2;
};

/**
 * @public
 * Multiplies the given numbers.
 */
calculator.multiply = function (num1, num2) {
	return num1 * num2;
};

/**
 * @public
 * Divides the given numbers.
 */
calculator.divide = function (num1, num2) {
	return num1 / num2;
};

// if we're in a browser, add to the global Window object.
//if (window !== undefined) {
//	window.calculator = calculator;
//}

// if we're in CommonJS, export the calculator object.
//else if (module !== undefined) {
	module.exports = calculator;
//}