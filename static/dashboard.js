var valueReg = new RegExp("[\\w]+[\\w\\s\\-]{0,}")
var errorMsg = null
var parcelForm = null

window.onload = function () {
    parcelForm = document.getElementById("parcel-add-form")
    parcelForm.addEventListener("submit", onSubmitData)
    errorMsg = document.getElementById("parcel-add-error")
}

validateFields = function () {
    var recipient = document.getElementById("recipient").value
    var deposit = document.getElementById("deposit").value

    result = true
    if (!valueReg.test(recipient) || !valueReg.test(deposit)) {
        errorMsg.className = "error-mes"
        errorMsg.innerHTML = "Wszystkie pola muszą być wypełnione! \
            <br>Dozwolone są litery, cyfry, spacje, -, _"
        result = false
    } else {
        errorMsg.className = "error-mes-hidden"
        errorMsg.innerText = ""
    }

    return result
}

onSubmitData = function (e) {
    if (!validateFields()) {
        e.preventDefault()
    }
}