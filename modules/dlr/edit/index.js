window.solirom = {};
solirom.file = {};
solirom.events = {};
solirom.actions = {};
solirom.dataInstances = {};

solirom.dataInstances.uuid = "";
solirom.dataInstances.sha = "";
solirom.dataInstances.url = "";
solirom.dataInstances.username = "";
    
solirom.events.fileSave = new CustomEvent("fileSave");
solirom.events.selectResultItem = new CustomEvent("kuberam.search.result.webc-select.item");

document.addEventListener("fileSave", event => {
    document.querySelector("#save-button").disabled = true;
    document.querySelector("#search-button").click();
}, false);
document.addEventListener("teian-content-edited", event => {
    document.querySelector("#save-button").disabled = false;
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

document.addEventListener("click", event => {
    const target = event.target;
        
	if (target.matches("#search-result *")) {
       if (!document.querySelector("#save-button").disabled) {
           alert("Salvați intrarea curentă înainte de a edita alta!");
       } else {
           const uuid = target.parentNode.getAttribute("id");
           solirom.dataInstances.uuid = uuid;
           solirom.dataInstances.url = "/exist/apps/dlr-api/api/entry/full-xml?id=" + uuid;

           fetch(solirom.dataInstances.url)
           .then((response) => response.text())
           .then((data) => {
              	teian.editor.setAttribute("status", "edit");
               	teian.editor.setAttribute("src", "data:application/xml;" + data);
				teian.editor.shadowRoot.querySelectorAll("#content t-gramgrp").forEach(element => {
				  const value = Array.from(element.childNodes).map(node => {
				  	const nodeType = node.nodeType;
				   
				    switch (nodeType) {
				      case Node.TEXT_NODE:
				        return node.nodeValue;
				      break;
				      case Node.ELEMENT_NODE:
				        return node.getAttribute("value");
				      break;
				    }
				  }).join("");
			
				  element.shadowRoot.querySelector("solirom-automated-grammar").setAttribute("value", value)
				});            
            
           })
           .catch((error) => {
               console.error('Error:', error);
           });                         
       }        
    }	
}, false);

document.querySelector("#search-button").addEventListener("click", function() {
    const username = document.querySelector("kuberam-login-element").username;
    solirom.dataInstances.username = username;
    
    if (username === "") {
        return;
    }
    
    const searchDiv = document.querySelector("#search-result");
    searchDiv.innerHTML = '<i class="fas fa-spinner fa-spin-reverse fa-3x"></i>';
    const url = "/exist/apps/dlr-api/api/citations?username=" + username;

    fetch("/exist/apps/dlr-api/api/entry/by-user?u=" + username)
    .then((response) => response.json())
    .then((data) => {
        document.querySelector("#entries-counter").value = Object.keys(data).length;
        
        var results = document.createDocumentFragment();
        
        data.forEach(element => {
            var entryDiv = document.createElement("div");
            entryDiv.setAttribute("id", element.id);
            
            var titleSpan = document.createElement("span");
            titleSpan.innerHTML = element.headword + element["omonym-number"] + " " + element["grammatical-info"];
            entryDiv.appendChild(titleSpan);     
           
            results.appendChild(entryDiv);            
        });
        
        searchDiv.innerHTML = "";
        searchDiv.appendChild(results);
        document.querySelector("#save-button").disabled = true;
    })
    .catch((error) => {
        console.error('Error:', error);
    });      
});

solirom.file.new = function() {
    const uuid = solirom.actions.generate_uuid();
    solirom.dataInstances.uuid = uuid;
    teian.editor.setAttribute("status", "new");
    teian.editor.setAttribute("src", "data:application/xml;" + teian.frameworkDefinition["new-file-template"]({"uuid": uuid, "username": document.querySelector("kuberam-login-element").username}));
    teian.editor.setAttribute("src", "/exist/apps/dlr-api/api/citations?uuid=" + uuid);    
}

solirom.file.save = function() {
    const username = document.querySelector("kuberam-login-element").username;
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
    
    fetch("/exist/apps/dlr-api/api/entry/" + solirom.dataInstances.uuid + "/" + solirom.dataInstances.username, {
        method: "POST",
        body: data,
    }).then(function(response) {
        if (response.status == 200) {
            document.dispatchEvent(solirom.events.fileSave);
            alert("Datele au fost salvate.");
        }
    }, function(error) {
        alert("Eroare la salvarea datelor.");
        console.error('Error:', error);
    });
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
