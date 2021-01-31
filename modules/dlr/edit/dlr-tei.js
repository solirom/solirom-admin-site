import Sortable from "/modules/sortable/sortable-list-component.js";
import SoliromAutomatedGrammarComponent from "/modules/solirom-automated-grammar/solirom-automated-grammar.js";
import headwordGrammar from "/modules/dlr/edit/dlr-headword-grammar.js";

window.headwordGrammar = headwordGrammar;

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
                <editor xml:id="${props => props.username}" role="redactor" />
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
    "t-entry-template":
        `
            <style>
                ${teian.dataInstances.sectionContainer}                
            </style>
            <div class="section-container">
                <slot name="t-form"></slot>
            </div>
            <slot name="t-gramgrp"></slot>
            <div>
                <sortable-list />
            </div>                        
        `
    ,
    "t-form-template":
        `	
           <slot name="t-stress"></slot>
           <slot name="t-orth"></slot>        
        ` 
    ,    
    "t-stress-template":
        `
            <output data-ref="#text"></output>
        `
    ,    
    "t-orth-template":
        `
            <style>
                #omonym {
				    vertical-align: super;
				    font-size: smaller;
                }                
            </style>
            <output id="omonym" data-ref="@n"></output>
        `        
    ,
    "t-def-template":
        `
            <output data-ref="#text"></output>
        ` 
    ,
    "t-usg-template":
        `
            <output data-ref="#text"></output>
        `
    ,
    "t-gramgrp-template":
        `
            <solirom-automated-grammar grammar="headwordGrammar" type="input" placeholder="Categorie gramaticală ..." style="width: 777px;"></solirom-automated-grammar>
        `                                       
};

customElements.define("t-entry", class extends teian.formControlClass {
    constructor() {
        super();
    }
});
customElements.define("t-form", class extends teian.formControlClass {
    constructor() {
        super();
    }
});
customElements.define("t-stress", class extends teian.formControlClass {
    constructor() {
        super();
    }
});
customElements.define("t-orth", class extends teian.formControlClass {
    constructor() {
        super();
    }
});
customElements.define("t-dictscrap", class extends teian.formControlClass {
    constructor() {
        super();
    }
});
customElements.define("t-def", class extends teian.formControlClass {
    constructor() {
        super();
    }
});
customElements.define("t-usg", class extends teian.formControlClass {
    constructor() {
        super();
    }
});
customElements.define("t-gramgrp", class extends teian.formControlClass {
    constructor() {
        super();
    }
});

teian.actions.displaySpecialCharacters = function(element) {
    const languageTag = element.value;
    
    var specialCharacters = teian.dataInstances.languages.find(element => languageTag === element[0]);
    specialCharacters = specialCharacters[2];
    const shadowRoot = element.hostElement.shadowRoot;
    const toolbar = shadowRoot.getElementById("toolbar");
    
    toolbar.innerHTML = `${specialCharacters.map(specialCharacter => `<button onclick="this.parentNode.parentNode.children[2].focus(); document.execCommand('insertHTML', false, '${specialCharacter}'); return false;">${specialCharacter}</button>`).join('')}`;
    shadowRoot.getElementById("mini-editor").focus();
};

teian.actions.execCommand = function(template) {
    document.execCommand("insertHTML", false, template({"selection": window.getSelection()}));
};

window.generateSortableTree = function(hostElement) {
    
    const reducer = (accumulator, item) => {
        var result = "";
        
        if (item.nodeName.toLowerCase() === "t-usg") {
            const childNodes = item.childNodes;
            
            for (let i = 0; i < childNodes.length; i++) {
                const childNode = childNodes[i];
                const childNodeType = childNodes[i].nodeType;
                var textContent = "";
                
                if (childNodeType == Node.ELEMENT_NODE) {
                    textContent = childNode.dataset.value;
                } else if (childNodeType == Node.TEXT_NODE) {
                    textContent = childNode.wholeText;
                }
                
                result += textContent + " ";
            }
        } else {
            result = item.dataset.value;            
        }             
        
        return accumulator + " " + result;
    };
    
    const processChildSenses = (element) => {
        const senseId = element.attributes["xml:id"].value;
        const childSenses = Array.from(element.querySelectorAll(":scope > t-sense"));
        
        const childSensesView = childSenses.map(childSense => {
            const childSenseNumber = childSense.attributes["n"].value;
            const childSenseId = childSense.attributes["xml:id"].value;
            
            var formTextcontent = "";
            var definitionTextcontent = "";
            var usgTextcontent = "";
            
            const formElements = childSense.querySelectorAll(":scope > t-re[type = 'unitate-semantică-subsumată'] > t-term");
            const formElementsNumber = formElements.length;
            if (formElementsNumber == 1) {
                formTextcontent = formElements[0].dataset.value + " = ";
            } else if (formElementsNumber > 1) {
                formTextcontent = Array.from(formElements).reduce((a, b) => a.dataset.value + " | " + b.dataset.value) + " = ";
            }    
            
            const usgElements = childSense.querySelectorAll(":scope > t-usg:not([corresp])");
            const usgElementsNumber = usgElements.length;
            usgTextcontent = Array.from(usgElements).reduce(reducer, "");           
            
            const definitionElements = childSense.querySelectorAll(":scope > t-def, :scope > t-xr[*|id], :scope > t-usg");
            const definitionElementsNumber = definitionElements.length;
            definitionTextcontent = Array.from(definitionElements).reduce(reducer, "");            
            
            const textContent = childSenseNumber + " " + formTextcontent + usgTextcontent + " " + definitionTextcontent;
            
            const childSenseView = `<div class="list-group-item nested" data-id="${childSenseId}">${textContent}${processChildSenses(childSense)}</div>`
            
            return childSenseView;
        });        
        
        return `<div class="list-group nested-sortable" data-id="${senseId}">${childSensesView.join("")}</div>`
        
    };
    
    const senseContainer = hostElement.querySelector("t-dictscrap[*|id = 'dlr-senses']")
    
    if (senseContainer != null) {
        return processChildSenses(senseContainer);
    } else {
        return "";
    }
};
