/*
  iCheck v0.7, http://git.io/uhUPMA
  ===================================
  Powerful jQuery plugin for checkboxes and radio buttons customization

  (c) 2013 by Damir Foy, http://damirfoy.com
  Released under MIT License
*/

(function($) {
  $.fn.iCheck = function(options) {
    if (/^(check|uncheck|disable|enable|update|destroy)$/.test(options)) {
      return this.each(function() {
        /destroy/.test(options) ? destroy($(this), 'is.Destroyed') : change($(this), true, options);
      });
    } else if (typeof options == 'object' || !options) {
      var ua = navigator.userAgent,
        defaults = {
          checkboxClass: 'icheckbox',
          radioClass: 'iradio',
          checkedClass: 'checked',
          disabledClass: 'disabled',
          hoverClass: 'hover',
          focusClass: 'focus',
          activeClass: 'active',
          labelHover: true,
          labelHoverClass: 'hover'
        },
        settings = $.extend({}, defaults, options),
        handle = /^(checkbox|radio)$/.test(settings.handle) ? ':' + settings.handle : ':checkbox, :radio',
        area = ('' + settings.increaseArea).replace('%', '') | 0;

      area < -50 && (area = -50);

      return this.each(function() {
        var tree = $(this).is(handle) ? $(this) : $(this).find(handle);

        tree.each(function() {
          destroy($(this));

          var node = this,
            id = node.id,
            layer = {
              position: 'absolute',
              top: -area + '%',
              left: -area + '%',
              display: 'block',
              width: 100 + (area * 2) + '%',
              height: 100 + (area * 2) + '%',
              margin: 0,
              padding: 0,
              background: '#fff',
              border: 0,
              opacity: 0
            },
            hide = /ipad|iphone|ipod|android|blackberry|windows phone|opera mini/i.test(ua) ? {position: 'absolute', visibility: 'hidden'} : area | 0 ? layer : {position: 'absolute', opacity: 0},
            className = node.type == 'checkbox' ? settings.checkboxClass : settings.radioClass,
            self = $(this).data('icheck', {style: $(this).attr('style'), options: settings}).css(hide),
            label = $('label[for=' + id + ']'),
            parent = self.wrap('<div class="' + className + '"/>').trigger('is.Created').parent().append(settings.insert),
            helper = $('<ins/>').css(layer).appendTo(parent).click(function() {
              self.click(), change(self, false, true);
            }),
            hover = settings.hoverClass,
            labelHover = settings.labelHoverClass,
            keyCache;

          settings.cursor == true && helper.css('cursor', 'pointer');
          settings.inheritClass == true && parent.addClass(node.className);
          settings.inheritID == true && id && parent.attr('id', 'icheck-' + id);
          parent.css('position') == 'static' && parent.css('position', 'relative');
          change(self, true, 'update');

          id && label.length && label.bind('click.df mouseenter.df mouseleave.df touchbegin.df touchend.df', function(event) {
            var type = event.type, item = $(this);

            if (type == 'click')
              event.preventDefault(), self.click(), change(self, false, true);
            else if (settings.labelHover == true && !node.disabled)
              /mouseenter|touchbegin/.test(type) ? (parent.addClass(hover), item.addClass(labelHover)) : (parent.removeClass(hover), item.removeClass(labelHover));
          });

          self.bind('focus.df blur.df keyup.df keydown.df keypress.df', function(event) {
            var type = event.type,
              key = event.keyCode || event.charCode || event.which,
              fallback = /MSIE [5-8]/.test(ua) ? type == 'keyup' && keyCache !== 'keypress' : type == 'keyup',
              condition = type == 'keypress' && key == 32;

            if (/focus|blur/.test(type))
              type == 'focus' ? parent.addClass(settings.focusClass) : parent.removeClass(settings.focusClass);
            else if (node.type == 'radio')
              (fallback ? change(self, true, 'update', true) : condition && !node.checked && on(self, false, parent, 'checked', true), keyCache = type);
            else if (node.type == 'checkbox' && condition)
              node.checked ? off(self, false, parent, 'checked', true) : on(self, false, parent, 'checked', true);
          });

          helper.bind('mousedown mouseup mouseout mouseenter mouseleave touchbegin touchend', function(event) {
            var type = event.type, toggle = /mousedown|mouseup|mouseout/.test(type) ? settings.activeClass : hover;

            if (node.disabled) return;
            /mousedown|mouseenter|touchbegin/.test(type) ? parent.addClass(toggle) : parent.removeClass(toggle);

            if (id && label.length && settings.labelHover == true && toggle == hover)
              /mouseleave|touchend/.test(type) ? label.removeClass(labelHover) : label.addClass(labelHover);
          });
        });
      });
    } else return this;
  };

  function change(input, direct, method, keyboard) {
    var node = input[0],
      parent = input.parent(),
      state = /disable|enable/.test(method) ? 'disabled' : 'checked',
      active = method == 'update' ? {checked: node.checked, disabled: node.disabled} : node[state];

    if (/^check|disable/.test(method) && !active)
      on(input, true, parent, state);
    else if (/uncheck|enable/.test(method) && active)
      off(input, true, parent, state);
    else if (method == 'update')
      for(var state in active) active[state] ? on(input, false, parent, state, keyboard) : off(input, false, parent, state, keyboard);
    else if (!direct) {
      method == true && !node.disabled && input.trigger('is.Clicked');
      active ? on(input, true, parent, state) : off(input, true, parent, state);
    }
  }

  function on(input, toggle, parent, state, keyboard) {
    toggle && (input[0][state] = true);

    if (parent.data(state) !== true) {
      if (state == 'checked' && input[0].type == 'radio' && input[0].name) {
        $('input[name=' + input[0].name + ']').each(function() {
          this !== input[0] && $(this).data('icheck') && off($(this), true, $(this).parent(), state);
        });
      }

      (toggle || keyboard) && input.trigger('is.Changed');
      toggle && input.trigger('is.' + state.replace('di', 'Di').replace('ch', 'Ch'));
      parent.data(state, true).addClass(getOption(input, state));
    }
  }

  function off(input, toggle, parent, state, keyboard) {
    var callback = state == 'disabled' ? 'Enabled' : 'Unchecked';

    toggle && (input[0][state] = false);

    if (parent.data(state) !== false) {
      (toggle || keyboard) && input.trigger('is.Changed');
      toggle && input.trigger('is.' + callback);
      parent.data(state, false).removeClass(getOption(input, state));
    }
  }

  function destroy(input, callback) {
    if (input.data('icheck')) {
      var id = input[0].id, label = $('label[for=' + id + ']');

      input.parent().html(input.attr('style', input.data('icheck').style || '').trigger(callback || ''));
      input.removeData('icheck').unbind('.df').unwrap();
      id && label.length && label.unbind('.df');
    }
  }

  function getOption(input, state) {
    if (input.data('icheck')) return input.data('icheck').options[state + 'Class'];
  }
})(jQuery);