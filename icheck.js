/*!
 * iCheck v2.0.0 beta, http://git.io/arlzeA
 * ========================================
 * Cross-platform checkboxes and radio buttons customization
 *
 * (c) Damir Sultanov - http://fronteed.com
 * MIT Licensed
 */

(function(_win, _doc, _icheck, _checkbox, _radio, _input, _label, _checked, _disabled, _determinate, _active, _focus, _hover, _append, _attr, _body, _callbacks, _class, _className, _click, _closest, _content, _create, _cursor, _data, _display, _div, _function, _getByTag, _iframe, _index, _length, _mirror, _pointer, _pointerEvent, _position, _remove, _replace, _style, _tag, _type, $) {
  $ = _win.jQuery || _win.Zepto;

  // prevent multiple includes
  if (!_win['i' + _checked]) {
    _win['i' + _checked] = function() {

      // methods cache
      var methods = [
        'un' + _checked, // 0
        'in' + _determinate, // 1
        'enabled', // 2
        'toggle', // 3
        'update', // 4
        'refresh', // 5
        'destroy' // 6
      ];

      // default options
      var base = {
        init: true, // auto init on domready
        ajax: true, // auto handle ajax loaded inputs
        fast: true // fastclick replacement
      };

      // customization class names
      base[_checkbox + _class] = 'i' + _checkbox; // checkboxClass = 'icheckbox'
      base[_radio + _class] = 'i' + _radio; // radioClass = 'iradio'
      base[_checked + _class] = _checked; // checkedClass = 'checked'
      base[_disabled + _class] = _disabled; // disabledClass = 'disabled'
      base[methods[1] + _class] = methods[1]; // indeterminateClass = 'indeterminate'
      base[_hover + _class] = _hover; // hoverClass = 'hover'
      base[_focus + _class] = _focus; // focusClass = 'focus'

      // cursor addition
      base[_cursor] = false;

      // ignored callbacks
      base[_callbacks] = {
        ifCreated: false
      };

      // relation between input and label
      base[_mirror] = false;

      // depth-limited search
      base[_closest] = {
        min: 3, // used to find input's styler
        max: 15 // used to find input's parent label and form
      };

      // directive class names
      base[_className] = {
        div: '#-item', // {prefix}-item
        area: '#-area-', // {prefix}-area-{value}
        input: '#-' + _input, // {prefix}-input
        label: '#-' + _label // {prefix}-label
      };

      // default styles
      base[_style] = {
        input: _position + ':absolute!;display:block!;outline:none!;opacity:0!;z-index:-99!;', // hidden input
        // input: _position + ':absolute!;' + _display + 'block!;outline:none!;', // hidden input
        area: _position + ':absolute;' + _display + 'block;' + _content + ':"";top:#;bottom:#;left:#;right:#;' // clickable area
      };

      // extend global options
      if (_win[_icheck]) {
        base = $.extend(base, _win[_icheck]);
      }

      // userAgent cache
      var ua = _win.navigator.userAgent;
      var ie8 = /MSIE 8/.test(ua);
      var ie7 = /MSIE [5-7]/.test(ua);

      // classes cache
      var prefix = base[_className].prefix || _icheck;
      var divClass = base[_className].div[_replace]('#', prefix);
      var areaClass = base[_className].area[_replace]('#', prefix);
      var nodeClass = base[_className][_input][_replace]('#', prefix);
      var labelClass = base[_className][_label][_replace]('#', prefix);
      var fastClass = !!_win.FastClick ? ' needs' + _click : '';

      // parent's selector iterations
      var closestMin = base[_closest].min;
      var closestMax = base[_closest].max;

      // default filter
      var filter = _input + '[type=' + _checkbox + '], input[type=' + _radio + ']';

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

      // data attributes converter
      var converter = new RegExp(_checkbox + '|' + _radio + '|class|id|' + _label, 'g');

      // methods parser = ^(checked|unchecked|indeterminate|determinate|disabled|enabled|toggle|update|refresh|destroy|data)$
      var parser = new RegExp('^(' + _checked + '|' + methods[0] + '|' + methods[1] + '|' + _determinate + '|' + _disabled + '|' + methods[2] + '|' + methods[3] + '|' + methods[4] + '|' + methods[5] + '|' + methods[6] + '|' + _data + ')$');

      // styles options
      var styleTag;
      var styleList;
      var styleInput = base[_style][_input];
      var styleArea = base[_style].area;

      // remove init options
      base[_className] = base[_style] = base[_closest] = false;

      // detect computed style support
      var computed = _win.getComputedStyle;

      // detect pointer events support
      var isPointer = _win[_pointerEvent] || _win['MS' + _pointerEvent];

      // detect touch events support
      var isTouch = 'ontouchend' in _win;

      // detect mobile users
      var isMobile = /mobile|tablet|phone|ip(ad|od)|android|silk/i.test(ua);

      // setup events
      var mouse = ['mouse', 'down', 'up', 'over', 'out']; // bubbling hover
      var pointer = _win[_pointerEvent] ? ['pointer', mouse[1], mouse[2], mouse[3], mouse[4]] : ['MSPointer', 'Down', 'Up', 'Over', 'Out'];
      var touch = ['touch', 'begin', 'end'];
      var noMouse = (isTouch && isMobile) || isPointer;

      // choose events
      var hoverStart = noMouse ? (isTouch ? touch[0] + touch[1] : pointer[0] + pointer[3]) : mouse[0] + mouse[3];
      var hoverEnd = noMouse ? (isTouch ? touch[0] + touch[2] : pointer[0] + pointer[4]) : mouse[0] + mouse[4];
      var hover = hoverStart + '.i ' + hoverEnd + '.i ';
      var tapStart = noMouse ? (isTouch ? false : pointer[0] + pointer[1]) : mouse[0] + mouse[1];
      var tapEnd = noMouse ? (isTouch ? false : pointer[0] + pointer[2]) : mouse[0] + mouse[2];
      var tap = tapStart ? (tapStart + '.i ' + tapEnd + '.i') : '';

      // styles addition
      var style = function(rules, selector, area) {
        if (!styleTag) {

          // create container
          styleTag = _doc[_create](_style);

          // append to header
          (_doc.head || _doc[_getByTag]('head')[0])[_append](styleTag);

          // webkit hack
          if (!_win.createPopup) {
            styleTag[_append](_doc.createTextNode(''));
          }

          styleList = styleTag.sheet || styleTag.styleSheet;
        }

        // choose selector
        if (!selector) {
          selector = _div + '.' + (area ? areaClass + area + ':after' : divClass + ' input.' + nodeClass);
        }

        // replace shorthand rules
        rules = rules[_replace](/!/g, ' !important');

        // append styles
        if (styleList.addRule) {
          styleList.addRule(selector, rules, 0);
        } else {
          styleList.insertRule(selector + '{' + rules + '}', 0);
        }
      };

      // append input's styles
      if (!!styleInput) {

        // opacity replacement for IE <= 8
        if (ie8 || ie7) {
          styleInput += 'clip:rect(' + (ie8 ? '0,0,0,0' : '0 0 0 0') + ')!;';
        }

        style(styleInput);
      }

      // append styler's styles
      if (isMobile && isTouch) {
        style(_cursor + ':' + _pointer + '!;', _div + '.' + divClass);
      }

      // append iframe's styles
      style(_display + 'none!;', _iframe + '.' + _icheck + '-' + _iframe);

      // capitalizer
      var capitalize = function(string, position) {
        return position == 0 ? string : string.charAt(0).toUpperCase() + string.slice(1);
      };

      // capitalized strings
      var capitalized = [
        capitalize(_checkbox), // 0, Checkbox
        capitalize(_radio), // 1, Radio
        capitalize(_label), // 2, Label
        capitalize(_checked), // 3, Checked
        capitalize(methods[0]), // 4, Unchecked
        capitalize(_disabled), // 5, Disabled
        capitalize(methods[2]), // 6, Enabled
        capitalize(methods[1]), // 7, Indeterminate
        capitalize(_determinate) // 8, Determinate
      ];

      // class toggler
      var toggle = function(node, className, status, currentClass, addClass, removeClass) {
        currentClass = node[_className];

        if (!!currentClass) {
          currentClass = ' ' + currentClass + ' ';

          // add class
          if (status == 0) {
            addClass = className;

          // remove class
          } else if (status == 1) {
            removeClass = className;

          // add and remove classes
          } else {
            addClass = className[0];
            removeClass = className[1];
          }

          // add class
          if (!!addClass && currentClass[_index](' ' + addClass + ' ') < 0) {
            currentClass += addClass + ' ';
          }

          // remove class
          if (!!removeClass && ~currentClass[_index](' ' + removeClass + ' ')) {
            currentClass = currentClass[_replace](' ' + removeClass + ' ', ' ');
          }

          // trim class
          currentClass = currentClass[_replace](/^\s+|\s+$/g, '');

          // update class
          node[_className] = currentClass;

          // return updated class
          return currentClass;
        }
      };

      // traces remover
      var tidy = function(node, key, trigger, className, parent, label, input) {
        if (hashes[key]) {
          className = hashes[key][_className];
          parent = closest(node, _div, className, closestMin);

          // prevent overlapping
          if (parent) {

            // remove classes from node
            toggle(node, nodeClass, 1);
            toggle(node, className, 1);

            // revert style attribute
            node['set' + _attr](_style, hashes[key][_style]);

            // find labels
            label = $(_label + '.' + hashes[key][_replace]);

            // loop through labels
            while (label[_length]--) {

              // remove classes from label
              toggle(label[label[_length]], labelClass, 1);
              toggle(label[label[_length]], className, 1);
            }

            // unwrap input (remove styler)
            $(parent)[_replace + 'With']($(node));

            // callback
            if (trigger) {
              callback(node, key, trigger);
            }
          }

          // unset current key
          hashes[key] = false;
        }
      };

      // nodes inspector
      var inspect = function(object) {
        var stack = [];
        var direct = object[_length];
        var indirect;

        // inspect object
        while (direct--) {
          var node = object[direct];

          // direct input
          if (node[_type]) {

            // checkbox or radio button
            if (~filter[_index](node[_type])) {
              stack.push(node);
            }

          // indirect input
          } else {
            node = $(node).find(filter);
            indirect = node[_length];

            while (indirect--) {
              stack.push(node[indirect]);
            }
          }
        }

        return stack;
      };

      // parent searcher
      var closest = function(node, tag, className, count, parent) {
        while (count-- && node.nodeType !== 9) {
          node = node.parentNode;

          if (node[_tag] == tag.toUpperCase() && ~node[_className][_index](className)) {
            parent = node;
            break;
          }
        }

        return parent;
      };

      // callbacks farm
      var callback = function(node, key, name) {

        // callbacks are allowed
        if (hashes[key][_callbacks] !== false) {

          // direct callback
          if (typeof hashes[key][_callbacks][name] == _function) {
            hashes[key][_callbacks][name](node);
          }

          // indirect callback
          if (!!hashes[key][_callbacks][name] !== false) {
            $(node).trigger(name);
          }
        }
      };

      // selection processor
      var process = function(data, options, ajax, silent) {

        // get inputs
        var elements = inspect(data);
        var element = elements[_length];

        // loop through inputs
        while (element--) {
          var node = elements[element];
          var nodeString = node[_className];
          var nodeID = node.id;
          var nodeStyle = node['get' + _attr](_style);
          var nodeTitle = node.title;
          var nodeType = node[_type];
          var nodeAttr = node.attributes;
          var nodeAttrLength = nodeAttr[_length];
          var nodeAttrName;
          var nodeAttrValue;
          var nodeData = {}; // data from attributes
          var nodeDataProperty;
          var queryData = $.cache[node[$.expando]]; // cached data
          var data = {}; // merged data
          var settings = {};
          var key = extract(nodeString);
          var keyClass;
          var handle;
          var styler;
          var stylerClass;
          var stylerStyle;
          var area;
          var label;
          var labelKey;
          var labelString;
          var labels = [];
          var labelsLength;
          var labelDirect;
          var labelIndirect;

          // parse data from attributes
          while (nodeAttrLength--) {
            nodeAttrName = nodeAttr[nodeAttrLength].name;

            if (~nodeAttrName[_index](_data + '-')) {
              nodeData[nodeAttrName.substr(5)] = nodeAttr[nodeAttrLength].value;
            }
          }

          // merge cached data attributes
          if (queryData && queryData[_data]) {
            nodeData = $.extend(nodeData, queryData[_data]);
          }

          // standardize merged data attributes
          for (nodeDataProperty in nodeData) {
            nodeAttrValue = nodeData[nodeDataProperty];

            if (nodeAttrValue == 'true' || nodeAttrValue == 'false') {
              nodeAttrValue = nodeAttrValue == 'true';
            }

            data[nodeDataProperty[_replace](converter, capitalize)] = nodeAttrValue;
          }

          // merge options
          settings = $.extend(settings, base, data, options);

          // handle filter
          handle = settings.handle;

          if (handle !== _checkbox && handle !== _radio) {
            handle = filter;
          }

          // prevent unwanted init
          if (settings.init !== false && ((ajax == true && settings.ajax == false) !== true) && ~handle[_index](nodeType)) {

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
            settings[_style] = nodeStyle || '';
            settings[_className] = keyClass;
            settings[_replace] = keyClass[_replace](/(\[|\])/g, '\\$1');
            hashes[key] = settings;

            // find labels
            labelDirect = closest(node, _label, '', closestMax);
            labelIndirect = $(_label + '[for="' + nodeID + '"]');

            if (labelDirect) {
              if (!!labelDirect.htmlFor == false && !!nodeID) {
                labelDirect.htmlFor = nodeID;
              }

              labels.push(labelDirect);
            }

            // merge labels
            while (labelIndirect[_length]--) {
              label = labelIndirect[labelIndirect[_length]];

              if (label !== labelDirect) {
                labels.push(label);
              }
            }

            // loop through labels
            labelsLength = labels[_length];

            while (labelsLength--) {
              label = labels[labelsLength];
              labelString = label[_className];
              labelKey = extract(labelString);

              // remove previous key
              if (labelKey) {
                labelString = toggle(label, prefix + '[' + labelKey + ']', 1);
              } else {
                labelString += ' ' + labelClass;
              }

              // update label's class
              label[_className] = labelString + ' ' + keyClass + fastClass;
            }

            // prepare styler
            styler = _doc[_create](_div);
            stylerClass = settings[nodeType + _class];

            // set styler's key
            stylerClass += ' ' + divClass + ' ' + keyClass;

            // append area styles
            area = ('' + settings.area)[_replace](/%|px|em|\+|-/g, '') | 0;

            if (area && !!styleArea && !areas[area]) {
              style(styleArea[_replace](/#/g, '-' + area + '%'), false, area);

              stylerClass += ' ' + areaClass + area;
              areas[area] = true;
            }

            // inherit node's class
            if (!!settings.inheritClass && !!nodeString) {
              stylerClass += ' ' + nodeString;
            }

            // update styler's class
            styler[_className] = stylerClass + fastClass;

            // update node's class
            node[_className] = (!!nodeString ? nodeString + ' ' : '') + nodeClass + ' ' + keyClass;

            // inherit node's id
            if (!!settings.inheritId && !!nodeID) {
              styler.id = prefix + '-' + nodeID;
            }

            // inherit node's title
            if (!!settings.inheritTitle && !!nodeTitle) {
              styler.title = nodeTitle;
            }

            // replace node
            node.parentNode[_replace + 'Child'](styler, node);

            // append node
            styler[_append](node);

            // append additions
            if (!!settings.insert) {
              styler[_append](settings.insert);
            }

            // set relative position
            if (!!area && !!styleArea) {

              // get styler's position
              if (computed) {
                stylerStyle = computed(styler, null).getPropertyValue(_position);
              } else {
                stylerStyle = styler.currentStyle[_position];
              }

              // update styler's position
              if (stylerStyle == 'static') {
                styler[_style][_position] = 'relative';
              }
            }

            // operate
            operate(node, styler, key, methods[4], true, false, true); // 'update' method

            // unset init option
            hashes[key].done = true;

            // ifCreated callback
            if (!silent) {
              callback(node, key, 'ifCreated');
            }
          }
        }
      };

      // operations center
      var operate = function(node, parent, key, method, silent, before, ajax) {
        var settings = hashes[key];
        var type = node[_type];
        var typeCapital = type == _radio ? capitalized[1] : capitalized[0];
        var states = {};
        var changes = {};
        var property;
        var value;
        var classes;
        var inputClass;
        var label;
        var labelClass = capitalized[2] + _class;
        var changed;
        var toggled;
        var form;
        var radios;
        var radiosLength;
        var radioSettings;
        var radioClasses;
        var radio;
        var radioKey;
        var radioClass;
        var radioParent;
        var radioLabel;

        // current states
        states[_checked] = [node[_checked], capitalized[3], capitalized[4]];

        if (!before) {
          states[_disabled] = [node[_disabled], capitalized[5], capitalized[6]];
          states[methods[1]] = [node['get' + _attr](methods[1]) == 'true' || !!node[methods[1]], capitalized[7], capitalized[8]];
        }

        // check parent
        if (!parent) {
          parent = closest(node, _div, settings[_className], closestMin);
        }

        if (settings && parent) {

          // 'update' method
          if (method == methods[4]) {
            changes[_checked] = states[_checked][0];
            changes[_disabled] = states[_disabled][0];
            changes[methods[1]] = states[methods[1]][0];

          // 'checked' or 'unchecked' method
          } else if (method == _checked || method == methods[0]) {
            changes[_checked] = method == _checked

          // 'disabled' or 'enabled' method
          } else if (method == _disabled || method == methods[2]) {
            changes[_disabled] = method == _disabled

          // 'indeterminate' or 'determinate' method
          } else if (method == methods[1] || method == _determinate) {
            changes[methods[1]] = method == methods[1];

          // 'toggle' method
          } else {
            changes[_checked] = before ? !settings[_checked] : !states[_checked][0];
          }

          // detect changes
          for (property in changes) {
            value = changes[property];

            // update node's property
            if (states[property][0] !== value && method !== methods[4] && !before) {
              node[property] = value;
            }

            // update ajax attributes
            if (ajax) {
              if (value) {
                node['set' + _attr](property, property == methods[1] ? 'true' : property);
              } else {
                node[_remove + _attr](property);
              }
            }

            // update key's property
            if (settings[property] !== value) {
              settings[property] = value;
              changed = true;

              if (property == _checked) {
                toggled = true;

                // checked radio
                if (value && (!!hashes[key].done || ajax) && type == _radio && !!node.name) {
                  form = closest(node, 'form', '', closestMax);
                  radios = _input + '[name="' + node.name + '"]';
                  radios = form && !ajax ? $(form).find(radios) : $(radios);
                  radiosLength = radios[_length];

                  while (radiosLength--) {
                    radio = radios[radiosLength];
                    radioKey = extract(radio[_className]);
                    radioSettings = hashes[radioKey];

                    // toggle radios
                    if (node !== radio && radioSettings) {
                      if (radio[_checked]) {
                        radio[_checked] = false;
                        radioSettings[_checked] = false;
                      }

                      // cache radio classes
                      radioClasses = [
                        radioSettings[property + _class], // 0, checkedClass
                        radioSettings[property + typeCapital + _class], // 1, checkedRadioClass

                        radioSettings[states[property][1] + _class], // 2, uncheckedClass
                        radioSettings[states[property][1] + typeCapital + _class], // 3, uncheckedRadioClass

                        radioSettings[property + labelClass] // 4, checkedLabelClass
                      ];

                      // false = [addClass, removeClass]
                      radioClass = [radioClasses[3] || radioClasses[2], radioClasses[1] || radioClasses[0]];

                      // update radio parent's class
                      radioParent = closest(radio, _div, radioSettings[_className], closestMin);

                      if (radioParent) {
                        toggle(radioParent, radioClass);
                      }

                      // update radio labels's class
                      if (!!radioSettings[_mirror] && !!radioClasses[4]) {
                        radioLabel = $(_label + '.' + radioSettings[_replace]);

                        while (radioLabel[_length]--) {
                          toggle(radioLabel[radioLabel[_length]], radioClasses[4], 1);
                        }
                      }

                      // radio callbacks
                      if (!silent) {
                        callback(radio, radioKey, 'if' + states[property][2]);
                        callback(radio, radioKey, 'ifChanged');
                        callback(radio, radioKey, 'ifToggled');
                      }

                      // update settings
                      hashes[radioKey] = radioSettings;
                    }
                  }
                }
              }

              // cache classes
              classes = [
                settings[property + _class], // 0, checkedClass
                settings[property + typeCapital + _class], // 1, checkedCheckboxClass

                settings[states[property][1] + _class], // 2, uncheckedClass
                settings[states[property][1] + typeCapital + _class], // 3, uncheckedCheckboxClass

                settings[property + labelClass] // 4, checkedLabelClass
              ];

              // false = [addClass, removeClass]
              inputClass = [classes[3] || classes[2], classes[1] || classes[0]];

              // true = [addClass, removeClass]
              if (value) {
                inputClass.reverse();
              }

              // update parent's class
              toggle(parent, inputClass);

              // update labels's class
              if (!!settings[_mirror] && !!classes[4]) {
                label = $(_label + '.' + settings[_replace]);

                while (label[_length]--) {
                  toggle(label[label[_length]], classes[4], value ? 0 : 1);
                }
              }

              // callback
              if (!silent) {
                callback(node, key, 'if' + states[property][value ? 1 : 2]);
              }
            }
          }

          // additional callbacks
          if (!silent) {
            if (changed) {
              callback(node, key, 'ifChanged');
            }

            if (toggled) {
              callback(node, key, 'ifToggled');
            }
          }

          // cursor addition
          if (!!settings[_cursor] && !isMobile) {

            // 'pointer' for enabled
            if (!settings[_disabled] && !settings[_pointer]) {
              parent[_style][_cursor] = _pointer;
              settings[_pointer] = true;

            // 'default' for disabled
            } else if (settings[_disabled] && settings[_pointer]) {
              parent[_style][_cursor] = 'default';
              settings[_pointer] = false;
            }
          }

          // update settings
          hashes[key] = settings;
        }
      };

      // bind label and styler
      $(_doc).on(_click + '.i ' + hover + tap, _label + '.' + labelClass + ', div.' + divClass, function(event) {
        var self = this;
        var key = extract(self[_className]);

        if (key) {
          var emitter = event[_type];
          var div = self[_tag] == 'DIV';
          var className = hashes[key][_replace]; // escaped class name
          var target;
          var partner;
          var activate;
          var states = [
            [
              _label,
              hashes[key][_active + capitalized[2] + _class], // activeLabelClass
              hashes[key][_hover + capitalized[2] + _class] // hoverLabelClass
            ],
            [
              _div,
              hashes[key][_active + _class], // activeClass
              hashes[key][_hover + _class] // hoverClass
            ]
          ];

          // reverse array
          if (div) {
            states.reverse();
          }

          // active state
          if (emitter == tapStart || emitter == tapEnd) {

            // toggle self's active class
            if (!!states[0][1]) {
              toggle(self, states[0][1], emitter == tapStart ? 0 : 1);
            }

            // toggle partner's active class
            if (!!hashes[key][_mirror] && !!states[1][1]) {
              partner = $(states[1][0] + '.' + className);

              while (partner[_length]--) {
                toggle(partner[partner[_length]], states[1][1], emitter == tapStart ? 0 : 1);
              }
            }

            // fastclick
            if (div && emitter == tapEnd && isPointer && !!hashes[key].uber) {
              activate = true;
            }

          // hover state
          } else if (emitter == hoverStart || emitter == hoverEnd) {

            // toggle self's hover class
            if (!!states[0][2]) {
              toggle(self, states[0][2], emitter == hoverStart ? 0 : 1);
            }

            // toggle partner's hover class
            if (!!hashes[key][_mirror] && !!states[1][2]) {
              partner = $(states[1][0] + '.' + className);

              while (partner[_length]--) {
                toggle(partner[partner[_length]], states[1][2], emitter == hoverStart ? 0 : 1);
              }
            }

            // fastclick
            if (div && emitter == hoverEnd && isTouch && isMobile && !!hashes[key].uber) {
              activate = true;
            }

          // click
          } else if (div) {
            if (!noMouse || !hashes[key].uber) {
              activate = true;
            }
          }

          // trigger input's click
          if (activate && div) {

            // currentTarget hack
            setTimeout(function() {
              target = event.currentTarget || {};

              if (target[_tag] !== 'LABEL') {
                $(self).find(_input + '.' + className)[_click]();
              }
            }, 2);
          }
        }

      // bind input
      }).on(_click + '.i focusin.i focusout.i keyup.i keydown.i', _input + '.' + nodeClass, function(event) {
        var self = this;
        var key = extract(self[_className]);

        if (key) {
          var emitter = event[_type];
          var className = hashes[key][_replace]; // escaped class name
          var parent = closest(self, _div, hashes[key][_className], closestMin);
          var label;
          var states;

          // click
          if (emitter == _click) {

            // prevent event bubbling to parent
            event.stopPropagation();

            // detect changes
            if (parent && !self[_disabled] && !(self[_checked] && self[_type] == _radio)) {

              // event fired before state is changed
              operate(self, parent, key, methods[3], false, true); // 'toggle' method
            }

          // focus state
          } else if (~emitter[_index](_focus)) {
            states = [
              hashes[key][_focus + _class], // focusClass,
              hashes[key][_focus + capitalized[2] + _class] // focusLabelClass
            ];

            // toggle parent's focus class
            if (!!states[0] && parent) {
              toggle(parent, states[0], emitter == _focus + 'in' ? 0 : 1);
            }

            // toggle label's focus class
            if (!!hashes[key][_mirror] && !!states[1]) {
              label = $(_label + '.' + className);

              while (label[_length]--) {
                toggle(label[label[_length]], states[1], emitter == _focus + 'in' ? 0 : 1);
              }
            }

          // keyup or keydown
          } else if (parent && !self[_disabled]) {

            // spacebar
            if (self[_type] == _checkbox && emitter == 'keydown' && event.keyCode == 32) {

              // event fired before state is changed
              operate(self, parent, key, methods[3], false, true); // 'toggle' method
            };

            // arrow
            if (self[_type] == _radio && emitter == 'keyup' && !self[_checked]) {

              // event fired before state is changed (except Opera 9-12)
              operate(self, parent, key, methods[3], false, true); // 'toggle' method
            }
          }
        }

      // init on domready
      }).ready(function() {

        // init
        if (!!base.init) {
          $('.' + prefix)[_icheck]();
        }

        // ajax
        if (!!base.ajax) {
          $.ajaxSetup({
            converters: {
              'text html': function(data) {
                var frame = _doc[_create](_iframe); // create container
                var frameData;
                var body = _doc.body || _doc[_getByTag]('body')[0];

                // set container's attributes
                frame[_className] = _iframe + '.' + _icheck + '-' + _iframe;
                frame.src ='about:blank';

                // append container to document
                body[_append](frame);

                // save container's content
                frameData = frame[_content + 'Document'] ? frame[_content + 'Document'] : frame[_content + 'Window'].document;

                // append data to content
                frameData.open();
                frameData.write(data);
                frameData.close();

                // remove container from document
                body[_remove + 'Child'](frame);

                // setup object
                frameData = $(frameData);

                // customize inputs
                process(frameData.find('.' + prefix), {}, true);

                // extract HTML
                frameData = frameData[0];
                frameData = (frameData[_body] || frameData[_getByTag](_body)[0]).innerHTML;

                // return updated data
                return frameData;
              }
            }
          });
        }
      });

      // plugin definition
      $.fn[_icheck] = function(options, fire) {

        // detect methods
        if (parser.test(options)) {
          var elements = inspect(this);
          var element = elements[_length];

          // loop through inputs
          while (element--) {
            var item = elements[element];
            var key = extract(item[_className]);

            if (key) {

              // 'refresh' method
              if (options == methods[5]) {
                process(item, typeof fire == 'object' ? fire : {}, false, true);

              // 'data' method
              } else if (options == _data) {
                return hashes[key];

              } else {

                // 'destroy' method
                if (options == methods[6]) {
                  tidy(item, key, 'ifDestroyed');

                // some other method
                } else {
                  operate(item, false, key, options);
                }

                // callback
                if (typeof fire == _function) {
                  fire(item);
                }
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
    };

    // expose iCheck as an AMD module
    if (typeof define == _function && define.amd) {
      define(_icheck, ['jquery'], _win['i' + _checked]);
    } else {
      _win['i' + _checked]();
    }
  }
}(window, document, 'icheck', 'checkbox', 'radio', 'input', 'label', 'checked', 'disabled', 'determinate', 'active', 'focus', 'hover', 'appendChild', 'Attribute', 'body', 'callbacks', 'Class', 'className', 'click', 'closest', 'content', 'createElement', 'cursor', 'data', 'display:', 'div', 'function', 'getElementsByTagName', 'iframe', 'indexOf', 'length', 'mirror', 'pointer', 'PointerEvent', 'position', 'remove', 'replace', 'style', 'tagName', 'type'));
