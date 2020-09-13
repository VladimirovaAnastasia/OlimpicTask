import throttle from 'lodash/throttle';

export default class FullPageScroll {
    constructor() {
        this.THROTTLE_TIMEOUT = 2000;

        this.screenElements = document.querySelectorAll(`.slider__item`);
        this.slider = document.querySelector('.slider');
        this.width = (document.body.clientWidth > 1600) ? document.body.clientWidth : 1600;
        this.leafs = document.querySelectorAll('.leaf');
        this.menuElements = document.querySelectorAll(`.menu-nav .main-menu__main-text`);


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
        this.scrollAnimation(currentPosition)
    }

    scrollAnimation(currentPosition) {
        this.slider.style.transform = `translate(${-this.width*this.activeScreen}px)`;


        //Animation for leafs
        Array.from(this.leafs).forEach((elem) => {
            elem.style.transform = `translate(${-40*this.activeScreen}px)`
        });


        //Animation for video button
        const play_button = document.querySelector('.slider__video-icon');
        if (this.screenElements[this.activeScreen].id === 'my-greenfield') {
            play_button.style.left = `50%`
        } else if (this.screenElements[this.activeScreen].id === 'philosophy') {
            play_button.style.left = `100%`
        }


        //Animation for text appearance
        const current_content = this.screenElements[this.activeScreen].querySelector('.slider__content');
        current_content.style.transform = `translate(0px)`;


        //Animation for text
        const prev_text = this.screenElements[currentPosition].querySelector('.slider__text');
        if (prev_text && this.activeScreen > currentPosition) {
            prev_text.style.transform= `translate(-200px)`;
            setTimeout(() => {
                prev_text.style.transform= `translate(0)`
            }, 2000)
        }


        //Animation for last screen
        const finish_animation = document.querySelectorAll('.slider__item--animation');
        if (this.screenElements[this.activeScreen].id === 'new') {
            Array.from(finish_animation).forEach((item) => {
                item.style.transform = `translate(0px)`
            })
        } else {
            Array.from(finish_animation).forEach((item) => {
                item.style.transform = `translate(200px)`
            })
        }
    }

    onUrlHashChanged() {
        const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
        this.activeScreen = (newIndex < 0) ? 0 : newIndex;
        this.changePageDisplay();
        this.slider.style.width = this.width * this.screenElements.length + 'px';
    }

    changePageDisplay() {
        this.changeVisibilityDisplay();
        this.changeActiveMenuItem();
        this.emitChangeDisplayEvent();
        const $svg = document.querySelector('.main-logo');
        if (this.screenElements[this.activeScreen].id === 'intro') {
            $svg.classList.add('active')
        } else {
            if ($svg.classList.contains('active')) {
                $svg.classList.remove('active')
            }
        }
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
            this.width = (document.body.clientWidth > 1600) ? document.body.clientWidth : 1600;
            this.slider.style.width = this.width * this.screenElements.length + 'px';
        })
    }
}
