// ? Grab all the references to the DOM elements
const moodBoardEl = document.querySelector("#mood-board");
const addImageBtn = document.querySelector("#add-image");
const imageUrlInput = document.querySelector("#image-url");
const addTextBtn = document.querySelector("#add-text");
const textInput = document.querySelector("#text-input");
const clearBtn = document.querySelector("#clear-all");

// ? We need to keep track of the elements that are added to the mood board and their positions
let tempStorageObject = {
  images: [],
  text: [],
};

// ? We neet to keep track of the current element that is being dragged
let currentElement = null;

clearBtn.addEventListener("click", function () {
  localStorage.clear();
  location.reload();
});

function updateLocalStorage() {
  localStorage.setItem("moodBoardData", JSON.stringify(tempStorageObject));
}

// ? Function to load from local storage. This function will be called on page load.
function loadFromLocalStorage() {
  const storedData = JSON.parse(localStorage.getItem("moodBoardData"));
  if (storedData) {
    tempStorageObject = storedData;

    // Paint the stored images on mood board
    tempStorageObject.images.forEach((image) => {
      const img = document.createElement("img");
      img.src = image.url;
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

//  ? We create an event listener for the image URL input field. This will create an image element and attach it to the mood board with the URL provided by the user.
addImageBtn.addEventListener("click", function () {
  const imageUrl = imageUrlInput.value;
  if (imageUrl) {
    const img = document.createElement("img");
    img.setAttribute('data-id', Math.floor(Math.random()* 1000));
    img.src = imageUrl;
    img.classList.add("draggable");
    document.body.appendChild(img);
    
    // img.draggable = true;
    currentElement = img;

    // ? We attach the mouse move event listener to the document and the mood board div so that the element can be dragged anywhere on the screen and dropped only on the mood board div.
    attachMouseListeners();

  }
});

// ? We create an event listener for the text input field. This will create a div element and attach it to the mood board with the text provided by the user.
addTextBtn.addEventListener("click", function () {
  const text = textInput.value;
  if (text) {
    const textDiv = document.createElement("div");
    textDiv.classList.add("text-item", "draggable");
    textDiv.textContent = text;
    document.body.appendChild(textDiv);

    // ? We set the current element to the text div so that we can update the position of the element when the mouse is moved.
    currentElement = textDiv;

    // ? We attach the mouse move event listener to the document and the click listener to the mood board div so that the element can be dragged anywhere on the screen, but dropped only on the mood board div.
    attachMouseListeners();
  }
});

function attachMouseListeners() {
  document.addEventListener("mousemove", mouseMoveHandler);
  moodBoardEl.addEventListener("click", placeElementClickHandler);
}

// ? This is the event handler for the mouse move event. This will be called whenever the mouse is moved on the screen.
// ? We check if the current element is set. If it is set, we update the position of the element to the mouse position.
function mouseMoveHandler(e) {
  if (currentElement) {
    currentElement.style.left = `${e.clientX}px`;
    currentElement.style.top = `${e.clientY}px`;

    console.log(
      "left",
      currentElement.style.left,
      "top",
      currentElement.style.top
    );
  }
}
function dragHandler(e) {
  if (currentElement) {
    const moodBoardRect = moodBoardEl.getBoundingClientRect();
    currentElement.style.left = `${e.clientX - moodBoardRect.left}px`;
    currentElement.style.top = `${e.clientY - moodBoardRect.top}px`;
  }
}

// ? This is the event handler for the click event on the mood board. This will be called whenever the user clicks on the mood board.
// ? We check if the current element is set. If it is set, we attach the element to the mood board and reset the current element.
// ? When we click, we find the position of the mouse relative to the mood board and update the position of the element accordingly. to 'place' it on the mood board.
function placeElementClickHandler(event) {
  if (currentElement) {
    const moodBoardRect = moodBoardEl.getBoundingClientRect();

    const left = `${event.clientX - moodBoardRect.left}px`;
    const top = `${event.clientY - moodBoardRect.top}px`;

    // ? Set the position of the element based on the calculated position above.
    currentElement.style.left = left;
    currentElement.style.top = top;

    currentElement.classList.remove("draggable");

    // ? Append the element to the mood board with the already calculated position.
    moodBoardEl.appendChild(currentElement);

    if (currentElement.tagName === "IMG") {
      // ? Push the image object to the tempStorageObject images property/array
      tempStorageObject.images.push({
        url: currentElement.src,
        left: left,
        top: top,
      });
    } else {
      // ? Push the text object to the tempStorageObject text property/array
      tempStorageObject.text.push({
        text: currentElement.textContent,
        left: left,
        top: top,
      });
     
    }

    // Update local storage with the new tempStorageObject information
    updateLocalStorage();
    // currentElement.style.pointerEvents = "initial";
    // Reset current element
    currentElement = null;

    // Clear inputs
    imageUrlInput.value = "";
    textInput.value = "";

    // ? Remove event listeners for mouse move, so that the element is no longer draggable
    document.removeEventListener("mousemove", mouseMoveHandler);
    // document.location.reload();   Can you get rid of this????
  }
}
function addDragListeners(element) {

  element.style.pointerEvents = "initial";
  element.addEventListener("mousedown", function (event) {
    event.preventDefault();
    currentElement = element;

    document.addEventListener("mousemove", dragHandler);
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

    // update the local storage
    // which img is the one we are interacting with?
    // update its left and top.
    // update the local storage

    console.log(currentElement);

    currentElement = null;

    document.removeEventListener("mousemove", mouseMoveHandler);
  }
}
// ? Load existing data from local storage on page load
window.onload = loadFromLocalStorage;
