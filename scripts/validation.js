const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

//make sure the classes and selectors match what I have
const showInputError = (formEl, inputEl, errorMsg) => {
  console.log(formEl);
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
  inputEl.classList.add(settings.inputErrorClass);
  errorMsgEl.textContent = errorMsg;
};
const hideInputError = (formEl, inputEl) => {
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
  inputEl.classList.remove(settings.inputErrorClass);
  errorMsgEl.textContent = "";
};

const checkInputValidity = (formEl, inputEl, config) => {
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage);
  } else {
    hideInputError(formEl, inputEl);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputEl) => !inputEl.validity.valid);
};
const disableButton = (cardSubmitBtn) => {
  cardSubmitBtn.classList.add(settings.inactiveButtonClass);
  cardSubmitBtn.disabled = true;
};
const toggleButtonState = (inputList, cardSubmitBtn) => {
  if (hasInvalidInput(inputList)) {
    cardSubmitBtn.disabled = true;
    cardSubmitBtn.classList.add(settings.inactiveButtonClass);
  } else {
    cardSubmitBtn.disabled = false;
    cardSubmitBtn.classList.remove(settings.inactiveButtonClass);
  }
};
const resetValidation = (formEl, inputList, config) => {
  inputList.forEach((inputEl) => {
    hideInputError(formEl, inputEl);
  });
};
//TODO - use the settings object in all functions instead of hard-coded strings
const setEventListeners = (formEl) => {
  const inputList = Array.from(formEl.querySelectorAll(settings.inputSelector));
  const cardSubmitBtn = formEl.querySelector(settings.submitButtonSelector);

  //TODO - handle initial states
  toggleButtonState(inputList, cardSubmitBtn);

  inputList.forEach((inputEl) => {
    inputEl.addEventListener("input", function () {
      checkInputValidity(formEl, inputEl);
      toggleButtonState(inputList, cardSubmitBtn);
    });
  });
};
const enableValidation = (config) => {
  const formList = document.querySelectorAll(config.formSelector);
  formList.forEach((formEl) => {
    setEventListeners(formEl);
  });
};

enableValidation(settings);
