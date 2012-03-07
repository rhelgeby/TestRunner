function buildTests()
{
	var testCollection = new TestCollection("Main Collection");
	var testCollection2 = new TestCollection("Second Collection");
	var testCollection3 = new TestCollection("Third Collection");
	
	testCollection.addTest(new TestCase("click button", "index.html",
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
	
	testCollection.addTest(new TestCase("switch page", "index.html",
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
	
	testCollection.addTest(new TestCase("vibrate", "index.html", 
	[
 		function phase1()
 		{
 			console.log("testVibrate executed.");
 			vibrate(150);
 		}
 	]));
	
	
	// ----- Second collection -----
	
	testCollection2.addTest(new TestCase("click button 2", "index.html",
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
	
	testCollection2.addTest(new TestCase("switch page 2", "index.html",
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
	
	testCollection2.addTest(new TestCase("vibrate 2", "index.html", 
	[
 		function phase1()
 		{
 			console.log("testVibrate executed.");
 			vibrate(150);
 		}
 	]));
	
	
	// ----- Third collection -----
	
	testCollection3.addTest(new TestCase("fail test", "index.html",
	[
		function()
		{
			// Fail test.
			throw "Test failed on purpose.";
		}
	]));
	
	testCollection3.addTest(new TestCase("a test with a very long name", "index.html",
	[
		function()
		{
			// Do nothing.
		}
	]));
	
	
	var emptyCollection = new TestCollection("Empty collection", []);
	
	// (testSuite must be global; not using var keyword.)
	
	testSuite = new TestSuite("All tests", [testCollection, testCollection2, testCollection3], beforeTest, afterTest);
	//testSuite = new TestSuite("MainSuite", [testCollection, testCollection3]);
	//testSuite = new TestSuite("EmptySuite", [emptyCollection]);
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
document.addEventListener("deviceready", onDeviceReady, true);
var deviceReadyFired = false;
var displayResults = false;

function init(results)
{
	displayResults = results;
	
	buildTests();
	buildSelfTests();
	prepareRunner();
	
	setTimeout("eventFallback()", 150);
}

function onDeviceReady()
{
	if (!deviceReadyFired)
	{
		deviceReadyFired = true;
		console.log("DeviceReady fired...");
		run();
	}
}

function eventFallback()
{
	if (!deviceReadyFired)
	{
		run();
	}
}

function run()
{
	if (displayResults)
	{
		testRunner.buildResults();
	}
	else
	{
		testRunner.run();			// Automatic.
		//testRunner.runIfActive();	// Manual start.
	}
}

function prepareRunner()
{
	//var suite = testSuite;
	var suite = selfTestSuite;
	
	testRunner = new TestRunner(suite, "test_results.html");
	console.log("TestRunner ready on page " + window.location.href);
}
