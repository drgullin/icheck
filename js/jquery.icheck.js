/*
    iCheck v1.1
    ===========
    http://github.com/damirfoy/icheck
    ---------------------------------
    Highly customizable jQuery plugin for checkboxes and radio buttons custom styling

    Options:
    -------
    {
        handle: '', // 'checkbox' or 'radio' to style only checkboxes or radio buttons, both by default
        checkboxClass: 'icheckbox', // checkboxes class name
        radioClass: 'iradio', // radio buttons class
        checkedClass: 'checked', // checked state class
        disabledClass: 'disabled', // disabled state class
        focusClass: 'focus', // focus state class
        increaseArea: '', // increase clickable area by given % (negative to decrease)
        cursor: false, // true to set hand cursor over input
        inheritClass: false, // set true to inherit input's class name
        inheritID: false, // if set to true, input's id is prefixed with 'icheck-' and attached
        insert: '' // add custom HTML code or text inside customized input
    }

        Note: you can choose any class names and slyle them as you want.

    Usage:
    -----
        iCheck supports direct and parent selectors, handles only checkboxes and radio buttons:

        $('body').icheck(); // customize all inputs on the page
        $('.block input').icheck(); // styling inputs only inside $('.block')
        $('input.vote').icheck(); // styling all inputs with the "vote" class

        Example:

        $(document).ready(function(){
            $('input').icheck({
                // options
            });

            // you can also change options after inputs are customized
            $('input.some').icheck({
                // different options (skin e.g.)
            });
        });

        Note: don't forget to include jQuery (version 1.6 or newer) and jquery.icheck.js (or jquery.icheck.min.js) in your HTML.

    Callbacks:
    ---------
        'this.clicked' event fires when user clicks on customized input (not used when you change it's state programatically)
        'this.checked' fires when input goes to 'checked' state
        'this.unchecked' fires when 'checked' state is removed
        'this.created' fires when input is created

        Use 'bind' (also 'live/delegate') or 'on' (modern jQuery versions) to attach them:

        $('input').bind('this.clicked', function(){
            console.log('input is clicked');
        });

        Note: 'this.created' callback should be binded before plugin init:

        $('input').bind('this.created', function(){
            console.log('input is created');
        }).icheck({
            // options
        });

    Methods:
    -------
    $('input').icheck('check'); // change input's state to 'checked'
    $('input').icheck('uncheck'); // remove 'checked' state
    $('input').icheck('update'); // apply input changes, which were done outside the plugin

    Browser support:
    ---------------
        Internet Explorer 7+ (works in IE6 if you don't use CSS class chaining)
        Firefox 2+
        Opera 9+
        Google Chrome
        Safari
        others

        Tested on mobile devices

    =========================
    Copyright 2013, Damir Foy
    Released under MIT License
*/

(function($){
    var settings,
        methods = {
            init: function(options){
                var defaults = {checkboxClass: 'icheckbox', radioClass: 'iradio', checkedClass: 'checked', disabledClass: 'disabled', focusClass: 'focus', activeClass: 'active'};
                settings = $.extend({}, defaults, options);
                var filter = (/^(checkbox|radio)$/i).test(settings.handle) ? ':' + settings.handle.toLowerCase() : ':checkbox, :radio',
                    area = (get_number(settings.increaseArea)) ? get_number(settings.increaseArea) : 0;

                area && (area < 51 && settings.increaseArea.toString().charAt(0) == '-') && (area = '-' + area);

                return this.each(function(){
                    var elements = $(this).is(filter) ? $(this) : $(this).find(filter);

                    elements.each(function(){
                        var self = $(this);
                        self.data('state') && (self.parent().html(self), self.unwrap());

                        var className = (this.type == 'checkbox') ? settings.checkboxClass : settings.radioClass,
                            parent = self.css({
                                position: 'absolute',
                                top: -area + '%',
                                left: -area + '%',
                                width: 100 + (area * 2) + '%',
                                height: 100 + (area * 2) + '%',
                                margin: 0,
                                padding: 0,
                                border: 0,
                                opacity: 0
                            }).data('state', settings).wrap('<div class="' + className + '"/>').parent().prepend(settings.insert);

                        settings.cursor == true && !this.disabled && self.css('cursor', 'pointer');
                        settings.inheritClass == true && parent.addClass(this.className);
                        settings.inheritID == true && this.id && parent.attr('id', 'icheck-' + this.id);
                        parent.css('position') == 'static' && parent.css('position', 'relative');

                        this.checked ? check(self, 'init') : uncheck(self, 'init');
                        this.disabled && parent.addClass(settings.disabledClass);

                        self.trigger('this.created').click(change).bind('focus blur mousedown mouseup mouseout touchbegin touchend', function(event){
                            var states = get_state(self, false), state, type = event.type;

                            type == 'focus' && (state = states.focusClass);
                            type == 'blur' && (state = states.focusClass + ' ' + states.activeClass);

                            (/^mousedown|mouseup|mouseout|touchbegin|touchend$/i).test(type) && (state = states.activeClass);
                            (/^blur|mouseup|mouseout|touchend$/i).test(type) ? parent.removeClass(state) : parent.addClass(state);
                        });
                    });
                });
            },
            check: function(){
                $(this).each(function(){
                    change('check', $(this));
                });
            },
            uncheck: function(){
                $(this).each(function(){
                    change('uncheck', $(this));
                });
            },
            update: function(){
                $(this).each(function(){
                    change('update', $(this));
                });
            }
        };

    $.fn.icheck = function(method){
        if (navigator.userAgent.indexOf('Opera Mini') > -1)
            return this;
        else if (methods[method])
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        else if (typeof method == 'object' || !method)
            return methods.init.apply(this, arguments);
    };

    function change(state, input){
        var direct = 'object' == typeof input,
            input = direct ? input : $(this),
            checked = input[0].checked;

        if (state == 'check' && !checked)
            check(input, true);
        else if (state == 'uncheck' && checked)
            uncheck(input, true);
        else if (state == 'update' || !direct){
            !direct && input.trigger('this.clicked');
            checked ? check(input) : uncheck(input);
        }
    }

    function check(input, state){
        var parent = input.parent();

        state == true && (input[0].checked = true);

        if (parent.data('checked') !== true){
            if (input[0].type == 'radio' && input[0].name){
                $('input[name=' + input[0].name + ']').each(function(){
                    this !== input[0] && uncheck($(this));
                });
            }

            state !== 'init' && input.trigger('this.checked');
            parent.data('checked', true).addClass(get_state(input, 'checked'));
        }
    }

    function uncheck(input, state){
        var parent = input.parent();

        state == true && (input[0].checked = false);

        if (parent.data('checked') !== false){
            state !== 'init' && input.trigger('this.unchecked');
            parent.data('checked', false).removeClass(get_state(input, 'checked'));
        }
    }

    function get_state(input, state){
        return state == false ? input.data('state') : input.data('state')[state + 'Class'];
    }

    function get_number(value){
        return Math.abs(parseInt(value, 10));
    }
})(jQuery);