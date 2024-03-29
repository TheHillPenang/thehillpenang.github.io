import firebaseConfig from "./config.js";

var errorUrl = 'https://maker.ifttt.com/trigger/error/with/key/nxWDF1CC4dUopqudhmrrkDQ3znxtAYSpcWBjbBxpik4';
var errorNotificationOptions = {
    method: "POST",
    mode: "no-cors",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
}

console.log("JS has been sourced");

//alert("code: " + code);

//locationcheck is true?
if (true) {
    console.log("location verified, js file access");


    var urlParams = new URLSearchParams(location.search);
    var code = urlParams.get('code');

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Get a reference to the database service
    var database = firebase.database();
    var signedIn = false;

    firebase.auth().signInAnonymously()
        .then(() => {
            signedIn = true;
            document.getElementById("btn").onclick = function () { jsbegin() };
            console.log('Success signIn');
            confirm('You are signed In. Click upon arrival.');
            // Signed in..
        })
        .catch(async (error) => {
            console.log('Failed signIn');
            confirm('Failed to signed In');
            fetch(errorUrl.concat("?value1=", "Failed to sign in anonymously", "&", "value2=", code), errorNotificationOptions).catch((err) => {
                console.log("Error notification error with: " + err);
            });

            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
        })
}
else {
    console.log("Location is false!");

    document.getElementById("welcome").innerHTML = "Location Error";
    document.getElementById("warning").innerHTML = "Please be within 300 meters from the gate!";
    document.getElementById("error").innerHTML = "If you encounter any error, please contact the residence to manually open the gates.";
    var button = document.getElementById("btn");
    button.style.display = 'none';

}

function jsbegin() {
    try {

        var result = confirm("Are you sure to open the gates now?");
        if (result == true)
            var path1 = firebase.database().ref().child(code);


        path1.on('value', snap => {
            var VRegInDate = [{}];
            var VRegOutDate = [{}];
            var VRegInDay = [{}];
            var VRegOutDay = [{}];
            var VRegInMonth = [{}];
            var VRegOutMonth = [{}];
            var VRegInYear = [{}];
            var VRegOutYear = [{}];

            var name = snap.child("Visitor's Name").val();
            var VRegInDateFB = snap.child("DateIn").val();
            var VRegOutDateFB = snap.child("DateOut").val();
            console.log(name);

            VRegInDate = VRegInDateFB.split("_");
            VRegOutDate = VRegOutDateFB.split("_");

            VRegInDay = ((VRegInDate[0]).split('"'))[1];
            VRegOutDay = ((VRegOutDate[0]).split('"'))[1];

            VRegInMonth = ((VRegInDate[1]).split('"'))[0];
            VRegOutMonth = ((VRegOutDate[1]).split('"'))[0];

            VRegInYear = ((VRegInDate[2]).split('"'))[0];
            VRegOutYear = ((VRegOutDate[2]).split('"'))[0];
            //VRegInMonth = VRegInMonth.slice(0, 3);
            //VRegOutMonth = VRegOutMonth.slice(0, 3);

            console.log("VRegInMonth is " + VRegInMonth);
            console.log("VRegInDay is " + VRegInDay);
            console.log("VRegOutMonth is " + VRegOutMonth);
            console.log("VRegOutDay is " + VRegOutDay);
            console.log("VRegInYear is " + VRegInYear);
            console.log("VRegOutYear is " + VRegOutYear);

            VRegInMonth = String(VRegInMonth);
            VRegOutMonth = String(VRegOutMonth);


            var months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            for (var i = 1; i <= 12; i++) {
                if (VRegInMonth == months[i]) {
                    var MonthStr = "";
                    var monthStr1 = String(i);
                    if (i < 10) {
                        MonthStr = "0" + monthStr1;
                    } else {
                        MonthStr = monthStr1;
                    }
                    VRegInMonth = MonthStr;
                }

                if (VRegOutMonth == months[i]) {
                    var MonthStr = "";
                    var monthStr2 = String(i);
                    if (i < 10) {
                        MonthStr = "0" + monthStr2;
                    } else {
                        MonthStr = monthStr1;

                    }
                    VRegOutMonth = MonthStr;
                }
            }
            console.log("Month In: " + VRegInMonth);
            console.log("Month Out: " + VRegOutMonth);

            //2) Obtain current Date data
            var today = new Date();

            // Actually Useless
            // var FCurrentYear = today.getFullYear();
            var FCurrentMonth = today.getMonth() + 1;
            if (FCurrentMonth.toString().length < 2) {
                FCurrentMonth = '0' + FCurrentMonth;
            }
            console.log("FCurrentMonth is: " + FCurrentMonth);

            // REMOVED DIGIT 0 - TO FORMAT SAME AS SYSTEM DATE

            // if (VRegInDay.toString().length < 2) {
            //     VRegInDay = '0' + VRegInDay;
            // }
            // if (VRegOutDay.toString().length < 2) {
            //     VRegOutDay = '0' + VRegOutDay;
            // }
            // var FCurrentDay = today.getDate();

            //Converting to String

            var FCurrentDate = (today.getFullYear() + '-' + FCurrentMonth.toString() + '-' + today.getDate());
            console.log("System Date: " + FCurrentDate);

            var FVRegInDate = String(VRegInYear) + "-" + String(VRegInMonth) + "-" + String(VRegInDay);
            console.log("Visitor Registered Date In: " + FVRegInDate);

            var FVRegOutDate = String(VRegOutYear) + "-" + String(VRegOutMonth) + "-" + String(VRegOutDay);
            console.log("Visitor Registered Date Out: " + FVRegOutDate);

            //Date Formatting new Date()
            var FormattedCurrentDate = new Date(String(FCurrentDate));
            console.log("Formatted Current Date: " + FormattedCurrentDate);

            var FormattedRegInDate = new Date(String(FVRegInDate));
            console.log("Formatted Reg In Date: " + FormattedRegInDate);

            var FormattedRegOutDate = new Date(String(FVRegOutDate));
            console.log("Formatted Reg Out Date: " + FormattedRegOutDate);


            function isWithinRange(FormattedCurrentDate) {
                console.log("isWithinRange Funtion RAN!");
                return !(FormattedCurrentDate < FormattedRegInDate || FormattedCurrentDate > FormattedRegOutDate);
            }

            if (String(FormattedCurrentDate).length != String(FormattedRegInDate).length || String(FormattedCurrentDate).length != String(FormattedRegOutDate).length) {
                var dateOfEntryMessage = String(VRegInDate).replace(",", " ").replace(",", " ").replace('"', '').replace('"', '') + " to " + String(VRegOutDate).replace(",", " ").replace(",", " ").replace('"', '').replace('"', '');

                fetch(errorUrl.concat("?value1=", "Formatted date length not the same.", "&", "value2=", code, "&", "value3=", String(dateOfEntryMessage)), errorNotificationOptions).catch((err) => {
                    console.log("Error notification error with: " + err);
                });
            }

            var date_match = isWithinRange(FormattedCurrentDate);




            // if (FVRegInDate == FCurrentDate) 
            // {
            //     date_match = true;
            //     console.log("It is an exact match!");
            // }




            // else if (FCurrentYear >= VRegInYear && FCurrentYear <= VRegOutYear)
            // {
            //     if (FCurrentMonth >= VRegInMonth && FCurrentMonth <= VRegOutMonth)
            //     {
            //         if (FCurrentDay >= VRegInDay && FCurrentDay <= VRegOutDay)
            //         {
            //             date_match = true;
            //             console.log("Current Date is within range!");
            //         }
            //         else
            //         {
            //             date_match = false;
            //             console.log("Day not Matched!");
            //         }
            //     }
            //     else
            //     {
            //         date_match = false;
            //         console.log("Month not Matched!");
            //     }
            // }
            // else
            // {
            //     date_match = false;
            //     console.log("Year not Matched!");
            // }

            // if (FVRegInDate == FCurrentDate) 
            // {
            //     date_match = true;
            //     console.log("It is a match!");
            // }
            // else
            // {
            //     date_match = false;
            //     console.log("Not Matched!");
            // }
            // ---------------------------------------

            // START HERE
            // function checkGateStatus()
            // {
            //     // var x;
            //     // // True = Gate Open
            //     // // False = Gate Closed
            //     // var path2 = firebase.database().ref().child("System Settings");
            //     // path2.on('value', snap => 
            //     // {
            //         //     x = snap.child("GateStatus").val();
            //         //     console.log("retrieve FB value: " + x);
            //     // });
            //     // return x;
            //     //______________________________

            //     var retrieve = null;
            //     var ref = firebase.database().ref("System Settings" + "/" + "GateStatus");
            //     ref.once("value")
            //     .then(function(snapshot) {
            //         retrieve = snapshot.val();

            //     });
            // }

            // function checkGateTrigger(triggerUrl)
            // {
            //     // var gateStatus = checkGateStatus();

            //     var gateStatus = null;
            //     var ref = firebase.database().ref("System Settings" + "/" + "GateStatus");
            //     ref.once("value")
            //     .then(function(snapshot) {
            //         gateStatus = snapshot.val();

            //     })
            //     .then(function() {
            //         console.log("Gate Status is:" + gateStatus);

            //         if (triggerUrl.search("Open_Gates") != -1) {
            //             console.log("Open gates trigger");
            //             return gateStatus === false ? true : false;
            //         }
            //         else if (triggerUrl.search("Close_Gates") != -1) {
            //             console.log("Close gates trigger");
            //             return gateStatus === true ? true : false;
            //         }

            //         console.log("Unknown error");
            //         return false;
            //     });
            // }
            var numberOpenGates = 0;

            function OpenGates() {
                numberOpenGates = numberOpenGates + 1;
                console.log('Open the Gates has been run:' + numberOpenGates);


                // starts here
                if (date_match) {
                    var proceed, Ttimer, speed;

                    var gateStatus;

                    var proceedCheck;

                    var counter = 0.0;
                    var x = counter;
                    var safecounter = 0;

                    var circle, radius, circumference;

                    var counterIsMax = false;

                    var RTimerID, GTimerID;

                    document.getElementById("welcome").innerHTML = "Welcome " + name.replace('"', '').replace('"', '') + "!";
                    document.getElementById("date").innerHTML = "Your entry is valid from: " + String(VRegInDate).replace('"', '').replace('"', '').replace(',', ' ').replace(',', ' ') + " to " + String(VRegOutDate).replace('"', '').replace('"', '').replace(',', ' ').replace(',', ' ');
                    document.getElementById("warning").innerHTML = "";
                    var button = document.getElementById("btn");
                    var ring = document.querySelector(".div2");
                    var reloadBtn = document.getElementById("btnReload");
                    reloadBtn.style.display = 'block';
                    reloadBtn.style.width = '300px'; // setting the width to 200px
                    reloadBtn.style.height = '100px';
                    reloadBtn.style.borderRadius = '10px';
                    reloadBtn.style.fontSize = '35px';
                    reloadBtn.style.background = '#add8e6'

                    button.style.display = 'none';
                    ring.style.display = 'block';
                    ring.style.margin = 'auto';

                    document.getElementById("btnReload").onclick = function () { window.location.reload() };

                    var path3 = firebase.database().ref().child("System Settings");

                    path3.once('value')
                        .then(function (snap) {
                            // Ttimer = snap.child('Gate Timer').val().replace('"', '').replace('"', '');
                            Ttimer = 45;
                            console.log("Duration: " + Ttimer);

                            circle = document.querySelector(".prcircle");
                            console.log();
                            radius = circle.r.baseVal.value;
                            circumference = radius * 2 * Math.PI;

                            circle.style.strokeDasharray = `${circumference} ${circumference}`;
                            circle.style.strokeDashoffset = circumference;

                        })
                        .then(function () {
                            var ref = firebase.database().ref("System Settings" + "/" + "GateStatus");
                            var url = 'https://maker.ifttt.com/trigger/Open_Gates/with/key/nxWDF1CC4dUopqudhmrrkDQ3znxtAYSpcWBjbBxpik4';
                            // var url = 'https://google.com';

                            ref.once("value")
                                .then(function (snapshot) {
                                    var resultGate = snapshot.val();
                                    if (resultGate == "true") {
                                        gateStatus = true;
                                    }
                                    else {
                                        gateStatus = false;
                                    }
                                })
                                .then(async function () {
                                    console.log("Gate Status is:" + gateStatus);

                                    if (url.search("Open_Gates") != -1) {
                                        console.log("Open gates trigger");
                                        proceed = gateStatus === false ? true : false;
                                    }
                                    else if (url.search("Close_Gates") != -1) {
                                        console.log("Close gates trigger");
                                        proceed = gateStatus === true ? true : false;
                                    }
                                    else {
                                        proceed = null;
                                        console.log("Unknown error");
                                        fetch(errorUrl.concat("?value1=", "Unknown error. Cannot proceed to open gates.", "&", "value2=", code), errorNotificationOptions).catch((err) => {
                                            console.log("Error notification error with: " + err);
                                        });
                                    }
                                    // var proceed = checkGateTrigger(url);
                                    // var proceed = checkGateTrigger(url);
                                    console.log("Open Gates Proceed:" + proceed);

                                    // var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
                                    var options = {
                                        method: "POST",
                                        mode: "no-cors",
                                    };

                                    //Error on UrlFetchApp >> (FIX LATER)
                                    if (true) //proceed == true
                                    {
                                        console.log("fetch | RUNNING...");
                                        await fetch(url, options).catch((__) => {
                                            fetch(errorUrl.concat("?value1=", "Error while fetching open gates URL.", "&", "value2=", code), errorNotificationOptions).catch((err) => {
                                                console.log("Error notification error with: " + err);
                                            });
                                        });
                                        console.log("fetch | RAN!");
                                        proceedCheck = true;
                                        // post(url, options, (err, response, body) => {
                                        //     console.log("nodeRequest | RAN!");
                                        //     if (err) {
                                        //         console.log("nodeRequest | FAILED with error: " + String(err));
                                        //         proceedCheck = false;
                                        //     } else { proceedCheck = true; }
                                        // });
                                        // var response = fetch(url, options);
                                        // response.then(() => firebase.database().ref().child("System Settings").update({ "GateStatus": "true" }));
                                    }
                                    else {
                                        document.getElementById("welcome").innerHTML = "Hold Up! Please follow the instructions below.";
                                        document.getElementById("date").innerHTML = "";
                                        document.getElementById("warning").innerHTML = "1) Wait for the gates to close completely" + '\n' + "2) Reload this webpage again" + "\n" + "3) Click on the 'Open Gates' button";
                                        document.getElementById("error").innerHTML = "If you encounter any problems, please contact the residence for help. Sorry for the inconvenience";
                                        var button = document.getElementById("btn");
                                        button.style.display = 'none';

                                        proceedCheck = false;
                                    }
                                })
                                .then(LoopRingFunction => new Promise(function (resolve) {
                                    if (proceedCheck) //proceedCheck === true
                                    {

                                        function setProgress(percent) {
                                            console.log("setProgress Triggered");

                                            const offset = circumference - (percent / 100 * circumference);
                                            circle.style.strokeDashoffset = offset;
                                            //console.log(offset);
                                        }

                                        function ringtimer(i) {
                                            // console.log("Ring timer runs");
                                            //console.log("rt");
                                            counter += speed;
                                            x += speed;

                                            console.log("COUNTER IS: " + counter);
                                            console.log("counterIsMax is: " + counterIsMax);


                                            if (counter >= 0) {
                                                if ((counter >= 100) && (counterIsMax == false)) {
                                                    counter = 100;
                                                    counterIsMax = true;
                                                    clearInterval(RTimerID);
                                                    clearInterval(GTimerID);

                                                    resolve(LoopRingFunction);
                                                }

                                                setProgress(counter);
                                            }
                                        }

                                        function gatetimer() {
                                            // console.log("Gate timer runs");
                                            if (Ttimer > 0) {
                                                Ttimer -= 1;
                                                console.log("Countdown: " + Ttimer);
                                                document.getElementById("timer").innerHTML = "Duration: " + Ttimer;
                                            }
                                        }

                                        speed = (100 / Ttimer) / 10;

                                        console.log("First SetProgress");
                                        setProgress(counter);
                                        ringtimer(counter);
                                        RTimerID = setInterval(ringtimer, 100); // 0.1 second
                                        GTimerID = setInterval(gatetimer, 1000); // 1 second
                                    } else {

                                    }
                                }))
                                .then(function () {
                                    if (proceedCheck === true) {
                                        console.log("YAY RESOLVED!");
                                        firebase.database().ref().child("System Settings").update({ "GateStatus": "false" });
                                        // var ref = firebase.database().ref("System Settings" + "/" + "GateStatus");
                                        // var url = 'https://maker.ifttt.com/trigger/Close_Gates/with/key/nxWDF1CC4dUopqudhmrrkDQ3znxtAYSpcWBjbBxpik4';

                                        // ref.once("value")
                                        //     .then(function (snapshot) {
                                        //         gateStatus = snapshot.val();
                                        //     })
                                        //     .then(function () {
                                        //         console.log("Gate Status is:" + gateStatus);

                                        //         if (url.search("Open_Gates") != -1) {
                                        //             console.log("Open gates trigger");
                                        //             proceed = gateStatus === false ? true : false;
                                        //         }
                                        //         else if (url.search("Close_Gates") != -1) {
                                        //             console.log("Close gates trigger");
                                        //             proceed = gateStatus === true ? true : false;
                                        //         }
                                        //         else {
                                        //             proceed = null;
                                        //             console.log("Unknown error");
                                        //         }
                                        //         // var proceed = checkGateTrigger(url);
                                        //         // var proceed = checkGateTrigger(url);
                                        //         console.log("Close Gates Proceed:" + proceed);

                                        //         var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
                                        //         var options =
                                        //         {
                                        //             'muteHttpExceptions': true
                                        //         };

                                        //         //Error on UrlFetchApp >> (FIX LATER)
                                        //         if (proceed) {
                                        //             // var response = fetch(proxyUrl + url, options, {mode: "no-cors"});
                                        //             // response.then(()=> 
                                        //             firebase.database().ref().child("System Settings").update({ "GateStatus": "false" });
                                        //         }

                                        // });
                                    }
                                });
                        });
                }
                else {
                    //Trigered when date don't match (date_match == false)
                    document.getElementById("welcome").innerHTML = "Oops, I'm sorry, but...";
                    document.getElementById("warning").innerHTML = "Your expected date of entry doesn't match today's date!";

                    var dateOfEntryMessage = String(VRegInDate).replace(",", " ").replace(",", " ").replace('"', '').replace('"', '') + " to " + String(VRegOutDate).replace(",", " ").replace(",", " ").replace('"', '').replace('"', '');

                    if (String(VRegInDate) == String(VRegOutDate)) {
                        document.getElementById("error").innerHTML = "Date of Entry is: " + VRegInDateFB.replace("_", " ").replace("_", " ").replace('"', '').replace('"', '');
                    }
                    else {
                        document.getElementById("error").innerHTML = "Date of Entry is: " + dateOfEntryMessage;

                    }
                    var button = document.getElementById("btn");
                    button.style.display = 'none';
                    fetch(errorUrl.concat("?value1=", "Please check. Date of Entry does not match today's date.", "&", "value2=", code, "&", "value3=", String(dateOfEntryMessage)), errorNotificationOptions).catch((err) => {
                        console.log("Error notification error with: " + err);
                    });
                }
            }

            OpenGates();

            // function CloseGates()
            // {
            //     var proceed;
            //     var gateStatus = null;
            //     var ref = firebase.database().ref("System Settings" + "/" + "GateStatus");
            //     var url = 'https://maker.ifttt.com/trigger/Close_Gates/with/key/bZ8KUX8eSaDVstS99hqn98nWEO_qVWuvn1cKb6bm6OB';
            //     ref.once("value")
            //     .then(function(snapshot) {
            //         gateStatus = snapshot.val();

            //     })
            //     .then(function() {
            //         console.log("Gate Status is:" + gateStatus);

            //         if (url.search("Open_Gates") != -1) {
            //             console.log("Open gates trigger");
            //             proceed = gateStatus === false ? true : false;
            //         }
            //         else if (url.search("Close_Gates") != -1) {
            //             console.log("Close gates trigger");
            //             proceed = gateStatus === true ? true : false;
            //         }
            //         else {
            //             proceed = null;
            //             console.log("Unknown error");
            //         }
            //     })
            //     .then(function() {

            //         // var proceed = checkGateTrigger(url);
            //         // var proceed = checkGateTrigger(url);
            //         console.log("Close Gates Proceed:" + proceed);

            //         var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
            //         var options =
            //         {
            //             'muteHttpExceptions': true
            //         };

            //         //Error on UrlFetchApp >> (FIX LATER)
            //         if (proceed)
            //         {
            //             var response = fetch(proxyUrl + url, options, {mode: "no-cors"});
            //             response.then(()=> firebase.database().ref().child("System Settings").update({GateStatus : false}));
            //         }
            //     });
            // }
        });
        //_____________________________________________________ WORKS FINE UNTIL HERE XD

    } catch (error) {
        fetch(errorUrl.concat("?value1=", "General error. Please check.", "&", "value2=", code), errorNotificationOptions).catch((err) => {
            console.log("Error notification error with: " + err);
        });
    }
};

