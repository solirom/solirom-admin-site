window.solirom = {};
solirom.file = {};
solirom.events = {};
solirom.actions = {};
solirom.dataInstances = {};
solirom.data = {};

solirom.dataInstances.uuid = "";
solirom.dataInstances.sha = "";
solirom.dataInstances.url = "";
solirom.dataInstances.selectedItemId = null;
solirom.dataInstances.selectedItemSiblingId = null;
solirom.data.indexName = "citada";
    
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
    solirom.dataInstances.selectedItemId = null;
    teian.editor.setAttribute("src", "");    
    document.querySelector("#search-button").click();
}, false);

document.addEventListener("kuberam.search.result.webc-select.item", event => {

}, false);

document.addEventListener('kuberam.loginElement.events.login', event => {
    document.querySelector("#save-button").disabled = true;    
    document.querySelector("#search-button").click();
});

document.addEventListener('kuberam.loginElement.events.logout', event => {
    document.querySelector("#search-result").innerHTML = "";
    document.querySelector("#total-entries-counter").value = 0;
    document.querySelector("#corrected-entries-counter").value = 0;
    teian.editor.setAttribute("src", "");
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
    var queryString = document.querySelector("#search-string").value;
    
    if (queryString == '') {
        var username = document.querySelector("kuberam-login-element").username;
        
        if (username === "") {
            return;
        }
        username = username.replace(/\./gi, "");       
        username = username.replace(/@/gi, "");
        username = username.replace(/-/gi, "");
        username = username.replace(/_/gi, "");
        username = username + "*";
        
        queryString = "a:" + username;
    } else {
        if (queryString.startsWith("sigla:")) {
            queryString = queryString.replace(/,|\s/g, "")
        }
        
    }
    
    const searchDiv = document.querySelector("#search-result");
    searchDiv.innerHTML = '<i class="fas fa-spinner fa-spin-reverse fa-3x"></i>';
    
    fetch("/api/search/" + solirom.data.indexName, {
        method: "POST",
        body: '{"size": 2000, "from": 0, "query": {"boost": 1, "query": "' + queryString + '"}, "fields": ["*"]}'
    })    
    .then((response) => response.json())
    .then((data) => {
        document.querySelector("#total-entries-counter").value = data.total_hits;
        
        var processedData = [];
        var correctedEntriesCounter = 0;
        
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
            
            entryDiv.addEventListener('click', event => {
                if (!document.querySelector("#save-button").disabled) {
                    alert("Salvați intrarea curentă înainte de a edita alta!");
                } else {
                    const uuid = entryDiv.id;
                    solirom.dataInstances.selectedItemId = solirom.dataInstances.uuid = uuid;
                    const siblingElement = entryDiv.previousElementSibling || entryDiv.nextElementSibling || entryDiv;
                    solirom.dataInstances.selectedItemSiblingId = siblingElement.id;
                    solirom.dataInstances.url = "/data";
                    
                    fetch(solirom.dataInstances.url, {
                        headers: {
                            "Content-Location": solirom.dataInstances.uuid + ".xml"                            
                        }
                    })
                    .then((response) => response.text())
                    .then((data) => {
                        teian.editor.setAttribute("status", "edit");
                        teian.editor.setAttribute("src", "data:application/xml;" + data);
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });                         
                }
            });  
            
            var entryStyle = entryDiv.style;
            switch (entryStatus) {
                case "elaborated":
                entryStyle.backgroundColor = "#f5f2bc";
                break;
                case "corrected":
                entryStyle.backgroundColor = "#9bf47e";
                correctedEntriesCounter++;
                break;
                default:
            }                    
            
            results.appendChild(entryDiv);            
        });
        
        searchDiv.innerHTML = "";
        searchDiv.appendChild(results);
        document.querySelector("#corrected-entries-counter").value = correctedEntriesCounter;
        
        const scrolledIntoViewElement = solirom.dataInstances.selectedItemId || solirom.dataInstances.selectedItemSiblingId;
        if (scrolledIntoViewElement !== null) {
            solirom.actions.scrollIntoView(scrolledIntoViewElement);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });      
});

solirom.file.new = function() {
    const uuid = solirom.actions.generate_uuid();
    solirom.dataInstances.selectedItemId = solirom.dataInstances.uuid = uuid;
    teian.editor.setAttribute("status", "new");
    teian.editor.setAttribute("src", "data:application/xml;" + teian.frameworkDefinition["new-file-template"]({"uuid": uuid, "username": document.querySelector("kuberam-login-element").username})); 
}

solirom.file.save = function() {
    var username = document.querySelector("kuberam-login-element").username;
    username = username.replace(/\./gi, "");       
    username = username.replace(/@/gi, "");
    username = username.replace(/-/gi, "");
    username = username.replace(/_/gi, "");    
    const data = teian.utils.unloadData();
    
    /*
    const load = {
        "content": solirom.actions.b64EncodeUnicode(teian.utils.unloadData()),
        "sha": solirom.dataInstances.sha,
        "message": "Updated file " + solirom.dataInstances.uuid,
        "author": {
            "email": username,
            "name": username
        }        
    };
    */
    const documentIndex = {
        "a": encodeURIComponent(username),
        "s": teian.dataInstances.outputData.querySelector("revisionDesc").getAttribute("status"),
        "l": encodeURIComponent(teian.dataInstances.outputData.querySelector("orth").textContent),
        "sigla": Array.from(teian.dataInstances.outputData.querySelectorAll("bibl > ptr")).map(element => encodeURIComponent(element.getAttribute("target").replace(",", "").replace(" ", ""))).join(" ")
    }

    fetch("/data", {
        method: "POST",
        body: data,
        headers: {
            "Content-Type": "text/plain;charset=UTF-8",
            "Content-Location": solirom.dataInstances.uuid + ".xml",
            "X-Document-Id": solirom.dataInstances.uuid,
            "X-Document-Index": JSON.stringify(documentIndex)
        }
    })
    .then(function(response) {
        if (response.status == 200) {
            document.dispatchEvent(solirom.events.fileSave);
            alert("Intrarea a fost salvată.");
        }
    }, function(error) {
        alert("Eroare la salvarea intrării.");
        console.error('Error:', error);
    });    
    
    /*
    fetch("/data/api/v1/repos/solirom/citada-data/contents/" + solirom.dataInstances.uuid + ".xml", {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "token a6ddbb24ea29bee69670815cd4aca6b6703940cc"
        },
        body: JSON.stringify(load),
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
            solirom.dataInstances.sha = data.sha;
            console.log("solirom.dataInstances.sha, 2 = " + solirom.dataInstances.sha);
            console.log(solirom.dataInstances.sha);
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
    var result = confirm("Ștergeți intrarea?");
    if (result) {
        fetch("/data", {
            method: "DELETE",
            headers: {
                "Content-Type": "text/plain;charset=UTF-8",
                "Content-Location": solirom.dataInstances.uuid + ".xml",
                "X-Document-Id": solirom.dataInstances.uuid
            }
        }).then(function(response) {
            if (response.status == 200) {
                document.dispatchEvent(solirom.events.fileDelete);
            }
        }, function(error) {
            alert("Eroare la ștergerea intrării.");
            console.error('Error:', error);
        });            
    }
};

if (document.querySelector("kuberam-login-element").username !== "") {
    document.querySelector("#search-button").click();
}

solirom.actions.b64EncodeUnicode = function(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
};

solirom.actions.b64DecodeUnicode = function(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
};

solirom.actions.generate_uuid = function() {
  const uuid = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
  
  return "uuid-" + uuid
};

solirom.actions.scrollIntoView = elementId => {
    document.getElementById(elementId).scrollIntoView();
    document.getElementById("content-container").scrollIntoView();
};
