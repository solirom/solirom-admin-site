export default class LanguageSelectorComponent extends HTMLElement {
    constructor() {
        super();
        
        this.attachShadow({mode: 'open'});
        const shadowRoot = this.shadowRoot;
        shadowRoot.innerHTML = `
            <select id="language-selector" title="Alfabet"></select>
            <div id="toolbar"></div>             
        `; 
        this.selector = shadowRoot.querySelector("#language-selector");
        this.toolbar = shadowRoot.querySelector("#toolbar");
        
        const selectorLanguages = this.dataset.languages.split(",").map(item => item.trim());
        this.masterContentContainer = shadowRoot.querySelector("#master-content");
        this.languages = [
            ["ro-x-accent-upcase-vowels", "ro., lat., maj. acc.", ["Á", "É", "Í", "Ó", "Ú", "Ắ", "Ấ", "Î́", "È"]],
            ["ru-Cyrs", "rusă, chirilice vechi", ["а", "б", "в", "г", "д", "є", "ж", "ѕ", "ӡ", "и", "й", "к", "ʌ", "м", "ɴ", "o", "п", "р", "с", "т", "ѹ", "ꙋ", "ф", "х", "ѡ", "ц", "ч", "ш", "ш̩", "ъ", "ѣ", "ю", "ѩ", "ѥ", "ѧ", "ѫ", "ѯ", "ѱ", "ө", "ѵ", "ꙟ", "џ"]],
            ["el-x-lowcase", "greacă, minuscule", ["α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "ι", "κ", "λ", "μ", "ν", "ξ", "ο", "π", "ρ", "ς", "σ", "τ", "υ", "φ", "χ", "ψ", "ω"]]
        ];
        const selectedLanguages = this.languages.filter((language) => selectorLanguages.includes(language[0]));
        this.selector.insertAdjacentHTML("beforeend", selectedLanguages.map(language => `<option value="${language[0]}">${language[1]}</option>`).join(''));

        shadowRoot.addEventListener("change", (event) => {
            const target = event.target;
            
            if (target.matches("#language-selector")) {
                const languageTag = target.value;

                this.toolbar.innerHTML = "";
                const specialCharacters = (this.languages.find(element => languageTag === element[0]))[2];
                this.toolbar.insertAdjacentHTML("beforeend", `${specialCharacters.map(specialCharacter => `<button data-character="${specialCharacter}">${specialCharacter}</button>`).filter(Boolean).join('')}`);
                this.dispatchEvent(new CustomEvent("solirom-language-selector-value-changed", {bubbles: true, composed: true, detail: target.value}))
            }
        }, false);
        
        shadowRoot.addEventListener("click", (event) => {
            const target = event.target;
            
            if (target.matches("#toolbar button")) {
                const character = target.dataset.character;
                this.dispatchEvent(new CustomEvent("solirom-language-selector-character-selected", {bubbles: true, composed: true, detail: character}))
            }            
        }, false);
        
        shadowRoot.querySelector("#language-selector").dispatchEvent(new CustomEvent("change", {bubbles: true}));
    }    

    connectedCallback() {
    }
    
    disconnectedCallback() {
    }
};

window.customElements.define("solirom-language-selector", LanguageSelectorComponent);
