const TH_BASE_URL = "https://codecyprus.org/th/api/"; // the true API base url
const TH_TEST_URL = "https://codecyprus.org/th/test-api/"; // the test API base url
let challengesList = document.getElementById("challengeList");  // List the available THs in here
let errorList = document.getElementById("errorList");  // Display the errors that the API gives in the "app" page
let loader = document.getElementById("loader");  // The loading icon
let cameraBox = document.getElementById("cameraBox");
let needsLocation = false;

no = document.getElementById("noCamera");


if (!(cameraBox === null)) {
    cameraBox.hidden = true;
    cameraBox.style.width = (getWidth() - 60) + "px";
    cameraBox.style.height = (getHeight() - 200) + "px";
}

let camera = document.getElementById("preview");
if (!(camera === null)) {
    camera.hidden = false;
    camera.style.width = (getWidth() - 60) + "px";
    camera.style.height = (getHeight() - 300) + "px";
}

/*function isTest() {
    TH_BASE_URL = "https://codecyprus.org/th/test-api/";
}*/

// Lists the challenges in the "app" page
function getChallenges() {
    fetch(TH_BASE_URL + "list")  // Get the response from the server
        .then(response => response.json()) // Parse JSON text to JavaScript object
        .then(jsonObject => {
            loader.hidden = true;  // When we finish fetching the response, hide the loading icon
            if (jsonObject.status === "OK") {  // If we successfully got the response we wanted
                let THArray = jsonObject.treasureHunts;  // Get the array of available THs
                console.log(jsonObject);
                // For every treasure hunt create a "li" element, insert the TH link into it, then place the li into the unordered list that already exists in the app page
                for (let i = 0; i < THArray.length; i++) {
                    let listItem = document.createElement("li");
                    let uuid = THArray[i].uuid;
                    listItem.innerHTML = "<a href=\"javascript:select(\'" + uuid + "\')\">" + THArray[i].name + "</a>";
                    challengesList.appendChild(listItem);
                }
            }

            // If the response failed, display the errors in the page
            else {
                for (let error in jsonObject.errorMessages) {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = error;
                    errorList.appendChild(listItem);
                }
            }
        });
}

// This block of code handles query strings and was taken from the website stackoverflow
// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

// Get the name of the team rom the URL
let teamName = params.name;
if (!(teamName === null)) setCookie("name", teamName, 365);

// When a TH is available and clicked, start the session
function select(uuid) {
    errorList.innerHTML = " ";
    fetch(TH_BASE_URL + "start?player=" + getCookie("name") + "&app=TH-Team6&treasure-hunt-id=" + uuid)
        .then(response => response.json())
        .then(jsonObject => {
            if (jsonObject.status === "OK") {
                setCookie("session", jsonObject.session, 365);  // Set the session cookie
                window.location.href = "session.html";  // Go to the page that displays the questions
            }
            else {
                for (let i = 0; i < jsonObject.errorMessages.length; i++) {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = jsonObject.errorMessages[i];
                    errorList.appendChild(listItem);
                }
            }
        });
}

// Get the next question and display it on screen
function getQuestions() {
    fetch(TH_BASE_URL + "question?session=" + getCookie("session"))
        .then(response => response.json())
        .then(jsonObject => {
            if (jsonObject.status === "OK") {

                setInterval(getLocation, 30000);  // Update the location every 30 seconds
                if (jsonObject.requiresLocation) {
                    let m = document.getElementById("message");
                    m.innerHTML = "These question requires geolocation";
                    setQuestionInterfaceLocation(jsonObject.questionType);
                }
                else setQuestionInterface(jsonObject.questionType);

                // Makes the skip button appear or disappear
                if (jsonObject.canBeSkipped) document.getElementById("skipButton").style.display = "block";
                else document.getElementById("skipButton").style.display = "none";

                // Displays how many questions the user completed
                let numOfQuestions = document.getElementById("numOfQuestions");
                numOfQuestions.innerHTML = jsonObject.numOfQuestions;

                // Displays how many questions are left
                let completedQuestions = document.getElementById("completedQuestions");
                completedQuestions.innerText = jsonObject.currentQuestionIndex;

                // // Displays the question
                let question = document.getElementById("question");
                question.innerHTML = jsonObject.questionText;

                // If the session has ended, go to the leaderboard
                if (jsonObject.completed) {
                    document.cookie = "session =; expires=Wed, 31 Oct 2012 08:50:17 UTC;";
                    window.location.href = "leaderboard.html";
                }
                showScore();  // Continuously show the score
            }

            // Alert the user of the errors
            else {
                for (let i = 0; i < jsonObject.errorMessages.length; i++) {
                    alert(jsonObject.errorMessages[i]);
                }
            }
        });
}

// Handles the answer to the current question
function answerQuestion(answer, needsLocation) {
    if (needsLocation) getLocation();
    fetch(TH_BASE_URL + "answer?session=" + getCookie("session") + "&answer=" + answer)
        .then(response => response.json())
        .then(jsonObject => {
            if (jsonObject.status === "OK") {

                // If session is over
                if (jsonObject.completed) {
                    window.location.href = "leaderboard.html";
                }
                showScore();

                // Answer was correct, so alert the user as so and go to the next one
                if (jsonObject.correct) {
                    alert(jsonObject.message);
                    location.reload();
                }

                // Answer was false, so massage the user in the page as so, then do not change the page
                else {
                    let me = document.getElementById("message");
                    me.innerHTML = jsonObject.message;
                }
            }
            else {
                for (let i = 0; i < jsonObject.errorMessages.length; i++) {
                    alert(jsonObject.errorMessages[i]);
                }
            }
            });
}

// Corrects the score after each question
function showScore() {
    fetch(TH_BASE_URL + "score?session=" + getCookie("session"))
        .then(response => response.json())
        .then(jsonObject => {
            if (jsonObject.status === "OK") {
                let scoreQ = document.getElementById("score");
                scoreQ.innerHTML = jsonObject.score;
            }
            else {
                for (let i = 0; i < jsonObject.errorMessages.length; i++) {
                    alert(jsonObject.errorMessages[i]);
                }
            }
        });
}

// Skip the question
function skipQuestion() {
    if (confirm("Do you want to skip the question?")) {
        let s = getCookie("session");
        fetch(TH_BASE_URL + "skip?session=" + s)
            .then(response => response.json())
            .then(jsonObject => {
                if (jsonObject.status === "OK") {
                    alert(jsonObject.message);
                    if (jsonObject.completed) window.location.href = "leaderboard.html";
                    location.reload();
                }
                else {
                    for (let i = 0; i < jsonObject.errorMessages.length; i++) {
                        alert(jsonObject.errorMessages[i]);
                    }
                }
            });
    }
}

// Gets the leaderboard information, displays it on screen
function getLeaderboard() {
    fetch(TH_BASE_URL + "leaderboard?session=" + getCookie("session") + "&sorted&limit=30")
        .then(response => response.json())
        .then(jsonObject => {
            if (jsonObject.status === "OK") {
                document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                document.cookie = "name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                loader.hidden = true;
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
                let dateOptions = { second: "2-digit", minute: "2-digit",  hour: "2-digit", day: "numeric", month: "short"};  // Helps convert the epoch time into readable text
                let lArray = jsonObject.leaderboard;
                let tableHtml = "";
                let rank = 1;
                // Loop to create a row for every entry in the leaderboard
                for (let i = 0; i < lArray.length; i++) {
                    let readableDate = new Date(lArray[i].completionTime);  // Convert the epoch time to readable time
                    let modifiedDate = readableDate.toLocaleDateString("en-UK", dateOptions);  // Modify the readable time to show it in the table
                    tableHtml += "<tr>\n" +
                        "<td>" + rank + "</td>" +  // Insert the rank in the row
                        "<td>" + lArray[i].player + "</td>" +  // Insert the name in the row
                        "<td>" + lArray[i].score + "</td>" +  // Insert the score in the row
                        "<td>" + modifiedDate + "</td>" +  // Insert the date in the row
                        "</td>";
                    rank++;
                }
                document.getElementById("leaderboardTable").innerHTML += tableHtml;  // Update the table with the changes
            }
            else {
                for (let i = 0; i < jsonObject.errorMessages.length; i++) {
                    alert(jsonObject.errorMessages[i]);
                }
            }
        });
}

function resumeHunt() {
    if (getCookie("session") !== "") {
        let re = confirm("There is an ongoing session. Do you want to resume it?");
        if (re) {
            window.location.href = "session.html";
            getQuestions();
        }
        else {
            window.location.href = "name.html";

        }
    }
    else {
        window.location.href = "name.html";
    }
}

function resumeHuntIndex() {
    if (getCookie("session") !== "") {
        let re = confirm("There is an ongoing session. Do you want to resume it?");
        if (re) {
            window.location.href = "src/session.html";
            getQuestions();
        }
        else {
            window.location.href = "src/name.html";

        }
    }
    else {
        window.location.href = "src/name.html";
    }
}

// Alter the input procedure for every different kind of question
function setQuestionInterface(type) {
    let b = document.getElementById("boolean");
    let i = document.getElementById("integer");
    let n = document.getElementById("numeric");
    let m = document.getElementById("MCQ");
    let t = document.getElementById("text");
    if (type === "BOOLEAN") {
        b.style.display = "block";
    } else if (type === "INTEGER") {
        i.style.display = "block";
    } else if (type === "NUMERIC") {
        n.style.display = "block";
    } else if (type === "MCQ") {
        m.style.display = "block";
    } else if (type === "TEXT") {
        t.style.display = "block";
    }
}


function setQuestionInterfaceLocation(type) {
    let b = document.getElementById("boolean");
    let i = document.getElementById("integer");
    let n = document.getElementById("numeric");
    let m = document.getElementById("MCQ");
    let t = document.getElementById("text");
    if (type === "BOOLEAN") {
        b.style.display = "block";
        b.innerHTML = "<input class=\"boolAns submit\" name=\"bool\" type=\"button\" value=\"true\" onclick=\"answerQuestion(true, true)\">\n" +
            "    <input class=\"boolAns submit\" name=\"bool\" type=\"button\" value=\"false\" onclick=\"answerQuestion(false, true)\">";
    } else if (type === "INTEGER") {
        i.style.display = "block";
        i.innerHTML = "<form>\n" +
            "        <input id=\"trueIntAns\" class=\"intAns\" type=\"number\" placeholder=\"...\">\n" +
            "        <input class=\"submit\" type=\"button\" value=\"Submit\" onclick=\"answerQuestion(document.getElementById('trueIntAns').value)\">\n" +
            "    </form>";
    } else if (type === "NUMERIC") {
        n.style.display = "block";
        n.innerHTML = "<form>\n" +
            "        <input id=\"trueNumAns\" class=\"numAns\" type=\"number\" placeholder=\"...\">\n" +
            "        <input class=\"submit\" step=\"0.00001\" type=\"button\" value=\"Submit\" onclick=\"answerQuestion(document.getElementById('trueNumAns',).value, true)\">\n" +
            "    </form>";
    } else if (type === "MCQ") {
        m.style.display = "block";
        m.innerHTML = "<input class=\"abcdAns submit\" name=\"abcd\" type=\"button\" value=\"A\" onclick=\"answerQuestion('A', true)\">\n" +
            "    <input class=\"abcdAns submit\" name=\"abcd\" type=\"button\" value=\"B\" onclick=\"answerQuestion('B', true)\">\n" +
            "    <input class=\"abcdAns submit\" name=\"abcd\" type=\"button\" value=\"C\" onclick=\"answerQuestion('C', true)\">\n" +
            "    <input class=\"abcdAns submit\" name=\"abcd\" type=\"button\" value=\"D\" onclick=\"answerQuestion('D', true)\">";
    } else if (type === "TEXT") {
        t.style.display = "block";
        t.innerHTML = "<form>\n" +
            "        <input id=\"trueTextAns\" class=\"textAns\" type=\"text\" placeholder=\"...\">\n" +
            "        <input class=\"submit\" maxlength=\"50\" type=\"button\" value=\"Submit\" onclick=\"answerQuestion(document.getElementById('trueTextAns').value, true)\">\n" +
            "    </form>";
    }
}

/////////////////////////////////////////////////////
// Functions to handle cookies taken from w3schools
// https://www.w3schools.com/js/js_cookies.asp

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

//////////////////////////////////////
// Functions to handle the position of the user in real time

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(updatePosition);
    }
    else {
        alert("Geolocation is not supported by your browser.");
    }
}

function updatePosition(position) {
    fetch(TH_BASE_URL + "location?session=" + getCookie("session") + "&latitude=" + position.coords.latitude + "&longitude=" + position.coords.longitude)
}

/////////////////////////////////////
// Code to enable the QR code reader
function openCamera() {

    cameraBox.hidden=!cameraBox.hidden;

    var opts = {
        // Whether to scan continuously for QR codes. If false, use scanner.scan() to
        // manually scan. If true, the scanner emits the "scan" event when a QR code is
        // scanned. Default true.
        continuous: true,
        // The HTML element to use for the camera's video preview. Must be a <video>
        // element. When the camera is active, this element will have the "active" CSS
        // class, otherwise, it will have the "inactive" class. By default, an invisible
        // element will be created to host the video.
        video: document.getElementById("preview"),
        // Whether to horizontally mirror the video preview. This is helpful when trying to
        // scan a QR code with a user-facing camera. Default true.
        mirror: true,
        // Whether to include the scanned image data as part of the scan result. See the
        // "scan" event for image format details. Default false.
        captureImage: false,
        // Only applies to continuous mode. Whether to actively scan when the tab is not
        // active.
        // When false, this reduces CPU usage when the tab is not active. Default true.
        backgroundScan: true,
        // Only applies to continuous mode. The period, in milliseconds, before the same QR
        // code will be recognized in succession. Default 5000 (5 seconds).
        refractoryPeriod: 5000,
        // Only applies to continuous mode. The period, in rendered frames, between scans. A
        // lower scan period increases CPU usage but makes scan response faster.
        // Default 1 (i.e. analyze every frame).
        scanPeriod: 1
    };
    var scanner = new Instascan.Scanner(opts);

    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            no.innerHTML = "Camera Available";
            scanner.start(cameras[0]);
        } else {
            console.error('No cameras found.');
            alert("No cameras found.");
        }
    }).catch(function (e) {
        console.error(e);

    });

    scanner.addListener('scan', function (content) {
        document.getElementById("hint").innerHTML = content;
        document.getElementById("noCamera").innerHTML = "Hint Acquired";
    });

}
//////////////////////////////
// Get the dimensions of the page

function getWidth() {
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    );
}

function getHeight() {
    return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
    );
}