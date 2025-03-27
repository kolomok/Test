const input = document.getElementById("textinput");
const button = document.getElementById("addbutton");
const container = document.getElementById("text");
let selectedLetter = [];
let dragLetter = "";
let selectedBox = "";
let startX = 0,
  startY = 0;
let dragElement = null;

//Додавання тексту в контейнер при натисканні на кнопку, розділення тексту на окремі букви
button.addEventListener("click", () => {
  const newText = document.createElement("li");
  newText.classList.add("draggabletext");
  newText.innerHTML = input.value
    .split("")
    .map((letter) => {
      return `<span class="draggable">${letter}</span>`;
    })
    .join("");
  container.appendChild(newText);
  input.value = "";
});

//Вибір елементів для переміщення
container.addEventListener("mousedown", (e) => {
  if (e.target.classList.contains("draggable")) {
    startDragging(e.target, e.clientX, e.clientY);
  } else if (e.target.classList.contains("draggabletext")) {
    startDragging(e.target, e.clientX, e.clientY);
  }
});

//Переміщення елементів
container.addEventListener("mousedown", (e) => {
  if (e.target.classList.contains("draggable")) {
    if (e.ctrlKey) {
      toggleSelection(e.target);
    } else {
      startDragging(e.target, e.clientX, e.clientY);
    }
  } else {
    startSelectingBox(e);
  }
});

//Переміщення елементів
container.addEventListener("mousemove", (e) => {
  if (dragLetter) {
    dragLetter.style.left = e.clientX + "px";
    dragLetter.style.top = e.clientY + "px";
  }
});

document.addEventListener("mousemove", (e) => {
  if (dragLetter) {
    moveLetter(e);
  }
  if (selectedBox) {
    updateSelectedBox(e);
  }
});

//Закінчення переміщення елементів при відпусканні кнопки миші або клавіші Ctrl при виборі елементів для переміщення
document.addEventListener("mouseup", () => {
  if (dragLetter) {
    dragLetter = "";
  }
  if (selectedBox) {
    finalizeSelectedBox();
  }
});
container.addEventListener("mouseup", (e) => {
  if (
    dragLetter &&
    e.target.classList.contains("draggable") &&
    e.target !== dragLetter
  ) {
    const targetLetter = e.target;

    // Swap positions of dragLetter and targetLetter
    const dragLetterParent = dragLetter.parentNode;
    const targetLetterParent = targetLetter.parentNode;

    if (dragLetterParent && targetLetterParent) {
      const dragLetterNextSibling =
        dragLetter.nextSibling === targetLetter
          ? dragLetter
          : dragLetter.nextSibling;
      const targetLetterNextSibling =
        targetLetter.nextSibling === dragLetter
          ? targetLetter
          : targetLetter.nextSibling;

      dragLetterParent.insertBefore(targetLetter, dragLetterNextSibling);
      targetLetterParent.insertBefore(dragLetter, targetLetterNextSibling);
    }
  }
  dragLetter = "";
});
//Вибір елементів для переміщення з використанням клавіші Ctrl
function toggleSelection(letter) {
  if (letter.classList.contains("selected")) {
    letter.classList.remove("selected");
    selectedLetter = selectedLetter.filter((l) => l !== letter);
  } else {
    letter.classList.add("selected");
    selectedLetter.push(letter);
  }
}

//Переміщення виділених елементів
function moveLetter(e) {
  dragLetter.style.left = e.clientX + "px";
  dragLetter.style.top = e.clientY + "px";
}

//Початок переміщення елементів
function startDragging(letter, x, y) {
  dragLetter = letter;
  dragLetter.style.position = "fixed";
  dragLetter.style.left = x + "px";
  dragLetter.style.top = y + "px";
  dragLetter.style.zIndex = 1000;
}

//Початок виділення елементів
function startSelectingBox(e) {
  selectedBox = document.createElement("div");
  selectedBox.classList.add("selection-box");
  document.body.appendChild(selectedBox);
  startX = e.clientX;
  startY = e.clientY;
  selectedBox.style.left = startX + "px";
  selectedBox.style.top = startY + "px";
}

//Оновлення розміру виділеної області
function updateSelectedBox(e) {
  selectedBox.style.width = e.clientX - startX + "px";
  selectedBox.style.height = e.clientY - startY + "px";
}

//Закінчення виділення елементів
function finalizeSelectedBox() {
  const selectedLetters = document.querySelectorAll(".selected");
  selectedLetters.forEach((letter) => {
    letter.classList.remove("selected");
  });
  selectedLetter = [];
  selectedBox.remove();
}
