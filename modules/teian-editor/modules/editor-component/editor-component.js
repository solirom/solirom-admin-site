export default class TeianEditorComponent extends HTMLElement {
    constructor() {
        super();
        
        const style = this.getAttribute("style") || "width: 21cm; min-height: 29.7cm;";
        
        this.emptyContent = `<slot></slot>`;
        
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML =
            `
                <style>
                    ::slotted(button)  {
                        font-family: "Font Awesome 5 Free";
                        font-weight: 900;                
                    }
                    #content {
                        background: white;
                        margin-bottom: 0.5cm;
                        box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);
                        padding: 20px;
                        overflow: auto;
                        ${style}                        
                    }
                </style>
        		<div>
        		    <slot name="toolbar"></slot>
        		</div>        
                <div id="content">
                        ${this.emptyContent}
                </div>
        `;  
        
        this.contentContainer = this.shadowRoot.querySelector("#content");
        
        // set the mutation observer
        this.mutationObserverConfiguration = { attributes: true, childList: true, subtree: true };
        
        const mutationObserverCallback = function(mutationsList, observer) {
            mutationsList.forEach(mutation => {
                if (mutation.type === 'childList') {
                    if (!mutation.target.matches("div#content")) {
                        document.dispatchEvent(teian.events.teianFileEdited);
                    }
                }
                else if (mutation.type === 'attributes') {
                    document.dispatchEvent(teian.events.teianFileEdited);
                }                
            });
        };  
        
        this.mutationObserver = new MutationObserver(mutationObserverCallback);
    }    
    
    static get observedAttributes() {
      return ["src", "status"];
    }

    connectedCallback() {
        this.mutationObserver.observe(this.contentContainer, this.mutationObserverConfiguration); 
    }
    
    disconnectedCallback() {
        this.mutationObserver.disconnect();
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        switch (attrName) {
            case "src":
                const contentContainer = this.contentContainer;

                if (newVal.startsWith("data:")) {
                    contentContainer.innerHTML = "";
                    teian.utils.loadData(newVal.substring(newVal.indexOf(';') + 1), this);
                } else {
                    const status = this.getAttribute("status");
                    
                    if (status !== "new") {
                        contentContainer.innerHTML = "";
                        teian.submission({"url": newVal})
                            .then((data) => {
                                teian.utils.loadData(data, this);
                            })
                            .catch(error => {
                                console.log(error);
                        });                        
                    }
                }
            break;
        }
    }
    
    reset() {
		this.setAttribute("status", "new");
    		this.setAttribute("src", "");
		this.removeAttribute("slot");
		this.contentContainer.innerHTML = this.emptyContent;
    }
}

window.customElements.define("teian-editor", TeianEditorComponent);
