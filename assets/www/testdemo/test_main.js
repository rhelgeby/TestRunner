function buildTests()
{
	var testCollection = new TestCollection("MainCollection");
	var testCollection2 = new TestCollection("SecondCollection");
	var testCollection3 = new TestCollection("ThirdCollection");
	
	testCollection.addTest(new TestCase("clickButton", "index.html",
	[
		function()
		{
			button = document.getElementById("myButton");
			result = document.getElementById("buttonStatus");
			
			assertNotUndefined(button, "button not found");
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
	
	
	// ----- Second collection -----
	
	testCollection2.addTest(new TestCase("clickButton2", "index.html",
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
	
	testCollection2.addTest(new TestCase("testPageSwitch2", "index.html",
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
	
	testCollection2.addTest(new TestCase("testVibrate2", "index.html", 
	[
 		function phase1()
 		{
 			console.log("testVibrate executed.");
 			vibrate(150);
 		}
 	]));
	
	
	// ----- Third collection -----
	
	testCollection3.addTest(new TestCase("dummy2", "index.html",
	[
		function()
		{
			// Fail test.
			throw "Test failed on purpose.";
		}
	]));
	
	testCollection3.addTest(new TestCase("dummy1", "index.html",
	[
		function()
		{
			// Do nothing.
		}
	]));
	
	// (Global variable.)
	testSuite = new TestSuite("MainSuite", [testCollection, testCollection2, testCollection3]);
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
		//testRunner.run();			// Automatic.
		testRunner.runIfActive();	// Manual start.
	}
}

function prepareRunner()
{
	testRunner = new TestRunner(testSuite, document.getElementById("results"), beforeTest, afterTest);
	console.log("TestRunner ready on page " + window.location.href);
}
