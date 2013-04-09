/*!
 * iCheck v0.8, http://git.io/uhUPMA
 * =================================
 * Powerful jQuery plugin for checkboxes and radio buttons customization.
 *
 * (c) 2013 Damir Foy, http://damirfoy.com
 * MIT Licensed
 */

(function($, _iCheck, _checkbox, _radio, _checked, _disabled, _type, _cursor) {

  // Create a plugin
  $.fn[_iCheck] = function(options) {

    // Cached vars
    var user = navigator.userAgent,
      handle = ':' + _checkbox + ', :' + _radio;

    // Check if we should operate with some method
    if (/^(check|uncheck|disable|enable|update|destroy)$/.test(options)) {

      // Find checkboxes and radio buttons
      return this.each(function() {
        var self = $(this),
          tree = self.is(handle) ? self : self.find(handle);

        tree.each(function() {
          self = $(this);

          if (options == 'destroy') {
            tidy(self, 'ifDestroyed');
          } else {
            operate(self, true, options);
          };
        });
      });

    // Customization
    } else if (typeof options == 'object' || !options) {

      //  Set some default options
      var defaults = {
          checkboxClass: 'i' + _checkbox,
          radioClass: 'i' + _radio,
          checkedClass: _checked,
          disabledClass: _disabled,
          hoverClass: 'hover',
          focusClass: 'focus',
          activeClass: 'active',
          labelHover: true,
          labelHoverClass: 'hover'
        },

        //  Check if any options were passed
        settings = $.extend(defaults, options),

        selector = settings.handle,
        hoverClass = settings.hoverClass,
        focusClass = settings.focusClass,
        activeClass = settings.activeClass,
        labelHover = !!settings.labelHover,
        labelHoverClass = settings.labelHoverClass,

        // Setup clickable area
        area = ('' + settings.increaseArea).replace('%', '') | 0;

      // Selector limit
      if (selector == _checkbox || selector == _radio) {
        handle = ':' + selector;
      };

      // Clickable area limit
      if (area < -50) {
        area = -50;
      };

      // Walk around the selector
      return this.each(function() {
        var self = $(this),
          tree = self.is(handle) ? self : self.find(handle);

        tree.each(function() {
          self = $(this);

          // If already customized
          tidy(self);

          var node = this,
            id = node.id,

            // Layer styles
            offset = -area + '%',
            size = 100 + (area * 2) + '%',
            layer = {
              position: 'absolute',
              top: offset,
              left: offset,
              display: 'block',
              width: size,
              height: size,
              margin: 0,
              padding: 0,
              background: '#fff',
              border: 0,
              opacity: 0
            },

            // Choose how to hide input
            hide = /ipad|iphone|ipod|android|blackberry|windows phone|opera mini/i.test(user) ? {
              position: 'absolute',
              visibility: 'hidden'
            } : area ? layer : {
              position: 'absolute',
              opacity: 0
            },

            // Get proper class
            className = node[_type] == _checkbox ? settings.checkboxClass : settings.radioClass,

            // Find assigned labels
            label = $('label[for="' + id + '"]').add(self.closest('label')),

            // Wrap input
            parent = self.wrap('<div class="' + className + '"/>').trigger('ifCreated').parent().append(settings.insert),

            // Layer addition
            helper = $('<ins class="' + _iCheck + '-helper"/>').css(layer).appendTo(parent);

          // Finalize customization
          self.data(_iCheck, {o: settings, s: self.attr('style')}).css(hide);
          !!settings.inheritClass && parent.addClass(node.className);
          !!settings.inheritID && id && parent.attr('id', _iCheck + '-' + id);
          parent.css('position') == 'static' && parent.css('position', 'relative');
          operate(self, true, 'update');

          // Label events
          if (label.length) {
            label.on('click.i mouseenter.i mouseleave.i touchbegin.i touchend.i', function(event) {
              var type = event[_type],
                item = $(this);

              // Do nothing if input is disabled
              if (!node[_disabled]) {

                // Click
                if (type == 'click') {
                  if (!(node[_type] == _radio && node[_checked])) {
                    operate(self, false, true);
                  };

                // Hover state
                } else if (labelHover) {
                  if (/ve|nd/.test(type)) {
                    // mouseleave|touchend
                    parent.removeClass(hoverClass);
                    item.removeClass(labelHoverClass);
                  } else {
                    parent.addClass(hoverClass);
                    item.addClass(labelHoverClass);
                  };
                };

                event.stopPropagation();
              };
            });
          };

          // Input events
          self.on('click.i focus.i blur.i keyup.i keydown.i keypress.i', function(event) {
            var type = event[_type],
              key = event.keyCode;

            // Click
            if (type == 'click') {
              return false;

            // Keydown
            } else if (type == 'keydown' && key == 32) {
              if (!(node[_type] == _radio && node[_checked])) {
                if (node[_checked]) {
                  off(self, _checked);
                } else {
                  on(self, _checked);
                };
              };

              return false;

            // Keyup
            } else if (node[_type] == _radio) {
              !node[_checked] && on(self, _checked);

            // Focus state
            } else if (/us|ur/.test(type)) {
              // focus|blur

              if (type == 'blur') {
                parent.removeClass(focusClass);
              } else {
                parent.addClass(focusClass);
              };
            };
          });

          // Helper events
          helper.on('click mousedown mouseup mouseover mouseout touchbegin touchend', function(event) {
            var type = event[_type],

              // mousedown|mouseup
              toggle = /wn|up/.test(type) ? activeClass : hoverClass;

            // Do nothing if input is disabled
            if (!node[_disabled]) {

              // Click
              if (type == 'click') {
                if (!(node[_type] == _radio && node[_checked])) {
                  operate(self, false, true);
                };

              // Active and hover states
              } else {

                // State is on
                if (/wn|er|in/.test(type)) {
                  // mousedown|mouseover|touchbegin
                  parent.addClass(toggle);

                // State is off
                } else {
                  parent.removeClass(toggle + ' ' + activeClass);
                };

                // Label hover
                if (label.length && labelHover && toggle == hoverClass) {
                  if (/ut|nd/.test(type)) {
                    // mouseout|touchend
                    label.removeClass(labelHoverClass);
                  } else {
                    label.addClass(labelHoverClass);
                  };
                };
              };

              return false;
            };
          });
        });
      });
    } else {
      return this;
    };
  };

  // Do something with inputs
  function operate(input, direct, method, keyboard) {
    var node = input[0];

      // disable|enable
      state = /le/.test(method) ? _disabled : _checked,
      active = method == 'update' ? {checked: node[_checked], disabled: node[_disabled]} : node[state];

    // Check and disable
    if (/^ch|di/.test(method) && !active) {
      on(input, state);

    // Uncheck and enable
    } else if (/^un|en/.test(method) && active) {
      off(input, state);

    // Update
    } else if (method == 'update') {

      // Both checked and disabled states
      for (var state in active) {
        if (active[state]) {
          on(input, state, true);
        } else {
          off(input, state, true);
        };
      };

    } else if (!direct) {

      // Helper or label was clicked
      input.trigger('ifClicked');

      // Toggle checked state
      if (active) {
        off(input, state);
      } else {
        on(input, state);
      };
    };
  };

  // Set checked or disabled state
  function on(input, state, keep) {
    var node = input[0],
      parent = input.parent(),
      remove = state == _disabled ? 'enabled' : 'un' + _checked,
      regular = option(input, remove + capitalize(node[_type])),
      specific = option(input, state + capitalize(node[_type]));

    // Prevent unnecessary actions
    if (node[state] !== true && !keep) {

      // Toggle state
      node[state] = true;

      // Trigger callbacks
      input.trigger('ifChanged').trigger('if' + capitalize(state));

      // Toggle assigned radio buttons
      if (state == _checked && node[_type] == _radio && node.name) {
        $('input[name="' + node.name + '"]').each(function() {
          if (this !== node && $(this).data(_iCheck)) {
            off($(this), state);
          };
        });
      };
    };

    // Add proper cursor
    if (node[_disabled] && !!option(input, _cursor, true)) {
      parent.find('.' + _iCheck + '-helper').css(_cursor, 'default');
    };

    // Add state class
    parent.addClass(specific || option(input, state));

    // Remove regular state class
    parent.removeClass(regular || option(input, remove) || '');
  };

  // Remove checked or disabled state
  function off(input, state, keep) {
    var node = input[0],
      parent = input.parent(),
      callback = state == _disabled ? 'enabled' : 'un' + _checked,
      regular = option(input, callback + capitalize(node[_type])),
      specific = option(input, state + capitalize(node[_type]));

    // Prevent unnecessary actions
    if (node[state] !== false && !keep) {

      // Toggle state
      node[state] = false;

      // Trigger callbacks
      input.trigger('ifChanged').trigger('if' + capitalize(callback));
    };

    // Add proper cursor
    if (!node[_disabled] && !!option(input, _cursor, true)) {
      parent.find('.' + _iCheck + '-helper').css(_cursor, 'pointer');
    };

    // Remove state class
    parent.removeClass(specific || option(input, state) || '');

    // Add regular state class
    parent.addClass(regular || option(input, callback));
  };

  // Remove all traces of iCheck
  function tidy(input, callback) {
    if (input.data(_iCheck)) {

      // Remove everything except input
      input.parent().html(input.attr('style', input.data(_iCheck).s || '').trigger(callback || ''));

      // Unbind events
      input.off('.i').unwrap();
      $('label[for="' + input[0].id + '"]').add(input.closest('label')).off('.i');
    };
  };

  // Get some option
  function option(input, state, regular) {
    if (input.data(_iCheck)) {
      return input.data(_iCheck).o[state + (regular ? '' : 'Class')];
    };
  };

  // Capitalize some string
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
})(jQuery, 'iCheck', 'checkbox', 'radio', 'checked', 'disabled', 'type', 'cursor');