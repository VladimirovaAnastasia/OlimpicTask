import FullPageScroll from '@/js/modules/ful-page-scroll';

import './scss/index.scss'


const $button = document.querySelector('.menu-button');
const $menu = document.querySelector('.main-menu');

$button.onclick = function() {
    if ($menu.classList.contains('main-menu--active')) {
        $menu.classList.remove('main-menu--active')
    } else {
        $menu.classList.add('main-menu--active');
        window.addEventListener(`click`, toogleMenu)
    }
}

const toogleMenu = (e) => {
    if (!e.target.classList.contains('menu-button')) {
        $menu.classList.remove('main-menu--active')
        window.removeEventListener(`click`, toogleMenu)
    }
}


window.addEventListener(`load`, () => {
    const fullPageScroll = new FullPageScroll();
    fullPageScroll.init();
    fullPageScroll.slider.style.left = '0'

})

