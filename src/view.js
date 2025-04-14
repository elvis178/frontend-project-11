const handleValidationError = ({ submit, urlInput, feedback }) => {
  submit.disabled = false;
  urlInput.classList.add('is-invalid');
  feedback.classList.remove('text-success');
  feedback.classList.remove('text-warning');
  feedback.classList.add('text-danger');
};

const handleLoadingState = ({ submit, urlInput, feedback }, i18next) => {
  submit.disabled = true;
  urlInput.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.remove('text-success');
  feedback.classList.add('text-warning');
  feedback.textContent = i18next.t('status.sending');
};

const handleSuccessState = ({
  submit, urlInput, feedback, form,
}, i18next) => {
  submit.disabled = false;
  urlInput.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.remove('text-warning');
  feedback.classList.add('text-success');
  feedback.textContent = i18next.t('status.success');
  form.reset();
  urlInput.focus();
};

const handleFormStateUpdate = (elements, i18next, value) => {
  switch (value) {
    case 'invalid':
      handleValidationError(elements);
      break;
    case 'sending':
      handleLoadingState(elements, i18next);
      break;
    case 'added': {
      handleSuccessState(elements, i18next);
      break;
    }
    default:
      break;
  }
};

const handleErrorRender = (state, { feedback }, i18next, error) => {
  if (error === null) {
    return;
  }

  feedback.classList.add('text-danger');
  feedback.textContent = i18next.t(`errors.${state.error}`);
};


const handleStateChange = (state, elements, i18next) => (path, value) => {
  switch (path) {
    case 'formState':
      handleFormStateUpdate(elements, i18next, value);
      break;
    case 'error':
      handleErrorRender(state, elements, i18next, value);
      break;
    default:
      break;
  }
};

export default handleStateChange;