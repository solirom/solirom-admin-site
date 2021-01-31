teian.dataInstances.statuses = [
    ["redactat", "elaborated"],
    ["corectat", "corrected"],
    ["revizuit", "reviewed"]
];

teian.dataInstances.sigla = [
    ["SCL", "#uuid-fe063340-18c8-6ab7-9d29-1f818bd5042e"],
    ["CL", "#uuid-ba180ef8-2684-7787-118f-3be06f143187"],
    ["LR", "#uuid-847a0658-00f4-2755-7958-7538ba443df8"],
    ["Dacoromania, I", "#uuid-db3ae5df-4a11-3734-4f4b-fb009db02f7f"],
    ["Dacoromania (SN), I", "#uuid-9fd7609e-4b4c-375a-9eb1-89a8c113059d"],
    ["Dacoromania (SN), II", "#uuid-b47e7919-2c58-4e52-8788-f6d0507c6c6b"],
    ["România Liter. (S.)", "#uuid-c5140764-8f7d-3d15-a57a-12c79b4b583d"]
];

teian.dataInstances.languages = [
    ["ro", "română, alfabet latin", [""]],
    ["ru-Cyrs", "rusă, chirilice vechi", ["а", "б", "в", "г", "д", "є", "ж", "ѕ", "ӡ", "и", "й", "к", "ʌ", "м", "ɴ", "o", "п", "р", "с", "т", "ѹ", "ꙋ", "ф", "х", "ѡ", "ц", "ч", "ш", "ш̩", "ъ", "ѣ", "ю", "ѩ", "ѥ", "ѧ", "ѫ", "ѯ", "ѱ", "ө", "ѵ", "ꙟ", "џ"]],
    ["el-x-lowcase", "greacă, minuscule", ["α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "ι", "κ", "λ", "μ", "ν", "ξ", "ο", "π", "ρ", "ς", "σ", "τ", "υ", "φ", "χ", "ψ", "ω"]]
];

teian.dataInstances.sectionContainer = 
    `
        .section-container {
            border-radius: 6px;
            background: #f0f7fb;
            border: solid 1px #3498db;
            border-radius: 6px;
            line-height: 18px;
            overflow: hidden;
            padding: 5px;
            margin-bottom: 20px;
        }
        .section-container legend {
            font-weight: bold;
        }
    `
;
teian.actions.generateMarkup = function(strings, ...args) {
  const interleaved = args.reduce(
    (acc, arg, index) => {
      return [...acc, arg, strings[index + 1]];
    },
    [strings[0]]
  );

  return props =>
    interleaved
      .map(part => (typeof part === "function" ? part(props) : part))
      .join("");
};
teian.dataInstances.hiBoldTemplate =
    teian.actions.generateMarkup`
        <hi xmlns="http://www.tei-c.org/ns/1.0" rend="bold\">${props => props.selection}</hi>
    `
;
teian.dataInstances.hiItalicTemplate =
    teian.actions.generateMarkup`
        <hi xmlns="http://www.tei-c.org/ns/1.0" rend="italic\">${props => props.selection}</hi>
    `
;
teian.dataInstances.hiSpacedTemplate =
    teian.actions.generateMarkup`
        <hi xmlns="http://www.tei-c.org/ns/1.0" rend="spaced\">${props => props.selection}</hi>
    `
;
teian.dataInstances.hiSmallCapsTemplate =
    teian.actions.generateMarkup`
        <hi xmlns="http://www.tei-c.org/ns/1.0" rend="small-caps\">${props => props.selection}</hi>
    `
;

teian.frameworkDefinition = {
    "new-file-template": 
        teian.actions.generateMarkup`
            <entryFree xmlns="http://www.tei-c.org/ns/1.0" xml:id="${props => props.uuid}">
                <revisionDesc status="elaborated" />
                <editor role="redactor">${props => props.username}</editor>
                <orth />
                <gramGrp />
                <quote xml:lang="ro" />
                <bibl>
                    <ptr type="" target="" />
                    <date />
                    <citedRange />
                </bibl>
                <re type="" />
                <note />
            </entryFree>   
    
        `
    ,
    "t-entryfree-template":
        `
            <style>
                ${teian.dataInstances.sectionContainer}                
            </style>
            <div class="section-container">
                <slot name="t-revisiondesc"></slot>
            </div>             
            <div class="section-container">
                <slot name="t-orth"></slot>
                <slot name="t-gramgrp"></slot>
            </div>
            <div class="section-container">
                <slot name="t-re"></slot>
            </div>            
            <div class="section-container">
                <slot name="t-quote"></slot>
            </div>
            <fieldset class="section-container">
                <legend>Sursa</legend>
                <slot name="t-bibl"></slot>
            </fieldset>  
            <div class="section-container">
                <slot name="t-note"></slot>
            </div>                        
        `
    ,
    "t-revisiondesc-template":
        `
            <style>
                div.container {
                    display: grid;
                    grid-template-columns: 200px max-content;
                    grid-gap: 5px;
                }
            </style>
            <div class="container">
                <label for="siglum">Stare</label>
                <select id="siglum" data-ref="@status">
                    ${teian.dataInstances.statuses.map(status => `<option value="${status[1]}">${status[0]}</option>`).join('')}
                </select>                 
            </div>
        `
    ,
    "t-orth-template":
        `
            <style>
                div.container {
                    display: grid;
                    grid-template-columns: 200px max-content;
                    grid-gap: 5px;
                }
                #common-toolbar, #toolbar {
                    width: 560px; 
                } 
                button.fa-btn {
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                }                
                #mini-editor {
                    border-radius: 6px;
                    width: 560px;
                    min-height: 40px;
                    border: 1px solid #ccc;
                    background-color: white;
                    font-size: 14px;
                }                
            </style>
            <div class="container">
                <label for="orth">Cuvânt-titlu *</label>
                <div>
                    <div id="common-toolbar">
                        <button class="fa-btn" onclick="teian.actions.clearTextFormatting(this.parentNode.parentNode.children[1]);">&#xf87d;</button>
                    </div>
                    <div id="mini-editor" contenteditable="true" data-ref="#text" onpaste="teian.actions.pasteAsPlainText(event);"></div>
                </div>
            </div>
        `
    ,
    "t-gramgrp-template":
        `
            <style>
                div.container {
                    display: grid;
                    grid-template-columns: 200px max-content;
                    grid-gap: 5px;
                }
            </style>
            <div class="container">
                <label for="citedrange">Categorie gramaticală</label>
                <input id="citedrange" data-ref="#text"/>
            </div>
        `
    ,    
    "t-quote-template":
        `
            <style>
                div.container {
                    display: grid;
                    grid-template-columns: 200px max-content;
                    grid-gap: 5px;
                }
                #common-toolbar, #toolbar {
                    width: 560px; 
                }
                button.fa-btn {
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                }
                button#small-caps {
                    font-variant: small-caps;
                }                
                #mini-editor {
                    border-radius: 6px;
                    width: 560px;
                    min-height: 40px;
                    border: 1px solid #ccc;
                    background-color: white;
                    font-size: 14px;
                }
                hi[rend = 'bold'] {
                    font-weight: bold;
                }
                hi[rend = 'italic'] {
                    font-style: italic;
                }
                hi[rend = 'spaced'] {
                    letter-spacing: 5px;
                }
                hi[rend = 'small-caps'] {
                    font-variant: small-caps;
                }                
            </style>
            <div class="container">
                <div>
                    <label>Citat *</label><p/>
                    <select data-ref="@xml:lang" onchange="teian.actions.displaySpecialCharacters(this);">
                        ${teian.dataInstances.languages.map(language => `<option value="${language[0]}">${language[1]}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <div id="common-toolbar">
                        <button class="fa-btn" onclick="teian.actions.clearTextFormatting(this.parentNode.parentNode.children[2]);">&#xf87d;</button>
                        <button class="fa-btn" onclick="teian.actions.execCommand(teian.dataInstances.hiBoldTemplate);">&#xf032;</button>
                        <button class="fa-btn" onclick="teian.actions.execCommand(teian.dataInstances.hiItalicTemplate);">&#xf033;</button>
                        <button class="fa-btn" onclick="teian.actions.execCommand(teian.dataInstances.hiSpacedTemplate);">&#xf035;</button>
                        <button id="small-caps" onclick="teian.actions.execCommand(teian.dataInstances.hiSmallCapsTemplate);">Tt</button>
                    </div>
                    <div id="toolbar"></div>
                    <div id="mini-editor" data-ref="#text" contenteditable="true" onpaste="teian.actions.pasteAsPlainText(event);"></div>
                </div>
            </div>
        ` 
    ,
    "t-bibl-template":
        `
            <slot name="t-ptr"></slot>
            <slot name="t-date"></slot>
            <slot name="t-citedrange"></slot>
        `
    ,
    "t-ptr-template":
        `
            <style>
                div.container {
                    display: grid;
                    grid-template-columns: 200px 50px 445px max-content;
                    grid-gap: 5px;
                }
                select {
                    width: 50px;
                }
                #siglum {
                    width: 405px;
                }
                #toolbar > button {
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    border: none;
                    background-color: transparent;
                    outline: none; 
                }                 
            </style>
            <div class="container">
                <label for="siglum">Izvor *</label>
                <select data-ref="@type">
                    <option value=""></option>
                    <option label="ap.">ap.</option>
                    <option label="cf.">cf.</option>
                </select>
                <input id="siglum" data-ref="@target"/>
                <div id="toolbar">
    			    <button onclick="teian.update.insertAfter((new DOMParser()).parseFromString(teian.frameworkDefinition.biblTemplate, 'application/xml').documentElement.cloneNode(true), this.hostElement.parentNode);">&#xf067;</button>
    			    <button onclick="teian.update.delete(this.hostElement.parentNode);">&#xf2ed;</button>
    		    </div>                
            </div>
        `
    ,
    "t-date-template":
        `
            <style>
                div.container {
                    display: grid;
                    grid-template-columns: 200px max-content;
                    grid-gap: 5px;
                }
            </style>
            <div class="container">
                <label for="date">Dată</label>
                <input id="date" data-ref="#text" type="text" pattern="[0-9]{4}-(0[1-9]|1[012])" title="Data trebuie să fie în formatul AAAA sau AAAA-LL"/>
            </div>
        `
    ,
    "t-citedrange-template":
        `
            <style>
                div.container {
                    display: grid;
                    grid-template-columns: 200px max-content;
                    grid-gap: 5px;
                    margin-bottom: 20px;                    
                }
            </style>
            <div class="container">
                <label for="citedrange">Localizare în sursă</label>
                <input id="citedrange" data-ref="#text"/>
            </div>
        `
    ,
    "t-re-template":
        `
            <style>
                div.container {
                    display: grid;
                    grid-template-columns: 200px 215px max-content;
                    grid-gap: 5px;
                }
                #re {
                    width: 340px;
                }
            </style>
            <div class="container">
                <label for="re">Variantă</label>
                <select data-ref="@type">
                    <option value=""></option>
                    <option label="writing">de scriere</option>
                    <option label="lexical">lexicală</option>
                </select>
                <input id="re" data-ref="#text"/>
            </div>
        `
    ,    
    "t-note-template":
        `
            <style>
                div.container {
                    display: grid;
                    grid-template-columns: 200px 500px max-content;
                    grid-gap: 5px;
                }
                #mini-editor {
                    border-radius: 6px;
                    width: 460px;
                    min-height: 40px;
                    border: 1px solid #ccc;
                    background-color: white;
                    font-size: 14px;
                }
                #toolbar > button {
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    border: none;
                    background-color: transparent;
                    outline: none; 
                }                
            </style>
            <div class="container">
                <label>Notă</label>
                <div id="mini-editor" contenteditable="true" data-ref="#text" onpaste="teian.actions.pasteAsPlainText(event);"></div>
                <div id="toolbar">
    			    <button onclick="teian.update.insertAfter((new DOMParser()).parseFromString(teian.frameworkDefinition.noteTemplate, 'application/xml').documentElement.cloneNode(true), this.hostElement);">&#xf067;</button>
    			    <button onclick="teian.update.delete(this.hostElement);">&#xf2ed;</button>
			    </div>                
            </div>
       `         
};

teian.frameworkDefinition.noteTemplate = `
    <t-note xmlns="http://www.w3.org/1999/xhtml" data-name="note" data-ns="http://www.tei-c.org/ns/1.0" data-value="" slot="t-note" />
`;
teian.frameworkDefinition.biblTemplate = `
    <t-bibl xmlns="http://www.w3.org/1999/xhtml" data-name="bibl" data-ns="http://www.tei-c.org/ns/1.0" data-value="" slot="t-bibl">
        <t-ptr xmlns="http://www.w3.org/1999/xhtml" data-name="ptr" data-ns="http://www.tei-c.org/ns/1.0" data-value="" slot="t-ptr" type="" target="" />
        <t-date xmlns="http://www.w3.org/1999/xhtml" data-name="date" data-ns="http://www.tei-c.org/ns/1.0" data-value="" slot="t-date" />
        <t-citedrange xmlns="http://www.w3.org/1999/xhtml" data-name="citedRange" data-ns="http://www.tei-c.org/ns/1.0" data-value="" slot="t-citedrange" />    
    </t-bibl>
`;

customElements.define("t-entryfree", class extends teian.divClass {
    constructor() {
        super();
    }
});
customElements.define("t-revisiondesc", class extends teian.formControlClass {
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
customElements.define("t-quote", class extends teian.formControlClass {
    constructor() {
        super();
    }
});
customElements.define("t-ptr", class extends teian.formControlClass {
    constructor() {
        super();
    }
});
customElements.define("t-date", class extends teian.formControlClass {
    constructor() {
        super();
    }
});
customElements.define("t-citedrange", class extends teian.formControlClass {
    constructor() {
        super();
    }
});
customElements.define("t-re", class extends teian.formControlClass {
    constructor() {
        super();
    }
});
customElements.define("t-note", class extends teian.formControlClass {
    constructor() {
        super();
    }
});

teian.actions.displaySpecialCharacters = (element) => {
    const languageTag = element.value;
    
    var specialCharacters = teian.dataInstances.languages.find(element => languageTag === element[0]);
    specialCharacters = specialCharacters[2];
    const shadowRoot = element.hostElement.shadowRoot;
    const toolbar = shadowRoot.getElementById("toolbar");
    
    toolbar.innerHTML = `${specialCharacters.map(specialCharacter => `<button onclick="this.parentNode.parentNode.children[2].focus(); document.execCommand('insertHTML', false, '${specialCharacter}'); return false;">${specialCharacter}</button>`).join('')}`;
    shadowRoot.getElementById("mini-editor").focus();
};

teian.actions.execCommand = (template) => {
    document.execCommand('insertHTML', false, template({"selection": window.getSelection()}));
};

teian.actions.pasteAsPlainText = (event) => {
    event.preventDefault();

    var text = (event.originalEvent || event).clipboardData.getData('text/plain');

    document.execCommand("insertText", false, text);
};
