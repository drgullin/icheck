/*!
 * iCheck v2.0.0, http://git.io/arlzeA
 * ===================================
 * Cross-platform checkboxes and radio buttons customization
 *
 * (c) Damir Sultanov - http://fronteed.com
 * MIT Licensed
 */

(function(_win, _doc, _checkbox, _radio, _checked, _disabled, _determinate, _add, _remove, _class, _style, _length, $) {
  $ = _win.jQuery || _win.Zepto;

  // prevent multiple includes
  if (!_win['i' + _checked]) {
    _win['i' + _checked] = true;

    // basic options
    var base = $.extend({
      init: true, // auto init on domready
      ajax: false, // auto handle ajax loaded inputs

      // customization
      checkboxClass: 'i' + _checkbox,
      radioClass: 'i' + _radio,
      checkedClass: _checked,
      disabledClass: _disabled,
      indeterminateClass: 'in' + _determinate,
      hoverClass: 'hover',
      cursor: true,
      callbacks: {
        ifCreated: false
      },

      // input and label relation
      mirror: true,

      // closest parent iterations
      closest: 10,

      // default classes
      className: {
        div: '#-item', // {prefix}-item
        input: '#-node', // {prefix}-node
        label: '#-label' // {prefix}-label
      },

      // default styles
      style: {
        input: 'position:absolute!;display:block!;opacity:0!;z-index:-1!;', // input
        area: 'position:absolute;display:block;content:"";top:#;bottom:#;left:#;right:#;' // clickable area
      }
    }, _win.icheck); // extend global options

    // userAgent cache
    var ua = _win.navigator.userAgent;

    // classes cache
    var prefix = base[_class].prefix || 'icheck';
    var divClass = base[_class].div.replace('#', prefix);
    var nodeClass = base[_class].input.replace('#', prefix);
    var labelClass = base[_class].label.replace('#', prefix);

    // default filter
    var filter = 'input[type=' + _checkbox + '], input[type=' + _radio + ']';

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

    // data converter
    var converter = new RegExp(_checkbox + '|' + _radio + '|label|class|id', 'g');

    // styles options
    var styleTag;
    var styleList;
    var styleInput = base[_style].input;
    var styleArea = base[_style].area;

    // styles addition
    var style = function(rules, area) {

      // create container
      if (!styleTag) {
        styleTag = _doc.createElement(_style);

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
    base[_class] = base[_style] = false;

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
    var capitalize = function(string, position) {
      return position == 0 ? string : string.charAt(0).toUpperCase() + string.slice(1);
    };

    // traces remover
    var tidy = function(input, key, trigger, className, parent) {
      if (hashes[key]) {
        className = hashes[key][_class];
        parent = closest(input, 'div', className, true);
        input = $(input);

        // prevent overlapping
        if (parent) {
          input[_remove](nodeClass + ' ' + className).attr(_style, hashes[key][_style] || ''); // input
          parent.replaceWith(input); // styler
          $('label.' + className)[_remove](labelClass + ' ' + className); // label

          // callback
          if (trigger) {
            callback(input, key, trigger);
          }
        }

        // unset current key
        hashes[key] = false;
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
        var nodeString = node[_class];
        var nodeID = node.id;
        var nodeStyle = node.getAttribute(_style);
        var nodeTitle = node.title;
        var nodeType = node.type;
        var nodeAttr = node.attributes;
        var nodeAttrName;
        var nodeAttrLength = nodeAttr.length;
        var nodeAttrValue;
        var nodeData = {};
        var queryData = $.cache[node[$.expando]]; // jQuery cache
        var settings;
        var key = extract(nodeString);
        var keyClass;
        var input = $(node);
        var handle;
        var styler;
        var stylerClass;
        var stylerStyle;
        var area;
        var label;
        var labelString;
        var labelKey;
        var labels = [];
        var labelsLength;
        var labelDirect;
        var labelIndirect;

        // parse data attributes
        while (nodeAttrLength--) {
          nodeAttrName = nodeAttr[nodeAttrLength].name;

          if (~nodeAttrName.indexOf('data-')) {
            nodeAttrValue = nodeAttr[nodeAttrLength].value;

            if (nodeAttrValue == 'true' || nodeAttrValue == 'false') {
              nodeAttrValue = nodeAttrValue == 'true';
            }

            nodeData[nodeAttrName.substr(5).replace(converter, capitalize)] = nodeAttrValue;
          }
        }

        // merge options
        settings = $.extend({}, base, nodeData, queryData ? queryData.data : false, options);

        // handle option
        handle = settings.handle;

        if (handle !== 'checkbox' || handle !== 'radio') {
          handle = filter;
        }

        // prevent unwanted init
        if ((settings.init !== false || (ajax == true && settings.ajax == false) !== true) && ~handle.indexOf(nodeType)) {

          // tidy before processing
          if (key) {
            tidy(node, key);
          }

          // generate random key
          while(!hashes[key]) {
            key = Math.random().toString(36).substr(2, 5); // 5 symbols

            if (!hashes[key]) {
              keyClass = prefix + '[' + key + ']';
              break;
            }
          }

          // save settings
          settings[_style] = node.getAttribute(_style) || '';
          settings[_class] = keyClass;
          hashes[key] = settings;

          // prepare labels
          labelDirect = closest(node, 'label', '');
          labelIndirect = $('label[for="' + nodeID + '"]');

          if (labelDirect) {
            labels.push(labelDirect);
          }

          while (labelIndirect.length--) {
            label = labelIndirect[labelIndirect.length];

            if (label !== labelDirect) {
              labels.push(label);
            }
          }

          // loop through labels
          labelsLength = labels.length;

          while (labelsLength--) {
            label = labels[labelsLength];
            labelString = label[_class];
            labelKey = extract(labelString);

            // remove previous key
            if (labelKey) {
              labelString = labelString.replace(prefix + '[' + labelKey + ']', '');
            } else {
              labelString = labelClass + ' ' + labelString;
            }

            // add current key
            label[_class] = labelString + ' ' + keyClass;
          }

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
          styler[_class] = stylerClass;

          // set node's class
          node[_class] = nodeClass + ' ' + keyClass + (!!nodeString ? ' ' + nodeString : '');

          // inherit node's id
          if (!!settings.inheritId && !!nodeID) {
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
              styler[_style].position = 'relative';
            }
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

    // parent searcher
    var closest = function(node, tag, className, direct, count, parent) {
      count = direct ? 1 : base.closest;

      while (count-- && node.nodeType !== 9) {
        node = node.parentNode;

        if (node.tagName == tag.toUpperCase() && ~node[_class].indexOf(className)) {
          parent = node;
          break;
        }
      }

      return parent;
    };

    // bind label and styler
    $(_doc).on('click.i ' + hover + tap, 'label.' + labelClass + ', div.' + divClass, function(event) {
      var key = extract(this[_class]);

      if (key) {
        var emitter = event.type;
        var div = this.tagName == 'DIV';
        var className = hashes[key][_class];
        var states = [
          ['label', hashes[key].activeLabelClass, hashes[key].hoverLabelClass],
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
            $(this)[emitter == tapStart ? _add : _remove](states[0][1]);
          }

          // toggle partner's active class
          if (!!hashes[key].mirror && !!states[1][1]) {
            $(states[1][0] + '.' + className)[emitter == tapStart ? _add : _remove](states[1][1]);
          }

        // hover
        } else if (emitter == hoverStart || emitter == hoverEnd) {

          // toggle self's hover class
          if (!!states[0][2]) {
            $(this)[emitter == hoverStart ? _add : _remove](states[0][2]);
          }

          // toggle partner's hover class
          if (!!hashes[key].mirror && !!states[1][2]) {
            $(states[1][0] + '.' + className)[emitter == hoverStart ? _add : _remove](states[1][2]);
          }

        // click
        } else if (div) {

          // trigger input's click
          $(this).find('input.' + className).click();
        }
      }

    // bind input
    }).on('click.i change.i focusin.i focusout.i keyup.i keydown.i', 'input.' + nodeClass, function(event) {
      var key = extract(item[_class]);

      if (key) {
        var emitter = event.type;
        var className = hashes[key][_class];

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
          var states = [hashes[key].focusClass, hashes[key].focusLabelClass];

          // toggle parent's focus class
          if (!!states[0]) {
            $(this).closest('div.' + className)[emitter == 'focusin' ? _add : _remove](states[0]);
          }

          // toggle label's focus class
          if (!!hashes[key].mirror && !!states[1]) {
            $('label.' + className)[emitter == 'focusin' ? _add : _remove](states[1]);
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
        $('.' + prefix).icheck();
      }
    });

    // plugin definition
    $.fn.icheck = function(options, fire) {

      // methods
      if (/^(check|uncheck|toggle|indeterminate|determinate|disable|enable|update|refresh|destroy)$/.test(options)) {
        var elements = inspect(this);
        var element = elements.length;

        // loop through inputs
        while (element--) {
          var item = elements[element];
          var key = extract(item[_class]);

          if (key) {
            if (options == 'destroy') {
              tidy(item, key, 'ifDestroyed');
            } else {
              operate(item, key, true, options);
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
})(window, document, 'checkbox', 'radio', 'checked', 'disabled', 'determinate', 'addClass', 'removeClass', 'className', 'style', 'length');
