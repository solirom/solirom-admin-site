import TeianEditorComponent from "/modules/teian-editor/modules/editor-component/editor-component.js";

window.teian = {};

teian.documentTypes = {
    "{http://www.loc.gov/mods/v3}mods": "./teian-mods.js"    
};
teian.file = {};
teian.update = {};
teian.dataInstances = {};
teian.actions = {};
teian.events = {};
teian.utils = {};
teian.frameworkDefinition = {};

teian.events.teianFileOpened = new CustomEvent("teian-file-opened");
teian.events.teianFileEdited = new CustomEvent("teian-file-edited", {bubbles: true});

teian.xslTemplate =
    `<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
        <xsl:output method="xml" indent="yes" omit-xml-declaration="yes" encoding="utf-8" />
        <xsl:template match="*">
            <xsl:param name="upperCase" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'"/>
            <xsl:param name="lowerCase" select="'abcdefghijklmnopqrstuvwxyz'"/>        
            <xsl:variable name="newName" select="concat('t-', translate(local-name(), $upperCase, $lowerCase))" />
            <xsl:element name="{$newName}" namespace="http://www.w3.org/1999/xhtml">
                <xsl:attribute name="data-name">
                    <xsl:value-of select="name()"/>
                </xsl:attribute>
                <xsl:attribute name="data-ns">
                    <xsl:value-of select="namespace-uri(.)"/>
                </xsl:attribute>
                <xsl:attribute name="data-value">
                    <xsl:value-of select="normalize-space(text())"/>
                </xsl:attribute> 
                <xsl:attribute name="slot">
                    <xsl:value-of select="$newName"/>
                </xsl:attribute>                 
                <xsl:apply-templates select="namespace::*"/>                
                <xsl:apply-templates select="@*|node()"/>
            </xsl:element>
        </xsl:template>
        <xsl:template match="@*">
            <xsl:copy>
                <xsl:apply-templates select="@*"/>
            </xsl:copy>
        </xsl:template>
        <xsl:template match="text()" />        
    </xsl:stylesheet>`;
teian.compiledXsl = (new DOMParser()).parseFromString(teian.xslTemplate, "application/xml");

teian.submission = obj => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(obj.method || "GET", obj.url);
        if (obj.headers) {
            Object.keys(obj.headers).forEach(key => {
                xhr.setRequestHeader(key, obj.headers[key]);
            });
        }
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.onerror = () => reject(xhr.statusText);
        
        xhr.send(obj.body);
    });
};

teian.transformContent = function(content) {
	const oXSLTProcessor = new XSLTProcessor();
	oXSLTProcessor.importStylesheet(teian.compiledXsl);
	
    return oXSLTProcessor.transformToDocument(content);    
};

teian.formControlClass = class extends HTMLElement {
    constructor() {
        super();
        
        this._onChange = this._onChange.bind(this);
        
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = teian.frameworkDefinition[this.localName + "-template"];
    }
    
    connectedCallback() {
        this.shadowRoot.querySelectorAll(":not(style)").forEach(this._initializeFormControl, this);
    }
    
    disconnectedCallback() {
        //TODO: this.shadowRoot.querySelectorAll("*[data-ref]").forEach(removeEventListener('change', this._onChange));        
    }

    _initializeFormControl(formControl) {
        const onpaste = formControl.dataset.onpaste;
        if (formControl.dataset.ref) {
            this._updateFormControl(formControl);
            formControl.addEventListener('input', this._onChange);  
        } 
        
        if (onpaste) {
            if (onpaste == "pastePlainText") {
                formControl.addEventListener('paste',  this._pastePlainText);  
            }
        }        
        
        formControl.hostElement = this;
    }
    
    _updateFormControl(formControl) {
        const ref = formControl.dataset.ref;
        const formControlName = formControl.localName;

        var newValue = "";
        if (ref == "#text") {
            newValue = this.dataset.value;
        } else if (ref.startsWith("@")) {
            const attributeName = ref.substring(1);
            newValue = this.getAttribute(attributeName) || "";                
        }        

        newValue = newValue.replace(/&gt;/g, ">");
        newValue = newValue.replace(/&lt;/g, "<");
        
        switch (formControlName) {
            case "label":
            case "div":            
                formControl.innerHTML = newValue;
                break;
            case "a":
                formControl.text = newValue;
                break;
            default:
                formControl.value = newValue;
        }
    }
    _onChange(event) {
        const formControl = event.target;
        const ref = formControl.dataset.ref;
        const formControlName = formControl.localName;
        
        var newValue = "";
        switch (formControlName) {
            case "label":
            case "div":            
                newValue = formControl.innerHTML;
                break;
            case "a":
                newValue = formControl.text;
                break;
            default:
                newValue = formControl.value;
        }        
        
        //encode the newValue
        newValue = newValue.replace("<br>", "");
        newValue = newValue.replace(/>/g, "&gt;");
        newValue = newValue.replace(/</g, "&lt;");
        
        if (ref == "#text") {
            this.dataset.value = newValue;
        } else if (ref.startsWith("@")) {
            const attributeName = ref.substring(1);
            this.setAttribute(attributeName, newValue);
        }
    }
    
    _pastePlainText(event) {
        let paste = (event.clipboardData || window.clipboardData).getData('text');
        
        const selection = window.getSelection();
        if (!selection.rangeCount) return false;
        selection.deleteFromDocument();
        selection.getRangeAt(0).insertNode(document.createTextNode(paste));

        event.target.dispatchEvent(new Event("input"));
        event.preventDefault();
    };    
};

teian.divClass = class extends HTMLElement {
    constructor() {
        super();
        
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = teian.frameworkDefinition[this.localName + "-template"];     
    }
};

teian.update.insertAfter = function(newNode, currentNode) {
    currentNode.parentNode.insertBefore(newNode, currentNode.nextSibling);
	document.dispatchEvent(new CustomEvent("teian-node-added", {detail: currentNode}));    
}

teian.update.insertInto = function(newNode, currentNode) {
    currentNode.appendChild(newNode);
	document.dispatchEvent(new CustomEvent("teian-node-added", {detail: currentNode}));    
}

teian.update.delete = function(currentNode) {
	document.dispatchEvent(new CustomEvent("teian-node-to-remove", {detail: currentNode}));    	
    currentNode.parentNode.removeChild(currentNode);
}

teian.utils.loadData = function(data, customElement) {
    const content = (new DOMParser()).parseFromString(data, "application/xml").documentElement;
    const rootElementLocalName = content.localName;
    const currentDocumentType = "{" + content.namespaceURI + "}" + rootElementLocalName;
    const modulePath = teian.documentTypes[currentDocumentType];
    customElement.setAttribute("slot", rootElementLocalName + "-" + rootElementLocalName);
    
    const transformedContent = teian.transformContent(content).documentElement.cloneNode(true);
    customElement.shadowRoot.querySelector("#content").appendChild(transformedContent);
    
    //import the framework based upon document type
    //import(`${modulePath}`)
    //   .then((module) => {
    //}); 
    document.dispatchEvent(teian.events.teianFileOpened);
};

teian.utils.unloadData = function() {
    var content = document.querySelector("teian-editor").shadowRoot.querySelector("#content > *");
    content = (new XMLSerializer()).serializeToString(content);
    content = content.replace('&nbsp;', '&#160;');
    content = content.replace("ş", "ș");
    content = content.replace("ţ", "ț");
    content = content.replace("Ş", "Ș");
    content = content.replace("Ţ", "Ț");

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
};

teian.actions.clearTextFormatting = function(element) {
    var textContent = element.textContent;
    textContent = decodeURIComponent(textContent);
    element.textContent = textContent;
    element.dispatchEvent(new Event("input"));
    
    return false;    
};
