window.addEventListener('DOMContentLoaded', function() {

    // Tabs
    
	let tabs = document.querySelectorAll('.tabheader__item'),
		tabsContent = document.querySelectorAll('.tabcontent'),
		tabsParent = document.querySelector('.tabheader__items');

	function hideTabContent() {
        
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
	}

	function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }
    
    hideTabContent();
    showTabContent();

	tabsParent.addEventListener('click', function(event) {
		const target = event.target;
		if(target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
		}
    });
    
    // Timer

    const deadline = '2023-09-17';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor( (t/(1000*60*60*24)) ),
            seconds = Math.floor( (t/1000) % 60 ),
            minutes = Math.floor( (t/1000/60) % 60 ),
            hours = Math.floor( (t/(1000*60*60) % 24) );

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num){
        if (num >= 0 && num < 10) { 
            return '0' + num;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {

        const timer = document.querySelector(selector),
            days = timer.querySelector("#days"),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);

    // Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == "") {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) { 
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 300000);
    // Изменил значение, чтобы не отвлекало

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    window.addEventListener('scroll', showModalByScroll);

    // Используем классы для создание карточек меню

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH(); 
        }

        changeToUAH() {
            this.price = this.price * this.transfer; 
        }

        render() {
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.classes = "menu__item";
                element.classList.add(this.classes);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, ".menu .container").render();
            });
        });

    // getResource('http://localhost:3000/menu')
    //     .then(data => createCard(data));

    // function createCard(data) {
    //     data.forEach(({img, altimg, title, descr, price}) => {
    //         const element = document.createElement('div');

    //         element.classList.add("menu__item");

    //         element.innerHTML = `
    //             <img src=${img} alt=${altimg}>
    //             <h3 class="menu__item-subtitle">${title}</h3>
    //             <div class="menu__item-descr">${descr}</div>
    //             <div class="menu__item-divider"></div>
    //             <div class="menu__item-price">
    //                 <div class="menu__item-cost">Цена:</div>
    //                 <div class="menu__item-total"><span>${price}</span> грн/день</div>
    //             </div>
    //         `;
    //         document.querySelector(".menu .container").append(element);
    //     });
    // }

    // Forms

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        let res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });
    
        return await res.json();
    };

    async function getResource(url) {
        let res = await fetch(url);
    
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
    
        return await res.json();
    }

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);
        
            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    //Slider

    // Мой вариант:
    
    // const prevSlideBtn = document.querySelector('.offer__slider-prev');
    // const nextSlideBtn = document.querySelector('.offer__slider-next');
    // const currentSlideIndex = document.querySelector('#current');
    // const totalSlidesCounter = document.querySelector('#total');
    // const slides = document.querySelectorAll('.offer__slide');
    // const slidesArr = [...slides];
        

    // function showCurrentSlide() {
    //     const currentSlide = document.querySelector('.offer__slider-wrapper .show');
    //     if (slidesArr.indexOf(currentSlide) + 1 < 10) {
    //         currentSlideIndex.textContent = '0' + (slidesArr.indexOf(currentSlide) + 1)
    //     } else {
    //         currentSlideIndex.textContent = slidesArr.indexOf(currentSlide) + 1
    //     }
    //     if (slides.length < 10) {
    //         totalSlidesCounter.textContent = '0' + slides.length
    //     } else {
    //         totalSlidesCounter.textContent = slides.length
    //     }
    //     return currentSlide;
    // }

    // showCurrentSlide();

    // prevSlideBtn.addEventListener('click', (e) => {
    //     const curSlide = showCurrentSlide();
    //     if (slidesArr.indexOf(curSlide) === 0) {
    //         slides[slides.length - 1].classList.add('show');
    //         slides[slides.length - 1].classList.remove('hide');
    //         curSlide.classList.add('hide');
    //         curSlide.classList.remove('show');
    //     } else {
    //         slides[slidesArr.indexOf(curSlide) - 1].classList.add('show');
    //         slides[slidesArr.indexOf(curSlide) - 1].classList.remove('hide');
    //         curSlide.classList.add('hide');
    //         curSlide.classList.remove('show');
    //     }
    //     showCurrentSlide()
    // });

    // nextSlideBtn.addEventListener('click', () => {
    //     const curSlide = showCurrentSlide();
    //     if (slidesArr.indexOf(curSlide) === slides.length - 1) {
    //         slides[0].classList.add('show');
    //         slides[0].classList.remove('hide');
    //         curSlide.classList.add('hide');
    //         curSlide.classList.remove('show');
    //     } else {
    //         slides[slidesArr.indexOf(curSlide) + 1].classList.add('show');
    //         slides[slidesArr.indexOf(curSlide) + 1].classList.remove('hide');
    //         curSlide.classList.add('hide');
    //         curSlide.classList.remove('show');
    //     }
    //     showCurrentSlide()
    // })

    // Слайдер посложнее
    const prevSlideBtn = document.querySelector('.offer__slider-prev');
    const nextSlideBtn = document.querySelector('.offer__slider-next');
    const currentSlideIndex = document.querySelector('#current');
    const totalSlidesCounter = document.querySelector('#total');
    const slides = document.querySelectorAll('.offer__slide');
    const slidesWrappper = document.querySelector('.offer__slider-wrapper');
    const slidesField = document.querySelector('.offer__slider-inner');
    const sliderWrapper = document.querySelector('.offer__slider');
    const width = window.getComputedStyle(slidesWrappper).width;
    let slideIndex = 1;
    let offset = 0;

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';
    slidesWrappper.style.overflow = 'hidden';

    if(slides.length < 10) {
        totalSlidesCounter.textContent = `0${slides.length}`;
        currentSlideIndex.textContent = `0${slideIndex}`;
    } else {
        totalSlidesCounter.textContent = slides.length;
        currentSlideIndex.textContent = slideIndex;
    }
    
    slides.forEach(slide => {
        slide.style.width = width;
    })
    
    const dotsWrapper = document.createElement('ol'),
          dots = [];
    

    sliderWrapper.style.position = 'relative';
    dotsWrapper.classList.add('carousel-indicators');

    sliderWrapper.append(dotsWrapper);

    for(let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1)
        dot.classList.add('dot');
        if (i == 0) {
            dot.style.opacity = 1;
        }
        dotsWrapper.append(dot);
        dots.push(dot);
    }

    const slideIndexText = () => {
        if(slides.length < 10) {
            return currentSlideIndex.textContent = `0${slideIndex}`
        } else {
            return currentSlideIndex.textContent = slideIndex;
        }
    }

    const slideIndexChanger = () => {
        if(slideIndex == 1) {
            return slideIndex = slides.length;
        } else {
            return slideIndex --;
        }
    }

    nextSlideBtn.addEventListener('click' , () => {
        if(offset == +width.replace(/\D/g, '') * (slides.length  - 1)) {
            offset = 0;
        } else {
            offset += +width.replace(/\D/g, '');
        }
        slidesField.style.transform = `translateX(-${offset}px)`

        slideIndexChanger()

        slideIndexText();

        dots.forEach(dot => dot.style.opacity = .5);
        dots[slideIndex - 1].style.opacity = 1;
    })

    prevSlideBtn.addEventListener('click' , () => {
        if(offset == 0) {
            offset = +width.replace(/\D/g, '') * (slides.length  - 1)
        } else {
            offset -= +width.replace(/\D/g, '');
        }
        slidesField.style.transform = `translateX(-${offset}px)`

        slideIndexChanger();

        slideIndexText();

        dots.forEach(dot => dot.style.opacity = .5);
        dots[slideIndex - 1].style.opacity = 1;
    })

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex = slideTo;
            offset = +width.replace(/\D/g, '') * (slideTo  - 1)

            slidesField.style.transform = `translateX(-${offset}px)`;

        slideIndexText();

            dots.forEach(dot => dot.style.opacity = .5);
            dots[slideIndex - 1].style.opacity = 1;
        })
    })

    //Calc

    const result = document.querySelector('.calculating__result span');
    const chooseButtonsBlockSmall = document.querySelector('#gender');
    const smallButtons = document.querySelectorAll('#gender .calculating__choose-item');
    const chooseButtonsBlockBig = document.querySelector('.calculating__choose_big');
    const bigButtons = document.querySelectorAll('.calculating__choose_big .calculating__choose-item');
    const inputBlock = document.querySelector('.calculating__choose_medium');

    let sex, height, weight,  age, ratio;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }

    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(element => {
            element.classList.remove(activeClass);
            if (element.getAttribute('id') === localStorage.getItem('sex')) {
                element.classList.add(activeClass);
            }
            if (element.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                element.classList.add(activeClass);
            }
        });
    }

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    function calcTotal() {
        if(!sex || !height || !weight || !age || !ratio) {
            result.textContent = '____'
            return;
        };
        return sex === 'male' ? (88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio : (447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio
    }
    calcTotal();

    function activeButtonSwitcher(buttonsArr, e) {
        if(e.target.classList.contains('calculating__choose-item')) {
            buttonsArr.forEach(button => {
                button.classList.remove('calculating__choose-item_active');
            })
            e.target.classList.add('calculating__choose-item_active');
        }
    }

    chooseButtonsBlockSmall.addEventListener('click', (e) => {
        activeButtonSwitcher(smallButtons, e);
        sex = e.target.id;
        localStorage.setItem('sex', e.target.getAttribute('id'));
        if(!isNaN(calcTotal())) {
            result.textContent = calcTotal().toFixed(2);
        }
    })

    chooseButtonsBlockBig.addEventListener('click', (e) => {
        activeButtonSwitcher(bigButtons, e);
        ratio = e.target.getAttribute('data-ratio');
        localStorage.setItem('ratio', e.target.getAttribute('data-ratio'));
        if(!isNaN(calcTotal())) {
            result.textContent = calcTotal().toFixed(2);
        }
    })

    inputBlock.addEventListener('input', (e) => {
        if(e.target.value.match(/\D/g)) {
            e.target.style.border = '1px solid red';
        } else {
            e.target.style.border = 'none';

        }

        if(e.target.id === 'height') {
            height = +e.target.value;
        } else if (e.target.id === 'weight') {
            weight = +e.target.value;
        } else if (e.target.id === 'age') {
            age = +e.target.value;
        }
        if(!isNaN(calcTotal()) && calcTotal() !== 0) {
            result.textContent = calcTotal().toFixed(2);
        }
    })
});
