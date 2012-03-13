import sys
import subprocess
import xml.etree.ElementTree as xml
from time import strftime
from xml.dom import minidom
from com.android.monkeyrunner import MonkeyRunner, MonkeyDevice, MonkeyImage

# The proposed test technique demonstrated here is to use MonkeyRunner to automate testing on android devices by sending touch events programmatically via adb (android debug bridge) to the test device.
# Tests are carried out by comparing previously generated reference screenshots to actual device captures. This is essantially automating manual black box tests.
# This can by used in TDD, though it might be better suited to regression testing (http://en.wikipedia.org/wiki/Regression_testing).
# The robustness of the comparison method would improve significantly if template matching was implemented. (http://en.wikipedia.org/wiki/Template_matching)
# The recommended module for doing this with python is the python implementation of OpenCV, though I've had no success implementing OpenCV as of this version.

# Requires Python 2.7 and Jython 2.5.2. Requires MonkeyRunner (included in the android sdk).
# Requires ImageMagick to generate the comparison picture. Without ImageMagick there's no meaninful way of reporting a failiure, other than just letting the programmer know it failed.
# Usage: [Full path to monkeyrunner.bat (located in android-skd/tools)] [Full path to script]
# Before the script is run you need reference screenshots (screenshots of what you expect to see when the aspect of the app you test is run).
# Take reference screenshots with TakeScreenshot.py. Emulator screenshots will NOT work on a device.
# You'll likely need separate screenshots for separate devices since screen resize will break sameAs' comparison technique.
# Be wary of special sequences in folder paths. Use \\ or /.

# TODO: Script the app upload and launch. This will probably fix the scrolling problem (if an app is launched manually for testing and then scrolled sameAs() has an anuerism)
# TODO: Implement a more robust image comparison method (template match).
# TODO: Script taking reference images as a setUp() of sorts? Might not be necessary with a proper template match.
# TODO: Display test results in a more obvious way than simply generating an xml document

# Constants
DEVICENAME = "HT04JPL03746" # For testing on device, use "adb.exe devices" and replace with device name. For emulator, replace with "emulator-5554"
REF_PATH = "C:\\Code\\Antares\\MonkeyRunner\\Scripts" # Reference picture
SCR_PATH = "C:\\Code\\Antares\\MonkeyRunner\\Scripts" # App screenshot
CMP_PATH = "C:\\Code\\Antares\\MonkeyRunner\\Scripts" # ImageMagic compare output
ACCEPTANCE = 0.9 # Percentage of pixel matches required for pass. Set to .9 to allow for differences in battery level and time. Alternatively, crop with MonkeyImage.getSubImage
TIMEOUT = 30 # Timeout for adb connection

device = None

# Initial sanity check.
def testMenuExists():
	compare("menuRef.png", testMenuExists.__name__)

# Typical "button test" using the current method. Having to give the coordinate of the button to be tested explicitly mightn't be necessary with template matching.
def testFooBtn():
	device.touch(252, 150, "DOWN_AND_UP") # Click the button in question. UP_AND_DOWN is a press followed immediately by release.
	shortTimeout() # Wait a bit for the button to do its thing.
	compare("fooBtnRef.png", testFooBtn.__name__) # Send image of expected result and the name of the test to compare()
	back() # Click back button to return to initial state.

# Sends a blank image to compare() to induce a failiure
def thisTestFails():
	shortTimeout()
	compare("fail_test.png", thisTestFails.__name__)

# Compares the screenshot of what you expect with what's actually displayed. If the comparison fails, the imagemagick command "compare" is called to generate a failure report of sorts.
# The built in comparison function, MonkeyImage.sameAs() is very weak, and will break unless 90% of the pixels in each image match.
def compare(refName, testName):
	ref = REF_PATH + "\\" + refName
	scr = SCR_PATH + "\\deviceCapture_" + refName
	cmp = CMP_PATH + "\\comparison_" + refName
	reference = MonkeyRunner.loadImageFromFile(ref)
	print "running", testName
	screenshot = device.takeSnapshot()
	screenshot.writeToFile(scr)
	if not screenshot.sameAs(reference, ACCEPTANCE):
		subprocess.call("compare " + " " + ref + " " + scr + " " + cmp) #Comma separated concatination breaks this, apparently. The script will break at this point if imagemagick isnt installed and accessible in the command prompt.
		print "FAIL"
		testResults.append((testName, "FAIL", cmp, strftime("%d/%m-%H:%M:%S")))
	else:
		print "PASS"
		testResults.append((testName, "PASS", "test passed, no comparison picture", strftime("%d/%m-%H:%M:%S")))

# Format results to XML and print/save to disk
def printResults():
	root = xml.Element("tests")
	for res in testResults:
		child = xml.SubElement(root, "test")
		child.attrib["executed_at"] = res[3]
		child_testname = xml.SubElement(child, "test_name")
		child_testname.text = res[0]
		child_result = xml.SubElement(child, "result")
		child_result.text = res[1]
		child_comploc = xml.SubElement(child, "comparison_location")
		child_comploc.text = res[2]
	print "________XML OUTPUT:________"
	print formatResults(root)
	#results = formatResults(root)
	#file = open("C:/Code/Antares/MonkeyRunner/Scripts/results.xml", "w")
	#file.write(results)
	#file.close()

# Make the XML pretty
def formatResults(elem):
	inputString = xml.tostring(elem, "utf-8")
	reparsed = minidom.parseString(inputString)
	return reparsed.toprettyxml(indent = "  ")

def back():
	device.press("KEYCODE_BACK", "DOWN_AND_UP")

def shortTimeout():
	print "sleeping for 3 seconds..."
	MonkeyRunner.sleep(3)

def main():
	global device
	global testResults
	testResults = []
	print "connecting to device..."
	device = MonkeyRunner.waitForConnection(TIMEOUT, DEVICENAME)
	if device:
		print "device", DEVICENAME, "found."
		testMenuExists()
		testFooBtn()
		thisTestFails()
		printResults()

if __name__ == '__main__':
	main()
