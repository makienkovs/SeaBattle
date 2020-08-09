window.onresize = out;
document.body.onselectstart = function () { return false };

let height;
let width;
let side;

function out() {
    height = document.documentElement.clientHeight;
    width = document.documentElement.clientWidth;
    side = width / 26;
    let main = document.getElementById("main");
    main.style.width = `${width}px`;
    main.style.height = `${height}px`;

    let wrap = document.getElementById("wrap");
    wrap.style.width = `${width}px`;
    wrap.style.height = `${side * 14}px`;

    let info = document.getElementById("info");
    info.style.width = `${width}px`;
    info.style.height = `${side * 2}px`;
    info.style.fontSize = `${side * 0.8}px`;

    let infoLeft = document.getElementById("info-left");
    infoLeft.style.width = `${side * 12}px`;
    infoLeft.innerHTML = infoLeftText();
    let infoRight = document.getElementById("info-right");
    infoRight.style.width = `${side * 12}px`;
    infoRight.innerHTML = infoRightText();

    let user = document.getElementById("user");
    user.style.width = `${side * 12}px`;
    user.style.height = `${side * 12}px`;
    let userField = document.getElementById("userField");
    userField.style.width = `${side * 10}px`;
    userField.style.height = `${side * 10}px`;

    let buf = document.getElementById("buf");
    buf.style.width = `${side * 2}px`;
    buf.style.height = `${side * 12}px`;

    let ai = document.getElementById("ai");
    ai.style.width = `${side * 12}px`;
    ai.style.height = `${side * 12}px`;
    let aiField = document.getElementById("aiField");
    aiField.style.width = `${side * 10}px`;
    aiField.style.height = `${side * 10}px`;

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let divU = document.getElementById(`u${i}${j}`);
            divU.style.width = `${side}px`;
            divU.style.height = `${side}px`;
            divU.style.lineHeight = `${side}px`;
            let divA = document.getElementById(`a${i}${j}`);
            divA.style.width = `${side}px`;
            divA.style.height = `${side}px`;
            divA.style.lineHeight = `${side}px`;
        }
    }
}

out();

function messageFpw() {
    try {
        Android.showLFpw();
        soundPlay("win");
        vibrateLong();
    } catch (e) {
        console.log(e);
    }
}

function messageSpw() {
    try {
        Android.showLSpw();
        soundPlay("win");
        vibrateLong();
    } catch (e) {
        console.log(e);
    }
}

function soundPlay(sound) {
    try {
        Android.play(sound);
    } catch (e) {
        console.log(e);
    } 
}

function vibrateShort() {
    try {
        Android.vibrateShort();
    } catch (e) {
        console.log(e);
    }
}

function vibrateLong() {
    try {
        Android.vibrateLong();
    } catch (e) {
        console.log(e);
    }
}

function getTitles() {
    let titles = ["Player's water area", "Android's water area", "First player's water area", "Second player's water area"];
    try {
        titles[0] = Android.getTitles("Pwa");
        titles[1] = Android.getTitles("Awa");
        titles[2] = Android.getTitles("Fpwa");
        titles[3] = Android.getTitles("Spwa");
    } catch (e) {
        console.log(e);
    } finally {
        return titles;
    }
}

function infoLeftText() {
    let str = String(window.location.href);
    switch (str[str.length - 6]) {
        case "r": return getTitles()[0];
        case "1": return getTitles()[2];
        case "2": return getTitles()[3];
        case "n": return getTitles()[0];
        case "s": return getTitles()[2];
    }
}

function infoRightText() {
    let str = String(window.location.href);
    switch (str[str.length - 6]) {
        case "r": return getTitles()[1];
        case "s": return getTitles()[3];
        default: return "";
    }
}

function Ship(size, isVertical, field, user) {
    this.size = size;
    this.isVertical = isVertical;
    this.field = field;
    this.user = user;
    this.arrOfSets = [];
    this.isDead = false;
    this.countOfShots = 0;

    this.setShip = function () {
        let i, j;
        let result;
        let arr = [[]];

        do {
            result = false;
            this.arrOfSets = [];
            for (let index = 0; index < this.field.length; index++) {
                arr[index] = this.field[index].slice();
            }

            if (this.isVertical) {
                j = Math.floor(Math.random() * (10 - this.size));
                i = Math.floor(Math.random() * 10);
            }
            else {
                j = Math.floor(Math.random() * 10);
                i = Math.floor(Math.random() * (10 - this.size));
            }
            for (let index = 0; index < this.size; index++) {
                if (this.isVertical) {
                    if (arr[i][j + index] == 0) {
                        arr[i][j + index] = 1;
                        this.arrOfSets.push(`${i}${j + index}`);
                    }
                    else
                        result = true;
                }
                else {
                    if (arr[i + index][j] == 0) {
                        arr[i + index][j] = 1;
                        this.arrOfSets.push(`${i + index}${j}`);
                    }
                    else
                        result = true;
                }
            }
        }
        while (result);
        for (let index = 0; index < this.field.length; index++) {
            this.field[index] = arr[index].slice();
        }
    }
    this.setBorder = function () {
        let shipNumber;
        let borderNumber;

        if (this.isDead) {
            shipNumber = 4;
            borderNumber = 5;
        }
        else {
            shipNumber = 1;
            borderNumber = 2;
        }

        for (let k = 0; k < this.arrOfSets.length; k++) {
            let id = this.arrOfSets[k];
            let i = +id[0];
            let j = +id[1];
            this.field[i][j] = shipNumber;
            if (i > 0 && j > 0 && this.field[i - 1][j - 1] != shipNumber)
                this.field[i - 1][j - 1] = borderNumber;
            if (i > 0 && this.field[i - 1][j] != shipNumber)
                this.field[i - 1][j] = borderNumber;
            if (i > 0 && j < 9 && this.field[i - 1][j + 1] != shipNumber)
                this.field[i - 1][j + 1] = borderNumber;
            if (j > 0 && this.field[i][j - 1] != shipNumber)
                this.field[i][j - 1] = borderNumber;
            if (j < 9 && this.field[i][j + 1] != shipNumber)
                this.field[i][j + 1] = borderNumber;
            if (i < 9 && j > 0 && this.field[i + 1][j - 1] != shipNumber)
                this.field[i + 1][j - 1] = borderNumber;
            if (i < 9 && this.field[i + 1][j] != shipNumber)
                this.field[i + 1][j] = borderNumber;
            if (i < 9 && j < 9 && this.field[i + 1][j + 1] != shipNumber)
                this.field[i + 1][j + 1] = borderNumber;
        }
    }
    this.unSetBorder = function () {
        for (let k = 0; k < this.arrOfSets.length; k++) {
            let id = this.arrOfSets[k];
            let i = +id[0];
            let j = +id[1];
            this.field[i][j] = 0;
            if (i > 0 && j > 0 && this.field[i - 1][j - 1] != 0)
                this.field[i - 1][j - 1] = 0;
            if (i > 0 && this.field[i - 1][j] != 0)
                this.field[i - 1][j] = 0;
            if (i > 0 && j < 9 && this.field[i - 1][j + 1] != 0)
                this.field[i - 1][j + 1] = 0;
            if (j > 0 && this.field[i][j - 1] != 0)
                this.field[i][j - 1] = 0;
            if (j < 9 && this.field[i][j + 1] != 0)
                this.field[i][j + 1] = 0;
            if (i < 9 && j > 0 && this.field[i + 1][j - 1] != 0)
                this.field[i + 1][j - 1] = 0;
            if (i < 9 && this.field[i + 1][j] != 0)
                this.field[i + 1][j] = 0;
            if (i < 9 && j < 9 && this.field[i + 1][j + 1] != 0)
                this.field[i + 1][j + 1] = 0;
        }
    }
}

const colorSelection = "rgba(0, 0, 200, 0.3)";
const delay = 1000;
const shortDelay = 100;
const longDelay = 2000;

let fieldUser1;
let arrOfUser1Ship = [];
let user1Move = true;
let lastIdA;

let fieldUser2;
let arrOfUser2Ship = [];
let user2Move = false;
let lastIdU;

function touchMoveA(event) {
    clearA();
    let elemBelow = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY);
    try {
        selectA(elemBelow.id);
        lastIdA = elemBelow.id;
    } catch (error) { }
}

function touchMoveU(event) {
    clearU();
    let elemBelow = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY);
    try {
        selectU(elemBelow.id);
        lastIdU = elemBelow.id;
    } catch (error) { }
}

function mainLogic() {
    let buf = document.getElementById("buf");
    if (localStorage.seabattle_move && localStorage.getItem('seabattle_move') == "user2Move"){
        user1Move = false; user2Move = true;
        buf.className = "left";
    }else {
        user1Move = true; user2Move = false;
        buf.className = "right";
    } 

    fieldUser1 = JSON.parse(localStorage.getItem('seabatle_fieldUser1'));
    let arrOfUser1ShipTemp = JSON.parse(localStorage.getItem('seabatle_arrOfUser1Ship'));

    fieldUser2 = JSON.parse(localStorage.getItem('seabatle_fieldUser2'));
    let arrOfUser2ShipTemp = JSON.parse(localStorage.getItem('seabatle_arrOfUser2Ship'));

    for (let i = 0; i < arrOfUser1ShipTemp.length; i++) {
        let ship = new Ship(arrOfUser1ShipTemp[i].size, arrOfUser1ShipTemp[i].isVertical, fieldUser1, "u");
        ship.arrOfSets = arrOfUser1ShipTemp[i].arrOfSets;
        ship.isDead = arrOfUser1ShipTemp[i].isDead;
        ship.countOfShots = arrOfUser1ShipTemp[i].countOfShots;
        arrOfUser1Ship.push(ship);
    }

    for (let i = 0; i < arrOfUser2ShipTemp.length; i++) {
        let ship = new Ship(arrOfUser2ShipTemp[i].size, arrOfUser2ShipTemp[i].isVertical, fieldUser2, "a");
        ship.arrOfSets = arrOfUser2ShipTemp[i].arrOfSets;
        ship.isDead = arrOfUser2ShipTemp[i].isDead;
        ship.countOfShots = arrOfUser2ShipTemp[i].countOfShots;
        arrOfUser2Ship.push(ship);
    }

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let divA = document.getElementById(`a${i}${j}`);
            divA.ontouchstart = function () { selectA(this.id) };
            divA.ontouchmove = function () { touchMoveA(event) };
            divA.ontouchend = function () { clearA(); user1Shoot(lastIdA) };
        }
    }

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let divU = document.getElementById(`u${i}${j}`);
            divU.ontouchstart = function () { selectU(this.id) };
            divU.ontouchmove = function () { touchMoveU(event) };
            divU.ontouchend = function () { clearU(); user2Shoot(lastIdU) };
        }
    }
    printField("u", fieldUser1, false);
    printField("a", fieldUser2, false);
}

mainLogic();


function printField(s, field, isVisible) {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let div = document.getElementById(`${s}${i}${j}`);
            if (field[i][j] == 0 || field[i][j] == 2) {
                div.className = "ceil";
            }
            else if (field[i][j] == 1 && isVisible) {
                div.className = "s1";
            }
            else if (field[i][j] == 3) {
                div.className = "s3";
            }
            else if (field[i][j] == 4) {
                div.className = "s4";
            }
            else if (field[i][j] == 5) {
                div.className = "s3";
            }
        }
    }
}

function user1Shoot(id) {
    if (user1Move && id.length == 3) {
        if (fieldUser2[+id[1]][+id[2]] == 1) {
            fieldUser2[+id[1]][+id[2]] = 4;
            vibrateShort();
            soundPlay("hit");
            checkDeadShip(id[1] + id[2], arrOfUser2Ship);
            printField("a", fieldUser2, false);
        }

        else if (fieldUser2[+id[1]][+id[2]] == 0 || fieldUser2[+id[1]][+id[2]] == 2) {
            fieldUser2[+id[1]][+id[2]] = 3;
            vibrateShort();
            soundPlay("away");
            printField("a", fieldUser2, false);
            user1Move = false;
            user2Move = true;
            changeSide();
        }

        if (checkWin(arrOfUser2Ship)) {
            printField("u", fieldUser1, true);
            end(true);
            user1Move = false;
            user2Move = false;
        }
    }
    save();
}

function user2Shoot(id) {
    if (user2Move && id.length == 3) {
        if (fieldUser1[+id[1]][+id[2]] == 1) {
            fieldUser1[+id[1]][+id[2]] = 4;
            vibrateShort();
            soundPlay("hit");
            checkDeadShip(id[1] + id[2], arrOfUser1Ship);
            printField("u", fieldUser1, false);
        }

        else if (fieldUser1[+id[1]][+id[2]] == 0 || fieldUser1[+id[1]][+id[2]] == 2) {
            fieldUser1[+id[1]][+id[2]] = 3;
            vibrateShort();
            soundPlay("away");
            printField("u", fieldUser1, false);
            user1Move = true;
            user2Move = false;
            changeSide();
        }

        if (checkWin(arrOfUser1Ship)) {
            printField("a", fieldUser2, true);
            end(false);
            user1Move = false;
            user2Move = false;
        }
    }
    save();
}

function clearA() {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let div = document.getElementById(`a${i}${j}`);
            div.style.backgroundColor = "";
        }
    }
}

function selectA(id) {
    if (user1Move) {
        clearA();
        lastIdA = id;
        if (id[0] == "a") {
            for (let i = 0; i < 10; i++) {
                let div = document.getElementById(`a${i}${id[2]}`);
                div.style.backgroundColor = colorSelection;
            }
            for (let j = 0; j < 10; j++) {
                let div = document.getElementById(`a${id[1]}${j}`);
                div.style.backgroundColor = colorSelection;
            }
        }
    }
}

function clearU() {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let div = document.getElementById(`u${i}${j}`);
            div.style.backgroundColor = "";
        }
    }
}

function selectU(id) {
    if (user2Move) {
        clearU();
        lastIdU = id;
        if (id[0] == "u") {
            for (let i = 0; i < 10; i++) {
                let div = document.getElementById(`u${i}${id[2]}`);
                div.style.backgroundColor = colorSelection;
            }
            for (let j = 0; j < 10; j++) {
                let div = document.getElementById(`u${id[1]}${j}`);
                div.style.backgroundColor = colorSelection;
            }
        }
    }
}

function checkDeadShip(id, arrOfShip) {
    for (let i = 0; i < arrOfShip.length; i++) {
        if (arrOfShip[i].arrOfSets.includes(id)) {
            arrOfShip[i].countOfShots++;
            if (arrOfShip[i].countOfShots == arrOfShip[i].size) {
                arrOfShip[i].isDead = true;
                vibrateLong();
                soundPlay("destroy");
                arrOfShip[i].setBorder();
                return true;
            }
        }
    }
}

function checkWin(arr) {
    let result = true;
    for (let ship of arr) {
        result &= ship.isDead;
    }
    return result;
}

function changeSide() {
    let div = document.getElementById("buf");
    setTimeout(() => {
        if (div.className == "left")
            div.className = "right";
        else
            div.className = "left";
    }, shortDelay);
}

function end(win) {
    if (!localStorage.seabattle_count_of_user1_wins) {
        localStorage.setItem('seabattle_count_of_user1_wins', "0");
    }
    if (!localStorage.seabattle_count_of_user2_wins) {
        localStorage.setItem('seabattle_count_of_user2_wins', "0");
    }

    let buf = document.getElementById("buf");
    buf.className = "";

    if (win) {
        messageFpw();
        let countOfWins = +localStorage.getItem('seabattle_count_of_user1_wins');
        countOfWins++;
        localStorage.setItem('seabattle_count_of_user1_wins', countOfWins);

    } else {
        messageSpw();
        let countOfWins = +localStorage.getItem('seabattle_count_of_user2_wins');
        countOfWins++;
        localStorage.setItem('seabattle_count_of_user2_wins', countOfWins);
    }

    setTimeout(final, longDelay);
}

function final() {
    localStorage.setItem('seabattle_type_of_game', "undefined");
    document.location.replace("final.html#1");
}

function save() {
    localStorage.setItem('seabattle_type_of_game', "manvsman");
    if (user1Move)
        localStorage.setItem('seabattle_move', "user1Move");
    else
        localStorage.setItem('seabattle_move', "user2Move");

    localStorage.setItem('seabatle_arrOfUser1Ship', JSON.stringify(arrOfUser1Ship));
    localStorage.setItem('seabatle_fieldUser1', JSON.stringify(fieldUser1));
    localStorage.setItem('seabatle_arrOfUser2Ship', JSON.stringify(arrOfUser2Ship));
    localStorage.setItem('seabatle_fieldUser2', JSON.stringify(fieldUser2));
}