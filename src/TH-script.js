
function getChallenges() {
    fetch("https://codecyprus.org/th/api/list")
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
                    listItem.innerHTML = "<a href=https://codecyprus.org/th/api/start?player=" + teamName + "&app=Team6TH&treasure-hunt-id=" + uuid + ">" + THArray[i].name + "</a>";
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

let challengesList = document.getElementById("challengeList");
let errorList = document.getElementById("errorList");
let loader = document.getElementById("loader");

// This block of code handles query strings and was taken from the website stackoverflow
// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

// Get the name of the team
let teamName = params.name;





