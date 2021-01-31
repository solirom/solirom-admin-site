solirom = {};
solirom.update = {};
solirom.templates = {};
solirom.dataInstances = {};

solirom.dataInstances.outputData = 
    {
        "profil-1": {
            "data": {
                "section-111": 0,
                "section-112": [0],
                "section-113": [0],
                "section-114": [0],
                "section-115": [0],
                "section-121": [0],
                "section-122": [0],
                "section-13": [0],
                "section-14": 0,
                "section-211": [0],
                "section-212": [0],
                "section-213": [0],
                "section-214": 0,
                "section-221": [0],
                "section-222": [0],
                "section-231": [0],
                "section-232": 0,
                "section-241": [0],
                "section-31": 0,
                "section-32": 0,
                "section-331": 0,
                "section-332": 0,
                "section-34": [0],
                "section-351": 0,
                "section-352": 0,
                "section-36": 0,
                "section-37": 0
            }
        }
    }

;
solirom.dataInstances.currentProfileId = "profil-1";

if (localStorage.getItem('solirom-academic-score')) {
    solirom.dataInstances.outputData = JSON.parse(localStorage.getItem('solirom-academic-score'));
    solirom.dataInstances.currentProfileId = "profil-1";
}

setCurrentProfileData();

const buttonsTemplate = 
`
    <button name="insertAfterButton">&#xf067;</button>
    <button name="deleteButton">&#xf2ed;</button>  
`;

solirom.templates["section-111"] =
`
    <div xmlns="http://www.w3.org/1999/xhtml" class="section">
        <input type="checkbox" data-score="30" />
    </div>
`;
solirom.templates["section-112"] =
`
    <div xmlns="http://www.w3.org/1999/xhtml">
        <select>
            <option value="1" data-score="0" />
        	<option value="2" data-score="40">autor, editură din străinătate</option>
        	<option value="3" data-score="30">autor, editură din țară</option>                                	
        	<option value="4" data-score="20">coautor, editură din străinătate</option>
        	<option value="5" data-score="15">coautor, editură din țară</option>                                	
        </select> 
        ${buttonsTemplate}
    </div>
`;
solirom.templates["section-113"] =
`
    <div xmlns="http://www.w3.org/1999/xhtml">
        <select>
            <option value="1" data-score="0" />
        	<option value="2" data-score="30">coordonator, editură din străinătate</option>
        	<option value="3" data-score="25">coordonator, editură din țară</option>                                	
        	<option value="4" data-score="20">coautor, editură din străinătate</option>
        	<option value="5" data-score="15">coautor, editură din țară</option>                                	
        </select>  
	    ${buttonsTemplate}                                
    </div>
`;
solirom.templates["section-114"] =
`
    <div xmlns="http://www.w3.org/1999/xhtml">
        <select>
            <option value="1" data-score="0" />
        	<option value="2" data-score="25">autor, editură din străinătate</option>
        	<option value="3" data-score="20">autor, editură din țară</option>                                	
        	<option value="4" data-score="15">coautor, editură din străinătate</option>
        	<option value="5" data-score="10">coautor, editură din țară</option>                                	
        </select>  
	    ${buttonsTemplate}                                
    </div>
`;
solirom.templates["section-115"] =
`
    <div xmlns="http://www.w3.org/1999/xhtml">
        <select>
            <option value="1" data-score="0" />
        	<option value="2" data-score="20">coordonator (editor), editare în străinătate</option>
        	<option value="3" data-score="10">coordonator (editor), editare în țară</option>                                	
        	<option value="4" data-score="10">co-editor, editare în străinătate</option>
        	<option value="5" data-score="7">co-editor, editare în țară</option>                                	
        </select>  
	    ${buttonsTemplate}                                
    </div>
`;
solirom.templates["section-121"] =
`
    <div xmlns="http://www.w3.org/1999/xhtml">
        <select>
            <option value="1" data-score="0" />
        	<option value="2" data-score="15">autor</option>                                	
        	<option value="3" data-score="10">coautor</option>                                	
        </select>  
	    ${buttonsTemplate}                                
    </div>
`;
solirom.templates["section-122"] =
`
    <div xmlns="http://www.w3.org/1999/xhtml">
        <select>
            <option value="1" data-score="0" />
        	<option value="2" data-score="15">autor</option>                                	
        	<option value="3" data-score="7">coautor</option>                                	
        </select>  
	    ${buttonsTemplate}                                
    </div>
`;
solirom.templates["section-13"] =
`
    <div xmlns="http://www.w3.org/1999/xhtml">
        <select>
            <option value="1" data-score="0" />
        	<option value="2" data-score="20">autor</option>                                	
        	<option value="3" data-score="10">coautor</option>                                	
        </select>  
	    ${buttonsTemplate}                                
    </div>
`;
solirom.templates["section-14"] =
`
    <div xmlns="http://www.w3.org/1999/xhtml" class="section">
        <input type="checkbox" data-score="10" />
    </div>
`;
solirom.templates["section-211"] =
`
    <div xmlns="http://www.w3.org/1999/xhtml">
        <select>
            <option value="1" data-score="0" />
        	<option value="2" data-score="25">autor de articol</option>                                	
        	<option value="3" data-score="15">coautor de articol</option>                                	
        </select>  
	    ${buttonsTemplate}                                
    </div>
`;
solirom.templates["section-212"] =
`
    <div xmlns="http://www.w3.org/1999/xhtml">
        <select>
            <option value="1" data-score="0" />
        	<option value="2" data-score="15">autor de articol</option>                                	
        	<option value="3" data-score="7">coautor de articol</option>
        	<option value="4" data-score="5">recenzie</option>
        </select>  
	    ${buttonsTemplate}                                
    </div>
`;
solirom.templates["section-213"] =
`
    <div xmlns="http://www.w3.org/1999/xhtml">
        <select>
            <option value="1" data-score="0" />
        	<option value="2" data-score="15">autor de articol publicat în străinătate</option>                                	
        	<option value="3" data-score="7">coautor de articol publicat în străinătate</option>
        	<option value="4" data-score="10">autor de articol publicat în țară</option>                                	
        	<option value="5" data-score="5">coautor de articol publicat în țară</option> 
        	<option value="6" data-score="5">recenzie publicată în străinătate</option>
        	<option value="7" data-score="5">recenzie publicată în țară</option>
        </select>  
	    ${buttonsTemplate}                                
    </div>
`;
solirom.templates["section-214"] =
`
    <div xmlns="http://www.w3.org/1999/xhtml">
        <input type="number" min="0" max="25" data-score="2" value="0" />                                
    </div>
`;
solirom.templates["section-221"] =
`
    <div xmlns="http://www.w3.org/1999/xhtml">
        <select>
            <option value="1" data-score="0" />
        	<option value="2" data-score="15">din străinătate</option>                                	
        	<option value="3" data-score="10">din țară</option>                                	
        </select>  
	    ${buttonsTemplate}                                
    </div>
`;
solirom.templates["section-222"] =
`
    <div xmlns="http://www.w3.org/1999/xhtml">
        <select>
            <option value="1" data-score="0" />
        	<option value="2" data-score="7">din străinătate</option>                                	
        	<option value="3" data-score="5">din țară</option>                                	
        </select>  
	    ${buttonsTemplate}                                
    </div>
`;
solirom.templates["section-231"] =
`
    <div xmlns="http://www.w3.org/1999/xhtml">
        <select>
            <option value="1" data-score="0" />
        	<option value="2" data-score="30">director</option>                                	
        	<option value="3" data-score="15">membru</option>                                	
        </select>  
	    ${buttonsTemplate}                                
    </div>
`;
solirom.templates["section-232"] =
`
    <div xmlns="http://www.w3.org/1999/xhtml">
        <input type="number" min="0" data-score="10" value="0" />                                
    </div>
`;
solirom.templates["section-241"] =
`
    <div xmlns="http://www.w3.org/1999/xhtml">
        <select>
            <option value="1" data-score="0" />
        	<option value="2" data-score="4">în străinătate</option>                                	
        	<option value="3" data-score="2">în țară</option>
        </select>  
	    ${buttonsTemplate}                                
    </div>
`;
solirom.templates["section-31"] =
`
    <div xmlns="http://www.w3.org/1999/xhtml">
        <input type="number" min="0" data-score="20" value="0" />                                
    </div>
`;
solirom.templates["section-32"] =
`
    <div xmlns="http://www.w3.org/1999/xhtml">
        <input type="number" min="0" data-score="10" value="0" />                                
    </div>
`;
solirom.templates["section-331"] =
`
    <div xmlns="http://www.w3.org/1999/xhtml">
        <input type="number" min="0" data-score="2" value="0" />                                
    </div>
`;
solirom.templates["section-332"] =
`
    <div xmlns="http://www.w3.org/1999/xhtml">
        <input type="number" min="0" data-score="5" value="0" />                                
    </div>
`;
solirom.templates["section-34"] =
`
    <div xmlns="http://www.w3.org/1999/xhtml">
        <select>
            <option value="1" data-score="0" />
        	<option value="2" data-score="10">internaționale</option>                                	
        	<option value="3" data-score="5">naționale</option>
        </select>  
	    ${buttonsTemplate}                                
    </div>
`;
solirom.templates["section-351"] =
`
    <div xmlns="http://www.w3.org/1999/xhtml">
        <input type="number" min="0" data-score="5" value="0" />                                
    </div>
`;
solirom.templates["section-352"] =
`
    <div xmlns="http://www.w3.org/1999/xhtml">
        <input type="number" min="0" data-score="15" value="0" />                                
    </div>
`;
solirom.templates["section-36"] =
`
    <div xmlns="http://www.w3.org/1999/xhtml">
        <input type="number" min="0" max="50" data-score="2" value="0" />                                
    </div>
`;
solirom.templates["section-37"] =
`
    <div xmlns="http://www.w3.org/1999/xhtml">
        <input type="number" min="0" data-score="2" value="0" />                                
    </div>
`;

Object.entries(solirom.templates).forEach(([sectionId, template]) => {
    const section = document.getElementById(sectionId);
    const data = solirom.dataInstances.currentProfileData[sectionId];

    (() => {
        const dataType = typeof data;

        switch (dataType) {
            case 'number':
                section.innerHTML = template;
                const inputElement = section.children[0].children[0];
                const inputElementType = inputElement.getAttribute("type");

                switch (inputElementType) {
                    case 'checkbox':
                        inputElement.checked = Boolean(data);
                    break;
                    case 'number':
                        inputElement.value = data;
                    break;                   
                }
            break;
            case 'object':
                data.forEach((item, index) => {
                    section.innerHTML += template;
                    const container = section.children[index];
                    container.dataset.template = sectionId;
                    container.querySelector("select > option:nth-of-type(" + (item + 1) + ")").setAttribute("selected", true);
                });
            break;
        }            
        
    })();
    
    section.recalculate = function() {
        var checkboxSelectedIndexes = [];
        
        const subtotal = Array.from(this.querySelectorAll("div > select, div > input")).map(item => {
            if (item.matches("input[type = 'number']")) {
                const value = parseInt(item.value);
                solirom.dataInstances.currentProfileData[sectionId] = value;
                
                return item.dataset.score * value;
            }
            if (item.matches("select")) {
                const option = item.querySelector("option:checked");
                const selectedIndex = item.selectedIndex;
                
                if (selectedIndex != 0) {
                    checkboxSelectedIndexes.push(selectedIndex);
                    
                    return parseInt(option.dataset.score);
                }
            } 
            if (item.matches("input[type = 'checkbox']:checked")) {
                solirom.dataInstances.currentProfileData[sectionId] = 1;
                
                return parseInt(item.dataset.score);
            }
            if (item.matches("input[type = 'checkbox']")) {
                solirom.dataInstances.currentProfileData[sectionId] = 0;
            }            
            
            return 0;
        })
        .reduce((a, b) => a + b, 0);
        
        if (checkboxSelectedIndexes.length > 0) {
            solirom.dataInstances.currentProfileData[sectionId] = checkboxSelectedIndexes;
        }
        
        document.getElementById(sectionId + "-subtotal").value = subtotal;
        
        recalculateGrandTotal();
    };
    
    section.recalculate();
});

document.addEventListener('click', event => {
    const target = event.target;
    const container = target.parentNode;
    const section = container.parentNode;
        
	if (target.matches("[name = 'deleteButton']")) {
        section.removeChild(container);
        section.recalculate();
    }
    
	if (target.matches("[name = 'insertAfterButton']")) {
	    const templateId = container.dataset.template;
	    const template = (new DOMParser()).parseFromString(solirom.templates[templateId], 'application/xml').documentElement.cloneNode(true);
        template.dataset.template = templateId;	    
        section.insertBefore(template, container.nextSibling);
    }
    
    if (target.matches("[id = 'save-button']")) {
        console.log(JSON.stringify(solirom.dataInstances.currentProfileData));
        localStorage.setItem("solirom-academic-score", JSON.stringify(solirom.dataInstances.outputData));
    }
}, false);
["change"].forEach(eventType => 
    document.addEventListener(eventType, event => event.target.parentNode.parentNode.recalculate(), false)
);


function recalculateGrandTotal() {
    const total_a1 = Array.from(document.querySelectorAll("#score-calculator-table output[id ^= 'section-1']")).map(item => parseInt(item.value)).reduce((a, b) => a + b);
    document.getElementById("total-a1").value = total_a1;
    
    const total_a2 = Array.from(document.querySelectorAll("#score-calculator-table output[id ^= 'section-2']")).map(item => parseInt(item.value)).reduce((a, b) => a + b);
    document.getElementById("total-a2").value = total_a2;
    
    const total_a3 = Array.from(document.querySelectorAll("#score-calculator-table output[id ^= 'section-3']")).map(item => parseInt(item.value)).reduce((a, b) => a + b);
    document.getElementById("total-a3").value = total_a3;    
    
    const grandTotal = total_a1 + total_a2 + total_a3;
    
    document.getElementById("grand-total").value = grandTotal;
}

function setCurrentProfileData() {
    solirom.dataInstances.currentProfile = solirom.dataInstances.outputData[solirom.dataInstances.currentProfileId];
    solirom.dataInstances.currentProfileData = solirom.dataInstances.currentProfile.data;
}