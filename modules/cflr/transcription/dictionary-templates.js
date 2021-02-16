import solirom from "/modules/solirom/solirom.js";
import Sortable from '/modules/sortable/sortable.esm.js';
import * as soliromUtils from "/modules/utils/solirom-utils.js";
import MiniEditorComponent from '/modules/solirom-mini-editor/solirom-mini-editor.js';
import LanguageSelectorComponent from '/modules/solirom-language-selector/solirom-language-selector.js';

solirom.data.templates.transcriptionFile =
    solirom.actions.html`<ab xmlns="http://www.tei-c.org/ns/1.0" xmlns:xi="http://www.w3.org/2001/XInclude" type="aggregation">
        <xi:include href="${props => props.href}" xpointer="/1/1" label="${props => props.label}" />
    </ab>`
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
            <idno type="lemma"/>
        </note>        
    </body>`
;

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
                    }
                    ${soliromUtils.awesomeButtonStyle}                                      
                </style> 
                <div id="content">
                    <div id="master">
                        <div id="master-toolbar">
                            <button id="add-entry-button" class="fa-button" title="Adăugare intrare">&#xf15b;</button>
                            <button id="delete-entry-button" class="fa-button" title="Ștergere intrare">&#xf2ed;</button>
                            <button id="move-entry-button" class="fa-button" title="Mutare intrare">&#xf0c7;</button>
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
                            <teian-editor id="entry-editor" style="width: 90%; height: 900px;">
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

        this.sha = {
            transcription: "",
            entry: ""
        };
        this.pageStatusSelector = shadowRoot.querySelector("#page-status-selector");
        this.selectedEntryPath = "";
        this.pbElement = null;
        this.entryEditor = shadowRoot.querySelector("#entry-editor");
        this.transcriptionLoadingBar = shadowRoot.querySelector("#transcription-loading-bar");

        shadowRoot.addEventListener("click", (event) => {
            const target = event.composedPath()[0];
            
            if (target.matches(".transcription-reference, .transcription-reference *")) {
                const transcriptionReference = target.closest(".transcription-reference");
                const currentIncludeElement = target.getRootNode().host;

                [...currentIncludeElement.parentNode.querySelectorAll("*[data-name = 'xi:include']")].forEach(
                    includeElement => includeElement.shadowRoot.querySelector(".transcription-reference").classList.remove("selected-transcription")
                );
                transcriptionReference.classList.add("selected-transcription");
                this.selectedEntryPath = solirom.actions.composePath([solirom.data.work.volumeNumber, solirom.data.repos.cflr.transcriptionsPath, transcriptionReference.dataset.href], "/");
            }

            if (target.matches("#switch-numbering-button")) {
                document.querySelector("#numbering-editor").style.display = "inline-block";
                document.querySelector("#transcription-editor").style.display = "none"; 	
            }
        }, false);

        shadowRoot.addEventListener("dblclick", (event) => {
            const target = event.composedPath()[0];
            
            if (target.matches(".transcription-reference, .transcription-reference *")) {
                this.editEntry(this.selectedEntryPath); 
            }           
        }, false);        
        
        shadowRoot.addEventListener("change", (event) => {
            const target = event.target;
            
            if (target.matches("#page-status-selector")) {
                this.pbElement.setAttribute("cert", target.value);
                solirom.actions.saveWorkIndexFile();
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
                const orthElement = orthShadowRoot.querySelector("#orth-mini-editor");
                orthElement.focus();
                document.execCommand('insertHTML', false, event.detail);
            }
        }, false);        
    }    

    connectedCallback() {
    }
    
    disconnectedCallback() {
    }
    async displayTranscription(pbElement) {
        this.reset();
        this.pbElement = pbElement;
        var transcriptionPath = pbElement.getAttribute("corresp");
        transcriptionPath = solirom.actions.composePath([solirom.data.work.volumeNumber, transcriptionPath], "/");
        const pageStatus = pbElement.getAttribute("cert");
        this.pageStatusSelector.value = pageStatus;

        var result;
        try {
            result = await solirom.data.repos.cflr.client({
                method: "GET",
                path: transcriptionPath
            });
            result = result.data;		
        } catch (error) {
            console.error(error);
            alert("Eroare la încărcarea transcrierii.");
            return;
        }

        this.sha.transcription = result.sha;
        var transcription = solirom.actions.b64DecodeUnicode(result.content);

		this.transcriptionEditor.setAttribute("status", "edit");
        this.transcriptionEditor.setAttribute("src", "data:application/xml;" + transcription);  
        
        const abElement = this.transcriptionEditor.shadowRoot.querySelector("*[data-name = 'ab']");        
        abElement.classList.add("list-group");
        [...this.transcriptionEditor.shadowRoot.querySelectorAll("*[data-name = 'xi:include']")].forEach(
            includeElement => {
                includeElement.classList.add("list-group-item");
                const transcriptionReference = includeElement.shadowRoot.querySelector(".transcription-reference");
                transcriptionReference.dataset.href = includeElement.getAttribute("href");
                transcriptionReference.setAttribute("title", includeElement.getAttribute("label"));
            }
        );
        Sortable.create(abElement, {
            animation: 350
        });        
    }
    async editEntry(selectedEntryPath) {
        this.transcriptionLoadingBar.show();

        var result;
        try {
            result = await solirom.data.repos.cflr.client({
                method: "GET",
                path: selectedEntryPath
            });
            result = result.data;		
        } catch (error) {
            console.error(error);
            this.transcriptionLoadingBar.hide();
            alert("Eroare la încărcarea intrării.");
            return;
        }

        this.sha.entry = result.sha;
        const entry = solirom.actions.b64DecodeUnicode(result.content); 
        
		this.entryEditor.setAttribute("status", "edit");
        this.entryEditor.setAttribute("src", "data:application/xml;" + entry);
        this.transcriptionLoadingBar.hide();
    };    
    reset() {
        this.transcriptionEditor.reset();
        this.sha.transcription = "";
        this.sha.entry = "";
    }    
};

teian.frameworkDefinition["t-entry-template"] = `<slot name="t-form"></slot>`;
teian.frameworkDefinition["t-form-template"] = `<slot name="t-orth"></slot>`;
teian.frameworkDefinition["t-orth-template"] = 
    `
        <solirom-language-selector id="language-selector" data-ref="#text" data-languages="ro-x-accent-upcase-vowels,ru-Cyrs"></solirom-language-selector>
        <div id="orth-mini-editor" contenteditable="true" data-ref="#text"></div>
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
            .transcription-reference {
                width:  190px;
                height: 25px;
                border-radius: 5px;
                display: inline-block;
                background-color: #ededeb;
                margin-bottom: 5px;
            }  
            .transcription-reference > div {
                display: inline-block;
                position: relative;
                height: 100%;
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
            .selected-transcription {
                background-color: #adacac;                                                   
            } 
        </style>
        <div class="transcription-reference list-group-item" data-href="@href" title="@label">
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
