// HERO

const hero = document.querySelector('.hero');
const heroTrees = document.querySelector('.hero__trees');
const clonedHeroTrees = heroTrees.cloneNode(true);
clonedHeroTrees.classList.add('hero__trees-normal');
hero.appendChild(clonedHeroTrees);



// MAIN BUTTONS

var themeColorsCount = 5
var mainButtons = document.querySelectorAll('.main-button');
var mainSlides = document.querySelectorAll('.main-slide');
var mainPrevSwipers = [];

function initMainPrevSwiper() {
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
    mainPrevSwipers.push(prevSwiper);
  }
}
initMainPrevSwiper();

mainButtons.forEach(function(button, index) {
  button.addEventListener('click', function(e) {
    const main = document.querySelector('.main');
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
    for (let i = 1; i < themeColorsCount + 1; i++) {
      const color = button.getAttribute(`c-${i}`);
      document.body.style.setProperty(`--c-${i}`, color);
    }
    scrollToMain();
    initSetlistEvents(index);
    initMainPrevSwiper();
  });
});
function scrollToMain() {
  const main = document.querySelector('.main');;
  main.scrollIntoView({behavior: 'smooth', block: 'start'});
}
// mainButtons[0].click();


function initSetlistEvents(i) {
  const activeSlide = document.querySelector('.main-slide.active');
  var setlistEvents = activeSlide.querySelectorAll('.setlist__event');
  setlistEvents.forEach((e) => { e.classList.remove('active') });
  setlistEvents[0].classList.add('active');

  
  setlistEvents.forEach((event, index) => {
    const setlistEventStartTime = event.querySelector('.setlist__event-start-time');
    const setlistEventName = event.querySelector('.setlist__event-name');
    const setlistEventBG = event.querySelector('.setlist__event-bg');
    const eventWidth = setlistEventStartTime.offsetWidth + parseInt(window.getComputedStyle(setlistEventStartTime, null).marginRight) + setlistEventName.offsetWidth + parseInt(window.getComputedStyle(event).padding) * 2.5;
    setlistEventBG.setAttribute('style', `width:${eventWidth}px`);

    event.addEventListener('click', function(e) {
      setlistEvents.forEach((e) => { e.classList.remove('active') });
      event.classList.add('active');
      if (mainPrevSwipers[i]) {
        mainPrevSwipers[i].slideTo(index);
      }
      const moreContainer = activeSlide.querySelectorAll('.setlist__event-more')[index];
      if (moreContainer) {
        const isActive = moreContainer.classList.contains('active');
        document.querySelectorAll('.setlist__event-more').forEach(function(container){
          container.classList.remove('active');
          container.style.maxHeight = 0;
        });
        if (!isActive) {
          moreContainer.classList.add('active');
          moreContainer.style.maxHeight = moreContainer.scrollHeight + parseInt(window.getComputedStyle(moreContainer).padding) + "px";
        };
      }
    });
    
  });
  setlistEvents[0].click();
}
setTimeout(() => {
  initSetlistEvents(0);
}, 0);

































































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