import * as soliromUtils from "/modules/utils/solirom-utils.js";

teian.frameworkDefinition = {
    "t-tei-template": `
        		<style>
                :host([*|id]) {
					counter-reset: volume;
					display: block;
					contain: content;					 
                }
                :host(:not([*|id]))::before {
					display: block;
					contain: content;                	
					counter-increment: volume;
					content: 'Volum 'counter(volume); 
					font-weight: bold;  
					background: linear-gradient(to right, #38158f, transparent);  
					color: white;
					width: 100%;       
                }
			</style>
			<slot name="t-tei"></slot>
			<slot name="t-text"></slot>
        `,
    "t-text-template": `
        <slot name="t-front"></slot>
        <slot name="t-body"></slot>
        <slot name="t-back"></slot>
    `,
    "t-front-template": `
            <style>
                #content {
					display: grid;
             	    grid-template-columns: repeat(3, 1fr);
                }
              	${soliromUtils.awesomeButtonStyle}                 
            </style>
            	<button class="fa-button" onclick="teian.actions.sortPageNumbers(this);" title="Sortare numere de pagină">&#xf162;</button>            
            <div id="content">
            	<slot name="t-pb"></slot>
			</div>
    `,    
    "t-body-template": `
        <style>
            :host(*) #content {
                display: grid;
                grid-template-columns: repeat(3, 1fr);                    
            }
            :host(*[*|id]) #content {
                display: grid;
                grid-template-columns: repeat(1, 1fr);                    
            }                
            ${soliromUtils.awesomeButtonStyle}                 
        </style>
        <button class="fa-button" onclick="teian.actions.sortPageNumbers(this);" title="Sortare numere de pagină">&#xf162;</button>            
        <div id="content">
            <slot name="t-pb"></slot>
            <slot name="t-entry"></slot>
            <slot name="t-entryfree"></slot>
        </div>
    `,
    "t-back-template": `
        <style>
            #content {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
            }
            ${soliromUtils.awesomeButtonStyle}                 
        </style>
        <button class="fa-button" onclick="teian.actions.sortPageNumbers(this);" title="Sortare numere de pagină">&#xf162;</button>            
        <div id="content">
                <slot name="t-pb"></slot>
        </div>
    `,    
    "t-pb-template": `
            <style>
                :host(*) span.drag-handler {
                    display: none;
                }
                :host(.list-group-item) span.drag-handler {
                    cursor: move;
                    display: inline;
                    */background-color: #919499; 
                    padding: 4px;*/
                }             
                :host(.selected) {
					background: linear-gradient(to left, #38158f, transparent);
					width: 150px;
                }
                #pb-container {
                    width: 150px;
                    padding-left: 3px;
                    margin-bottom: 2px;
                }
                #page-number {
                    width: 80px;	
                    font-size: 10px;
				}
                ${soliromUtils.awesomeButtonStyle}  
                #pb-container > button {
                    padding: 0;
                }
                :host(*[cert='validated']) #pb-container {
                    border-left: 7px solid #f58d42;
                } 
                :host(*[cert='reviewed']) #pb-container {
                    border-left: 7px solid #5c9106;
                }                               
            </style>
            <div id="pb-container">
                <span class="fa-button drag-handler">&#xf0b2;</span>
                <button class="fa-button" onclick="teian.actions.displayScan(this);" title="Afișare scan">&#xf15b;</button>
                <button class="fa-button" onclick="solirom.actions.editTranscription(this);" title="Editare transcriere">&#xf14b;</button>
                <input id="page-number" data-ref="@n" onfocus="teian.actions.selectPageBreak(this);" />
            </div>
        `
};

customElements.define("t-tei", class extends teian.divClass {
    constructor() {
        super();
    }
});
customElements.define("t-text", class extends teian.divClass {
    constructor() {
        super();
    }
});
customElements.define("t-front", class extends teian.formControlClass {
    constructor() {
        super();
    }
});
customElements.define("t-body", class extends teian.formControlClass {
    constructor() {
        super();
    }
});
customElements.define("t-back", class extends teian.formControlClass {
    constructor() {
        super();
    }
});
customElements.define("t-pb", class extends teian.formControlClass {
    constructor() {
        super();
    }
});

teian.actions.displayScan = (element) => {
    const scanName = element.hostElement.getAttribute("facs");
    solirom.data.scan.name = scanName;
    
    solirom.actions.updateImageViewerURL(scanName);
    teian.actions.selectPageBreak(element);
};

solirom.actions.editTranscription = async (element) => {
    teian.actions.displayScan(element);
    solirom.actions.displayDataEditor();
    const hostElement = element.getRootNode().host;
    document.querySelector("data-editor").editTranscription(hostElement);
};

teian.actions.selectPageBreak = (element) => {
    const hostElement = element.hostElement;
    var content = solirom.controls.metadataEditor.shadowRoot.querySelector("#content");
    content.querySelectorAll(":scope *[data-name = 'pb']").forEach((pbElement) => pbElement.classList.remove("selected"));
    hostElement.classList.add("selected");
};

teian.actions.sortPageNumbers = (element) => {
	const hostElement = element.hostElement;

    var frontJackets = [];
    var frontBlankets = [];
    var frontNotCountedPages = [];
    var romanNumberedPages = [];
    var pages = [];
    var backNotCountedPages = [];
    var backBlankets = [];
    var backJackets = [];
    
    // const pageNumbers
    [...hostElement.querySelectorAll(":scope > *[data-name = 'pb']")].map(element => element.getAttribute("n")).forEach((item) => {
        if (item.match(/^supracoperta[1-2]/)) {
            frontJackets.push(item);
        }
        if (item.match("^coperta[1-2]")) {
            frontBlankets.push(item);
        }
        if (item.match("^f[0-9]+")) {
            frontNotCountedPages.push(item);
        }
        if (item.match("[I|V|X|L|C]+")) {
            romanNumberedPages.push(item);
        }
        if (item.match("^\[?[0-9]+\]?$")) {
            pages.push(item);
        }
        if (item.match("^b[0-9]+")) {
            backNotCountedPages.push(item);
        }
        if (item.match("^coperta[3-4]")) {
            backBlankets.push(item);
        }
        if (item.match("^supracoperta[3-4]")) {
            backJackets.push(item);
        }

    });

    const sortedPageNumbers = [...frontJackets.sort(), ...frontBlankets.sort(), ...frontNotCountedPages.sort(teian.actions.sortArabicNumerals), ...romanNumberedPages.sort(teian.actions.sortRomanNumerals), ...pages.sort(teian.actions.sortArabicNumerals), ...backNotCountedPages.sort(teian.actions.sortArabicNumerals), ...backBlankets.sort(), ...backJackets.sort()];
    const lastIndex = sortedPageNumbers.length - 1;

	sortedPageNumbers.forEach((pageNumber) => {
        hostElement.appendChild(hostElement.querySelector(":scope > *[n = '" + pageNumber + "']"));
    });
    
    if (solirom.data.work.textSection === "back") {
        [...hostElement.querySelectorAll(":scope > *[n = '']")].forEach((item) => {
            hostElement.appendChild(item);
        });                
    }
    
    const illustrationNumbers = [...hostElement.querySelectorAll(":scope > *[n ^= 'i']")].map(element => element.getAttribute("n")).sort().reverse();
    
    illustrationNumbers.forEach((illustrationNumber) => {
        var pageNumber = illustrationNumber.match(/i\[?[0-9]+\]?/);

        if (pageNumber !== null) {
            pageNumber = pageNumber[0].replace("i", "")
        }
        
        hostElement.querySelector(":scope > *[n = '" + pageNumber + "']").after(hostElement.querySelector(":scope > *[n = '" + illustrationNumber + "']"));
    });
};

teian.actions.romanToInt = (romanNumber) => {
    romanNumber = romanNumber.toUpperCase();
    const romanNumList = ["CM", "M", "CD", "D", "XC", "C", "XL", "L", "IX", "X", "IV", "V", "I"];
    const correspondences = [900, 1000, 400, 500, 90, 100, 40, 50, 9, 10, 4, 5, 1];
    let index = 0,
        num = 0;
    for (let rn in romanNumList) {
        index = romanNumber.indexOf(romanNumList[rn]);
        while (index != -1) {
            num += parseInt(correspondences[rn]);
            romanNumber = romanNumber.replace(romanNumList[rn], "-");
            index = romanNumber.indexOf(romanNumList[rn]);
        }
    }
    return num;
};

teian.actions.sortArabicNumerals = (a, b) => {
    const regex = /f|b|\[|\]/;
    var aValue = parseInt(a.replace(regex, ""));
    var bValue = parseInt(b.replace(regex, ""));
    if (aValue < bValue) {
        return -1;
    }
    if (aValue > bValue) {
        return 1;
    }

    return 0;
};

teian.actions.sortRomanNumerals = (a, b) => {
    var aValue = teian.actions.romanToInt(a);
    var bValue = teian.actions.romanToInt(b);
    if (aValue < bValue) {
        return -1;
    }
    if (aValue > bValue) {
        return 1;
    }

    return 0;
};
