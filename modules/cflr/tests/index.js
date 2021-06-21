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
	"textSection": "body",
	"id": ""
};
solirom.data.transcription = {
	"path": "",
	"contents": ""
};
solirom.data.templates = {
	"volumeSelectorOption": solirom.actions.generateMarkup`
		<option xmlns="http://www.w3.org/1999/xhtml" value="${props => props.value}">${props => props.label}</option>
	`,
	"pb": solirom.actions.generateMarkup`
		<t-pb xmlns="http://www.w3.org/1999/xhtml" data-name="pb" data-ns="http://www.tei-c.org/ns/1.0" data-value="" slot="t-pb"  n="" facs="${props => props.facs}" cert="unknown" corresp="${props => props.transcriptionPath}"></t-pb>
	`,
	"img": solirom.actions.generateMarkup`<img xmlns="http://www.w3.org/1999/xhtml" id="scan" src="${props => props.src}"/>`
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

document.querySelector("#metadata-editor-container").addEventListener("teian-file-edited", event => {
    document.querySelector("#save-button").disabled = false;
}, false);

document.addEventListener("kuberam.loginElement.events.logout", event => {
	solirom.actions.resetUI();	
});

document.addEventListener("teian-file-opened", event => {
});

document.addEventListener("click", async (event) => {
    const target = event.target;
    
    if (target.matches("#add-scan")) {
    	document.getElementById("add-scan-fileupload").click();    	
	}
	
    if (target.matches("#replace-scan")) {
    	document.getElementById("replace-scan-fileupload").click();    	
	}
	
    if (target.matches("#delete-scan")) {
		solirom.actions.deleteScan();        
	}
	
    if (target.matches("#save-button")) {
		await solirom.actions.saveMetadata();
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
	if (Object.keys(solirom.data.search.result).length !== 0) {
		solirom.actions.resetUI();	
	}
    
	const selectedItemValue = event.text.value;
	const selectedItemId = solirom.data.search.result[selectedItemValue];

	solirom.data.repos.lowResScan.basePath = solirom.data.search.rawResult.find(record => record.id === selectedItemId).fields["lowres-url"];
	solirom.data.repos.lowResScan.apiKey = solirom.data.search.rawResult.find(record => record.id === selectedItemId).fields["lowres-key"];

	const [user, repoName] = solirom.data.search.rawResult.find(record => record.id === selectedItemId).fields["text-url"].split('/');
	solirom.data.work.id = repoName;
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
			path: "",
			headers: {
				'If-None-Match': ''
			  }	
		});
	} catch (error) {
		console.error(error);
		alert("Lucrarea nu poate fi încărcată.");

		return;
	}	
	var volumeNumbers = result.data.filter((item) => {return item.name.match(/\d+/g)}).map((item) => item.name);	

	solirom.data.work.volumeNumber = "";
	solirom.controls.metadataEditor.reset();
	solirom.actions.resetScanViewer();

	if (volumeNumbers.length === 0) {
		try {
			result = await solirom.data.repos.cflr.client({
				method: "GET",
				path: "index.xml",
				headers: {
					'If-None-Match': ''
				  }	
			});
			result = result.data;		
		} catch (error) {
			console.error(error);
			alert("Lucrarea nu poate fi încărcată.");
	
			return;
		}
		
		const contents = solirom.actions.b64DecodeUnicode(result.content);

		solirom.controls.metadataEditor.setAttribute("status", "edit");
		solirom.controls.metadataEditor.setAttribute("src", "data:application/xml;" + contents);
		document.querySelector("#add-scan").disabled = false;
		
		document.querySelector("#text-tools").style.display = "inline";
		const metadataEditorShadowRoot = solirom.controls.metadataEditor.shadowRoot;
		[...metadataEditorShadowRoot.querySelectorAll("#content *[data-name = 'text'] > *")].forEach((section) => section.style.display = "none");
		metadataEditorShadowRoot.querySelector("#content *[data-name = '" + solirom.data.work.textSection + "']").style.display = "inline";
		
		[...metadataEditorShadowRoot.querySelectorAll("*[data-name = 'front'], *[data-name = 'back']")].forEach((section => {
			section.classList.add("list-group");
			[...section.querySelectorAll("*[data-name = 'pb']")].forEach((pb) => {
				pb.classList.add("list-group-item");
			});
			Sortable.create(section, {
				animation: 350
			});					
		}));
	} else {
		document.querySelector("#text-tools").style.display = "inline";

		const volumeSelector = document.querySelector("#volume-selector");
		volumeNumbers = volumeNumbers.map(
			(item) => {
				return solirom.data.templates.volumeSelectorOption({"label": item, "value": item});
		}).filter(Boolean).join("");
		volumeNumbers = solirom.data.templates.volumeSelectorOption({"label": "", "value": ""}) + volumeNumbers;

		volumeSelector.style.display = "inline";
		document.querySelector("label[for = 'volume-selector']").style.display = "inline";
		
		volumeSelector.innerHTML = volumeNumbers;
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
			await solirom.actions.addScan(file);
		}

		await solirom.actions.saveMetadata();
		setTimeout(() => document.querySelector("#save-button").disabled = true, 100);			
		
		if (solirom.data.messages.legalFileSize !== "") {
			alert("Următoarele fișiere nu au fost salvate deoarece sunt mai mari de 1MB:\n" + solirom.data.messages.legalFileSize); 
		}
    } 
    
    if (target.matches("#replace-scan-fileupload")) {
        solirom.data.messages.legalFileSize = "";
        
    	solirom.controls.loadingSpinner.show();
        const file = target.files[0];
              
        const isLegalSize = solirom.actions.checkFileSize(file);

        if (!isLegalSize) {
			console.error(error);
			alert(solirom.data.messages.legalFileSize); 
			           
            return;
        }       
		
		const username = document.querySelector("kuberam-login-element").username;		
		const imageAsDataURL = await solirom.actions.convertImageFileToWebP(file);
		const currentScanName = solirom.data.scan.name;
		const scanURL = solirom.actions.composePath([solirom.data.work.volumeNumber, currentScanName], "/");
		const sha = await solirom.actions.getSHA(scanURL);

		try {
			await solirom.data.repos.cflr.client({
				"method": "PUT",
				"path": scanURL,
				"content": solirom.actions.b64EncodeUnicode(imageAsDataURL),
				"sha": sha,
				"message": (new Date()).toISOString().split('.')[0] + ", " + username,
				"committer": {
					"email": username,
					"name": username
				},
			});

			solirom.actions.updateImageViewerURL(currentScanName);	
			solirom.controls.loadingSpinner.hide();				
		} catch (error) {
			console.error(error);
			alert("Eroare la înlocuirea scanului.");
	
			return;
		}		
	}
	
    if (target.matches("input[name = 'sectionSelectorButton']")) {
        const textSection = target.value;
        
        solirom.data.work.textSection = textSection;
        
		const metadataEditorShadowRoot = solirom.controls.metadataEditor.shadowRoot;
        [...metadataEditorShadowRoot.querySelectorAll("#content *[data-name = 'text'] > *")].forEach((section) => section.style.display = 'none');
        metadataEditorShadowRoot.querySelector("#content *[data-name = '" + solirom.data.work.textSection + "']").style.display = 'inline';
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
				path: volumeMetadataFilePath,
				headers: {
					'If-None-Match': ''
				  }	
			});
			result = result.data;		
		} catch (error) {
			console.error(error);
			alert("Lucrarea nu poate fi încărcată.");

			return;
		}
	
		const contents = solirom.actions.b64DecodeUnicode(result.content);

		solirom.controls.metadataEditor.setAttribute("status", "edit");
		solirom.controls.metadataEditor.setAttribute("src", "data:application/xml;" + contents);
		document.querySelector("#text-tools").style.display = "inline";

		const metadataEditorShadowRoot = solirom.controls.metadataEditor.shadowRoot;
		[...metadataEditorShadowRoot.querySelectorAll("#content *[data-name = 'text'] > *")].forEach((section) => section.style.display = "none");
		metadataEditorShadowRoot.querySelector("#content *[data-name = '" + solirom.data.work.textSection + "']").style.display = "inline"; 

		document.querySelector("#scan").src = "";
		document.querySelector("#add-scan").disabled = false;
		document.querySelector("#replace-scan").disabled = false;
		document.querySelector("#zoom-in-button").disabled = false;
		document.querySelector("#zoom-out-button").disabled = false;		
		setTimeout(() => document.querySelector("#save-button").disabled = true, 100);   
	}
}, false);

solirom.actions.saveMetadata = async () => {
	solirom.controls.loadingSpinner.show();
	const username = document.querySelector("kuberam-login-element").username;
	const indexFilePath = solirom.actions.composePath([solirom.data.work.volumeNumber, "index.xml"], "/");
	var data = teian.utils.unloadData();
	const sha = await solirom.actions.getSHA(indexFilePath);

	var result;
	try {
		result = await solirom.data.repos.cflr.client({
			"method": "PUT",
			"path": indexFilePath,
			"content": solirom.actions.b64EncodeUnicode(data),
			"sha": sha,
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

	solirom.controls.metadataEditor.setAttribute("status", "edit");
	solirom.controls.loadingSpinner.hide();	
	setTimeout(() => document.querySelector("#save-button").disabled = true, 100);	
};

solirom.actions.getLatestScanName = () => {
	const scanNames = [...solirom.controls.metadataEditor.shadowRoot.querySelectorAll("#content *[data-name = 'pb']")].map((element) => element.getAttribute("facs")).sort();
	
	if (scanNames.length === 0) {
		return "f0000.b64"
	} else {
		return scanNames[scanNames.length -1];
	}
};

solirom.actions.generateNewScanName = (latestScanName) => {
	const volumeNumber = solirom.data.work.volumeNumber;
	
	latestScanName = latestScanName.match(/\d+/)[0];
	if (volumeNumber != "") {
		latestScanName = latestScanName.replace(volumeNumber + "/", "");
	}	
    latestScanName = parseInt(latestScanName);

    var newScanName = latestScanName + 1;
    if (String(newScanName).match("[6]{3}") !== null) {
    		newScanName++;
    }
    newScanName = "f" + String(newScanName).padStart(4, '0') + ".b64";
	if (volumeNumber != "") {
		newScanName = volumeNumber + "/" + newScanName;	
	}    
    
    return newScanName;	
};

solirom.actions.updateImageViewerURL = async (scanName) => {
    solirom.controls.loadingSpinner.show();	
	const scanURL = solirom.actions.composePath([solirom.data.work.volumeNumber, scanName], "/");

	var result;
	try {
		result = await solirom.data.repos.cflr.client({
			method: "GET",
			path: scanURL,
			headers: {
				'If-None-Match': ''
			  }	
		});
		result = result.data;		
	} catch (error) {
		console.error(error);
		alert("Lucrarea nu poate fi încărcată.");

		return;
	}
	const scanAsDataURL = solirom.actions.b64DecodeUnicode(result.content);

	const imageElement = document.querySelector("#scan");
	const imageParentElement = imageElement.parentElement;
	imageElement.remove();
	imageParentElement.insertAdjacentHTML("beforeend", solirom.data.templates.img({"src": scanAsDataURL}));
    
    document.querySelector("#replace-scan").disabled = false;
    document.querySelector("#delete-scan").disabled = false;

    solirom.controls.loadingSpinner.hide(); 	
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

solirom.actions.addScan = async (file) => {
	solirom.controls.loadingSpinner.show();	
	const isLegalSize = solirom.actions.checkFileSize(file);
	
	if (!isLegalSize) {
		solirom.controls.loadingSpinner.hide();

		return;    
	}
	const username = document.querySelector("kuberam-login-element").username;

	const scanAsDataURL = await solirom.actions.convertImageFileToWebP(file);

	var newScanName = "scans/" + solirom.data.scan.name;
	solirom.data.scan.name = solirom.actions.generateNewScanName(newScanName);
	const scanURL = solirom.actions.composePath([solirom.data.work.volumeNumber, newScanName], "/");

	try {
		await solirom.data.repos.cflr.client({
			"method": "PUT",
			"path": scanURL,
			"content": solirom.actions.b64EncodeUnicode(scanAsDataURL),
			"message": (new Date()).toISOString().split('.')[0] + ", " + username,
			"committer": {
				"email": username,
				"name": username
			},
		});
	} catch (error) {
		console.error(error);
		alert("Eroare la salvarea scanului.");

		return;
	}	

	const newTranscriptionName = "t" + newScanName.match(/\d+/)[0] + ".xml";
	const newTranscriptionPath = solirom.actions.composePath([solirom.data.work.volumeNumber, solirom.data.repos.cflr.transcriptionsPath, newTranscriptionName], "/");

	const textSection = solirom.controls.metadataEditor.shadowRoot.querySelector("#content *[data-name = '" + solirom.data.work.textSection + "']");
	textSection.insertAdjacentHTML("beforeend", solirom.data.templates.pb({"facs": newScanName, "transcriptionPath": newTranscriptionPath}));
	
	try {
		await solirom.data.repos.cflr.client({
			"method": "PUT",
			"path": newTranscriptionPath,
			"content": solirom.actions.b64EncodeUnicode(solirom.data.templates.transcriptionFile),
			"message": (new Date()).toISOString().split('.')[0] + ", " + username,
			"committer": {
				"email": username,
				"name": username
			},
		});
	} catch (error) {
		console.error(error);
		alert("Eroare la salvarea transcrierii.");

		return;
	}

	solirom.controls.loadingSpinner.hide();		
};

solirom.actions.deleteScan = async () => {
	var confirmMsg = confirm("Ștergeți scanul? Se va șterge și transcrierea scanului.");

	if (confirmMsg) {
		const username = document.querySelector("kuberam-login-element").username;
		const scanName = solirom.data.scan.name;
		const scanURL = solirom.actions.composePath([solirom.data.work.volumeNumber, scanName], "/");
		const scanSha = await solirom.actions.getSHA(scanURL);

		solirom.controls.loadingSpinner.show();			

		try {
			await solirom.data.repos.cflr.client({
				"method": "DELETE",
				"path": scanURL,
				"sha": scanSha,
				"message": (new Date()).toISOString().split('.')[0] + ", " + username,
				"committer": {
					"email": username,
					"name": username
				},
			});
		} catch (error) {
			console.error(error);
			alert("Eroare la ștergerea scanului.");
	
			return;
		}
		document.querySelector("#scan").src = "";	
		
		const transcriptionName = "t" + scanName.match(/\d+/)[0] + ".xml";
		solirom.data.transcription.path = solirom.actions.composePath([solirom.data.work.volumeNumber, solirom.data.repos.cflr.transcriptionsPath, transcriptionName], "/");
		try {
			await solirom.actions.deleteTranscription();
		} catch (error) {
			console.error(error);
			alert("Eroare la ștergerea transcrierii.");

			return;
		}

		try {
			await solirom.actions.saveMetadata();
		} catch (error) {
			console.error(error);
			alert("Eroare la salvarea metadatelor.");
			
			return;
		}

		solirom.controls.metadataEditor.shadowRoot.querySelector("#content *[data-name = 'pb'][facs = '" + scanName + "']").remove();		
		solirom.controls.loadingSpinner.hide();		
	}
};

/**
 * Deletes the selected transcription
 * @public
 * @return void
 */ 
solirom.actions.deleteTranscription = async () => {
	const username = document.querySelector("kuberam-login-element").username;

	await solirom.actions._globalGetTranscription();
	
	const transcriptionDocument = (new DOMParser()).parseFromString(solirom.data.transcription.contents, "application/xml").documentElement;
	const entryIncludeElements = transcriptionDocument.querySelectorAll("*|include");
	const transcriptionSha = await solirom.actions.getSHA(solirom.data.transcription.path);

	try {
		await solirom.data.repos.cflr.client({
			"method": "DELETE",
			"path": solirom.data.transcription.path,
			"sha": transcriptionSha,
			"message": (new Date()).toISOString().split('.')[0] + ", " + username,
			"committer": {
				"email": username,
				"name": username
			},
		});	
	} catch (error) {
		console.error(error);
		alert("Eroare la ștergerea transcrierii.");

		return;
	}	

	try {
		for (const entryIncludeElement of entryIncludeElements) {
			solirom.data.entry.path = solirom.actions.composePath([solirom.data.work.volumeNumber, solirom.data.repos.cflr.transcriptionsPath, entryIncludeElement.getAttribute("href")], "/");
			const entryMetadata = await solirom.actions._getEntry();

			await solirom.data.repos.cflr.client({
				"method": "DELETE",
				"path": entryMetadata.path,
				"sha": entryMetadata.sha,
				"message": (new Date()).toISOString().split('.')[0] + ", " + username,
				"committer": {
					"email": username,
					"name": username
				},
			});
		}
	} catch (error) {
		console.error(error);
		alert("Eroare la ștergerea intrărilor asociate transcrierii.");

		return;
	}	
};

solirom.actions._globalGetTranscription = async () => {
	const result = await solirom.actions._getTranscription(solirom.data.transcription.path);

	solirom.data.transcription.contents = result.contents;		
};

solirom.actions._getTranscription = async (path) => {
	var result;
	try {
		result = await solirom.data.repos.cflr.client({
			method: "GET",
			path: path,
			headers: {
				'If-None-Match': ''
			  }			
		});
		result = result.data;		
	} catch (error) {
		console.error(error);
		alert("Eroare la încărcarea transcrierii.");
		return;
	}

    return {
        "path": path,
        "sha": result.sha,
        "contents": solirom.actions.b64DecodeUnicode(result.content)
    };	
};

solirom.actions.composePath = (steps, separator) => {
	return steps.filter(Boolean).join(separator);
};

solirom.actions.displayMetadataEditor = () => {
    document.querySelector("#metadata-editor-container").style.display = "inline-block";
    document.querySelector("#data-editor-container").style.display = "none";	
};

solirom.actions.displayDataEditor = () => {
    document.querySelector("#metadata-editor-container").style.display = "none";
    document.querySelector("#data-editor-container").style.display = "inline-block";	
};
solirom.actions.getSHA = async (path) => {
	var sha = "";
	try {
		sha = await solirom.data.repos.cflr.client({
			method: "HEAD",
			path: path,
			headers: {
				'If-None-Match': ''
			  }	
		});
		sha = sha.headers.etag;
		sha = sha.replace("W/", "").replaceAll('"', '').trim();
	} catch (error) {
	}	

	return sha;
};
solirom.actions.resetUI = () => {
	solirom.controls.metadataEditor.reset();
	const dataEditor = document.querySelector("data-editor");
	dataEditor.transcriptionEditor.reset();
	dataEditor.entryEditor.reset();
	solirom.actions.resetScanViewer();
	solirom.actions.displayMetadataEditor();
};
//start functions related to the image viewer
solirom.actions.resetScanViewer = () => {
	document.querySelector("#scan").src = "";	
	document.querySelector("#add-scan").disabled = true;
	document.querySelector("#replace-scan").disabled = true;
	document.querySelector("#delete-scan").disabled = true;
	document.querySelector("#zoom-in-button").disabled = true;
	document.querySelector("#zoom-out-button").disabled = true;
};
solirom.actions.convertImageFileToWebP = async (file) => {

	  const imageAsDataURL = await new Promise((resolve, reject) => {
		let rawImage = new Image();
	
		rawImage.addEventListener("load", () => {
		  resolve(rawImage);
		});
	
		rawImage.src = URL.createObjectURL(file);
	  }).
	  then((rawImage) => {
		return new Promise((resolve, reject) => {
		  let canvas = document.createElement("canvas");
		  let ctx = canvas.getContext("2d");
	
		  canvas.width = rawImage.width;
		  canvas.height = rawImage.height;
		  ctx.drawImage(rawImage, 0, 0);
	
		  resolve(canvas.toDataURL("image/webp", 1));
		});
	  });

	  var convertedImgSize = Math.round(imageAsDataURL.length * 3 / 4) ;	  
	  convertedImgSize = (convertedImgSize / (1024*1024)).toFixed(3);
	  const originalImgSize = (file.size / (1024*1024)).toFixed(3);
	  console.log(`${file.name}: ${originalImgSize} MB > ${convertedImgSize} MB`);

	  return imageAsDataURL;
};
//end functions related to the image viewer

solirom.controls.search = new Awesomplete(document.getElementById("search-string"), {
	replace: function(suggestion) {
		this.input.value = suggestion.label;
	},
	sort:  function() {
		return false;
	}
});
solirom.controls.metadataEditor = document.querySelector("#metadata-editor");
