/*function onBodyLoad() 
{
    console.log("OnBodyLoad");
    if( navigator.userAgent.match(/Android/i) ) {
             onDeviceReady();
    } else if (typeof navigator.device == "undefined"){
            document.addEventListener("deviceready", onDeviceReady, false);
    } else {
             onDeviceReady();
    } 
}*/

/*
function deviceReady()
{
    console.log("Device ready.");
    console.log("Platform: " + device.platform);
}*/

/*
function pageLoaded()
{
    console.log("OnLoad");
    document.addEventListener("phonegapready", deviceReady, false);
}*/

/*
window.onload = pageLoaded;
window.onbodyload = onBodyLoad;
*/

var MainCase = AsyncTestCase("MainCase");

MainCase.prototype.testInit = function()
{
    console.log("TestInit");
    assertTrue("PhoneGap not initialized.", (typeof PhoneGap !== "undefined"));
    //assertEquals("Incorrect platform", device.platform, "Android");
    //assertTrue("Device not initialized.", (typeof device !== "undefined"));
    //assertTrue("Contacts not initialized.", (typeof navigator.contacts !== "undefined"));
};

/*
MainCase.prototype.testDevice = function(queue)
{
    console.log("TestDevice");
    var ready = 0;
    
    console.log("Type: " + typeof navigator.device);
    
    queue.call(function(callbacks)
        {
            var bodyLoad = callbacks.add(function()
            {
                console.log("TestDevice - onBodyLoad");
            });
            window.onload = bodyLoad;
        }
    );
    
    queue.call(function(callbacks)
        {
            var deviceTest_Ready = callbacks.add(function()
            {
                ready = 1;
                console.log("TestDevice - onDeviceReady");
            });
            document.addEventListener("deviceready", deviceTest_Ready, true);
        }
    );
    
    console.log("Waiting for callback...");
    
    queue.call(function()
        {
            console.log("TestDevice - check result");
            assertEqual("Ready event not fired.", 1, ready);
        }
    );
};
*/

MainCase.prototype.testContacts = function(queue)
{
    var contact = navigator.contacts.create({"displayName": "Test User"});
    
    queue.call("Save contact", function(callbacks)
        {
            var successful = callbacks.noop();
            var failed = callbacks.addErrback("Failed to save.");
            contact.save(successful, failed);
            assert(true);
        }
    );
};
