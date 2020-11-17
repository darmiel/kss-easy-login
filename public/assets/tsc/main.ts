/*
 ---------------------------------------
 * Original source:
 ? https://github.com/darmiel/easy-login
 ----------------------------------------
 */

interface Mode {
  display: string;
  url: string;
  color: string;
}

/**
 * Array of all available modes
 */
const modes: Array<Mode> = [
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

let mode: Mode = modes[0]; // Schüler by default

// get mode by path
{
  let path: string = window.location.pathname;
  if (path.toLowerCase().endsWith("/")) {
    path = path.substring(0, path.length - 1);
  }
  for (let i: number = 0; i < modes.length; i++) {
    let m: Mode = modes[i];
    if (m.display.toLowerCase() == path) {
      mode = m;
      break;
    }
  }
}

const replacementMap: any = {
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
function formatString(str: string): string {
  str = str.toLowerCase().trim();
  for (const key in Object.keys(replacementMap)) {
    str = str.replace(key, replacementMap[key]);
  }
  return str;
}

// Update header
{
  const subheader: HTMLElement =
    document.getElementById("modeheader") || new HTMLElement();
  subheader.innerHTML = mode.display;
  subheader.style.color = mode.color;
}

// Ask after .25s
setTimeout(() => {
  let firstname: string | null = "";

  // Ask for first name
  while (true) {
    firstname = prompt("Vorname");

    // If no first name specified, display gif
    if (firstname == null) {
      const placeholder: HTMLElement =
        document.getElementById("ph") || new HTMLElement();
      placeholder.innerHTML = '<img src="/assets/187.gif"></img>';

      // auto refresh after 4s
      setTimeout(() => {
        window.location.reload();
      }, 4000);

      return;
    }

    firstname = formatString(firstname);

    // format first- and lastname
    if (firstname.length == 0) {
      alert("Vorname benötigt!");
    } else {
      break;
    }
  }

  // Create AMI String
  let ami: string = firstname;

  // Ask for last name
  let lastname: string | null = prompt("Nachname");
  if (lastname != null && lastname.length > 0) {
    lastname = formatString(lastname);
    ami += "." + lastname;
  }

  let url: string = mode.url;
  // replace AMI in url
  url = url.replace("{ami}", ami);

  // redirect to `ami`
  window.location.href = url;
}, 250);
