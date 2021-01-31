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
            <slot name="t-body"></slot>
        `,
    "t-body-template": `
            <style>
                #body {
					display: grid;
             	    grid-template-columns: repeat(4, 1fr);
                }
              	${soliromUtils.awesomeButtonStyle}                 
            </style>
            	<button class="fa-button" onclick="teian.actions.sortPageNumbers(this);" title="Sortare numere de pagină">&#xf162;</button>            
            <div id="body">
            		<slot name="t-pb"></slot>
			</div>
        `,
    "t-pb-template": `
            <style>
                :host(.selected) {
					background: linear-gradient(to left, #38158f, transparent);
					width: 130px;
                }
                #pb-container {
                    width: 120px;
               }
            		#page-number {
					width: 80px;	
					font-size: 10px;
				}
              	${soliromUtils.awesomeButtonStyle}         	
            </style>
            <div id="pb-container">
                <button class="fa-button" onclick="teian.actions.displayImage(this);" title="Afișare scan">&#xf15b;</button>            
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
customElements.define("t-body", class extends teian.formControlClass {
    constructor() {
        super();
    }
});
customElements.define("t-pb", class extends teian.formControlClass {
    constructor() {
        super();
    }
});

teian.actions.sortPageNumbers = (element) => {
	var hostElement = element.hostElement;
    const pageNumbers = [...hostElement.querySelectorAll(":scope > *[data-name = 'pb']")].map(element => element.getAttribute("n"));

    var frontJackets = [];
    var frontBlankets = [];
    var frontNotCountedPages = [];
    var frontNotNumberedPages = [];
    var romanNumberedPages = [];
    var pages = [];
    var backNotNumberedPages = [];
    var backNotCountedPages = [];
    var backBlankets = [];
    var backJackets = [];

    pageNumbers.forEach((item) => {
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

    const sortedPageNumbers = [...frontJackets.sort(), ...frontBlankets.sort(), ...frontNotCountedPages.sort(teian.actions.sortArabicNumerals), ...romanNumberedPages.sort(), ...pages.sort(teian.actions.sortArabicNumerals), ...backNotCountedPages.sort(teian.actions.sortArabicNumerals), ...backBlankets.sort(), ...backJackets.sort()];

	sortedPageNumbers.forEach((pageNumber) => {
		hostElement.appendChild(hostElement.querySelector(":scope > *[n = '" + pageNumber + "']"));
    });
    
    [...hostElement.querySelectorAll(":scope > *[n = '']")].forEach((item) => {
		hostElement.appendChild(item);
    });

};

teian.actions.romanToInt = (roman) => {
    romanNumber = romanNumber.toUpperCase();
    const romanNumList = ["CM", "M", "CD", "D", "XC", "C", "XL", "L", "IX", "X", "IV", "V", "I"];
    const corresp = [900, 1000, 400, 500, 90, 100, 40, 50, 9, 10, 4, 5, 1];
    let index = 0,
        num = 0;
    for (let rn in romanNumList) {
        index = romanNumber.indexOf(romanNumList[rn]);
        while (index != -1) {
            num += parseInt(corresp[rn]);
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
    var aValue = romanToInt(a);
    var bValue = romanToInt(b);
    if (aValue < bValue) {
        return -1;
    }
    if (aValue > bValue) {
        return 1;
    }

    return 0;
};
