window.kuberam = {};
kuberam.loginElement = {};
kuberam.loginElement.events = {};
kuberam.loginElement.events.login = new CustomEvent("kuberam.loginElement.events.login");
kuberam.loginElement.events.logout = new CustomEvent("kuberam.loginElement.events.logout");

export default class KuberamLoginElement extends HTMLElement {
    constructor() {
        super();
        
        const shadowRoot = this.attachShadow({mode: 'open'});
        
        this.username = "";
        this.userFullName = "";
        this.userRole = "";

        if (localStorage.getItem('kuberam.loginElement.username')) {
            this.username = localStorage.getItem('kuberam.loginElement.username');
            this.userFullName = localStorage.getItem('kuberam.loginElement.userFullName');
            this.userRole = localStorage.getItem('kuberam.loginElement.userRole');
        } 
        
        shadowRoot.innerHTML = 
        `
            <style>
                :host(*) {
                    float: right;
                }
                #loginForm, #loggedInForm  {
                    display: none;
                }
                div {
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                }                
            </style>        
            <div id="loginForm">
                <label for="users">Selectare utilizator </label>
                <slot name="user-details" />
            </div>
            <div id="loggedInForm">
                <a id="username" href="#" onclick="document.dispatchEvent(kuberam.loginElement.events.logout);">${this.userFullName}</a><span> &#xf2f5;</span>
            </div>
        `;
        
        this.loginForm = shadowRoot.querySelector("#loginForm");
        this.loggedInForm = shadowRoot.querySelector("#loggedInForm");
        this.usersElement = document.querySelector("#users");
        this.usernameElement = shadowRoot.querySelector("#username");
        
        if (this.username === "") {
            this.loginForm.style.display = "block";
        } else {
            this.loggedInForm.style.display = "block";
        } 
    }    

    connectedCallback() {
        document.addEventListener('kuberam.loginElement.events.logout', event => {
            this.usersElement.value = "";
            this.loginForm.style.display = "block";
            this.loggedInForm.style.display = "none";
            localStorage.removeItem("kuberam.loginElement.username");
        });
        document.addEventListener('kuberam.loginElement.events.login', event => {
            const selectElement = this.usersElement;
            const username = selectElement.value;
            const selectedUserElement = selectElement.options[selectElement.selectedIndex];
            const userFullName = selectedUserElement.textContent;
            const userRole = selectedUserElement.dataset.role;
           
            this.usernameElement.innerHTML = userFullName;
            
            this.username = username;
            this.userFullName = userFullName;
            this.userRole = userRole;
            
            this.loginForm.style.display = "none";
            this.loggedInForm.style.display = "block";     
            
            localStorage.setItem("kuberam.loginElement.username", username);
            localStorage.setItem('kuberam.loginElement.userFullName', userFullName);
            localStorage.setItem('kuberam.loginElement.userRole', userRole);
        });   
    }
}

window.customElements.define("kuberam-login-element", KuberamLoginElement);
