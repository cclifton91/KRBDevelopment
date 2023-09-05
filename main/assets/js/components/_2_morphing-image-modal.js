// File#: _2_morphing-image-modal
// Usage: codyhouse.co/license
(function() {
  var MorphImgModal = function(opts) {
    this.options = extendProps(MorphImgModal.defaults, opts);
    this.element = this.options.element;
    this.modalId = this.element.getAttribute('id');
    this.triggers = document.querySelectorAll('[aria-controls="'+this.modalId+'"]');
    this.selectedImg = false;
    // store morph elements
    this.morphBg = document.getElementsByClassName('js-morph-img-bg');
    this.morphImg = document.getElementsByClassName('js-morph-img-clone');
    // store modal content
    this.modalContent = this.element.getElementsByClassName('js-morph-img-modal__content');
    this.modalImg = this.element.getElementsByClassName('js-morph-img-modal__img');
    this.modalInfo = this.element.getElementsByClassName('js-morph-img-modal__info');
    // store close btn element
    this.modalCloseBtn = document.getElementsByClassName('js-morph-img-close-btn');
    // animation duration
    this.animationDuration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--morph-img-modal-transition-duration'))*1000 || 300;
    // morphing animation should run
    this.animating = false;
    this.reset = false;
    initMorphModal(this);
  };

  function initMorphModal(element) {
    if(element.morphImg.length < 1) return;
    element.morphEl = element.morphImg[0].getElementsByTagName('image');
    element.morphRect  = element.morphImg[0].getElementsByTagName('rect');
    initMorphModalMarkup(element);
    initMorphModalEvents(element);
  };

  function initMorphModalMarkup(element) {
    // append the clip path + <image> elements to use to morph the image
    element.morphImg[0].innerHTML = '<svg><defs><clipPath id="'+element.modalId+'-clip"><rect/></clipPath></defs><image height="100%" width="100%" clip-path="url(#'+element.modalId+'-clip)"></image></svg>';
  };

  function initMorphModalEvents(element) {
    // morph modal was open
    element.element.addEventListener('modalIsOpen', function(event){
      var target = event.detail.closest('[aria-controls="'+element.modalId+'"]');
      setModalImg(element, target);
      setModalContent(element, target);
      toggleModalCloseBtn(element, true);
    });

    // morph modal was closed
    element.element.addEventListener('modalIsClose', function(event){
      element.reset = false;
      element.animating = true;
      element.modalContent[0].classList.add('opacity-0');
      animateImg(element, false, function() {
        if(element.reset) return; // user opened a new modal before the animation was complete - no need to reset the modal
        element.selectedImg = false;
        resetMorphModal(element, false);
        element.animating = false;
      });
      toggleModalCloseBtn(element, false);
    });

    // close modal clicking on close btn
    if(element.modalCloseBtn.length > 0) {
      element.modalCloseBtn[0].addEventListener('click', function(event) {
        element.element.click();
      });
    }
  };

  function setModalImg(element, target) {
    if(!target) return;
    element.selectedImg = (target.tagName.toLowerCase() == 'img') ? target : target.querySelector('img');
    var src = element.selectedImg.getAttribute('data-modal-src') || element.selectedImg.getAttribute('src');
    // update url modal image + morph
    if(element.modalImg.length > 0) element.modalImg[0].setAttribute('src', src);
    element.morphEl[0].setAttribute('xlink:href', src);
    element.morphEl[0].setAttribute('href', src);
    element.reset = false;
    element.animating = true;  
    // wait for image to be loaded, then animate
    loadImage(element, src, function() {
      animateImg(element, true, function() {
        if(element.reset) return; // user closed the modal before the animation was complete - no need to reset the modal
        resetMorphModal(element, true);
        element.animating = false;
      });
    });
  };

  function loadImage(element, src, cb) {
    var image = new Image();
    var loaded = false;
    image.onload = function () {
      if(loaded) return;
      cb();
    }
    image.src = src;
    if(image.complete) {
      loaded = true;
      cb();
    }
  };

  function setModalContent(element, target) {
    // load the modal info details - using the searchData custom function the user defines
    if(element.modalInfo.length < 1) return;
    element.options.searchData(target, function(data){
      element.modalInfo[0].innerHTML = data;
      if(element.options.afterEnter) element.options.afterEnter(target, element.modalInfo[0]);
    });
  };

  function toggleModalCloseBtn(element, bool) {
    if(element.modalCloseBtn.length > 0) {
      element.modalCloseBtn[0].classList.toggle('morph-img-close-btn--is-visible', bool);
    }
  };

  function animateImg(element, isOpening, cb) {
    element.morphImg[0].classList.remove('is-hidden');

    var galleryImgRect = element.selectedImg.getBoundingClientRect(),
      modalImgRect = element.modalImg[0].getBoundingClientRect();

    runClipAnimation(element, galleryImgRect, modalImgRect, isOpening, cb);
  };

  function runClipAnimation(element, startRect, endRect, isOpening, cb) {
    // retrieve all animation params
    // main element animation (<div>)
    var elInitHeight = startRect.height,
      elIntWidth = startRect.width,
      elInitTop = startRect.top,
      elInitLeft = startRect.left;
    
    var elScale = Math.max(endRect.height/startRect.height, endRect.width/startRect.width);

    var elTranslateX = endRect.left - startRect.left + (endRect.width - startRect.width*elScale)*0.5,
      elTranslateY = endRect.top - startRect.top + (endRect.height - startRect.height*elScale)*0.5;

    // clip <rect> animation
    var rectScaleX = endRect.width/(startRect.width*elScale),
      rectScaleY = endRect.height/(startRect.height*elScale);

    element.morphImg[0].style = 'height:'+elInitHeight+'px; width:'+elIntWidth+'px; top:'+elInitTop+'px; left:'+elInitLeft+'px;';

    element.morphRect[0].setAttribute('transform', 'scale('+1+','+1+')');

    // init morph bg
    element.morphBg[0].style.height = startRect.height + 'px';
    element.morphBg[0].style.width = startRect.width + 'px';
    element.morphBg[0].style.top = startRect.top + 'px';
    element.morphBg[0].style.left = startRect.left + 'px';

    element.morphBg[0].classList.remove('is-hidden');
    
    animateRectScale(element, elInitHeight, elIntWidth, elScale, elTranslateX, elTranslateY, rectScaleX, rectScaleY, isOpening, cb);
  };

  function animateRectScale(element, height, width, elScale, elTranslateX, elTranslateY, rectScaleX, rectScaleY, isOpening, cb) {
    var isMobile = getComputedStyle(element.element, ':before').getPropertyValue('content').replace(/\'|"/g, '') == 'mobile';

    var currentTime = null,
      duration =  element.animationDuration;

    var startRect = element.selectedImg.getBoundingClientRect(),
      endRect = element.modalContent[0].getBoundingClientRect();
    
    var scaleX = endRect.width/startRect.width,
      scaleY = endRect.height/startRect.height;
  
    var translateX = endRect.left - startRect.left,
      translateY = endRect.top - startRect.top;

    var animateScale = function(timestamp){  
      if (!currentTime) currentTime = timestamp;         
      var progress = timestamp - currentTime;
      if(progress > duration) progress = duration;
      
      // main element values
      if(isOpening) {
        var elScalePr = Math.easeOutQuart(progress, 1, elScale - 1, duration),
        elTransXPr = Math.easeOutQuart(progress, 0, elTranslateX, duration),
        elTransYPr = Math.easeOutQuart(progress, 0, elTranslateY, duration);
      } else {
        var elScalePr = Math.easeOutQuart(progress, elScale, 1 - elScale, duration),
        elTransXPr = Math.easeOutQuart(progress, elTranslateX, - elTranslateX, duration),
        elTransYPr = Math.easeOutQuart(progress, elTranslateY, - elTranslateY, duration);
      }
      
      // rect values
      if(isOpening) {
        var rectScaleXPr = Math.easeOutQuart(progress, 1, rectScaleX - 1, duration),
          rectScaleYPr = Math.easeOutQuart(progress, 1, rectScaleY - 1, duration);
      } else {
        var rectScaleXPr = Math.easeOutQuart(progress, rectScaleX,  1 - rectScaleX, duration),
          rectScaleYPr = Math.easeOutQuart(progress, rectScaleY, 1 - rectScaleY, duration);
      }

      element.morphImg[0].style.transform = 'translateX('+elTransXPr+'px) translateY('+elTransYPr+'px) scale('+elScalePr+')';

      element.morphRect[0].setAttribute('transform', 'translate('+(width/2)*(1 - rectScaleXPr)+' '+(height/2)*(1 - rectScaleYPr)+') scale('+rectScaleXPr+','+rectScaleYPr+')');

      if(isOpening) {
        var valScaleX = Math.easeOutQuart(progress, 1, (scaleX - 1), duration),
          valScaleY = isMobile ? Math.easeOutQuart(progress, 1, (scaleY - 1), duration): rectScaleYPr*elScalePr,
          valTransX = Math.easeOutQuart(progress, 0, translateX, duration),
          valTransY = isMobile ? Math.easeOutQuart(progress, 0, translateY, duration) : elTransYPr + (elScalePr*height - rectScaleYPr*elScalePr*height)/2;
      } else {
        var valScaleX = Math.easeOutQuart(progress, scaleX, 1 - scaleX, duration),
          valScaleY = isMobile ? Math.easeOutQuart(progress, scaleY, 1 - scaleY, duration) : rectScaleYPr*elScalePr,
          valTransX = Math.easeOutQuart(progress, translateX, - translateX, duration),
          valTransY = isMobile ? Math.easeOutQuart(progress, translateY, - translateY, duration) : elTransYPr + (elScalePr*height - rectScaleYPr*elScalePr*height)/2;
      }

      // morph bg
      element.morphBg[0].style.transform = 'translateX('+valTransX+'px) translateY('+valTransY+'px) scale('+valScaleX+','+valScaleY+')';

      if(progress < duration) {
        window.requestAnimationFrame(animateScale);
      } else if(cb) {
        cb();
      }
    };
    
    window.requestAnimationFrame(animateScale);
  };
  
  function resetMorphModal(element, isOpening) {
    // reset modal at the end of an opening/closing animation
    element.modalContent[0].classList.toggle('opacity-0', !isOpening);
    element.modalInfo[0].classList.toggle('opacity-0', !isOpening);
    element.morphBg[0].classList.add('is-hidden');
    element.morphImg[0].classList.add('is-hidden');
    if(!isOpening) {
      element.modalImg[0].removeAttribute('src');
      element.modalInfo[0].innerHTML = '';
      element.morphEl[0].removeAttribute('xlink:href');
      element.morphEl[0].removeAttribute('href');
      element.morphBg[0].removeAttribute('style');
      element.morphImg[0].removeAttribute('style');
    }
  };

  var extendProps = function () {
    // Variables
    var extended = {};
    var deep = false;
    var i = 0;
    var length = arguments.length;
    // Check if a deep merge
    if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
      deep = arguments[0];
      i++;
    }
    // Merge the object into the extended object
    var merge = function (obj) {
      for ( var prop in obj ) {
        if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
        // If deep merge and property is an object, merge properties
          if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
            extended[prop] = extend( true, extended[prop], obj[prop] );
          } else {
            extended[prop] = obj[prop];
          }
        }
      }
    };
    // Loop through each object and conduct a merge
    for ( ; i < length; i++ ) {
      var obj = arguments[i];
      merge(obj);
    }
    return extended;
  };

  Math.easeOutQuart = function (t, b, c, d) {
    t /= d;
    t--;
    return -c * (t*t*t*t - 1) + b;
  };

  window.MorphImgModal = MorphImgModal;

  MorphImgModal.defaults = {
    element : '',
    searchData: false, // function used to return results
    afterEnter: false // function that runs after new content has been loaded
  };
}());