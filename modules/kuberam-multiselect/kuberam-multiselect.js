export default class KuberamMultiselectComponent extends HTMLElement {
    constructor() {
        super();
        
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML =
            `
                <style>
                    /**
                     * @file sellect.js is micro-library.
                     * Scaffolded with generator-microjs
                     * @author Lidia Freitas <lidiafreitas.me@gmail.com>
                     */
                    
                    * {
                        box-sizing: border-box;
                        font-family: Verdana, sans-serif;
                        font-size: 11px;
                    }
                    
                    .sellect-container {
                        width: 400px;
                        border: 1px solid #ccc;
                        padding: 5px 5px 0 5px;
                        border-radius: 3px;
                        margin-top: 5px;
                        position: relative;
                    }
                    
                    .sellect-element {
                        border: none;
                        height: 18px;
                        background: none;
                    }                    
                    
                    .sellect-destination-list {
                        display: inline-block;
                    }
                    
                    .sellect-destination-list .sellect-item {
                        margin: 0 5px 5px 0;
                        background-color: #e5e5e5;
                        border: 1px solid #ccc;
                        cursor: pointer;
                        border-radius: 2px;
                        padding: 0 5px 2px;
                        display: inline-block;
                    }
                    
                    .sellect-destination-list .sellect-item::after {
                        font-family: "Font Awesome 5 Free";
                        font-weight: 900;
                        content: "\\f00d";                        
                        margin-left: 5px;
                    }                    
                    
                    .sellect-origin-list {
                        overflow: auto;
                        max-height: 0;
                        opacity: 0;
                        transition: opacity 1.1s ease, max-height .2s ease;
                    }
                    
                    .sellect-origin-list.open {
                        max-height: 138px;
                        opacity: 1;
                    }
                    
                    .sellect-origin-list .sellect-item {
                        display: block;
                        cursor: pointer;
                        padding: 5px;
                        border-radius: 3px;
                        margin-right: 5px;
                    }
                    
                    .sellect-origin-list .sellect-item:last-child {
                        margin-bottom: 5px;
                    }
                    
                    .sellect-origin-list .sellect-item:hover,
                    .sellect-origin-list .sellect-item.active {
                        background: #e2e2e2;
                    }
                    
                    .sellect-arrow-icon {
                        font-family: "Font Awesome 5 Free";
                        font-weight: 900;
                        position: absolute;
                        cursor: pointer;
                        top: 0;
                        right: 0;
                        padding: 8px;
                    }
                </style>
                <div class="sellect-container">
        		    <div class="sellect-destination-list"></div>
        		    <input type="text" class="sellect-element" />        		    
        		    <div class="sellect-origin-list"></div>
        		    <span class="sellect-arrow-icon">&#xf078;</span>
        		<div>
        `;
    }    

    connectedCallback() {
        const root = this.shadowRoot;
        const width = this.getAttribute("width") || "400px";

        this.originList = new Function("return " + this.dataset.itemset)();
        
        this.hostElement = this.getHostElement(this);
        
        this.destinationList = Array.from(this.hostElement.querySelectorAll(this.dataset.ref)).map(item => item.dataset.value);
        
        this.container = root.querySelector(".sellect-container");        
        this.container.style.width = width;
        this.destinationListHTML = root.querySelector(".sellect-destination-list");
        this.originListHTML = root.querySelector(".sellect-origin-list");
        this.element = root.querySelector(".sellect-element");
        this.arrow = root.querySelector(".sellect-arrow-icon");
        
        var originListProcessed = this.originList.map((option, index) => `<span class="sellect-trigger sellect-item" data-value="${option[1]}" data-index="${index}">${option[0]}</span>`.trim())
        var destinationListProcessed = [];
        
        this.destinationListHTML.innerHTML = (this.destinationList.map(option => {
            const originListIndex = this.originList.findIndex(item => item[1] == option);
            const destinationListOption = originListProcessed[originListIndex];
            originListProcessed[originListIndex] = "selected";
            
            return destinationListOption;
        })).join('');
        originListProcessed = originListProcessed.filter(item => item !== "selected");
        this.originListHTML.innerHTML = originListProcessed.join('');
        
        this.element.placeholder = this.getAttribute("placeholder");

        this.initializeEvents();  
    }

    initializeEvents() {
        this.originListHTML.addEventListener('click', this.swapItemDOM.bind(this), false);
        
        this.destinationListHTML.addEventListener('click', this.swapItemDOM.bind(this), false);

        this.container.addEventListener('click', this.openOriginList.bind(this), false);

        this.arrow.addEventListener('click', this.toggleOriginList.bind(this), false);

        this.element.addEventListener('keyup', (function (event) {
            var key = event.keyCode || event.charCode;

            switch (key) {
                case 40:
                    if (this.originListHTML.childNodes.length > 0){
                        this.selectionDown(event);
                        this.scrollTop(event);
                    }
                    break;

                case 38:
                    if (this.originListHTML.childNodes.length > 0) {
                        this.selectionUp(event);
                        this.scrollBottom(event);
                    }
                    break;

                case 13:
                    this.selectItemOriginList(event);
                    break;

                default:
                    this.filterOriginList(event);
                    break;
            }

        }).bind(this), false);

        this.element.addEventListener('keydown', this.captureEmpty.bind(this), false);

        this.element.addEventListener('focus', this.openOriginList.bind(this), false);

        window.addEventListener('click', this.closeOriginList.bind(this), false);
    }

    swapItemDOM(event) {
        const trigger = event.target;
        
        if (trigger.localName == "div") {
            return;
        }
        
        event.stopPropagation();
        
        const triggerParent = trigger.parentNode;
        const triggerParentClasses = triggerParent.classList;
        var list;
        var item;

        item = trigger.classList.contains('sellect-trigger') ? trigger : triggerParent;

        if (triggerParentClasses.contains("sellect-origin-list")) {
            list = this.destinationListHTML;
            document.dispatchEvent(new CustomEvent("kuberam-multiselect-item-added", {detail: {
            	"roleTerm": item.dataset.value,
				"host": this.hostElement
			}}));
        } else {
            list = this.originListHTML;
            document.dispatchEvent(new CustomEvent("kuberam-multiselect-item-removed", {detail: {
                "roleTerm": item.dataset.value,
				"host": this.hostElement
			}}));
        }

        if (!item || item.className.indexOf('sellected-list') > -1 || item.className.indexOf('sellect-list') > -1) {
            return;
        }
        
        item.parentNode.removeChild(item);
        
        if (triggerParentClasses.contains("sellect-origin-list")) {
            list.appendChild(item);
        } else {
            const listIndexes = Array.from(list.querySelectorAll("*")).map(item => Number(item.dataset.index));
            const currentItemIndex = item.dataset.index;
            const previousItemIndex = Math.max.apply(Math, listIndexes.filter(item => item <= currentItemIndex));
            const previousItem = list.querySelector("*[data-index='" + previousItemIndex + "']");
            if (previousItem == null) {
                list.prepend(item);
            } else {
                previousItem.parentNode.insertBefore(item, previousItem.nextSibling);
            }
        }        
        
        item.classList.remove('active');

        this.element.value = '';
        this.element.focus();
        this.createEventListener("keyup");
        
        if (this.onInsert) {
            this.onInsert(event, item);
        }

        if (this.onRemove) {
            this.onRemove(event, item);
        }
    }

    filterOriginList(event) {
        var string = event.target.value;
        var items = this.originListHTML.childNodes;

        items.forEach(item => {
            if (item.innerText.indexOf(string) !== -1) {
                item.style.display = 'inherit';
            }
            else {
                item.style.display = 'none';
            }
        });
    }

    captureEmpty(event) {
        var key = event.keyCode || event.charCode;
        var string = event.target.value;

        if (key === 8 && string === '' && this.destinationListHTML.childNodes.length > 0) {
            var lastItem = this.destinationListHTML.lastElementChild;
            lastItem.click();
        }
    }

    selectionUp() {
        var selectedItem = this.originListHTML.getElementsByClassName('active')[0];
        var prevItem;

        if (!selectedItem || !selectedItem.previousElementSibling) {
            return;
        }

        prevItem = this.getOriginListVisibleItem(selectedItem.previousElementSibling);

        if (prevItem){
            prevItem .classList.add('active');
            selectedItem.classList.remove('active');
        }
    }

    selectionDown() {
        var selectedItem = this.originListHTML.getElementsByClassName('active')[0];
        var nextItem;

        if (!selectedItem) {
            nextItem = this.getOriginListVisibleItem(this.originListHTML.childNodes[0], 'down');

            if(nextItem) {
                nextItem.classList.add('active');
            }

            return;
        }

        if (!selectedItem.nextElementSibling) return;

        nextItem = this.getOriginListVisibleItem(selectedItem.nextElementSibling, 'down');

        if (nextItem) {
            nextItem.classList.add('active');
            selectedItem.classList.remove('active');
        }
    }

    scrollTop() {
        var selectedItem = this.originListHTML.getElementsByClassName('active')[0];

        if (!selectedItem) return;

        var itemPositionTop = selectedItem.offsetTop;

        if (itemPositionTop >= this.originListHTML.clientHeight + selectedItem.clientHeight){
            this.originListHTML.scrollTop = this.originListHTML.scrollTop + selectedItem.clientHeight;
            
            return true;
        }
    }

    scrollBottom() {
        var selectedItem = this.originListHTML.getElementsByClassName('active')[0];

        if (!selectedItem) return;

        var itemPositionTop = selectedItem.offsetTop;

        if(itemPositionTop <= (this.originListHTML.scrollHeight - this.originListHTML.clientHeight) + selectedItem.clientHeight){
            this.originListHTML.scrollTop = this.originListHTML.scrollTop - selectedItem.clientHeight;
            
            return true;
        }
    }

    getOriginListVisibleItem(selectCandidate, direction) {
        if (direction === 'down'){
            while (selectCandidate.offsetParent === null && selectCandidate.nextElementSibling){
                selectCandidate = selectCandidate.nextElementSibling;
            }
        }
        else{
            while (selectCandidate.offsetParent === null && selectCandidate.previousElementSibling){
                selectCandidate = selectCandidate.previousElementSibling;
            }
        }

        return selectCandidate.offsetParent !== null ? selectCandidate : false;

    }

    selectItemOriginList() {
        var selectedItem = this.originListHTML.getElementsByClassName('active')[0];

        this.swapItemDOM(selectedItem, this.destinationListHTML);
    }

    createEventListener(eventType) {
        var customEvent = new Event(eventType, {"bubbles": true, "cancelable": true});
        this.element.dispatchEvent(customEvent);
    }

    openOriginList(event) {
        event.stopPropagation();
        
        if (!this.originListHTML.classList.contains('open')){
            this.element.focus();
            this.originListHTML.classList.add('open');
        }
    }

    closeOriginList(event) {
        event.stopPropagation();

        if (this.originListHTML.classList.contains('open')){
            this.originListHTML.classList.remove('open');
        }
    }

    toggleOriginList(event) {
        event.stopPropagation();

        if (!this.originListHTML.classList.contains('open')){
            this.originListHTML.classList.add('open');
        } else {
            this.originListHTML.classList.remove('open');
        }
    }

    getSelected() {
        this.destinationList = [];

        for (var i = 0; i < this.destinationListHTML.childNodes.length; i++) {
            this.destinationList.push(this.destinationListHTML.childNodes[i].textContent);
        }

        return this.destinationList;
    }
    
    getHostElement(node) {
        const parentNode = node.parentNode;
        
        if (parentNode instanceof ShadowRoot) {
            return parentNode.host;
        } else {
            return this.getHostElement(parentNode);
        }
    }
}

window.customElements.define("kuberam-multiselect", KuberamMultiselectComponent);
