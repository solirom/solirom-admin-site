import headwordGrammar from "/modules/dlr/edit/dlr-headword-grammar.js";
window.headwordGrammar = headwordGrammar;
//import SoliromAutomatedGrammarComponent from '/modules/solirom-automated-grammar/solirom-automated-grammar.js';

       
var input_1 = document.getElementById("input-1");
var output_1 = document.getElementById("output-1");
var input_2 = document.getElementById("input-2");
var output_2 = document.getElementById("output-2");

input_1.addEventListener("solirom-automated-grammar-success", event => {
	output_1.textContent = event.target.result;
});

input_1.addEventListener("solirom-automated-grammar-error", event => {
	output_1.textContent = "";
});

input_2.addEventListener("solirom-automated-grammar-success", event => {
	output_2.textContent = event.target.result;
});

input_2.addEventListener("solirom-automated-grammar-error", event => {
	output_2.textContent = "";
});

document.addEventListener("solirom-automated-grammar-success", event => {
	var content = (new DOMParser()).parseFromString(event.target.result, "application/xml").documentElement;
	content.querySelectorAll("*").forEach(element => element.host = this);
	console.log(content);
});
