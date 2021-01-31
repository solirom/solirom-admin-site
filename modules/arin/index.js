import solirom from '/modules/solirom/solirom.js';

solirom.data.templates = {
    "markElement": solirom.actions.html`<mark data-id="${props => props.id}" class="highlighted" draggable="true" contenteditable="false">${props => props.textContent}</mark>`
    ,
    "deleteButtonElement": solirom.actions.html`<button>&#xf2ed;</button>`
};

solirom.actions.allowDrop = (allowdropevent) => {
    allowdropevent.preventDefault();
};

solirom.actions.generateId = () => {
    const id = Math.random().toString(36).substr(2, 9);
    const regex = RegExp("6{3}");
    
    if (regex.test(id)) {
        return solirom.actions.generateId();
    } else {
        return id;
    }
};    

document.addEventListener("dblclick", event => {
    const target = event.target;
    
    if (target.matches("#source-text")) {
        const selection = window.getSelection();
       
        //selection.collapseToStart();         
        //selection.modify("move", "forward", "character");
        //selection.modify("move", "backward", "word");
        //selection.modify("extend", "forward", "word");

        const range = selection.getRangeAt(0);
        const selectedText = range.toString().trim();

        const markElement = (new DOMParser()).parseFromString(solirom.data.templates.markElement({"textContent": selectedText, "id": solirom.actions.generateId()}), "text/html").querySelector("mark");        
        range.surroundContents(markElement);
        
        selection.collapseToStart(); 
        //document.execCommand("insertHTML", false, solirom.data.templates.markElement({"selection": selectedText, "id": solirom.actions.generateId()}));
    }
}, false);

document.addEventListener("click", event => {
    const target = event.target;

    if (target.matches("mark.highlighted")) {
        const markTextContent = target.textContent;
        const markParentNode = target.parentNode;
        
        markParentNode.replaceChild(document.createTextNode(markTextContent), target);        
    }    

}, false);

document.addEventListener("dragstart", event => {
    const target = event.target;
    
    if (target.matches("mark.highlighted")) {
        const dataElements = [...document.querySelectorAll("#source-text > mark.highlighted")];
        
        const dataElementIds = dataElements.map((element) => element.dataset.id);
        const dataElementOuterHTMLs = dataElements.map((element) => element.outerHTML).join(" ");
        const dataElementTextContents = dataElements.map((element) => element.textContent).join(" ");
        
        const dragData = {"ids": dataElementIds, "outerHTML": dataElementOuterHTMLs};
        event.dataTransfer.setData("text/html", JSON.stringify(dragData));

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 500;
        canvas.height = 50;
        ctx.font = "22px serif";
        ctx.fillText(dataElementTextContents, 10, 50);
        
        event.dataTransfer.setDragImage(canvas, 0, 0);
    }    
}, false);

document.addEventListener("drop", event => {
    const eventTarget = event.target;
    
    if (eventTarget.matches("#tree-svg")) {
        event.preventDefault();
        const dragData = JSON.parse(event.dataTransfer.getData("text/html"));
        const dataElementIds = dragData.ids;
        const dataElementOuterHTMLs = dragData.outerHTML;
        
        //TODO: replace when dropping in SVG elements
        eventTarget.innerHTML += dataElementOuterHTMLs + " ";
        
        dataElementIds.forEach((id) => {
            const sourceElement = document.querySelector("#source-text > mark[data-id = '" + id + "']");
            sourceElement.classList.replace("highlighted", "dragged");
            sourceElement.setAttribute('draggable', false);
            
            const targetElement = eventTarget.querySelector(":scope > mark[data-id = '" + id + "']");
            targetElement.classList.replace("highlighted", "dropped");

            const deleteButtonElement = (new DOMParser()).parseFromString(solirom.data.templates.deleteButtonElement(), "text/html").querySelector("button");
            targetElement.after(deleteButtonElement);            
        });
    }    

}, false);

function tree(){
    var svgW = 958, svgH = 460, vRad = 12, tree = {cx:300, cy:30, w:40, h:70};
    tree.vis = {v:0, l:'?', p:{x:tree.cx, y:tree.cy},c:[]};	
    tree.size = 1;
    tree.glabels = [];
    tree.incX = 500, tree.incY = 30, tree.incS = 20;
    
    tree.getVertices =  function(){
        var v = [];
        function getVertices(t,f){	
            v.push({v:t.v, l:t.l, p:t.p, f:f});	
            t.c.forEach(function(d){ return getVertices(d,{v:t.v, p:t.p}); });
        }
        getVertices(tree.vis,{});
        return v.sort(function(a,b){ return a.v - b.v;});
    }
    
    tree.getEdges =  function(){
        var e =[];
        function getEdges(_){
            _.c.forEach(function(d){ e.push({v1:_.v, l1:_.l, p1:_.p, v2:d.v, l2:d.l, p2:d.p});});
            _.c.forEach(getEdges);
        }
        getEdges(tree.vis);
        return e.sort(function(a,b){ return a.v2 - b.v2;});	
    }
    
    tree.addLeaf = function(_){
        function addLeaf(t){
            if(t.v==_){ t.c.push({v:tree.size++, l:'?', p:{},c:[]}); return; }
            t.c.forEach(addLeaf);
        }
        addLeaf(tree.vis);
        reposition(tree.vis);
        if(tree.glabels.length != 0){
            tree.glabels =[]
            relabel(
                {
                    lbl: d3.range(0, tree.size).map(function(d){ return '?';}), 
                    incMatx: d3.range(0,tree.size-1).map(function(){ return 0;})
                });
            d3.select("#labelnav").style('visibility','hidden');
        }
        else tree.incMatx = d3.range(0,tree.size-1).map(function(){ return 0;});
        redraw();
    }
    
    updateIncMatx = function(){
        var n = tree.size-1;
        tree.incMatx = d3.range(0,tree.size-1).map(function(){return 0;});
        updateIncMatxl = function(t){
            t.c.forEach(function(c){
                t.l < c.l ? tree.incMatx[t.l]= tree.incMatx[t.l] | (1<<(n-c.l)) : tree.incMatx[c.l]= tree.incMatx[c.l] | (1<<(n-t.l));
                updateIncMatxl(c);
            });
        }
        updateIncMatxl(tree.vis);		
    }
    
    getIncMatxRow = function(i){
        return d3.range(0,tree.size-1-i).map(function(d,j){ var n=tree.size-2-i-j; return (tree.incMatx[i] & 1<<n)>>n; });
    }
    
    tree.showLabel = function(i){
        if(i > tree.glabels.length || i < 1){ alert('invalid label position'); return; } 
        
        relabel(tree.glabels[i-1]);
        redraw();
        tree.currLbl = i;
        d3.select("#labelpos").text(tree.currLbl+'/'+tree.glabels.length);
    }
    
    relabel = function(lbl){
        function relbl(t){	t.l=lbl.lbl[t.v];	t.c.forEach(relbl);		}
        relbl(tree.vis);
    }
    
    redraw = function(){
        var edges = d3.select("#g_lines").selectAll('line').data(tree.getEdges());
        
        edges.transition().duration(500)
            .attr('x1',function(d){ return d.p1.x;}).attr('y1',function(d){ return d.p1.y;})
            .attr('x2',function(d){ return d.p2.x;}).attr('y2',function(d){ return d.p2.y;})
    
        edges.enter().append('line')
            .attr('x1',function(d){ return d.p1.x;}).attr('y1',function(d){ return d.p1.y;})
            .attr('x2',function(d){ return d.p1.x;}).attr('y2',function(d){ return d.p1.y;})
            .transition().duration(500)
            .attr('x2',function(d){ return d.p2.x;}).attr('y2',function(d){ return d.p2.y;});
            
        var circles = d3.select("#g_circles").selectAll('circle').data(tree.getVertices());

        circles.transition().duration(500).attr('cx',function(d){ return d.p.x;}).attr('cy',function(d){ return d.p.y;});
        
        circles.enter().append('circle').attr('cx',function(d){ return d.f.p.x;}).attr('cy',function(d){ return d.f.p.y;}).attr('r', vRad)
            .on('click',function(d){return tree.addLeaf(d.v);})
            .transition().duration(500).attr('cx',function(d){ return d.p.x;}).attr('cy',function(d){ return d.p.y;});
            
        var labels = d3.select("#g_labels").selectAll('text').data(tree.getVertices());
        
        labels.text(function(d){return d.l;}).transition().duration(500)
            .attr('x',function(d){ return d.p.x;}).attr('y',function(d){ return d.p.y+5;});
            
        labels.enter().append('text').attr('x',function(d){ return d.f.p.x;}).attr('y',function(d){ return d.f.p.y+5;})
            .text(function(d){return d.l;}).on('click',function(d){return tree.addLeaf(d.v);})
            .transition().duration(500)
            .attr('x',function(d){ return d.p.x;}).attr('y',function(d){ return d.p.y+5;});		
            
        var elabels = d3.select("#g_elabels").selectAll('text').data(tree.getEdges());
                    
        elabels
            .attr('x',function(d){ return (d.p1.x+d.p2.x)/2+(d.p1.x < d.p2.x? 8: -8);}).attr('y',function(d){ return (d.p1.y+d.p2.y)/2;})
            .text(function(d){return tree.glabels.length==0? '': Math.abs(d.l1 -d.l2);});	
            
        elabels.enter().append('text')
            .attr('x',function(d){ return (d.p1.x+d.p2.x)/2+(d.p1.x < d.p2.x? 8: -8);}).attr('y',function(d){ return (d.p1.y+d.p2.y)/2;})
            .text(function(d){return tree.glabels.length==0? '': Math.abs(d.l1 -d.l2);});	
    }
    
    getLeafCount = function(_){
        if(_.c.length ==0) return 1;
        else return _.c.map(getLeafCount).reduce(function(a,b){ return a+b;});
    }
    
    reposition = function(v){
        var lC = getLeafCount(v), left=v.p.x - tree.w*(lC-1)/2;
        v.c.forEach(function(d){
            var w =tree.w*getLeafCount(d); 
            left+=w; 
            d.p = {x:left-(w+tree.w)/2, y:v.p.y+tree.h};
            reposition(d);
        });		
    }	
    
    initialize = function(){
        d3.select("body").append("div").attr('id','navdiv');
        
        d3.select("#navdiv").append("nav").attr('id','labelnav').style('display','inline-block').style('visibility','hidden');
        
        d3.select("#labelnav").append("button").attr('type','button').text('<').attr('id','prevlabel')
            .on('click',function(d){return tree.showLabel(tree.currLbl == 1? tree.glabels.length: tree.currLbl-1);});
            
        d3.select("#labelnav").append("text").text('').attr('id','labelpos');

        d3.select("#labelnav").append("button").attr('type','button').text('>').attr('id','nextlabel')
            .on('click',function(){return tree.showLabel(tree.currLbl == tree.glabels.length? 1: tree.currLbl+1);});			
                        
        d3.select("body").append("svg").attr("width", svgW).attr("height", svgH).attr('id','tree-svg');

        d3.select("#tree-svg").append('g').attr('id','g_lines').selectAll('line').data(tree.getEdges()).enter().append('line')
            .attr('x1',function(d){ return d.p1.x;}).attr('y1',function(d){ return d.p1.y;})
            .attr('x2',function(d){ return d.p2.x;}).attr('y2',function(d){ return d.p2.y;});

        d3.select("#tree-svg").append('g').attr('id','g_circles').selectAll('circle').data(tree.getVertices()).enter()
            .append('circle').attr('cx',function(d){ return d.p.x;}).attr('cy',function(d){ return d.p.y;}).attr('r',vRad)
            .on('click',function(d){return tree.addLeaf(d.v);});
            
        d3.select("#tree-svg").append('g').attr('id','g_labels').selectAll('text').data(tree.getVertices()).enter().append('text')
            .attr('x',function(d){ return d.p.x;}).attr('y',function(d){ return d.p.y+5;}).text(function(d){return d.l;})
            .on('click',function(d){return tree.addLeaf(d.v);});	
            
        d3.select("#tree-svg").append('g').attr('id','g_elabels').selectAll('text').data(tree.getEdges()).enter().append('text')
            .attr('x',function(d){ return (d.p1.x+d.p2.x)/2+(d.p1.x < d.p2.x? 8: -8);}).attr('y',function(d){ return (d.p1.y+d.p2.y)/2;})
            .text(function(d){return tree.glabels.length==0? '': Math.abs(d.l1 -d.l2);});	
            
        d3.select("body").select("svg").append('g').attr('transform',function(){ return 'translate('+tree.incX+','+tree.incY+')';})
            .attr('id','incMatx').selectAll('.incrow')
            .data(tree.incMatx.map(function(d,i){ return {i:i, r:d};})).enter().append('g').attr('class','incrow');

        d3.select("#incMatx").selectAll('.incrowlabel').data(d3.range(0,tree.size)).enter()
            .append('text').attr('class','incrowlabel').text(function(d){ return d;})
            .attr('x',function(d,i){ return (i-0.5)*tree.incS}).attr('y',function(d,i){ return (i+.8)*tree.incS});
        
        tree.addLeaf(0);
        tree.addLeaf(0);
    }
    initialize();

    return tree;
}

//var tree= tree();
