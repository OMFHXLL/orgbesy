// HERO

function handleMarquee(){
  const marquee = document.querySelectorAll('.hero__marquee');
  let speed = 1;
  let lastScrollPos = 0;
  let timer;
  
  marquee.forEach(function(el){
    const container = el.querySelector('.inner');
    const content = el.querySelector('.inner > *');
    //Get total width
    const  elWidth = content.offsetWidth;
    
    
    // //Duplicate content
    // let clone = content.cloneNode(true);
    // container.appendChild(clone);
    
    let progress = 1;
    function loop(){
      progress = progress-speed;
      if(progress <= elWidth*-1) {progress=0;}
      let styles = window.getComputedStyle(container);
      container.style.transform = 'translateX(' + progress + 'px)';      
      window.requestAnimationFrame(loop);
    }
    loop();
  });
  
  window.addEventListener('scroll', function(){
    const maxScrollValue = 12;
    const newScrollPos = window.scrollY;
    let scrollValue = newScrollPos - lastScrollPos;
    
    
    if( scrollValue > maxScrollValue ) scrollValue = maxScrollValue;
    else if( scrollValue < -maxScrollValue ) scrollValue = -maxScrollValue;
    
    speed = scrollValue;
    
    clearTimeout(timer);
    timer = setTimeout(handleSpeedClear, 10);
  });
  
  function handleSpeedClear(){
    speed = 2;
  }
};
handleMarquee();


// const hero = document.querySelector('.hero');
// const heroTrees = document.querySelector('.hero__trees');
// const clonedHeroTrees = heroTrees.cloneNode(true);
// clonedHeroTrees.classList.add('hero__trees-normal');
// hero.appendChild(clonedHeroTrees);

// function heroAngle() {
//   // Получаем текущую высоту и ширину экрана в единицах viewport
//   const heroTreeLeft = document.getElementById('hero-tree-left');
//   const heroTreeRight = document.getElementById('hero-tree-right');
//   const screenWidthInVw = window.innerWidth / window.innerHeight * 100;
//   const screenHeightInVh = window.innerHeight / window.innerHeight * 100;
//   const heroTreeLeftOffset = (heroTreeLeft.clientHeight / 2) / window.innerHeight * 100 + 5;
//   const heroTreeRightOffset = (heroTreeRight.clientHeight / 2) / window.innerHeight * 100;
  
//   // Определяем координаты начала и конца линии в процентах от высоты и ширины экрана
//   const X1 = 0; // начало линии по оси X
//   const Y1 = 100 - heroTreeLeftOffset; // начало линии по оси Y (в процентах от высоты экрана)
//   const X2 = screenWidthInVw; // ширина экрана в vw
//   const Y2 = heroTreeRightOffset - 5; // конец линии по оси Y (в процентах от высоты экрана)
  
//   // Вычисляем координаты центра экрана
//   const Xc = (X1 + X2) / 2;
//   const Yc = (Y1 + Y2) / 2;
  
//   // Вычисляем угол между линией и осью X
//   const angle = Math.atan2(Y2 - Y1, X2 - X1) * (180 / Math.PI);
//   hero.style.cssText = `--hero-angle: ${angle}deg`;
// }
// heroAngle();








// MAIN BUTTONS

var themeColorsCount = 5
var mainButtons = document.querySelectorAll('.main-button');
var mainSlides = document.querySelectorAll('.main-slide');
var mainPrevSwipers = [];

function initMainPrevSwiper(index) {
  const prevSwiperContainer = document.querySelector('.main-slide.active .main-slide__side-prev');
  if (prevSwiperContainer) {
    const prevSwiper = new Swiper(prevSwiperContainer, {
      speed: 300,
      initialSlide: 0,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
    });
    mainPrevSwipers[index] = prevSwiper;
  }
}
initMainPrevSwiper(0);

mainButtons.forEach(function(button, index) {
  button.addEventListener('click', function(e) {
    if (!e.target.classList.contains('active')) {
      mainButtons.forEach((e) => {
        e.classList.remove('active');
      });
      mainSlides.forEach((e) => {
        e.classList.remove('active');
      });
      button.classList.add('active');
      if (mainSlides[index]) {
        mainSlides[index].classList.add('active');
      }
      setTimeout(() => {
        scrollToMain();
        initSetlistEvents(index);
      }, 20);
      for (let i = 1; i < themeColorsCount + 1; i++) {
        const color = button.getAttribute(`c-${i}`);
        document.body.style.setProperty(`--c-${i}`, color);
      }
      if (!mainPrevSwipers[index]) {
        initMainPrevSwiper(index);
      }
    } else {
      setTimeout(() => {
        scrollToMain();
        initSetlistEvents(index);
      }, 20);
    }
  });
});
function scrollToMain() {
  const main = document.querySelector('.main');
  main.scrollIntoView({behavior: 'smooth', block: 'start'});
}
// mainButtons[2].click();


function initSetlistEvents(i) {
  const activeSlide = document.querySelector('.main-slide.active');
  const setlistEvents = Array.from(activeSlide.querySelectorAll('.setlist__event'));

  setlistEvents.forEach((event) => {
    event.classList.remove('active');
  });
  setlistEvents[0].classList.add('active');

  setlistEvents.forEach((event, index) => {
    const setlistEventStartTime = event.querySelector('.setlist__event-start-time');
    const setlistEventName = event.querySelector('.setlist__event-name');
    const setlistEventBG = event.querySelector('.setlist__event-bg');
    const eventWidth = setlistEventStartTime.offsetWidth + 
      parseInt(window.getComputedStyle(setlistEventStartTime).marginRight) + 
      setlistEventName.offsetWidth + 
      parseInt(window.getComputedStyle(event).padding) * 2.5;
    setlistEventBG.style.width = eventWidth + 'px';

    event.addEventListener('click', function() {
      setlistEvents.forEach((e) => e.classList.remove('active'));
      event.classList.add('active');
      scrollToEvent(event);

      if (mainPrevSwipers[i]) {
        mainPrevSwipers[i].slideTo(index);
      }

      const prevDescription = activeSlide.querySelector('.main-slide__side-description');
      const moreContainer = activeSlide.querySelectorAll('.setlist__event-more')[index];
      const moreDescription = moreContainer.querySelector('.setlist__event-more-description');

      if (moreDescription && prevDescription.innerHTML !== moreDescription.innerHTML) {
        prevDescription.innerHTML = moreDescription.innerHTML;
      }

      document.querySelectorAll('.setlist__event-more').forEach(function(container) {
        container.classList.remove('active');
        container.style.maxHeight = 0;
      });

      if (moreContainer && window.innerWidth <= 960) {
        const main = document.querySelector('.main');
        const viewportHeight = window.innerHeight;
        const viewportTop = window.scrollY;
        const viewportBottom = viewportTop + viewportHeight;
        
        const mainRect = main.getBoundingClientRect();
        const mainTop = mainRect.top + window.scrollY;
        const mainBottom = mainRect.bottom + window.scrollY;
        
        const isVerticallyVisible = mainTop < viewportBottom && mainBottom > viewportTop;
        const isActive = moreContainer.classList.contains('active');
        if (!isActive && isVerticallyVisible) {
          moreContainer.classList.add('active');
          const newHeight = moreContainer.scrollHeight + 
          parseInt(window.getComputedStyle(moreContainer).padding) + 'px'
          moreContainer.style.maxHeight = newHeight;
          const scrollOffset = 80; // Отступ в 100px сверху
          setTimeout(() => {
            // Скроллируем страницу, чтобы контейнер был сверху с отступом
            const containerTop = moreContainer.getBoundingClientRect().top + window.scrollY;
            const scrollTo = containerTop - scrollOffset;
            window.scrollTo({ top: scrollTo, behavior: 'smooth' });
          }, 0);
        }
      }
    });
  });

  setTimeout(() => {
    setlistEvents[0].click();
  }, 20);
}
setTimeout(() => {
  initSetlistEvents(0);
}, 0);

const offsetTop = 100;

function scrollToEvent(event) {
  const eventTop = event.offsetTop;
  const scrollTop = window.scrollY;
  if (eventTop < offsetTop) {
    const scrollDistance = eventTop - offsetTop;
    const step = scrollDistance / 60; // 60 FPS

    function animateScroll() {
      if (eventTop < offsetTop) {
        window.scrollTo(0, scrollTop + (step > -2 ? -2 : step)); // Плавная прокрутка
        requestAnimationFrame(animateScroll);
      }
    }

    animateScroll();
  }
  // event.scrollIntoView({behavior: 'smooth', block: 'start'});
}

window.addEventListener('resize', () => {
  // heroAngle();
});































































// fetch('https://qtickets.ru/api/rest/v1/events', {
//   method: 'GET',
//   headers: {
//     'Accept': 'application/json',
//     'Cache-Control': 'no-cache',
//     'Content-Type': 'application/json',
//     'Authorization': 'Bearer N1qVERyyWhoyCKLWv3FVUjqZPjrqpA67'
//   }
// })
// .then(response => {
//   if (!response.ok) {
//     throw new Error('Network response was not ok');
//   }
//   return response.json();
// })
// .then(data => {
//   console.log(data);
// })
// .catch(error => {
//   console.error('There was a problem with the fetch operation:', error);
// });