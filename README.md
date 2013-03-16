# iCheck

#### Powerful jQuery plugin for checkboxes and radio buttons customization.
#### [Demo](http://damirfoy.com/projects/icheck/)
#### [Extended demo](http://damirfoy.com/projects/icheck/#extended)

![Skins](http://damirfoy.com/projects/icheck/example.png)

## Features
* **13 options, 7 callbacks, 6 methods** to use
* **5 Retina-ready skins** — `/skins/` folder
* **Lightweight size** — 1 kb gzipped

---

* Keeps original inputs in your code
* Works with checkboxes and radio buttons only, but handles any jQuery selectors
* Keyboard shortcuts support (`Tab`, `Spacebar`, `Arrow up/down`, etc)
* Touch devices support (iPad, iPhone, etc)
* Customization freedom &mdash; use any HTML and CSS to style inputs

---

* Separate checkboxes and radio buttons class names
* Configurable state classes: `.checked`, `.disabled`, `.hover`, `.focus`, `.active`
* Option to append custom HTML code or text inside customized inputs
* **Callbacks** when input is `created`, `clicked`, `checked`, `unchecked`, `disabled`, `enabled`, `destroyed`.
* **Methods** to add or remove `checked` and `disabled` states on selected inputs
* `destroy` method to remove all traces of iCheck
* Option to handle only checkboxes or radio buttons, both by default
* Increasing or decreasing clickable area around customized input
* Option to inherit original input's class or id
* Adds hand cursor over inputs if you set up

## Options
    {
      // 'checkbox' or 'radio' to style only checkboxes or radio buttons, both by default
      handle: '',

      // class added to checkboxes
      checkboxClass: 'icheckbox',

      // class added to radio buttons
      radioClass: 'iradio',

      // class on checked state
      checkedClass: 'checked',

      // class on disabled state
      disabledClass: 'disabled',

      // class on hover state
      hoverClass: 'hover',

      // class on focus state
      focusClass: 'focus',

      // class on active state
      activeClass: 'active',

      // increase clickable area by given % (negative to decrease)
      increaseArea: '',

      // true to set hand cursor over input
      cursor: false,

      // set true to inherit input's class name
      inheritClass: false,

      // if set to true, input's id prefixed with 'icheck-' and attached
      inheritID: false,

      // add custom HTML code or text inside customized input
      insert: ''
    }

Note: you can **choose any class names and slyle them as you want**.

## Usage
iCheck supports any selectors, but handles only checkboxes and radio buttons:

    // customize all inputs (will search for checkboxes and radio buttons)
    $('input').iCheck();

    // handle inputs only inside $('.block')
    $('.block input').iCheck();

    // handle only checkboxes inside $('.test')
    $('.test input').iCheck({
      handle: 'checkbox'
    });

    // handle elements with the .vote class (will search inside the element, if it's not an input)
    $('.vote').iCheck();

    // you can also change options after inputs are customized
    $('input.some').iCheck({
      // different options
    });

Don't forget to include jQuery (1.6 or newer) and `jquery.icheck.js` (`jquery.icheck.min.js` is minified) in your HTML.

## Callbacks
[Callbacks usage demo](http://damirfoy.com/projects/icheck/#extended)

<table>
  <thead>
    <tr>
      <th>Callback name</th>
      <th>When used</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>isClicked</td>
      <td>user clicked on customized input (not used when you change it's state programatically)</td>
    </tr>
    <tr>
      <td>isChecked</td>
      <td>input's state is changed to "checked"</td>
    </tr>
    <tr>
      <td>isUnchecked</td>
      <td>"checked" state is removed</td>
    </tr>
    <tr>
      <td>isDisabled</td>
      <td>input's state is changed to "disabled"</td>
    </tr>
    <tr>
      <td>isEnabled</td>
      <td>"disabled" state is removed</td>
    </tr>
    <tr>
      <td>isCreated</td>
      <td>input is just customized</td>
    </tr>
    <tr>
      <td>isDestroyed</td>
      <td>customization is just removed</td>
    </tr>
  </tbody>
</table>

Use `bind` or `on` to attach them:

    $('input').bind('isClicked', function(){
      console.log('input is clicked');
    });

Note: `isCreated` callback should be binded before plugin init.

## Methods
[Methods usage demo](http://damirfoy.com/projects/icheck/#extended)

    $('input').icheck('check'); // change input's state to 'checked'
    $('input').icheck('uncheck'); // remove 'checked' state
    $('input').icheck('disable'); // change input's state to 'disabled'
    $('input').icheck('enable'); // remove 'disabled' state
    $('input').icheck('update'); // apply input changes, which were done outside the plugin
    $('input').icheck('destroy'); // remove all traces of iCheck

## Browser support
* Internet Explorer 7+ (works in IE6 if you don't use CSS class chaining)
* Firefox 2+
* Opera 9+
* Google Chrome
* Safari
* others

Tested on mobile devices.

## Changelog
##### 1.6
* Options and callbacks improvement

##### 1.5
* `isDestoyed` callback
* `destoy` method

##### 1.4
* `hover` state

##### 1.3
* `isDisabled` and `isEnabled` callbacks
* `disable` and `enable` methods

##### 1.2
* `update` method

##### 1.1
* `active` state

##### 1.0
* Initial release.

## License
iCheck is released under [MIT License](http://en.wikipedia.org/wiki/MIT_License). Feel free to use it in personal and commercial projects.