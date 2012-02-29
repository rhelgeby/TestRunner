// Test Iterator
// Richard Helgeby

/**
 * Constructs a iterator state object.
 * 
 * This object holds the index of the next element and is suitable for serialization.
 * 
 * @param nextElement	(Optional) Index of the next element.
 * 
 * @constructor
 */
function IteratorState(nextElement)
{
	this.nextElement = (typeof nextElement === "undefined" ? 0 : nextElement);
}

/**
 * Constructs an element iterator.
 * 
 * @param elements		Array of objects.
 * @param state			(Optional) IteratorState object with initial state.
 */
function ElementIterator(elements, state)
{
	// Validate element array.
	if (!(elements instanceof Array))
	{
		throw "Parameter 'elements' must be an array.";
	}
	
	this.elements = elements;
	this.state = (typeof state === "undefined" ? new IteratorState() : state);
}

/**
 * Returns the next element.
 * 
 * @returns		Next element or null if no more elements.
 */
ElementIterator.prototype.next = function()
{
	if (!this.hasNext())
	{
		return null;
	}
	
	var element = this.elements[this.state.nextElement];
	this.state.nextElement++;
	return element;
}

/**
 * Gets the current element without moving to next element.
 * 
 * @returns		Current element.
 */
ElementIterator.prototype.peek = function()
{
	return this.elements[this.state.nextElement];
}

/**
 * Returns whether there are more elements left.
 */
ElementIterator.prototype.hasNext = function()
{
	return this.elements.length >= this.nextElement;
}

/**
 * Gets the current iterator state.
 * 
 * @returns			IteratorState object.
 */
ElementIterator.prototype.getState = function()
{
	return this.state;
}
