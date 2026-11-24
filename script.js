(function () {
  var TOTAL_STEPS = 4;

  var BUDGET_MIN = 100000;
  var BUDGET_MAX = 600000;
  var BUDGET_DEFAULT = 155000;

  var dialog = document.getElementById('quiz');
  var openBtn = document.querySelector('[data-quiz-open]');
  var closeBtn = dialog.querySelector('.quiz__close');
  var steps = dialog.querySelectorAll('.quiz__step');
  var options = dialog.querySelectorAll('.quiz__option');
  var nextBtns = dialog.querySelectorAll('.quiz__next');
  var backBtns = dialog.querySelectorAll('.quiz__back');
  var input = dialog.querySelector('.quiz__input');
  var progress = dialog.querySelector('.quiz__progress');
  var progressBar = dialog.querySelector('.quiz__progress-bar');
  var counter = dialog.querySelector('.quiz__counter-current');
  var counterTotal = dialog.querySelector('.quiz__counter-total');

  var slider = dialog.querySelector('.budget__slider');
  var amount = dialog.querySelector('.budget__amount');

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

  function focusActiveStep() {
    var focusable = dialog.querySelector('.quiz__step.is-active input, .quiz__step.is-active textarea, .quiz__step.is-active button');
    if (focusable) {
      focusable.focus();
    }
  }

  function formatBudget(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0') + '\u00A0₽';
  }

  function renderBudget() {
    var value = Number(slider.value);
    var percent = (value - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN) * 100;
    amount.textContent = formatBudget(value);
    slider.style.setProperty('--fill', percent + '%');
  }

  slider.addEventListener('input', renderBudget);

  openBtn.addEventListener('click', function () {
    setStep(1);
    options.forEach(function (option) {
      option.classList.remove('is-selected');
    });
    input.value = '';
    slider.value = BUDGET_DEFAULT;
    renderBudget();
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
        focusActiveStep();
      }
    });
  });

  nextBtns.forEach(function (button) {
    button.addEventListener('click', function () {
      var current = Number(button.closest('.quiz__step').dataset.step);
      setStep(current + 1);
      focusActiveStep();
    });
  });

  backBtns.forEach(function (button) {
    button.addEventListener('click', function () {
      var current = Number(button.closest('.quiz__step').dataset.step);
      setStep(current - 1);
      focusActiveStep();
    });
  });

  setStep(1);
  renderBudget();
})();
