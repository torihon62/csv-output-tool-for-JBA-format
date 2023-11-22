const showAlert = (alertType, message) => {
  const elementId = 'liveAlertPlaceholder';
  const wrapper = document.getElementById(elementId);

  wrapper.innerHTML = `
<div class="alert alert-${alertType} alert-dismissible position-absolute top-0 start-0 w-100" role="alert">
  <div>${message}</div>
  <button type="button" id="alert-close-bottun" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
  `;

  setInterval(() => {document.getElementById('alert-close-bottun').click()}, 5000);
};
