(function () {
  var BUDGET_MIN = 100000;
  var BUDGET_MAX = 600000;
  var BUDGET_DEFAULT = 155000;

  var PATH_BUDGET = ['1', '2', '3', '4'];
  var PATH_PHONE = ['1', '2', '3', '4', '5'];
  var PATH_MESSENGER = ['1', '2', '3', '4', '6', '7', '8'];

  var dialog = document.getElementById('quiz');
  var openBtn = document.querySelector('[data-quiz-open]');
  var closeBtn = dialog.querySelector('.quiz__close');
  var steps = dialog.querySelectorAll('.quiz__step');
  var progress = dialog.querySelector('.quiz__progress');
  var progressBar = dialog.querySelector('.quiz__progress-bar');
  var counter = dialog.querySelector('.quiz__counter-current');
  var counterTotal = dialog.querySelector('.quiz__counter-total');

  var tasks = dialog.querySelector('[data-step="2"] .quiz__input');
  var slider = dialog.querySelector('.budget__slider');
  var amount = dialog.querySelector('.budget__amount');
  var loginInput = dialog.querySelector('.quiz__login');
  var phoneInputs = dialog.querySelectorAll('.quiz__phone');
  var forms = dialog.querySelectorAll('.quiz__form');

  var path = PATH_BUDGET;
  var contact = '';
  var platform = '';

  function currentStepId() {
    return dialog.querySelector('.quiz__step.is-active').dataset.step;
  }

  function showStep(id) {
    steps.forEach(function (step) {
      step.classList.toggle('is-active', step.dataset.step === id);
    });

    var current = path.indexOf(id) + 1;
    var percent = Math.round(current / path.length * 100);
    counter.textContent = current;
    counterTotal.textContent = path.length;
    progressBar.style.width = percent + '%';
    progress.setAttribute('aria-valuenow', percent);

    var focusable = dialog.querySelector('.quiz__step.is-active input, .quiz__step.is-active textarea, .quiz__step.is-active button');
    if (focusable) {
      focusable.focus();
    }
  }

  function showNext() {
    var index = path.indexOf(currentStepId());
    showStep(path[index + 1]);
  }

  function showPrev() {
    var index = path.indexOf(currentStepId());
    showStep(path[index - 1]);
  }

  function selectOption(option) {
    option.closest('.quiz__step').querySelectorAll('.quiz__option').forEach(function (item) {
      item.classList.remove('is-selected');
    });
    option.classList.add('is-selected');
  }

  function showError(step, input) {
    var error = step.querySelector('.quiz__error');
    if (error) {
      error.hidden = false;
    }
    if (input) {
      input.focus();
    }
  }

  function clearError(input) {
    var error = input.closest('.quiz__step').querySelector('.quiz__error');
    if (error) {
      error.hidden = true;
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

  phoneInputs.forEach(function (phone) {
    phone.addEventListener('input', function () {
      phone.value = formatPhone(phone.value);
      clearError(phone);
    });
  });

  loginInput.addEventListener('input', function () {
    clearError(loginInput);
  });

  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var phone = form.querySelector('.quiz__phone');
      if (phone.value.replace(/\D/g, '').length !== 10) {
        showError(form.closest('.quiz__step'), phone);
        return;
      }

      sendLead({
        budget: Number(slider.value),
        tasks: tasks.value.trim(),
        contact: contact,
        platform: platform,
        login: loginInput.value.trim(),
        phone: '+7 ' + phone.value
      });
    });
  });

  openBtn.addEventListener('click', function () {
    path = PATH_BUDGET;
    contact = '';
    platform = '';
    dialog.querySelectorAll('.quiz__option').forEach(function (option) {
      option.classList.remove('is-selected');
    });
    tasks.value = '';
    loginInput.value = '';
    phoneInputs.forEach(function (phone) {
      phone.value = '';
    });
    dialog.querySelectorAll('.quiz__error').forEach(function (error) {
      error.hidden = true;
    });
    slider.value = BUDGET_DEFAULT;
    renderBudget();
    showStep('1');
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

  dialog.querySelectorAll('.quiz__option').forEach(function (option) {
    option.addEventListener('click', function () {
      selectOption(option);

      var value = option.dataset.value;

      if (value === 'budget') {
        path = PATH_BUDGET;
        showStep('2');
      } else if (value === 'phone') {
        contact = 'phone';
        path = PATH_PHONE;
        showStep('5');
      } else if (value === 'messenger') {
        contact = 'messenger';
        path = PATH_MESSENGER;
        showStep('6');
      } else if (value === 'telegram' || value === 'max') {
        platform = value;
        showNext();
      }
    });
  });

  dialog.querySelectorAll('.quiz__next:not([data-submit])').forEach(function (button) {
    button.addEventListener('click', function () {
      var step = button.closest('.quiz__step');
      var login = step.querySelector('.quiz__login');

      if (login && !login.value.trim()) {
        showError(step, login);
        return;
      }

      showNext();
    });
  });

  dialog.querySelectorAll('.quiz__back').forEach(function (button) {
    button.addEventListener('click', showPrev);
  });

  renderBudget();
})();
