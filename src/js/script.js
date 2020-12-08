@@include('_jquery-2.2.4.min.js');
@@include('_map.js');
@@include('_slick.min.js');

$('.banner-block__slider').slick({
  infinite: false,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  dots: false,
  prevArrow: $('.ban-prev'),
  nextArrow: $('.ban-next'),
  speed: 1000,
  fade: true,
  cssEase: 'linear'
});

$('.vacancies__slider').slick({
  infinite: false,
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: true,
  dots: false,
  prevArrow: $('.vacancies-prev'),
  nextArrow: $('.vacancies-next'),
  responsive: [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: false
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        centerMode: true,
        centerPadding: '40px',
      }
    }
  ]
});