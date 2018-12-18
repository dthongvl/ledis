function appendOuput(value) {
    var ul = document.getElementById("output");
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(value));
    ul.appendChild(li);
}

function sendCommand(cmd) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            appendOuput(this.responseText);
        }
    }
    request.open("POST", "/", true);
    request.send(cmd);
}

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        var input = document.getElementById("cmd");
        input.addEventListener("keyup", function (event) {
            event.preventDefault();
            if (event.keyCode == 13) {
                var cmd = input.value;
                if (cmd === "") {
                    return;
                }
                appendOuput("ledis> " + cmd);
                input.value = "";

                sendCommand(cmd);
            }
        });
    }
};


