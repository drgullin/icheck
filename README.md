# iCheck

#### Highly customizable jQuery plugin for checkboxes and radio buttons styling
#### [Demo](http://damirfoy.com/projects/icheck/)

![Skins](http://damirfoy.com/projects/icheck/example.png)

## Features

* **13 options, 6 callbacks, 5 methods** to use
* **5 Retina-ready skins** — `/skins/` folder
* **Lightweight size** — 1 kb gzipped

---

* Keeps original inputs in your code
* Works with checkboxes and radio buttons only, but handles any jQuery selectors
* Keyboard shortcuts support (`Tab`, `Spacebar`, `Arrow up/down`, etc)
* Customization freedom &mdash; use any HTML and CSS to style inputs

---

* Separate checkboxes and radio buttons class names
* Configurable state classes: `.checked`, `.disabled`, `.hover`, `.focus`, `.active`
* Option to append custom HTML code or text inside customized inputs
* **Callbacks** when input is `created`, `clicked`, `checked`, `unchecked`, `disabled`, `enabled`, 'destroyed'.
* **Methods** to add or remove `checked` and `disabled` states on selected inputs
* `destroy` method to remove all traces of iCheck
* Option to handle only checkboxes or radio buttons, both by default
* Increasing or decreasing clickable area around input
* Option to inherit original input's class or id
* Adds hand cursor over inputs if you set up

## Options

    {
        handle: '', // 'checkbox' or 'radio' to style only checkboxes or radio buttons, both by default
        checkboxClass: 'icheckbox', // class added to checkboxes
        radioClass: 'iradio', // class added to radio buttons
        checkedClass: 'checked', // class on checked state
        disabledClass: 'disabled', // class on disabled state
        hoverClass: 'hover', // class on hover state
        focusClass: 'focus', // class on focus state
        activeClass: 'active', // class on active state
        increaseArea: '', // increase clickable area by given % (negative to decrease)
        cursor: false, // true to set hand cursor over input
        inheritClass: false, // set true to inherit input's class name
        inheritID: false, // if set to true, input's id prefixed with 'icheck-' and attached
        insert: '' // add custom HTML code or text inside customized input
    }

Note: you can choose any class names and slyle them as you want.

## Usage

iCheck supports any selectors, but handles only checkboxes and radio buttons:

    $('input').icheck(); // customize all inputs (that are checkboxes or radio buttons)
    $('.block input').icheck(); // handle inputs only inside $('.block')
    $('.vote').icheck(); // handle elements with the .vote class - will search inside, if elements are not inputs

Example:

    $(document).ready(function(){
        $('input').icheck({
            // options
        });

        // you can also change options after inputs are customized
        $('input.some').icheck({
            // different options
        });
    });

Don't forget to include jQuery (1.6 or newer) and `jquery.icheck.js` (or `jquery.icheck.min.js`) in your HTML.

## Callbacks

<table>
  <thead>
    <tr>
      <th>Callback name</th>
      <th>When used</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>this.clicked</td>
      <td>user clicked on customized input (not used when you change it's state programatically)</td>
    </tr>
    <tr>
      <td>this.checked</td>
      <td>input's state changed to 'checked'</td>
    </tr>
    <tr>
      <td>this.unchecked</td>
      <td>'checked' state is removed</td>
    </tr>
    <tr>
      <td>this.disabled</td>
      <td>input's state changed to 'disabled'</td>
    </tr>
    <tr>
      <td>this.enabled</td>
      <td>'disabled' state is removed</td>
    </tr>
    <tr>
      <td>this.created</td>
      <td>input is just customized</td>
    </tr>
    <tr>
      <td>this.destroyed</td>
      <td>customization is just removed</td>
    </tr>
  </tbody>
</table>

Use `bind` or `on` to attach them:

    $('input').bind('this.clicked', function(){
        console.log('input is clicked');
    });

Note: `this.created` callback should be binded before plugin init.

## Methods

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

##### 1.5

* `this.destoyed` callback added
* `destoy` method added

##### 1.4

* `hover` state fixed

##### 1.3

* `this.disabled` and `this.enabled` callbacks added
* `disable` and `enable` methods added

##### 1.2

* `update` method added

##### 1.1

* `active` state fixed

##### 1.0

* Initial release.

## License

iCheck is released under [MIT License](http://en.wikipedia.org/wiki/MIT_License). Feel free to use it in personal and commercial projects.