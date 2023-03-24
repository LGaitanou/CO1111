const TH_TEST_URL = "https://codecyprus.org/th/test-api/"; // the test API base url

function getTestChallenges() {
    fetch(TH_TEST_URL + "list?number-of-ths=5")  // Get the response from the server
        .then(response => response.json()) // Parse JSON text to JavaScript object
        .then(jsonObject => {
            let result = document.getElementById("testResult");
            if (jsonObject.status === "OK") {  // If we successfully got the response we wanted
                let THArray = jsonObject.treasureHunts;  // Get the array of available THs
                if (THArray) {
                    document.getElementById("badChallenges").innerHTML = "Output Got: " + THArray.length + " challenges. SUCCESS";
                    let goodList = document.getElementById("testResult");
                    goodList.innerText = "";
                    for (let i = 0; i < THArray.length; i++) {
                        let listItem = document.createElement("li");
                        let uuid = THArray[i].uuid;
                        listItem.innerHTML = "<p>" + THArray[i].name + "</p>";
                        goodList.appendChild(listItem);
                    }

                }
                else {
                    document.getElementById("badChallenges").innerHTML = "Output Got: FAILED";
                }
            }
            // If the response failed, display the errors in the page
            else {
                let erorList = document.getElementById("erorList");
                for (let i = 0; i< jsonObject.errorMessages.length; i++) {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = jsonObject.errorMessages[i];
                    erorList.appendChild(listItem);
                }
            }
        });
}

function getTestStart() {
    fetch(TH_TEST_URL + "start?player=inactive")  // Get the response from the server
        .then(response => response.json()) // Parse JSON text to JavaScript object
        .then(jsonObject => {
            let result = document.getElementById("badStart");
            if (jsonObject.status === "OK") {  // If we successfully got the response we wanted
                result.innerHTML = "Failed to get the error";
            }
            else {
                result.innerHTML = "Success. Error got.";
                let erorList = document.getElementById("erorListStart");
                for (let i = 0; i< jsonObject.errorMessages.length; i++) {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = jsonObject.errorMessages[i];
                    erorList.innerHTML = "";
                    erorList.appendChild(listItem);
                }

            }
        });
}

function getTestQuestion() {
    fetch(TH_TEST_URL + "question?completed&question-type=NUMERIC&can-be-skipped=false&requires-location=false")  // Get the response from the server
        .then(response => response.json()) // Parse JSON text to JavaScript object
        .then(jsonObject => {
            if (jsonObject.status === "OK") {  // If we successfully got the response we wanted
                let goodList = document.getElementById("testResultQuestion");

                if (jsonObject.completed) {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = "Completed: " + jsonObject.completed + "  =>  SUCCESS";
                    goodList.appendChild(listItem);
                }
                else {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = "Completed: " + jsonObject.completed + "  =>  FAILED";
                    goodList.appendChild(listItem);
                }

                if (jsonObject.questionType === "NUMERIC") {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = jsonObject.questionType + "  =>  SUCCESS";
                    goodList.appendChild(listItem);
                }
                else {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = jsonObject.questionType + "  =>  FAILED";
                    goodList.appendChild(listItem);
                }

                if (!jsonObject.canBeSkipped) {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = "Can be Skipped: " + jsonObject.canBeSkipped + "  =>  SUCCESS";
                    goodList.appendChild(listItem);
                }
                else {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = "Can be Skipped: " + jsonObject.canBeSkipped + "  =>  FAILED";
                    goodList.appendChild(listItem);
                }

                if (!jsonObject.requiresLocation) {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = "Requires Location: " + jsonObject.requiresLocation + "  =>  SUCCESS";
                    goodList.appendChild(listItem);
                }
                else {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = "Requires Location: " + jsonObject.requiresLocation + "  =>  FAILED";
                    goodList.appendChild(listItem);
                }
            }
            else {
                let erorList = document.getElementById("erorListQuestion");
                for (let i = 0; i < jsonObject.errorMessages.length; i++) {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = jsonObject.errorMessages[i];
                    erorList.appendChild(listItem);
                }
            }
        });
}

function getTestAnswer() {
    fetch(TH_TEST_URL + "answer?correct&completed=false")  // Get the response from the server
        .then(response => response.json()) // Parse JSON text to JavaScript object
        .then(jsonObject => {
            if (jsonObject.status === "OK") {  // If we successfully got the response we wanted

                let goodList = document.getElementById("testResultAnswer");

                if (jsonObject.correct) {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = "Correct: " + jsonObject.message + "  =>  SUCCESS";
                    goodList.appendChild(listItem);
                }
                else {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = "Correct: " + jsonObject.message + "  =>  FAILED";
                    goodList.appendChild(listItem);
                }

                if (!jsonObject.completed) {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = "Completed: " + jsonObject.completed + "  =>  SUCCESS";
                    goodList.appendChild(listItem);
                }
                else {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = "Completed: " + jsonObject.completed + "  =>  FAILED";
                    goodList.appendChild(listItem);
                }

            }
            else {
                let erorList = document.getElementById("erorListAnswer");
                for (let i = 0; i < jsonObject.errorMessages.length; i++) {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = jsonObject.errorMessages[i];
                    erorList.appendChild(listItem);
                }
            }
        });
}

function getTestScore() {
    fetch(TH_TEST_URL + "score?score=68")  // Get the response from the server
        .then(response => response.json()) // Parse JSON text to JavaScript object
        .then(jsonObject => {
            if (jsonObject.status === "OK") {  // If we successfully got the response we wanted

                let goodList = document.getElementById("testResultScore");

                if (jsonObject.score == 68) {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = "Score: " + jsonObject.score + "  =>  SUCCESS";
                    goodList.appendChild(listItem);
                }
                else {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = "Score: " + jsonObject.score + "  =>  FAILED";
                    goodList.appendChild(listItem);
                }

                if (!jsonObject.completed) {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = "Completed: " + jsonObject.completed + "  =>  SUCCESS";
                    goodList.appendChild(listItem);
                }
                else {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = "Completed: " + jsonObject.completed + "  =>  FAILED";
                    goodList.appendChild(listItem);
                }

                if (!jsonObject.finished) {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = "Finished: " + jsonObject.finished + "  =>  SUCCESS";
                    goodList.appendChild(listItem);
                }
                else {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = "Finished: " + jsonObject.finished + "  =>  FAILED";
                    goodList.appendChild(listItem);
                }

            }
            else {
                let erorList = document.getElementById("erorListScore");
                for (let i = 0; i < jsonObject.errorMessages.length; i++) {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = jsonObject.errorMessages[i];
                    erorList.appendChild(listItem);
                }
            }
        });
}

function getTestLeaderboard() {
    fetch(TH_TEST_URL + "leaderboard?sorted=false&hasPrize&size=35")  // Get the response from the server
        .then(response => response.json()) // Parse JSON text to JavaScript object
        .then(jsonObject => {
            if (jsonObject.status === "OK") {  // If we successfully got the response we wanted

                let goodList = document.getElementById("testResultLeaderboard");

                if (!jsonObject.sorted) {
                    document.getElementById("LeaderboardSorted").innerText = "Sorted: " + jsonObject.sorted + "  =>  SUCCESS";
                }
                else {
                    document.getElementById("LeaderboardSorted").innerText = "Sorted: " + jsonObject.sorted + "  =>  FAILED";
                }

                if (jsonObject.hasPrize) {
                    document.getElementById("LeaderboardHasPrize").innerText = "Has Prize: " + jsonObject.hasPrize + "  =>  SUCCESS";
                }
                else {
                    document.getElementById("LeaderboardHasPrize").innerText = "Has Prize: " + jsonObject.hasPrize + "  =>  FAILED";
                }

                if (jsonObject.numOfPlayers == 35) {
                    document.getElementById("LeaderboardNumOfPeople").innerText = "Number of people: " + jsonObject.numOfPlayers + "  =>  SUCCESS";
                    for (let i = 0; i < jsonObject.leaderboard.length; i++) {
                        let listItem = document.createElement("li");
                        listItem.innerHTML = jsonObject.leaderboard[i].player;
                        goodList.appendChild(listItem);
                        listItem.innerHTML = jsonObject.leaderboard[i].score;
                        goodList.appendChild(listItem);
                        listItem.innerHTML = jsonObject.leaderboard[i].completionTime;
                        goodList.appendChild(listItem);
                        listItem.innerHTML = "";
                        goodList.appendChild(listItem);
                    }
                }
                else {
                    document.getElementById("LeaderboardNumOfPeople").innerText = "Number of people: " + jsonObject.numOfPlayers + "  =>  FAILED";
                }
                }

            else {
                let erorList = document.getElementById("erorListLeaderboard");
                for (let i = 0; i < jsonObject.errorMessages.length; i++) {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = jsonObject.errorMessages[i];
                    erorList.appendChild(listItem);
                }
            }
        });
}
