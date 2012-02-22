//tests = {};
testRunner = new TestRunner();
tests = [];

function buildTests()
{
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
	
	new TestCase("testPageSwitch", "index.html",
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
	]),
	
	new TestCase("testVibrate", "index.html", 
	[
 		function phase1()
 		{
 			console.log("testVibrate executed.");
 			vibrate(150);
 		}
 	])
];
}

function beforeTest()
{
	console.log("before");
}

function afterTest()
{
	console.log("after");
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
	testRunner = new TestRunner(tests, document.getElementById("results"), beforeTest, afterTest);
	console.log("TestRunner ready on page " + window.location.href);
}
