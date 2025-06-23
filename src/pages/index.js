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
const deleteForm = deleteModal.querySelector(".card__delete-form");
const deleteFormCloseBtn = deleteModal.querySelector(
  ".card__delete-form_close"
);
const cancelDeleteBtn = deleteModal.querySelector(".card__submit-btn_cancel");

const previewModal = document.querySelector("#preview-modal");
const previewModalImgEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewCloseBtn = previewModal.querySelector(".modal__close_preview");

const cardTemplate = document.querySelector("#card-template");
const cardList = document.querySelector(".cards__list");

let selectedCard;
let selectedCardId;

cardNameInput.addEventListener("input", disableButton);
cardLinkInput.addEventListener("input", disableButton);

const api = new Api({
  baseURL: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "ccc1108b-0e43-4488-be9b-8eb1c8ff494e",
    "Content-Type": "application/json",
  },
});

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

function disableButton(evt) {
  if (cardNameInput.value != "" && cardLinkInput.value != "") {
    cardSubmitBtn.disabled = false;
    cardSubmitBtn.classList.remove("modal__submit-btn_disabled");
  } else {
    cardSubmitBtn.classList.add("modal__submit-btn_disabled");
    cardSubmitBtn.disabled = true;
  }
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setBtnText(submitBtn, true, "Save", "Saving...");
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      setBtnText(submitBtn, false, "Save", "Saving...");
    });
}
function handleAddCardSubmit(evt) {
  evt.preventDefault();
  console.log(cardNameInput.value);
  console.log(cardLinkInput.value);
  const data = { name: cardNameInput.value, link: cardLinkInput.value };

  api
    .addNewCard(data)
    .then((data) => {
      const cardElement = getCardElement(data);
      cardList.prepend(cardElement);
      closeModal(cardModal);
      evt.target.reset();
      disableButton();
    })
    .catch(console.error);
}

//TODO- Finish avatar submission handler
function handleAvatarSubmit(evt) {
  evt.preventDefault();
  console.log(avatarInput.value);
  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      console.log(data);
      // TODO - make this work
      closeModal(avatarModal);
    })
    .catch(console.error);
}
function getCardElement(data) {
  const cardElement = cardTemplate.content.cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_liked");
  }

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  cardLikeBtn.addEventListener("click", (evt) => handleLike(evt, data._id));
  console.log(data._id);
  cardDeleteBtn.addEventListener("click", (evt) =>
    handleDeleteCard(evt, data._id)
  );
  cardImageEl.addEventListener("click", () => handleImageClick(data));

  return cardElement;
}

function handleDeleteCard(evt, cardId) {
  selectedCard = evt.target.closest(".card");
  selectedCardId = cardId;
  console.log(cardId);
  openModal(deleteModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const deleteBtn = evt.submitter;
  setBtnText(deleteBtn, true, "Delete", "Deleting...");

  console.log("selectedCard:", selectedCard);
  console.log("Type of selectedCard:", typeof selectedCard);
  console.log(selectedCardId);
  console.log("About to delete card with ID:", selectedCardId);
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setBtnText(deleteBtn, false, "Delete", "Deleting...");
    });
}

function handleLike(evt, id) {
  evt.preventDefault();
  const isLiked = !!evt.target.closest(".card__like-btn_liked");
  const cardLikeBtn = evt.target.closest(".card__like-btn");
  api
    .handleLikeStatus(id, isLiked)
    .then(() => {
      if (!isLiked) {
        cardLikeBtn.classList.add("card__like-btn_liked");
      } else {
        cardLikeBtn.classList.remove("card__like-btn_liked");
      }
    })
    .catch(console.error);
}

function handleImageClick(data) {
  previewModalImgEl.src = data.link;
  previewModalCaptionEl.textContent = data.name;
  previewModalImgEl.alt = data.name;
  openModal(previewModal);
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
  disableButton();
});

//TODO - select avatar modal button at top of the page
avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});
avatarForm.addEventListener("submit", handleAvatarSubmit);

avatarModalCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

deleteFormCloseBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteForm.addEventListener("submit", handleDeleteSubmit);
cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

previewCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

cancelDeleteBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});
editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

enableValidation(validationConfig);
