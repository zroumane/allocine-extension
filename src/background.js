// "Rechercher ... sur Allociné.fr" context menu option
browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: 'searchonallocine',
    title: 'Rechercher "%s" sur Allociné.fr',
    contexts: ['selection']
  });
  browser.contextMenus.onClicked.addListener(function(info) {
    if (info.menuItemId == "searchonallocine") {
      var url = 'https://www.allocine.fr/rechercher/?q=' + encodeURIComponent(info.selectionText)
      browser.tabs.create({ 'url': url}); return
    }
  });
});


// Allocine.fr search engine (keyword "ac")
browser.omnibox.onInputEntered.addListener((text) => {
  var url = 'https://www.allocine.fr/rechercher/?q=' + encodeURIComponent(text);
  browser.tabs.update({ url: url });
});


// Search on allocine.fr on icon click 
fetch(browser.runtime.getURL('./host.json')).then(data => data.json()).then(data => hosts = data)
browser.browserAction.onClicked.addListener(function() {
  browser.tabs.query({currentWindow: true, active: true})
    .then(tabs => {
      var hostname = new URL(tabs[0].url).hostname.replace('www.', '')
      var match = hosts.filter(h => h.hostname === hostname)[0]
      if(match){
        var code = "document.querySelectorAll" + match.code
        browser.tabs.executeScript(tabs[0].id, {"code" : code})
        .then(result => {
          if (result[0]){
            var url = 'https://www.allocine.fr/rechercher/?q=' + encodeURIComponent(result[0])
            browser.tabs.create({'url': url}); return
          } else return Promise.reject();
        })
        .catch(e => showError())
      } 
      else showError()
    }
  )
});


// Error notification
function showError() {
  browser.notifications.create({
    type: "basic",
    iconUrl: "icon/allocine_128.png",
    title: "Erreur !",
    message: "Impossible de rechercher ce contenu sur Allociné.fr",
    priority: 2
  });
}