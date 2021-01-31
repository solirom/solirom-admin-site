import luceneParser from "/exist/apps/solirom/modules/kuberam-advanced-search/cql-query-parser.js";

export default class KuberamAdvancedSearchComponent extends HTMLElement {
    constructor() {
        super();
        
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML =
            `
                <style>
                    #advanced-search-button {
                        font-family: "Font Awesome 5 Free";
                        font-weight: 900;
                    }
                </style>
				<div id="advanced-search-container">
				  <input id="advanced-search-string" type="text" placeholder="" maxlength="50" autocomplete="off" value=""/>
				  <button id="advanced-search-button" onclick="parseInput(this.parentNode.querySelector('#advanced-search-string').value);">&#xf002;</button>
                </div>
        `;        
    }    

    connectedCallback() {
    }
}

window.customElements.define("kuberam-advanced-search", KuberamAdvancedSearchComponent);