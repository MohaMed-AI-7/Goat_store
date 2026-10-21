let buttons = document.querySelectorAll(".switch button");
let slider = document.querySelector(".slider");

for (let i = 0; i < buttons.length; i++) {

    buttons[i].onclick = function () {

        
        slider.style.left = this.offsetLeft + "px";
        slider.innerHTML = this.innerHTML;

    };

}

const backLogin = document.querySelector(".back-icon");

backLogin.onclick = function() {
    location.href = "../login/login.html";
}
