document.addEventListener("deviceready",onDeviceReady,false); 
function startCameraBelow(){
    var h = screen.height-125;
    CameraPreview.startCamera({x: 0, y: 0, width: screen.width, height: h, camera: "back", tapPhoto: true, previewDrag: false, toBack: true});
}

function stopCamera(){
    CameraPreview.stopCamera();
}

function takePicture(){
    CameraPreview.takePicture({quality:100},function(imgData){
      CameraPreview.stopCamera(); // STOP CAMARA 
       var params = {data: 'data:image/jpeg;base64,' + imgData, prefix: 'myPrefix_', format: 'JPG', quality: 50, mediaScanner: true}; 
       window.imageSaver.saveBase64Image(params,
          function (filePath) {
            plugins.crop(function success (img_cropper) {
               document.getElementById('originalPicture').src = img_cropper;
            }, function fail () {
               console.log("Error cropping");
            }, filePath, {quality: 100});

               console.log('File saved on ' + filePath);
            },
          function (msg) {
            console.error(msg);
          }
       );

      
    });
}

function changeColorEffect(){
    var effect = document.getElementById('selectColorEffect').value;
    CameraPreview.setColorEffect(effect);
}

function changeFlashMode(){
    var mode = document.getElementById('selectFlashMode').value;
    CameraPreview.setFlashMode(mode);
}

function changeZoom(){
    var zoom = document.getElementById('zoomSlider').value;
    document.getElementById('zoomValue').innerHTML = zoom;
    CameraPreview.setZoom(zoom);
}

function getFileContentAsBase64(path,callback){
      window.resolveLocalFileSystemURL(path, gotFile, fail);
            
      function fail(e) {
          alert('Cannot found requested file');
      }

      function gotFile(fileEntry) {
           fileEntry.file(function(file) {
              var reader = new FileReader();
              reader.onloadend = function(e) {
                   var content = this.result;
                   callback(content);
              };
              // The most important point, use the readAsDatURL Method from the file plugin
              reader.readAsDataURL(file);
           });
      }
}

function sendPicture(){
    var filePath = document.getElementById('originalPicture').src;
    alert(filePath);
    getFileContentAsBase64(filePath,function(imgBase64){
          uploadImage(imgBase64);
    });
}


function uploadImage(imageURI) {
    //alert("inside upload");
    var idexpense = window.localStorage.getItem('expenseId');
    var expenseIdFromUpload = window.localStorage.getItem('expenseIdFromUpload');
    var verification_num = window.localStorage.getItem('verification_number');

    var customerData = window.localStorage.getItem('CustomerID');
    var CustomerID = JSON.parse(customerData);
    //alert("inside file transfer");
    fileTransfer = new FileTransfer();
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1) + '.jpeg';
    options.mimeType = "image/jpeg";
    options.params = {};
    options.chunkedMode = false;
    options.headers = {'Accept': 'application/json'};
    // alert(idexpense+"-"+expenseIdFromUpload)  ;
    if (idexpense == null) {

        if (expenseIdFromUpload) {
            // alert(8);
            fileTransfer.upload(imageURI, encodeURI("http://webatlante.webatlante.com/webatlanteHYBRIDTEST/upload.php?CustomerID=" + CustomerID + "&id_expense=" + expenseIdFromUpload + "&token=" + token), onWinImageUpload, onFailWImageUpload, options);
            //alert("other photo at create exp"+expenseIdFromUpload);

        } else {
            fileTransfer.upload(imageURI, encodeURI("http://webatlante.webatlante.com/webatlanteHYBRIDTEST/upload.php?CustomerID=" + CustomerID + "&token=" + token), onWinImageUpload, onFailWImageUpload, options);
            //alert("first photo create exp" + CustomerID);
        }

    } else if (idexpense != null && expenseIdFromUpload == null) {

        fileTransfer.upload(imageURI, encodeURI("http://webatlante.webatlante.com/webatlanteHYBRIDTEST/upload.php?CustomerID=" + CustomerID + "&id_expense=" + idexpense + "&token=" + token), onWinImageUpload, onFailWImageUpload, options);
        //alert("first foto upload update"+expenseIdFromUpload);

    }
    else if (idexpense != null && expenseIdFromUpload != null) {

        fileTransfer.upload(imageURI, encodeURI("http://webatlante.webatlante.com/webatlanteHYBRIDTEST/upload.php?CustomerID=" + CustomerID + "&id_expense=" + expenseIdFromUpload + "&token=" + token), onWinImageUpload, onFailWImageUpload, options);
    }
    /* else if(verification_num == "1" && idexpense_travel == null){

     }*/
}
