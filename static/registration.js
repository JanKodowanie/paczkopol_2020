var nameReg = new RegExp("^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+$")
var passReg = new RegExp(".{8,}")
var loginReg = new RegExp("[a-z]{3,12}")
var addressReg = new RegExp("^[0-9a-zA-ZĄĆĘŁŃÓŚŹŻąćęłńóśźż]+[\\s\\-\\,]{0,}$")
var firstNameMessage = "Podaj poprawne imię"
var lastNameMessage = "Podaj poprawne nazwisko"
var loginMessage = "Login: podaj od 3 do 12 małych liter"
var passwordMessage = "Hasło: podaj min. 8 znaków"
var password2Message = "Hasła muszą się zgadzać"
var addressMessage = "Podaj poprawny adres"

var fieldState = {
    "firstname": false,
    "lastname": false,
    "login": false,
    "password": false,
    "password2": false,
    "address": false
}

window.onload = function () {
    document.getElementById("firstname").addEventListener("change", validateFirstName)
    document.getElementById("lastname").addEventListener("change", validateLastName)
    document.getElementById("login").addEventListener("input", validateLogin)
    document.getElementById("password").addEventListener("change", validatePassword)
    document.getElementById("password2").addEventListener("change", validatePassword2)
    document.getElementById("address").addEventListener("change", validateAddress)
    document.getElementById("regform").addEventListener("submit", onSubmitData)
}

validateFirstName = function () {
    var firstname = document.getElementById("firstname").value
    var errorMsg = document.getElementById("firstname-error")

    if (nameReg.test(firstname)) {
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

    if (nameReg.test(lastname)) {
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

    if (loginReg.test(login)) {
        var xhr = new XMLHttpRequest()
        xhr.open("GET", "/sender/register/check-login/" + login)
        xhr.onreadystatechange = function () {
            console.log(xhr)
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    if (JSON.parse(xhr.response)["available"] === true) {
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
        loginMessage = "Login: podaj od 3 do 12 małych liter"
        fieldState['login'] = false
        errorMsg.className = "error-mes"
        errorMsg.innerText = loginMessage
    }
}

validatePassword = function () {
    var password = document.getElementById("password").value
    var errorMsg = document.getElementById("password-error")

    if (passReg.test(password)) {
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

validateAddress = function () {
    var address = document.getElementById("address").value
    var errorMsg = document.getElementById("address-error")

    if (addressReg.test(address)) {
        fieldState['address'] = true
        errorMsg.className = "error-mes-hidden"
        errorMsg.innerText = ""
    } else {
        fieldState['address'] = false
        errorMsg.className = "error-mes"
        errorMsg.innerText = addressMessage
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
    if (!fieldState["address"]) {
        valid = false
        var errorMsg = document.getElementById("address-error")
        errorMsg.className = "error-mes"
        errorMsg.innerText = addressMessage
    }

    if (!valid) {
        e.preventDefault()
    }    
}