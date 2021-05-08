var initFlg = false;

function handleChatForm() {
    if (!initFlg) {
        document.getElementById('btnOpenChatWindow').innerHTML = 'Connecting...';
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:2001/setUname", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        try {
            xhr.onreadystatechange = function() {
                if(xhr.readyState === XMLHttpRequest.DONE) {
                    var status = xhr.status;
                    if (status === 200) {
                        // Username was sent successfully
                        var chatIframe = document.createElement('iframe');
                        chatIframe.setAttribute('class', 'form-container');
                        document.getElementById('myForm').appendChild(chatIframe);
                        chatIframe.setAttribute('src', "http://localhost:2001/connect");

                        initFlg = true;
                        document.getElementById("myForm").style.display = 'block';
                        document.getElementById('btnOpenChatWindow').innerHTML = 'Close Chat';
                    }
                    else {
                        alert('There was a problem with the chat server! Please try again in sometime!');
                        document.getElementById("myForm").style.display = 'none';
                        document.getElementById('btnOpenChatWindow').innerHTML = 'Close Chat';
                        document.getElementById('btnOpenChatWindow').style.display = 'none';
                    }
                }

            };
            xhr.send(JSON.stringify({'currentUname' : localStorage.getItem('userFullName') + " (" + localStorage.getItem('currentUname') + ")" }));
        } catch(err) {
            alert('There was a problem with the chat server! Please try again in sometime!');
            document.getElementById("myForm").style.display = 'none';
                            document.getElementById('btnOpenChatWindow').innerHTML = 'Close Chat';
                            document.getElementById('btnOpenChatWindow').style.display = 'none';
        }
    }
    else {
        if (document.getElementById("myForm").style.display == 'none') {
            document.getElementById("myForm").style.display = 'block';
            document.getElementById('btnOpenChatWindow').innerHTML = 'Close Chat';
        }
        else {
            document.getElementById("myForm").style.display = 'none';
            document.getElementById('btnOpenChatWindow').innerHTML = 'Open Chat';
        }
    }
}