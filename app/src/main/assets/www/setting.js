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

    let setting = document.getElementById("setting");
    setting.style.width = `${side * 12}px`;
    setting.style.height = `${side * 12}px`;

    let settingField = document.getElementById("settingField");
    settingField.style.width = `${side * 8}px`;
    settingField.style.height = `${side * 8}px`;

    let reset = document.getElementById("reset");
    let change = document.getElementById("change");
    let rules = document.getElementById("rules");
    let play = document.getElementById("play");
    reset.style.height = `${side * 2}px`;
    reset.style.width = `${side * 2}px`;
    change.style.height = `${side * 2}px`;
    change.style.width = `${side * 2}px`;
    rules.style.height = `${side * 2}px`;
    rules.style.width = `${side * 2}px`;
    play.style.height = `${side * 2}px`;
    play.style.width = `${side * 2}px`;

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let divU = document.getElementById(`u${i}${j}`);
            divU.style.width = `${side}px`;
            divU.style.height = `${side}px`;
            divU.style.lineHeight = `${side}px`;
        }
    }
}

out();

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

function soundPlay(sound) {
    try {
        Android.play(sound);
    } catch (e) {
        console.log(e);
    } 
}

function message() {
    try {
        Android.cantRotate();
        soundPlay("click");
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

function rules() {
    try {
        vibrateShort();
        soundPlay("tap");
        Android.rules();
    } catch (e) {
        console.log(e);
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

const colorMove = "rgba(0, 200, 0, 0.7)";
const colorImpossible = "rgba(200, 0, 0, 0.7)";
const delay = 1000;
const shortDelay = 100;

let fieldUser;
let arrOfUserShip = [];
let lastId;
let shipToMove = null;
let deltaI, deltaJ;
let count = 0;

function createField() {
    let x = 10, y = 10, arr = [];
    for (let i = 0; i < x; i++) {
        arr[i] = [];
        for (let j = 0; j < y; j++) {
            arr[i][j] = 0;
        }
    }
    return arr;
}

function autoSetShip(field, arr, user) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j <= i; j++) {
            let ship = new Ship(4 - i, Math.random() > 0.5, field, user);
            ship.setShip();
            ship.setBorder();
            arr.push(ship);
        }
    }
}

function printField(s, field, isVisible) {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let div = document.getElementById(`${s}${i}${j}`);
            if (field[i][j] == 0) {
                div.className = "ceil";
            }
            else if (field[i][j] == 1 && isVisible) {
                div.className = "s1";
            }
            else if (field[i][j] == 2) {
                div.className = "ceil";
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

function clearU() {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let div = document.getElementById(`u${i}${j}`);
            div.style.backgroundColor = "";
        }
    }
}

function selectShip(id) {
    if (shipToMove != null) {
        arrOfUserShip.push(shipToMove);
    }
    shipToMove = null;
    if (id.length == 3 && id[0] == "u") {
        lastId = id;
        count = 0;
        printField("u", fieldUser, true);
        for (let i = 0; i < arrOfUserShip.length; i++) {
            if (arrOfUserShip[i].arrOfSets.includes(`${id[1]}${id[2]}`)) {
                shipToMove = arrOfUserShip.splice(i, 1)[0];
                vibrateShort();
                break;
            }
        }
        if (shipToMove != null) {
            shipToMove.unSetBorder();
            for (let i = 0; i < arrOfUserShip.length; i++) {
                arrOfUserShip[i].setBorder();
            }
            printField("u", fieldUser, true);
            for (let i = 0; i < shipToMove.arrOfSets.length; i++) {
                let div = document.getElementById(`u${shipToMove.arrOfSets[i][0]}${shipToMove.arrOfSets[i][1]}`);
                div.className = "s1s";
            }
        }
    }
}

function touchMove(event) {
    let elemBelow = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY);
    clearU();
    if (elemBelow != null) {
        let id = elemBelow.id;
        if (id.length == 3 && id[0] == "u") {
            if (shipToMove != null) {
                count = 0;
                let result = true;
                for (let k = 0; k < shipToMove.size; k++) {
                    let i = +shipToMove.arrOfSets[k][0];
                    let j = +shipToMove.arrOfSets[k][1];
                    deltaI = +lastId[1] - +id[1];
                    deltaJ = +lastId[2] - +id[2];
                    result &= i - deltaI >= 0 && j - deltaJ >= 0 && i - deltaI < 10 && j - deltaJ < 10 && fieldUser[i - deltaI][j - deltaJ] == 0;
                }
                for (let k = 0; k < shipToMove.arrOfSets.length; k++) {
                    let i = +shipToMove.arrOfSets[k][0];
                    let j = +shipToMove.arrOfSets[k][1];
                    deltaI = +lastId[1] - +id[1];
                    deltaJ = +lastId[2] - +id[2];
                    let div = document.getElementById(`u${i - deltaI}${j - deltaJ}`);
                    if (div != null && result) {
                        div.style.backgroundColor = colorMove;
                        count++;
                    } else if (div != null) {
                        div.style.backgroundColor = colorImpossible;
                    }
                }
            }
        }
    }
}

function setShip() {
    if (shipToMove != null) {
        if (shipToMove.size == count) {
            soundPlay("set");
            vibrateShort();
            for (let k = 0; k < shipToMove.arrOfSets.length; k++) {
                let i = +shipToMove.arrOfSets[k][0];
                let j = +shipToMove.arrOfSets[k][1];
                shipToMove.arrOfSets[k] = `${i - deltaI}${j - deltaJ}`;
            }
            shipToMove.setBorder();
            printField("u", fieldUser, true);
            for (let i = 0; i < shipToMove.size; i++) {
                let div = document.getElementById(`u${shipToMove.arrOfSets[i]}`);
                div.className = "s1s";
            }
        } else {
            shipToMove.setBorder();
        }
        clearU();
    }
}

function mainLogic() {
    localStorage.setItem('seabattle_type_of_game', "undefined");
    fieldUser = createField();
    arrOfUserShip = [];
    autoSetShip(fieldUser, arrOfUserShip, "u", true);
    printField("u", fieldUser, true);

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let divU = document.getElementById(`u${i}${j}`);
            divU.ontouchstart = function () { selectShip(this.id) };
            divU.ontouchmove = function () { touchMove(event) };
            divU.ontouchend = function () { setShip() };
        }
    }
}

mainLogic();

function reset() {
    vibrateShort();
    soundPlay("tap");
    fieldUser = createField();
    printField("u", fieldUser, true);
    arrOfUserShip = [];
    autoSetShip(fieldUser, arrOfUserShip, "u", true);
    printField("u", fieldUser, true);
}

function change() {
    vibrateShort();
    soundPlay("tap");
    if (shipToMove != null) {
        let i = +shipToMove.arrOfSets[0][0];
        let j = +shipToMove.arrOfSets[0][1];

        shipToMove.unSetBorder();
        for (let k = 0; k < arrOfUserShip.length; k++) {
            arrOfUserShip[k].setBorder();
        }
        let result = true;
        for (let k = 0; k < shipToMove.size; k++) {
            if (shipToMove.isVertical) {
                result &= i + k < 10 && fieldUser[i + k][j] == 0;
            }
            else if (!shipToMove.isVertical) {
                result &= j + k < 10 && fieldUser[i][j + k] == 0;
            }
        }
        if (result) {
            soundPlay("clickclack");
            vibrateShort();
            for (let k = 0; k < shipToMove.size; k++) {
                if (shipToMove.isVertical) {
                    shipToMove.arrOfSets[k] = `${i + k}${j}`;
                    fieldUser[i + k][j] = 1;
                }
                if (!shipToMove.isVertical) {
                    shipToMove.arrOfSets[k] = `${i}${j + k}`;
                    fieldUser[i][j + k] = 1;
                }
            }
            shipToMove.isVertical = !shipToMove.isVertical;
        } else {
            message();
        }
        setTimeout(printField, shortDelay, "u", fieldUser, true);
        shipToMove.setBorder();
        arrOfUserShip.push(shipToMove);
        shipToMove = null;
    }
}

function playManvsAi() {
    vibrateShort();
    soundPlay("tap");
    if (shipToMove != null) {
        arrOfUserShip.push(shipToMove);
    }
    localStorage.setItem('seabatle_arrOfUserShip', JSON.stringify(arrOfUserShip));
    localStorage.setItem('seabatle_fieldUser', JSON.stringify(fieldUser));
    document.location.replace("oneplayer.html");
}

function setUser2() {
    vibrateShort();
    soundPlay("tap");
    if (shipToMove != null) {
        arrOfUserShip.push(shipToMove);
    }
    localStorage.setItem('seabatle_arrOfUser1Ship', JSON.stringify(arrOfUserShip));
    localStorage.setItem('seabatle_fieldUser1', JSON.stringify(fieldUser));
    document.location.replace("setting_man2.html");
}

function playManvsMan() {
    vibrateShort();
    soundPlay("tap");
    if (shipToMove != null) {
        arrOfUserShip.push(shipToMove);
    }
    localStorage.setItem('seabatle_arrOfUser2Ship', JSON.stringify(arrOfUserShip));
    localStorage.setItem('seabatle_fieldUser2', JSON.stringify(fieldUser));
    document.location.replace("twoplayers.html");
}