let mode = document.getElementById("color-mode");
let isChecked = sessionStorage.getItem("isChecked");

if (isChecked === "true") {
    mode.checked = true;
}

if (mode.checked) {
    changeMode();
}

mode.addEventListener("change", function() {
    changeMode();
});

function changeMode() {
    if (mode.checked) {
        sessionStorage.setItem("isChecked", true);
    } else {
        sessionStorage.setItem("isChecked", false);
    }
    document.body.classList.toggle("dark-mode");
    document.getElementById("footer").classList.toggle("dark-mode-footer");
    try {
        document.getElementById("back").classList.toggle("dark-mode-back");
    } catch {}
    let keyboardKeys = document.getElementsByClassName("keyboard-button");
    for (let i = 0; i < keyboardKeys.length; i++) {
        keyboardKeys[i].classList.toggle("dark-mode-keyboard-button");
    }
}
