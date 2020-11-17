/*
 ---------------------------------------
 * Original source:
 ? https://github.com/darmiel/easy-login
 ----------------------------------------
 */

//
let path: string = window.location.pathname;
while (path.endsWith("/")) {
  path = path.substring(0, path.length - 1);
}
if (path.includes("/")) {
  path = path.substring(path.lastIndexOf("/") + 1);
}
path = path.trim();
if (path.length == 0) {
  path = "kss-schueler";
}
//

function redirectAfterDelay(url: string, delay: number = 1000): void {
  if (delay > 0) {
    setTimeout(() => {
      window.location.href = url;
    }, delay);
  } else {
    window.location.href = url;
  }
}

setTimeout(async () => {
  let first: string | null;

  while (true) {
    first = prompt("Vorname (oder *Alias)");

    // If no first name specified, display gif
    if (first == null) {
      const placeholder: HTMLElement =
        document.getElementById("ph") || new HTMLElement();
      placeholder.innerHTML = '<img src="/assets/187.gif"></img>';

      // auto refresh after 4s
      setTimeout(() => {
        window.location.reload();
      }, 4000);

      return;
    }

    // check if alias
    if (first.startsWith("*")) {
      const aliasRes: any = await fetch(
        `/login?first=${encodeURI(first)}`
      ).then((data) => {
        return data.json();
      });
      if (aliasRes.error) {
        alert("Error | " + aliasRes.message);
        continue;
      }
      if (!aliasRes.loginUrl) {
        alert("Error | Alias nicht gefunden (2)");
        continue;
      }

      // alias probably found.
      const el: HTMLElement =
        document.getElementById("ph") || new HTMLElement();

      const alias = aliasRes.alias.alias;

      el.innerHTML = `<p>Hallo, ${alias.first} ${alias.last}!</p> <pre>${alias.mode}</pre>`;

      const hd: HTMLElement =
        document.getElementById("header") || new HTMLElement();

      hd.innerHTML = "";
      redirectAfterDelay(aliasRes.loginUrl, 3000);
      return;
    }

    // not an alias
    if (first.length == 0) {
      alert("Vorname (oder *Alias) benötigt!");
    } else {
      break;
    }
  }

  const last: string = prompt("Nachname") || "";

  const loginRes: any = await fetch(
    `/login?first=${encodeURI(first)}&last=${encodeURI(last)}&type=${path}`
  ).then((data) => {
    return data.json();
  });

  if (loginRes.error) {
    alert("Error | " + loginRes.message);
    return;
  }

  if (!loginRes.loginUrl) {
    alert("Error | Login-URL nicht gefunden (3)");
    return;
  }

  redirectAfterDelay(loginRes.loginUrl, 0);
}, 250);