# iCheck

#### Powerful jQuery plugin for checkboxes and radio buttons custom styling
#### [Demo](http://damirfoy.com/projects/icheck/)

![Skins](http://damirfoy.com/projects/icheck/test.png)

## Features:

* **Highly customizable**
* Focused on performance
* Runs on modern and ancient browsers, including mobile
* Touch devices support
* jQuery version 1.6 and newer support
* **5 Retina-ready skins** — `/skins/` folder
* Lightweight size — core is 1.1 kb gzipped

---

* Keeps original inputs in your code
* Works with checkboxes and radio buttons only, but handles any jQuery selectors
* In friendship with your CSS reset
* Keyboard shortcuts support (e.g. `Tab`, `Spacebar`, `Arrow up/down`)
* jQuery chaining support on any action
* Ability to change plugin options on selected inputs after they are customized
* Styling ajax loaded inputs

---

* Separate checkboxes and radio buttons class names
* State classes: `.checked`, `.disabled`, `.focus` and `.active` (`:hover` is native)
* Option to append custom HTML code or text inside customized inputs
* Global and per element **callbacks** when input is `created`, `clicked`, `checked` and `unchecked`
* **Methods** to add or remove `checked` state on selected inputs programatically
* Option to handle only checkboxes or radio buttons, both by default
* Adds hand cursor over input if you set up
* Option to inherit original input's class name or id
* Increasing or decreasing clickable area around input

## Options:

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
        inheritID: false, // if set to true, input's id is prefixed with 'icheck-' and attached
        insert: '' // add custom HTML code or text inside customized input
    }

Note: you can choose any class names and slyle them as you want.

## Usage

iCheck supports direct and parent selectors, handles only checkboxes and radio buttons:

    $('body').icheck(); // customize all inputs on the page
    $('.block input').icheck(); // styling inputs only inside $('.block')
    $('input.vote').icheck(); // styling all inputs with the "vote" class

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

Note: don't forget to include jQuery and `jquery.icheck.js` (or `jquery.icheck.min.js`) in your HTML.

## Callbacks

`this.clicked` event fires when user clicks on customized input (not used when you change it's state programatically)

`this.checked` fires when input goes to `checked` state

`this.unchecked` fires when `checked` state is removed

`this.created` fires when input is created

Use `bind` (also `live/delegate`) or `on` (modern jQuery versions) to attach them:

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
    $('input').icheck('update'); // apply input changes, which were done outside the plugin

## Browser support:

* Internet Explorer 7+ (works in IE6 if you don't use CSS class chaining)
* Firefox 2+
* Opera 9+
* Google Chrome
* Safari
* others

Tested on mobile devices.

## License

iCheck is released under [MIT License](http://en.wikipedia.org/wiki/MIT_License), you are allowed to use it anywhere you want for free.