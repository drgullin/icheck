/*!
 * iCheck v2.0.0, http://git.io/arlzeA
 * ===================================
 * Cross-platform checkboxes and radio buttons customization
 *
 * (c) Damir Sultanov - http://fronteed.com
 * MIT Licensed
 */

(function($, _win, _doc, _icheck) {

  // prevent multiple includes
  if (!_win[_icheck + 'ed']) {
    _win[_icheck + 'ed'] = true;

    // basic options
    var base = $.extend({
      init: true, // auto init on domready
      ajax: false, // auto handle ajax loaded inputs

      // customization
      checkboxClass: 'icheckbox',
      radioClass: 'iradio',
      checkedClass: 'checked',
      disabledClass: 'disabled',
      hoverClass: 'hover',
      cursor: true,
      callbacks: {
        ifCreated: false
      },

      // input and label events relation
      couple: true,

      // default classes
      className: {
        prefix: _icheck,
        div: '#-item', // {prefix}-item
        node: '#-node', // {prefix}-node
        label: '#-label' // {prefix}-label
      },

      // default styles
      style: {
        input: 'position:absolute!;display:block!;opacity:0!;z-index:-1!;', // input
        area: 'position:absolute;display:block;content:"";top:#;bottom:#;left:#;right:#;' // clickable area
      }
    }, _win[_icheck]); // extend global options

    // userAgent cache
    var ua = _win.navigator.userAgent;

    // classes cache
    var prefix = base.className.prefix;
    var divClass = base.className.div.replace('#', prefix);
    var nodeClass = base.className.node.replace('#', prefix);
    var labelClass = base.className.label.replace('#', prefix);

    // default filter
    var filter = ':checkbox, :radio';

    // clickable areas container
    var areas = {};

    // hashes container
    var hashes = {};

    // hash recognizer
    var recognizer = new RegExp(prefix + '\\[(.*?)\\]');

    // hash extractor
    var extract = function(className, matches, value) {
      if (!!className) {
        matches = recognizer.exec(className);

        if (matches && hashes[matches[1]]) {
          value = matches[1];
        }
      }

      return value;
    }

    // styles options
    var styleTag;
    var styleList;
    var styleInput = base.style.input;
    var styleArea = base.style.area;

    // styles addition
    var style = function(rules, area) {

      // create container
      if (!styleTag) {
        styleTag = _doc.createElement('style');

        // append to header
        (_doc.head || _doc.getElementsByTagName('head')[0]).appendChild(styleTag);

        // webkit hack
        if (!_win.createPopup) {
          styleTag.appendChild(_doc.createTextNode(''));
        }

        styleList = styleTag.sheet ? styleTag.sheet : styleTag.styleSheet;
      }

      // choose selector
      var selector = 'div.' + (!!area ? prefix + '-area-' + area + ':after' : divClass + ' input.' + nodeClass);

      // append styles
      if (styleList.insertRule) {
        styleList.insertRule(selector + '{' + rules + '}', 0);
      } else {
        styleList.addRule(selector, rules, 0);
      }
    };

    // append input styles
    if (!!styleInput) {

      // legacy support for IE <= 7 (opacity replacement)
      if (/MSIE [5-7]/.test(ua)) {
        styleInput += 'visibility:hidden!;'
      }

      style(styleInput.replace(/!/g, ' !important'));
    }

    // remove init options
    delete base.className
    delete base.style

    // detect computed style support
    var computed = _win.getComputedStyle;

    // detect pointer events support
    var isPointer = _win.PointerEvent || _win.MSPointerEvent;

    // detect touch events support
    var isTouch = 'ontouchend' in _win;

    // detect mobile users
    var isMobile = /mobile|tablet|phone|ip(ad|od)|android|silk/i.test(ua);

    // setup events
    var mouse = ['mouse', 'down', 'up', 'over', 'out']; // bubbling hover
    var pointer = _win.PointerEvent ? ['pointer', 'down', 'up', 'over', 'out'] : ['MSPointer', 'Down', 'Up', 'Over', 'Out'];
    var touch = ['touch', 'begin', 'end'];
    var noMouse = (isTouch && isMobile) || isPointer;

    // choose events
    var hoverStart = noMouse ? (isTouch ? touch[0] + touch[1] : pointer[0] + pointer[3]) : mouse[0] + mouse[3];
    var hoverEnd = noMouse ? (isTouch ? touch[0] + touch[2] : pointer[0] + pointer[4]) : mouse[0] + mouse[4];
    var hover = hoverStart + '.i ' + hoverEnd + '.i ';
    var tapStart = noMouse ? (isTouch ? false : pointer[0] + pointer[1]) : mouse[0] + mouse[1];
    var tapEnd = noMouse ? (isTouch ? false : pointer[0] + pointer[2]) : mouse[0] + mouse[2];
    var tap = tapStart ? (tapStart + '.i ' + tapEnd + '.i') : '';

    // capitalizer
    var capitalize = function(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // traces remover
    var tidy = function(input, key, trigger, className, parent) {
      if (hashes[key]) {
        className = hashes[key].className;
        parent = input.parent('div.' + className);

        // needed on structure changes
        if (!parent.length) {
          parent = input.closest('div.' + className);
        }

        // prevent overlapping
        if (parent.length) {
          input.removeClass(nodeClass + ' ' + className).attr('style', hashes[key].style || ''); // input
          parent.replaceWith(input); // styler
          $('label.' + className).removeClass(labelClass + ' ' + className); // label

          // successful callback
          if (trigger) {
            callback(input, key, trigger);
          }
        }

        // unset current key
        delete hashes[key];
      }
    };

    // nodes inspector
    var inspect = function(object) {
      var stack = [];
      var direct = object.length;
      var indirect;

      // inspect object
      while (direct--) {
        var node = object[direct];

        // direct input
        if (node.type) {

          // checkbox or radio button
          if (~filter.indexOf(node.type)) {
            stack.push(node);
          }

        // indirect input
        } else {
          node = $(node).find(filter);
          indirect = node.length;

          while (indirect--) {
            stack.push(node[indirect]);
          }
        }
      }

      return stack;
    };

    // callbacks farm
    var callback = function(object, key, name) {

      // direct callback
      if (typeof hashes[key][name] === 'function') {
        hashes[key][name](object[0]);
      }

      // indirect callback
      if (!!hashes[key].callbacks && !!hashes[key].callbacks[name] !== false) {
        object.trigger(name);
      }
    };

    // selection processor
    var process = function(data, options, ajax) {

      // get inputs
      var elements = inspect(data);
      var element = elements.length;

      // loop through inputs
      while (element--) {
        var node = elements[element];
        var nodeString = node.className;
        var nodeID = node.id;
        var nodeStyle = node.style;
        var nodeTitle = node.title;
        var nodeType = node.type;
        var nodeAttr = node.attributes;
        var nodeAttrName;
        var nodeAttrLength = nodeAttr.length;
        var nodeData = {};
        var settings;
        var key = extract(nodeString);
        var keyClass;
        var input = $(node);
        var handle;

        // parse data attributes
        while (nodeAttrLength--) {
          nodeAttrName = nodeAttr[nodeAttrLength].name;

          if (~nodeAttrName.indexOf('data-')) {
            if (!nodeData.data) {
              nodeData.data = true;
            }

            nodeData[nodeAttrName.substring(5)] = nodeAttr[nodeAttrLength].value;
          }
        }

        // merge options
        if (nodeData.data) {
          settings = $.extend({}, base, nodeData, options);
        } else {
          settings = $.extend({}, base, options);
        }

        // handle option
        handle = settings.handle;

        if (handle !== 'checkbox' || handle !== 'radio') {
          handle = filter;
        }

        // prevent unwanted init
        if ((settings.init !== false || (ajax == true && settings.ajax == false) !== true) && ~handle.indexOf(nodeType)) {
          var styler;
          var stylerClass;
          var stylerStyle;
          var area;
          var labels;
          var labelCount;

          // tidy before processing
          if (key) {
            tidy(input, key);
          }

          // generate random key
          while(true) {
            key = Math.random().toString(36).substr(2, 5); // 5 symbols

            if (!hashes[key]) {
              keyClass = prefix + '[' + key + ']';
              break;
            }
          }

          // save settings
          if (!!nodeStyle) {
            settings.style = nodeStyle;
          }

          settings.className = keyClass;
          hashes[key] = settings;

          // prepare styler
          styler = _doc.createElement('div');
          stylerClass = nodeType == 'radio' ? settings.radioClass : settings.checkboxClass;

          // set styler's key
          stylerClass += ' ' + divClass + ' ' + keyClass;

          // append area styles
          area = ('' + settings.area).replace(/%|px|em|\+|-/g, '') | 0;

          if (!!area && !!styleArea && !areas[area]) {
            style(styleArea.replace(/#/g, '-' + area + '%'), area);

            stylerClass += ' ' + prefix + '-area-' + area;
            areas[area] = true;
          }

          // inherit node's class
          if (!!settings.inheritClass && !!nodeString) {
            stylerClass += ' ' + nodeString;
          }

          // set styler's class
          styler.className = stylerClass;

          // set node's class
          node.className = nodeClass + ' ' + keyClass + (!!nodeString ? ' ' + nodeString : '');

          // inherit node's id
          if (!!settings.inheritID && !!nodeID) {
            styler.id = prefix + '-' + nodeID;
          }

          // inherit node's title
          if (!!settings.inheritTitle && !!nodeTitle) {
            styler.title = nodeTitle;
          }

          // replace node
          node.parentNode.replaceChild(styler, node);

          // append node
          styler.appendChild(node);

          // append additions
          if (!!settings.insert) {
            styler.appendChild(settings.insert);
          }

          // set relative position
          if (!!area && !!styleArea) {

            // get styler's position
            if (computed) {
              stylerStyle = _win.getComputedStyle(styler, null).getPropertyValue('position');
            } else {
              stylerStyle = styler.currentStyle.position;
            }

            // set styler's position
            if (stylerStyle == 'static') {
              styler.style.position = 'relative';
            }
          }

          // prepare labels
          labels = $('label[for="' + nodeID + '"]').add(input.closest('label'));
          labelCount = labels.length;

          while (labelCount--) {
            var label = labels[labelCount];
            var labelString = label.className;
            var labelKey = extract(labelString);

            // remove previous key
            if (labelKey) {
              labelString = labelString.replace(prefix + '[' + labelKey + ']', '');
            } else {
              labelString = labelClass + ' ' + labelString;
            }

            // add current key
            label.className = labelClass + ' ' + keyClass;
          }

          // operate

          // ifCreated callback
          callback(input, key, 'ifCreated');



        }
      }
    };

    // operations center
    var operate = function() {

    };

    // bind label and styler
    $(_doc).on('click.i ' + hover + tap, 'label.' + labelClass + ', div.' + divClass, function(event) {
      var key = extract(this.className);

      if (key) {
        var emitter = event.type;
        var div = this.tagName == 'DIV';
        var className = hashes[key].className;
        var states = [
            ['label', hashes[key].labelActiveClass, hashes[key].labelHoverClass],
            ['div', hashes[key].activeClass, hashes[key].hoverClass]
        ];

        // reverse array
        if (div) {
          states.reverse();
        }

        // active
        if (emitter == tapStart || emitter == tapEnd) {

          // toggle self's active class
          if (!!states[0][1]) {
            $(this).toggleClass(states[0][1], emitter == tapStart);
          }

          // toggle partner's active class
          if (!!hashes[key].couple && !!states[1][1]) {
            $(states[1][0] + '.' + className).toggleClass(states[1][1], emitter == tapStart);
          }

        // hover
        } else if (emitter == hoverStart || emitter == hoverEnd) {

          // toggle self's hover class
          if (!!states[0][2]) {
            $(this).toggleClass(states[0][2], emitter == hoverStart);
          }

          // toggle partner's hover class
          if (!!hashes[key].couple && !!states[1][2]) {
            $(states[1][0] + '.' + className).toggleClass(states[1][2], emitter == hoverStart);
          }

        // click
        } else if (div) {

          // trigger input's click
          $(this).find('input.' + className).click();
        }
      }

    // bind input
    }).on('click.i change.i focusin.i focusout.i keyup.i keydown.i', 'input.' + nodeClass, function(event) {
      var key = extract(item.className);

      if (key) {
        var emitter = event.type;
        var className = hashes[key].className;

        // click
        if (emitter == 'click') {

          // prevent event bubbling to parent
          event.stopPropagation();

        // change
        } else if (emitter == 'change') {

          // don't update state on active radio
          if (!(this.checked && this.type == 'radio')) {
            // update state after
            // update(data, this.type)
          }

        // focusin or focusout
        } else if (/fo/.test(emitter)) {
          var states = [hashes[key].focusClass, hashes[key].labelFocusClass];

          // toggle parent's focus class
          if (!!states[0]) {
            $(this).closest('div.' + className).toggleClass(states[0], emitter == 'focusin');
          }

          // toggle label's focus class
          if (!!hashes[key].couple && !!states[1]) {
            $('label.' + className).toggleClass(states[1], emitter == 'focusin');
          }

        // keyup or keydown
        } else {

          // spacebar
          if (this.type == 'checkbox' && emitter == 'keydown' && event.keyCode == 32) {
            // update, event fired before state is changed

          };

          // arrow
          if (this.type == 'radio' && emitter == 'keyup') {
            // update, will be checked
          }
        }
      }

    // init on domready
    }).ready(function() {
      if (!!base.init) {
        $('.' + prefix)[_icheck]();
      }
    });

    // plugin definition
    $.fn[_icheck] = function(options, fire) {

      // methods
      if (/^(check|uncheck|toggle|indeterminate|determinate|disable|enable|update|destroy)$/.test(options)) {
        var elements = inspect(this);
        var element = elements.length;

        // loop through inputs
        while (element--) {
          var item = elements[element];
          var key = extract(item.className);

          if (key) {
            if (options == 'destroy') {
              tidy($(item), key, 'ifDestroyed');
            } else {
              operate($(item), key, true, options);
            }

            // callback
            if (typeof fire == 'function') {
              fire(item);
            }
          }
        }

      // basic setup
      } else if (typeof options == 'object' || !options) {
        process(this, options || {});
      }

      // chain
      return this;
    };
  }
})(jQuery, window, document, 'icheck');
