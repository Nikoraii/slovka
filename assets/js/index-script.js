let play = document.getElementsByClassName("play-link");
for (let i = 0; i < play.length; i++) {
    play[i].addEventListener("click", function(e) {
        let playId = play[i].id;
        let wordLength;
        if (playId === "play") {
            wordLength = Math.floor(Math.random() * (8 - 5 + 1) + 5);
        } else {
            wordLength = playId.slice(-1);
        }
        console.log(wordLength);
        localStorage.setItem("length", Number(wordLength));
    })
}