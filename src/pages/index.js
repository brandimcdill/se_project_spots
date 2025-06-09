import "./index.css";
import {
  enableValidation,
  resetValidation,
  validationConfig,
} from "../scripts/validation.js";
import { setBtnText } from "../utils/helpers.js";
import Api from "../utils/Api.js";
import logoSpots from "../images/logo.svg";
import bessieAvatar from "../images/avatar.jpg";
import pencilImage from "../images/pencil.svg";
import avatarPencil from "../images/pencil-light.svg";
import plusIcon from "../images/plus.svg";
const spotsImage = document.getElementById("logoSpots");
spotsImage.src = logoSpots;
const pencil = document.getElementById("pencilImage");
pencil.src = pencilImage;
const lightPencil = document.getElementById("avatarPencil");
lightPencil.src = avatarPencil;
const addImage = document.getElementById("plusIcon");
addImage.src = plusIcon;
const bessieImage = document.getElementById("bessieAvatar");
bessieImage.src = bessieAvatar;

const editModal = document.querySelector("#edit-profile-modal");
const profileEditBtn = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__avatar");

const editFormElement = editModal.querySelector(".modal__form");

const editModalCloseBtn = editModal.querySelector(".modal__close");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

const cardModal = document.querySelector("#add-card-modal");

const cardModalCloseBtn = cardModal.querySelector(".modal__close");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const disabledBtnEl = cardModal.querySelector(".modal__submit-btn_disabled");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

//Avatar form elements
const avatarModal = document.querySelector("#avatar-modal");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

//Delete Form Elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");

const previewModal = document.querySelector("#preview-modal");
const previewModalImgEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewCloseBtn = previewModal.querySelector(".modal__close_preview");

const cardTemplate = document.querySelector("#card-template");
const cardList = document.querySelector(".cards__list");

let selectedCard;
let selectedCardId;

const api = new Api({
  baseURL: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "ccc1108b-0e43-4488-be9b-8eb1c8ff494e",
    "Content-Type": "application/json",
  },
});

window.api = api;

api
  .getAppInfo()
  .then(([cards, { name, about, avatar }]) => {
    console.log(cards);
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardList.append(cardElement);
    });
    profileName.textContent = name;
    profileDescription.textContent = about;
    profileAvatar.src = avatar;
  })
  .catch(console.error);

console.log("API instance created:", api);
console.log("getAppInfo method exists:", typeof api.getAppInfo);

function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const modalOpen = document.querySelector(".modal_opened");
    closeModal(modalOpen);
  }
}
function handleClickOutside(evt) {
  if (evt.target.classList.contains("modal_opened")) {
    closeModal(evt.target);
  }
}
function openModal(modal) {
  modal.classList.add("modal_opened");
  modal.addEventListener("click", handleClickOutside);
  document.addEventListener("keydown", handleEscClose);
}
function closeModal(modal) {
  modal.classList.remove("modal_opened");
  modal.removeEventListener("click", handleClickOutside);
  document.removeEventListener("keydown", handleEscClose);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();

  //Change text content to "Saving..."
  const submitBtn = evt.submitter;
  // submitBtn.textContent = "Saving...";
  //setBtnText(submitBtn, true, "Save", "Saving...");
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      // TODO- Use data argument instead of the input values
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error);
  //.finally(() => {
  // submitBtn.textContent = "Save";
  //})
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
  disableButton(cardSubmitBtn, settings);
}

//TODO- Finish avatar submission handler
function handleAvatarSubmit(evt) {
  evt.preventDefault;
  console.log(avatarInput.value);
  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      console.log(data);
      // TODO - make this work
    })
    .catch(console.error);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  api
    .deleteCard(selectedCardId)
    .then(() => {
      //TODO
      // remove the card from the DOM
      // close the modal
    })
    .catch(console.error);
}

function handleDeleteCard(cardElement, cardId) {
  //evt.target.closest(".card").remove();
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleLike(evt, id) {
  // remove- evt.target.classList.toggle("card__like-btn_liked");
  // 1. check whether card is currently liked or not
  //           const isLike = ???;
  // 2. call the handleLikeStatus method, passing it the appropriate arguments
  // 3. handle the response (.then and .catch)
  // 4. in the .then, toggle active class
}

function handleImageClick(data) {
  previewModalImgEl.src = data.link;
  previewModalCaptionEl.textContent = data.name;
  previewModalImgEl.alt = data.name;
  openModal(previewModal);
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  // TODO- if the card is liked, set the active class on the card

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  cardLikeBtn.addEventListener("click", (evt) => handleLike(evt, data._id));
  cardDeleteBtn.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );
  cardImageEl.addEventListener("click", () => handleImageClick(data));

  return cardElement;
}

profileEditBtn.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    validationConfig
  );
  openModal(editModal);
});

editModalCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

//TODO - select avatar modal button at top of the page
avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});
avatarForm.addEventListener("submit", handleAvatarSubmit);

deleteForm.addEventListener("submit", handleDeleteSubmit);
cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

previewCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

enableValidation(validationConfig);
