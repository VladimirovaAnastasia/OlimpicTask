import throttle from 'lodash/throttle';

export default class FullPageScroll {
    constructor() {
        this.THROTTLE_TIMEOUT = 2000;

        this.screenElements = document.querySelectorAll(`.slider__item`);
        this.slider = document.querySelector('.slider');
        this.width = document.body.clientWidth;
        this.leafs = document.querySelectorAll('.leaf')
        //this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);

        this.activeScreen = 0;
        this.onScrollHandler = this.onScroll.bind(this);
        this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
    }

    init() {
        document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {trailing: true}));
        window.addEventListener(`popstate`, this.onUrlHashChengedHandler);
        this.onUrlHashChanged();
        this.addListener();
    }

    onScroll(evt) {
        const currentPosition = this.activeScreen;
        this.reCalculateActiveScreenPosition(evt.deltaY);
        if (currentPosition !== this.activeScreen) {
            this.changePageDisplay();
        }
        this.slider.style.transform = `translate(${-this.width*this.activeScreen}px)`
        Array.from(this.leafs).forEach((elem) => {
            elem.style.transform = `translate(${-40*this.activeScreen}px)`
        })
    }

    onUrlHashChanged() {
        const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
        this.activeScreen = (newIndex < 0) ? 0 : newIndex;
        this.changePageDisplay();
        this.slider.style.width = this.width * this.screenElements.length + 'px';
    }

    changePageDisplay() {
        this.changeVisibilityDisplay();
        //this.changeActiveMenuItem();
        this.emitChangeDisplayEvent();
    }

    changeVisibilityDisplay() {
        this.screenElements.forEach((screen) => {
            screen.classList.add(`slider__item--hidden`);
            screen.classList.remove(`active`);
        });
        this.screenElements[this.activeScreen].classList.remove(`slider__item--hidden`);
        this.screenElements[this.activeScreen].classList.add(`active`);
    }

    changeActiveMenuItem() {
        const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
        if (activeItem) {
            this.menuElements.forEach((item) => item.classList.remove(`active`));
            activeItem.classList.add(`active`);
        }
    }

    emitChangeDisplayEvent() {
        const event = new CustomEvent(`screenChanged`, {
            detail: {
                'screenId': this.activeScreen,
                'screenName': this.screenElements[this.activeScreen].id,
                'screenElement': this.screenElements[this.activeScreen]
            }
        });

        document.body.dispatchEvent(event);
    }

    reCalculateActiveScreenPosition(delta) {
        if (delta > 0) {
            this.activeScreen = Math.min(this.screenElements.length - 1, ++this.activeScreen);
        } else {
            this.activeScreen = Math.max(0, --this.activeScreen);
        }
    }

    addListener() {
        window.addEventListener(`resize`,  () => {
            this.width = document.body.clientWidth;
            this.slider.style.width = this.width * this.screenElements.length + 'px';
        })
    }
}
