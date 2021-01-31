import * as nearley from "./nearley.js";

const grammarSuccessEvent = new CustomEvent("solirom-automated-grammar-success", {bubbles: true});
const grammarErrorEvent = new CustomEvent("solirom-automated-grammar-error", {bubbles: true});
const inputEvent = new CustomEvent("input", {bubbles: true});

export default class SoliromAutomatedGrammarComponent extends HTMLElement {
    constructor() {
        super();
        
        const grammar = this.getAttribute("grammar");
        const formControlType = this.getAttribute("type") || "input";
        const placeholder = this.getAttribute("placeholder") || "";
        const style = this.getAttribute("style") || "";
        const value = this.getAttribute("value") || "";
        this.setAttribute("value", value);
        
        var formControlDefinition;
        
        switch (formControlType) {
            case "input":
                formControlDefinition = `<input id="form-control" type="text" placeholder="${placeholder}" style="${style}" value="${value}"></input>`;
            break;
            case "textarea":
                formControlDefinition = `<textarea id="form-control" placeholder="${placeholder}" style="${style}">${value}</textarea>`;
            break;
            default:
                console.log(`The ${formControlType} is not implemented.`);
        }        
        
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML =
            `
                <style> 
                    #form-control {
                        border-left: 5px solid #61e885;
                    }                              
                    #form-control.non-match {
                        border-left: 5px solid #f9411a;
                    }                     
                </style>
                ${formControlDefinition}
        `; 
        this.formControlType = formControlType; 
        this.grammar = grammar;
        
		const formControl = this.shadowRoot.querySelector("#form-control");
		     
		formControl.hostElement = this; 
		formControl.addEventListener("input", this._evaluate);  
		
		this.formControl = formControl;
		
		formControl.dispatchEvent(inputEvent);        
    }    
    
    connectedCallback() {
   	
    }
    
    disconnectedCallback() {
    }
    
    attributeChangedCallback(attrName, oldVal, newVal) {
        switch (attrName) {
            case "value":
            	var formControl = this.formControl;

            	const formControlType = this.formControlType;
		        switch (formControlType) {
		            case "input":
		                formControl.value = newVal;
		            break;
		            case "textarea":
		                formControl.innerHTML = newVal;
		            break;
		            default:
		                console.log(`The ${formControlType} is not implemented.`);
		        }
				formControl.dispatchEvent(inputEvent);
            break;
        }
    }  
    
    static get observedAttributes() {return ["value"];}  
    
    _evaluate(event) {
    	const formControl = event.target;
		const grammar = window[this.hostElement.grammar];

		var parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
		var hostElement = this.hostElement;

		try {
		    parser.feed(formControl.value);  
			
		    if (!parser.results[0]) {
		        throw new Error();
		    }
		    if (isNaN(parser.results[0]) || parser.results[0] === Infinity) {
		        //throw new Error();
		    }
			
		    formControl.classList.remove("non-match");		    
		    hostElement.result = parser.results[0].toString();
		    hostElement.dispatchEvent(grammarSuccessEvent);		
		} catch(parseError) {
		    formControl.classList.add("non-match");
		    hostElement.result = parseError.offset;
			hostElement.dispatchEvent(grammarErrorEvent);
		}
    }
}

window.customElements.define("solirom-automated-grammar", SoliromAutomatedGrammarComponent);
