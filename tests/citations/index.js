window.solirom = {};
solirom.file = {};
solirom.events = {};
solirom.actions = {};
solirom.dataInstances = {};

solirom.dataInstances.uuid = "";
    
solirom.events.fileSave = new CustomEvent("fileSave");
solirom.events.selectResultItem = new CustomEvent("kuberam.search.result.webc-select.item");

document.addEventListener("fileSave", event => {
    document.querySelector("#save-button").disabled = true;
    document.querySelector("#search-button").click();
}, false);
document.addEventListener("kuberam.search.result.webc-select.item", event => {

}, false);
document.addEventListener('kuberam.loginElement.events.login', event => {
    document.querySelector("#search-button").click();
});
document.addEventListener('kuberam.loginElement.events.logout', event => {
    document.querySelector("#search-result").innerHTML = "";
    document.querySelector("#entries-counter").value = 0;
});
document.addEventListener("teian-file-opened", event => {
    document.querySelector("#delete-button").disabled = false;
    document.querySelector("#duplicate-button").disabled = false;
    document.querySelector("#history-button").disabled = false;
});
document.addEventListener("teian-file-edited", event => {
    document.querySelector("#save-button").disabled = false;
}, false);


document.querySelector("#search-button").addEventListener("click", function() {
    const username = document.querySelector("kuberam-login-element").username;
    
    if (username === "") {
        return;
    }
    
    const searchDiv = document.querySelector("#search-result");
    searchDiv.innerHTML = '<i class="fas fa-spinner fa-spin-reverse fa-3x"></i>';
    const url = "/exist/apps/dlr-api/api/citations?username=" + username;
    
    teian.submission({"url": url})
        .then((data) => {
            const content = (new DOMParser()).parseFromString(data, "application/xml").documentElement;
            var results = document.createDocumentFragment();
            const entries = content.querySelectorAll("result > entry");
            const entriesNumber = entries.length;
            document.querySelector("#entries-counter").value = entriesNumber;
            
            entries.forEach(
                function(currentEntry) {
                    const entryStatus = currentEntry.getAttribute("status");
                    
                    var entryDiv = document.createElement("div");
                    entryDiv.setAttribute("id", currentEntry.getAttribute("id"));
                    
                    var titleSpan = document.createElement("span");
                    titleSpan.innerHTML = currentEntry.children[0].textContent;
                    entryDiv.appendChild(titleSpan);
                    
                    //entryDiv.addEventListener('click', event => document.dispatchEvent(solirom.events.selectResultItem));
                    entryDiv.addEventListener('click', event => {
                        if (!document.querySelector("#save-button").disabled) {
                            alert("Salvați intrarea curentă înainte de a edita alta!");
                        } else {
                            teian.editor.setAttribute("status", "edit");
                            teian.editor.setAttribute("src", "/exist/apps/dlr-api/api/citations?uuid=" + entryDiv.getAttribute("id"));        
                        }
                    });
                    
                    var entryStyle = entryDiv.style;
                    switch (entryStatus) {
                      case "elaborated":
                        entryStyle.backgroundColor = "#f5f2bc";
                        break;
                      case "corrected":
                        entryStyle.backgroundColor = "#9bf47e";
                        break;
                      default:
                    }                    
                    
                    results.appendChild(entryDiv);
                }                
            );
            
            searchDiv.innerHTML = "";
            searchDiv.appendChild(results);
            document.querySelector("#save-button").disabled = true;
        })
        .catch(error => {
            console.log(error);
    });
});

solirom.file.new = function() {
    const uuidUrl = "/exist/apps/solirom/api/uuid";
    teian.submission({"url": uuidUrl})
        .then((data) => {
            solirom.dataInstances.uuid = data;
            teian.editor.setAttribute("status", "new");
            teian.editor.setAttribute("src", "data:application/xml;" + teian.frameworkDefinition["new-file-template"]({"uuid": data, "username": document.querySelector("kuberam-login-element").username}));
            teian.editor.setAttribute("src", "/exist/apps/dlr-api/api/citations?uuid=" + data);
        })
        .catch(error => {
            console.log(error);
    });    
}

solirom.file.save = function() {
    const load = teian.utils.unloadData();
    console.log(load);
    
    //teian.submission({
    //    "url": teian.editor.getAttribute("src"),
    //    "method": "POST"
    //})
    //    .then((data) => {
    //        teian.utils.loadData(data, this);
    //    })
    //    .catch(error => {
    //        console.log(error);
    //});    
    
    var request = new XMLHttpRequest();
    request.open('POST', teian.editor.getAttribute("src"), true);
    request.setRequestHeader('Content-Type', 'text/plain; charset=UTF-8');
    
    request.onreadystatechange = function() {
      if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
          document.dispatchEvent(solirom.events.fileSave);
          alert("Datele au fost salvate.");
      }
    };
    
    request.onerror = function() {
      alert("Eroare la salvarea datelor.");
    };
    
    request.send(load);    
}

if (document.querySelector("kuberam-login-element").username !== "") {
    document.querySelector("#search-button").click();
}
