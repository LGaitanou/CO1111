fetch("https://codecyprus.org/th/api/list")
    .then(response => response.json()) //Parse JSON text to JavaScript object
    .then(jsonObject => {
        //console.log(jsonObject.treasureHunts); //TODO - Success, do something with the data.
        let THArray = jsonObject.treasureHunts;
        console.log(THArray);
        for (let i = 0; i < THArray.length; i++) {
            let listItem = document.createElement("li");
            let uuid = THArray[i].uuid;
            console.log(uuid);
            // let link = "https://codecyprus.org/th/api/start?player=Loizos&app=LOLOLOL&treasure-hunt-id=" + uuid;
            listItem.innerHTML = "<a href=https://codecyprus.org/th/api/start?player=Loizos&app=LOLOLOL&treasure-hunt-id=>" + THArray[i].name + "</a>";
            challengesList.appendChild(listItem);
        }
    });


let body = document.body;

/*
let loadingDiv = document.getElementById("myDiv");

const URL = "student.json";

fetch(URL)
    .then(response => response.json())
    .then((json) => {
        loadingDiv.innerHTML = "Loaded";
        if (json.status === "OK") {

        }
    });
*/


