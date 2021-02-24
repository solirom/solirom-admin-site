window.solirom = {};

solirom.events = {};
solirom.actions = {};
solirom.data = {};

solirom.data.uuid = "";
solirom.data.selectedItemId = null;
solirom.data.selectedItemSiblingId = null;
solirom.data.filePath = "solirom%2Fbflr-data%2Fcontents%2F";
solirom.data.indexName = "bflr";

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
    teian.editor.setAttribute("src", "");    
    document.querySelector("#search-button").click();
}, false);

document.addEventListener("teian-file-edited", event => {
    document.querySelector("#save-button").disabled = false;
}, false);

document.addEventListener("kuberam.search.result.webc-select.item", event => {

}, false);

document.addEventListener('kuberam.loginElement.events.login', event => {
});

document.addEventListener('kuberam.loginElement.events.logout', event => {
    document.querySelector("#search-result").innerHTML = "";
    document.querySelector("#entries-counter").value = 0;
    teian.editor.setAttribute("src", "");
});

document.addEventListener("teian-file-opened", event => {
    document.querySelector("#delete-button").disabled = false;
    document.querySelector("#duplicate-button").disabled = false;
    document.querySelector("#history-button").disabled = false;
    document.querySelector("#volume-button").disabled = false;
});

document.addEventListener("teian-file-edited", event => {
    document.querySelector("#save-button").disabled = false;
}, false);

document.addEventListener("teian-node-added", event => {
	const target = event.detail;

    if (target.matches("*[data-name = 'titleInfo'], *[data-name = 'name']")) {
    		const targetParent = target.parentNode;
		const xmlNodeName = target.dataset.name;
		const targetSiblings = targetParent.querySelectorAll("*[data-name = '" + xmlNodeName + "']");
		const targetSiblingsNumber = targetSiblings.length;
		
		if (targetSiblingsNumber > 1) {
			targetSiblings.forEach(element => element.shadowRoot.querySelector("#delete-button").disabled = false);	
		}
    }	
}, false);

document.addEventListener("teian-node-to-remove", event => {
	const target = event.detail;

    if (target.matches("*[data-name = 'titleInfo'], *[data-name = 'name']")) {
    		const targetParent = target.parentNode;
		const xmlNodeName = target.dataset.name;
		const targetSiblings = targetParent.querySelectorAll("*[data-name = '" + xmlNodeName + "']");
		const targetSiblingsNumber = targetSiblings.length;
		
		if (targetSiblingsNumber == 2) {
			targetSiblings.forEach(element => element.shadowRoot.querySelector("#delete-button").disabled = true);	
		}
    }
    
    if (target.matches("*[data-name = 'relatedItem'][type = 'constituent']")) {
    		const targetParent = target.parentNode;
		const xmlNodeName = target.dataset.name;
		const targetSiblings = targetParent.querySelectorAll(":scope > *[data-name = 'relatedItem'][type = 'constituent']");
		const targetSiblingsNumber = targetSiblings.length;
		
		if (targetSiblingsNumber == 1) {
			document.querySelector("#volume-button").disabled = false;		
		}
    }
}, false);

document.addEventListener("kuberam-multiselect-item-added", event => {
	const eventData = event.detail;
	const roleTerm = teian.dataInstances.roleTermProcessedTemplate({"roleTerm": eventData.roleTerm});
	const hostElement = eventData.hostElement;
	const roleNode = hostElement.querySelector(":scope > *[data-name = 'role']");
	
	teian.update.insertInto((new DOMParser()).parseFromString(roleTerm, 'application/xml').documentElement.cloneNode(true), roleNode);
}, false);

document.addEventListener("kuberam-multiselect-item-removed", event => {
	const eventData = event.detail;
	const roleTerm = eventData.roleTerm;
	const hostElement = eventData.hostElement;
	const roleTermNode = hostElement.querySelector(":scope > *[data-name = 'role'] > *[data-name = 'roleTerm'][data-value = '" + roleTerm + "']");
	
	teian.update.delete(roleTermNode);	
}, false);

document.addEventListener("click", event => {
    const target = event.target;
    
    if (target.matches("#search-result *")) {
    	const source = target.closest("div.list-item");
		
        if (!document.querySelector("#save-button").disabled) {
            alert("Salvați intrarea curentă înainte de a edita alta!");
        } else {
            const uuid = source.id;
            solirom.data.selectedItemId = solirom.data.uuid = uuid;
            const siblingElement = source.previousElementSibling || source.nextElementSibling || source;
            solirom.data.selectedItemSiblingId = siblingElement.id;
            solirom.data.url = "/api/data/" + solirom.data.filePath + solirom.data.uuid + ".xml";
            
            fetch(solirom.data.url, {
                headers: {
                    "Cache-Control": "no-store, no-cache, must-revalidate"                            
                }
            })
            .then((response) => response.text())
            .then((data) => {
                teian.editor.setAttribute("status", "edit");
                teian.editor.setAttribute("src", "data:application/xml;" + data);
                teian.actions.initializeAllCollapsedTitleInfo();
                teian.actions.initializeSortableVolumes();
                setTimeout(() => document.querySelector("#save-button").disabled = true, 1);
            })
            .catch((error) => {
                console.error('Error:', error);
            });                         
        }        
    }
     
    if (target.matches("#search-button")) {
        let queryString = document.querySelector("#search-string").value;

        const searchDiv = document.querySelector("#search-result");
        searchDiv.innerHTML = '<i class="fas fa-spinner fa-spin-reverse fa-3x"></i>';

        fetch("/api/search/" + solirom.data.indexName, {
            method: "POST",
            body: '{"size": 2000, "from": 0, "query": {"boost": 1, "query": "' + queryString + '"}, "fields": ["collection", "title"]}'
        })
        .then((response) => response.json())
        .then((data) => {
            document.querySelector("#entries-counter").value = data.total_hits;
            
            var processedData = [];
            
            data.hits.forEach(element => {
                var item = {
                    "title": element.fields.title,
                    "id": element.id
                }
                processedData.push(item);
            });
            processedData.sort((a, b) => (a.title > b.title) ? 1 : -1);
            
            var results = "";
            
            processedData.forEach(element => {
                let entry =
                    `
                        <div class="list-item" xmlns="http://www.w3.org/1999/xhtml" id="${element.id}">
                                <span><i>${element.title}</i></span>                    
                        </div>
                    `;

                results += entry;
            });
            
            searchDiv.innerHTML = results;
            
            const scrolledIntoViewElement = solirom.data.selectedItemId || solirom.data.selectedItemSiblingId;
            if (scrolledIntoViewElement !== null) {
                solirom.actions.scrollIntoView(scrolledIntoViewElement);
            }
        })
        .catch(error => console.error('Error:', error));        
    }
}, false);

solirom.actions.newFile = function() {
	fetch("https://uuid.solirom.ro/bflr")
		.then((response) => response.text())
		.then((data) => {
            solirom.data.uuid = data;
            solirom.data.url = "/api/data/" + solirom.data.filePath + solirom.data.uuid + ".xml";
            teian.editor.setAttribute("status", "new");
            teian.editor.setAttribute("src", "data:application/xml;" + teian.frameworkDefinition["new-file-template"]({"uuid": data, "username": document.querySelector("kuberam-login-element").username}));
		})
		.catch(error => console.error('Error:', error));
};

solirom.actions.saveFile = function() {
    const data = teian.utils.unloadData();
    const editorStatus = teian.editor.getAttribute("status");
    const outputData = teian.dataInstances.outputData;
    const documentId = outputData.querySelector(":scope").getAttribute("ID");
    var method = "";
    
	switch (editorStatus) {
	  case 'new':
	    method = "POST";
	    break;
	  case 'edit':
	    method = "PUT";
	    break;
	} 
    
	var xsltProcessor = new XSLTProcessor();
	xsltProcessor.importStylesheet(solirom.data.indexXSLT);
	const documentIndex = xsltProcessor.transformToDocument(outputData).documentElement.textContent;     
    
    fetch(solirom.data.url, {
        method: method,
        body: data,
        headers: {
            "Content-Type": "text/plain;charset=UTF-8",
            "X-Username": document.querySelector("kuberam-login-element").username
        }
    }).then(response => {
        if (response.status == 200) {
            teian.editor.setAttribute("status", "edit");
            // index the document
	        fetch("/api/index/" + solirom.data.indexName + "/" + documentId, {
	            method: "PUT",
	            body: documentIndex
	        })
	        .then(response => {
				if (response.status == 200) {
		            document.dispatchEvent(solirom.events.fileSave);
		            alert("Intrarea a fost salvată.");					
				}
	        })
	        .catch(error => console.error('Error:', error)); 				
        }
    }, function(error) {
        alert("Eroare la salvarea intrării.");
        console.error('Error:', error);
    });    
};

solirom.actions.deleteFile = function() {
    teian.utils.unloadData();
	const documentId = teian.dataInstances.outputData.querySelector(":scope").getAttribute("ID");
	
    fetch(solirom.data.url, {
        method: "DELETE",
        headers: {
            "X-Username": document.querySelector("kuberam-login-element").username
        }
    }).then(response => {
        if (response.status == 200) {
        		// remove index of the document
	        fetch("/api/index/" + solirom.data.indexName + "/" + documentId, {
	            method: "DELETE"
	        })
	        .then(response => {
				if (response.status == 200) {
		            document.dispatchEvent(solirom.events.fileDelete);
				}
	        })
	        .catch(error => {
				alert("Eroare la ștergerea intrării.");
				console.error('Error:', error)
			}); 				
        }
    }, function(error) {
        alert("Eroare la salvarea intrării.");
        console.error('Error:', error);
    });    
};

solirom.actions.addVolume = () => {
	var content = teian.editor.shadowRoot.querySelector("#content");
	const referenceNode = content.querySelector(":scope > *[data-name = 'mods'] > *[data-name = 'relatedItem'][type = 'constituent']:last-of-type") || content.querySelector(":scope  > *[data-name = 'mods'] > *[data-name = 'genre']");
	teian.update.insertAfter((new DOMParser()).parseFromString(teian.dataInstances.volumeProcessedTemplate, 'application/xml').documentElement.cloneNode(true), referenceNode);
	document.querySelector("#volume-button").disabled = true;
};

solirom.actions.scrollIntoView = elementId => {
    document.getElementById(elementId).scrollIntoView();
    document.getElementById("content-container").scrollIntoView();
};

fetch("../generate-index/generate-index.xsl")
.then((response) => response.text())
.then((data) => {
    solirom.data.indexXSLT = (new DOMParser()).parseFromString(data, 'application/xml');
})
.catch(error => console.error('Error:', error));
        
document.querySelector("#search-string").value = "collection:DLR2";
