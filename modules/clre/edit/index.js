window.solirom = {};

solirom.events = {};
solirom.actions = {};
solirom.data = {};
solirom.controls = {};

solirom.data.searchResult = {};
solirom.data.uuid = "";
solirom.data.selectedItemId = null;
solirom.data.selectedItemSiblingId = null;
solirom.data.bflrFilePath = "solirom%2Fbflr-data%2Fcontents%2F";
solirom.data.bflrIndexName = "bflr";
solirom.data.facsServerApiKey = "e61fec83-8665-4742-87b6-b626f9444bb0";
solirom.data.workID = "";
solirom.data.selectedPage = "";

DaBi("#selected-page", solirom.data, "selectedPage");

solirom.events.fileSave = new CustomEvent("fileSave");
solirom.events.fileDelete = new CustomEvent("fileDelete");
solirom.events.selectResultItem = new CustomEvent("kuberam.search.result.webc-select.item");

document.addEventListener("fileSave", event => {
    document.querySelector("#save-button").disabled = true;
}, false);

document.addEventListener("fileDelete", event => {
    document.querySelector("#save-button").disabled = true;
    solirom.data.selectedItemId = null;
    teian.editor.setAttribute("src", "");
}, false);

document.addEventListener("teian-file-edited", event => {
    document.querySelector("#save-button").disabled = false;
}, false);

document.addEventListener('solirom-range-value-changed', event => {
	const volumeNumber = event.detail.padStart(2, '0');
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
		solirom.actions.displayFacsimileLinks((new DOMParser()).parseFromString(data, 'application/xml').documentElement);
	})
	.catch((error) => {
		console.error('Error:', error);
	});	
});

document.addEventListener('kuberam.loginElement.events.logout', event => {
    document.querySelector("#search-result").innerHTML = "";
    document.querySelector("#entries-counter").value = 0;
    teian.editor.setAttribute("src", "");
});

document.addEventListener("teian-file-opened", event => {
});

document.addEventListener("teian-file-edited", event => {
    document.querySelector("#save-button").disabled = false;
}, false);

document.addEventListener("awesomplete-selectcomplete", event => {
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
			const indexDocument = (new DOMParser()).parseFromString(data, 'application/xml').documentElement;
			solirom.data.workID = indexDocument.getAttribute("xml:id");
						
            if (data.match(/xi:include href="index/) === null) {
                solirom.actions.displayFacsimileLinks(indexDocument);
            } else {
            		const indexDocument = (new DOMParser()).parseFromString(data, 'application/xml').documentElement;
				solirom.data.workID = indexDocument.getAttribute("xml:id");
            		const volumeNumbers = [...indexDocument.querySelectorAll("TEI > *|include")].map(item => parseInt(item.getAttribute("href").match(/\d+/g)[0]));
				const rangeFormControl = document.querySelector("solirom-range");
				rangeFormControl.setValues(volumeNumbers);				
				rangeFormControl.setAttribute("values", volumeNumbers);
            }   
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
            searchValue = searchValue + "AND collection:CLRE";
            
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

document.addEventListener("click", event => {
    const target = event.target;
    
    if (target.matches("#previous-image")) {
    		const selectedPage = solirom.data.selectedPage;
			
    		const previousFacsButton = document.querySelector("#facsimile-links button[data-n = '" + selectedPage + "']").previousSibling;
    		if (previousFacsButton !== null) {
			solirom.actions.displayFacsimile(previousFacsButton); 
		}
    } 
    
    if (target.matches("#next-image")) {
    		const selectedPage = solirom.data.selectedPage;
			
    		const nextFacsButton = document.querySelector("#facsimile-links button[data-n = '" + selectedPage + "']").nextSibling;
    		if (nextFacsButton !== null) {
			solirom.actions.displayFacsimile(nextFacsButton); 
		}
    }    
    
    if (target.matches("#facsimile-links button")) {
    		solirom.actions.displayFacsimile(target);   
    }
           	
}, false);

solirom.actions.saveFile = () => {
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
        		alert("Intrarea a fost salvată."); 				
        }
    }, function(error) {
        alert("Eroare la salvarea intrării.");
        console.error('Error:', error);
    });    
}

solirom.actions.displayFacsimileLinks = (indexDocument) => {
	const facsimileElements = [...indexDocument.querySelectorAll("pb")].map((item) => {
		const n = item.getAttribute('n');
		return `<button data-facs="${item.getAttribute('facs')}" data-n="${n}">${n}</button>`;
	}).join("");

	document.querySelector("#facsimile-links").innerHTML = facsimileElements;    
};

solirom.actions.displayFacsimile = (element) => {
    var facsName = element.dataset.facs;
    const workID = solirom.data.workID;
    solirom.data.selectedPage = element.textContent;
    
    var facsUrl = "http://facs.solirom.ro/convert?type=png&file=/" + workID + "/" + facsName;
	const havePNGimages = ["A100029", "A100058/03", "A100058/06", "A100058/07", "A100059/01", "A100059/07"].some(element => facsUrl.includes(element));
    if (havePNGimages) {
        facsUrl = facsUrl.replace("tif", "png");
    }    
    
    document.querySelector(".box6 img").src = facsUrl + "&key=" + solirom.data.facsServerApiKey;
    //solirom.actions.selectPageBreak(element);
};

solirom.actions.selectPageBreak = (element) => {
    const hostElement = element.hostElement;
    var content = teian.editor.shadowRoot.querySelector("#content");
    content.querySelectorAll(":scope *[data-name = 'pb']").forEach((pbElement) => pbElement.classList.remove("selected"));
    hostElement.classList.add("selected");
};

solirom.controls.search = new Awesomplete(document.getElementById("search-string"), {
	replace: function(suggestion) {
		this.input.value = suggestion.label;
	},
	sort:  function() {
		return false;
	}
});
