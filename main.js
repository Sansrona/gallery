const currentYear = document.querySelector('.current_year')
currentYear.innerHTML = new Date().getFullYear() + ' год';

const deleteList = document.getElementById('delete__list');
const deleteListItem = document.getElementsByClassName('delete__list-item');
const deleteBtn = document.getElementById('delete__here');
let newImage;
const uploadImageBtn = document.getElementById('upload_image');
const uploadImageText = document.getElementById('new_image-text');
const popup = document.getElementById('popup');
const closePopup = document.getElementById('close__popup');
let mainView = document.getElementById("mainView");
let imgObject = [
    { src: "./images/img-1.png", alt: 'Лиса' },
    { src: "./images/img-2.png", alt: 'Анаконда' },
    { src: "./images/img-3.png", alt: 'Собака' },
    { src: "./images/img-4.png", alt: 'Дельфин' },
    { src: "./images/img-5.png", alt: 'Еж' },
];
let mainImg = 0;
let prevImg = imgObject.length - 1;
let nextImg = 1;



function loadGallery() {
    mainView.style.backgroundImage = "url(" + imgObject[mainImg].src + ")";
    mainView.style.backgroundPosition = "center center";
    mainView.style.backgroundRepeat = "no-repeat";
    mainView.style.backgroundSize = "contain";

};

function scrollRight() {
    prevImg = mainImg;
    mainImg = nextImg;
    if (nextImg >= (imgObject.length - 1)) {
        nextImg = 0;
    } else {
        nextImg++;
    };
    loadGallery();
};

function scrollLeft() {
    nextImg = mainImg
    mainImg = prevImg;

    if (prevImg === 0) {
        prevImg = imgObject.length - 1;
    } else {
        prevImg--;
    };
    loadGallery();
};

function deleteImageFromGalleryList() {
    imgObject.map(img => {
        const li = document.createElement('li');
        const image = document.createElement('img');
        const textnode = document.createTextNode(img.alt);
        image.src = img.src;
        image.alt = img.alt;
        image.style.width = 40 + 'px';
        image.style.marginRight = 20 + 'px';
        li.setAttribute('class', 'delete__list-item')
        li.setAttribute('draggable', 'true');
        deleteList.appendChild(li).appendChild(image);
        li.appendChild(textnode);
    });


}

function dragOver(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'copy';
    ev.target.parentNode.classList.add('dragover');
}

function dragLeave(ev) {
    ev.preventDefault();
    ev.target.parentNode.classList.remove('dragover');
}

function dragStart(ev) {
    ev.dataTransfer.effectAllowed = "copy";
    ev.dataTransfer.dropEffect = "copy";
    ev.target.setAttribute("id", "dragged");
    ev.dataTransfer.setData("Text", this.id);
}

function dropped(ev) {
    ev.preventDefault();
    ev.target.classList.remove('dragover');
    const image = document.getElementById(ev.dataTransfer.getData("Text"));
    image.parentNode.removeChild(image);
    if (!deleteList.children.length) {
        deleteList.style.fontSize = '90px';
        deleteList.innerText = "Пусто";
    }
    const i = imgObject.map(img => img.alt).indexOf(image.innerText);
    imgObject.splice(i, 1);
    if (!imgObject.length) {
        mainView.style.background = "none"
        mainView.innerText = "Пусто"
        mainView.style.fontSize = "50px";
        mainView.style.display = "contents";
        document.getElementById("navRight").removeEventListener("click", scrollRight);
        document.getElementById("navLeft").removeEventListener("click", scrollLeft);

    };
    loadGallery();
}


function deleteImage() {
    for (let item of deleteList.children) {
        item.addEventListener("dragstart", dragStart)
    }
}

function addImage(input) {
    let file = input.files[0];
    if(file.type.split('/')[1] !== 'png' && file.type.split('/')[1] !== 'webp'){
        popup.style.display='block';
        file = null;
        newImage = null;
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        newImage = reader.result;
    }
    document.getElementById('label-name').innerText = file.name;
}

function addImageToGallery() {
    if(!newImage) return;
    if(!uploadImageText.value) {
        uploadImageText.style.borderColor='red'
        return ;
    };
    uploadImageText.style.borderColor='black`'
    imgObject.push({ src: newImage, alt: uploadImageText.value });
    const li = document.createElement('li');
    const image = document.createElement('img');
    const textnode = document.createTextNode(uploadImageText.value);
    image.src = newImage;
    image.alt = uploadImageText.value;
    image.style.width = '40px';
    image.style.marginRight = '20px';
    li.setAttribute('class', 'delete__list-item')
    li.setAttribute('draggable', 'true');
    deleteList.appendChild(li).appendChild(image);
    li.appendChild(textnode);
    li.addEventListener("dragstart", dragStart);
    document.getElementById('label-name').innerText = 'Выберите файл'
    uploadImageText.value = '';
}

function closePopupFunc(){
    popup.style.display="none"
}

document.getElementById("navRight").addEventListener("click", scrollRight);
document.getElementById("navLeft").addEventListener("click", scrollLeft);
document.addEventListener('keyup', function (e) {
    if (e.key === 'ArrowLeft') {
        scrollLeft();
    } else if (e.key === 'ArrowRight') {
        scrollRight();
    }
});

console.log(newImage);
deleteBtn.addEventListener("dragover", dragOver);
deleteBtn.addEventListener("dragleave", dragLeave);
deleteBtn.addEventListener("drop", dropped);
uploadImageBtn.addEventListener("click", addImageToGallery);
closePopup.addEventListener("click",closePopupFunc)
document.addEventListener('click', (e)=>{
    if(e.target.closest('.popup-content')===null){
        closePopupFunc();
    }
})

loadGallery();
deleteImageFromGalleryList();
deleteImage();











