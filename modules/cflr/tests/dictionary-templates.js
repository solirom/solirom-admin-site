import Sortable from '/modules/sortable/sortable.esm.js';
import * as soliromUtils from "/modules/utils/solirom-utils.js";
//import MiniEditorComponent from '/modules/solirom-mini-editor/solirom-mini-editor.js';
import LanguageSelectorComponent from '/modules/solirom-language-selector/solirom-language-selector.js';

solirom.data.templates.transcriptionFile = `<ab xmlns="http://www.tei-c.org/ns/1.0" xmlns:xi="http://www.w3.org/2001/XInclude" type="aggregation"/>`
;
solirom.data.templates.headwordForm =
    `<t-form data-name="form" data-ns="http://www.tei-c.org/ns/1.0" data-value="" slot="t-form" type="headword">
        <t-orth data-name="orth" data-ns="http://www.tei-c.org/ns/1.0" data-value="" slot="t-orth" n="" xml:lang="ro-x-accent-upcase-vowels"></t-orth>
        <t-gramgrp data-name="gramGrp" data-ns="http://www.tei-c.org/ns/1.0" data-value="" slot="t-gramgrp"></t-gramgrp>
    </t-form>
    `
;
solirom.data.templates.entryFile =
    solirom.actions.generateMarkup`<body xmlns="http://www.tei-c.org/ns/1.0" xml:id="${props => props.id}">
        <entry type="lemma">
            <form type="headword">
                <orth n="" xml:lang="ro-x-accent-upcase-vowels"/>
                <gramGrp/>
            </form>        
        </entry>
        <note type="persons">
            <editor role="transcriber">${props => props.author}</editor>
        </note>
        <entryFree>
            <form type="current-orth">
                <orth xml:lang="ro-x-accent-upcase-vowels"/>
            </form>
            <idno type="lexicon"/>
        </entryFree>                
    </body>`
;
solirom.data.templates.entryReference =
    solirom.actions.generateMarkup`<t-include data-name="xi:include" data-ns="http://www.w3.org/2001/XInclude" data-value="" slot="t-include" href="${props => props.entryPath}" xpointer="/1/1" label="${props => props.label}" cert="${props => props.cert}" class="list-group-item" draggable="true"></t-include>`
;
solirom.data.templates.editor =
    solirom.actions.generateMarkup`<t-editor data-name="editor" data-ns="http://www.tei-c.org/ns/1.0" data-value="${props => props.username}" slot="t-editor" role="${props => props.userRole}"></t-editor>`
; 
solirom.data.templates.lexiconEntry = 
    solirom.actions.generateMarkup`<entryFree xmlns="http://www.tei-c.org/ns/1.0" xml:id="${props => props.id}"><form><orth n="${props => props.homonymNumber}" xml:lang="ro-x-accent-upcase-vowels">${props => props.headword}</orth><gramGrp>${props => props.gramGrp}</gramGrp></form></entryFree>

    `
; 
solirom.data.templates.sicTemplate =
    solirom.actions.generateMarkup`
        <sic xmlns="http://www.tei-c.org/ns/1.0">${props => props.selection}</hi>
    `
;      
solirom.data.entry = {
	"path": ""
};

export default class DataEditorComponent extends HTMLElement {
    constructor() {
        super();
        
        this.attachShadow({mode: 'open'});
        const shadowRoot = this.shadowRoot;
        shadowRoot.innerHTML =
            `
                <style>
                    #content {
                        background: white;    
                        display: grid;
                        grid-template-columns: 210px 1fr; 
                        column-gap: 10px;
                        row-gap: 5px;
                        height: 990px; 
                    }                
                    #content, option {
                        font-size: 12px;
                    }
                    #master > * {
                        display: inline-block;
                    }
                    #master-toolbar {
                        padding: 5px;
                        width: 190px
                    }
                    ${soliromUtils.awesomeButtonStyle}   
                    #delete-entry-reference-button {
                        background-color: #98d964;
                    } 
                    #delete-multiple-entry-references-button {
                        background-color: #968ced;
                    }                                                      
                </style> 
                <div id="content">
                    <div id="master">
                        <div id="master-toolbar">
                            <button id="add-entry-button" class="fa-button" title="Adăugare intrare">&#xf15b;</button>
                            <button id="duplicate-entry-button" class="fa-button" title="Duplicare ultima intrare din transcrierea anterioară">&#xf24d;</button>
                            <button id="delete-entry-button" class="fa-button" title="Ștergere intrare">&#xf2ed;</button>
                            <button id="display-metadata-editor-button" class="fa-button" title="Întoarcere la numerotare pagini">&#xf03a;</button>
                            <br/>
                            <button id="sort-entries-button" class="fa-button" title="Sortare intrări">&#xf162;</button>
                            <button id="delete-entry-reference-button" class="fa-button" title="Ștergere referință intrare">&#xf2ed;</button>
                            <button id="delete-multiple-entry-references-button" class="fa-button" title="Ștergere a tuturor intrărilor">&#xf2ed;</button>
                            <br/>
                            <label for="transcription-status-selector">Stare pagină</label>
                            <select id="transcription-status-selector">
                                <option value="unknown"></option>
                                <option value="validated">validată</option>
                                <option value="reviewed">revizuită</option>
                            </select> 
                            <label for="entries-number">Nr. intrări: </label><output id="entries-number">0</output>
                        </div>
                        <teian-editor id="transcription-editor" style="width: 95%; height: 910px;"></teian-editor>                        
                    </div>
                    <div id="detail">
                        <div id="detail-content">
                            <teian-editor id="entry-editor" style="background-color: #ededeb;width: 90%; height: 900px;">
                                <button slot="toolbar" id="save-entry-button" title="Salvare document" disabled="true">&#xf0c7;</button>
                                <label slot="toolbar" for="entry-status-selector">Stare intrare</label>
                                <select slot="toolbar" id="entry-status-selector" disabled="true">
                                    <option value="unknown"></option>
                                    <option value="validated">validată</option>
                                    <option value="reviewed">revizuită</option>
                                </select>                                
                            </teian-editor>                    
                        </div>
                    </div> 
                </div>
            `
        ; 

        this.transcriptionEditor = shadowRoot.querySelector("#transcription-editor");
        solirom.controls.entriesNumberOutput = shadowRoot.querySelector("#entries-number");
        solirom.controls.transcriptionEditor = shadowRoot.querySelector("#transcription-editor");
        solirom.controls.transcriptionEditor.getContents().style.padding = "5px";
        this.entryStatusSelector = shadowRoot.querySelector("#entry-status-selector");
        this.selectedIncludeElement = null;

        this.transcriptionStatusSelector = shadowRoot.querySelector("#transcription-status-selector");
        this.selectedPbElement = null;

        this.entryEditor = shadowRoot.querySelector("#entry-editor");

        shadowRoot.addEventListener("click", async (event) => {
            const target = event.composedPath()[0];
         
            if (target.matches(".transcription-reference, .transcription-reference *")) {
                const selectedIncludeElement = target.getRootNode().host;
                this.selectedIncludeElement = selectedIncludeElement;

                this.toggleEntryReference(selectedIncludeElement);
                solirom.data.entry.path = solirom.actions.composePath([solirom.data.work.volumeNumber, solirom.data.repos.cflr.transcriptionsPath, selectedIncludeElement.getAttribute("href")], "/");
            }

            if (target.matches("#display-metadata-editor-button")) {
                solirom.actions.displayMetadataEditor();
                this.selectedPbElement.scrollIntoView();
                document.body.scrollIntoView();       
                this.transcriptionEditor.reset(); 
                this.entryEditor.reset();
                this.entryStatusSelector.value = "unknown";
            }

            if (target.matches("#add-entry-button")) {
                await this.addEntry();
            }

            if (target.matches("#duplicate-entry-button")) {
                await this.duplicateEntry();
            }
            
            if (target.matches("#delete-entry-button")) {
                await this.deleteEntry();
            } 
            
            if (target.matches("#delete-entry-reference-button")) {
                await this.deleteEntryReference();
            }

            if (target.matches("#delete-multiple-entry-references-button")) {
                await this.deleteMultipleEntryReferences();
            }

            if (target.matches("#sort-entries-button")) {
                this.sortEntries(target);
            }

            if (target.matches("#save-entry-button")) {
                var transcriptionLabel = [...this.entryEditor.shadowRoot.querySelectorAll("*[data-name = 'form'][type = 'headword'] *[data-name = 'orth'], *[data-name = 'form'][type = 'headword'] *[data-name = 'gramGrp']")].map(element => [element.getAttribute("data-value"), element.getAttribute("n")].filter(Boolean).join("")).filter(Boolean).join(" ");
                transcriptionLabel = transcriptionLabel.replace(/(&lt;[^&gt;]+&gt;|&lt;[^&gt;]>|&lt;\/[^&gt;]>)/g,"");
                const entryType = this.entryEditor.shadowRoot.querySelector("*[data-name = 'entry']").getAttribute("type");
                const selectedIncludeElement = solirom.controls.transcriptionEditor.shadowRoot.querySelector("*[data-name = 'xi:include'][class *= 'selected-entry-reference']");
                const transcriptionReference = selectedIncludeElement.shadowRoot.querySelector(".transcription-reference");
                const transcriptionDetail = selectedIncludeElement.shadowRoot.querySelector(".transcription-detail");
                transcriptionReference.setAttribute("title", transcriptionLabel);
                transcriptionDetail.innerHTML = transcriptionLabel;
                if (entryType === "variant") {
                    //selectedIncludeElement.classList.add("var-entry-reference");
                }
                transcriptionDetail.dispatchEvent(new Event("input"));

                await this.saveEntry();
                await document.querySelector("data-editor").saveTranscription();
            }

            if (target.matches("#uppercase-text-button")) {
                const miniEditor = window.getSelection().getRangeAt(0).commonAncestorContainer.parentElement.closest("#orth-mini-editor");
                var miniEditorTextContent = miniEditor.textContent;
                miniEditorTextContent = miniEditorTextContent.toUpperCase();
                miniEditor.textContent = miniEditorTextContent;
                miniEditor.dispatchEvent(new Event("input", {bubbles: true, composed: true}));
            }

            if (target.matches("#sic-button")) {
                solirom.actions.insertMarkup(solirom.data.templates.sicTemplate);
            }

            if (target.matches("#add-headword-button")) {
                const lastHeadword = this.entryEditor.shadowRoot.querySelectorAll("*[data-name = 'form'][type = 'headword']:last-of-type")[0];
                lastHeadword.insertAdjacentHTML("afterend", solirom.data.templates.headwordForm);
            }
        }, false);

        shadowRoot.addEventListener("dblclick", (event) => {
            const target = event.composedPath()[0];
            
            if (target.matches(".transcription-reference, .transcription-reference *")) {
                this.entryStatusSelector.disabled = false;
                this.editEntry(); 
            }           
        }, false);        
        
        shadowRoot.addEventListener("change", async (event) => {
            const target = event.composedPath()[0];
            
            if (target.matches("#transcription-status-selector")) {
                this.selectedPbElement.setAttribute("cert", target.value);
                await solirom.actions.saveMetadata();
            } 
            
            if (target.matches("#entry-status-selector")) {
                window.solirom.controls.loadingSpinner.show();
                this.selectedIncludeElement.setAttribute("cert", target.value);
                await this.saveTranscription();
                window.solirom.controls.loadingSpinner.hide();
            }            
        }, false); 
        
        shadowRoot.addEventListener("solirom-language-selector-value-changed", (event) => {
            const target = event.composedPath()[0];
            
            if (target.matches("#language-selector")) {
                const orthElement = target.getRootNode().host;
                orthElement.setAttribute("xml:lang", event.detail);
            }
        }, false); 
        
        shadowRoot.addEventListener("solirom-language-selector-character-selected", (event) => {
            const target = event.composedPath()[0];
            
            if (target.matches("#language-selector")) {
                document.execCommand('insertHTML', false, event.detail);

                // const orthShadowRoot = target.getRootNode();
                // const orthElement = orthShadowRoot.querySelector("#orth-mini-editor");
                // orthElement.focus();
                // document.execCommand('insertHTML', false, event.detail);
            }
        }, false);
        
        this.entryEditor.addEventListener("teian-file-edited", event => {
            shadowRoot.querySelector("#save-entry-button").disabled = false;
        }, false);

        shadowRoot.addEventListener("input", (event) => {
            const target = event.composedPath()[0];
            
/*             if (target.matches("#orth-mini-editor, #gramGrp-input")) {
                const formElement = target.getRootNode().host.closest("*[data-name = 'form']");
                const formType = formElement.getAttribute("type");

                if (formType === "headword") {
                    const lemmaFormElement = formElement.closest("*[data-name = 'body']").querySelector("*[data-name = 'entryFree'][type = 'lemma'] *[data-name = 'form']");
                    const lemmaOrthElement = lemmaFormElement.querySelector("[data-name = 'orth']").shadowRoot.querySelector("#orth-mini-editor");

                    const orthElement = formElement.querySelector("[data-name = 'orth']");

                    const orthValue = orthElement.dataset.value;
                    console.log(orthValue);
                    const homonymValue = orthElement.getAttribute("n");
                    console.log(homonymValue);
                    
                    lemmaOrthElement.textContent = orthValue;
                    lemmaOrthElement.setAttribute("n", homonymValue);
                    lemmaOrthElement.dispatchEvent(new Event("input"));
                }
                 
            }  */          
        }, false);        
    }    

    connectedCallback() {
    }
    
    disconnectedCallback() {
    }

    /**
     * Edits the selected transcription
     * @public
     * @return void
     */    
    async editTranscription(selectedPbElement) {
        window.solirom.controls.loadingSpinner.show();
        this.selectedPbElement = selectedPbElement;
        this.transcriptionStatusSelector.value = selectedPbElement.getAttribute("cert");

        var transcriptionPath = selectedPbElement.getAttribute("corresp");
        solirom.data.transcription.path = solirom.actions.composePath([solirom.data.work.volumeNumber, transcriptionPath], "/");

        const transcription = await solirom.actions._getTranscription(solirom.data.transcription.path);        
		solirom.controls.transcriptionEditor.setAttribute("status", "edit");
        solirom.controls.transcriptionEditor.setAttribute("src", "data:application/xml;" + transcription);  
        
        const abElement = solirom.controls.transcriptionEditor.shadowRoot.querySelector("*[data-name = 'ab']"); 
        abElement.classList.add("list-group");
        const xincludeElements = [...solirom.controls.transcriptionEditor.shadowRoot.querySelectorAll("*[data-name = 'xi:include']")];
        solirom.controls.entriesNumberOutput.textContent = xincludeElements.length;
        xincludeElements.forEach(
            includeElement => {
                includeElement.classList.add("list-group-item");
                const transcriptionReference = includeElement.shadowRoot.querySelector(".transcription-reference");
                transcriptionReference.setAttribute("title", includeElement.getAttribute("label"));
            }
        );
        Sortable.create(abElement, {
            animation: 350,
            onEnd: async () => {
                solirom.controls.loadingSpinner.show();
                await document.querySelector("data-editor").saveTranscription();                
                solirom.controls.loadingSpinner.hide();
            }
        });
        window.solirom.controls.loadingSpinner.hide();      
    }

    /**
     * Saves the selected transcription
     * @public
     * @return void
     */    
    async saveTranscription() {
        const username = document.querySelector("kuberam-login-element").username;
        var data = solirom.controls.transcriptionEditor.exportDataAsString();
        const transcriptionSha = await solirom.actions.getSHA(solirom.data.transcription.path);

        var result;
        try {
            result = await solirom.data.repos.cflr.client({
                method: "PUT",
                path: solirom.data.transcription.path,
                content: solirom.actions.b64EncodeUnicode(data),
                "sha": transcriptionSha,
                "message": (new Date()).toISOString().split('.')[0] + ", " + username,
                "committer": {
                    "email": username,
                    "name": username
                },
            });
            result = result.data.content;		
        } catch (error) {
            console.error(error);
            solirom.controls.loadingSpinner.hide();            
            alert("Transcrierea nu a fost salvată. Repetați salvarea.");
            
            return;
        }    

        solirom.controls.transcriptionEditor.setAttribute("status", "edit");
    }    

    /**
     * Edits the selected entry
     * @public
     * @return void
     */    
    async editEntry() {
        window.solirom.controls.loadingSpinner.show();

        this.entryStatusSelector.value = this.selectedIncludeElement.getAttribute("cert");        

        const entry = await solirom.actions._getEntry();

		this.entryEditor.setAttribute("status", "edit");
        this.entryEditor.setAttribute("src", "data:application/xml;" + entry);

        window.solirom.controls.loadingSpinner.hide();
    }

    /**
     * Saves the selected entry
     * @public
     * @return void
     */    
    async saveEntry() {
        window.solirom.controls.loadingSpinner.show();
        const username = document.querySelector("kuberam-login-element").username;
        const userRole = document.querySelector("kuberam-login-element").userRole;

        const editorElements = this.entryEditor.getContents().querySelectorAll("*[data-name = 'editor'][role = '" + userRole + "'][data-value = '" + username + "']");
        if (editorElements.length === 0) {
            const editorAsString = solirom.data.templates.editor({"username": username, "userRole": userRole});
            const personsElement = this.entryEditor.getContents().querySelector("*[data-name = 'note'][type = 'persons']");
            personsElement.insertAdjacentHTML("afterbegin", editorAsString);
        }

        // save the entry in lexicon
/*         const editorContents = this.entryEditor.getContents();
        const lemmaOrthElement = editorContents.querySelector("*[data-name = 'entryFree'][type = 'lemma'] *[data-name = 'orth']");
        const headword = lemmaOrthElement.dataset.value;

        const homonymNumber = editorContents.querySelector("*[data-name = 'orth']").getAttribute("n");
        const gramGrp = editorContents.querySelector("*[data-name = 'gramGrp']").dataset.value;
        const lexiconEntryIdElement = editorContents.querySelector("*[data-name = 'idno'][type = 'lexicon']");
        var lexiconEntryId = lexiconEntryIdElement.dataset.value;

        var lexiconEntryAsString = solirom.data.templates.lexiconEntry({"id": lexiconEntryId, "headword": headword, "homonymNumber": homonymNumber, "gramGrp": gramGrp});

        if (lexiconEntryId === "") {
            try {
                lexiconEntryId = await fetch("https://uuid.solirom.ro/lexicon").then(response => response.text());
            } catch (error) {
                console.error(error);
                window.solirom.controls.loadingSpinner.hide();
                alert("Nu se poate genera un identificator pentru intrarea din lexicon.");

                return;
            }
            lexiconEntryAsString = solirom.data.templates.lexiconEntry({"id": lexiconEntryId, "headword": headword, "homonymNumber": homonymNumber, "gramGrp": gramGrp});

            try {
                await solirom.data.repos.cflr.client({
                    method: "PUT",
                    path: lexiconEntryId,
                    owner: "solirom",
                    repo: "lexicon",
                    content: solirom.actions.b64EncodeUnicode(lexiconEntryAsString),
                    "message": (new Date()).toISOString().split('.')[0] + ", " + username,
                    "committer": {
                        "email": username,
                        "name": username
                    },
                });    
            } catch (error) {
                console.error(error);
                window.solirom.controls.loadingSpinner.hide();
                alert("Nu se poate salva intrarea în lexicon.");

                return;
            }

            lexiconEntryIdElement.dataset.value = lexiconEntryId;
        } else {
            // get the SHA of the lexicon entry
            var lexiconEntrySha = await solirom.data.repos.cflr.client({
                method: "HEAD",
                path: lexiconEntryId,
                owner: "solirom",
                repo: "lexicon",
                headers: {
                    'If-None-Match': ''
                    }	
            });
            lexiconEntrySha = lexiconEntrySha.headers.etag;
            lexiconEntrySha = lexiconEntrySha.replace("W/", "").replaceAll('"', '').trim();

            // save the lexicon entry
            try {
                await solirom.data.repos.cflr.client({
                    method: "PUT",
                    path: lexiconEntryId,
                    owner: "solirom",
                    repo: "lexicon",
                    sha: lexiconEntrySha,
                    content: solirom.actions.b64EncodeUnicode(lexiconEntryAsString),
                    "message": (new Date()).toISOString().split('.')[0] + ", " + username,
                    "committer": {
                        "email": username,
                        "name": username
                    },
                });    
            } catch (error) {
                console.error(error);
                window.solirom.controls.loadingSpinner.hide();
                alert("Nu se poate salva intrarea în lexicon.");

                return;
            }
        } */

        // save the entry in dictionary
        const entry = this.entryEditor.exportDataAsString();
        const entrySha = await solirom.actions.getSHA(solirom.data.entry.path);

        var result;
        try {
            result = await solirom.data.repos.cflr.client({
                method: "PUT",
                path: solirom.data.entry.path,
                "sha": entrySha,                
                content: solirom.actions.b64EncodeUnicode(entry),
                "message": (new Date()).toISOString().split('.')[0] + ", " + username,
                "committer": {
                    "email": username,
                    "name": username
                },
            });
            result = result.data.content;		
        } catch (error) {
            console.error(error);
            solirom.controls.loadingSpinner.hide();            
            alert("Intrarea nu a fost salvată. Repetați salvarea.");
            
            return;
        }
    
        this.entryEditor.setAttribute("status", "edit");        

        window.solirom.controls.loadingSpinner.hide();       
    }  

    /**
     * Adds an entry
     * @public
     * @return void
     */    
    async addEntry() {
        window.solirom.controls.loadingSpinner.show();  
        var entryId = "";

        try {
            entryId = await fetch("https://uuid.solirom.ro/cflr-" + solirom.data.work.id).then(response => response.text());
        } catch (error) {
            console.error(error);
            window.solirom.controls.loadingSpinner.hide();
            alert("Nu se poate genera un identificator pentru intrare.");
            
            return;
        }  
        const transcriptionEditor = solirom.controls.transcriptionEditor.shadowRoot;
        const newEntry = solirom.data.templates.entryFile({"id": entryId, "author": document.querySelector("kuberam-login-element").username});
        const newEntryPath = "entries/" + entryId + ".xml";
        const newEntryReference = solirom.data.templates.entryReference({"entryPath": newEntryPath, "cert": "unknown"});

        const currentEntryReferenceElement = transcriptionEditor.querySelector("*[data-name = 'xi:include'][class *= 'selected-entry-reference']");
        if (currentEntryReferenceElement === null) {
            transcriptionEditor.querySelector("*[data-name = 'ab']").insertAdjacentHTML("beforeend", newEntryReference);
        } else {
            currentEntryReferenceElement.insertAdjacentHTML("afterend", newEntryReference);
        }
        
        const xincludeElements = [...transcriptionEditor.querySelectorAll("*[data-name = 'xi:include']")];
        solirom.controls.entriesNumberOutput.textContent = xincludeElements.length;
        
        const newEntryReferenceElement = transcriptionEditor.querySelector("*[data-name = 'xi:include'][href = '" + newEntryPath + "']");

        this.toggleEntryReference(newEntryReferenceElement);

        this.entryEditor.setAttribute("status", "edit");
        this.entryEditor.setAttribute("src", "data:application/xml;" + newEntry);

        try {
            solirom.data.entry.path = solirom.actions.composePath([solirom.data.work.volumeNumber, solirom.data.repos.cflr.transcriptionsPath, newEntryPath], "/");

            await this.saveEntry();
            await document.querySelector("data-editor").saveTranscription();
        } catch (error) {
            console.error(error);
            window.solirom.controls.loadingSpinner.hide();
            alert("Intrarea nu poate fi creată.");
            
            return;
        }

        window.solirom.controls.loadingSpinner.hide();
    }

    /**
     * Duplicates the last entry reference of the previous transcription
     * @private
     * @return {string}
     */
    async duplicateEntry() {
        const currentTranscriptionPath = this.selectedPbElement.getAttribute("corresp");
        const previousTranscriptionReference = solirom.controls.metadataEditor.shadowRoot.querySelector("*[data-name = 'pb'][corresp = '" + currentTranscriptionPath + "']").previousElementSibling;

        if (previousTranscriptionReference !== null) {
            window.solirom.controls.loadingSpinner.show();
            const previousTranscriptionPath = solirom.actions.composePath([solirom.data.work.volumeNumber, previousTranscriptionReference.getAttribute("corresp")], "/");
            const transcriptionResult = await solirom.actions._getTranscription(previousTranscriptionPath);
            const previousTranscription = (new DOMParser()).parseFromString(transcriptionResult, "application/xml").documentElement;
            const lastEntryReference = previousTranscription.querySelector("*|include:last-of-type");
            const newEntryReference = solirom.data.templates.entryReference({"entryPath": lastEntryReference.getAttribute("href"), "label": lastEntryReference.getAttribute("label"), "cert": lastEntryReference.getAttribute("cert")});
            solirom.controls.transcriptionEditor.shadowRoot.querySelector("*[data-name = 'ab']").insertAdjacentHTML("afterbegin", newEntryReference);
            
            const xincludeElements = [...solirom.controls.transcriptionEditor.shadowRoot.querySelectorAll("*[data-name = 'xi:include']")];
            solirom.controls.entriesNumberOutput.textContent = xincludeElements.length;

            // save the transcription
            await document.querySelector("data-editor").saveTranscription();
            window.solirom.controls.loadingSpinner.hide();                 
        }
    };    

    /**
     * Deletes the selected entry
     * @public
     * @return void
     */    
    async deleteEntry() {
        window.solirom.controls.loadingSpinner.show();

        const username = document.querySelector("kuberam-login-element").username;

        //get the SHA of the selected entry
        const entrySha = await solirom.actions.getSHA(solirom.data.entry.path);

        // delete the entry
        try {
            await solirom.data.repos.cflr.client({
                method: "DELETE",
                path: solirom.data.entry.path,
                "sha": entrySha,
                "message": (new Date()).toISOString().split('.')[0] + ", " + username,
                "committer": {
                    "email": username,
                    "name": username
                },
            });
        } catch (error) {
            console.error(error);
            window.solirom.controls.loadingSpinner.hide();
            //TODO: When an entry is deleted, it has to be deleted from all the transcriptions it is referred within
            //alert("Intrarea nu poate fi ștearsă.");
            //return;
        }        

        //reset the entry editor
        this.entryEditor.reset();
        this.entryStatusSelector.value = "unknown";

        // remove the transcription reference
        this.selectedIncludeElement.remove();
        const xincludeElements = [...solirom.controls.transcriptionEditor.shadowRoot.querySelectorAll("*[data-name = 'xi:include']")];
        solirom.controls.entriesNumberOutput.textContent = xincludeElements.length;        

        // save the transcription
        try {
            await document.querySelector("data-editor").saveTranscription();
        } catch (error) {
            console.error(error);
            window.solirom.controls.loadingSpinner.hide();
            alert("Transcrierea nu poate fi salvată.");
            
            return;
        }        

        window.solirom.controls.loadingSpinner.hide();
    }

    /**
     * Deletes the selected entry reference || TODO: this function will be removed when
     * the data will have the new structure
     * @public
     * @return void
     */    
     async deleteEntryReference() {
        window.solirom.controls.loadingSpinner.show();

        //reset the entry editor
        this.entryEditor.reset();
        this.entryStatusSelector.value = "unknown";

        // remove the transcription reference
        this.selectedIncludeElement.remove();
        const xincludeElements = [...solirom.controls.transcriptionEditor.shadowRoot.querySelectorAll("*[data-name = 'xi:include']")];
        solirom.controls.entriesNumberOutput.textContent = xincludeElements.length;        

        // save the transcription
        try {
            await document.querySelector("data-editor").saveTranscription();
        } catch (error) {
            console.error(error);
            window.solirom.controls.loadingSpinner.hide();
            alert("Transcrierea nu poate fi salvată.");

            return;
        }        

        window.solirom.controls.loadingSpinner.hide();
    } 

    /**
     * Deletes all the entry references || TODO: this function will be removed when
     * CLRE will be transcribed
     * @public
     * @return void
     */    
     async deleteMultipleEntryReferences() {
        window.solirom.controls.loadingSpinner.show();         

        const entryIncludeElements = this.transcriptionEditor.shadowRoot.querySelectorAll("*[data-name = 'xi:include']");
        const username = document.querySelector("kuberam-login-element").username;

        try {
            for (const entryIncludeElement of entryIncludeElements) {
                const entryPath = solirom.actions.composePath([solirom.data.work.volumeNumber, solirom.data.repos.cflr.transcriptionsPath, entryIncludeElement.getAttribute("href")], "/");
                const entrySHA = await solirom.actions.getSHA(entryPath);
    
                await solirom.data.repos.cflr.client({
                    "method": "DELETE",
                    "path": entryPath,
                    "sha": entrySHA,
                    "message": (new Date()).toISOString().split('.')[0] + ", " + username,
                    "committer": {
                        "email": username,
                        "name": username
                    },
                });

                entryIncludeElement.remove();
            }
        } catch (error) {
            console.error(error);
            window.solirom.controls.loadingSpinner.hide();
            alert("Eroare la ștergerea intrărilor asociate transcrierii.");
    
            return;
        }

        // save the transcription
        try {
            await this.saveTranscription();
        } catch (error) {
            console.error(error);
            window.solirom.controls.loadingSpinner.hide();
            alert("Transcrierea nu poate fi salvată.");

            return;
        } 

        solirom.controls.entriesNumberOutput.textContent = 0;        
        

        window.solirom.controls.loadingSpinner.hide();
     }

    /**
     * Sort the entries' references in a transcription
     * @public
     * @return void
     */        
    async sortEntries(element) {
        window.solirom.controls.loadingSpinner.show();

        const transcriptionEditor = this.transcriptionEditor;
        const entryReferencesContainer = transcriptionEditor.getContents().querySelector("*[data-name = 'ab']");
        const sortedEntryReferences = [...transcriptionEditor.getContents().querySelectorAll("*[data-name = 'xi:include']")].sort((a, b) => {
            const aLabel = a.getAttribute("label");
            const bLabel = b.getAttribute("label");

            if (aLabel < bLabel) {
                return -1;
            }
            if (aLabel > bLabel) {
                return 1;
            }            

            return 0;            
        });

        sortedEntryReferences.forEach((item) => {
            entryReferencesContainer.appendChild(item);
        }); 

        // save the transcription
        try {
            await document.querySelector("data-editor").saveTranscription();
        } catch (error) {
            console.error(error);
            window.solirom.controls.loadingSpinner.hide();
            alert("Transcrierea nu poate fi salvată.");
            
            return;
        }        

        window.solirom.controls.loadingSpinner.hide();
    }

    toggleEntryReference(currentEntryReference) {
        [...currentEntryReference.parentNode.querySelectorAll("*[data-name = 'xi:include']")].forEach(
            entryReference => entryReference.classList.remove("selected-entry-reference")
        );
        currentEntryReference.classList.add("selected-entry-reference");        
    }
    
    reset() {
        solirom.controls.transcriptionEditor.reset();
        this.entryEditor.reset();
        this.entryStatusSelector.value = "unknown";
    }    
};

/**
 * Gets an entry
 * @private
 * @return {string}
 */    
solirom.actions._getEntry = async () =>  {
    const path = solirom.data.entry.path;
    var result;

    try {
        result = await solirom.data.repos.cflr.client({
            method: "GET",
            path: path,
			headers: {
				'If-None-Match': ''
			  }	
        });
        result = result.data.content;		
    } catch (error) {
        console.error(error);
        window.solirom.controls.loadingSpinner.hide();
        // TODO: When an entry is deleted, it has to be deleted from all the transcriptions it is referred within
        //alert("Eroare la încărcarea intrării.");
        return;
    }

    return solirom.actions.b64DecodeUnicode(result);
};

teian.frameworkDefinition["t-entry-template"] = 
    `
    <style>
        ${soliromUtils.awesomeButtonStyle}
    </style>
    <label for="entry-type-selector">Tip intrare</label>
    <select id="entry-type-selector" data-ref="@type">
        <option value="lemma">lemă</option>
        <option value="variant">variantă</option>
    </select>
    <button id="uppercase-text-button" class="fa-button" title="Transformare litere în majuscule">&#xf062;</button> 
    <button id="add-headword-button" class="fa-button" title="Adăugare cuvânt-titlu">&#xf067;</button>
    <br/>
    <solirom-language-selector id="language-selector" data-ref="#text" data-languages="ro-x-accent-upcase-vowels,ro-x-accent-lowcase-vowels,ru-Cyrs"></solirom-language-selector>
    <slot name="t-form"></slot>
    `
;
//<button id="sic-button" title="Forma din text">sic</button>
//<button id="corr-button" title="Forma corectă">cor</button>

teian.frameworkDefinition["t-entryfree-template"] = 
    `
        <style>
            label {
                display: block;
                margin-top: 10px;
            }
        </style>    
        <label>Formă ortografică actuală</label>
        <slot name="t-form"></slot>
    `
;
teian.frameworkDefinition["t-form-template"] = 
    `
        <style>
            :host(*) {
                margin-top: 10px;
                display: inline-block;
            }
        </style>    
        <slot name="t-orth"></slot><slot name="t-gramgrp"></slot>
    `
;
teian.frameworkDefinition["t-orth-template"] = 
    `
        <style>
            :host(*) {
                width: 350px;
                display: inline-block;
            }
            :host(:not(*[n])) #n-control {
                display: none;
            }             
            #orth-mini-editor, #n-control {
                background-color: white;
                padding: 3px;
                border: 1px solid black;
            }
            ${soliromUtils.awesomeButtonStyle}
            sic {
                background-color: orange;
            }
        </style>
        <div id="orth-mini-editor" contenteditable="true" data-ref="#text"></div>
        <div id="n-control" contenteditable="true" data-ref="@n" title="Nr. ordine omonim"></div>
    `
;
teian.frameworkDefinition["t-gramgrp-template"] = 
    `
        <style>
            #gramGrp-control {
                background-color: white;
                padding: 3px;
                border: 1px solid black;
            }
            sic {
                background-color: orange;
            }            
        </style>
        <div id="gramGrp-control" contenteditable="true" data-ref="#text" title="Indicații gramaticale"></div>
    `
;
teian.frameworkDefinition["t-ab-template"] = 
    `
        <div class="list-group">
            <slot name="t-include"></slot>
        </div>
    `;
teian.frameworkDefinition["t-include-template"] = 
    `
        <style>
            :host(*) {
                background-color: #ededeb; 
                width:  190px;
                height: 25px;   
                display: inline-block; 
                margin-bottom: 5px;
                border-radius: 5px;                
            }      
            :host(.selected-entry-reference) {
                background-color: #adacac;                                                   
            } 
            :host(.var-entry-reference) {
                background-color: #f8f559;                                                   
            }                                     
            .transcription-reference {
                display: inline-block;
                width: 100%;
                height: 25px; 
                overflow: hidden;
                white-space: nowrap;                
            }  
            .transcription-reference > div {
                display: inline-block;
                position: relative;
                vertical-align: top;
            }                        
            .drag-handler {
                width: 29px;
                height: 25px;
                background: #807e7e url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MiIgaGVpZ2h0PSI0MiI+PGcgc3Ryb2tlPSIjRkZGIiBzdHJva2Utd2lkdGg9IjIuOSIgPjxwYXRoIGQ9Ik0xNCAxNS43aDE0LjQiLz48cGF0aCBkPSJNMTQgMjEuNGgxNC40Ii8+PHBhdGggZD0iTTE0IDI3LjFoMTQuNCIvPjwvZz4KPC9zdmc+') no-repeat center;
                cursor: move;
            }  
            .transcription-detail {
                width: 160px;
                box-sizing: border-box;
                padding: 2px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }  
            :host(*[cert='validated']) .transcription-reference {
                border-left: 7px solid #f58d42;
            } 
            :host(*[cert='reviewed']) .transcription-reference {
                border-left: 7px solid #5c9106;
            }  
            
            :host(:last-of-type) {
                margin-bottom: 900px;
            }
        </style>
        <div class="transcription-reference">
            <div class="drag-handler"></div><div class="transcription-detail" data-ref="@label"></div>
        </div>        
    `
;    
//<solirom-mini-editor id="language-selector" data-ref="#text" data-languages="ro-x-accent-upcase-vowels,ru-Cyrs"></solirom-mini-editor>
customElements.define("t-entry", class extends teian.formControlClass {
    constructor() {
        super();
    }
});
customElements.define("t-entryfree", class extends teian.divClass {
    constructor() {
        super();
    }
});
customElements.define("t-form", class extends teian.divClass {
    constructor() {
        super();
    }
});
customElements.define("t-orth", class extends teian.formControlClass {
    constructor() {
        super();
    }
});
customElements.define("t-gramgrp", class extends teian.formControlClass {
    constructor() {
        super();
    }
});
customElements.define("t-ab", class extends teian.divClass {
    constructor() {
        super();
    }
});

customElements.define("t-include", class extends teian.formControlClass {
    constructor() {
        super();
    }
});

window.customElements.define("data-editor", DataEditorComponent);
