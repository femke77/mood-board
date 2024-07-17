const moodBoardEl = document.querySelector("#mood-board");
const addImageBtn = document.querySelector("#add-image");
const imageUrlInput = document.querySelector("#image-url");
const addTextBtn = document.querySelector("#add-text");
const textInput = document.querySelector("#text-input");
const clearBtn = document.querySelector("#clear-all");

let tempStorageObject = {
  images: [],
  text: [],
};

let currentElement = null;

clearBtn.addEventListener("click", function () {
  localStorage.clear();
  location.reload();
});

function updateLocalStorage() {
  localStorage.setItem("moodBoardData", JSON.stringify(tempStorageObject));
}

function loadFromLocalStorage() {
  const storedData = JSON.parse(localStorage.getItem("moodBoardData"));
  if (storedData) {
    tempStorageObject = storedData;

    tempStorageObject.images.forEach((image) => {
      const img = document.createElement("img");
      img.src = image.url;
      img.id = image.id;
      img.style.left = image.left;
      img.style.top = image.top;
      img.classList.add("draggable");
      moodBoardEl.appendChild(img);

      addDragListeners(img);
    });

    tempStorageObject.text.forEach((text) => {
      const textDiv = document.createElement("div");
      textDiv.textContent = text.text;
      textDiv.style.left = text.left;
      textDiv.style.top = text.top;
      textDiv.classList.add("text-item");
      moodBoardEl.appendChild(textDiv);

      addDragListeners(textDiv);
    });
  }
}

addImageBtn.addEventListener("click", function () {
  const imageUrl = imageUrlInput.value;
  if (imageUrl) {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.classList.add("draggable");
    document.body.appendChild(img);
    currentElement = img;
    img.setAttribute("id", Math.ceil(Math.random() * 1000));
    attachMouseListeners();
  }
});

addTextBtn.addEventListener("click", function () {
  const text = textInput.value;
  if (text) {
    const textDiv = document.createElement("div");
    textDiv.classList.add("text-item", "draggable");
    textDiv.textContent = text;
    document.body.appendChild(textDiv);
    currentElement = textDiv;

    attachMouseListeners();
  }
});

function attachMouseListeners() {
  document.addEventListener("mousemove", mouseMoveHandler);
  moodBoardEl.removeEventListener("click", replaceElementClickHandler);
  moodBoardEl.addEventListener("click", placeElementClickHandler);
}

function mouseMoveHandler(e) {
  if (currentElement) {
    currentElement.style.left = `${e.clientX}px`;
    currentElement.style.top = `${e.clientY}px`;
  }
}

function dragHandler(e) {
  if (currentElement) {
    const moodBoardRect = moodBoardEl.getBoundingClientRect();
    currentElement.style.left = `${e.clientX - moodBoardRect.left}px`;
    currentElement.style.top = `${e.clientY - moodBoardRect.top}px`;
  }
}

function placeElementClickHandler(event) {
  if (currentElement) {
    const moodBoardRect = moodBoardEl.getBoundingClientRect();

    const left = `${event.clientX - moodBoardRect.left}px`;
    const top = `${event.clientY - moodBoardRect.top}px`;

    currentElement.style.left = left;
    currentElement.style.top = top;

    currentElement.classList.remove("draggable");

    moodBoardEl.appendChild(currentElement);

    if (currentElement.tagName === "IMG") {
      tempStorageObject.images.push({
        id: currentElement.id,
        url: currentElement.src,
        left: left,
        top: top,
      });
    } else {
      tempStorageObject.text.push({
        text: currentElement.textContent,
        left: left,
        top: top,
      });
    }

    updateLocalStorage();

    // immediately allow dragging the element for replacement
    addDragListeners(currentElement);

    currentElement = null;

    imageUrlInput.value = "";
    textInput.value = "";

    document.removeEventListener("mousemove", mouseMoveHandler);
  }
}

function addDragListeners(element) {
  element.style.pointerEvents = "initial";
  element.addEventListener("mousedown", function (event) {
    event.preventDefault();
    currentElement = element;
    document.addEventListener("mousemove", dragHandler);
    moodBoardEl.removeEventListener("click", placeElementClickHandler);
    moodBoardEl.addEventListener("click", replaceElementClickHandler);
  });
}

function replaceElementClickHandler(e) {
  if (currentElement) {
    const moodBoardRect = moodBoardEl.getBoundingClientRect();
    const left = `${e.clientX - moodBoardRect.left}px`;
    const top = `${e.clientY - moodBoardRect.top}px`;
    currentElement.style.left = left;
    currentElement.style.top = top;
    currentElement.classList.remove("draggable");
    moodBoardEl.appendChild(currentElement);
    console.log("current element needing update", currentElement.id);
 ;
    // TODO: update the local storage
    tempStorageObject.images.map((image) => {  
    
      if (image.id === currentElement.id) {
        console.log("hit");
        image.left = left;
        image.top = top;
      }
      updateLocalStorage()
    });
    



    currentElement = null;

    document.removeEventListener("mousemove", mouseMoveHandler);
  }
}

window.onload = loadFromLocalStorage;
