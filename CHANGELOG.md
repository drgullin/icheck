### Version 1.0.2 - March 03, 2014

* Better HiDPI screens support @ddctd143

### Version 2.0.0 RC - January 23, 2014

* Three ways to set an options: global object (`window.icheck`), data attributes (`<input data-checkedClass="checked"`) and direct JavaScript object (`$(input).icheck({ options })`)
* Huge performance boost (takes less than 1s to customize 1000 inputs)
* Minimized number of function calls (some slow jQuery functions are replaced with a faster vanilla alternatives without using any dependencies)
* AMD module definition support (both for jQuery and Zepto)
* Unblocked native events - iCheck 2.x doesn't stop your newly or past binded events from being processed
* Pointer events support - full support for phones and tablets that use Windows OS (such as Lumia, HP tablets, desktops with a touch screen, etc)
* WebOS and Firefox OS support
* New methods: `$(input).icheck('data')` to get all the options were used for customization (also stores a current states values - `checked`, `disabled` and `indeterminate`), `$('input').icheck('styler')` to get a wrapper div (that's used for customization)
* Better handling of the `indeterminate` state
* Ability to set callbacks in three ways: global object, direct JavaScript object or using bind method (`$(input).on(callback)`)
* Ability to switch off some of the callbacks when you don't need them (global or per input)
* Inline styles dropped - iCheck won't add any inline styles to the elements until it's highly needed (`cursor` or `area` option)
* Fast click support - removes a 300ms click delay on mobile devices without any dependencies (iCheck compatible with the `fastclick` plugin), see the `tap` option
* Ability to ignore customization for the selected inputs using `init` option (if set to `false`) 
* Optimized event bindings - iCheck binds only a few global events for the all inputs (doesn't increase on elements addition), instead of a couple for the each customized element
* Doesn't store tons of arbitrary data (event in jQuery or Zepto cache), defines customized elements by specific classnames 
* Extra `ins` tag is dropped (less DOM modifications), iCheck wraps each input with a single `div` and doesn't use any extra markup for the any option
* Optimized reflows and repaints on init and state changes 
* Better options handling - iCheck will never run a single line of JS to process an options that are off or empty 
* Ability to auto customize the ajax loaded inputs without using any extra code (`autoAjax` option, on by default)
* Auto inits on domready using the specified selector (`autoInit` option) - searches for `.icheck` by default. Classnames can be changed using the `window.classes` object
* Memory usage optimization - uses only a few amount of memory (works well on low-memory devices)
* Betters callbacks architecture - these are fired only after changes are applied to the input
* Ability to set a mirror classes between the inputs and assigned labels using the `hoverLabelClass`, `focusLabelClass`, `activeLabelClass`, `checkedLabelClass`, `disabledLabelClass` and `indeterminateLabelClass` options (`mirror` option should be set to `true` to make this happen)
* Fixes some issues of the mobile devices
* Fixes the issues of the wrapper labels, that loose a click ability in some browsers (if no `for` attribute is set)
* Some other options and improvements
* Various bug fixes

Note: extended docs and usage examples will be available later.

### Version 1.0.1 - December 19, 2013

* Added Bower support
* Added to jQuery plugin registry

### Version 1.0.0 - December 18, 2013

* Added ARIA attributes support (for VoiceOver and others) @myfreeweb
* Added Amazon Kindle support @skinofstars
* Fixed clickable links inside labels @LeGaS
* Fixed lines separation between labels and inputs
* Merged two versions of the plugin (jQuery and Zepto) into one
* Fixed demo links
* Fixed callbacks @PepijnSenders
