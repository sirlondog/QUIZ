(function () {
  var TOTAL_STEPS = 3;

  var BUDGET_MIN = 100000;
  var BUDGET_MAX = 600000;
  var BUDGET_STEP = 5000;
  var BUDGET_DEFAULT = 155000;

  var DIAL_START = 135;
  var DIAL_SWEEP = 270;
  var DIAL_RADIUS = 100;
  var DIAL_VIEW = 240;
  var DIAL_RADIUS_PCT = DIAL_RADIUS / DIAL_VIEW * 100;
  var DIAL_LENGTH = 2 * Math.PI * DIAL_RADIUS * DIAL_SWEEP / 360;
  var DIAL_CIRCUMFERENCE = 2 * Math.PI * DIAL_RADIUS;

  var dialog = document.getElementById('quiz');
  var openBtn = document.querySelector('[data-quiz-open]');
  var closeBtn = dialog.querySelector('.quiz__close');
  var steps = dialog.querySelectorAll('.quiz__step');
  var options = dialog.querySelectorAll('.quiz__option');
  var input = dialog.querySelector('.quiz__input');
  var nextBtn = dialog.querySelector('[data-next]');
  var progress = dialog.querySelector('.quiz__progress');
  var progressBar = dialog.querySelector('.quiz__progress-bar');
  var counter = dialog.querySelector('.quiz__counter-current');
  var counterTotal = dialog.querySelector('.quiz__counter-total');

  var dial = dialog.querySelector('.budget__dial');
  var track = dialog.querySelector('.budget__track');
  var fill = dialog.querySelector('.budget__fill');
  var handle = dialog.querySelector('.budget__handle');
  var amount = dialog.querySelector('.budget__amount');

  var budget = BUDGET_DEFAULT;
  var dragging = false;

  counterTotal.textContent = TOTAL_STEPS;
  track.setAttribute('stroke-dasharray', DIAL_LENGTH + ' ' + DIAL_CIRCUMFERENCE);

  function setStep(n) {
    steps.forEach(function (step) {
      step.classList.toggle('is-active', Number(step.dataset.step) === n);
    });
    var percent = Math.round(n / TOTAL_STEPS * 100);
    counter.textContent = n;
    progressBar.style.width = percent + '%';
    progress.setAttribute('aria-valuenow', percent);
  }

  function formatBudget(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0') + '\u00A0₽';
  }

  function renderBudget() {
    var fraction = (budget - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN);
    var angle = (DIAL_START + DIAL_SWEEP * fraction) * Math.PI / 180;

    fill.setAttribute('stroke-dasharray', (DIAL_LENGTH * fraction).toFixed(2) + ' ' + DIAL_CIRCUMFERENCE.toFixed(2));
    handle.style.left = (50 + DIAL_RADIUS_PCT * Math.cos(angle)) + '%';
    handle.style.top = (50 + DIAL_RADIUS_PCT * Math.sin(angle)) + '%';
    handle.setAttribute('aria-valuenow', budget);
    handle.setAttribute('aria-valuetext', formatBudget(budget));
    amount.textContent = formatBudget(budget);
  }

  function setBudget(value) {
    var snapped = Math.round(value / BUDGET_STEP) * BUDGET_STEP;
    budget = Math.min(BUDGET_MAX, Math.max(BUDGET_MIN, snapped));
    renderBudget();
  }

  function budgetFromPointer(event) {
    var rect = dial.getBoundingClientRect();
    var dx = event.clientX - (rect.left + rect.width / 2);
    var dy = event.clientY - (rect.top + rect.height / 2);
    var degrees = Math.atan2(dy, dx) * 180 / Math.PI;
    var relative = (degrees - DIAL_START + 360) % 360;
    var fraction;

    if (relative > DIAL_SWEEP) {
      fraction = relative < DIAL_SWEEP + (360 - DIAL_SWEEP) / 2 ? 1 : 0;
    } else {
      fraction = relative / DIAL_SWEEP;
    }

    setBudget(BUDGET_MIN + fraction * (BUDGET_MAX - BUDGET_MIN));
  }

  dial.addEventListener('pointerdown', function (event) {
    dragging = true;
    dial.setPointerCapture(event.pointerId);
    budgetFromPointer(event);
    handle.focus();
  });

  dial.addEventListener('pointermove', function (event) {
    if (dragging) {
      budgetFromPointer(event);
    }
  });

  function stopDragging() {
    dragging = false;
  }

  dial.addEventListener('pointerup', stopDragging);
  dial.addEventListener('pointercancel', stopDragging);

  handle.addEventListener('keydown', function (event) {
    var keys = {
      ArrowUp: BUDGET_STEP,
      ArrowRight: BUDGET_STEP,
      ArrowDown: -BUDGET_STEP,
      ArrowLeft: -BUDGET_STEP
    };

    if (event.key in keys) {
      event.preventDefault();
      setBudget(budget + keys[event.key]);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setBudget(BUDGET_MIN);
    } else if (event.key === 'End') {
      event.preventDefault();
      setBudget(BUDGET_MAX);
    }
  });

  openBtn.addEventListener('click', function () {
    setStep(1);
    options.forEach(function (option) {
      option.classList.remove('is-selected');
    });
    input.value = '';
    setBudget(BUDGET_DEFAULT);
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

  nextBtn.addEventListener('click', function () {
    setStep(3);
    handle.focus();
  });

  setStep(1);
  renderBudget();
})();
