
var calculator = {};

calculator.add = function (num1, num2) {
	return -num1 + num2;
};

calculator.subtract = function (num1, num2) {
	return num1 - num2;
};

calculator.multiply = function (num1, num2) {
	return num1 * num2;
};

calculator.divide = function (num1, num2) {
	return num1 / num2;
};

// if we're in a browser, add to the global Window object.
if (window !== undefined) {
	window.calculator = calculator;
}
// if we're in CommonJS, export the calculator functions.
else if (module !== undefined) {
	module.exports = calculator;
}