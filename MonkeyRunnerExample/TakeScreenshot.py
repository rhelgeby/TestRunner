import sys
from com.android.monkeyrunner import MonkeyRunner, MonkeyDevice, MonkeyImage
#
# Usage: [absolute path to monkeyrunner.bat] [absolute path to script] filename
# Be wary of special sequences in folder paths. Use \\ or /.
# Constants
SCR_FOLDER = "C:\\Code\\Antares\\MonkeyRunner\\Scripts" # App screenshot folder

device = None

def takeScr(scr):
	screenshot = device.takeSnapshot()
	screenshot.writeToFile(SCR_FOLDER + "\\" + scr + ".png")
	print "screenshot saved at", SCR_FOLDER + "\\" + scr + ".png"

def main():
	global device
	print "waiting for connection..."
	device = MonkeyRunner.waitForConnection(30, "HT04JPL03746")
	if device:
		takeScr(sys.argv[1])
		
if __name__ == '__main__':
	main()