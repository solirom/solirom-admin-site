import solirom from "/modules/solirom/solirom.js";
import Sortable from '/modules/sortable/sortable.esm.js';
import {request as githubClient} from "https://cdn.skypack.dev/@octokit/request";

solirom.data.search = {
	"result": {},
	"rawResult": {}
};
solirom.data.repos = {
	"bflr": {
		"indexName": "bflr"
	},	
	"cflr": {
		"client": {},
		"sha": {
			"index": ""
		},
		"transcriptionsPath": "transcriptions"
	},
	"lowResScan": {
		"basePath": "",
		"apiKey": ""
	},
	"highResScan": {
		"basePath": "",
		"apiKey": ""
	}
};
solirom.data.work = {
	"volumeNumber": "",
	"textSection": "body"
};
solirom.data.templates = {
	"volumeSelectorOption": solirom.actions.html`
		<option xmlns="http://www.w3.org/1999/xhtml" value="${props => props.value}">${props => props.label}</option>
	`,
	"pb": solirom.actions.html`
		<t-pb xmlns="http://www.w3.org/1999/xhtml" data-name="pb" data-ns="http://www.tei-c.org/ns/1.0" data-value="" slot="t-pb"  n="" facs="${props => props.facs}" cert="0" corresp="${props => props.transcriptionPath}"></t-pb>
	`,
	"img": solirom.actions.html`<img xmlns="http://www.w3.org/1999/xhtml" id="scan" src="${props => props.src}"/>`
};
solirom.data.scan = {
	"name": ""
};
solirom.data.messages = {
	"legalFileSize": ""
};

solirom.events.fileSave = new CustomEvent("fileSave");
solirom.events.fileDelete = new CustomEvent("fileDelete");

solirom.data.collection = localStorage.getItem("solirom.cflr.collection") || "all";

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

document.addEventListener("click", async (event) => {
    const target = event.target;
    
    if (target.matches("#add-scan")) {
    	document.getElementById("add-scan-fileupload").click();    	
	}
	
    if (target.matches("#replace-scan")) {
    	document.getElementById("replace-scan-fileupload").click();    	
	}
	
    if (target.matches("#delete-scan")) {
        var confirmMsg = confirm("Ștergeți scanul? Se va șterge și transcrierea scanului.");
        if (confirmMsg) {
			var scanName = solirom.data.scan.name;
			teian.editor.shadowRoot.querySelector("#content *[data-name = 'pb'][facs = '" + scanName + "']").remove();
			var transcriptionName = scanName.replace("f", "t");
			transcriptionName = transcriptionName.replace("png", "xml");					
			const transcriptionPath = solirom.actions.composePath([solirom.data.work.volumeNumber, solirom.data.repos.cflr.transcriptionsPath, transcriptionName], "/");
			
			try {
				document.querySelector("#image-viewer-loading-bar").show();				
				await fetch(solirom.data.repos.lowResScan.basePath + scanName, {
					method: "DELETE"
				});	
				document.querySelector("#scan").src = "";

				const result = await solirom.data.repos.cflr.client({
					method: "GET",
					path: transcriptionPath
				});
				
				const username = document.querySelector("kuberam-login-element").username;
				await solirom.data.repos.cflr.client({
					method: "DELETE",
					path: transcriptionPath,
					"sha": result.data.sha,
					"message": (new Date()).toISOString().split('.')[0] + ", " + username,
					"committer": {
						"email": username,
						"name": username
					},
				});
				document.querySelector("#image-viewer-loading-bar").hide();					

				await solirom.actions.saveWorkIndexFile();
			} catch (error) {
				console.error(error);
				alert("Eroare la ștergerea scanului.");
				return;
			}		
        }        
	}
	
    if (target.matches("#save-button")) {
		solirom.actions.saveWorkIndexFile();
	}

    if (target.matches("#zoom-in-button")) {
		const myImg = document.querySelector("#scan");
		const currWidth = myImg.clientWidth;
		if (currWidth == 5500) {
			return false;
		} else {
		  myImg.style.width = (currWidth + 100) + "px";
		}
	}
	
    if (target.matches("#zoom-out-button")) {
		const myImg = document.querySelector("#scan");
		const currWidth = myImg.clientWidth;
		if (currWidth == 100) {
			return false;
		} else {
		  myImg.style.width = (currWidth - 100) + "px";
		}
	}	
}, false);

document.addEventListener("beforeunload", event => {
    //event.preventDefault();
}, false);

document.addEventListener("awesomplete-selectcomplete", async (event) => {
	document.querySelector("#text-tools").style.display = "none";
	document.querySelector("label[for = 'volume-selector']").style.display = "none";
	const volumeSelector = document.querySelector("#volume-selector");
	volumeSelector.style.display = "none";
	volumeSelector.innerHTML = "";	
    
	const selectedItemValue = event.text.value;
	const selectedItemId = solirom.data.search.result[selectedItemValue];

	solirom.data.repos.lowResScan.basePath = solirom.data.search.rawResult.find(record => record.id === selectedItemId).fields["lowres-url"];
	solirom.data.repos.lowResScan.apiKey = solirom.data.search.rawResult.find(record => record.id === selectedItemId).fields["lowres-key"];

	const [user, repoName] = solirom.data.search.rawResult.find(record => record.id === selectedItemId).fields["text-url"].split('/');
	const key = solirom.data.search.rawResult.find(record => record.id === selectedItemId).fields["text-key"];
	solirom.data.repos.cflr.client = githubClient.defaults({
		headers: {
			authorization: "token " + key,
		},		
		url: "/repos/{owner}/{repo}/contents/{path}",
		owner: user,
		repo: repoName,
		branch: "master",
	});

	var result;
	try {
		result = await solirom.data.repos.cflr.client({
			method: "GET",
			path: "index.xml"
		});
		result = result.data;		
	} catch (error) {
		console.error(error);
		alert("Lucrarea nu poate fi încărcată.");
		return;
	}

	solirom.data.repos.cflr.sha.index = result.sha;
	const contents = solirom.actions.b64DecodeUnicode(result.content);
	solirom.data.work.volumeNumber = "";
	document.querySelector("#scan").src = "";
	teian.editor.reset();
	document.querySelector("#add-scan").disabled = true;
	document.querySelector("#replace-scan").disabled = true;
	document.querySelector("#delete-scan").disabled = true;			
	
	const indexDocument = (new DOMParser()).parseFromString(contents, "application/xml").documentElement;
	const workType = indexDocument.getAttribute("type");
	
	switch (workType) {
		case "uni-volume":
		teian.editor.setAttribute("status", "edit");
		teian.editor.setAttribute("src", "data:application/xml;" + contents);
		document.querySelector("#add-scan").disabled = false;
		
		document.querySelector("#text-tools").style.display = "inline";
		[...teian.editor.shadowRoot.querySelectorAll("#content *[data-name = 'text'] > *")].forEach((section) => section.style.display = "none");
		teian.editor.shadowRoot.querySelector("#content *[data-name = '" + solirom.data.work.textSection + "']").style.display = "inline";
		
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
	
	setTimeout(() => document.querySelector("#save-button").disabled = true, 100);
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
            
            fetch("/api/search/" + solirom.data.repos.bflr.indexName, {
                method: "POST",
                body: '{"size": 2000, "from": 0, "query": {"boost": 1, "query": "' + searchValue + '"}, "fields": ["siglum", "text-url", "text-key", "lowres-url", "lowres-key"]}'
            })
            .then((response) => response.json())
            .then((data) => {
				const processedData = Object.assign({}, ...data.hits.map(item => ({ [item.fields.siglum]: item.id })));
				solirom.data.search.result = processedData;
				solirom.data.search.rawResult = data.hits;
				solirom.controls.search.list = Object.keys(processedData).sort();
            })
		    .catch((error) => {
		        console.error('Error:', error);
		    });             
        }
    }
}, false);

document.addEventListener("change", async (event) => {
    const target = event.target;
    
    if (target.matches("#collection")) {
        const collection = target.value;
        
		solirom.data.collection = collection;
		localStorage.setItem("solirom.cflr.collection", collection);
    }
    
    if (target.matches("#add-scan-fileupload")) {
		solirom.data.scan.name = solirom.actions.generateNewScanName(solirom.actions.getLatestScanName());
        solirom.data.messages.legalFileSize = "";
        
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
		
		for (let file of files) {
			await solirom.actions.saveScan(file);
		}

		await solirom.actions.saveWorkIndexFile();
		setTimeout(() => document.querySelector("#save-button").disabled = true, 100);			
		
		if (solirom.data.messages.legalFileSize !== "") {
			alert("Următoarele fișiere nu au fost salvate deoarece sunt mai mari de 1MB:\n" + solirom.data.messages.legalFileSize); 
		}
    } 
    
    if (target.matches("#replace-scan-fileupload")) {
        solirom.data.messages.legalFileSize = "";
        
    	document.querySelector("#image-viewer-loading-bar").show();
        const file = target.files[0];
              
        const isLegalSize = solirom.actions.checkFileSize(file);

        if (!isLegalSize) {
            document.querySelector("#image-viewer-loading-bar").hide();
			alert(solirom.data.messages.legalFileSize); 
			           
            return;
        }              

		const formData = new FormData();
		formData.append("file", file);    	
    	
		const currentScanName = solirom.data.scan.name;
		
		try {
			await fetch(solirom.data.repos.lowResScan.basePath + currentScanName, {
				method: "PUT",
				body: formData
			});
	
			solirom.actions.updateImageViewerURL(currentScanName);	
			document.querySelector("#image-viewer-loading-bar").hide();	
		} catch (error) {
			console.error(error);
			alert("Eroare la înlocuirea scanului.");
			return;
		}		
	}
	
    if (target.matches("input[name = 'sectionSelectorButton']")) {
        const textSection = target.value;
        
        solirom.data.work.textSection = textSection;
        
        [...teian.editor.shadowRoot.querySelectorAll("#content *[data-name = 'text'] > *")].forEach((section) => section.style.display = 'none');
        teian.editor.shadowRoot.querySelector("#content *[data-name = '" + solirom.data.work.textSection + "']").style.display = 'inline';
	}	
	
	if (target.matches("#volume-selector")) {
		const volumeNumber = target.value;

		if (volumeNumber === "") {
			return;
		}
		solirom.data.work.volumeNumber = volumeNumber;
		const volumeMetadataFilePath = solirom.actions.composePath([volumeNumber, "index.xml"], "/");
		solirom.data.workMetadataUrl = volumeMetadataFilePath;

		var result;
		try {
			result = await solirom.data.repos.cflr.client({
				method: "GET",
				path: volumeMetadataFilePath
			});
			result = result.data;		
		} catch (error) {
			console.error(error);
			alert("Lucrarea nu poate fi încărcată.");
			return;
		}
	
		solirom.data.repos.cflr.sha.index = result.sha;
		const contents = solirom.actions.b64DecodeUnicode(result.content);

		teian.editor.setAttribute("status", "edit");
		teian.editor.setAttribute("src", "data:application/xml;" + contents);
		document.querySelector("#text-tools").style.display = "inline";
		[...teian.editor.shadowRoot.querySelectorAll("#content *[data-name = 'text'] > *")].forEach((section) => section.style.display = "none");
		teian.editor.shadowRoot.querySelector("#content *[data-name = '" + solirom.data.work.textSection + "']").style.display = "inline"; 

		document.querySelector("#scan").src = "";
		document.querySelector("#add-scan").disabled = false;
		document.querySelector("#replace-scan").disabled = false;
		setTimeout(() => document.querySelector("#save-button").disabled = true, 100);   
	}
}, false);

solirom.actions.saveWorkIndexFile = async () => {
	document.querySelector("#editor-loading-bar").style.display = "inline";
	const username = document.querySelector("kuberam-login-element").username;
	const indexFilePath = solirom.actions.composePath([solirom.data.work.volumeNumber, "index.xml"], "/");
	var data = teian.utils.unloadData();

	var result;
	try {
		result = await solirom.data.repos.cflr.client({
			method: "PUT",
			path: indexFilePath,
			content: solirom.actions.b64EncodeUnicode(data),
			"sha": solirom.data.repos.cflr.sha.index,
			"message": (new Date()).toISOString().split('.')[0] + ", " + username,
			"committer": {
				"email": username,
				"name": username
			},
		});
		result = result.data.content;		
	} catch (error) {
		console.error(error);
		alert("Lucrarea nu poate fi salvată.");
		return;
	}

	solirom.data.repos.cflr.sha.index = result.sha;

	teian.editor.setAttribute("status", "edit");
	document.querySelector("#editor-loading-bar").style.display = "none";	
	setTimeout(() => document.querySelector("#save-button").disabled = true, 100);	
};

solirom.actions.getLatestScanName = () => {
	const scanNames = [...teian.editor.shadowRoot.querySelectorAll("#content *[data-name = 'pb']")].map((element) => element.getAttribute("facs")).sort();
	
	if (scanNames.length === 0) {
		return "f0000.png"
	} else {
		return scanNames[scanNames.length -1];
	}
};

solirom.actions.generateNewScanName = (latestScanName) => {
	const volumeNumber = solirom.data.work.volumeNumber;
	
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
	const scanURL = solirom.data.repos.lowResScan.basePath + encodeURIComponent(scanName) + "?cache=" + Date.now();    
	
	const imageElement = document.querySelector("#scan");
	const imageParentElement = imageElement.parentElement;
	imageElement.remove();
	imageParentElement.insertAdjacentHTML("beforeend", solirom.data.templates.img({"src": scanURL}));
    
    document.querySelector("#replace-scan").disabled = false;
    document.querySelector("#delete-scan").disabled = false;
};

solirom.actions.checkFileSize = (file) => {
    var isLegalSize = true;
    
    const fileSize = (file.size / (1024*1024)).toFixed(2);
    
    if (fileSize > 1) {
        solirom.data.messages.legalFileSize += file.name + "\n";              
        isLegalSize = false;
    }   
    
    return isLegalSize;
};

solirom.actions.saveScan = async (file) => {
	document.querySelector("#image-viewer-loading-bar").show();	
	const isLegalSize = solirom.actions.checkFileSize(file);
	
	if (!isLegalSize) {
		document.querySelector("#image-viewer-loading-bar").hide();

		return;    
	}
	const formData = new FormData();
	formData.append("file", file);
				
	var newScanName = solirom.data.scan.name;
	solirom.data.scan.name = solirom.actions.generateNewScanName(newScanName);
	
	try {
		await fetch(solirom.data.repos.lowResScan.basePath + newScanName, {
			method: "POST",
			body: formData
		});

		var newTranscriptionName = newScanName.replace("f", "t");
		newTranscriptionName = newTranscriptionName.replace("png", "xml");
		const newTranscriptionPath = solirom.actions.composePath([solirom.data.work.volumeNumber, solirom.data.repos.cflr.transcriptionsPath, newTranscriptionName], "/");
		const textSection = teian.editor.shadowRoot.querySelector("#content *[data-name = '" + solirom.data.work.textSection + "']");
		textSection.insertAdjacentHTML("beforeend", solirom.data.templates.pb({"facs": newScanName, "transcriptionPath": newTranscriptionPath}));
		
		const username = document.querySelector("kuberam-login-element").username;
		const entryPath = "TODO";
		const transcriptionFile = solirom.data.templates.transcriptionFile({"label": "", "href": entryPath});
		await solirom.data.repos.cflr.client({
			method: "PUT",
			path: newTranscriptionPath,
			content: solirom.actions.b64EncodeUnicode(transcriptionFile),
			"message": (new Date()).toISOString().split('.')[0] + ", " + username,
			"committer": {
				"email": username,
				"name": username
			},
		});

		document.querySelector("#image-viewer-loading-bar").hide();	
	} catch (error) {
		console.error(error);
		document.querySelector("#image-viewer-loading-bar").hide();		
		alert("Eroare la salvarea scanului.");
		return;
	}
};

solirom.actions.composePath = (steps, separator) => {
	return steps.filter(Boolean).join(separator);
};

solirom.controls.search = new Awesomplete(document.getElementById("search-string"), {
	replace: function(suggestion) {
		this.input.value = suggestion.label;
	},
	sort:  function() {
		return false;
	}
});
