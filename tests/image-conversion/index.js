document.querySelector("#source-image-size").textContent = `Mărime imagine 0 MB`;

document.addEventListener("click", async (event) => {
    const target = event.target;
    
    if (target.matches("#add-scan")) {
    	document.getElementById("add-scan-fileupload").click();    	
    }
    
    if (target.matches("#png-convert")) {
        const sourceCanvas = document.querySelector("#source-image-canvas");
        const targetCanvas = document.querySelector("#target-image-canvas");
        const targetCanvasCtx = targetCanvas.getContext('2d');

        var image = new Image();
        image.onload = () => {
            targetCanvasCtx.drawImage(image, 0, 0, image.width, image.height, 0, 0, 500, 900);
        };        
        const imageAsDataURL = sourceCanvas.toDataURL("image/png", 1);

        const head = "data:image/png;base64,";
        const imgFileSize = Math.round((imageAsDataURL.length - head.length) * 3 / 4) ;
        document.querySelector("#target-image-size").textContent = `Mărime imagine ${formatSize(imgFileSize)} MB`;
        image.src = imageAsDataURL;
    }

    if (target.matches("#webp-convert")) {
        const sourceCanvas = document.querySelector("#source-image-canvas");
        const targetCanvas = document.querySelector("#target-image-canvas");
        const targetCanvasCtx = targetCanvas.getContext('2d');

        var image = new Image();
        image.onload = () => {
            targetCanvasCtx.drawImage(image, 0, 0, image.width, image.height, 0, 0, 500, 900);
        };   
        const imageAsDataURL = sourceCanvas.toDataURL("image/webp", 1);

        const head = "data:image/webp;base64,";
        const imgFileSize = Math.round((imageAsDataURL.length - head.length) * 3 / 4) ;
        document.querySelector("#target-image-size").textContent = `Mărime imagine ${formatSize(imgFileSize)} MB`;
        image.src = imageAsDataURL;
    }  
    
    if (target.matches("#save-converted-image")) {
        const sourceCanvas = document.querySelector("#source-image-canvas");
        const convertedImageAsDataURL = sourceCanvas.toDataURL("image/webp", 1);

        console.log(convertedImageAsDataURL);
    }
}, false);

document.addEventListener("change", async (event) => {
    const target = event.target;
    
    if (target.matches("#add-scan-fileupload")) {
        const sourceCanvas = document.querySelector("#source-image-canvas");
        const sourceCanvasCtx = sourceCanvas.getContext('2d');

        const file = target.files[0];
        var reader = new FileReader();

        if (file.type === "application/pdf") {
            reader.onload = (event) => {
                var typedarray = new Uint8Array(reader.result);
                const loadingTask = pdfjsLib.getDocument(typedarray);
                loadingTask.promise.then((pdf) => {
                    pdf.getPage(1).then(function(page) {
                        page.getTextContent().then((textContent) => {
                            textContent = textContent.items.map(function (s) { return s.str; }).join('');
                            console.log(textContent);
                        });

                        var scale = 1;
                        var viewport = page.getViewport({scale: scale,});
                        
                        //canvas.height = viewport.height;
                        //canvas.width = viewport.width;
                        
                        var renderContext = {
                          canvasContext: sourceCanvasCtx,
                          viewport: viewport
                        };
                        page.render(renderContext);
                      })
                });
            };
            reader.readAsArrayBuffer(file);
        } else {
            reader.onload = (event) => {
                var image = new Image();
                image.onload = () => {
                    sourceCanvasCtx.drawImage(image, 0, 0, image.width, image.height, 0, 0, 500, 900);
                };
                image.src = event.target.result;
            }
            reader.readAsDataURL(file);    
        }

        document.querySelector("#source-image-size").textContent = `Mărime imagine ${formatSize(file.size)} MB`;
    } 
}, false);

const formatSize = (size) => {
    return (size / (1024*1024)).toFixed(3);
};

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.js';
