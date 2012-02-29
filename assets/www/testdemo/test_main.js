//tests = {};
//testRunner = new TestRunner();
//tests = [];

function buildTests()
{
	var testCollection = new TestCollection("MainCollection");

	testCollection.addTest(new TestCase("clickButton", "index.html",
	[
		function()
		{
			button = document.getElementById("myButton");
			result = document.getElementById("buttonStatus");
			
			if (!button)
			{
				throw "Button not found.";
			}
			if (!result)
			{
				throw "Result element not found.";
			}
			
			button.click();
			
			if (result.innerHTML != "Clicked.")
			{
				throw "Button wasn't clicked.";
			}
		}
	]));
	
	testCollection.addTest(new TestCase("testPageSwitch", "index.html",
	[
		function()
		{
			console.log("Changing page...");
			window.location.href = "page2.html";
			
			// Abort script.
			return false;			
		},
		function()
		{
			console.log("Phase 2 in page: " + window.location.href);
			
			var element = document.getElementById("page2");
			console.log("page2 element: " + element);
			
			if (!element)
			{
				throw "Element 'page2' not found.";
			}
		}
	]));
	
	testCollection.addTest(new TestCase("testVibrate", "index.html", 
	[
 		function phase1()
 		{
 			console.log("testVibrate executed.");
 			vibrate(150);
 		}
 	]));
	
	// (Global variable.)
	testSuite = new TestSuite("MainSuite", [testCollection]);
}

function beforeTest()
{
	console.log("'before' executed");
}

function afterTest()
{
	console.log("'after' executed");
}



// ---- Init ----

console.log("Hook deviceready event");
document.addEventListener("deviceready", onDeviceReady, true);
var deviceReadyFired = false;

function init()
{
	console.log("init (onload)");
	buildTests();
	prepareRunner();
	
	setTimeout("run()", 200);
}

function onDeviceReady()
{
	deviceReadyFired = true;
	console.log("DeviceReady fired...");
	testRunner.run();
}

function run()
{
	if (!deviceReadyFired)
	{
		testRunner.runIfActive();
	}
}

function prepareRunner()
{
	testRunner = new TestRunner(testSuite, document.getElementById("results"), beforeTest, afterTest);
	console.log("TestRunner ready on page " + window.location.href);
}
