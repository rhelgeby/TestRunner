// Test Runner
// Richard Helgeby

// Credits/Sources:
// JUnit

/*
 * TODO:
 * - potential performance problem with test loop and isTestExecuted - O(n^2)
 */

/* Test phases:
 * - make sure correct initial page is loaded before each test
 * - phase naming convention
 */

/**
 * Constructs a test result object.
 * 
 * @param name		Test name.
 * @param passed	Whether the test passed.
 * @param msg		Test result message.
 */
function TestResult(name, passed, msg)
{
	this.name = name;
	this.passed = passed;
	this.msg = msg;
}


/**
 * Constructs a test case.
 * 
 * A test case may have multiple test phases if it needs to change page
 * 
 * @param name			Test name.
 * @param initialPage	Initial page to load.
 * @param phases		Array with functions for each test phase. Functions must be named "phase"
 * 						followed by a number ("phase1", "phase2", etc.) to assure correct execution
 * 						order.
 */
function TestCase(name, initialPage, phases)
{
	this.name = name;
	this.page = initialPage;
	this.phases = phases;
}


/**
 * Constructs a test runner.
 * 
 * @param tests				Array of TestCase objects.
 * @param resultElement		(Optional) HTML container element used to display results.
 * @param before			(Optional) Function executed before every test.
 * @param after				(Optional) Function executed after every test.
 * 
 * @constructor
 */
function TestRunner(tests, resultElement, before, after)
{
	this.tests = tests;
	
	this.resultElement = resultElement;
	
	this.before = before;
	this.after = after;
	
	// Initialize test session state.
	this.initState();
	
	// Load previous state if test session is active.
	this.loadState();
}

/**
 * Initializes test states.
 */
TestRunner.prototype.initState = function()
{
	this.testsExecuted = new Array();
	this.errors = new Array();
	
	this.numExecuted = 0;
	this.numPassed = 0;
	
	this.currentTest = "";
	this.currentPhase = 0;
}

TestRunner.prototype.verifyJSON = function()
{
	if (typeof JSON === "undefined")
	{
		throw "Missing JSON implementation.";
	}
}

/**
 * Loads test runner state from storage (HTML5 web storage).
 */
TestRunner.prototype.loadState = function()
{
	this.verifyJSON();
	
	// Verify that a test session is active.
	if (!sessionStorage.testRunnerActive)
	{
		// Don't load states when test runner was just loaded.
		return;
	}
	
	var json = sessionStorage.testRunnerState;
	
	//console.log("Saved state: " + json);
	
	if (json)
	{
		var state = JSON.parse(json);
		this.testsExecuted = state.testsExecuted;
		this.errors = state.errors;
		this.numExecuted = state.numExecuted;
		this.numPassed = state.numPassed;
		this.currentTest = state.currentTest;
		this.currentPhase = state.currentPhase;
	}
}

/**
 * Saves test runner state to storage (HTML5 web storage).
 */
TestRunner.prototype.saveState = function()
{
	var state = {};
	state.testsExecuted = this.testsExecuted;
	state.errors = this.errors;
	state.numExecuted = this.numExecuted;
	state.numPassed = this.numPassed;
	state.currentTest = this.currentTest;
	state.currentPhase = this.currentPhase;
	
	var json = JSON.stringify(state);
	//console.log(json);
	sessionStorage.testRunnerState = json;
}

/**
 * Resets a test session.
 * 
 * Note: A session is automatically started when the testing is started.
 */
TestRunner.prototype.resetSession = function()
{
	sessionStorage.testRunnerActive = false;
	sessionStorage.testRunnerState = "";
	
	// Erase old test runner state.
	this.initState();
}

/**
 * Returns whether a test is executed.
 */
TestRunner.prototype.isTestExecuted = function(testName)
{
	return this.testsExecuted.indexOf(testName) >= 0;
}

/**
 * Gets the next test that's not yet started.
 * 
 * @returns		TestCase object if found, null otherwise.
 */
TestRunner.prototype.getNextTest = function()
{
	for (var i in this.tests)
	{
		var testCase = this.tests[i];
		if (testCase instanceof TestCase)
		{
			if (!this.isTestExecuted(testCase.name))
			{
				return testCase;
			}
		}
		else
		{
			throw "Invalid object type in tests array. Must be a TestCase.";
		}
	}
	
	return null;
}

/**
 * Gets a test case.
 * 
 * @name		Test name.
 * 
 * @returns		TestCase object, or null if not found.
 */
TestRunner.prototype.getTestByName = function(testName)
{
	for (var i in this.tests)
	{
		var testCase = this.tests[i];
		if (testCase.name == testName)
		{
			return testCase;
		}
	}
}

/**
 * Loads the initial page of a test case.
 * 
 * @param testCase		TestCase object.
 */
TestRunner.prototype.loadInitialPage = function(testCase)
{
	if (!testCase || !(testCase instanceof TestCase))
	{
		throw "Invalid test case.";
	}
	
	window.location.href = testCase.page;
}

/**
 * Executes all tests and updates results between tests.
 */
TestRunner.prototype.run = function()
{
	// Get "before" and "after" functions.
	var before = tests["before"];
	var after = tests["after"];
	
	// Start test session.
	sessionStorage.testRunnerActive = true;
	
	// Get active or next test case.
	var testCase;
	if (this.currentTest)
	{
		// Get current test case.
		testCase = this.getTestByName(this.currentTest);
		if (!testCase)
		{
			throw "Internal error: Invalid test name.";
		}
	}
	else
	{
		testCase = this.getNextTest();
		if (!testCase)
		{
			// No tests, or all tests done. Display results.
			this.saveState();
			this.displayResults();
			return;
		}
		
		// Initialize test state.
		this.currentTest = testCase.name;
		this.currentPhase = 0;
	}
	
	// Continue/run test.
	var result = this.runTest(testCase);
	
	// (If this point is reached, the last test phase was executed or all were done in one page.)
	
	if (result.passed)
	{
		this.numPassed++;
	}
	else
	{
		this.errors.push(result);
	}
	
	this.numExecuted++;
	this.testsExecuted.push(testCase.name);
	
	// Get next test, check if done.	
	testCase = this.getNextTest();
	if (!testCase)
	{
		console.log("Testing done.");
		
		// End test session (prepare for next run).
		// TODO: don't erase results.
		//this.resetSession();
		
		// Save state and display results in new page.
		this.saveState();
		this.displayResults();
		return;
	}
	
	// Save state, and load the text test's initial page.
	console.log ("Next test: " + testCase.name);
	this.currentTest = testCase.name;
	this.saveState();
	this.loadInitialPage(testCase);
	
}

/**
 * Executes a test.
 * 
 * @param testCase		TestCase object.
 * @return				TestResult object.
 */
TestRunner.prototype.runTest = function(testCase)
{
	console.log("Running " + testCase.name + " from phase " + this.currentPhase);
	
	// Get "before" and "after" functions.
	var before = tests["before"];
	var after = tests["after"];
	
	var testFunc = "";
	var passed = true;		// The test case will fail if any phase fails.
	var msg = "";
	
	// Execute "before" if the test was just started.
	if (typeof before === "function" && this.currentPhase == 0)
	{
		before();
	}
	
	// Loop through phases, starting from current phase.
	while (typeof testCase.phases[this.currentPhase] === "function")
	{
		try
		{
			// Execute the test.
			console.log("Running phase " + this.currentPhase);
			testCase.phases[this.currentPhase]();
		}
		catch (err)
		{
			passed = false;
			
			// Assertion failed.
			if (typeof err === "string")
			{
				msg = err;
			}
			else if (typeof err === "object")
			{
				msg = err.message;
			}
			else
			{
				msg = "No error message.";
			}
			
			// Skip other phases.
			break;
		}
		
		// Next phase.
		this.currentPhase++;
	}
	
	// TODO: does it reach this line even if a test load a new page? delays?
	
	this.currentPhase = 0;
	
	// Test case done or failed. Execute "after".
	if (typeof after === "function")
	{
		after();
	}
	
	return new TestResult(testCase.name, passed, msg);
}

TestRunner.prototype.displayResults = function()
{	
	// TODO: Prevent double-load.
	var element = document.getElementById("results");
	
	var html =  "<p>Tests executed: " + this.numExecuted + "<br />";
	html += "Tests passed: " + this.numPassed + "<br />";
	html += "Tests failed: " + (this.numExecuted - this.numPassed) + "</p>";
	
	html += "<p>Errors:</p><ul>";
	for (i in this.errors)
	{
		html+= "<li>" + this.errors[i].name + ": " + this.errors[i].msg + "</li>";
	}
	html += "<ul>";
	
	element.innerHTML = html;
}
