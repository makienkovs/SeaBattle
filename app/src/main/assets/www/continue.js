function message() {
    try {
        Android.information();
    } catch (e) {
        console.log(e);
    }
}

if (!localStorage.seabattle_type_of_game) {
    message();
}
else if (localStorage.getItem('seabattle_type_of_game') == "undefined") {
    message();
}
else if (localStorage.getItem('seabattle_type_of_game') == "manvsai") {
    document.location.replace("oneplayer.html")
}
else if (localStorage.getItem('seabattle_type_of_game') == "manvsman") {
    document.location.replace("twoplayers.html")
}
