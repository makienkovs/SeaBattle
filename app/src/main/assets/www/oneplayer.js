//Инициализация размеров поля

window.onresize = out;
window.onload = out;
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

//Вывод информации
function messageWin() {
    try {
        Android.showWin();
        soundPlay("win");
        vibrateLong();
    } catch (e) {
        console.log(e);
    }
}

function messageLose() {
    try {
        Android.showLose();
        soundPlay("lose");
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

//Игровая логика

//Создаем класс корабль
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
let userMove = true;
let aiMove = true;
let fieldUser;
let arrOfUserShip = [];
let fieldAi;
let arrOfAiShip = [];
let lastShot = [];
let missShot = [];
const delay = 1000;
const shortDelay = 100;
const longDelay = 2000;

//Создаем массив 10х10
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

//Авторасстановка кораблей
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

/**
 * 0 - пустая клетка
 * 1 - клетка с целым кораблем
 * 2 - границы вокруг целого корабля
 * 3 - промах
 * 4 - подбитый корабль
 * 5 - границы вокруг подбитого корабля
 */

//Прорисовка поля
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

function userShoot(id) {
    if (userMove && id.length == 3) {
        if (fieldAi[+id[1]][+id[2]] == 1) {
            fieldAi[+id[1]][+id[2]] = 4;
            vibrateShort();
            soundPlay("hit");
            checkDeadShip(id[1] + id[2], arrOfAiShip);
            printField("a", fieldAi, false);
        }

        else if (fieldAi[+id[1]][+id[2]] == 0 || fieldAi[+id[1]][+id[2]] == 2) {
            fieldAi[+id[1]][+id[2]] = 3;
            vibrateShort();
            soundPlay("away");
            printField("a", fieldAi, false);
            userMove = false;
            aiMove = true;
            changeSide();
            setTimeout(aiShoot, delay);
        }

        if (checkWin(arrOfAiShip)) {
            end(true);
            userMove = false;
            aiMove = false;
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
    if (userMove) {
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
    clearU();
    for (let i = 0; i < 10; i++) {
        let div = document.getElementById(`u${i}${id[1]}`);
        div.style.backgroundColor = colorSelection;
    }
    for (let j = 0; j < 10; j++) {
        let div = document.getElementById(`u${id[0]}${j}`);
        div.style.backgroundColor = colorSelection;
    }
}

function aiShoot() {
    save();
    addMissShot(fieldUser);

    if (checkWin(arrOfUserShip)) {
        printField("a", fieldAi, true);
        end(false);
        userMove = false;
        aiMove = false;
    }

    if (aiMove) {
        if (lastShot.length == 0) {
            aiShootRand(fieldUser, arrOfUserShip)
        }
        else if (lastShot.length == 1) {

            let i = +lastShot[0][0];
            let j = +lastShot[0][1];
            let rand = Math.floor(Math.random() * 4);
            if (rand == 0) {
                if (i < 9 && !missShot.includes(`${i + 1}${j}`)) {
                    aiShootRight(i, j);
                }
                else if (i > 0 && !missShot.includes(`${i - 1}${j}`)) {
                    aiShootLeft(i, j)
                }
                else if (j < 9 && !missShot.includes(`${i}${j + 1}`)) {
                    aiShootDown(i, j)
                }
                else if (j > 0 && !missShot.includes(`${i}${j - 1}`)) {
                    aiShootUp(i, j)
                }
            }
            else if (rand == 1) {
                if (j > 0 && !missShot.includes(`${i}${j - 1}`)) {
                    aiShootUp(i, j)
                }
                else if (i < 9 && !missShot.includes(`${i + 1}${j}`)) {
                    aiShootRight(i, j);
                }
                else if (i > 0 && !missShot.includes(`${i - 1}${j}`)) {
                    aiShootLeft(i, j)
                }
                else if (j < 9 && !missShot.includes(`${i}${j + 1}`)) {
                    aiShootDown(i, j)
                }
            }
            else if (rand == 2) {
                if (j < 9 && !missShot.includes(`${i}${j + 1}`)) {
                    aiShootDown(i, j)
                }
                else if (j > 0 && !missShot.includes(`${i}${j - 1}`)) {
                    aiShootUp(i, j)
                }
                else if (i < 9 && !missShot.includes(`${i + 1}${j}`)) {
                    aiShootRight(i, j);
                }
                else if (i > 0 && !missShot.includes(`${i - 1}${j}`)) {
                    aiShootLeft(i, j)
                }
            }
            else {
                if (i > 0 && !missShot.includes(`${i - 1}${j}`)) {
                    aiShootLeft(i, j)
                }
                else if (j < 9 && !missShot.includes(`${i}${j + 1}`)) {
                    aiShootDown(i, j)
                }
                else if (j > 0 && !missShot.includes(`${i}${j - 1}`)) {
                    aiShootUp(i, j)
                }
                else if (i < 9 && !missShot.includes(`${i + 1}${j}`)) {
                    aiShootRight(i, j);
                }
            }
        }
        else {
            let i = +lastShot[0][0];
            let j = +lastShot[0][1];
            let maxI, maxJ, minI, minJ;

            if (lastShot.length == 2) {
                maxI = Math.max(i, +lastShot[1][0]);
                maxJ = Math.max(j, +lastShot[1][1]);
                minI = Math.min(i, +lastShot[1][0]);
                minJ = Math.min(j, +lastShot[1][1]);
            }
            else {
                maxI = Math.max(i, +lastShot[1][0], +lastShot[2][0]);
                maxJ = Math.max(j, +lastShot[1][1], +lastShot[2][1]);
                minI = Math.min(i, +lastShot[1][0], +lastShot[2][0]);
                minJ = Math.min(j, +lastShot[1][1], +lastShot[2][1]);
            }
            //равны i - горизонтальное расположение
            if (i == +lastShot[1][0]) {
                aiShootHorisontal(i, maxJ, minJ);
            }
            //равны j - вертикальное расположение
            else if (j == +lastShot[1][1]) {
                aiShootVertical(j, maxI, minI)
            }
        }
    }
}

function aiShootRand() {
    let i;
    let j;
    let result = true;
    while (result) {
        i = Math.floor(Math.random() * 10);
        j = Math.floor(Math.random() * 10);
        if (fieldUser[i][j] == 1) {
            fieldUser[i][j] = 4;
            vibrateShort();
            soundPlay("hit");
            selectU(`${i}${j}`);
            setTimeout(clearU, shortDelay);
            lastShot.push(`${i}${j}`);

            if (checkDeadShip(`${i}${j}`, arrOfUserShip))
                lastShot = [];

            printField("u", fieldUser, true);
            setTimeout(aiShoot, delay);
            result = false;
        }
        else if (fieldUser[i][j] == 0 || fieldUser[i][j] == 2) {
            fieldUser[i][j] = 3;
            vibrateShort();
            soundPlay("away");
            selectU(`${i}${j}`);
            setTimeout(clearU, shortDelay);
            printField("u", fieldUser, true);
            result = false;
            userMove = true;
            changeSide();
        }
    }
}

function aiShootRight(i, j) {
    if (fieldUser[i + 1][j] == 1) {
        fieldUser[i + 1][j] = 4;
        vibrateShort();
        soundPlay("hit");
        selectU(`${i + 1}${j}`);
        setTimeout(clearU, shortDelay);
        lastShot.push(`${i + 1}${j}`);

        if (checkDeadShip(`${i + 1}${j}`, arrOfUserShip))
            lastShot = [];

        printField("u", fieldUser, true);
        setTimeout(aiShoot, delay);
    }
    else if (fieldUser[i + 1][j] == 0 || fieldUser[i + 1][j] == 2) {
        fieldUser[i + 1][j] = 3;
        vibrateShort();
        soundPlay("away");
        selectU(`${i + 1}${j}`);
        setTimeout(clearU, shortDelay);
        printField("u", fieldUser, true);
        userMove = true;
        changeSide();
    }
}

function aiShootLeft(i, j) {
    if (fieldUser[i - 1][j] == 1) {
        fieldUser[i - 1][j] = 4;
        vibrateShort();
        soundPlay("hit");
        selectU(`${i - 1}${j}`);
        setTimeout(clearU, shortDelay);
        lastShot.push(`${i - 1}${j}`);

        if (checkDeadShip(`${i - 1}${j}`, arrOfUserShip))
            lastShot = [];

        printField("u", fieldUser, true);
        setTimeout(aiShoot, delay);
    }
    else if (fieldUser[i - 1][j] == 0 || fieldUser[i - 1][j] == 2) {
        fieldUser[i - 1][j] = 3;
        vibrateShort();
        soundPlay("away");
        selectU(`${i - 1}${j}`);
        setTimeout(clearU, shortDelay);
        printField("u", fieldUser, true);
        userMove = true;
        changeSide();
    }
}

function aiShootDown(i, j) {
    if (fieldUser[i][j + 1] == 1) {
        fieldUser[i][j + 1] = 4;
        vibrateShort();
        soundPlay("hit");
        selectU(`${i}${j + 1}`);
        setTimeout(clearU, shortDelay);
        lastShot.push(`${i}${j + 1}`);

        if (checkDeadShip(`${i}${j + 1}`, arrOfUserShip))
            lastShot = [];

        printField("u", fieldUser, true);
        setTimeout(aiShoot, delay);
    }
    else if (fieldUser[i][j + 1] == 0 || fieldUser[i][j + 1] == 2) {
        fieldUser[i][j + 1] = 3;
        vibrateShort();
        soundPlay("away");
        selectU(`${i}${j + 1}`);
        setTimeout(clearU, shortDelay);
        printField("u", fieldUser, true);
        userMove = true;
        changeSide();
    }
}

function aiShootUp(i, j) {
    if (fieldUser[i][j - 1] == 1) {
        fieldUser[i][j - 1] = 4;
        vibrateShort();
        soundPlay("hit");
        selectU(`${i}${j - 1}`);
        setTimeout(clearU, shortDelay);
        lastShot.push(`${i}${j - 1}`);

        if (checkDeadShip(`${i}${j - 1}`, arrOfUserShip))
            lastShot = [];

        printField("u", fieldUser, true);
        setTimeout(aiShoot, delay);
    }
    else if (fieldUser[i][j - 1] == 0 || fieldUser[i][j - 1] == 2) {
        fieldUser[i][j - 1] = 3;
        vibrateShort();
        soundPlay("away");
        selectU(`${i}${j - 1}`);
        setTimeout(clearU, shortDelay);
        printField("u", fieldUser, true);
        userMove = true;
        changeSide();
    }
}

function aiShootHorisontal(i, maxJ, minJ) {
    if (maxJ < 9 && fieldUser[i][maxJ + 1] != 4 && !missShot.includes(`${i}${maxJ + 1}`)) {
        if (fieldUser[i][maxJ + 1] == 1) {
            fieldUser[i][maxJ + 1] = 4;
            vibrateShort();
            soundPlay("hit");
            selectU(`${i}${maxJ + 1}`);
            setTimeout(clearU, shortDelay);
            lastShot.push(`${i}${maxJ + 1}`);

            if (checkDeadShip(`${i}${maxJ + 1}`, arrOfUserShip))
                lastShot = [];

            printField("u", fieldUser, true);
            setTimeout(aiShoot, delay);
        }
        else if (fieldUser[i][maxJ + 1] == 0 || fieldUser[i][maxJ + 1] == 2) {
            fieldUser[i][maxJ + 1] = 3;
            vibrateShort();
            soundPlay("away");
            selectU(`${i}${maxJ + 1}`);
            setTimeout(clearU, shortDelay);
            printField("u", fieldUser, true);
            userMove = true;
            changeSide();
        }
    }
    else if (minJ > 0 && fieldUser[i][minJ - 1] != 4 && !missShot.includes(`${i}${minJ - 1}`)) {
        if (fieldUser[i][minJ - 1] == 1) {
            fieldUser[i][minJ - 1] = 4;
            vibrateShort();
            soundPlay("hit");
            selectU(`${i}${minJ - 1}`);
            setTimeout(clearU, shortDelay);
            lastShot.push(`${i}${minJ - 1}`);

            if (checkDeadShip(`${i}${minJ - 1}`, arrOfUserShip))
                lastShot = [];

            printField("u", fieldUser, true);
            setTimeout(aiShoot, delay);
        }
        else if (fieldUser[i][minJ - 1] == 0 || fieldUser[i][minJ - 1] == 2) {
            fieldUser[i][Math.min(j, +lastShot[1][1]) - 1] = 3;
            vibrateShort();
            soundPlay("away");
            selectU(`${i}${minJ - 1}`);
            setTimeout(clearU, shortDelay);
            printField("u", fieldUser, true);
            userMove = true;
            changeSide();
        }
    }
}

function aiShootVertical(j, maxI, minI) {
    if (maxI < 9 && fieldUser[maxI + 1][j] != 4 && !missShot.includes(`${maxI + 1}${j}`)) {
        if (fieldUser[maxI + 1][j] == 1) {
            fieldUser[maxI + 1][j] = 4;
            vibrateShort();
            soundPlay("hit");
            selectU(`${maxI + 1}${j}`);
            setTimeout(clearU, shortDelay);
            lastShot.push(`${maxI + 1}${j}`);

            if (checkDeadShip(`${maxI + 1}${j}`, arrOfUserShip))
                lastShot = [];

            printField("u", fieldUser, true);
            setTimeout(aiShoot, delay);
        }
        else if (fieldUser[maxI + 1][j] == 0 || fieldUser[maxI + 1][j] == 2) {
            fieldUser[maxI + 1][j] = 3;
            vibrateShort();
            soundPlay("away");
            selectU(`${maxI + 1}${j}`);
            setTimeout(clearU, shortDelay);
            printField("u", fieldUser, true);
            userMove = true;
            changeSide();
        }
    }
    else if (minI > 0 && fieldUser[minI - 1][j] != 4 && !missShot.includes(`${minI - 1}${j}`)) {
        if (fieldUser[minI - 1][j] == 1) {
            fieldUser[minI - 1][j] = 4;
            vibrateShort();
            soundPlay("hit");
            selectU(`${minI - 1}${j}`);
            setTimeout(clearU, shortDelay);
            lastShot.push(`${minI - 1}${j}`);

            if (checkDeadShip(`${minI - 1}${j}`, arrOfUserShip))
                lastShot = [];

            printField("u", fieldUser, true);
            setTimeout(aiShoot, delay);
        }
        else if (fieldUser[minI - 1][j] == 0 || fieldUser[minI - 1][j] == 2) {
            fieldUser[minI - 1][j] = 3;
            vibrateShort();
            soundPlay("away");
            selectU(`${minI - 1}${j}`);
            setTimeout(clearU, shortDelay);
            printField("u", fieldUser, false, true);
            userMove = true;
            changeSide();
        }
    }
}

//Проверка подбит ли корабль
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

//Добавляем ходы, куда уже ходили, либо нет смысла ходить.
function addMissShot(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            if ((arr[i][j] == 3 || arr[i][j] == 4 || arr[i][j] == 5) && !missShot.includes(`${i}${j}`))
                missShot.push(`${i}${j}`);
        }
    }
}

//Проверка на победу.
function checkWin(arr) {
    let result = true;
    for (let ship of arr) {
        result &= ship.isDead;
    }
    return result;
}

//Переход хода
function changeSide() {
    let div = document.getElementById("buf");
    setTimeout(() => {
        if (div.className == "left")
            div.className = "right";
        else
            div.className = "left";
    }, shortDelay);
}

let lastIdA;

//Отслеживание элемента над которым нажато.
function touchMove(event) {
    clearA();
    let elemBelow = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY);
    try {
        selectA(elemBelow.id);
        lastIdA = elemBelow.id;
    } catch (error) { }
}

//Главная функция игры
function mainLogic() {
    let arrOfUserShipTemp;
    let arrOfAiShipTemp;
    let buf = document.getElementById("buf");

    fieldUser = JSON.parse(localStorage.getItem('seabatle_fieldUser'));
    arrOfUserShipTemp = JSON.parse(localStorage.getItem('seabatle_arrOfUserShip'));

    for (let i = 0; i < arrOfUserShipTemp.length; i++) {
        let ship = new Ship(arrOfUserShipTemp[i].size, arrOfUserShipTemp[i].isVertical, fieldUser, "u");
        ship.arrOfSets = arrOfUserShipTemp[i].arrOfSets;
        ship.isDead = arrOfUserShipTemp[i].isDead;
        ship.countOfShots = arrOfUserShipTemp[i].countOfShots;
        arrOfUserShip.push(ship);
    }

    if (localStorage.getItem('seabattle_type_of_game') == "manvsai") {
        fieldAi = JSON.parse(localStorage.getItem('seabatle_fieldAi'));
        arrOfAiShipTemp = JSON.parse(localStorage.getItem('seabatle_arrOfAiShip'));
        for (let i = 0; i < arrOfAiShipTemp.length; i++) {
            let ship = new Ship(arrOfAiShipTemp[i].size, arrOfAiShipTemp[i].isVertical, fieldAi, "a");
            ship.arrOfSets = arrOfAiShipTemp[i].arrOfSets;
            ship.isDead = arrOfAiShipTemp[i].isDead;
            ship.countOfShots = arrOfAiShipTemp[i].countOfShots;
            arrOfAiShip.push(ship);
        }
        lastShot = JSON.parse(localStorage.getItem('seabatle_lastShot'));
        if (localStorage.getItem('seabattle_move') == "userMove"){
            userMove = true;
            buf.className = "right";
        } else {
            userMove = false;
            buf.className = "left";
            aiShoot();
        }
    }
    else {
        fieldAi = createField();
        autoSetShip(fieldAi, arrOfAiShip, "a");
    }

    printField("u", fieldUser, true);
    printField("a", fieldAi, false);

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let divA = document.getElementById(`a${i}${j}`);
            divA.ontouchstart = function () { selectA(this.id) };
            divA.ontouchmove = function () { touchMove(event) };
            divA.ontouchend = function () { clearA(); userShoot(lastIdA) };
        }
    }
    save();
}

mainLogic();

function end(win) {
    if (!localStorage.seabattle_count_of_user_wins) {
        localStorage.setItem('seabattle_count_of_user_wins', "0");
    }
    if (!localStorage.seabattle_count_of_ai_wins) {
        localStorage.setItem('seabattle_count_of_ai_wins', "0");
    }

    let buf = document.getElementById("buf");
    buf.className = "";

    if (win) {
        messageWin();
        let countOfWins = +localStorage.getItem('seabattle_count_of_user_wins');
        countOfWins++;
        localStorage.setItem('seabattle_count_of_user_wins', countOfWins);

    } else {
        messageLose();
        let countOfWins = +localStorage.getItem('seabattle_count_of_ai_wins');
        countOfWins++;
        localStorage.setItem('seabattle_count_of_ai_wins', countOfWins);
    }

    setTimeout(final, longDelay);
}

function final() {
    localStorage.setItem('seabattle_type_of_game', "undefined");
    document.location.replace("final.html#0");
}

function save() {
    localStorage.setItem('seabattle_type_of_game', "manvsai");
    localStorage.setItem('seabatle_fieldUser', JSON.stringify(fieldUser));
    localStorage.setItem('seabatle_arrOfUserShip', JSON.stringify(arrOfUserShip));
    localStorage.setItem('seabatle_fieldAi', JSON.stringify(fieldAi));
    localStorage.setItem('seabatle_arrOfAiShip', JSON.stringify(arrOfAiShip));
    localStorage.setItem('seabatle_lastShot', JSON.stringify(lastShot));

    if (userMove)
        localStorage.setItem('seabattle_move', "userMove");
    else
        localStorage.setItem('seabattle_move', "aiMove");
}