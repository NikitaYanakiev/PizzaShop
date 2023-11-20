// Функция для отображения/скрытия меню при клике на бургер-меню
const handleBurgerClick = () => {
  const header = document.querySelector('.header');
  header.classList.toggle('active');
};

document.querySelector('.header__burger').addEventListener('click', handleBurgerClick);

// Функция для добавления класса при прокрутке страницы
const handleScroll = () => {
  const header = document.querySelector("header");
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollTop > 40) {
      header.classList.add("scrolled");
  } else {
      header.classList.remove("scrolled");
  }
};

window.addEventListener("scroll", handleScroll);

document.addEventListener("DOMContentLoaded", () => {
  const menuButtons = document.querySelectorAll(".menu__btn");
  const menuItems = document.querySelectorAll(".menu__item");

  menuButtons.forEach(button => {
      // Функция для обработки клика по кнопке меню
      const handleButtonClick = () => {
          const filterValue = button.textContent.trim();

          // Удаление класса active у всех кнопок меню
          menuButtons.forEach(btn => {
              btn.classList.remove("active");
          });

          // Добавление класса active только к текущей нажатой кнопке меню
          button.classList.add("active");

          menuItems.forEach(item => {
              const itemDataMenu = item.getAttribute("data-menu");

              // Показываем элементы, которые соответствуют условиям фильтрации, скрываем остальные
              if (filterValue === "Show All" || itemDataMenu.includes(filterValue.toLowerCase().replace(" ", "_"))) {
                  item.style.display = "block";
              } else {
                  item.style.display = "none";
              }
          });
      };

      button.addEventListener("click", handleButtonClick);
  });
});

const menuItems = document.querySelectorAll('.menu__item');

menuItems.forEach(item => {
    const sizes = item.querySelectorAll('.menu__item-size');
    const plusBtn = item.querySelector('.menu__item-plus');
    const minusBtn = item.querySelector('.menu__item-minus');
    const quantity = item.querySelector('.menu__item-number');
    const price = item.querySelector('.menu__item-price');

    if (price) {
        let initialPrice = parseFloat(price.textContent.trim().replace(',', '.') || '0'),
            startPrice = parseFloat(price.textContent.trim().replace(',', '.') || '0');


        sizes.forEach(size => {
            size.addEventListener('click', () => {
                sizes.forEach(item => item.classList.remove('active'));
                size.classList.add('active');

                const sizeValue = size.textContent.trim();

                if (sizeValue === '22') {
                    initialPrice = startPrice * 0.8;
                } else if (sizeValue === '33') {
                    initialPrice = startPrice * 1.2;
                } else if (sizeValue === '28') {
                    initialPrice = startPrice;
                }

                let value = parseFloat(quantity.textContent.trim().replace(',', '.')) || 0;
                let totalPrice = initialPrice * value;
                price.innerHTML = totalPrice.toFixed(2).replace('.', ',') + '<span>$</span>';
            });
        });

        plusBtn.addEventListener('click', () => {
            let value = parseFloat(quantity.textContent.trim().replace(',', '.')) || 0;
            value++;
            quantity.textContent = value < 1 ? 1 : value;

            let totalPrice = initialPrice * value;
            price.innerHTML = totalPrice.toFixed(2).replace('.', ',') + '<span>$</span>';
        });

        minusBtn.addEventListener('click', () => {
            let value = parseFloat(quantity.textContent.trim().replace(',', '.')) || 0;
            if (value > 1) {
                value--;
                quantity.textContent = value;

                let totalPrice = initialPrice * value;
                price.innerHTML = totalPrice.toFixed(2).replace('.', ',') + '<span>$</span>';
            }
        });
    }
});






