# iCheck

#### Highly customizable jQuery plugin for checkboxes and radio buttons styling
#### [Demo](http://damirfoy.com/projects/icheck/)

![Skins](http://damirfoy.com/projects/icheck/example.png)

## Features

* Runs on modern and ancient browsers, including mobile
* Touch devices support
* **5 Retina-ready skins** — `/skins/` folder
* Lightweight size — core is 1 kb gzipped

---

* Keeps original inputs in your code
* Works with checkboxes and radio buttons only, but handles any jQuery selectors
* Keyboard shortcuts support (e.g. `Tab`, `Spacebar`, `Arrow up/down`)

---

* Separate checkboxes and radio buttons class names
* State classes: `.checked`, `.disabled`, `.focus` and `.active` (`:hover` is native)
* Option to append custom HTML code or text inside customized inputs
* **Callbacks** when input is `created`, `clicked`, `checked`, `unchecked`, `disabled` and `enabled`
* **Methods** to add or remove `checked` and `disabled` states on selected inputs
* Option to handle only checkboxes or radio buttons, both by default
* Increasing or decreasing clickable area around input
* Option to inherit original input's class name or id

## Options

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
        inheritID: false, // if set to true, input's id prefixed with 'icheck-' and attached
        insert: '' // add custom HTML code or text inside customized input
    }

Note: you can choose any class names and slyle them as you want.

## Usage

iCheck supports any selectors, but handles only checkboxes and radio buttons:

    $('input').icheck(); // customize all inputs on the page
    $('.block input').icheck(); // handle inputs only inside $('.block')
    $('.vote').icheck(); // customize elements with the .vote class - will search inside, if element is not an input

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

Note: don't forget to include jQuery (1.6 or newer) and `jquery.icheck.js` (or `jquery.icheck.min.js`) in your HTML.

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
  </tbody>
</table>

Use `bind` or `on` to attach them:

    $('input').bind('this.clicked', function(){
        console.log('input is clicked');
    });

Note: `this.created` callback should be binded before plugin init:

    $('input').bind('this.created', function(){
        console.log('input is created');
    }).icheck({
        // options
    });

## Methods

    $('input').icheck('check'); // change input's state to 'checked'
    $('input').icheck('uncheck'); // remove 'checked' state
    $('input').icheck('disable'); // change input's state to 'disabled'
    $('input').icheck('enable'); // remove 'disabled' state
    $('input').icheck('update'); // apply input changes, which were done outside the plugin

## Browser support

* Internet Explorer 7+ (works in IE6 if you don't use CSS class chaining)
* Firefox 2+
* Opera 9+
* Google Chrome
* Safari
* others

Tested on mobile devices.

## Changelog

##### 1.2

* `this.disabled` and `this.enabled` callbacks
* `disable` and `enable` methods

##### 1.1

* `active` state

##### 1.0

* Initial release.

## License

iCheck is released under [MIT License](http://en.wikipedia.org/wiki/MIT_License), you are allowed to use it anywhere you want for free.