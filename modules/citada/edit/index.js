import solirom from '/modules/solirom/solirom.js';

solirom.file = {};

solirom.data.uuid = "";
solirom.data.selectedItemId = null;
solirom.data.selectedItemSiblingId = null;

solirom.gitea.apiBaseUrl = "/gitea/api/v1/repos/solirom/citation-corpus-data/contents/files/xml/";
    
solirom.events.fileSave = new CustomEvent("fileSave");
solirom.events.fileDelete = new CustomEvent("fileDelete");
solirom.events.selectResultItem = new CustomEvent("kuberam.search.result.webc-select.item");

document.addEventListener("fileSave", event => {
    document.querySelector("#save-button").disabled = true;
    document.querySelector("#search-button").click();
}, false);
document.addEventListener("fileDelete", event => {
    document.querySelector("#save-button").disabled = true;
    document.querySelector("#delete-button").disabled = true;  
    solirom.data.selectedItemId = null;
    document.querySelector("teian-editor").setAttribute("src", "");    
    document.querySelector("#search-button").click();
}, false);
document.addEventListener("teian-file-edited", event => {
    document.querySelector("#save-button").disabled = false;
}, false);
document.addEventListener("kuberam.search.result.webc-select.item", event => {

}, false);
document.addEventListener('kuberam.loginElement.events.login', event => {
    document.querySelector("#save-button").disabled = true;    
    document.querySelector("#search-button").click();
});
document.addEventListener('kuberam.loginElement.events.logout', event => {
    document.querySelector("#search-result").innerHTML = "";
    document.querySelector("#entries-counter").value = 0;
    document.querySelector("teian-editor").setAttribute("src", "");
});
document.addEventListener("teian-file-opened", event => {
    document.querySelector("#delete-button").disabled = false;
    document.querySelector("#duplicate-button").disabled = false;
    document.querySelector("#history-button").disabled = false;
});
document.addEventListener("teian-file-edited", event => {
    document.querySelector("#save-button").disabled = false;
}, false);
document.addEventListener("click", event => {
    var target = event.target;
    
    if (target.matches("#search-button")) {
        let queryString = document.querySelector("#search-string").value;
        
        if (queryString == '') {
            const username = document.querySelector("kuberam-login-element").username;
            
            if (username === "") {
                return;
            }
            
            queryString = "a:" + username;
        } else {
            if (queryString.startsWith("sigla:")) {
                queryString = queryString.replace(/,|\s/g, "")
            }
            
        }
        
        const searchDiv = document.querySelector("#search-result");
        searchDiv.innerHTML = '<i class="fas fa-spinner fa-spin-reverse fa-3x"></i>';
        
        fetch("/api/citation-corpus/_search", {
            method: "POST",
            body: '{"size": 2000, "from": 0, "query": {"boost": 1, "query": "' + queryString + '"}, "fields": ["l", "s"]}'
        })
        .then((response) => response.json())
        .then((data) => {
            document.querySelector("#entries-counter").value = data.total_hits;
            
            var processedData = [];
            
            data.hits.forEach(element => {
                var item = {
                    "headword": element.fields.l,
                    "status": element.fields.s,
                    "id": element.id
                }
                processedData.push(item);
            });
            processedData.sort((a, b) => (a.headword > b.headword) ? 1 : -1);
            
            var results = document.createDocumentFragment();
            
            processedData.forEach(element => {
                const entryStatus = element.status;
                
                var entryDiv = document.createElement("div");
                entryDiv.setAttribute("id", element.id);
                
                var titleSpan = document.createElement("span");
                titleSpan.innerHTML = element.headword;
                entryDiv.appendChild(titleSpan);     
                
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
            });
            
            searchDiv.innerHTML = "";
            searchDiv.appendChild(results);
            const scrolledIntoViewElement = solirom.data.selectedItemId || solirom.data.selectedItemSiblingId;
            if (scrolledIntoViewElement !== null) {
                solirom.actions.scrollIntoView(scrolledIntoViewElement, "content-container");
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
    
    if (target.matches("#search-result *")) {
        var entryDiv = target.closest("#search-result > div");
        
        if (!document.querySelector("#save-button").disabled) {
            alert("Salvați intrarea curentă înainte de a edita alta!");
        } else {
            const uuid = entryDiv.id;
            solirom.data.selectedItemId = solirom.data.uuid = uuid;
            const siblingElement = entryDiv.previousElementSibling || entryDiv.nextElementSibling || entryDiv;
            solirom.data.selectedItemSiblingId = siblingElement.id;
            
            solirom.gitea.getFile(solirom.gitea.apiBaseUrl + solirom.data.uuid + ".xml");            
        }
    }    
}, false);

solirom.file.new = function() {
    const uuid = solirom.actions.generate_uuid();
    solirom.data.selectedItemId = solirom.data.uuid = uuid;
    document.querySelector("teian-editor").setAttribute("status", "new");
    document.querySelector("teian-editor").setAttribute("src", "data:application/xml;" + teian.frameworkDefinition["new-file-template"]({"uuid": uuid, "username": document.querySelector("kuberam-login-element").username})); 
}

solirom.file.save = function() {
    const username = document.querySelector("kuberam-login-element").username;
    const data = teian.utils.unloadData();
    
    const requestBody = {
        "content": solirom.actions.b64EncodeUnicode(teian.utils.unloadData()),
        "sha": solirom.gitea.sha,
        "message": (new Date()).toISOString().split('.')[0] + ", " + username,
        "author": {
            "email": username,
            "name": username
        }        
    };
    console.log(JSON.stringify(requestBody));
    
    const documentIndex = {
        "a": username,
        "s": teian.dataInstances.outputData.querySelector("revisionDesc").getAttribute("status"),
        "l": encodeURIComponent(teian.dataInstances.outputData.querySelector("orth").textContent),
        "sigla": Array.from(teian.dataInstances.outputData.querySelectorAll("bibl > ptr")).map(element => encodeURIComponent(element.getAttribute("target").replace(",", "").replace(" ", ""))).join(" ")
    }
    
    fetch("/data", {
        method: "POST",
        body: data,
        headers: {
            "Content-Type": "text/plain;charset=UTF-8",
            "Content-Location": "/var/web/solirom-admin-site/modules/citations/citation-corpus-data/files/xml/" + solirom.data.uuid + ".xml",
            "X-Document-Id": solirom.data.uuid,
            "X-Document-Index": JSON.stringify(documentIndex)
        }
    }).then(function(response) {
        if (response.status == 200) {
            document.dispatchEvent(solirom.events.fileSave);
            alert("Intrarea a fost salvată.");
        }
    }, function(error) {
        alert("Eroare la salvarea intrării.");
        console.error('Error:', error);
    });    
    
    /*
    fetch("/data/api/v1/repos/solirom/citation-corpus-data/contents/files/xml/" + solirom.data.uuid + ".xml", {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "token a6ddbb24ea29bee69670815cd4aca6b6703940cc"
        },
        body: JSON.stringify(requestBody),
    })
    .then(function(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        
        return response;
    })    
    .then((response) => {
        console.log(response);
        if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' + response.status);
            return;
        }

        response.json().then((data) => {
            console.log(data);
            console.log(data.sha);
            solirom.gitea.sha = data.sha;
            console.log("solirom.gitea.sha, 2 = " + solirom.gitea.sha);
            console.log(solirom.gitea.sha);
            alert("Datele au fost salvate.");
        });
    
    })    
    .catch((error) => {
        alert("Eroare la salvarea datelor.");
        console.error('Error:', error);
    });    
    */
};

solirom.file.delete = function() {
    fetch("/data", {
        method: "DELETE",
        headers: {
            "Content-Type": "text/plain;charset=UTF-8",
            "Content-Location": "/var/web/solirom-admin-site/modules/citations/citation-corpus-data/files/xml/" + solirom.data.uuid + ".xml",
            "X-Document-Id": solirom.data.uuid
        }
    }).then(function(response) {
        if (response.status == 200) {
            document.dispatchEvent(solirom.events.fileDelete);
        }
    }, function(error) {
        alert("Eroare la ștergerea intrării.");
        console.error('Error:', error);
    });
};

if (document.querySelector("kuberam-login-element").username !== "") {
    document.querySelector("#search-button").click();
}
