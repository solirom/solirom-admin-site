export default class RangeComponent extends HTMLElement {
    constructor() {
        super();
        
        this.attachShadow({mode: 'open'});
    	const root = this.shadowRoot;
			        
        root.innerHTML =
            `
                <style>  
                    :host {
						--unit: 10px;
                    }
                
                    :host(*) {
                        box-sizing: border-box;
                    }
                    
                    .range {
                        font-family: sans-serif;
                        font-size: var(--unit);
                        line-height: var(--unit);
                        color: black;
                        background: white;
                        display: inline-block;
                    }

                    input[type=range] {
                        -webkit-appearance: none;
                        display: block;
                        margin: 0;
                        width: 100%;
                        background: transparent;
                    }
                    
                    input[type=range]::-webkit-slider-runnable-track {
                        -webkit-appearance: none;
                        width: 100%;
                        height: calc(var(--unit) * 2);
                        color: transparent;
                        background: lightgray;
                        border-radius: 999px;
                        border: none;
                    }
                    
                    input[type=range]::-moz-range-track {
                        -webkit-appearance: none;
                        width: 100%;
                        height: calc(var(--unit) * 2);
                        color: transparent;
                        background: lightgray;
                        border-radius: 999px;
                        border: none;
                    }
                    
                    input[type=range]::-ms-track {
                        -webkit-appearance: none;
                        width: 100%;
                        height: calc(var(--unit) * 2);
                        color: transparent;
                        background: lightgray;
                        border-radius: 999px;
                        border: none;
                    }
                    
                    input[type=range]::-ms-fill-lower {
                        display: none;
                    }
                    
                    input[type=range]::-ms-fill-upper {
                        display: none;
                    }
                    
                    input[type=range]::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        height: calc(var(--unit) * 2);
                        width: calc(var(--unit) * 2);
                        border-radius: 20px;
                        background: black;
                        box-shadow: 0px 2px 10px -2px black(1);
                    }
                    
                    input[type=range]::-moz-range-thumb {
                        -webkit-appearance: none;
                        height: calc(var(--unit) * 2);
                        width: calc(var(--unit) * 2);
                        border-radius: 20px;
                        background: black;
                        box-shadow: 0px 2px 10px -2px black(1);
                    }
                    
                    input[type=range]::-ms-thumb {
                        -webkit-appearance: none;
                        height: calc(var(--unit) * 2);
                        width: calc(var(--unit) * 2);
                        border-radius: 20px;
                        background: black;
                        box-shadow: 0px 2px 10px -2px black(1);
                    }

                    .ticks {
                        display: flex;
                        justify-content: space-between;                        
                        padding: var(--unit) calc(var(--unit)*2);
                    }
                    
                    .tick {
                        position: relative;
                        display: flex;
                        justify-content: center;
                        width: 1px;
                        background: gray;
                        height: var(--unit);
                        line-height: calc(var(--unit) * 3);
                        margin-bottom: calc(var(--unit) * 1);
                    }      
					#action-button {
                        display: inline-block;
						position: relative;
						top: -15px;
						height: 40px;                        						
					}                                  
                </style>
                <div class="range">
                    <input id="range-form-control" type="range" min="0" max="0" title="Volum" />
                    <div id="ticks-container" class="ticks"></div>
                </div>
                <button id="action-button">1</button>
        `;  
        
    	this.container = root.querySelector(".range");        
        this.rangeFormControl = root.querySelector("#range-form-control");
        this.ticksContainer = root.querySelector("#ticks-container");
        this.actionButton = root.querySelector("#action-button");
        
        this.rangeFormControl.addEventListener('input', this.rangeChangeValue.bind(this), false);
        this.actionButton.addEventListener('click', this.valueChangedEvent.bind(this), false);
        
        this.values = [];
    }    
    
    connectedCallback() {
    		const width = this.getAttribute("width") || "90%";
		
		this.container.style.width = width;
    }
    
    disconnectedCallback() {
    }
    
    setValues(values) {
    	this.values = values;
        this.rangeFormControl.min = values[0];
        this.rangeFormControl.max = values.length;
        this.ticksContainer.innerHTML = values.map(item => `<span class="tick">${item}</span>`).join("");
    }
    
    rangeChangeValue(event) {
        event.stopPropagation();    	
    	this.actionButton.innerText = this.rangeFormControl.value;
    }
    
    valueChangedEvent(event) {
    		document.dispatchEvent(new CustomEvent("solirom-range-value-changed", {detail: this.actionButton.innerText}))
    }
    
    reset() {
    	this.setValues([]);
		this.actionButton.innerText = 1;
		
		return this;
    }
    
    hide() {
    	this.style.display = "none";
		
		return this;
    }
    
    show() {
    	this.style.display = "inline";
		
		return this;
    }    
}

window.customElements.define("solirom-range", RangeComponent);
