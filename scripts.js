import data from './data.json' assert { type: 'json' };
import filenames from './img/filenames.json' assert { type: 'json' };

var url_string = window.location;
var url = new URL(url_string);
var urlName = url.searchParams.get("optionSong");

const mainURL = url.origin + url.pathname;

let optionsNumber = 3;

let totalSongs = data.musicData.length;

var loadSongsFlag = false;
var scanQRFlag = true;

var allData = [{
    currentMusic : urlName ? urlName : 0,
    totalFinded : 0,
    incorrectAnswer: 0,
    foundedMusic : []
}];

var allTime = [{
    timer : 0,
    errorFlag : false
}];

const timerBox = document.getElementById("timerBox");
const timerTxt = document.getElementById("timer");

const magicTextCont = document.getElementById("magicTextCont");
const magicTextCont2 = document.getElementById("magicTextCont2");
const magicEndText = document.getElementById("magicEndText");
const cuteCats = document.getElementById("cuteCats");

const singleMagicText = document.getElementById("singleMagicText");
const singleMagicText2 = document.getElementById("singleMagicText2");

const totalSongsNumber = document.getElementById("totalSongsNumber");

var months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

var flag = true;

if (localStorage.getItem("musicStatus") == null) 
{
    localStorage.setItem("musicStatus", JSON.stringify(allData));
}
else
{
    allData = JSON.parse(localStorage.getItem("musicStatus"));

    if (urlName != null) {
        allData[0].currentMusic = urlName;
        localStorage.setItem("musicStatus", JSON.stringify(allData));
    }else if(urlName == null || parseInt(urlName) > totalSongs)
    {
        allData[0].currentMusic = 0;
        localStorage.setItem("musicStatus", JSON.stringify(allData)); 
    }
}


if (localStorage.getItem("timer") == null) {
    localStorage.setItem("timer", JSON.stringify(allTime));
}
else
{
    allTime = JSON.parse(localStorage.getItem("timer"));
}

var formQuestion = document.querySelector("#formQuestion");
var formOptions = document.querySelector("#formOptions");
var currentMusic = document.querySelector("#currentMusic");
var submitBtn = document.querySelector("#submitBtn");
var hrMain = document.querySelectorAll(".hrMain");

var progressBar = document.getElementById("progressBar");

function randomGenerator(quantity, min, max){
    const arr = []
    while(arr.length < quantity){
      var candidateInt = Math.floor(Math.random() * (max - min + 1) + min)
      if(arr.indexOf(candidateInt) === -1) arr.push(candidateInt)
    }
  return(arr)
}

function randomSongGenerator(quantity, min, max){
    const arr = []
    while(arr.length < quantity){
      var candidateInt = Math.floor(Math.random() * (max - min + 1) + min)
      if(arr.indexOf(candidateInt) === -1 && candidateInt != allData[0].currentMusic) arr.push(candidateInt)
    }
  return(arr)
}

function loadQuestion()
{
    currentMusic.innerHTML = `
        <audio src="./audio/${allData[0].currentMusic}.mp3" controls></audio>
    `;

    formOptions.innerHTML = "";

    var correctSong = data.musicData.find(e => e.number == (String)(allData[0].currentMusic));
    var findMusic = {};

    var randomArrayNumbers = randomGenerator(3, 0, 2);
    var randomSongNumbers = randomSongGenerator(2, 1, 17);

    var optionsArray = [
        `
        <div class="form-check my-2 p-0">
            <input type="radio" class="btn-check" name="optionSong" id="option${0}" autocomplete="off" value="${correctSong.number}">
            <label class="btn btn-outline-success w-100" for="option${0}">${correctSong.name} - ${correctSong.autor}</label>
        </div>
        `
    ];


    for (let i = 0; i < optionsNumber - 1; i++) {

        findMusic = data.musicData.find(e => e.number == (String)(randomSongNumbers[i]));

        optionsArray.push(`
            <div class="form-check my-2 p-0">
                <input type="radio" class="btn-check" name="optionSong" id="option${i + 1}" autocomplete="off" value="${findMusic.number}">
                <label class="btn btn-outline-success w-100" for="option${i + 1}">${findMusic.name} - ${findMusic.autor}</label>
            </div>
        `);
    }

    for (let i = 0; i < optionsNumber; i++) {
        formOptions.innerHTML += optionsArray[randomArrayNumbers[i]];
    }

    progressDataFunction();

}

function progressDataFunction()
{
    var progressData = parseInt((allData[0].totalFinded / totalSongs) * 100);

    progressBar.style.width = `${progressData}%`;
    progressBar.innerHTML = `${progressData}%`;

    if (progressData >= 100) {
        progressBar.classList.add("bg-success");
        progressBar.classList.remove("bg-danger");
        magicTextCont.classList.remove("d-none");
    }

}

var songsForm = document.getElementById("songsForm");

async function sendForm(event)
{
    event.preventDefault();

    var formData = new FormData(songsForm);
    var name = formData.get('optionSong');

    var findOldSong = allData[0].foundedMusic.find(e => e.number == allData[0].currentMusic);

    if (name == allData[0].currentMusic && allData[0].totalFinded < totalSongs && findOldSong == undefined) {

        var correctSong = data.musicData.find(e => e.number == (String)(allData[0].currentMusic));

        notie.alert({ type: 1, text: 'Correcto!', time: 1});
        allData[0].currentMusic = 0;
        allData[0].totalFinded++;
        allData[0].foundedMusic.push({number : correctSong.number, img: correctSong.img, name : correctSong.name, autor : correctSong.autor});
        localStorage.setItem("musicStatus", JSON.stringify(allData));
        progressDataFunction();
        loadFoundedSongs();

        var allRadioInputs = document.getElementsByClassName("btn-check");
        var submitBtn = document.querySelector("#submitBtn");

        submitBtn.setAttribute("disabled", "true");

        for (let i = 0; i < allRadioInputs.length; i++) {
            allRadioInputs[i].setAttribute("disabled", "true");            
        }

        setTimeout(() => {
            location.href = mainURL + "?optionSong=0";
        }, 1500);
    }
    else if(name != allData[0].currentMusic)
    {
        initTimerByError();
        notie.alert({ type: 3, text: '<i class="fas fa-times"></i> Respuesta Incorrecta!', time: 1});
        allData[0].incorrectAnswer++;
        localStorage.setItem("musicStatus", JSON.stringify(allData));
    }
    else if(allData[0].totalFinded >= totalSongs)
    {
        initTimerByError();
        notie.alert({ type: 3, text: '<i class="fas fa-times"></i> Inválido!', time: 1});
        allData[0].incorrectAnswer++;
        localStorage.setItem("musicStatus", JSON.stringify(allData));
    }
    else if(findOldSong != undefined)
    {
        initTimerByError();
        notie.alert({ type: 3, text: `"${findOldSong.name} - ${findOldSong.autor}" ya ha sido respondida!`, time: 2});
        allData[0].incorrectAnswer++;
        localStorage.setItem("musicStatus", JSON.stringify(allData));
    }
}

songsForm.addEventListener("submit", sendForm);

var songList = document.querySelector("#songList");

function loadFoundedSongs()
{
    songList.innerHTML = "";

    var findOldSong = allData[0].foundedMusic;

    for (let j = 0; j < findOldSong.length; j++) {
        songList.innerHTML += `
        <tr>
            <td><div class="d-flex justify-content-center align-items-center" style="width:50px; height:50px; overflow:hidden; border-radius:100%"><img class="h-100" src="${findOldSong[j].img}"/></div></td>
            <td><span class="acrosticTxt">${findOldSong[j].name[0]}</span>${(String)(findOldSong[j].name).slice(1)}</td>
            <td>${findOldSong[j].autor}</td>
        </tr>`;
    };

    totalSongsNumber.innerHTML = `<strong>${findOldSong.length}/${totalSongs}</strong> Canción(es) Encontrada(s)`;

}

function loadNewFoundedSongs()
{
    songList.innerHTML = "";

    var findOldSong = allData[0].foundedMusic;
    var allFoundedMusic = [];

    for (let i = 0; i < totalSongs; i++) {
        allFoundedMusic.push(`
            <tr>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        `);
    }

    for (let j = 0; j < findOldSong.length; j++) {
        allFoundedMusic[findOldSong[j].number - 1] = `
        <tr>
            <td><div class="d-flex justify-content-center align-items-center" style="width:50px; height:50px; overflow:hidden; border-radius:100%"><img class="h-100" src="${findOldSong[j].img}"/></div></td>
            <td><span class="acrosticTxt">${findOldSong[j].name[0]}</span>${(String)(findOldSong[j].name).slice(1)}</td>
            <td>${findOldSong[j].autor}</td>
        </tr>`;
    }

    for (let i = 0; i < allFoundedMusic.length; i++) {
        songList.innerHTML += allFoundedMusic[i];
    }

}

function timerFunction()
{
    var seconds = "";
    var minutes = "";

    var allRadioInputs = document.getElementsByClassName("btn-check");
    var submitBtn = document.querySelector("#submitBtn");

    if (allTime[0].timer > 0) {

        allTime[0].timer--;

        minutes = parseInt(allTime[0].timer / 60);
        
        if (minutes >= 10) {
            minutes = parseInt(allTime[0].timer / 60);
        }else
        {
            minutes = `0${parseInt(allTime[0].timer / 60)}`;
        }

        seconds = allTime[0].timer%60;

        if (seconds >= 10) {
            seconds = allTime[0].timer%60;
        }else
        {
            seconds = `0${allTime[0].timer%60}`;
        }

        timerTxt.innerHTML = `<i class="fa fa-clock"></i> ${minutes}:${seconds}`;

        localStorage.setItem("timer", JSON.stringify(allTime));

        submitBtn.setAttribute("disabled", "true");

        for (let i = 0; i < allRadioInputs.length; i++) {
            allRadioInputs[i].setAttribute("disabled", "true");            
        }

        timerBox.classList.remove("d-none");
        timerBox.classList.remove("animate__bounceOutUp");
        timerBox.classList.add("animate__bounceInDown");

    }else{

        submitBtn.removeAttribute("disabled");

        for (let i = 0; i < allRadioInputs.length; i++) {
            allRadioInputs[i].removeAttribute("disabled");            
        }

        timerBox.classList.remove("animate__bounceInDown");
        timerBox.classList.add("animate__bounceOutUp");
        // timerBox.classList.add("d-none");

        allTime[0].errorFlag = false;
        localStorage.setItem("timer", JSON.stringify(allTime));
    }
}

function setIntervalTimer()
{
    setInterval(() => {
        if (allTime[0].errorFlag == true) {
            timerFunction();
        }
    }, 1000);
}

function initTimerByError()
{
    allTime[0].timer = 10;
    if (allData[0].incorrectAnswer > 0) {
        timerBox.classList.remove("d-none");
        timerBox.classList.remove("animate__bounceOutUp");
        timerBox.classList.add("animate__bounceInDown");
        allTime[0].timer += 10 * (allData[0].incorrectAnswer * 0.5);
        allTime[0].errorFlag = true;
        localStorage.setItem("timer", JSON.stringify(allTime));
    }
}

function writeMagicEndText()
{
    scrollToBottom();

    singleMagicText.innerHTML = `
        <p class="display-6 animate__animated animate__fadeInDown" style="animation-delay: 1.5s">La magia ocurre con tan solo una mirada...</p>
        <p class="display-6 animate__animated animate__fadeInDown" style="animation-delay: 3s">Recapitulemos un poco...</p>
        <p class="display-6 animate__animated animate__fadeInDown" style="animation-delay: 4.5s">Vamos a mirar nuestra historia...</p>
        <div id="showImage" class="animate__animated animate__fadeInDown d-flex justify-content-center flex-row flex-wrap p-4" style="animation-delay: 5s">
            <div class="spinner-border text-purple" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;

    setTimeout(function(){
        showImages();
    }, 6000);

    setTimeout(function(){
        magicTextCont2.classList.remove("d-none");
    }, 7000);

    // setTimeout(function(){
    //     window.addEventListener("scroll", myScrollFunc);
    // }, 7000);
}

function writeMagicEndText2()
{
    loadSongsFlag = true;

    checkLoadSongs();

    scrollToBottom2();

    var acrosticTxt = document.getElementsByClassName("acrosticTxt");

    for (let i = 0; i < acrosticTxt.length; i++) {
        acrosticTxt[i].classList.add("boldTxt");
    }

    var findOldSong = allData[0].foundedMusic.find(e => e.number == "1");

    singleMagicText2.innerHTML = `
        <p class="display-6 animate__animated animate__fadeInDown" style="animation-delay: 1.5s">¿Cuál fue la primera canción que me cantaste?...</p>
        <p class="display-6 animate__animated animate__fadeInDown" style="animation-delay: 3s">¿No recuerdas?...</p>
        <p class="display-6 animate__animated animate__fadeInDown" style="animation-delay: 4.5s">Refresquemos tu memoria...</p>
        <div class="container my-3 mx-auto p-3 animate__animated animate__fadeInDown" style="animation-delay: 6s; width: max-content; border-radius: 25px; background-color: #ffd6ea;">
            <table class="table table-striped m-0">
                <tbody>
                    <tr>
                        <td class="text-center mx-2"><div class="d-flex justify-content-center align-items-center" style="width:50px; height:50px; overflow:hidden; border-radius:100%"><img class="h-100" src="${findOldSong.img}"/></div></td>
                        <td class="text-center mx-2"><span class="acrosticTxt">${findOldSong.name[0]}</span>${(String)(findOldSong.name).slice(1)}</td>
                        <td class="text-center mx-2">${findOldSong.autor}</td>
                    </tr>
                </tbody>
            </table>
            <audio id="lastSong" class="my-3" src="./audio/${findOldSong.number}.mp3" controls></audio>
        </div>
        <p class="display-6 animate__animated animate__fadeInDown" style="animation-delay: 7.5s">Así como esta es la primera canción que me cantaste...</p>
        <p class="display-6 animate__animated animate__fadeInDown" style="animation-delay: 9s">También es la primera pista de lo que va a pasar...</p>
        <p class="display-6 animate__animated animate__fadeInDown" style="animation-delay: 10.5s">Encontrar todas estas canciones tenía un significado...</p>
        <p class="display-6 animate__animated animate__fadeInDown" style="animation-delay: 12s">Cada inicial esconde su magia...</p>
        <p class="display-6 animate__animated animate__fadeInDown" style="animation-delay: 13.5s">¿Estás preparada?...</p>
        <p class="display-6 animate__animated animate__fadeInDown" style="animation-delay: 15s">La magia está en leer todo para abajo...</p>
        <p class="display-6 animate__animated animate__fadeInDown" style="animation-delay: 16.5s">Pero tranquila...</p>
        <p class="display-6 animate__animated animate__fadeInDown" style="animation-delay: 18s">Lo haré por ti, y en orden...</p>
    `;

    setTimeout(function(){
        document.getElementById("lastSong").play();
    }, 6000);

    magicEndText.innerHTML = `
        <p class="my-5 display-6 animate__animated animate__bounceIn" style="animation-delay: 19.5s;"><span class="firstMagicLetter mx-1 p-2">¿</span></p>
    `;

    for (let i = 0; i < data.musicData.length; i++) {

        if (i == 7 || i == 10 || i == 12) {
        magicEndText.innerHTML += `
            <br>
        `;
        }

        magicEndText.innerHTML += `
            <p class="my-5 display-6 animate__animated animate__bounceIn" style="animation-delay: ${19.5 + (i / 5)}s;"><span class="firstMagicLetter mx-1 p-2">${data.musicData[i].name[0]}</span>${String(data.musicData[i].name).slice(1)}</p>
        `;
    }

    magicEndText.innerHTML += `
        <p class="my-5 display-6 animate__animated animate__bounceIn" style="animation-delay: 21s;"><span class="firstMagicLetter mx-1 p-2">?</span></p>
    `;

    cuteCats.innerHTML = `
        <img src="./img/cute-cat.gif" class="animate__animated animate__bounceIn" style="animation-delay: 22.5s;width: 18rem;">
    `;
}

var galleryImgAll = [];

function showImages()
{

    const showImage = document.getElementById("showImage");

    showImage.innerHTML = "";

    for (let i = 0; i < filenames.children.length; i++) {
        showImage.innerHTML += `

            <div class="container my-3 mx-auto p-3 animate__animated animate__bounceIn" style="width: fit-content; border-radius: 25px; background-color: #ffd6ea;">
                <div class="overflow-hidden d-flex mx-auto justify-content-center align-items-center" style="border-radius: 25px; width:18rem; height: 18rem;">
                    <img src="./img/Gallery/${filenames.children[i].name}" class="img-fluid galleryImg" data-bs-toggle="modal" data-bs-target="#galleryModal" modalAttr="${filenames.children[i].name}">
                </div>
                <div class="d-flex justify-content-center align-items-center">
                    <span class="badge bg-info mt-3">${String(filenames.children[i].name).split("-")[1].slice(6,8)}/${months[parseInt(String(filenames.children[i].name).split("-")[1].slice(4,6)) - 1]}/${String(filenames.children[i].name).split("-")[1].slice(0,4)}</span>
                </div>
                <div class="d-flex justify-content-center align-items-center">
                    <span class="badge bg-success mt-3 text-capitalize">${String(filenames.children[i].name).split("&")[1] ? String(filenames.children[i].name).split("&")[1].split(".")[0] : ""}</span>
                </div>
            </div>

        `;
    }

    galleryImgAll = document.querySelectorAll(".galleryImg");

    for (let i = 0; i < galleryImgAll.length; i++) {
        galleryImgAll[i].addEventListener("click", function(){
            var elementName = galleryImgAll[i].getAttribute("modalAttr");
            document.getElementById("modalImgCont").innerHTML = `
                <img class="w-100" src="./img/Gallery/${elementName}"/>
            `;
        });
    }

}

function checkLoadSongs()
{
    if (loadSongsFlag == false) {
        loadFoundedSongs();
    }else{
        loadNewFoundedSongs();
    }
}

function scrollToBottom(){
    $("html, body").animate({scrollTop: $("#singleMagicText").offset().top}, 1000, "swing");
}

function scrollToBottom2(){
    $("html, body").animate({scrollTop: $("#singleMagicText2").offset().top}, 1000, "swing");
}

document.getElementById("magicTextButton").addEventListener("click", e => {
    document.getElementById("magicTextButton").setAttribute("disabled", "true");
    writeMagicEndText();
});

document.getElementById("magicTextButton2").addEventListener("click", e => {
    document.getElementById("magicTextButton2").setAttribute("disabled", "true");
    writeMagicEndText2();
});

window.addEventListener("load", e => {
    if (urlName != null && urlName <= totalSongs && urlName != 0) {
        loadQuestion();
    }else{
        formQuestion.innerHTML = "<i class='fa fa-spinner'></i> Revisa tu Progreso...";
        submitBtn.classList.add("d-none");
        for (let i = 0; i < hrMain.length; i++) {
            hrMain[i].classList.add("d-none");
        }
    }

    $('#html5-qrcode-button-camera-permission').html(`<i class="fa fa-camera"></i> Activar Cámara`);

    checkLoadSongs();
    progressDataFunction();
    timerFunction();
    setIntervalTimer();
    // showImages();
    // writeMagicEndText();
});

// var myScrollFunc = function() {
//     var y = window.scrollY;
//     if (y >= document.getElementById("showImage").offsetHeight + screen.height - 100 && flag) {
//         writeMagicEndText2();
//         console.log("Scroll");
//         flag = false;
//     }
// };

var resetDataInput = document.getElementById("resetDataInput");
var importDataBtn = document.getElementById("importDataBtn");
var resetDataBtn = document.getElementById("resetDataBtn");
var eraseFieldBtn = document.getElementById("eraseFieldBtn");

resetDataInput.addEventListener("keyup", () => {

    if(resetDataInput.value != ""){
        eraseFieldBtn.classList.remove("d-none");
    }else{
        eraseFieldBtn.classList.add("d-none");
    }

    if(resetDataInput.value == "4596"){
        resetDataBtn.removeAttribute("disabled");
        importDataBtn.removeAttribute("disabled");
    }else{
        resetDataBtn.setAttribute("disabled", "true");
        importDataBtn.setAttribute("disabled", "true");
    }
});

resetDataBtn.addEventListener("click", () => {
    Swal.fire({
        title: '¿Estás Seguro(a)?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Sí, Eliminar Datos!'
      }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            location.href = mainURL + "?optionSong=0";
        }
    })
});

importDataBtn.addEventListener("click", () => {
    fetch("./LOVE_DATA_TEMPLATE.txt").then(function(response) {
        return response
    }).then(function(data) {
        return data.text()
    }).then(function(Normal) {
    
        localStorage.setItem("musicStatus", String(Normal));

        Swal.fire({
            icon: 'success',
            title: 'Datos Importados Correctamente',
            showConfirmButton: false,
            timer: 1000
        }).then(() => {
            location.reload();
        });
    
    }).catch(function(err) {
        console.log('Fetch problem show: ' + err.message);
    });
});

// --------------------QR-------------------------------

const isValidUrl = urlString =>{
    var inputElement = document.createElement('input');
    inputElement.type = 'url';
    inputElement.value = urlString;

    if (!inputElement.checkValidity()) {
        return false;
    } else {
        return true;
    }
} 

var html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", { fps: 10, qrbox: 250, rememberLastUsedCamera: false, 
        videoConstraints: {
            facingMode: "environment"
        }
    }
);

function onScanSuccess(qrCodeMessage) {
    if (isValidUrl(qrCodeMessage)) {
      if (scanQRFlag) {
        location.href = qrCodeMessage;
        scanQRFlag = false;
      }
    }else
    {
        // notie.alert({ type: 3, text: '<i class="fas fa-qrcode"></i> Alerta!, Hay una novedad con tu QR', time: 2});

        var qrArray = qrCodeMessage.split(" ");

        var findQr = qrArray.find(e => e == "bolos");

        if (findQr == undefined || findQr == null) {
            document.getElementById('result').innerHTML = `
            <div class="alert alert-danger text-center w-100" role="alert">
                <h2><i class="fa fa-qrcode"></i> El código QR es Inválido!</h2><br>
                <p><b>Resultado:</b> ${qrCodeMessage}</p>
            </div>`;
        }else{
            document.getElementById('result').innerHTML = `
            <div class="alert alert-info text-center w-100" role="alert">
                <i class="fa fa-bowling-ball mb-3" style="font-size:3em"></i><br>
                <p class="display-6">${qrCodeMessage}! UwU</p>
            </div>`;
        }
    }
 }
 
 function onScanError(errorMessage) {
     // document.getElementById('result').innerHTML = "Ha ocurrido un error inesperado con el código QR";
 }

html5QrcodeScanner.render(onScanSuccess, onScanError);

// // This method will trigger user permissions
// Html5Qrcode.getCameras().then(devices => {
//     if (devices && devices.length) {
//         var cameraId = devices;
//         console.log(cameraId);
//     }
// }).catch(err => {
// // handle err
// });

setInterval(() => {
    $('.html5-qrcode-element').addClass("btn");
    $('#html5-qrcode-button-camera-permission, #html5-qrcode-button-camera-start').addClass("btn-purple");
    $('#html5-qrcode-button-camera-stop').addClass("btn-danger");

    $('#html5-qrcode-button-camera-start').html(`<i class="fa fa-play"></i> Empezar Escaneo`);
    $('#html5-qrcode-button-camera-stop').html(`<i class="fa fa-stop"></i> Detener Escaneo`);
}, 60);


// -------------------------Top Button--------------------------------

var btn = $('#button');

$(window).scroll(() => {
  if ($(window).scrollTop() > 100) {
    btn.addClass('show');
  } else {
    btn.removeClass('show');
  }
});

btn.click((e) => {
  e.preventDefault();
  $("html, body").animate({scrollTop: 0}, 'fast', "swing");
});

// var str = "Debes jugar una buena partida de bolos para poder continuar";

// var strArray = str.split(" ");

// var findStr = strArray.find(e => e == "bolos");

// if (findStr == undefined || findStr == null) {
//     console.log("none");
// }else{
//     console.log(findStr);
// }