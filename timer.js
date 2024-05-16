let timer;
let seconds = 0; // 初期値は0秒
let isAudioUnlocked = false;

document.addEventListener('DOMContentLoaded', function() {
    updateDisplay();
    resetAlertChecks(); // ページ読み込み時にアラームチェックボックスをリセット
    initializeAudio(); // オーディオを初期化
});

// 各ボタンにイベントリスナーを追加
document.getElementById('startButton').addEventListener('click', function() {
    if (!isAudioUnlocked) {
        unlockAudio();
    }
    startTimer();
});
document.getElementById('stopButton').addEventListener('click', stopTimer);
document.getElementById('resetButton').addEventListener('click', resetTimer);
document.getElementById('setTimerButton').addEventListener('click', setTimer);

function unlockAudio() {
    document.querySelectorAll('audio').forEach(audio => {
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
        }).catch(() => {});
    });
    isAudioUnlocked = true;
}

function initializeAudio() {
    document.querySelectorAll('audio').forEach(audio => {
        audio.load();
    });
}

function updateDisplay() {
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    document.getElementById('timerDisplay').textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function startTimer() {
    if (!timer) {
        timer = setInterval(timerFunction, 1000);
    }
}

function timerFunction() {
    if (seconds > 0) {
        seconds--;
        updateDisplay();
        checkAlerts();
    } else {
        stopTimer();
        playSound('finalAlertSound');
    }
}

function stopTimer() {
    clearInterval(timer);
    timer = null;
}

function resetTimer() {
    stopTimer();
    seconds = 0;
    updateDisplay();
    resetAlertChecks();
}

function setTimer() {
    let minutes = parseInt(document.getElementById('minutesInput').value);
    if (!isNaN(minutes) && minutes > 0) {
        seconds = minutes * 60;
        updateDisplay();
        setAlertChecks(minutes); // 中間アラームチェックボックスを自動で設定
    }
}

function setAlertChecks(minutes) {
    document.getElementById('alert1min').checked = minutes >= 1;
    document.getElementById('alert5min').checked = minutes >= 5;
    document.getElementById('alert10min').checked = minutes >= 10;
    document.getElementById('alert15min').checked = minutes >= 15;
}

function checkAlerts() {
    if (document.getElementById('alert1min').checked && seconds === 60) {
        playSound('alert1minSound');
    }
    if (document.getElementById('alert5min').checked && seconds === 5 * 60) {
        playSound('alert5minSound');
    }
    if (document.getElementById('alert10min').checked && seconds === 10 * 60) {
        playSound('alert10minSound');
    }
    if (document.getElementById('alert15min').checked && seconds === 15 * 60) {
        playSound('alert15minSound');
    }
}

function playSound(soundId) {
    if (isAudioUnlocked) {
        const sound = document.getElementById(soundId);
        sound.play();
    }
}

function resetAlertChecks() {
    document.getElementById('alert1min').checked = false;
    document.getElementById('alert5min').checked = false;
    document.getElementById('alert10min').checked = false;
    document.getElementById('alert15min').checked = false;
}
