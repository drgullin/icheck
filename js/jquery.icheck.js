/*
  iCheck v1.6, http://git.io/uhUPMA
  =================================
  Powerful jQuery plugin for checkboxes and radio buttons customization

  (c) 2013 by Damir Foy, http://damirfoy.com
  Released under MIT License
*/

(function($) {
  $.fn.iCheck = function(options) {
    if (/^Opera Mini$/i.test(navigator.userAgent))
      return this;
    else if (/^(check|uncheck|disable|enable|update|destroy)$/i.test(options)) {
      return this.each(function() {
        /^destroy$/i.test(options) ? destroy($(this), 'isDestroyed') : change($(this), true, options.toLowerCase());
      });
    } else if (typeof options == 'object' || !options) {
      var defaults = {
            checkboxClass: 'icheckbox',
            radioClass: 'iradio',
            checkedClass: 'checked',
            disabledClass: 'disabled',
            hoverClass: 'hover',
            focusClass: 'focus',
            activeClass: 'active'
          },
          settings = $.extend({}, defaults, options),
          handle = /^(checkbox|radio)$/i.test(settings.handle) ? ':' + settings.handle.toLowerCase() : ':checkbox, :radio',
          area = ('' + settings.increaseArea).replace('%', '') | 0;

      area < -50 && (area = -50);

      return this.each(function() {
        var tree = $(this).is(handle) ? $(this) : $(this).find(handle);

        tree.each(function() {
          destroy($(this));

          var self = $(this),
              className = this.type == 'checkbox' ? settings.checkboxClass : settings.radioClass,
              parent = self.data('style', self.attr('style')).css({
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

          settings.cursor == true && self.css('cursor', 'pointer');
          settings.inheritClass == true && parent.addClass(this.className);
          settings.inheritID == true && this.id && parent.attr('id', 'icheck-' + this.id);
          parent.css('position') == 'static' && parent.css('position', 'relative');
          change(self, true, 'update');

          self.trigger('isCreated').click(change).bind('focus blur mousedown mouseup mouseout mouseenter mouseleave touchbegin touchend', function(event) {
            var states = get_state(self, false), state = '', type = event.type;

            /^focus|blur$/i.test(type) && (state = states.focusClass + ' ');
            /^mouseenter|mouseleave|touchbegin|touchend$/i.test(type) && (state = states.hoverClass);
            /^blur|mousedown|mouseup|mouseout$/i.test(type) && (state += states.activeClass);
            /^blur|mouseup|mouseout|mouseleave|touchend$/i.test(type) ? parent.removeClass(state) : parent.addClass(state);
          });
        });
      });
    } else
      return this;
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
      if (!direct)
        input.trigger('isClicked'), active ? on(input, true, parent, state) : off(input, true, parent, state);
      else
        for(var state in active) active[state] ? on(input, false, parent, state) : off(input, false, parent, state);
    }
  }

  function on(input, toggle, parent, state) {
    toggle && (input[0][state] = true);

    if (parent.data(state) !== true) {
      if (state == 'checked' && input[0].type == 'radio' && input[0].name) {
        $('input[name=' + input[0].name + ']').each(function() {
          this !== input[0] && $(this).data('state') && off($(this), true, $(this).parent(), state);
        });
      }

      toggle && input.trigger('is' + state.replace('di', 'Di').replace('ch', 'Ch'));
      parent.data(state, true).addClass(get_state(input, state));
    }
  }

  function off(input, toggle, parent, state) {
    var callback = state == 'disabled' ? 'Enabled' : 'Unchecked';

    toggle && (input[0][state] = false);

    if (parent.data(state) !== false) {
      toggle && input.trigger('is' + callback);
      parent.data(state, false).removeClass(get_state(input, state));
    }
  }

  function destroy(input, callback) {
    if (input.data('state'))
      input.attr('style', input.data('style') || '').parent().html(input.trigger(callback || '')), input.removeData('state').unwrap();
  }

  function get_state(input, state) {
    if (input.data('state'))
      return state == false ? input.data('state') : input.data('state')[state + 'Class'];
  }
})(jQuery);