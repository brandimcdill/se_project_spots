const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error",
};

//make sure the classes and selectors match what I have
const showInputError = (formEl, inputEl, errorMsg) => {
  const errorMsgEl = formEl.querySelector("#${inputEl.id}-error");
  inputEl.classList.add("modal__input_type_error");
  errorMsgEl.textContent = errorMsg;
};
const hideInputError = (formEl, inputEl) => {
  const errorMsgEl = formEl.querySelector("#" + errorMsgID);
  errorMsgEl.textContent = "";
  inputEl.classList.remove("modal__input_type_error");
};

const checkInputValidity = (formEl, inputEl) => {
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage);
  } else {
    hideInputError(formEl, inputEl);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputEl) => {
    return !inputEl.validity.valid;
  });
};
const toggleButtonState = (inputList, buttonEl) => {
  if (hasInvalidInput(inputList)) {
    buttonEl.disabled = true;
    buttonEl.classList.add("modal__submit-btn_disabled");
  } else {
    buttonEl.disabled = false;
    //TODO - remove the disabled class
    buttonEl.classList.remove("modal__submit-btn_disabled");
  }
};
const disableButton = (buttonEl) => {
  buttonEl.disabled = true;
  //Add a modifier class to the buttonEl to make it gray
  //dont forget the CSS
};

const resetValidation = (formEl, inputList, config) => {
  inputList.forEach((inputEl) => {
    hideInputError(formEl, inputEl, config);
  });
};
//TODO - use the settings object in all functions instead of hard-coded strings
const setEventListeners = (formEl, config) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonElement = formEl.querySelector(config.submitButtonSelector);

  //TODO - handle initial states
  toggleButtonState(inputList, buttonEl);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formEl, inputEl);
      toggleButtonState(inputList, buttonEl);
    });
  });
};
const enableValidation = (config) => {
  const formList = document.querySelectorAll(config.formSelector);
  formList.forEach((formEl, config) => {
    setEventListeners(formEl, config);
  });
};

enableValidation(settings);
