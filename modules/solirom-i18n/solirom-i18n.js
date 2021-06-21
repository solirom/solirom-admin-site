export default class SoliromI18n extends HTMLElement {
    constructor() {
        super();
        
        this.attachShadow({mode: 'open'});
    	const root = this.shadowRoot;
			        
        root.innerHTML =
            `
                <style>  
					.meter { 
						height: 5px;
					}
					.meter > span {
						display: block;
						height: 100%;
					    border-radius: 20px;
						background-color: rgb(43,194,83);
						background-image: -webkit-gradient(
						  linear,
						  left bottom,
						  left top,
						  color-stop(0, rgb(43,194,83)),
						  color-stop(1, rgb(84,240,84))
						 );
						background-image: -moz-linear-gradient(
						  center bottom,
						  rgb(43,194,83) 37%,
						  rgb(84,240,84) 69%
						 );
						-webkit-box-shadow: 
						  inset 0 2px 9px  rgba(255,255,255,0.3),
						  inset 0 -2px 6px rgba(0,0,0,0.4);
						-moz-box-shadow: 
						  inset 0 2px 9px  rgba(255,255,255,0.3),
						  inset 0 -2px 6px rgba(0,0,0,0.4);
						box-shadow: 
						  inset 0 2px 9px  rgba(255,255,255,0.3),
						  inset 0 -2px 6px rgba(0,0,0,0.4);
						position: relative;
						overflow: hidden;
					}
					.meter > span:after {
						content: "";
						position: absolute;
						top: 0; left: 0; bottom: 0; right: 0;
						background-image: 
						   -webkit-gradient(linear, 0 0, 100% 100%, 
						      color-stop(.25, rgba(255, 255, 255, .2)), 
						      color-stop(.25, transparent), color-stop(.5, transparent), 
						      color-stop(.5, rgba(255, 255, 255, .2)), 
						      color-stop(.75, rgba(255, 255, 255, .2)), 
						      color-stop(.75, transparent), to(transparent)
						   );
						background-image: 
							-moz-linear-gradient(
							  -45deg, 
						      rgba(255, 255, 255, .2) 25%, 
						      transparent 25%, 
						      transparent 50%, 
						      rgba(255, 255, 255, .2) 50%, 
						      rgba(255, 255, 255, .2) 75%, 
						      transparent 75%, 
						      transparent
						   );
						z-index: 1;
						-webkit-background-size: 50px 50px;
						-moz-background-size: 50px 50px;
						-webkit-animation: move 2s linear infinite;
						border-radius: 20px;
						overflow: hidden;
					}
					
					@-webkit-keyframes move {
					    0% {
					       background-position: 0 0;
					    }
					    100% {
					       background-position: 50px 50px;
					    }
					}                             
                </style>
				<div class="meter">
					<span style="width: 100%"></span>
				</div>
        `;
        
    	this.container = root.querySelector(".meter");        
    }    
    
    connectedCallback() {
    	const root = this.shadowRoot;
    	const width = this.getAttribute("width") || "100%";
		
		this.container.style.width = width;    	
    }
    
    disconnectedCallback() {
    }   
}

window.customElements.define("solirom-i18n", SoliromI18n);
