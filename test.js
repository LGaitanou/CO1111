function handleTestList (caller) {
    handleList(caller, true);
}
function handleTestStart(caller) {
    let params = { "player": "INACTIVE" }; //handle explicity request an error
    handleStart(params, caller, true);
}