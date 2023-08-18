window.onresize = out;
document.body.onselectstart = function () { return false };

let height;
let width;

function out() {
    height = document.documentElement.clientHeight;
    width = document.documentElement.clientWidth;
    let main = document.getElementById("main");
    main.style.width = `${width}px`;
    main.style.height = `${height}px`;
    let wrap = document.getElementById("wrap");
    wrap.style.width = `${height * 1.35}px`;
    wrap.style.height = `${height * 0.9}px`;
    wrap.style.fontSize = `${width / 30}px`;
    wrap.style.textAlign = `center`;    
}

out();

function getTitles() {
    let titles = ["Player's victories", "Android's victories", "First player's victories", "Second player's victories"];
    try {
        titles[0] = Android.getTitles("Pv");
        titles[1] = Android.getTitles("Av");
        titles[2] = Android.getTitles("Fpv");
        titles[3] = Android.getTitles("Spv");
    } catch (e) {
        console.log(e);
    } finally {
        return titles;
    }
}

function mainLogic(){
    let titles = getTitles();
    let main = document.getElementById("main");
    let wrap = document.getElementById("wrap");
    let rand = Math.floor(Math.random() * 5);
    switch (rand) {
        case 1: wrap.className = "final1"; break;
        case 2: wrap.className = "final2"; break;
        case 3: wrap.className = "final3"; break;
        case 4: wrap.className = "final4"; break;
        default: wrap.className = "final5";
    }
    let hash = document.location.hash;

    let countOfUserWins = localStorage.getItem('seabattle_count_of_user_wins');
    let countOfAiWins = localStorage.getItem('seabattle_count_of_ai_wins');
    let countOfUser1Wins = localStorage.getItem('seabattle_count_of_user1_wins');
    let countOfUser2Wins = localStorage.getItem('seabattle_count_of_user2_wins');

    if (hash[1] == "0"){
        wrap.innerHTML = `<br>${titles[0]} - ${countOfUserWins}<br>${titles[1]} - ${countOfAiWins}`;
//        main.ontouchstart = function () { document.location.replace("setting_man.html") };
          main.ontouchstart = function () { Android.showAds("0") };
    } else if (hash[1] == "1") {
        wrap.innerHTML = `<br>${titles[2]} - ${countOfUser1Wins}<br>${titles[3]} - ${countOfUser2Wins}`;
//        main.ontouchstart = function () { document.location.replace("setting_man1.html") };
          main.ontouchstart = function () { Android.showAds("1") };
    }
}

mainLogic();