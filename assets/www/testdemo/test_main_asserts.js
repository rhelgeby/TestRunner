function buildTests()
{
	var testCollection = new TestCollection("MainCollection");
	var testCollection3 = new TestCollection("ThirdCollection");
	
	testCollection.addTest(new TestCase("clickButton", "index.html",
	[
		function()
		{
			button = document.getElementById("myButton");
			result = document.getElementById("buttonStatus");
			
			assertNotUndefined(button);
			assertNotUndefined(result);
			
			button.click();
			
			assert(result.innerHTML == "Clicked.", "Button was not clicked.");
		}
	]));
	
	testCollection.addTest(new TestCase("testPageSwitch", "index.html",
	[
		function()
		{
			// Should navigation be coded manually?
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
			
			assertNotUndefined(element);
		}
	]));
	
	testCollection.addTest(new TestCase("testVibrate", "index.html", 
	[
 		function phase1()
 		{
 			console.log("testVibrate executed.");
			assertNoException(vibrate(150)); // Hmm.
			//vibrate(150);
 		}
 	]));
	
	
	// ----- Third collection -----
	
	testCollection3.addTest(new TestCase("dummy2", "index.html",
	[
		function()
		{
			// Fail test.
			failTest();
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
	testSuite = new TestSuite("MainSuite", [testCollection, testCollection3]);
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
	prepareRunner();
	
	setTimeout("eventFallback()", 200);
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
	testRunner = new TestRunner(testSuite, "test_results.html", beforeTest, afterTest);
	console.log("TestRunner ready on page " + window.location.href);
}
