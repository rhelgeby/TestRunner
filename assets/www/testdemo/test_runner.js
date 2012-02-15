// Store a list of test cases (function names).

// Store test states.
	// set next test
	// navigate to and continue with a certain test

// Loop through tests, continue from last time.

// Function to init testing (reset progress).

// Assert functions: will update state for the current test.

//var numTests = 0;
//var testsPassed = 0;
//var errors;	// String array.

/**
 * @param tests				List of functions (test cases).
 * @param resultContainer	Element in HTML page to write result.
 */
/*function startTestRunner(tests, resultContainer)
{
	runTests(tests);
	buildResults(resultContainer);
}*/

/*function runTests(tests)
{
	var results = new Array();
	numTests = 0;
	testsPassed = 0;
	errors = new Array();
	
	for (funcName in tests)
	{
		console.log("Evaluating " + funcName);
		
		if (funcName.indexOf("test") >= 0)
		{
			numTests++;
			console.log("Calling " + funcName);
			var result = tests[funcName]();
			
			// catch exception
			
			if (result == true)
			{
				testsPassed++;
			}
			else
			{
				errors.push(funcName);
			}
			results.push(result);
		}
	}
}*/

function runTest(func)
{
	
}

/*function buildResults(containerElement)
{
	html =  "<p>Tests executed: " + numTests + "<br />";
	html += "Tests passed: " + testsPassed + "<br />";
	html += "Tests failed: " + (numTests - testsPassed) + "</p>";
	
	html += "<p>Errors:</p><ul>";
	for (i in errors)
	{
		html+= "<li>" + errors[i] + "</li>";
	}
	
	html += "<ul>";
	containerElement.innerHTML = html;
}*/


// ------------------------------------------------------------------------------------------------

// Credits:
// Some inspiration from JUnit.

function TestResult(name, passed, msg)
{
	this.name = name;
	this.passed = passed;
	this.msg = msg;
}


/**
 * Constructs a test runner.
 * 
 * @param init		(bool) Whether this is the initial run of tests (first page).
 * 
 * @constructor
 */
function TestRunner(tests, resultElement, init)
{
	/**
	 * Array of test functions.
	 * 
	 * A test function is prefixed by "test". If function "before" or "after" exists they will
	 * be executed before and after each test respectively.
	 */
	this.tests = tests;
	
	/** Array of tests executed (strings of function names). */
	this.testsExecuted = new Array();
	
	/** Error of failed tests (TestResult objects). */
	this.errors = new Array();
	
	/** Result element container for printing results. */
	this.resultElement = resultElement;
	
	/** Whether the test runner state will be loaded from storage when tests are executed. */
	//this.loadState = !init;
	
	this.numExecuted = 0;
	this.numPassed = 0;
	
	/*if (!init)
	{
		// Not initializing, load test state from previous page.
		this.loadState();
	}*/
}

/**
 * Loads test runner state from storage (HTML5 web storage).
 */
TestRunner.prototype.loadState = function()
{
	/* Load saved state:
	 * - (test array?)
	 * - tests executed
	 * - counters
	 */
}

/**
 * Saves test runner state to storage (HTML5 web storage).
 */
TestRunner.prototype.saveState = function()
{
	
}

/**
 * Executes all tests and updates results between tests.
 */
TestRunner.prototype.run = function()
{
	// Get "before" and "after" functions.
	var before = tests["before"];
	var after = tests["after"];
	
	for (funcName in this.tests)
	{
		// Only execute functions starting with "test".
		if (funcName.indexOf("test") >= 0)
		{
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
	
	this.displayResults(this.resultElement);
}

/**
 * Executes a test.
 * 
 * @param testName		Name of the test function.
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
		msg = err;
	}
	
	return new TestResult(testName, passed, msg);
}

TestRunner.prototype.displayResults = function(element)
{
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
