const modes = [
  {
    display: "Schüler",
    url:
      "https://portal.office.com?login_hint={ami}%40schueler.kinzig-schule.de",
    color: "#3498db",
  },
  {
    display: "Lehrer",
    url: "https://portal.office.com?login_hint={ami}%40kinzig-schule.de",
    color: "#e74c3c",
  },
];

let mode = modes[0]; // Schüler by default
{
  let req = String(window.location);
  if (req.toLowerCase().endsWith("/")) {
    req = req.substring(0, req.length - 1);
  }
  if (req.toLowerCase().endsWith("lehrer")) {
    mode = modes[1];
  }
}

// Update header
{
  const subheader = document.getElementById("modeheader");
  subheader.innerHTML = mode.display;
  subheader.style = "color: " + mode.color + ";";
}

// Ask after .25s
setTimeout(() => {
  let firstname = "";

  // Ask for first name
  while (true) {
    firstname = prompt("Vorname");
    if (firstname == null) {
      const placeholder = document.getElementById("ph");
      placeholder.innerHTML = '<img src="/assets/187.gif"></img>';

      // auto refresh after 4s
      setTimeout(() => {
        window.location.reload();
      }, 4000);

      return;
    }

    firstname = firstname.trim().toLowerCase();

    // replace umlauts

    // format first- and lastname
    if (firstname.length == 0) {
      alert("Vorname benötigt!");
    } else {
      break;
    }
  }
  firstname = firstname
    .replace(" ", "-")
    .replace("ä", "ae")
    .replace("ö", "oe")
    .replace("ü", "ue");

  // Ask for last name
  let lastname = prompt("Nachname").trim().toLowerCase();

  let ami = firstname;

  if (lastname.length != 0) {
    lastname = lastname
      .replace(" ", "-")
      .replace("ä", "ae")
      .replace("ö", "oe")
      .replace("ü", "ue");

    ami += "." + lastname;
  }

  // redirect to `ami`
  window.location = mode.url.replace("{ami}", ami);
}, 250);
