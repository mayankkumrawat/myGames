const score = document.querySelector('.score');
const startScreen = document.querySelector('.startScreen');
const gameArea = document.querySelector('.gameArea');

let player = { start: false, speed: 8, score: 0 };

startScreen.addEventListener('click', start);

let keys = { ArrowUp: false, ArrowDown: false, ArrowRight: false, ArrowLeft: false }



//---------------------------------------------

// if (screen.availWidth <= 810 || screen.width <= 810){
let control = document.createElement("div")
let controlBox = document.getElementById("controlbox")
control.innerHTML = `<button class="button" id="top"><i class="fas fa-angle-double-up"></i></button>
    <div>
        <button  class="button"  id="left"></button>
        <button  class="button"  id="right"></button>
    </div>
    <button  class="button"  id="bottom"><i class="fas fa-angle-double-down"></i></button>`
controlBox.appendChild(control)
//}

let leftb = document.querySelector("#left")
let rightb = document.querySelector("#right")
let bottomb = document.querySelector("#bottom")
let topb = document.querySelector("#top")

leftb.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keys.ArrowLeft = true
})
leftb.addEventListener("touchend", (e) => {
    e.preventDefault();
    keys.ArrowLeft = false
})


rightb.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keys.ArrowRight = true
})
rightb.addEventListener("touchend", (e) => {
    e.preventDefault();
    keys.ArrowRight = false
})

topb.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keys.ArrowUp = true
})
topb.addEventListener("touchend", (e) => {
    e.preventDefault();
    keys.ArrowUp = false
})

bottomb.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keys.ArrowDown = true
})
bottomb.addEventListener("touchend", (e) => {
    e.preventDefault();
    keys.ArrowDown = false
})


document.addEventListener('keydown', (e) => {
    e.preventDefault();
    keys[e.key] = true;
    // console.log(e.key);
});

document.addEventListener('keyup', (e) => {
    e.preventDefault();
    keys[e.key] = false;
    // console.log(e.key);

});


function isCollide(a, b) {
    aRect = a.getBoundingClientRect();
    bRect = b.getBoundingClientRect();
    return !((aRect.top > bRect.bottom) || (aRect.bottom < bRect.top) || (aRect.left > bRect.right) || (aRect.right < bRect.left))
}

function movelines() {
    let lines = document.querySelectorAll('.lines');

    lines.forEach(item => {
        if (item.y >= 1000) {
            item.y -= 1200;
        }
        item.y += player.speed;
        item.style.top = item.y + 'px';
    });
}

function endGame() {
    player.start = false;
    startScreen.classList.remove('hide');
    startScreen.innerHTML = "Game Over <br> Your Score:" + player.score + "<br> Press Here to restart."
}


function moveEnemy(car) {
    let enemy = document.querySelectorAll('.enemy');

    enemy.forEach(item => {

        if (isCollide(car, item)) {
            // console.log('You Hit The Car');
            endGame();
        }

        if (item.y >= 1000) {
            item.y -= 1250;
            item.style.left = Math.round(160 * Math.random()) + 'px';

        }
        // item.y += player.speed;
        item.y += player.speed - 3;
        item.style.top = item.y + 'px';
    });
}

function gamePlay() {
    let car = document.querySelector('.car')
    let road = gameArea.getBoundingClientRect();
    // console.log(road);

    if (player.start) {

        movelines();
        moveEnemy(car);

        if (keys.ArrowUp && player.y > road.top + 40) { player.y -= player.speed; }
        if (keys.ArrowDown && player.y < road.bottom - 100) { player.y += player.speed; }
        if (keys.ArrowLeft && player.x > 0) { player.x -= player.speed; }
        if (keys.ArrowRight && player.x < road.width - 43.5) { player.x += player.speed; }


        car.style.top = player.y + 'px';
        car.style.left = player.x + 'px';

        window.requestAnimationFrame(gamePlay);
        // console.log(player.score++);
        score.innerText = player.score++;


    }
}

function start() {
    // gameArea.classList.remove('hide')
    startScreen.classList.add('hide')
    gameArea.innerHTML = "";
    player.start = true;
    player.score = 0;
    window.requestAnimationFrame(gamePlay);

    for (x = 0; x < 8; x++) {
        let roadline = document.createElement('div');
        roadline.setAttribute('class', 'lines');
        roadline.y = (x * 150);
        roadline.style.top = roadline.y + 'px';
        gameArea.appendChild(roadline);
    }

    let car = document.createElement('div')
    car.setAttribute('class', 'car');
    gameArea.appendChild(car);

    player.x = car.offsetLeft;
    player.y = car.offsetTop;

    //     console.log('top',car.offsetTop);
    //     console.log('left',car.offsetLeft);

    for (x = 0; x < 5; x++) {
        let enemyCar = document.createElement('div');
        enemyCar.setAttribute('class', 'enemy');
        enemyCar.y = ((x) * 250) * -1;
        enemyCar.style.top = enemyCar.y + 'px';
        // enemyCar.style.backgroundColor = randomColor();
        enemyCar.style.left = Math.round(160 * Math.random()) + 'px';
        gameArea.appendChild(enemyCar);
    }
}

function randomColor() {
    function c() {
        let hex = Math.round(Math.random() * 256).toString(16);
        return ("0" + hex).substr(-2);
    }
    return '#' + c() + c() + c();
}


