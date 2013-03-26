# [iCheck plugin](http://damirfoy.com/iCheck/)
#### Super customized checkboxes and radio buttons with jQuery

Refer to the [iCheck website](http://damirfoy.com/iCheck/) for examples.

![Skins](http://damirfoy.com/iCheck/examples.png)


Features
--------

* **Identical inputs across different browsers and devices** — both [desktop and mobile](#browser-support)
* **Touch devices support** — iOS, Android, BlackBerry, Windows Phone
* **Keyboard accessible inputs** — `Tab`, `Spacebar`, `Arrow up/down` and other shortcuts
* **Customization freedom** — use any HTML and CSS to style inputs (try [6 Retina-ready skins](http://damirfoy.com/iCheck/))
* **Lightweight size** — 1 kb gzipped

-----

* [15 options](#options) to customize checkboxes and radio buttons
* [8 callbacks](#callbacks) to handle changes
* [6 methods](#methods) to make changes programmatically
* Saves changes to original inputs, [works carefully](#initialize) with any jQuery selector


How it works
------------

iCheck works with checkboxes and radio buttons like a constructor. **It wraps each input with a div**, which you may customize yourself or use one of the [available skins](http://damirfoy.com/iCheck/). You may also place inside that div some HTML code or text using `insert` option.

For this HTML:

```html
<input type="checkbox" checked>
<input type="radio" name="some" checked>
<input type="radio" name="some">
```
With default options you'll get nearly this:

```html
<div class="icheckbox">
  <input type="checkbox" checked>
</div>
<div class="iradio">
  <input type="radio" name="some" checked>
</div>
<div class="iradio">
  <input type="radio" name="some">
</div>
```
By default, iCheck doesn't provide any CSS styles for wrapper divs (if you don't use skins).


Options
-------

```js
{
  // 'checkbox' or 'radio' to style only checkboxes or radio buttons, both by default
  handle: '',

  // class added to customized checkboxes
  checkboxClass: 'icheckbox',

  // class added to customized radio buttons
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

  // add hoverClass to customized input on label hover and labelHoverClass to label on input hover
  labelHover: true,

  // class added to label if labelHover set to true
  labelHoverClass: 'hover',

  // increase clickable area by given % (negative to decrease)
  increaseArea: '',

  // true to set hand cursor over input
  cursor: false,

  // set true to inherit input's class name
  inheritClass: false,

  // if set to true, input's id prefixed with "icheck-" and attached
  inheritID: false,

  // add custom HTML code or text inside customized input
  insert: ''
}
```
You can choose any class names and slyle them as you want.


Initialize
----------

iCheck supports any selectors, but handles only checkboxes and radio buttons:

```js
// customize all inputs (will search for checkboxes and radio buttons)
$('input').iCheck();

// handle inputs only inside $('.block')
$('.block input').iCheck();

// handle only checkboxes inside $('.test')
$('.test input').iCheck({
  handle: 'checkbox'
});

// handle .vote class elements (will search inside the element, if it's not an input)
$('.vote').iCheck();

// you can also change options after inputs are customized
$('input.some').iCheck({
  // different options
});
```
jQuery v1.6 or newer and `jquery.icheck.js` (`jquery.icheck.min.js` is minified) should be included in your HTML.


Callbacks
---------

<table>
  <thead>
    <tr>
      <th>Callback name</th>
      <th>When used</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>is.Clicked</td>
      <td>user clicked on customized input or label</td>
    </tr>
    <tr>
      <td>is.Changed</td>
      <td>input's "checked" or "disabled" state is changed</td>
    </tr>
    <tr>
      <td>is.Checked</td>
      <td>input's state is changed to "checked"</td>
    </tr>
    <tr>
      <td>is.Unchecked</td>
      <td>"checked" state is removed</td>
    </tr>
    <tr>
      <td>is.Disabled</td>
      <td>input's state is changed to "disabled"</td>
    </tr>
    <tr>
      <td>is.Enabled</td>
      <td>"disabled" state is removed</td>
    </tr>
    <tr>
      <td>is.Created</td>
      <td>input is just customized</td>
    </tr>
    <tr>
      <td>is.Destroyed</td>
      <td>customization is just removed</td>
    </tr>
  </tbody>
</table>

Use `bind` to attach them:

```js
$('input').bind('is.Clicked', function(){
  console.log('input is clicked');
});
```

`is.Created` callback should be binded before plugin init.


Methods
-------

```js
$('input').icheck('check'); // change input's state to 'checked'
$('input').icheck('uncheck'); // remove 'checked' state
$('input').icheck('disable'); // change input's state to 'disabled'
$('input').icheck('enable'); // remove 'disabled' state
$('input').icheck('update'); // apply input changes, which were done outside the plugin
$('input').icheck('destroy'); // remove all traces of iCheck
```


Comparison
----------

iCheck is created to avoid routine of reinventing the wheel when working with checkboxes and radio buttons. It provides an expected identical result for the huge number of browsers, devices and their versions. Callbacks and methods can be used to easily handle and make changes at customized inputs.

There are some CSS3 ways available to style checkboxes and radio buttons, like [this one](http://webdesign.tutsplus.com/tutorials/htmlcss-tutorials/quick-tip-easy-css3-checkboxes-and-radio-buttons/). You have to know about some of the disadvantages of similar methods:

* inputs are keyboard inaccessible, since `display: none` or `visibility: hidden` used to hide them
* poor browser support
* multiple bugs on mobile devices
* tricky, harder to maintain CSS code
* JavaScript is still needed to fix specific issues

While CSS3 method is quite limited solution, iCheck is made to be an everyday replacement covering most of the tasks.


Browser support
---------------

iCheck is verified to work in Internet Explorer 7+ (works in IE6 if you don't use CSS class chaining), Firefox 2+, Google Chrome, Safari 3+ and Opera 9+ browsers. Should also work in many others.

Mobile browsers (like Opera mini, Chrome mobile, Safari mobile and others) are also supported. Tested on iOS, Android, BlackBerry and Windows Phone devices.


License
-------
iCheck jQuery plugin is released under [MIT License](http://en.wikipedia.org/wiki/MIT_License). Feel free to use it in personal and commercial projects.