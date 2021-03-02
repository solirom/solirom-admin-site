import solirom from "/modules/solirom/solirom.js";
import Sortable from '/modules/sortable/sortable.esm.js';
import * as soliromUtils from "/modules/utils/solirom-utils.js";
import MiniEditorComponent from '/modules/solirom-mini-editor/solirom-mini-editor.js';
import LanguageSelectorComponent from '/modules/solirom-language-selector/solirom-language-selector.js';

solirom.data.templates.transcriptionFile = `<ab xmlns="http://www.tei-c.org/ns/1.0" xmlns:xi="http://www.w3.org/2001/XInclude" type="aggregation"/>`
;
solirom.data.templates.entryFile =
    solirom.actions.html`<body xmlns="http://www.tei-c.org/ns/1.0" xml:id="${props => props.id}">
        <entry>
            <form type="headword">
                <orth n="" xml:lang="ro-x-accent-upcase-vowels"/>
            </form>
        </entry>
        <note>
            <editor role="transcriber">${props => props.author}</editor>
            <editor role="reviewer"/>
        </note>
        <note>
            <idno type="lexicon"/>
        </note>        
    </body>`
;
solirom.data.templates.entryReference =
    solirom.actions.html`<t-include data-name="xi:include" data-ns="http://www.w3.org/2001/XInclude" data-value="" slot="t-include" href="${props => props.entryPath}" xpointer="/1/1" label="" class="list-group-item" draggable="true"></t-include>`
;        
solirom.data.entry = {
	"sha": "",
	"path": ""
};

export default class TranscriptionEditorComponent extends HTMLElement {
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
                        font-family: cursive;
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
                </style> 
                <div id="content">
                    <div id="master">
                        <div id="master-toolbar">
                            <button id="add-entry-button" class="fa-button" title="Adăugare intrare">&#xf15b;</button>
                            <button id="delete-entry-button" class="fa-button" title="Ștergere intrare">&#xf2ed;</button>
                            <button id="switch-numbering-button" class="fa-button" title="Întoarcere la numerotare pagini">&#xf03a;</button>
                            <br/>
                            <label for="transcription-status-selector">Stare pagină</label>
                            <select id="page-status-selector">
                                <option value="unknown"></option>
                                <option value="validated">validată</option>
                                <option value="reviewed">revizuită</option>
                            </select> 
                            <solirom-infinite-loading-bar id="transcription-loading-bar" slot="toolbar" style="display:none"></solirom-infinite-loading-bar>                           
                        </div>
                        <teian-editor id="transcription-editor" style="width: 95%; height: 910px;"></teian-editor>                        
                    </div>
                    <div id="detail">
                        <div id="detail-content">
                            <teian-editor id="entry-editor" style="background-color: #ededeb;width: 90%; height: 900px;">
                                <button slot="toolbar" id="save-entry-button" title="Salvare document" disabled="true">&#xf0c7;</button>
                                <solirom-infinite-loading-bar id="entry-loading-bar" slot="toolbar" style="display:none"></solirom-infinite-loading-bar>
                            </teian-editor>                    
                        </div>
                    </div> 
                </div>
            `
        ; 

        this.transcriptionEditor = shadowRoot.querySelector("#transcription-editor");
        this.transcriptionEditor.shadowRoot.querySelector("#content").style.padding = "5px";
        this.transcriptionLoadingBar = shadowRoot.querySelector("#transcription-loading-bar");

        this.pageStatusSelector = shadowRoot.querySelector("#page-status-selector");
        this.pbElement = null;

        this.entryEditor = shadowRoot.querySelector("#entry-editor");
        this.entryLoadingBar = shadowRoot.querySelector("#entry-loading-bar");
        this.saveEntryButton = shadowRoot.querySelector("#save-entry-button");

        shadowRoot.addEventListener("click", async (event) => {
            const target = event.composedPath()[0];
         
            if (target.matches(".transcription-reference, .transcription-reference *")) {
                const selectedIncludeElement = target.getRootNode().host;
                this.selectedIncludeElement = selectedIncludeElement;

                this.toggleEntryReference(selectedIncludeElement);
                solirom.data.entry.path = solirom.actions.composePath([solirom.data.work.volumeNumber, solirom.data.repos.cflr.transcriptionsPath, selectedIncludeElement.getAttribute("href")], "/");
            }

            if (target.matches("#switch-numbering-button")) {
                document.querySelector("#numbering-editor").style.display = "inline-block";
                document.querySelector("#transcription-editor").style.display = "none"; 	
            }

            if (target.matches("#add-entry-button")) {
                await this.addEntry();
            }
            
            if (target.matches("#delete-entry-button")) {
                await this.deleteEntry();
            }            
            
            if (target.matches("#save-entry-button")) {
                const transcriptionLabel = [...this.entryEditor.shadowRoot.querySelectorAll("*[data-name = 'orth'], *[data-name = 'gramGrp']")].map(element => element.getAttribute("data-value")).join(" ");
                const selectedIncludeElement = this.transcriptionEditor.shadowRoot.querySelector("*[data-name = 'xi:include'][class *= 'selected-entry-reference']").shadowRoot;
                const transcriptionReference = selectedIncludeElement.querySelector(".transcription-reference");
                const transcriptionDetail = selectedIncludeElement.querySelector(".transcription-detail");
                transcriptionReference.setAttribute("title", transcriptionLabel);
                transcriptionDetail.innerHTML = transcriptionLabel;
                transcriptionDetail.dispatchEvent(new Event("input"));

                await this.saveEntry();
                await this.saveTranscription();
            }
        }, false);

        shadowRoot.addEventListener("dblclick", (event) => {
            const target = event.composedPath()[0];
            
            if (target.matches(".transcription-reference, .transcription-reference *")) {
                this.editEntry(); 
            }           
        }, false);        
        
        shadowRoot.addEventListener("change", (event) => {
            const target = event.target;
            
            if (target.matches("#page-status-selector")) {
                this.pbElement.setAttribute("cert", target.value);
                solirom.actions.saveMetadata();
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
                const orthShadowRoot = target.getRootNode();
                const orthElement = orthShadowRoot.querySelector("#mini-editor");
                orthElement.focus();
                document.execCommand('insertHTML', false, event.detail);
            }
        }, false);
        
        this.entryEditor.addEventListener("teian-file-edited", event => {
            shadowRoot.querySelector("#save-entry-button").disabled = false;
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
    async editTranscription(pbElement) {
        this.transcriptionLoadingBar.show();
        this.reset();
        this.pbElement = pbElement;
        const pageStatus = pbElement.getAttribute("cert");
        this.pageStatusSelector.value = pageStatus;

        var transcriptionPath = pbElement.getAttribute("corresp");
        solirom.data.transcription.path = solirom.actions.composePath([solirom.data.work.volumeNumber, transcriptionPath], "/");

        try {
            await solirom.actions._getTranscription();
        } catch (error) {
            console.error(error);
            this.transcriptionLoadingBar.hide();
            alert("Eroare la încărcarea transcrierii.");
            return;
        }        

		this.transcriptionEditor.setAttribute("status", "edit");
        this.transcriptionEditor.setAttribute("src", "data:application/xml;" + solirom.data.transcription.contents);  
        
        const abElement = this.transcriptionEditor.shadowRoot.querySelector("*[data-name = 'ab']");        
        abElement.classList.add("list-group");
        [...this.transcriptionEditor.shadowRoot.querySelectorAll("*[data-name = 'xi:include']")].forEach(
            includeElement => {
                includeElement.classList.add("list-group-item");
                const transcriptionReference = includeElement.shadowRoot.querySelector(".transcription-reference");
                transcriptionReference.setAttribute("title", includeElement.getAttribute("label"));
            }
        );
        Sortable.create(abElement, {
            animation: 350
        });  
        this.transcriptionLoadingBar.hide();      
    }

    /**
     * Saves the selected transcription
     * @public
     * @return void
     */    
    async saveTranscription() {
        this.transcriptionLoadingBar.show();
        const username = document.querySelector("kuberam-login-element").username;
        var data = this.transcriptionEditor.exportData();
    
        var result;
        try {
            result = await solirom.data.repos.cflr.client({
                method: "PUT",
                path: solirom.data.transcription.path,
                content: solirom.actions.b64EncodeUnicode(data),
                "sha": solirom.data.transcription.sha,
                "message": (new Date()).toISOString().split('.')[0] + ", " + username,
                "committer": {
                    "email": username,
                    "name": username
                },
            });
            result = result.data.content;		
        } catch (error) {
            console.error(error);
            this.transcriptionLoadingBar.hide();
            alert("Lucrarea nu poate fi salvată.");
            return;
        }    
        solirom.data.transcription.sha = result.sha;
    
        this.transcriptionEditor.setAttribute("status", "edit");
        this.transcriptionLoadingBar.hide();        
    } 
    
    /**
     * Edits the selected entry
     * @public
     * @return void
     */    
    async editEntry() {
        this.entryLoadingBar.show();

        const entry = await this._getEntry(solirom.data.entry.path);

		this.entryEditor.setAttribute("status", "edit");
        this.entryEditor.setAttribute("src", "data:application/xml;" + entry);
        this.entryLoadingBar.hide();
    }

    /**
     * Saves the selected entry
     * @public
     * @return void
     */    
    async saveEntry() {
        this.entryLoadingBar.show();
        const username = document.querySelector("kuberam-login-element").username;
        const data = this.entryEditor.exportData();

        var result;
        try {
            result = await solirom.data.repos.cflr.client({
                method: "PUT",
                path: solirom.data.entry.path,
                "sha": solirom.data.entry.sha,                
                content: solirom.actions.b64EncodeUnicode(data),
                "message": (new Date()).toISOString().split('.')[0] + ", " + username,
                "committer": {
                    "email": username,
                    "name": username
                },
            });
            result = result.data.content;		
        } catch (error) {
            console.error(error);
            this.entryLoadingBar.hide();
            alert("Intrarea nu poate fi salvată.");
            return;
        }
    
        solirom.data.entry.sha = result.sha;
    
        this.entryEditor.setAttribute("status", "edit");
        this.entryLoadingBar.hide();        
    }  

    /**
     * Adds an entry
     * @public
     * @return void
     */    
    async addEntry() {
        this.entryLoadingBar.show();  
        var entryId = "";

        try {
            entryId = await fetch("https://uuid.solirom.ro/cflr-" + solirom.data.work.id).then(response => response.text());
        } catch (error) {
            console.error(error);
            this.entryLoadingBar.hide();
            alert("Nu se poate genera un identificator pentru intrare.");
            return;
        }  
        const transcriptionEditor = this.transcriptionEditor.shadowRoot;
        const newEntry = solirom.data.templates.entryFile({"id": entryId, "author": document.querySelector("kuberam-login-element").username});
        const newEntryPath = "entries/" + entryId + ".xml";
        const newEntryReference = solirom.data.templates.entryReference({"entryPath": newEntryPath});

        const currentEntryReferenceElement = transcriptionEditor.querySelector("*[data-name = 'xi:include'][class *= 'selected-entry-reference']");
        if (currentEntryReferenceElement === null) {
            transcriptionEditor.querySelector("*[data-name = 'ab']").insertAdjacentHTML("beforeend", newEntryReference);
        } else {
            currentEntryReferenceElement.insertAdjacentHTML("afterend", newEntryReference);
        }
        
        const newEntryReferenceElement = transcriptionEditor.querySelector("*[data-name = 'xi:include'][href = '" + newEntryPath + "']");

        this.toggleEntryReference(newEntryReferenceElement);

        this.entryEditor.setAttribute("status", "edit");
        this.entryEditor.setAttribute("src", "data:application/xml;" + newEntry);

        try {
            solirom.data.entry.path = solirom.actions.composePath([solirom.data.work.volumeNumber, solirom.data.repos.cflr.transcriptionsPath, newEntryPath], "/");

            await this.saveEntry();
            await this.saveTranscription();
        } catch (error) {
            console.error(error);
            this.entryLoadingBar.hide();
            alert("Intrarea nu poate fi creată.");
            return;
        }

        this.entryLoadingBar.hide();
    }

    /**
     * Deletes the selected entry
     * @public
     * @return void
     */    
    async deleteEntry() {
        this.entryLoadingBar.show();

        const username = document.querySelector("kuberam-login-element").username;

        //get the SHA of the selected entry
        await this._getEntry();

        // delete the entry
        try {
            await solirom.data.repos.cflr.client({
                method: "DELETE",
                path: solirom.data.entry.path,
                "sha": solirom.data.entry.sha,
                "message": (new Date()).toISOString().split('.')[0] + ", " + username,
                "committer": {
                    "email": username,
                    "name": username
                },
            });
        } catch (error) {
            console.error(error);
            this.entryLoadingBar.hide();
            alert("Intrarea nu poate fi ștearsă.");
            return;
        }        

        //reset the entry editor
        this.entryEditor.reset();

        this.entryLoadingBar.hide();

        // remove the transcription reference
        this.transcriptionLoadingBar.show();
        this.selectedIncludeElement.remove();

        // save the transcription
        try {
            await this.saveTranscription();
        } catch (error) {
            console.error(error);
            this.transcriptionLoadingBar.hide();
            alert("Transcrierea nu poate fi salvată.");
            return;
        }        

        this.transcriptionLoadingBar.hide();
    }

    toggleEntryReference(currentEntryReference) {
        [...currentEntryReference.parentNode.querySelectorAll("*[data-name = 'xi:include']")].forEach(
            entryReference => entryReference.classList.remove("selected-entry-reference")
        );
        currentEntryReference.classList.add("selected-entry-reference");        
    }
    reset() {
        this.transcriptionEditor.reset();
        solirom.data.transcription.sha = "";
        solirom.data.entry.sha = "";
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
        result = result.data;		
    } catch (error) {
        console.error(error);
        this.entryLoadingBar.hide();
        alert("Eroare la încărcarea intrării.");
        return;
    }

    const sha = result.sha;
    const contents = solirom.actions.b64DecodeUnicode(result.content);
    solirom.data.entry.sha = sha;

    return {
        "path": path,
        "sha": sha,
        "contents": contents
    };

};

teian.frameworkDefinition["t-entry-template"] = `<slot name="t-form"></slot>`;
teian.frameworkDefinition["t-form-template"] = `<slot name="t-orth"></slot>`;
teian.frameworkDefinition["t-orth-template"] = 
    `
        <style>
            #mini-editor {
                background-color: white;
                padding: 3px;
                border: 1px solid black;
            }
        </style>
        <solirom-language-selector id="language-selector" data-ref="#text" data-languages="ro-x-accent-upcase-vowels,ru-Cyrs"></solirom-language-selector>
        <div id="mini-editor" contenteditable="true" data-ref="#text"></div>
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
            .transcription-reference {
                display: inline-block;
                width: 100%;
                height: 25px; 
            }  
            .transcription-reference > div {
                display: inline-block;
                position: relative;
                vertical-align: top;
            }                        
            .drag-handler {
                width: 29px;
                border-radius: 5px 0 0 5px;
                background: #807e7e url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MiIgaGVpZ2h0PSI0MiI+PGcgc3Ryb2tlPSIjRkZGIiBzdHJva2Utd2lkdGg9IjIuOSIgPjxwYXRoIGQ9Ik0xNCAxNS43aDE0LjQiLz48cGF0aCBkPSJNMTQgMjEuNGgxNC40Ii8+PHBhdGggZD0iTTE0IDI3LjFoMTQuNCIvPjwvZz4KPC9zdmc+') no-repeat center;
                box-shadow: 0 2px 2px -2px;
                cursor: move;
            }  
            .transcription-detail {
                box-sizing: border-box;
                padding: 2px;
            }  
        </style>
        <div class="transcription-reference">
            <div class="drag-handler"></div><div class="transcription-detail" data-ref="@label"></div>
        </div>        
    `
;    
//<solirom-mini-editor id="language-selector" data-ref="#text" data-languages="ro-x-accent-upcase-vowels,ru-Cyrs"></solirom-mini-editor>
customElements.define("t-entry", class extends teian.divClass {
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

window.customElements.define("transcription-editor", TranscriptionEditorComponent);
