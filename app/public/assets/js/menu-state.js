document.addEventListener('DOMContentLoaded', function () {
  // 1️⃣ بازیابی وضعیت منو از localStorage
  let savedMenuState = JSON.parse(localStorage.getItem("menuState")) || {};
  document.querySelectorAll('.has-sub-menu').forEach((menu) => {
    let menuName = menu.querySelector('a').getAttribute('data-menu');
    if (savedMenuState[menuName]) {
      menu.classList.add('open'); // منوهایی که باز بودن، دوباره باز می‌کنیم
    }
  });

  // 2️⃣ ذخیره تغییرات در سرور
  document.querySelectorAll('.has-sub-menu > a').forEach((menu) => {
    menu.addEventListener('click', function (event) {
      event.preventDefault();

      let menuName = this.getAttribute('data-menu');

      fetch('/toggle-menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menu: menuName })
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            menu.parentElement.classList.toggle('open');
            localStorage.setItem("menuState", JSON.stringify(data.menuState)); // ذخیره در localStorage
          }
        });
    });
  });
});
