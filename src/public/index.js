function appendOutput(value) {
    var ul = document.getElementById("output");
    var li = document.createElement("li");
    
    li.append(value);
    ul.append(li);
}

function appendOutputWithName(value) {
    var span = document.createElement("span");
    span.setAttribute("class", "ledis");
    span.append("ledis>");

    var ul = document.getElementById("output");
    var li = document.createElement("li");
    
    li.append(span);
    li.append(value);
    ul.append(li);
}

function sendCommand(cmd) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            appendOutput(this.responseText);
        }
    }
    request.open("POST", "/", true);
    request.send(cmd);
}

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        var input = document.getElementById("cmd");
        input.focus();
        input.addEventListener("keyup", function (event) {
            event.preventDefault();
            if (event.keyCode == 13) {
                var cmd = input.value;
                if (cmd === "") {
                    return;
                }

                appendOutputWithName(cmd);
                input.value = "";

                sendCommand(cmd);
            }
        });
    }
};


