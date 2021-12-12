const score = document.querySelector('#score');
const missed = document.querySelector('#missed');
const startScreen = document.querySelector('#startScreen');
const gameSpace = document.querySelector('#gameSpace');
const controlBox = document.querySelector('#controlBox');
let gameSpaceRect = gameSpace.getBoundingClientRect();

//========================================
let player = { start: false, speed: 15, score: 0, fire: false, missed: 0, music: true, paused:false };

let rocketMotion = { y: 0, number: 1 }

let keys = { ArrowUp: false, ArrowRight: false, ArroLeft: false }

let collideInfo = { isCollide: false, asteroidName: null }

//=====================================


const audioButton = document.querySelector('#bgm');
let bgm = new Audio('bgm.mp3');
let fireAudio = new Audio('rocketFire.mp3');

audioButton.addEventListener('click', () => {
    if (player.music) {
        player.music = false;
        audioButton.innerHTML = `<i class="fas fa-volume-mute"></i>`;

    } else {
        player.music = true;
        audioButton.innerHTML = `<i class="fas fa-music"></i>`;

    }
})

//========================================

startScreen.addEventListener('click', start);

//=======================================

let leftButton = document.querySelector('#left');
let rightButton = document.querySelector('#right');

document.addEventListener('keydown', (e) => {
    e.preventDefault();
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    e.preventDefault()
    keys[e.key] = false;
});

document.addEventListener('keydown', (e) => {
    e.preventDefault();
    if (keys[e.key == "ArrowUp"])
        keys.ArrowUp = true;
})

//==========================================
//Controls for mobile

leftButton.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keys.ArrowLeft = true
})
leftButton.addEventListener("touchend", (e) => {
    e.preventDefault();
    keys.ArrowLeft = false
})


rightButton.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keys.ArrowRight = true
})
rightButton.addEventListener("touchend", (e) => {
    e.preventDefault();
    keys.ArrowRight = false
})



//===========================================

function isCollide(launcher, asteroid) {
    aRect = launcher.getBoundingClientRect();
    bRect = asteroid.getBoundingClientRect();
    return !((aRect.top > bRect.bottom) || (aRect.bottom < bRect.top) || (aRect.left > bRect.right) || (aRect.right < bRect.left))
}

function isCollideWithRocket(rocket, asteroids) {
    rocketRect = rocket.getBoundingClientRect();
    for (i = 0; i < 4; i++) {
        asteroidRect = asteroids[i].getBoundingClientRect();
        collideInfo.asteroidName = asteroids[i];
        collideInfo.isCollide = !((rocketRect.top > asteroidRect.bottom) || (rocketRect.bottom < asteroidRect.top) || (rocketRect.left > asteroidRect.right) || (rocketRect.right < asteroidRect.left))
        if (collideInfo.isCollide) {
            break;
        }
    }

}

//==========================================

function blast(asteroid) {
    asteroid.classList.add('hide');
}

//==========================================

function end() {
    bgm.pause();
    player.start = false;
    startScreen.classList.remove('hide');
    startScreen.classList.add('startScreenAnimation');
    startScreen.innerHTML = `Game Over <br>
    Your score: ${player.score} <br>
    Press Here to restart.`
}
//===========================================

function moveAsteroid() {
    let asteroids = document.querySelectorAll('.asteroids');
    let rocket = document.querySelector(`#rocket${rocketMotion.number}`);
    asteroids.forEach(element => {
        if (/*(isCollide(launcher, element)) ||*/ (player.missed == 10)) {
            end();

        }
        if (element.y >= 580) {
            element.y -= 1000;
            if (!element.classList.contains('hide')) {
                player.missed++
            }
            element.classList.remove('hide');
            element.style.left = Math.round((gameSpaceRect.width - 45) * Math.random()) + 'px';
        }
        element.y += (player.speed + (Math.round(player.score / 15)) - 12);
        element.style.top = element.y + 'px';



    });
    if (player.fire) {
        let asteroids = document.querySelectorAll('.asteroids');
        isCollideWithRocket(rocket, asteroids);
        if (collideInfo.isCollide) {
            console.log('Collision took place.');
            player.score++;
            blast(collideInfo.asteroidName);
            collideInfo.asteroidName = null;
            collideInfo.isCollide = false;
        }

        if (rocketMotion.y <= -220) {
            gameSpace.removeChild(gameSpace.childNodes[1]);
            let newRocket = document.createElement('div');
            newRocket.setAttribute('class', 'rocket');
            newRocket.classList.add('hide');
            newRocket.setAttribute('id', `rocket${rocketMotion.number++}`);
            gameSpace.insertBefore(newRocket, gameSpace.children[4]);
            player.fire = false;
        }

        else {
            rocketMotion.y -= (player.speed + 10);
            rocket.style.top = rocketMotion.y + 'px';
        }

    }
}

//==========================================

function moveRocket() {
    if (rocketMotion.number == 5) {
        rocketMotion.number = 1;
    }

    let rocket = document.querySelector(`#rocket${rocketMotion.number}`);
    rocket.classList.remove('hide');
    rocket.style.left = player.x + 'px';
    rocketMotion.y = player.y;
    player.fire = true;

    if (player.music) {
        fireAudio.play();
    }
}
//=========================================

function gamePlay() {
    let launcher = document.querySelector('#launcher');
    if (player.start) {
        moveAsteroid(launcher);

        if (keys.ArrowLeft && player.x > 0) {
            player.x -= player.speed;
        }
        if (keys.ArrowRight && (player.x + 45) < (gameSpaceRect.width)) {
            player.x += player.speed;
        }
        if (keys.ArrowUp) {
            fireButton.click();
        }
        keys.ArrowUp = false;
        if (player.music) {
            bgm.play();
        } else {
            bgm.pause();
        }

        //===================================

        if (bgm.ended) {
            bgm.currentTime = 0;
            bgm.play()
        }

        //===================================

        launcher.style.left = player.x + 'px';
        window.requestAnimationFrame(gamePlay);

        score.innerHTML = 'Score: ' + player.score;
        missed.innerHTML = 'Missed: ' + player.missed;
    }
}

//=========================================

function start() {
    controlBox.classList.remove('hide');
    startScreen.setAttribute('class', 'startScreenBegin');
    startScreen.classList.remove('startScreenAnimation');
    gameSpace.innerHTML = '';
    player.start = true;
    player.score = 0;
    player.missed = 0;
    rocketMotion.number = 1;
    bgm.currentTime = 0;
    window.requestAnimationFrame(gamePlay);

    //=====================================

    let launcher = document.createElement('div');
    launcher.setAttribute('id', 'launcher');
    gameSpace.appendChild(launcher);

    player.x = launcher.offsetLeft;
    player.y = launcher.offsetTop;
    //===================================

    for (i = 0; i < 4; i++) {
        let rocket = document.createElement('div');
        rocket.setAttribute('class', 'rocket');
        rocket.setAttribute('id', `rocket${i + 1}`)
        rocket.classList.add('hide');
        gameSpace.appendChild(rocket);
    }

    //===================================

    let fireButton = document.createElement('div');
    fireButton.setAttribute('id', 'fireButton');
    gameSpace.appendChild(fireButton);
    fireButton.addEventListener('click', moveRocket);

    //====================================

    for (i = 0; i < 4; i++) {
        let asteroid = document.createElement('div');
        asteroid.setAttribute('class', 'asteroids');
        asteroid.y = - ((i) * 250);
        asteroid.style.top = asteroid.y + 'px';
        asteroid.style.left = Math.round(Math.random() * (gameSpaceRect.width - 45)) + 'px';
        gameSpace.appendChild(asteroid);
    }

}
