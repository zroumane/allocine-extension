function showNotif() {
  if (document.getElementById("allocine-notification") === null) {
    var alloNotifArea = document.createElement("DIV");
    alloNotifArea.setAttribute("id", "allocine-notification");
    document.body.append(alloNotifArea);
  }

  var alloNotifImg = document.createElement("IMG");
  alloNotifImg.classList.add("alloNotif-img");
  alloNotifImg.setAttribute("src", "https://assets.allocine.fr/favicon/allocine.ico");

  var alloNotifContent = document.createElement("DIV");
  alloNotifContent.classList.add("alloNotif-content");
  alloNotifContent.innerText = "Impossible de rechercher ce contenu !";

  var alloNotifClose = document.createElement("DIV");
  alloNotifClose.classList.add("alloNotif-close");
  alloNotifClose.innerText = "✖";

  var alloNotifBox = document.createElement("DIV");
  alloNotifBox.classList.add("alloNotif-box");
  alloNotifBox.appendChild(alloNotifImg);
  alloNotifBox.appendChild(alloNotifContent);
  alloNotifBox.appendChild(alloNotifClose);

  document.getElementById("allocine-notification").appendChild(alloNotifBox);

  var alloNotifTimeout = window.setTimeout(() => {
    hideNotif(alloNotifBox, alloNotifTimeout);
  }, 3000);

  alloNotifClose.addEventListener("click", (evt) => {
    evt.preventDefault();
    if (alloNotifBox.classList.contains("alloNotif-box-hide")) return;
    hideNotif(alloNotifBox, alloNotifTimeout);
  });
}

function hideNotif(alloNotifBox, alloNotifTimeout) {
  if (alloNotifBox !== null) alloNotifBox.classList.add("alloNotif-box-hide");
  alloNotifBox.addEventListener("transitionend", () => {
    if (alloNotifBox !== null) {
      alloNotifBox.parentNode?.removeChild(alloNotifBox);
      window.clearTimeout(alloNotifTimeout);
    }
  });
}

showNotif();
