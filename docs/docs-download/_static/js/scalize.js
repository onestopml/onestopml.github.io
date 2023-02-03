/*
MIT License

Copyright (c) 2017 Adam M Nurdin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function($) {
    "use strict";
    
    //----------------------------------------//
    // Variable
    //----------------------------------------//
    var variable = {
        width : 0,
        height : 0,
        cover_id: '',
        selector : '.item-point',
        styleSelector : 'circle',
        animationSelector : '',
        animationPopoverIn : '',
        animationPopoverOut : '', 
        onInit : null,
        getSelectorElement : null,
        getValueRemove : null
    }

    //----------------------------------------//
    // Scaling
    //----------------------------------------//
    var scaling = {
        settings : null,
        //----------------------------------------//
        // Initialize
        //----------------------------------------//
        init: function(el, options){
            console.log('el', el);
            console.log('el', el[0].id);
            this.settings = $.extend(variable, options);
            this.settings.cover_id = '#' + el[0].id
            this.settings.selector = this.settings.cover_id + ' > .item-point';
            console.log('settings', this.settings);
            this.event(el);            

            scaling.layout(el);
            $(window).on('load', function(){
                scaling.layout(el);
            });
            $(el).find('.target').on('load', function(){
                scaling.layout(el);
            });
            $(window).on('resize', function(){
                scaling.layout(el);
            });
        },

        //----------------------------------------//
        // Event
        //----------------------------------------//
        event : function(elem){
            // Set Style Selector
            if ( this.settings.styleSelector ) {
                $(this.settings.selector).addClass( this.settings.styleSelector );
            }

            // Set Animation
            if ( this.settings.animationSelector ) {
                if( this.settings.animationSelector == 'marker' ){
                    $(this.settings.selector).addClass( this.settings.animationSelector );
                    $(this.settings.selector).append('<div class="pin"></div>')
                    $(this.settings.selector).append('<div class="pulse"></div>')
                }else{
                    $(this.settings.selector).addClass( this.settings.animationSelector );
                }
            }

            // Event On Initialize
            if ( $.isFunction( this.settings.onInit ) ) {
                this.settings.onInit();
            }

            // Content add class animated element
            $(elem).find('.content').addClass('animated');

            // Wrapper selector
            $(this.settings.selector).wrapAll( "<div class='wrap-selector' />");

            this.settings.selector = this.settings.cover_id + ' > .wrap-selector > .item-point';

            // Event Selector
            $(this.settings.selector).each(function(){
                
                // Toggle
                $('.toggle', this).on('click', function(e){
                    e.preventDefault();
                    $(this).closest(scaling.settings.selector).toggleClass('active');

                    // Selector Click
                    var content = $(this).closest(scaling.settings.selector).data('popover'),
                        id = $(content);

                    if($(this).closest(scaling.settings.selector).hasClass('active') && !$(this).closest(scaling.settings.selector).hasClass('disabled')){
                        if ( $.isFunction( scaling.settings.getSelectorElement ) ) {
                            scaling.settings.getSelectorElement($(this).closest(scaling.settings.selector));
                        }
                        id.fadeIn();
                        scaling.layout(elem);
                        id.removeClass(scaling.settings.animationPopoverOut);
                        id.addClass(scaling.settings.animationPopoverIn);
                    }else{
                        if($.isFunction( scaling.settings.getValueRemove )){
                            scaling.settings.getValueRemove($(this).closest(scaling.settings.selector));
                        }
                        id.removeClass(scaling.settings.animationPopoverIn);
                        id.addClass(scaling.settings.animationPopoverOut);
                        id.delay(500).fadeOut();
                    }
                });

                // Exit
                var target = $(this).data('popover'),
                    idTarget = $(target);
                idTarget.find('.exit').on('click', function(e){
                    e.preventDefault();
                    // selector.removeClass('active');
                    $('[data-popover="'+ target +'"]').removeClass('active');
                    idTarget.removeClass(scaling.settings.animationPopoverIn);
                    idTarget.addClass(scaling.settings.animationPopoverOut);
                    idTarget.delay(500).fadeOut();
                });
            });
        },

        //----------------------------------------//
        // Layout
        //----------------------------------------//
        layout : function(elem){
            console.log('elem', elem);

            // Get Original Image
            var image = new Image();
            image.src = elem.find('.target').attr("src");

            // Variable
            var width = image.naturalWidth,
                height = image.naturalHeight,
                getWidthLess = $(elem).width(),
                getHeightLess = $(elem).height(),
                setPersenWidth = getWidthLess/width * 100,
                setHeight = height * setPersenWidth / 100;

            console.log('setHeight', setHeight)
            // Set Heigh Element
            $(elem).css("height", setHeight);

            $(elem).css("margin-bottom", elem.find('.caption').outerHeight(true));

            // Resize Width
            if( $(window).width() < width ){
                $(elem).stop().css("width","100%");
            }else{
                $(elem).stop().css("width",width);
            }

            // Set Position Selector
            console.log('this.settings.selector', $(this.settings.selector))
            $(this.settings.selector).each(function(){
                if( $(window).width() < width ){
                    var getTop = $(this).data("top") - ($(this).height()*100/getHeightLess)/2,
                        getLeft = $(this).data("left") - ($(this).width()*100/getWidthLess)/2;
                }else{
                    var getTop = $(this).data("top") - ($(this).height()*100/getHeightLess)/2,
                        getLeft = $(this).data("left") - ($(this).width()*100/getWidthLess)/2;
                }
                console.log('this', $(this))
                console.log(width, getTop, setPersenWidth, getWidthLess);
                $(this).css("top", getTop + "%");
                $(this).css("left", getLeft + "%");

                // Target Position
                var target = $(this).data('popover'),
                    allSize = $(target).find('.head').outerHeight() + $(target).find('.body').outerHeight() + $(target).find('.footer').outerHeight();
                $(target).css("left", getLeft + "px");
                $(target).css("height", allSize + "px");
                
                if($(target).hasClass('bottom')){
                    var getHeight = $(target).outerHeight(),
                        getTopBottom = getTop - getHeight;
                    $(target).css("top", getTopBottom + "px");
                }else if($(target).hasClass('center')){
                    var getHeight = $(target).outerHeight() * 0.50,
                        getTopBottom = getTop - getHeight;
                    $(target).css("top", getTopBottom + "px");
                }else{
                    $(target).css("top", getTop + "px");
                }
                
                $('.toggle', this).css('width', $(this).outerWidth());
                $('.toggle', this).css('height', $(this).outerHeight());
                
                // Toggle Size
                if($(this).find('.pin')){
                    var widthThis = $('.pin', this).outerWidth(),
                        heightThis = $('.pin', this).outerHeight();
                    
                    $('.toggle', this).css('width', widthThis);
                    $('.toggle', this).css('height', heightThis);                    
                }
            });
        }
        
    };

    //----------------------------------------//
    // Scalize Plugin
    //----------------------------------------//
    $.fn.scalize = function(options){
        return scaling.init(this, options);
    };

}(jQuery));
