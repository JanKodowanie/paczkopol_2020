var re1 = new RegExp("[A-Z{ĄĆĘŁŃÓŚŹŻ}][a-z{ąćęłńóśźż}]+")
var re2 = new RegExp(".{8,}")
var re3 = new RegExp("[a-z]{3,12}")
var re4 = new RegExp("^.*\.(jpg|png)")
var firstNameMessage = "Podaj poprawne imię"
var lastNameMessage = "Podaj poprawne nazwisko"
var loginMessage = "Podaj od 3 do 12 małych liter"
var passwordMessage = "Podaj min. 8 znaków"
var password2Message = "Hasła muszą się zgadzać"
var photoMessage = "Załącz plik jpg lub png"

var fieldState = {
    "firstname": false,
    "lastname": false,
    "login": false,
    "password": false,
    "password2": false,
    "photo": false
}

window.onload = function () {
    document.getElementById("firstname").addEventListener("change", validateFirstName)
    document.getElementById("lastname").addEventListener("change", validateLastName)
    document.getElementById("login").addEventListener("input", validateLogin)
    document.getElementById("password").addEventListener("change", validatePassword)
    document.getElementById("password2").addEventListener("change", validatePassword2)
    document.getElementById("photo").addEventListener("change", validatePhoto)
    document.getElementById("regform").addEventListener("submit", onSubmitData)
}

validateFirstName = function () {
    var firstname = document.getElementById("firstname").value
    var errorMsg = document.getElementById("firstname-error")

    if (re1.test(firstname)) {
        fieldState['firstname'] = true
        errorMsg.className = "error-mes-hidden"
        errorMsg.innerText = ""
    } else {
        fieldState['firstname'] = false
        errorMsg.className = "error-mes"
        errorMsg.innerText = firstNameMessage
    }
}

validateLastName = function () {
    var lastname = document.getElementById("lastname").value
    var errorMsg = document.getElementById("lastname-error")

    if (re1.test(lastname)) {
        fieldState['lastname'] = true
        errorMsg.className = "error-mes-hidden"
        errorMsg.innerText = ""
    } else {
        fieldState['lastname'] = false
        errorMsg.className = "error-mes"
        errorMsg.innerText = lastNameMessage
    }
}

validateLogin = function () {
    var login = document.getElementById("login").value
    var errorMsg = document.getElementById("login-error")

    if (re3.test(login)) {
        var xhr = new XMLHttpRequest()
        xhr.open("GET", "https://infinite-hamlet-29399.herokuapp.com/check/" + login)
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    if (JSON.parse(xhr.response)[login] == "available") {
                        errorMsg.className = "error-mes-hidden"
                        errorMsg.innerText = ""
                        fieldState['login'] = true
                    }
                    else {
                        loginMessage = "Login zajęty"
                        fieldState['login'] = false
                        errorMsg.className = "error-mes"
                        errorMsg.innerText = loginMessage
                    }
                }
            }
        }
        xhr.send()
    } else {
        loginMessage = "Podaj od 3 do 12 małych liter"
        fieldState['login'] = false
        errorMsg.className = "error-mes"
        errorMsg.innerText = loginMessage
    }
}

validatePassword = function () {
    var password = document.getElementById("password").value
    var errorMsg = document.getElementById("password-error")

    if (re2.test(password)) {
        fieldState['password'] = true
        errorMsg.className = "error-mes-hidden"
        errorMsg.innerText = ""
    } else {
        fieldState['password'] = false
        errorMsg.className = "error-mes"
        errorMsg.innerText = passwordMessage
    }
}

validatePassword2 = function () {
    var password = document.getElementById("password").value
    var password2 = document.getElementById("password2").value
    var errorMsg = document.getElementById("password2-error")

    if (password !== "" && password !== password2) {
        fieldState['password2'] = false
        errorMsg.className = "error-mes"
        errorMsg.innerText = password2Message
    } else if (password !== "") {
        fieldState['password2'] = true
        errorMsg.className = "error-mes-hidden"
        errorMsg.innerText = ""
    }
}

validatePhoto = function () {
    var photoName = document.getElementById("photo")
    var errorMsg = document.getElementById("photo-error")

    if (photoName.value !== "" && !(re4.test(photoName))) {
        fieldState['photo'] = false
        errorMsg.className = "error-mes"
        errorMsg.innerText = photoMessage
    }
    else if (photoName.value !== "") {
        fieldState['password2'] = true
        errorMsg.className = "error-mes-hidden"
        errorMsg.innerText = ""
    }
}

onSubmitData = function (e) {
    var valid = true;

    if (!fieldState["firstname"]) {
        valid = false
        var errorMsg = document.getElementById("firstname-error")
        errorMsg.className = "error-mes"
        errorMsg.innerText = firstNameMessage
    }
    if (!fieldState["lastname"]) {
        valid = false
        var errorMsg = document.getElementById("lastname-error")
        errorMsg.className = "error-mes"
        errorMsg.innerText = lastNameMessage
    }
    if (!fieldState["login"]) {
        valid = false
        var errorMsg = document.getElementById("login-error")
        errorMsg.className = "error-mes"
        errorMsg.innerText = loginMessage
    }
    if (!fieldState["password"]) {
        valid = false
        var errorMsg = document.getElementById("password-error")
        errorMsg.className = "error-mes"
        errorMsg.innerText = passwordMessage
    }
    if (!fieldState["password2"]) {
        valid = false
        var errorMsg = document.getElementById("password2-error")
        errorMsg.className = "error-mes"
        errorMsg.innerText = password2Message
    }
    if (!fieldState["photo"]) {
        valid = false
        var errorMsg = document.getElementById("photo-error")
        errorMsg.className = "error-mes"
        errorMsg.innerText = photoMessage
    }

    if (!valid) {
        e.preventDefault()
    }    
}