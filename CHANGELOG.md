# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2020-10-10

### Added
- iOS 13 support @markusbroman

### Changed
- Reformatted changelog @lasseeee

### Fixed
- Fire change event when toggled @rafatmyo

## [1.0.2] - 2014-03-03

### Added
- Better HiDPI screens support @ddctd143

## [2.0.0-rc] - 2014-01-23

### Added
- Three ways to set an options: global object (`window.icheck`), data attributes (`<input data-checkedClass="checked"`) and direct JavaScript object (`$(input).icheck({ options })`)
- AMD module definition support (both for jQuery and Zepto)
- WebOS and Firefox OS support
- New methods: `$(input).icheck('data')` to get all the options were used for customization (also stores a current states values - `checked`, `disabled` and `indeterminate`), `$('input').icheck('styler')` to get a wrapper div (that's used for customization)
- Ability to set callbacks in three ways: global object, direct JavaScript object or using bind method (`$(input).on(callback)`)
- Ability to switch off some of the callbacks when you don't need them (global or per input)
- Fast click support - removes a 300ms click delay on mobile devices without any dependencies (iCheck compatible with the `fastclick` plugin), see the `tap` option
- Ability to ignore customization for the selected inputs using `init` option (if set to `false`)
- Ability to auto customize the ajax loaded inputs without using any extra code (`autoAjax` option, on by default)
- Ability to set a mirror classes between the inputs and assigned labels using the `hoverLabelClass`, `focusLabelClass`, `activeLabelClass`, `checkedLabelClass`, `disabledLabelClass` and `indeterminateLabelClass` options (`mirror` option should be set to `true` to make this happen)

### Changed
- Huge performance boost (takes less than 1s to customize 1000 inputs)
- Minimized number of function calls (some slow jQuery functions are replaced with a faster vanilla alternatives without using any dependencies)
- Unblocked native events - iCheck 2.x doesn't stop your newly or past binded events from being processed
- Pointer events support - full support for phones and tablets that use Windows OS (such as Lumia, HP tablets, desktops with a touch screen, etc)
- Better handling of the `indeterminate` state
- Optimized event bindings - iCheck binds only a few global events for the all inputs (doesn't increase on elements addition), instead of a couple for the each customized element
- Doesn't store tons of arbitrary data (event in jQuery or Zepto cache), defines customized elements by specific classnames
- Optimized reflows and repaints on init and state changes
- Better options handling - iCheck will never run a single line of JS to process an options that are off or empty
- Auto inits on domready using the specified selector (`autoInit` option) - searches for `.icheck` by default. Classnames can be changed using the `window.classes` object
- Memory usage optimization - uses only a few amount of memory (works well on low-memory devices)
- Betters callbacks architecture - these are fired only after changes are applied to the input

### Fixed
- Fixes some issues of the mobile devices
- Fixes the issues of the wrapper labels, that loose a click ability in some browsers (if no `for` attribute is set)
- Some other options and improvements
- Various bug fixes

### Removed
- Inline styles dropped - iCheck won't add any inline styles to the elements until it's highly needed (`cursor` or `area` option)
- Extra `ins` tag is dropped (less DOM modifications), iCheck wraps each input with a single `div` and doesn't use any extra markup for the any option

## [1.0.1] - 2013-12-19

### Added
- Added Bower support
- Added to jQuery plugin registry

## [1.0.0] - 2013-12-18

### Added
- Added ARIA attributes support (for VoiceOver and others) @myfreeweb
- Added Amazon Kindle support @skinofstars

### Changed
- Merged two versions of the plugin (jQuery and Zepto) into one

### Fixed
- Fixed clickable links inside labels @LeGaS
- Fixed lines separation between labels and inputs
- Fixed demo links
- Fixed callbacks @PepijnSenders

[Unreleased]: https://github.com/fronteed/icheck/compare/2.0.0-rc...HEAD
[2.0.0-rc]: https://github.com/fronteed/icheck/compare/1.0.2...2.0.0-rc
[1.0.2]: https://github.com/fronteed/icheck/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/fronteed/icheck/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/fronteed/icheck/releases/tag/1.0.0
