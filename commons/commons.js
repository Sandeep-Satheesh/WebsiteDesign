function handleLogout() {
    var x = document.getElementById('loginHyp');
    if (x.innerHTML == "Sign Out") {
        updateLogout(x);
    }
    else {
        window.open('../loginpage/login_page.html', '_self');
    }
}

function sendDataToServer(serverUrl, data, sendMethod, onSuccessCallback, onErrorCallback, onFailureCallback) {
    var xhr = new XMLHttpRequest();
    xhr.open(sendMethod, serverUrl, true);
    try {
        xhr.onreadystatechange = function() {
            if(xhr.readyState === XMLHttpRequest.DONE) {
                var status = xhr.status;
                if (status === 200) {
                    // Success
                    try {
                        onSuccessCallback();
                    } catch (err) {
                        onErrorCallback();
                    }
                }
                else {
                    onFailureCallback();
                }
            }

        };
        xhr.send(data);
    } catch (err) {
        onFailureCallback();
    }
}

function fetchResultFromServer(serverUrl, data, sendMethod, handlerCallback) {
    var xhr = new XMLHttpRequest();
    xhr.open(sendMethod, serverUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json")
    try {
        xhr.onreadystatechange = function() {
            if(xhr.readyState === XMLHttpRequest.DONE) {
                var status = xhr.status;
                handlerCallback(status, xhr.responseText);
            }

        };
        xhr.send(data);
    } catch (err) {
        onFailureCallback();
    }
}

function updateLogout(x) {
    localStorage.setItem('currentUname', "null");                
    sessionStorage.setItem('userLoggedIn', "false");
    localStorage.setItem('rememberUser', "false");
    location.reload();
}

function systemIsInDarkMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function userIsSignedIn() {
    return (sessionStorage.getItem('userLoggedIn') == 'true');
}