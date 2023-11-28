// Функция для отображения/скрытия меню при клике на бургер-меню
const handleBurgerClick = () => {
    const header = document.querySelector('.header');
    header.classList.toggle('active');
    document.body.classList.toggle('.lock');
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

// Функция для обработки нажатия на кнопку заказа
function handleOrderButtonClick(event) {
    event.preventDefault(); // Предотвращаем стандартное действие ссылки

    const menuItem = event.target.closest('.menu__item'); // Находим ближайший родительский элемент .menu__item
    if (!menuItem) return; // Если не найден, выходим

    // Получаем необходимые данные из элемента .menu__item
    const itemImgSrc = menuItem.querySelector('.menu__item-img img').getAttribute('src');
    const itemTitle = menuItem.querySelector('.menu__item-title').textContent;
    const itemSize = menuItem.querySelector('.menu__item-size.active').textContent;
    const itemQuantity = menuItem.querySelector('.menu__item-number').textContent;
    const itemPrice = menuItem.querySelector('.menu__item-price').textContent;

    // Создаем новый элемент li для корзины
    const newShopItem = document.createElement('li');
    newShopItem.classList.add('header__shop-item');

    // Добавляем HTML-содержимое в новый элемент li
    newShopItem.innerHTML = `
        <div class="header__shop-img">
            <img src="${itemImgSrc}" alt="pizza">
        </div>
        <div class="header__shop-inform">
            <div class="header__shop-title">${itemTitle}</div>
            <div class="header__shop-size">size: ${itemSize}</div>
            <div class="header__shop-quontity">quantity: ${itemQuantity}</div>
            <div class="header__shop-price">price: ${itemPrice}</div>
            <a href='#' class="header__shop-delete">Delete</a>
        </div>
    `;

    // Находим элемент .header__shop-list и добавляем в него новый элемент li
    const shopList = document.querySelector('.header__shop-list');
    shopList.appendChild(newShopItem);

    // Обновляем содержимое span в .header__shop-card с суммой всех header__shop-quontity
    updateShopCardTotal();
}

// Функция для обновления содержимого span в .header__shop-card
function updateShopCardTotal() {
    const shopItems = document.querySelectorAll('.header__shop-quontity');
    let totalQuantity = 0;

    // Перебираем все элементы .header__shop-quontity и суммируем их значения
    shopItems.forEach((item) => {
        const itemTextContent = item.textContent;
        const quantityRegex = /quantity:\s*(\d+)/; // Регулярное выражение для извлечения числа
        const match = itemTextContent.match(quantityRegex);

        if (match && match[1]) {
            const itemQuantity = parseInt(match[1]) || 0;
            totalQuantity += itemQuantity;
        }
    });

    // Если значение totalQuantity равно нулю, удаляем элемент span
    if (totalQuantity === 0) {
        const shopCardTotal = document.querySelector('.header__shop-card span.header__shop-total');
        if (shopCardTotal) {
            shopCardTotal.remove();
        }

        const shopBody = document.querySelector('.header__shop-body');
        if (shopBody) {
            shopBody.classList.remove('_active');
        }
        return; // Завершаем функцию, не обновляя значение спана
    }

    // Создаем элемент span, если он еще не существует в .header__shop-card
    let shopCardTotal = document.querySelector('.header__shop-card span');
    if (!shopCardTotal) {
        shopCardTotal = document.createElement('span');
        shopCardTotal.classList.add('header__shop-total');
        document.querySelector('.header__shop-card').appendChild(shopCardTotal);
    }

    // Обновляем содержимое span в .header__shop-card с суммой всех header__shop-quontity
    const shopCardTotalValue = document.querySelector('.header__shop-card span.header__shop-total');
    shopCardTotalValue.textContent = totalQuantity; // Не нужно показывать '0', если totalQuantity равно нулю

    // Находим все элементы .header__shop-delete и навешиваем на них обработчик события клика для удаления товара из корзины
    const deleteButtons = document.querySelectorAll('.header__shop-delete');
    deleteButtons.forEach((button) => {
        button.addEventListener('click', handleShopItemDelete);
    });

}

// Находим все элементы .menu__item-btn и навешиваем на них обработчик события клика
const orderButtons = document.querySelectorAll('.menu__item-btn');
orderButtons.forEach((button) => {
    button.addEventListener('click', handleOrderButtonClick);
});

// Функция для удаления товара из корзины
function handleShopItemDelete(event) {
    event.preventDefault(); // Предотвращаем стандартное действие ссылки

    const deleteButton = event.target; // Получаем ссылку .header__shop-delete, по которой произошло событие
    const shopItem = deleteButton.closest('.header__shop-item'); // Находим элемент корзины .header__shop-item
    if (!shopItem) return; // Если не найден, выходим

    // Удаляем элемент из корзины
    shopItem.remove();

    // После удаления товара пересчитываем и обновляем общее количество в корзине
    updateShopCardTotal();
}

// Находим все элементы .header__shop-delete и навешиваем на них обработчик события клика для удаления товара из корзины
const deleteButtons = document.querySelectorAll('.header__shop-delete');
deleteButtons.forEach((button) => {
    button.addEventListener('click', handleShopItemDelete);
});

// Находим элемент .header__shop-card
const shopCard = document.querySelector('.header__shop-card');

// Находим элемент .header__shop-body
const shopBody = document.querySelector('.header__shop-body');

// Обработчик события клика на элементе .header__shop-card
shopCard.addEventListener('click', function (event) {
    event.preventDefault(); // Предотвращаем стандартное действие ссылки

    const shopCardSpan = this.querySelector('span.header__shop-total');

    // Если span существует внутри .header__shop-card
    if (shopCardSpan) {
        // Добавляем класс _active к элементу .header__shop-body
        shopBody.classList.toggle('_active');
    } else {
        // Убираем класс _active у элемента .header__shop-body
        shopBody.classList.remove('_active');
    }
});

const smoothScrollToAnchors = () => {
    const anchors = document.querySelectorAll('a[href*="#"]');
  
    anchors.forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
  
        // Закрыть меню бургера, если оно открыто
        const header = document.querySelector('.header');
        if (header.classList.contains('active')) {
            handleBurgerClick();
        }
  
        const blockID = anchor.getAttribute('href').substr(1);
  
        document.getElementById(blockID).scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    });
  };

  smoothScrollToAnchors();