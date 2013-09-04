/**
* @name jQuery.imageHover
* @version 1.1.0
* 
* This plugin does a simple fade of two elements, i.e. two images (using an automatic url generation for the hover image) or an image and a div on mouse hover.
* 
* 
*/
(function ($) {
    var ImageHoverFadeFx = function (element, options) {
        var selector = $(element);
        var isFading = false;
        var settings = {
            hoverImageClass: 'hoverImage',
            hoverImageFileNameTag: '_imgroll',
            hoverMarkup: '<div class="{hoverimage_class}"><img src="{hoverimage_src}" alt="" /></div>',
            hoverImageVersion: 0, // (0,1,2...) - change this value if you need to update cached images.
            containerClassAttr: 'rel', // if the image hover container is outside the selector element you can specify the hover container class in this attribute of the selector element.
            fadeSpeed: 150
        };

        var init = function () {
            if (options) {
                $.extend(settings, options);
            }

            selector.each(function () {
                createHoverContainer(getHoverDomElement($(this)));
            });

            activateFadeEffect();
        };
        
        var activateFadeEffect = function () {
            selector.hover(
                function () {
                    if (!isFading) {
                        isFading = true;
                        fadeIn(getHoverDomElement($(this)));
                    }
                },
                function () {
                    if (!isFading) {
                        isFading = true;
                        fadeOut(getHoverDomElement($(this)));
                    }
                }
            );
        };
        
        var createHoverContainer = function (domElement) {
            domElement.append(replaceTags(settings.hoverMarkup, domElement));
            if ($.browser.msie && isFullImageHover) { fadeIEFix(domElement.find('.' + settings.hoverImageClass)); }
        };

        var replaceTags = function (markUp, domElement) {
            if (isFullImageHover) {
                return markUp.replace('{hoverimage_class}', settings.hoverImageClass).replace('{hoverimage_src}', generateImageHoverPath(domElement.children('img').attr('src')));
            } else {
                return markUp.replace('{hoverimage_class}', settings.hoverImageClass);
            }
        };

        var getHoverDomElement = function (domElement) {
            if (typeof (domElement.attr(settings.containerClassAttr)) !== 'undefined') {
                return domElement.prev('.' + domElement.attr(settings.containerClassAttr));
            } else {
                return domElement;
            }
        };
        
        var fadeIn = function (domElement) {
            domElement.children('.' + settings.hoverImageClass).fadeIn(settings.fadeSpeed, isFading = false);
        };

        var fadeOut = function (domElement) {
            domElement.children('.' + settings.hoverImageClass).fadeOut(settings.fadeSpeed, isFading = false);
        };

        var isFullImageHover = function () {
            if (settings.hoverMarkup.indexOf('{hoverimage_src}') !== -1) {
                return true;
            }
            return false;
        };

        var generateImageHoverPath = function (src) {
            var regex = /(\w+:\/{2})?((?:\w+\.){2}\w+)?(\/?[\S]+\/|\/)?([\w\-]+)([\.]\w+)?(\?\S+)?/;

            var protocol = regex.exec(src)[1];
            var domain = regex.exec(src)[2];
            var path = regex.exec(src)[3];
            var fileName = regex.exec(src)[4];
            var extension = regex.exec(src)[5];

            var fullPath = protocol + domain + path + fileName + settings.hoverImageFileNameTag + extension;
            return fullPath + (settings.hoverImageVersion > 0 ? "?" + settings.hoverImageVersion : "");
        };

        var fadeIEFix = function (hoverImageDomElement) {
            hoverImageDomElement.show(0, function () { hoverImageDomElement.hide(0); }); // Fade works also the first time!
        };
        
        init();
    };

    $.fn.imageHover = function (options) {
        return this.each(function () {
            var element = $(this);

            if (element.data('imageHover')) { return; }

            var imageHover = new ImageHoverFadeFx(this, options);

            element.data('imageHover', imageHover);
        });
    };

})(jQuery);