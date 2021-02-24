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
        
        const mutationObserverCallback = (mutationsList, observer) => {
            mutationsList.forEach(mutation => {
                if (mutation.type === 'childList') {
                    if (!mutation.target.matches("div#content")) {
                        document.dispatchEvent(teian.events.teianFileEdited);
                    }
                }
                else if (mutation.type === 'attributes') {
                    document.dispatchEvent(teian.events.teianFileEdited);
                    this.dispatchEvent(teian.events.teianFileEdited);
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

    exportData() {
        var content = this.shadowRoot.querySelector("#content > *");
        content = (new XMLSerializer()).serializeToString(content);
        content = content.replace('&nbsp;', '&#160;');
        content = (new DOMParser()).parseFromString(content, 'application/xml');
        var xsltDoc = (new DOMParser()).parseFromString(
            `<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
                <xsl:output method="xml" indent="yes" omit-xml-declaration="yes" encoding="utf-8" />
                <xsl:template match="*">
                    <xsl:element name="{@data-name}" namespace="{@data-ns}">
                        <xsl:apply-templates select="@*"/>
                        <xsl:value-of select="@data-value"/>
                        <xsl:apply-templates select="node()"/>
                    </xsl:element>
                </xsl:template>          
                <xsl:template match="text()">
                    <xsl:value-of select="normalize-space(.)"/>
                </xsl:template>
                <xsl:template match="@*">
                    <xsl:copy>
                        <xsl:apply-templates select="@*"/>
                    </xsl:copy>
                </xsl:template>
                <xsl:template match="@data-name" />
                <xsl:template match="@data-ns" />
                <xsl:template match="@data-value" />
                <xsl:template match="@slot" />
                <xsl:template match="@class" />
                <xsl:template match="@draggable" />
                <xsl:template match="@style" />
            </xsl:stylesheet>`, 'application/xml');
    
        var xsltProcessor = new XSLTProcessor();    
        xsltProcessor.importStylesheet(xsltDoc);
        const resultDoc = xsltProcessor.transformToDocument(content);
        teian.dataInstances.outputData = resultDoc;
        var load = (new XMLSerializer()).serializeToString(resultDoc);
        //load = load.replace(/&amp;nbsp;/g, " ");    
        
        return load;
    }
    
    reset() {
		this.setAttribute("status", "new");
    		this.setAttribute("src", "");
		this.removeAttribute("slot");
		this.contentContainer.innerHTML = this.emptyContent;
    }
}

window.customElements.define("teian-editor", TeianEditorComponent);
