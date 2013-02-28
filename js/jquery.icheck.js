/*
    iCheck v1.4
    ===========
    http://github.com/damirfoy/icheck
    ---------------------------------
    Highly customizable jQuery plugin for checkboxes and radio buttons custom styling
    =========================
    Copyright 2013, Damir Foy
    Released under MIT License
*/

(function($) {
    $.fn.icheck = function(options) {
        var settings,
            defaults = {
                checkboxClass: 'icheckbox',
                radioClass: 'iradio',
                checkedClass: 'checked',
                disabledClass: 'disabled',
                hoverClass: 'hover',
                focusClass: 'focus',
                activeClass: 'active'
            },
            handle = ':checkbox, :radio',
            elements = this.is(handle) ? this : this.find(handle);

        if (/^Opera Mini$/i.test(navigator.userAgent))
            return elements;
        else if (/^(check|uncheck|disable|enable|update)$/i.test(options)) {
            return elements.each(function() {
                change($(this), true, options.toLowerCase());
            });
        } else if (typeof options == 'object' || !options) {
            settings = $.extend({}, defaults, options);

            var area = Math.abs(parseInt(settings.increaseArea, 10)),
                area = area && area < 51 && settings.increaseArea.toString().charAt(0) == '-' ? '-' + area : 0;

            /^(checkbox|radio)$/i.test(settings.handle) && (elements = elements.filter(':' + settings.handle.toLowerCase()));

            return elements.each(function() {
                $(this).data('state') && ($(this).parent().html($(this)), $(this).unwrap());

                var self = $(this),
                    className = (this.type == 'checkbox') ? settings.checkboxClass : settings.radioClass,
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
                change(self, true, 'update');

                self.trigger('this.created').click(change).bind('focus blur mousedown mouseup mouseout mouseenter mouseleave touchbegin touchend', function(event) {
                    var states = get_state(self, false), state, type = event.type;

                    type == 'focus' && (state = states.focusClass);
                    type == 'blur' && (state = states.focusClass + ' ' + states.activeClass);

                    /^mouseenter|mouseleave|touchbegin|touchend$/i.test(type) && (state = states.hoverClass);
                    /^mousedown|mouseup|mouseout$/i.test(type) && (state = states.activeClass);
                    /^blur|mouseup|mouseout|mouseleave|touchend$/i.test(type) ? parent.removeClass(state) : parent.addClass(state);
                });
            });
        } else
            return elements;
    };

    function change(input, direct, method) {
        !direct && (input = $(this));

        var parent = input.parent(),
            state = method == 'disable' || method == 'enable' ? 'disabled' : 'checked',
            active = method == 'update' ? {checked: input[0].checked, disabled: input[0].disabled} : input[0][state];

        if ((method == 'check' || method == 'disable') && !active)
            on(input, true, parent, state);
        else if ((method == 'uncheck' || method == 'enable') && active)
            off(input, true, parent, state);
        else if (method == 'update' || !direct) {
            if (!direct) {
                input.trigger('this.clicked');
                active ? on(input, true, parent, state) : off(input, true, parent, state);
            } else {
                for (var state in active)
                    active[state] ? on(input, false, parent, state) : off(input, false, parent, state);
            }
        }
    }

    function on(input, toggle, parent, state) {
        toggle && (input[0][state] = true);

        if (parent.data(state) !== true) {
            if (state == 'checked' && input[0].type == 'radio' && input[0].name) {
                $('input[name=' + input[0].name + ']').each(function() {
                    this !== input[0] && off($(this), true, $(this).parent(), state);
                });
            }

            toggle && input.trigger('this.' + state);
            parent.data(state, true).addClass(get_state(input, state));
        }
    }

    function off(input, toggle, parent, state) {
        var callback = state == 'disabled' ? 'enabled' : 'unchecked';

        toggle && (input[0][state] = false);

        if (parent.data(state) !== false) {
            toggle && input.trigger('this.' + callback);
            parent.data(state, false).removeClass(get_state(input, state));
        }
    }

    function get_state(input, state) {
        return state == false ? input.data('state') : input.data('state')[state + 'Class'];
    }
})(jQuery);