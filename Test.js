// Define the API endpoints as JSON objects
const apiEndpoints = {
    "listQuestions": "/th/test-api/list",
    "startQuiz": "/th/test-api/start",
    "getQuestion": "/th/test-api/question",
    "submitAnswer": "/th/test-api/answer",
    "getScore": "/th/test-api/score",
    "getLeaderboard": "/th/test-api/leaderboard"
};

function testStartQuiz() {
    // Fetch the start quiz endpoint
    fetch(apiEndpoints.startQuiz)
        .then(response => {
            if (response.ok) {
                document.getElementById("result-startQuiz").innerHTML = "Success! Start quiz function is working.";
            }
            else {
                document.getElementById("result-startQuiz").innerHTML = "Error: Start quiz function is not working.";
            }
        })
        .catch(error => {
            document.getElementById("result-startQuiz").innerHTML = "Error: " + error.message;
        });
}

function testGetQuestion() {
    // Fetch the get question endpoint with a sample question ID
    fetch(apiEndpoints.getQuestion + "?question_id=123")
        .then(response => {
            if (response.ok) {
                document.getElementById("result-getQuestion").innerHTML = "Success! Get question function is working.";
            }
            else {
                document.getElementById("result-getQuestion").innerHTML = "Error: Get question function is not working.";
            }
        })
        .catch(error => {
            document.getElementById("result-getQuestion").innerHTML = "Error: " + error.message;
        });
}

function testSubmitAnswer() {
    // Fetch the submit answer endpoint with a sample question ID and answer
    fetch(apiEndpoints.submitAnswer + "?question_id=123&answer=answer")
        .then(response => {
            if (response.ok) {
                document.getElementById("result-submitAnswer").innerHTML = "Success! Submit answer function is working.";
            }
            else {
                document.getElementById("result-submitAnswer").innerHTML = "Error: Submit answer function is not working.";
            }
        })
        .catch(error => {
            document.getElementById("result-submitAnswer").innerHTML = "Error: " + error.message;
        });
}

function testGetScore() {
    // Fetch the get score endpoint
    fetch(apiEndpoints.getScore)
        .then(response => {
            if (response.ok) {
                document.getElementById("result-getScore").innerHTML = "Success! Get score function is working.";
            }
            else {
                document.getElementById("result-getScore").innerHTML = "Error: Get score function is not working.";
            }
        })
        .catch(error => {
            document.getElementById("result-getScore").innerHTML = "Error: " + error.message;
        });
}

function testGetLeaderboard() {
    // Fetch the get leaderboard endpoint
    fetch(apiEndpoints.getLeaderboard)
        .then(response => {
            if (response.ok) {
                document.getElementById("result-getLeaderboard").innerHTML = "Success! Get leaderboard function is working.";
            }
            else {
                document.getElementById("result-getLeaderboard").innerHTML = "Error: Get leaderboard function is not working.";
            }
        })
        .catch(error => {
            document.getElementById("result-getLeaderboard").innerHTML = "Error: " + error.message;
        });
}


function testStartQuiz() {
    // Fetch the start quiz endpoint
    fetch(apiEndpoints.startQuiz)
        .then(response => {
            if (response.ok) {
                document.getElementById("result-startQuiz").innerHTML = "ERROR! Start quiz function is not working.";
                document.getElementById("result-startQuiz").classList.add("error"); // add the error class to the result element
            } else {
                document.getElementById("result-startQuiz").innerHTML = "Welcome to the treasure Hunt: Start quiz function is working.";
                document.getElementById("result-startQuiz").classList.add("success"); // add the success class to the result element
            }
        })
        .catch(error => {
            document.getElementById("result-startQuiz").innerHTML = "Error: " + error.message;
            document.getElementById("result-startQuiz").classList.add("error"); // add the error class to the result element
        });
}
