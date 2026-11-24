(function () {
  var TOTAL_STEPS = 5;

  var BUDGET_MIN = 100000;
  var BUDGET_MAX = 600000;
  var BUDGET_DEFAULT = 155000;

  var dialog = document.getElementById('quiz');
  var openBtn = document.querySelector('[data-quiz-open]');
  var closeBtn = dialog.querySelector('.quiz__close');
  var steps = dialog.querySelectorAll('.quiz__step');
  var options = dialog.querySelectorAll('.quiz__option');
  var nextBtns = dialog.querySelectorAll('.quiz__next:not([data-submit])');
  var backBtns = dialog.querySelectorAll('.quiz__back');
  var input = dialog.querySelector('.quiz__input');
  var progress = dialog.querySelector('.quiz__progress');
  var progressBar = dialog.querySelector('.quiz__progress-bar');
  var counter = dialog.querySelector('.quiz__counter-current');
  var counterTotal = dialog.querySelector('.quiz__counter-total');

  var slider = dialog.querySelector('.budget__slider');
  var amount = dialog.querySelector('.budget__amount');

  var form = dialog.querySelector('.quiz__form');
  var phone = dialog.querySelector('.quiz__phone');
  var phoneError = dialog.querySelector('.quiz__error');

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

  function formatPhone(value) {
    var digits = value.replace(/\D/g, '');
    if (digits.length > 10 && (digits.charAt(0) === '7' || digits.charAt(0) === '8')) {
      digits = digits.slice(1);
    }
    digits = digits.slice(0, 10);
    var parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 8), digits.slice(8, 10)];
    return parts.filter(Boolean).join(' ');
  }

  function sendLead(data) {
    // Куда отправлять заявку — добавим позже
    console.log('Заявка', data);
  }

  slider.addEventListener('input', renderBudget);

  phone.addEventListener('input', function () {
    phone.value = formatPhone(phone.value);
    phoneError.hidden = true;
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (phone.value.replace(/\D/g, '').length !== 10) {
      phoneError.hidden = false;
      phone.focus();
      return;
    }

    sendLead({
      budget: Number(slider.value),
      tasks: input.value.trim(),
      contact: 'phone',
      phone: '+7 ' + phone.value
    });
  });

  openBtn.addEventListener('click', function () {
    setStep(1);
    options.forEach(function (option) {
      option.classList.remove('is-selected');
    });
    input.value = '';
    phone.value = '';
    phoneError.hidden = true;
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
      } else if (option.dataset.value === 'phone') {
        setStep(5);
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
