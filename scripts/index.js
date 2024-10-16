//  TODO - pass settings object to the validation functions that are called in this file

const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const modal = document.querySelectorAll(".modal");
const editModal = document.querySelector("#edit-profile-modal");
const profileEditBtn = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const editFormElement = editModal.querySelector(".modal__form");

const editModalCloseBtn = editModal.querySelector(".modal__close");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

const cardModal = document.querySelector("#add-card-modal");

const cardModalCloseBtn = cardModal.querySelector(".modal__close");
const cardForm = cardModal.querySelector(".modal__form");
const buttonEl = cardModal.querySelector(".modal__submit-btn");
const resetBtnEl = cardModal.querySelector(".modal__submit-btn_disabled");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalImgEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewCloseBtn = previewModal.querySelector(".modal__close-btn_preview");
const inputEl = cardForm.querySelector(".modal__input");

const cardTemplate = document.querySelector("#card-template");
const cardList = document.querySelector(".cards__list");

function handleEscClose(evt) {
  if (evt.key === "Escape") {
    let modalOpen = document.querySelectorAll("modal_opened");
    closeModal(modal);
  }
}

function handleClickoutside(evt) {
  if (evt.target.classList.contains("modal_opened")) {
    closeModal(evt.target);
  }
}
function openModal(modal) {
  modal.classList.add("modal_opened");
  modal.addEventListener("click", handleClickoutside);
  document.addEventListener("keydown", handleEscClose);
}
function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("click", handleClickoutside);
  document.removeEventListener("keydown", handleEscClose);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editModal);
}
function handleAddCardSubmit(evt) {
  evt.preventDefault();
  console.log(cardNameInput.value);
  console.log(cardLinkInput.value);
  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
  const cardElement = getCardElement(inputValues);
  cardList.prepend(cardElement);
  closeModal(cardModal);
  evt.target.reset();
  buttonEl.disabled = true;
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-btn_liked");
  });

  cardDeleteBtn.addEventListener("click", () => {
    cardElement.remove();
  });

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImgEl.src = data.link;
    previewModalCaptionEl.textContent = data.name;
    previewModalImgEl.alt = data.name;
  });

  return cardElement;
}

profileEditBtn.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal);
});

editModalCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

previewCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);
buttonEl.addEventListener("submit", handleAddCardSubmit);

initialCards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardList.append(cardElement);
});
