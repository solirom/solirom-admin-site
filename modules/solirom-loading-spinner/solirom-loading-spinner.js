export default class LoadingSpinnerComponent extends HTMLElement {
    constructor() {
        super();
        
        this.attachShadow({mode: 'open'});
        const shadowRoot = this.shadowRoot;
        shadowRoot.innerHTML = `
            <style>
                #spinner:not([hidden]) {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                #spinner::after {
                    content: "";
                    width: 80px;
                    height: 80px;
                    border: 2px solid #f3f3f3;
                    border-top: 3px solid #2bc253;
                    border-radius: 100%;
                    will-change: transform;
                    animation: spin 1s infinite linear
                }

                @keyframes spin {
                    from {
                        transform: rotate(360deg);
                    }
                    to {
                        transform: rotate(0deg);
                    }
                }
            </style>
            <div id="spinner" hidden="true"></div>            
        `; 

        this.spinner = shadowRoot.querySelector("#spinner");
        window.solirom.controls.loadingSpinner = this;
    }    
    connectedCallback() {
    }
    
    disconnectedCallback() {
    }

    show() {
        this.spinner.removeAttribute("hidden");
    }

    hide() {
        this.spinner.setAttribute("hidden", "");
    }    
};

window.customElements.define("solirom-loading-spinner", LoadingSpinnerComponent);
