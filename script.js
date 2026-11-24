(function () {
  var options = document.querySelectorAll('.quiz__option');
  var progressBar = document.querySelector('.quiz__progress-bar');

  options.forEach(function (option) {
    option.addEventListener('click', function () {
      options.forEach(function (item) {
        item.classList.remove('is-selected');
      });
      option.classList.add('is-selected');
      progressBar.style.width = '100%';
    });
  });
})();
