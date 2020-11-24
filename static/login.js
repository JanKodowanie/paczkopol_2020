var valueReg = new RegExp(".{1,}")
var errorMsg = null
var loginForm = null

window.onload = function () {
    loginForm = document.getElementById("loginform")
    loginForm.addEventListener("submit", onSubmitData)
    errorMsg = document.getElementById("signin-error")
}

validateFields = function () {
    var login = document.getElementById("login").value
    var password = document.getElementById("password").value

    result = true
    if (!valueReg.test(login) || !valueReg.test(password)) {
        errorMsg.className = "error-mes"
        errorMsg.innerText = "Oba pola muszą być wypełnione!"
        result = false
    } else {
        errorMsg.className = "error-mes-hidden"
        errorMsg.innerText = ""
    }

    return result
}

onSubmitData = async function (e) {
    e.preventDefault()
    if (validateFields()) {
        let data = new FormData(loginForm)
        await fetch('/sender/login', {method: 'POST', body: data}).then((response) => {
            if (response.status == 400) {
                errorMsg.className = "error-mes"
                errorMsg.innerText = "Błędne dane logowania!"
                result = false
            } else {
                window.location.href = response.url;
            }
        })
    }
}