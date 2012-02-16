//tests = {};
testRunner = new TestRunner();

tests =
[
	new TestCase("test1", "index.html",
	[
		function()
		{
			console.log("Phase 1 of test1 executed.");
		},
		function()
		{
			console.log("Phase 2 of test1 executed.");
		}
	]),
	
	new TestCase("testBeep", "index.html", 
	[
 		function phase1()
 		{
 			console.log("testBeep executed.");
 			beep(2);
 		}
 	])
];

function prepareRunner()
{
	testRunner = new TestRunner(tests, document.getElementById("results"));
	console.log("TestRunner ready.");
}

function beforeTest()
{
	console.log("before");
}

function afterTest()
{
	console.log("after");
}

/*tests.testClickButton = function()
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
}*/

/*tests.testBenchmark = function()
{
	var a = 0;
	var b = 0;
	var c = 0;
	
	for (var i = 0; i < 10000000; i++)
	{
		a = i * 2;
		b = a * a;
		c = a + b;
	}
}*/
