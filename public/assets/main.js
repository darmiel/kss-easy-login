"use strict";
/*
 ---------------------------------------
 * Original source:
 ? https://github.com/darmiel/easy-login
 ----------------------------------------
 */
/**
 * Array of all available modes
 */
var modes = [
    {
        display: "Schüler",
        url: "https://portal.office.com?login_hint={ami}%40schueler.kinzig-schule.de",
        color: "#3498db",
    },
    {
        display: "Lehrer",
        url: "https://portal.office.com?login_hint={ami}%40kinzig-schule.de",
        color: "#e74c3c",
    },
];
var mode = modes[0]; // Schüler by default
// get mode by path
{
    var path = window.location.pathname;
    if (path.toLowerCase().endsWith("/")) {
        path = path.substring(0, path.length - 1);
    }
    for (var i = 0; i < modes.length; i++) {
        var m = modes[i];
        if (m.display.toLowerCase() == path) {
            mode = m;
            break;
        }
    }
}
var replacementMap = {
    " ": "-",
    ü: "ue",
    ö: "oe",
    ä: "ae",
    ß: "ss",
};
/**
 * Formats a string:
 * Lowercase, trim and umlauts [ä -> ae, ü -> ue, ß -> ss, ...]
 * @param str Input string
 */
function formatString(str) {
    str = str.toLowerCase().trim();
    for (var key in Object.keys(replacementMap)) {
        str = str.replace(key, replacementMap[key]);
    }
    return str;
}
// Update header
{
    var subheader = document.getElementById("modeheader") || new HTMLElement();
    subheader.innerHTML = mode.display;
    subheader.style.color = mode.color;
}
// Ask after .25s
setTimeout(function () {
    var firstname = "";
    // Ask for first name
    while (true) {
        firstname = prompt("Vorname");
        // If no first name specified, display gif
        if (firstname == null) {
            var placeholder = document.getElementById("ph") || new HTMLElement();
            placeholder.innerHTML = '<img src="/assets/187.gif"></img>';
            // auto refresh after 4s
            setTimeout(function () {
                window.location.reload();
            }, 4000);
            return;
        }
        firstname = formatString(firstname);
        // format first- and lastname
        if (firstname.length == 0) {
            alert("Vorname benötigt!");
        }
        else {
            break;
        }
    }
    // Create AMI String
    var ami = firstname;
    // Ask for last name
    var lastname = prompt("Nachname");
    if (lastname != null && lastname.length > 0) {
        lastname = formatString(lastname);
        ami += "." + lastname;
    }
    var url = mode.url;
    // replace AMI in url
    url = url.replace("{ami}", ami);
    // redirect to `ami`
    window.location.href = url;
}, 250);
