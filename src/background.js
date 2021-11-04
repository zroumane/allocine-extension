// "Rechercher ... sur Allociné.fr" context menu option
browser.contextMenus.create({
  id: "searchonallocine",
  title: 'Rechercher "%s" sur Allociné',
  contexts: ["selection"],
});
browser.contextMenus.onClicked.addListener(function (info) {
  if (info.menuItemId == "searchonallocine") {
    var url = "https://www.allocine.fr/rechercher/?q=" + encodeURIComponent(info.selectionText);
    browser.tabs.create({ url: url });
    return;
  }
});

// Allocine.fr search engine (keyword "ac")
browser.omnibox.onInputEntered.addListener((text) => {
  var url = "https://www.allocine.fr/rechercher/?q=" + encodeURIComponent(text);
  browser.tabs.update({ url: url });
});

// Search on allocine.fr on icon click
fetch(browser.runtime.getURL("./host.json"))
  .then((data) => data.json())
  .then((data) => (hosts = data));
browser.browserAction.onClicked.addListener(function (tab) {
  const url = new URL(tab.url);
  const match = hosts.find(
    (h) => h.host === url.hostname.replace("www.", "") && (h.path ? url.pathname.includes(h.path) : true)
  );
  if (match) {
    browser.tabs
      .executeScript({ code: "document.querySelectorAll" + match.code })
      .then((result) => {
        console.log(result);
        if (result) browser.tabs.create({ url: "https://www.allocine.fr/rechercher/?q=" + encodeURIComponent(result) });
        else return Promise.reject();
      })
      .catch((e) => showError(tab.id));
  } else showError(tab.id);
});

// Error notification
const showError = () => {
  browser.tabs
    .executeScript({
      file: "contentScript.js",
      allFrames: true,
    })
    .catch((e) => console.log(e));
  browser.tabs.insertCSS({ file: "notification.css" }).catch((e) => console.log(e));
};
