
// Installe l'option "Rechercher ... sur alloine.fr" dans le context menu.
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'searchonallocine',
    title: 'Rechercher "%s" sur allocine.fr',
    contexts: ['selection']
  });
});

// Ajoute la fonction pour l'option du context menu "Rechercher ... sur alloine.fr".
chrome.contextMenus.onClicked.addListener(function(info) {
  if (info.menuItemId == "searchonallocine") {
    createTab("?q=" + info.selectionText)
  }
});

// Ajoute la fonction de recherche avec le keyword "ac"
chrome.omnibox.onInputEntered.addListener((text) => {
  var newURL = 'https://www.allocine.fr/recherche/?q=' + encodeURIComponent(text);
  chrome.tabs.update({ url: newURL });
});

// Execute la fonction de recherche avec l'onglet actif quand le boutton de l'extension est clické
chrome.browserAction.onClicked.addListener(function() {
	chrome.tabs.query({
		currentWindow: true,
		active: true
	}, function(tab) {
    searchQueryPath(tab);
  });
});


// Fonction de recherche de la query pour la recherche allocine.fr
function searchQueryPath(tab){
  var code = getCode(new URL(tab[0].url).hostname)

  // Recherche le titre en fonction de la classname, creer la query puis execute la fonction de creation de l'onglet
  if(code){
    chrome.tabs.executeScript(tab[0].id, {
      "code" : code
    }, 
    function(result){
      if (result[0]){
        var qpath = "?q=" + result[0];
        createTab(qpath);
      } else { createTab(undefined); }
    })
  } else { createTab(undefined); }
}

//Recupere le nom de la classe contenant le titre selon le domaine
function getCode(hostname){
  if(hostname == "www.canalplus.com" || hostname == "canalplus.com") {
    return "document.getElementsByClassName('bodyTitle___DZEtt')[0].innerText;"
  } 
  else if(hostname == "www.disneyplus.com" || hostname == "disneyplus.com") {
    return "document.getElementsByClassName('sc-eerKOB')[0].firstChild.alt;"
  } 
  else if(hostname == "www.netflix.com" || hostname == "netflix.com") {
    return "document.getElementsByClassName('previewModal--player-titleTreatment-logo')[0].title;"
  }
  else if(hostname == "go.ocs.fr") {
    return "document.getElementsByClassName('title')[1].innerText;"
  }  
  else if(hostname == "www.hbo.com" || hostname == "hbo.com") {
    return "document.getElementsByClassName('modules/InfoSlice--assetTitle')[0].innerText;"
  }  
  else if(hostname == "www.primevideo.com" || hostname == "primevideo.com") {
    return "document.getElementsByClassName('_2Q73m9')[0].innerText;"
  }  
  else if(hostname == "tv.apple.com") {
    return "document.getElementsByClassName('review-card__title typ-headline-emph')[0].firstElementChild.innerText"
  }  
  else if(hostname == "www.imdb.com") {
    var reg = /\(([^)]+)\)/
    return "document.getElementsByClassName('title_wrapper')[0].children[0].textContent.replaceAll('  ', '').replace("+reg+", '')"
  }  
  else { return undefined; }
}

// Si il y a une query, creer un onglet avec la recherche allocine.fr sinon creer une alerte d'erreur
function createTab(qpath){
  if(qpath) {
    chrome.tabs.create({
      'url': 'https://www.allocine.fr/recherche/' + qpath
    });
  }
  else { 
    chrome.notifications.create({   
      type: 'basic', 
      iconUrl: 'allocine.png', 
      title: "Erreur", 
      message: "Impossible de rechercher ce contenu !",
      })
  }
}
