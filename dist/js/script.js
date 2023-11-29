const handleBurgerClick = () => {
    const header = document.querySelector('.header');
    header.classList.toggle('active');
    document.body.classList.toggle('.lock');
};

document.querySelector('.header__burger').addEventListener('click', handleBurgerClick);

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
        const handleButtonClick = () => {
            const filterValue = button.textContent.trim();

            menuButtons.forEach(btn => {
                btn.classList.remove("active");
            });

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

function handleOrderButtonClick(event) {

    const menuItem = event.target.closest('.menu__item'); 
    if (!menuItem) return; 

    const itemImgSrc = menuItem.querySelector('.menu__item-img img').getAttribute('src');
    const itemTitle = menuItem.querySelector('.menu__item-title').textContent;
    const itemSize = menuItem.querySelector('.menu__item-size.active').textContent;
    const itemQuantity = menuItem.querySelector('.menu__item-number').textContent;
    const itemPrice = menuItem.querySelector('.menu__item-price').textContent;

    const newShopItem = document.createElement('li');
    newShopItem.classList.add('header__shop-item');

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

    const shopList = document.querySelector('.header__shop-list');
    shopList.appendChild(newShopItem);

    updateShopCardTotal();
}

function updateShopCardTotal() {
    const shopItems = document.querySelectorAll('.header__shop-quontity');
    let totalQuantity = 0;

    shopItems.forEach((item) => {
        const itemTextContent = item.textContent;
        const quantityRegex = /quantity:\s*(\d+)/; 
        const match = itemTextContent.match(quantityRegex);

        if (match && match[1]) {
            const itemQuantity = parseInt(match[1]) || 0;
            totalQuantity += itemQuantity;
        }
    });

    if (totalQuantity === 0) {
        const shopCardTotal = document.querySelector('.header__shop-card span.header__shop-total');
        if (shopCardTotal) {
            shopCardTotal.remove();
        }

        const shopBody = document.querySelector('.header__shop-body');
        if (shopBody) {
            shopBody.classList.remove('_active');
        }
        return; 
    }

    let shopCardTotal = document.querySelector('.header__shop-card span');
    if (!shopCardTotal) {
        shopCardTotal = document.createElement('span');
        shopCardTotal.classList.add('header__shop-total');
        document.querySelector('.header__shop-card').appendChild(shopCardTotal);
    }

    const shopCardTotalValue = document.querySelector('.header__shop-card span.header__shop-total');
    shopCardTotalValue.textContent = totalQuantity; 

    
    const deleteButtons = document.querySelectorAll('.header__shop-delete');
    deleteButtons.forEach((button) => {
        button.addEventListener('click', handleShopItemDelete);
    });

}

const orderButtons = document.querySelectorAll('.menu__item-btn');
orderButtons.forEach((button) => {
    button.addEventListener('click', handleOrderButtonClick);
});

function handleShopItemDelete(event) {
    event.preventDefault(); 

    const deleteButton = event.target; 
    const shopItem = deleteButton.closest('.header__shop-item');
    if (!shopItem) return; 

    shopItem.remove();

    updateShopCardTotal();
}

const deleteButtons = document.querySelectorAll('.header__shop-delete');
deleteButtons.forEach((button) => {
    button.addEventListener('click', handleShopItemDelete);
});

const shopCard = document.querySelector('.header__shop-card');

const shopBody = document.querySelector('.header__shop-body');

shopCard.addEventListener('click', function (event) {
    event.preventDefault(); 

    const shopCardSpan = this.querySelector('span.header__shop-total');

    if (shopCardSpan) {
        shopBody.classList.toggle('_active');
    } else {
        shopBody.classList.remove('_active');
    }
});

const smoothScrollToAnchors = () => {
    const anchors = document.querySelectorAll('a[href*="#"]');
  
    anchors.forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
  
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

  function animateOnScroll() {
    const elements = document.querySelectorAll('.anim-left, .anim-right, .anim-down, .anim-show');
    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect();
      const screenHeight = window.innerHeight;

      if (elementPosition.top < screenHeight) {
        element.classList.add('anim-active');
      }
    });

    // Удалите обработчик события прокрутки после того, как все элементы анимированы
    if (document.querySelectorAll('.anim-left.anim-active, .anim-right.anim-active, .anim-down.anim-active, .anim-show.anim-active').length === elements.length) {
      window.removeEventListener('scroll', animateOnScroll);
    }
  }

  // Добавление класса "anim-active" для элементов, которые видимы при загрузке страницы
  window.addEventListener('load', () => {
    const elementsOnLoad = document.querySelectorAll('.anim-load');
    elementsOnLoad.forEach((element) => {
      element.classList.add('anim-active');
    });

    // Скрыть прелоадер сразу после загрузки страницы
    const preloader = document.getElementById('page-preloader');
    if (preloader) {
      
    setTimeout(() => {
        preloader.classList.add('done');
    }, 2000);

      // Анимировать элементы с классом "anim-after-preload" после скрытия прелоадера
    setTimeout(() => {
        const elementsAfterPreload = document.querySelectorAll('.anim-after-preload');
        elementsAfterPreload.forEach((element) => {
          element.classList.add('anim-active');
        });
    },2000);

      // Добавить обработчик события прокрутки только после скрытия прелоадера
      window.addEventListener('scroll', animateOnScroll);
    }
  });