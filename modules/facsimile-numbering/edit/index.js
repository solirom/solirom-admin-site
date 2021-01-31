import solirom from "/modules/solirom/solirom.js";
import Sortable from '/modules/sortable/sortable.esm.js';

solirom.data.searchResult = {};
solirom.data.uuid = "";
solirom.data.selectedItemId = null;
solirom.data.bflrFilePath = "solirom%2Fbflr-data%2Fcontents%2F";
solirom.data.bflrIndexName = "bflr";
solirom.data.facsServerApiKey = "e61fec83-8665-4742-87b6-b626f9444bb0";
solirom.data.workID = "";
solirom.data.volumeNumber = "";
solirom.data.templates = {
	"volumeSelectorOption": solirom.actions.html`
		<option xmlns="http://www.w3.org/1999/xhtml" value="${props => props.value}">${props => props.label}</option>
	`,
	"pb": solirom.actions.html`
		<t-pb xmlns="http://www.w3.org/1999/xhtml" data-name="pb" data-ns="http://www.tei-c.org/ns/1.0" data-value="" slot="t-pb"  n="" facs="${props => props.facs}" cert="" corresp=""/>
	`,
	"img": solirom.actions.html`
	<img xmlns="http://www.w3.org/1999/xhtml" src="${props => props.src}"/>
`
};

solirom.data.scan = {
	"name": ""
};
solirom.data.text = {
	"section": "body"
};

solirom.data.messages = {
	"legalFileSize": ""
};

solirom.events.fileSave = new CustomEvent("fileSave");
solirom.events.fileDelete = new CustomEvent("fileDelete");
solirom.events.selectResultItem = new CustomEvent("kuberam.search.result.webc-select.item");

solirom.data.collection = localStorage.getItem("solirom.facsimile-numbering.collection") || "all";
document.getElementById("collection").value = solirom.data.collection;

document.addEventListener("fileSave", event => {
    document.querySelector("#save-button").disabled = true;
}, false);

document.addEventListener("teian-file-edited", event => {
    document.querySelector("#save-button").disabled = false;
}, false);

document.addEventListener("kuberam.loginElement.events.logout", event => {
    teian.editor.reset();
});

document.addEventListener("teian-file-opened", event => {
});

document.addEventListener("teian-file-edited", event => {
    document.querySelector("#save-button").disabled = false;
}, false);

document.addEventListener("click", event => {
    const target = event.target;
    
    if (target.matches("#add-scan")) {
    	document.getElementById("add-scan-fileupload").click();    	
	}
	
    if (target.matches("#replace-scan")) {
    	document.getElementById("replace-scan-fileupload").click();    	
	}
	
    if (target.matches("#delete-scan")) {
        var result = confirm("Ștergeți scanul?");
        if (result) {
            document.querySelector("#image-viewer-loading-bar").show();

            var scanName = solirom.data.scan.name;

            const scanPath = solirom.actions.generateScanPath(scanName);

            fetch("https://facs.solirom.ro/api/data/" + scanPath, {
                method: "DELETE"
            })
            .then(response => {
                if (response.status == 200) {
                    teian.editor.shadowRoot.querySelector("#content *[data-name = 'pb'][facs = '" + scanName + "']").remove();
                    document.querySelector(".box6 img").src = "";

                    setTimeout(() => document.querySelector("#save-button").disabled = true, 1);
                    document.querySelector("#image-viewer-loading-bar").hide();
                    solirom.actions.saveFile();
                }
            }, error => {
                alert("Eroare la salvarea scanului.");
                console.error('Error:', error);
            });            
        }        
	}
	
    if (target.matches("#save-button")) {
		solirom.actions.saveFile();
	}

    if (target.matches("#switch-to-page-numbering-button")) {
		document.querySelector("#numbering-editor").style.display = "inline-block";
		document.querySelector("#transcription-editor").style.display = "none";
	}	
}, false);

document.addEventListener("beforeunload", event => {
    //event.preventDefault();
}, false);

document.addEventListener("awesomplete-selectcomplete", event => {
	document.querySelector("#text-tools").style.display = "none";
	document.querySelector("label[for = 'volume-selector']").style.display = "none";
	const volumeSelector = document.querySelector("#volume-selector");
	volumeSelector.style.display = "none";
	volumeSelector.innerHTML = "";	
    
	const selectedItem = event.text;
	const selectedItemValue = selectedItem.value;
	const selectedItemId = solirom.data.searchResult[selectedItemValue];

    solirom.data.url = "/api/data/" + solirom.data.bflrFilePath + selectedItemId + ".xml";
    
    fetch(solirom.data.url, {
        headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate"                            
        }
    })
    .then((response) => response.text())
    .then((data) => {
        solirom.data.workMetadataUrl = (new DOMParser()).parseFromString(data, 'application/xml').documentElement.querySelector("mods > location > url[note]").textContent;

        fetch("/api/data/" + solirom.data.workMetadataUrl, {
	        headers: {
	            "Cache-Control": "no-store, no-cache, must-revalidate"                            
	        }
	    })
	    .then((response) => response.text())
	    .then((data) => {
			solirom.data.volumeNumber = "";
			document.querySelector(".box6 img").src = "";
			teian.editor.reset();
		    document.querySelector("#add-scan").disabled = true;
		    document.querySelector("#replace-scan").disabled = true;
		    document.querySelector("#delete-scan").disabled = true;			
			
        	const indexDocument = (new DOMParser()).parseFromString(data, "application/xml").documentElement;
			var workID = indexDocument.getAttribute("xml:id");
			const workType = indexDocument.getAttribute("type");
			solirom.data.workID = workID;
			
			switch (workType) {
			  case "uni-volume":
				teian.editor.setAttribute("status", "edit");
				teian.editor.setAttribute("src", "data:application/xml;" + data);
				document.querySelector("#add-scan").disabled = false;
                
                document.querySelector("#text-tools").style.display = "inline";
                [...teian.editor.shadowRoot.querySelectorAll("#content *[data-name = 'text'] > *")].forEach((section) => section.style.display = "none");
				teian.editor.shadowRoot.querySelector("#content *[data-name = '" + solirom.data.text.section + "']").style.display = "inline";
				
				[...document.querySelector("#numbering-editor > teian-editor").shadowRoot.
				querySelectorAll("*[data-name = 'front'], *[data-name = 'back']")].forEach((section => {
					section.classList.add("list-group");
					[...section.querySelectorAll("*[data-name = 'pb']")].forEach((pb) => {
						pb.classList.add("list-group-item");
					});
					Sortable.create(section, {
						animation: 350
					});					
				}));
			  break;
			  case "multi-volume":
				document.querySelector("#text-tools").style.display = "inline";

				const volumeSelector = document.querySelector("#volume-selector");
				var volumeNumbers = [...indexDocument.querySelectorAll("TEI > *|include")].map(
					item => {
						const volumeNumber = item.getAttribute("href").match(/\d+/g)[0];

						return solirom.data.templates.volumeSelectorOption({"label": volumeNumber, "value": volumeNumber});
				}).join("");
				volumeNumbers = solirom.data.templates.volumeSelectorOption({"label": "", "value": ""}) + volumeNumbers;

				volumeSelector.style.display = "inline";
				document.querySelector("label[for = 'volume-selector']").style.display = "inline";
				
				volumeSelector.innerHTML = volumeNumbers;
			  break;
			}
			
			setTimeout(() => document.querySelector("#save-button").disabled = true, 1);
	    })
	    .catch((error) => {
	        console.error('Error:', error);
	    });
    })
    .catch((error) => {
        console.error('Error:', error);
    });	
}, false);

document.addEventListener("input", event => {
    const target = event.target;
    
    if (target.matches("#search-string")) {
        var searchValue = target.value;
        
        if (searchValue.length > 1) {
            if (!searchValue.includes("*")) {
                searchValue = "siglum:" + searchValue + "*";
            }
            
            var collection = solirom.data.collection;
            if (collection !== "all") {
            		collection = "AND collection:"  + collection;
				searchValue = searchValue + collection;	
            }
            
            fetch("/api/search/" + solirom.data.bflrIndexName, {
                method: "POST",
                body: '{"size": 2000, "from": 0, "query": {"boost": 1, "query": "' + searchValue + '"}, "fields": ["siglum"]}'
            })
            .then((response) => response.json())
            .then((data) => {
				const processedData = Object.assign({}, ...data.hits.map(item => ({ [item.fields.siglum]: item.id })));
				solirom.data.searchResult = processedData;
				solirom.controls.search.list = Object.keys(processedData).sort();
            })
		    .catch((error) => {
		        console.error('Error:', error);
		    });             
        }
    }

}, false);

document.addEventListener("change", event => {
    const target = event.target;
    
    if (target.matches("#collection")) {
        const collection = target.value;
        
		solirom.data.collection = collection;
		localStorage.setItem("solirom.facsimile-numbering.collection", collection);
    }
    
    if (target.matches("#add-scan-fileupload")) {
		solirom.data.scan.name = solirom.actions.generateNewScanName(solirom.actions.getLatestScanName());
        solirom.data.messages.legalFileSize = "";
    	document.querySelector("#image-viewer-loading-bar").show();
        
        const files = [...target.files].sort((a,b) => {
            var nameA = a.name.toUpperCase();
            var nameB = b.name.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            return 0;
        });

		files.forEach((file) => {
            const isLegalSize = solirom.actions.checkFileSize(file);
            
            if (!isLegalSize) {
                return;    
            }
			const formData = new FormData();
			formData.append("file", file);
            			
		    var newScanName = solirom.data.scan.name;
			solirom.data.scan.name = solirom.actions.generateNewScanName(newScanName);
			
			const scanPath = solirom.actions.generateScanPath(newScanName);

		    fetch("https://facs.solirom.ro/api/data/" + scanPath, {
		        method: "POST",
		        body: formData
		    })
		    .then(response => {
		        if (response.status == 200) {
					const textSection = teian.editor.shadowRoot.querySelector("#content *[data-name = '" + solirom.data.text.section + "']");
					textSection.insertAdjacentHTML("beforeend", solirom.data.templates.pb({"facs": newScanName}));

					setTimeout(() => document.querySelector("#save-button").disabled = true, 1);
					document.querySelector("#image-viewer-loading-bar").hide();
					solirom.actions.saveFile();
		        }
		    }, error => {
		        alert("Eroare la salvarea scanului.");
		        console.error('Error:', error);
		    });
		});
        
        alert(solirom.data.messages.legalFileSize);
    } 
    
    if (target.matches("#replace-scan-fileupload")) {
        solirom.data.messages.legalFileSize = "";
        
    	document.querySelector("#image-viewer-loading-bar").show();
		const formData = new FormData();
        const file = target.files[0];
              
        const isLegalSize = solirom.actions.checkFileSize(file);

        if (!isLegalSize) {
            document.querySelector("#image-viewer-loading-bar").hide();
            alert(solirom.data.messages.legalFileSize);            
            return;
        }              

		formData.append("file", file);    	
    	
	    const currentScanName = solirom.data.scan.name;
		const scanPath = solirom.actions.generateScanPath(currentScanName);
	
	    fetch("https://facs.solirom.ro/api/data/" + scanPath, {
	        method: "PUT",
	        body: formData
	    })
	    .then(response => {
	        if (response.status == 200) {
				solirom.actions.updateImageViewerURL(currentScanName);
				
				document.querySelector("#image-viewer-loading-bar").hide();
				solirom.actions.saveFile();
	        }
	    }, error => {
	        alert("Eroare la salvarea scanului.");
	        console.error('Error:', error);
	    });		
	}
	
    if (target.matches("input[name = 'sectionSelectorButton']")) {
        const textSection = target.value;
        
        solirom.data.text.section = textSection;
        
        [...teian.editor.shadowRoot.querySelectorAll("#content *[data-name = 'text'] > *")].forEach((section) => section.style.display = 'none');
        teian.editor.shadowRoot.querySelector("#content *[data-name = '" + solirom.data.text.section + "']").style.display = 'inline';
	}	
	
	if (target.matches("#volume-selector")) {
		const volumeNumber = target.value;

		if (volumeNumber === "") {
			return;
		}
		solirom.data.volumeNumber = volumeNumber;
		var volumeMetadataFilePath = "index-" + volumeNumber + ".xml";
		volumeMetadataFilePath = solirom.data.workMetadataUrl.replace(/index(\-[0-9]{2})?.xml/, volumeMetadataFilePath);
		solirom.data.workMetadataUrl = volumeMetadataFilePath;
		
		fetch("/api/data/" + solirom.data.workMetadataUrl, {
			headers: {
				"Cache-Control": "no-store, no-cache, must-revalidate"
			}
		})
		.then((response) => response.text())
		.then((data) => {
			teian.editor.setAttribute("status", "edit");
			teian.editor.setAttribute("src", "data:application/xml;" + data);
			document.querySelector("#text-tools").style.display = "inline";
			[...teian.editor.shadowRoot.querySelectorAll("#content *[data-name = 'text'] > *")].forEach((section) => section.style.display = "none");
			teian.editor.shadowRoot.querySelector("#content *[data-name = '" + solirom.data.text.section + "']").style.display = "inline"; 
	
			document.querySelector(".box6 img").src = "";
			document.querySelector("#add-scan").disabled = false;
			document.querySelector("#replace-scan").disabled = false;
			setTimeout(() => document.querySelector("#save-button").disabled = true, 1);   
		})
		.catch((error) => {
			console.error('Error:', error);
		});		
	}
}, false);

solirom.actions.saveFile = () => {
	document.querySelector("#editor-loading-bar").style.display = "inline";
    const data = teian.utils.unloadData();
    
    fetch("/api/data/" + solirom.data.workMetadataUrl, {
        method: "PUT",
        body: data,
        headers: {
            "Content-Type": "text/plain;charset=UTF-8",
            "X-Username": document.querySelector("kuberam-login-element").username
        }
    }).then(response => {
        if (response.status == 200) {
        		teian.editor.setAttribute("status", "edit");
				document.querySelector("#editor-loading-bar").style.display = "none";
        }
    }, error => {
        alert("Eroare la salvarea intrării.");
        console.error('Error:', error);
    });    
}

solirom.actions.getLatestScanName = () => {
	const scanNames = [...teian.editor.shadowRoot.querySelectorAll("#content *[data-name = 'pb']")].map((element) => element.getAttribute("facs")).sort();
	
	if (scanNames.length === 0) {
		return "f0001.png"
	} else {
		return scanNames[scanNames.length -1];
	}
};

solirom.actions.generateNewScanName = (latestScanName) => {
	const volumeNumber = solirom.data.volumeNumber;
	
	latestScanName = latestScanName.replace("f", "").replace(".png", "");
	if (volumeNumber != "") {
		latestScanName = latestScanName.replace(volumeNumber + "/", "");
	}	
    latestScanName = parseInt(latestScanName);

    var newScanName = latestScanName + 1;
    if (String(newScanName).match("[6]{3}") !== null) {
    		newScanName++;
    }
    newScanName = "f" + String(newScanName).padStart(4, '0') + ".png";
	if (volumeNumber != "") {
		newScanName = volumeNumber + "/" + newScanName;	
	}    
    
    return newScanName;	
};

solirom.actions.updateImageViewerURL = (scanName) => {
    const workID = solirom.data.workID;
    
    var scanURL = "https://facs.solirom.ro/api/data/" + encodeURIComponent(workID + "/" + scanName) + "?cache=" + Date.now();
    
	const imageElement = document.querySelector(".box6 img");
	const imageParentElement = imageElement.parentElement;
	imageElement.remove();
	imageParentElement.insertAdjacentHTML("beforeend", solirom.data.templates.img({"src": scanURL}));    
    
    document.querySelector("#replace-scan").disabled = false;
    document.querySelector("#delete-scan").disabled = false;
};

solirom.actions.generateScanPath = (scanName) => {
	var scanPath = solirom.data.workID + "/" + scanName;
	
	scanPath = encodeURIComponent(scanPath);
	
	return scanPath;
};

solirom.actions.checkFileSize = (file) => {
    var isLegalSize = true;
    
    const fileSize = (file.size / (1024*1024)).toFixed(2);
    
    if (fileSize > 1) {
        solirom.data.messages.legalFileSize += "Fișierul " + file.name + " nu va fi încărcat în baza de date, deoarece este mai mare de 1 MB.";              
        isLegalSize = false;
    }   
    
    return isLegalSize;
};

solirom.controls.search = new Awesomplete(document.getElementById("search-string"), {
	replace: function(suggestion) {
		this.input.value = suggestion.label;
	},
	sort:  function() {
		return false;
	}
});
