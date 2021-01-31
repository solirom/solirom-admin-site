import SoliromAutomatedGrammarComponent from '/modules/solirom-automated-grammar/solirom-automated-grammar.js';

const inputEvent = new Event("input");

document.addEventListener("solirom-automated-grammar-success", event => {
	//var content = (new DOMParser()).parseFromString(event.target.result, "application/xml").documentElement;
	//content.querySelectorAll("*").forEach(element => element.host = this);
	//console.log(content);
});

document.addEventListener("click", event => {
	const target = event.target;
	
    if (target.matches("#examples > ul > li, #examples > ul > li *")) {
    		const source = target.closest("li");
		const spanSections = source.querySelectorAll(":scope > span");
		spanSections.forEach(element => {
			const targetId = element.dataset.target;
			const sourceTextContent = element.textContent;
			var targetElement = document.querySelector(targetId).shadowRoot.querySelector("input");
			targetElement.value = sourceTextContent;				
			targetElement.dispatchEvent(inputEvent);
		});
		
		//var sensesSection = source.querySelector(":source > div[data-target = '#senses']").cloneNode(true);
		
		//console.log(sensesSection);
    }
    	
	//var content = (new DOMParser()).parseFromString(event.target.result, "application/xml").documentElement;
	//content.querySelectorAll("*").forEach(element => element.host = this);
	
});