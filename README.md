# iCheck plugin v2.0 rc1

#### This is a release candidate version, you may try to use it.

Docs will be updated later, here's a short intro:

## Default options

**Notes:**

**global object**: `window.icheck = { options }`

**data attributes**: `<input data-checkedClass="mycheckedclass" type="checkbox" class="icheck">`

**init object**: `$('input').icheck({ options });`

#### These are global object options:

```
{
  // auto init on domready
  autoInit: true,

  // auto handle ajax loaded inputs (any inputs inside the HTML ajax-requests will be customized automatically)
  autoAjax: false,

  // fastclick plugin replacement, works without dependencies (removes a 300ms delay between a physical tap and the firing the changes on mobile browsers). Compatible with but doesn't require http://github.com/ftlabs/fastclick
  tap: true,

  // these are a default classnames used by icheck (# are replaced with classes.base)
  classes: {
    base: 'icheck', // classname to search for and customize
    div: '#-item', // classname to add for a styler div
    area: '#-area-', // classname to add to styler, when "area" option is used
    input: '#-input', // classname to add to original input
    label: '#-label' // classname to add to assigned labels
  },

  // global callbacks (if set to false, callback will never be fired)
  callbacks: {
    ifCreated: function() {
      // this is just an example
    }
  },
}
```

#### These options can be stored in data attributes and init object:

```
{
  // fastclick (http://github.com/ftlabs/fastclick) replacement, works without dependencies (removes a 300ms delay between a physical tap and the firing of a click event on mobile browsers)
  tap: true,

  // 'checkbox' or 'radio' to style only checkboxes or radio buttons, both by default
  handle: '',

  // base class added to customized checkboxes
  checkboxClass: 'icheckbox',

  // base class added to customized radio buttons
  radioClass: 'iradio',

  // class added on checked state (input.checked = true)
  checkedClass: 'checked',

    // if not empty, used instead of 'checkedClass' option (input type specific)
    checkedCheckboxClass: '',
    checkedRadioClass: '',

  // if not empty, added as class name on unchecked state (input.checked = false)
  uncheckedClass: '',

    // if not empty, used instead of 'uncheckedClass' option (input type specific)
    uncheckedCheckboxClass: '',
    uncheckedRadioClass: '',

  // class added on disabled state (input.disabled = true)
  disabledClass: 'disabled',

    // if not empty, used instead of 'disabledClass' option (input type specific)
    disabledCheckboxClass: '',
    disabledRadioClass: '',

  // if not empty, added as class name on enabled state (input.disabled = false)
  enabledClass: '',

    // if not empty, used instead of 'enabledClass' option (input type specific)
    enabledCheckboxClass: '',
    enabledRadioClass: '',

  // class added on indeterminate state (input.indeterminate = true)
  indeterminateClass: 'indeterminate',

    // if not empty, used instead of 'indeterminateClass' option (input type specific)
    indeterminateCheckboxClass: '',
    indeterminateRadioClass: '',

  // if not empty, added as class name on determinate state (input.indeterminate = false)
  determinateClass: '',

    // if not empty, used instead of 'determinateClass' option (input type specific)
    determinateCheckboxClass: '',
    determinateRadioClass: '',

  // class added on hover state (pointer is moved onto input)
  hoverClass: 'hover',

  // class added on focus state (input has gained focus)
  focusClass: 'focus',

  // class added on active state (pointer is pressed on input)
  activeClass: '',

  // if true, a mirror classes will be toggled between label and input tags (i.e. input is checked => checkedClass is added to input, checkedLabelClass is added to label)
  mirror: false,

  // classes to append to labels if "mirror" option is true
  checkedLabelClass: '',
  disabledLabelClass: '',
  indeterminateLabelClass: '',

  // same here
  hoverLabelClass: '',
  focusLabelClass: '',
  activeLabelClass: '',

  // true to set 'pointer' CSS cursor over enabled inputs and 'default' over disabled
  cursor: false,

  // callbacks (can't be stored in data attributes)
  callbacks: {
    ifCreated: function(node, settings) {
      // your code
    }
  },

  // comma separated attributes to inherit from the input to the wrapper div (note: input's id is prefixed with 'icheck-' (or a window.classes.base))
  inherit: '',

  // increase clickable area by given %
  area: 0,

  // add HTML code or text inside customized input
  insert: ''
}
```


## Methods

```
// checked = change input's state to 'checked'
$('input').icheck('checked', function(node) {
  // callback function will be fired for each input
  // node is the HTML node of the current input (can be used as $(node))
});

// unchecked = remove 'checked' state
$('input').icheck('unchecked', function(node) {
  // callbackfunction will be fired for each input
  // node is the HTML node of the current input (can be used as $(node))
});

// disabled = change input's state to 'disabled'
$('input').icheck('disabled', function(node) {
  // callbackfunction will be fired for each input
  // node is the HTML node of the current input (can be used as $(node))
});

// enabled = remove 'disabled' state
$('input').icheck('enabled', function(node) {
  // callbackfunction will be fired for each input
  // node is the HTML node of the current input (can be used as $(node))
});

// indeterminate = change input's state to 'indeterminate'
$('input').icheck('indeterminate', function(node) {
  // callbackfunction will be fired for each input
  // node is the HTML node of the current input (can be used as $(node))
});

// determinate = remove 'indeterminate' state
$('input').icheck('determinate', function(node) {
  // callbackfunction will be fired for each input
  // node is the HTML node of the current input (can be used as $(node))
});

// update = apply input changes, which were made outside the iCheck plugin
$('input').icheck('updated', function(node) {
  // callbackfunction will be fired for each input
  // node is the HTML node of the current input (can be used as $(node))
});

// toggle = toggle 'checked' state
$('input').icheck('toggle', function(node) {
  // callbackfunction will be fired for each input
  // node is the HTML node of the current input (can be used as $(node))
});

// destroy = remove all traces of iCheck
$('input').icheck('destroy', function(node) {
  // callbackfunction will be fired for each input
  // node is the HTML node of the current input (can be used as $(node))
});

// data = returns an object with the init settings and current states of the input
var data = $('input').icheck('data');
// data.checked, data.disabled, data.indeterminat are a cached states valuese

// styler = returns a wrapper div of the current input
var parent = $('input').icheck('styler');
// see http://git.io/cdYpdA for more info
```

## Callbacks

Note: callbacks are fired for each input. Unchecked radio buttons also receive a callbacks.

```
ifChecked = input's state is changed to "checked"
$('input').on('ifChecked', function(event) {
  // your code
});

ifUnchecked = "checked" state is removed
$('input').on('ifUnchecked', function(event) {
  // your code
});

ifDisabled = input's state is changed to "disabled"
$('input').on('ifDisabled', function(event) {
  // your code
});

ifEnabled = "disabled" state is removed
$('input').on('ifEnabled', function(event) {
  // your code
});

ifIndeterminate = input's state is changed to "indeterminate"
$('input').on('ifIndeterminate', function(event) {
  // your code
});

ifDeterminate = "indeterminate" state is removed
$('input').on('ifDeterminate', function(event) {
  // your code
});

ifChanged = input's "checked", "disabled" or "indeterminate" state is changed
$('input').on('ifChanged', function(event) {
  // your code
});

ifToggled = input's "checked" state is changed
$('input').on('ifToggled', function(event) {
  // your code
});

ifCreated = input is just customized
$('input').on('ifCreated', function(event) {
  // your code
});
Note: this callback is switched off by default, use the options like these to switch it on:
{
 callbacks: {
   ifCreated: true
 }
}

ifDestroyed = customization is just removed
$('input').on('ifDestroyed', function(event) {
  // your code
});
```
