const TH_BASE_URL = "https://codecyprus.org/th/api/"; // the true API base url
const TH_TEST_URL = "https://codecyprus.org/th/test-api/"; // the test API base url
let set = false;
let completed = false;
let challengesList = document.getElementById("challengeList");
let errorList = document.getElementById("errorList");
let loader = document.getElementById("loader");
//let score = 4;
let correctScore = 0;
let wrongScore = 0;
let skipScore = 0;


function redirect(url) {
    window.location.href = url.toString();
}

function getChallenges() {
    fetch(TH_BASE_URL + "list")
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
            loader.hidden = true;
            if (jsonObject.status === "OK") {
                let THArray = jsonObject.treasureHunts;
                console.log(THArray);
                for (let i = 0; i < THArray.length; i++) {
                    let listItem = document.createElement("li");
                    let uuid = THArray[i].uuid;
                    console.log(uuid);
                    listItem.innerHTML = "<a href=\"javascript:select(\'" + uuid + "\')\">" + THArray[i].name + "</a>";
                    challengesList.appendChild(listItem);
                }
            }
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

// Get the name of the team
let teamName = params.name;
if (!(teamName === null)) setCookie("name", teamName, 365);

function select(uuid) {
    errorList.innerHTML = " ";
    console.log("ENTERED")
    fetch(TH_BASE_URL + "start?player=" + getCookie("name") + "&app=TH-Team6&treasure-hunt-id=" + uuid)
        .then(response => response.json())
        .then(jsonObject => {
            if (jsonObject.status === "OK") {
                setCookie("session", jsonObject.session, 365);
                redirect("session.html");
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

function getQuestions() {
    fetch(TH_BASE_URL + "question?session=" + getCookie("session"))
        .then(response => response.json())
        .then(jsonObject => {
            if (jsonObject.status === "OK") {
                setQuestionInterface(jsonObject.questionType);
                setInterval(getLocation, 31000);
                if (jsonObject.requiresLocation) getLocation();


                // Makes the skip button appear or disappear
                if (jsonObject.canBeSkipped) document.getElementById("skipButton").style.display = "block";
                else document.getElementById("skipButton").style.display = "none";

                let numOfQuestions = document.getElementById("numOfQuestions");
                numOfQuestions.innerHTML = jsonObject.numOfQuestions;

                let completedQuestions = document.getElementById("completedQuestions");
                completedQuestions.innerText = jsonObject.currentQuestionIndex;

                let question = document.getElementById("question");
                question.innerHTML = jsonObject.questionText;

                console.log(jsonObject);


                if (jsonObject.completed) {
                    document.cookie = "session =; expires=Wed, 31 Oct 2012 08:50:17 UTC;";
                    window.location.href = "leaderboard.html";
                }
                showScore();
            }
            else {
                for (let i = 0; i < jsonObject.errorMessages.length; i++) {
                    alert(jsonObject.errorMessages[i]);
                }
            }
        });
}

function answerQuestion(answer) {
    console.log(answer);
    fetch(TH_BASE_URL + "answer?session=" + getCookie("session") + "&answer=" + answer)
        .then(response => response.json())
        .then(jsonObject => {
            if (jsonObject.status === "OK") {
                let me = document.getElementById("message");
                me.innerHTML = jsonObject.message;
                if (jsonObject.completed) {
                    document.cookie = "session =; expires=Wed, 31 Oct 2012 08:50:17 UTC;";
                    window.location.href = "leaderboard.html";
                }
                showScore();
                if (jsonObject.correct) location.reload();
            }
            else {
                for (let i = 0; i < jsonObject.errorMessages.length; i++) {
                    alert(jsonObject.errorMessages[i]);
                }
            }
            });
}

function showScore() {
    fetch(TH_BASE_URL + "score?session=" + getCookie("session"))
        .then(response => response.json())
        .then(jsonObject => {
            if (jsonObject.status === "OK") {
                let scoreQ = document.getElementById("score");
                scoreQ.innerHTML = jsonObject.score;
                if (jsonObject.finished) {
                    alert("You have run out of time!");
                    window.location.href = "name.html";
                }
            }
            else {
                for (let i = 0; i < jsonObject.errorMessages.length; i++) {
                    alert(jsonObject.errorMessages[i]);
                }
            }
        });
}

function skipQuestion() {
    if (confirm("Do you want to skip the question?")) {
        let s = getCookie("session");
        fetch(TH_BASE_URL + "skip?session=" + s)
            .then(response => response.json())
            .then(jsonObject => {
                if (jsonObject.status === "OK") {
                    let me = document.getElementById("message");
                    me.innerHTML = jsonObject.message;
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

function getLeaderboard() {
    fetch(TH_BASE_URL + "leaderboard?session=" + getCookie("session") + "&sorted&limit=20")
        .then(response => response.json())
        .then(jsonObject => {
            if (jsonObject.status === "OK") {
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
                let dateOptions = { second: "2-digit", minute: "2-digit",  hour: "2-digit", day: "numeric", month: "short"};
                let lArray = jsonObject.leaderboard;
                let tableHtml = "";
                for (let i = 0; i < lArray.length; i++) {
                    let readableDate = new Date(lArray[i].completionTime);  // Convert the epoch time to readable time
                    let modifiedDate = readableDate.toLocaleDateString("en-UK", dateOptions);  // Modify the readable time to show it in the table
                    tableHtml += "<tr>\n" +
                        "<td>" + lArray[i].player + "</td>" +
                        "<td>" + lArray[i].score + "</td>" +
                        "<td>" + modifiedDate + "</td>" +
                        "</td>";
                }
                document.getElementById("leaderboardTable").innerHTML = tableHtml;
            }
            else {
                for (let i = 0; i < jsonObject.errorMessages.length; i++) {
                    alert(jsonObject.errorMessages[i]);
                }
            }
        });
}

function setQuestionInterface(type) {
    let b = document.getElementById("boolean");
    let i = document.getElementById("integer");
    let n = document.getElementById("numeric");
    let m = document.getElementById("MCQ");
    let t = document.getElementById("text");
    if (type === "BOOLEAN") {
        b.style.display = "block";
        i.style.display = "none";
        n.style.display = "none";
        m.style.display = "none";
        t.style.display = "none";
    } else if (type === "INTEGER") {
        b.style.display = "none";
        i.style.display = "block";
        n.style.display = "none";
        m.style.display = "none";
        t.style.display = "none";
    } else if (type === "NUMERIC") {
        b.style.display = "none";
        i.style.display = "none";
        n.style.display = "block";
        m.style.display = "none";
        t.style.display = "none";
    } else if (type === "MCQ") {
        b.style.display = "none";
        i.style.display = "none";
        n.style.display = "none";
        m.style.display = "block";
        t.style.display = "none";
    } else if (type === "TEXT") {
        b.style.display = "none";
        i.style.display = "none";
        n.style.display = "none";
        m.style.display = "none";
        t.style.display = "block";
    }
}

// Functions to handle cookies taken from w3schools
// https://www.w3schools.com/js/js_cookies.asp
//////////////////////////////////////////////////

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

function checkCookie() {
    let user = getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            setCookie("username", user, 365);
        }
    }
}

// Functions to handle the position of the user in real time
//////////////////////////////////////

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(updatePosition);
    }
    else {
        alert("Geolocation is not supported by your browser.");
    }
}

function updatePosition(position) {
    fetch(TH_BASE_URL + "location?session=" +  +"&latitude= + " + position.coords.latitude + "&longitude=" + position.coords.longitude)
}

/////////////////////////////////////
