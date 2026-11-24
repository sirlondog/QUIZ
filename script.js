(function () {
  var TOTAL_STEPS = 2;

  var dialog = document.getElementById('quiz');
  var openBtn = document.querySelector('[data-quiz-open]');
  var closeBtn = dialog.querySelector('.quiz__close');
  var steps = dialog.querySelectorAll('.quiz__step');
  var options = dialog.querySelectorAll('.quiz__option');
  var input = dialog.querySelector('.quiz__input');
  var progress = dialog.querySelector('.quiz__progress');
  var progressBar = dialog.querySelector('.quiz__progress-bar');
  var counter = dialog.querySelector('.quiz__counter-current');
  var counterTotal = dialog.querySelector('.quiz__counter-total');

  counterTotal.textContent = TOTAL_STEPS;

  function setStep(n) {
    steps.forEach(function (step) {
      step.classList.toggle('is-active', Number(step.dataset.step) === n);
    });
    var percent = Math.round(n / TOTAL_STEPS * 100);
    counter.textContent = n;
    progressBar.style.width = percent + '%';
    progress.setAttribute('aria-valuenow', percent);
  }

  openBtn.addEventListener('click', function () {
    setStep(1);
    options.forEach(function (option) {
      option.classList.remove('is-selected');
    });
    input.value = '';
    dialog.showModal();
  });

  closeBtn.addEventListener('click', function () {
    dialog.close();
  });

  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  options.forEach(function (option) {
    option.addEventListener('click', function () {
      options.forEach(function (item) {
        item.classList.remove('is-selected');
      });
      option.classList.add('is-selected');

      if (option.dataset.value === 'budget') {
        setStep(2);
        input.focus();
      }
    });
  });

  setStep(1);
})();
