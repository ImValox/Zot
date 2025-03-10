var tl = new TimelineMax({ repeat: 2, repeatDelay: 3, delay: 2 });
var zotContainer = document.querySelector('.zot');
var allCards = document.querySelectorAll('.zot--card');

function initCards(card, index) {
  var newCards = document.querySelectorAll('.zot--card:not(.removed)');

  newCards.forEach(function (card, index) {
    card.style.zIndex = allCards.length - index;
    card.style.transform = 'scale(' + (20 - index) / 20 + ') translateY(-' + 15 * index + 'px)';
  });

  zotContainer.classList.add('loaded');
}

initCards();

allCards.forEach(function (el) {
  var hammertime = new Hammer(el);

  hammertime.on('pan', function (event) {
    el.classList.add('moving');
  });

  hammertime.on('pan', function (event) {
    var newCards = document.querySelectorAll('.zot--card');
    if ((newCards.length - 1) != document.querySelectorAll('.removed').length) {
      if (event.deltaX === 0) return;
      if (event.center.x === 0 && event.center.y === 0) return;

      zotContainer.classList.toggle('zot_love', event.deltaX > 0);
      zotContainer.classList.toggle('zot_nope', event.deltaX < 0);

      var xMulti = event.deltaX * 0.03;
      var yMulti = event.deltaY / 80;
      var rotate = xMulti * yMulti;

      event.target.style.transform = 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)';
    } else {
      event.target.style.pointerEvents = "none";
    }
  });

  hammertime.on('panend', function (event) {
    el.classList.remove('moving');
    zotContainer.classList.remove('zot_love');
    zotContainer.classList.remove('zot_nope');

    var moveOutWidth = document.body.clientWidth;
    var keep = Math.abs(event.deltaX) < 20;

    event.target.classList.toggle('removed', !keep);

    if (keep) {
      event.target.style.transform = '';
    } else {
      var endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth);
      var toX = event.deltaX > 0 ? endX : -endX;
      var endY = Math.abs(event.velocityY) * moveOutWidth;
      var toY = event.deltaY > 0 ? endY : -endY;
      var xMulti = event.deltaX * 0.03;
      var yMulti = event.deltaY / 80;
      var rotate = xMulti * yMulti;

      event.target.style.transform = 'translate(' + (toX / 5) + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + rotate + 'deg)';
      setTimeout(() => {
        el.classList.remove('removed');
        var xyz = el;
        el.remove();
        document.querySelector('.zot--cards').appendChild(xyz);
        initCards();
      }, 200);
    }
  });
});

tl.to(document.querySelector('.zot--card'), 0.3, { rotate: 60, opacity: 1, ease: Power1.easeOut });
tl.to(document.querySelector('.zot--card'), 0.6, { rotate: -70, opacity: 1, ease: Power1.easeOut });
tl.to(document.querySelector('.zot--card'), 0.6, { rotate: 60, opacity: 1, ease: Power1.easeOut });
tl.to(document.querySelector('.zot--card'), 0.3, { rotate: 0, opacity: 1, ease: Power1.easeOut });