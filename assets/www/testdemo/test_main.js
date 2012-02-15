tests = {};
testRunner = new TestRunner();

function prepareRunner()
{
	testRunner = new TestRunner(tests, document.getElementById("results"), true);
	console.log("TestRunner ready.");
}

tests.before = function()
{
	console.log("before");
}

tests.after = function()
{
	console.log("after");
}

tests.testClickButton = function()
{
	console.log("click button");
	var button = document.getElementById("myButton");
	var status = document.getElementById("buttonStatus");
	
	if (button)
	{
		 button.click();		
	}
	
	// todo: assert
	if (status.innerHTML != "Clicked.")
	{
		throw "Button wasn't clicked.";
	}
}

tests.testVibrate = function()
{
	vibrate(100);
}

tests.testBeep = function()
{
	beep(2);
}
