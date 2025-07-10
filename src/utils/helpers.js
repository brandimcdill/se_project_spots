export function setBtnText(
  btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    btn.textContent = loadingText;
  } else {
    btn.textContent = defaultText;
  }
}
export function handleSubmit(request, evt, loadingText = "Saving...") {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  const initialText = submitBtn.textContent;
  setBtnText(submitBtn, true, initialText, loadingText);
  request()
    .then(() => {
      evt.target.reset();
    })
    .catch(console.error)
    .finally(() => {
      setBtnText(submitBtn, false, initialText);
    });
}
