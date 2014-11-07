
// when the user clicks the "=" button...
document.getElementById('btnEquals').addEventListener('click', function () {

	// ui elements.
	var $ddlOperator = document.getElementById('ddlOperator'),
		$nbrValue1 = document.getElementById('nbrValue1'),
		$nbrValue2 = document.getElementById('nbrValue2'),
		$lblResult = document.getElementById('lblResult');

	// get the operator.
	var operator = $ddlOperator.options[$ddlOperator.selectedIndex].value;

	// get the numbers.
	var number1 = parseInt($nbrValue1.value),
		number2 = parseInt($nbrValue2.value);

	// calculate the result.
	var result = calculator[operator](number1, number2);

	// show it on the screen.
	$lblResult.innerHTML = result;

}, false)