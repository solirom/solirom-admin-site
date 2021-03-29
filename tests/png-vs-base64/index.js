document.querySelector("#png-img").src = "DLR-08-f0001.png";

fetch("DLR-08-f0001.b64").then((response) => response.text()).then((data) => document.querySelector("#base64-img").src = data);
