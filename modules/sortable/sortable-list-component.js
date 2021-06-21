import Sortable from './sortable.esm.js';

export default class SortableListComponent extends HTMLElement {
    constructor() {
        super();

        const senseTree = generateSortableTree(this.parentNode.parentNode.host);
        console.log(this.querySelector(":scope"));
        
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML =
            `
                <style>               
                    .col {
                        padding-right: 0;
                        margin-right: 15px;
                    }                
                    .list-group-item:hover {
                        z-index: 0;
                    }  
                    .list-group-item:hover {
                        z-index: 1;
                        text-decoration: none;
                    } 
                    .list-group-item:first-child {
                        border-top-left-radius: .25rem;
                        border-top-right-radius: .25rem;
                    }
                    .nested-sortable, .nested-1, .nested-2, .nested-3 {
                        margin-top: 5px;
                    }                    
                    .list-group-item {
                        position: relative;
                        display: block;
                        padding: .75rem 1.25rem;
                        margin-bottom: -1px;
                        background-color: #fff;
                        border: 1px solid rgba(0,0,0,.125);
                    }
                    .nested {
                        background-color: #e6e6e6;
                    }   
                    *, ::after, ::before {
                        box-sizing: border-box;
                    }                    
                </style>
                <div id="sortable-list">${senseTree}</div>
        `;  
        
        this.contentContainer = this.shadowRoot.querySelector("#sortable-list");
        var nestedSortables = [].slice.call(this.contentContainer.querySelectorAll('.nested-sortable'));
        
        for (var i = 0; i < nestedSortables.length; i++) {
            const sortable = new Sortable(nestedSortables[i], {
                group: 'sortable-list',
                animation: 150,
                fallbackOnBody: true,
                swapThreshold: 0.65,
                onStart: function (event) {
                    sortable.draggedElementOldParentId = event.item.parentNode.dataset.id;
                },                
                onEnd: event => {
                    const insertChildAtIndex = (parent, child, index) => {
                        if (index >= parent.children.length) {
                            parent.appendChild(child);
                        } else {
                            parent.insertBefore(child, parent.children[index]);
                        }
                    };
                    
                    const hostDocument = document.querySelector("teian-editor").shadowRoot.querySelector("#content > *");
                    const draggedElement = event.item;
                    const draggedSense = hostDocument.querySelector("*[*|id = '" + draggedElement.dataset.id + "']");
                    const draggedElementNewSenseParent = hostDocument.querySelector("*[*|id = '" + draggedElement.parentNode.dataset.id + "']");
                    insertChildAtIndex(draggedElementNewSenseParent, draggedSense, event.newIndex);
                }                
            });
        }        
    }    
    
    connectedCallback() {
    }
    
    disconnectedCallback() {
    }
}

window.customElements.define("sortable-list", SortableListComponent);
