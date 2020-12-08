ymaps.ready(init);

function init() {
  let myMap = new ymaps.Map("map", {
    center: [55.76, 37.64],
    zoom: 11,
    controls: [
      'zoomControl'
    ]
  });

  let placemarkCollections = {};
  let Collection = {};
  let markList = [
    {
      'type': 'Юр',
      'marks': [
        {'coordinates': [55.73561510548405, 37.6641147473601], 'name': 'юр лицо'},
        {'coordinates': [55.739295381660014, 37.63613394291676], 'name': 'юр лицо'},
        {'coordinates': [55.77335511470655, 37.60482437692399], 'name': 'юр лицо'},
        {'coordinates': [55.76638695237344, 37.50953308355355], 'name': 'юр лицо'},
        {'coordinates': [55.80206031882215, 37.51296475598528], 'name': 'юр лицо'}
      ]
    },
    {
      'type': 'Физ',
      'marks': [
        {'coordinates': [55.72532368326033, 37.748675112058876], 'name': 'физ лицо'},
        {'coordinates': [55.701677873469, 37.57358050756649], 'name': 'физ лицо'},
        {'coordinates': [55.7931639731915, 37.57132962414934], 'name': 'физ лицо'},
        {'coordinates': [55.8205056890601, 37.63155906117823], 'name': 'физ лицо'},
        {'coordinates': [55.755604564693655, 37.690151570912015], 'name': 'физ лицо'}
      ]
    }
  ];

  function createCollection(type = 'Vse') {
    for (let i = 0; i < markList.length; i++) {

      Collection = new ymaps.GeoObjectCollection();

      for (let c = 0; c < markList[i].marks.length; c++) {
        if (markList[i].type === type || type === 'Vse' ) {
          let markInfo = markList[i].marks[c];

          let placemark = new ymaps.Placemark(
              markInfo.coordinates,
              {
                hintContent: markInfo.name,
                balloonContent: markInfo.name
              }, {
                iconLayout: 'default#image',
                iconImageHref: './img/main-ico.svg',
                iconImageSize: [17, 24],
                iconImageOffset: [-16, -16],
              }
          );
          Collection.add(placemark);
        }
      }
      placemarkCollections[i] = Collection;
      myMap.geoObjects.add(Collection);
    }
  }

  createCollection();

  $('.map-filtr-btn').click(function () {
    myMap.geoObjects.removeAll();
    let type = $(this).data('target');
    $('.map-filtr-btn').each(function () {
      $(this).removeClass('active');
    });
    $(this).addClass('active');
    createCollection(type);
  });

}