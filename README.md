# iCheck plugin v2.0 rc1

#### This is a release candidate version, you may try to use it.

Docs will be updated later, here's a short intro:

## Options (default)

### These can be stored in global object, data attributes and init object:

```
{
  init: true,
  ajax: false,
  uber: true, // fastclick

  handle: '',

  checkboxClass: 'icheckbox',
  radioClass: 'iradio',

  checkedClass: 'checked',
    checkedCheckboxClass: '',
    checkedRadioClass: '',

  uncheckedClass: '',
    uncheckedCheckboxClass: '',
    uncheckedRadioClass: '',

  disabledClass: 'disabled',
    disabledCheckboxClass: '',
    disabledRadioClass: '',

  enabledClass: '',
    enabledCheckboxClass: '',
    enabledRadioClass: '',

  indeterminateClass: 'indeterminate',
    indeterminateCheckboxClass: '',
    indeterminateRadioClass: '',

  determinateClass: '',
    determinateCheckboxClass: '',
    determinateRadioClass: '',

  hoverClass: 'hover',
  focusClass: 'focus',
  activeClass: '',

  checkedLabelClass: '',
  disabledLabelClass: '',
  indeterminateLabelClass: '',

  hoverLabelClass: '',
  focusLabelClass: '',
  activeLabelClass: '',

  cursor: false,

  callbacks: {
    ifCreated: false
  },

  mirror: false,

  inheritClass: false,
  inheritID: false,
  inheritTitle: false,

  area: 0,

  insert: ''
}
```

### These are global options, stored in global object only (`window.icheck`):

```
{
  className: {
    base: 'icheck',
    div: '#-item',
    area: '#-area-',
    input: '#-input',
    label: '#-label'
  },

  style: {
    input: 'position:absolute!;display:block!;opacity:0!;z-index:-1!;',
    area: 'position:absolute;display:block;content:"";top:#;bottom:#;left:#;right:#;'
  }
}
```

## Methods

```
checked
unchecked
indeterminate
determinate
disabled
enabled
toggle
update
refresh
destroy
data
```

## Callbacks

```
ifChecked
ifUnchecked
ifToggled
ifDisabled
ifEnabled
ifIndeterminate
ifDeterminate
ifChanged
ifCreated
ifDestroyed
```
