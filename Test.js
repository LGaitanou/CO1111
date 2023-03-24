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

