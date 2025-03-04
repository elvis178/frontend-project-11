import onChange from 'on-change';

export default (state, elements, i18n) => {
  const {
    form, input, feedbackContainer, sendBtn,
  } = elements;

  const renderForm = () => {
    input.focus();
    Object.entries(elements.staticEl).forEach(([key, el]) => {
      const element = el;
      element.textContent = i18n.t(key);
    });
  };

  const handleFormState = (value) => {
    switch (value) {
      case 'processing':
        sendBtn.setAttribute('disabled', true);
        input.setAttribute('readonly', true);
        feedbackContainer.textContent = '';
        break;
      case 'success':
        sendBtn.removeAttribute('disabled');
        input.removeAttribute('readonly');
        form.reset();
        input.focus();
        feedbackContainer.textContent = i18n.t('feedback.success');
        break;
      case 'error':
        sendBtn.removeAttribute('disabled');
        input.removeAttribute('readonly');
        feedbackContainer.textContent = i18n.t(state.form.error);
        input.classList.add('is-invalid');
        break;
      default:
        break;
    }
  };

  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'form.status':
        handleFormState(state.form.status);
        break;
      default:
        break;
    }
  });

  return watchedState;
};