// demo.html
$(document).ready(function() {
  var ie = $('html').hasClass('ie') ? true : false,
      hash = window.location.hash.replace('#', ''),
      hash_prev;

  if (hash && $('.' + hash).length) {
    if (hash == 'extended')
      $('html').addClass('reveal');
    else
      $(window).scrollTop($('.' + hash).offset().top - 40), hash_prev = hash;
  }

  $('.example dt').click(function() {
    $(this).siblings().removeClass('selected').end().prev('dd').andSelf().addClass('selected');
  });

  $('.arrows .top, .arrows .bottom, .features .self, .examples .self, .usage .self').click(function(event) {
    event.preventDefault();

    var target = $(this).data('to'),
        target_offset = $('.' + target).offset().top;

    window.location.hash = target;

    if (target == 'extended')
      $('html').addClass('reveal'), $(window).scrollTop(0);
    else
      $('html, body').stop().animate({scrollTop: target_offset - 40}, 600), hash_prev = target;
  });

  $('.colors li').click(function() {
    var self = $(this);

    if (!self.hasClass('active')) {
      self.siblings().removeClass('active');

      var example = self.closest('.example'),
          color = self.attr('class') ? '-' + color : '',
          checkbox = example.data('icheckbox'),
          radio = example.data('iradio'),
          checkbox_default = 'icheckbox_minimal',
          radio_default = 'iradio_minimal';

      if (example.hasClass('skin-square')) {
        checkbox_default = 'icheckbox_square', radio_default = 'iradio_square';
        checkbox == undefined && (checkbox = 'icheckbox_square-green', radio = 'iradio_square-green');
      }

      if (example.hasClass('skin-line')) {
        checkbox_default = 'icheck_line', radio_default = null;
        checkbox == undefined && (checkbox = 'icheck_line-blue', radio = null);
      }

      checkbox == undefined && (checkbox = checkbox_default, radio = radio_default);

      example.find('input, .example-states .state').each(function() {
        var element = $(this).hasClass('state') ? $(this) : $(this).parent(),
            element_class = element.attr('class').replace(checkbox, checkbox_default + color).replace(radio, radio_default + color);

        element.attr('class', element_class);
      });

      example.data('icheckbox', checkbox_default + color);
      example.data('iradio', radio_default + color);
      self.addClass('active');
    }
  });

  var window_offset,
      window_width_prev,
      inputs = $('.extended-inputs'),
      callbacks = $('.extended-callbacks'),
      callbacks_list = callbacks.find('ul'),
      callbacks_events = 'isCreated isClicked isChecked isUnchecked isDisabled isEnabled isDestroyed',
      callbacks_top;

  function callbacks_align() {
    if (window_offset !== undefined) {
      var diff = (193 - window_offset) < 77 ? 77 : 193 - window_offset;

      if (window_offset < 194)
        callbacks.css('top', diff), callbacks_top = diff;
      else
        callbacks_top !== 77 && (callbacks.css('top', 77), callbacks_top = 77);
    }
  }

  $(window).resize(function() {
    var window_width = $(window).width();

    if (!ie && window_width !== window_width_prev) {
      window_width_prev = window_width;

      if (window_width > 930 && !callbacks.hasClass('fixed'))
        callbacks.addClass('fixed'), callbacks_align();

      if (window_width <= 930 && callbacks.hasClass('fixed'))
        callbacks.css('top', 193).removeClass('fixed');
    }
  }).resize();

  $(window).scroll(function() {
    window_offset = $(window).scrollTop();
    !ie && callbacks_align();
  });

  function callback_log(id, type) {
    callbacks_list.prepend('<li><span>#' + id + '</span> ' + type + '</li>');
  };

  inputs.find('input').bind(callbacks_events, function(event) {
    callback_log(this.id, event.type);
  });

  $('.extended-methods dt .self').bind('click', function() {
    var self = $(this);

    if (self.hasClass('do-init')) {
      if (!inputs.hasClass('grey')) {
        inputs.removeClass('blue').addClass('grey').find('input').unbind(callbacks_events).iCheck('destroy').bind(callbacks_events, function(event) {
          callback_log(this.id, event.type);
        }).iCheck({
          checkboxClass: 'icheckbox_square-grey',
          radioClass: 'iradio_square-grey',
          increaseArea: '20%',
          cursor: true
        });
      }
    } else if (self.hasClass('do-reinit')) {
      if (!inputs.hasClass('blue')) {
        inputs.removeClass('grey').addClass('blue').find('input').unbind(callbacks_events).iCheck('destroy').bind(callbacks_events, function(event) {
          callback_log(this.id, event.type);
        }).iCheck({
          checkboxClass: 'icheckbox_square-blue',
          radioClass: 'iradio_square-blue',
          increaseArea: '20%',
          cursor: true
        });
      }
    } else if (self.hasClass('do-check'))
      $('#input-1, #input-3').iCheck('check');
    else if (self.hasClass('do-uncheck'))
      $('#input-1, #input-3').iCheck('uncheck');
    else if (self.hasClass('do-disable'))
      $('#input-2, #input-4').iCheck('disable');
    else if (self.hasClass('do-enable'))
      $('#input-2, #input-4').iCheck('enable');
    else if (self.hasClass('do-destroy'))
      inputs.removeClass('grey blue').find('input').iCheck('destroy');
    else {
      var dd = $(this).closest('dt').next(),
          text = self.hasClass('active') ? 'show code' : 'hide code';

      self.toggleClass('active').text(text);
      ie ? dd.toggle() : dd.slideToggle(200);
    }
  });

  $('.extend-close').bind('click', function() {
    $('html').removeClass('reveal');
    window.location.hash = '';

    if (hash_prev && $('.' + hash_prev).length) {
      window.location.hash = hash_prev;
      $(window).scrollTop($('.' + hash_prev).offset().top - 40);
    }
  })
});