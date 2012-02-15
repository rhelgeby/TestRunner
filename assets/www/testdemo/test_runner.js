// Test Runner
// Richard Helgeby

// Credits/Sources:
// JUnit


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
 * Constructs a test runner.
 * 
 * @param tests				Array of test functions.
 * @param resultElement		(Optional) HTML container element used to display results.
 * 
 * @constructor
 */
function TestRunner(tests, resultElement)
{
	/**
	 * Array of test functions.
	 * 
	 * A test function is prefixed by "test". If function "before" or "after" exists they will
	 * be executed before and after each test respectively.
	 */
	this.tests = tests;
	
	/** Result element container for printing results. */
	this.resultElement = resultElement;
	
	// Initialize test session state.
	this.initState();
	
	// Load state if test session is active.
	this.loadState();
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
	
	console.log("Saved state: " + json);
	
	if (json)
	{
		var state = JSON.parse(json);
		this.testsExecuted = state.testsExecuted;
		this.errors = state.errors;
		this.numExecuted = state.numExecuted;
		this.numPassed = state.numPassed;
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
	
	var json = JSON.stringify(state);
	console.log(json);
	sessionStorage.testRunnerState = json;
	
	// save test phase
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
 * Initializes test states
 */
TestRunner.prototype.initState = function()
{
	this.testsExecuted = new Array();
	this.errors = new Array();
	
	this.numExecuted = 0;
	this.numPassed = 0;
}

/**
 * Executes all tests and updates results between tests.
 */
TestRunner.prototype.run = function()
{
	// Get "before" and "after" functions.
	var before = tests["before"];
	var after = tests["after"];
	
	// Activate test session.
	sessionStorage.testRunnerActive = true;
	
	for (funcName in this.tests)
	{
		// Only execute functions starting with "test".
		if (funcName.indexOf("test") >= 0)
		{
			// Check if this test is already executed.
			if (this.testsExecuted.indexOf(funcName) >= 0)
			{
				console.log("Test " + funcName + " already executed this session, skipping.");
				continue;
			}
			
			// Save current state in case a test navigate away from the page.
			testRunner.saveState();
			
			if (typeof before === "function")
			{
				before();
			}
			
			// Execute test.
			var result = this.runTest(funcName);
			
			if (result.passed)
			{
				this.numPassed++;
			}
			else
			{
				this.errors.push(result);
			}
			
			this.numExecuted++;
			this.testsExecuted.push(funcName);
			
			
			if (typeof after === "function")
			{
				after();
			}
		}
	}
	
	testRunner.saveState();
	
	this.displayResults(this.resultElement);
}

/**
 * Executes a test.
 * 
 * @param testName		Test function name.
 * @return				TestResult object.
 */
TestRunner.prototype.runTest = function(testName)
{
	console.log("Running " + funcName);
	
	var passed = false;
	var msg = "";
	
	try
	{
		// Execute the test.
		this.tests[funcName]();
	
		passed = true;
	}
	catch (err)
	{
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
		
	}
	
	return new TestResult(testName, passed, msg);
}

TestRunner.prototype.displayResults = function(element)
{
	// Redirect to result page.
	
	if (typeof element === "undefined")
	{
		return;
	}
	
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
