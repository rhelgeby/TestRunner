// Wait for PhoneGap to load
//
//document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
//
/*function onDeviceReady() {
    // Empty
}*/

function myButtonClicked()
{
	var status = document.getElementById("buttonStatus");
	status.innerHTML = "Clicked.";
}

function vibrate(duration)
{
	navigator.notification.vibrate(duration);
}

function beep(times)
{
	navigator.notification.beep(times);
}