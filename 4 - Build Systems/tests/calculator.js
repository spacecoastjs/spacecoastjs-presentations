
var calc = require('../src/calculator');

exports["Addition Test"] = function (test) {

	// Arrange
	var num1 = 5, num2 = 10;
	var expected = num1 + num2;

	// Act
	var result = calc.add(num1, num2);

	// Assert
	test.equals(expected, result, "Addition result is incorrect.");
	test.done();
};

exports["Subtraction Test"] = function (test) {

	// Arrange
	var num1 = 5, num2 = 10;
	var expected = num1 - num2;

	// Act
	var result = calc.subtract(num1, num2);

	// Assert
	test.equals(expected, result, "Subtraction result is incorrect.");
	test.done();
};

exports["Multiplication Test"] = function (test) {

	// Arrange
	var num1 = 5, num2 = 10;
	var expected = num1 * num2;

	// Act
	var result = calc.multiply(num1, num2);

	// Assert
	test.equals(expected, result, "Multiplication result is incorrect.");
	test.done();
};

exports["Division Test"] = function (test) {

	// Arrange
	var num1 = 10, num2 = 5;
	var expected = num1 / num2;

	// Act
	var result = calc.divide(num1, num2);

	// Assert
	test.equals(expected, result, "Division result is incorrect.");
	test.done();
};