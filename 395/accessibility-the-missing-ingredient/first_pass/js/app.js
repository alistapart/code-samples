(function() {
  var app = {

  elements: {
    $my_cart         : $("#my_cart"),
    $container       : $("#container"),
    $main            : $("#main"),
    confirm_is_active: false,
    cart_count       : null
  },

  init: function() {
    app.bindings();
    app.updateCartUI();
  },

  removeItems: function(pid) {
    localStorage.removeItem(pid);
  },

  removeRow: function(obj) {
    obj.closest("tr").remove();
  },

  incrementItemQuantity: function(pid, quantity_id) {
    var count = parseInt(localStorage[pid]);
    localStorage[pid] = ++count;
    app.updateCartCount();
    document.getElementById(quantity_id).innerHTML = count;
  },

  decrementItemQuantity: function(pid, quantity_id) {
    var count = parseInt(localStorage[pid]);
    localStorage[pid] = --count;
    app.updateCartCount();
    document.getElementById(quantity_id).innerHTML = count;
  },

  updateCartUI: function() {
    app.updateCartCount();
    app.updateCartDialog();
  },

  updateCartCount: function() {
    var key,
        cart_text,
        count = 0;

    for (var i = 0; i < localStorage.length; i++) {
      key = localStorage.key(i)

      if (key.indexOf("product_") != -1) {
        count += parseInt(localStorage[key]);
      }
    }
    app.elements.cart_count = count;

    $("#shopping_cart").html(app.elements.cart_count);
  },

  addToCart: function(pid, event) {
    if (localStorage[pid] !== undefined) {
    var count = parseInt(localStorage[pid]);
      localStorage[pid] = ++count;
    } else {
      localStorage[pid] = 1;
    }
    app.updateCartUI();
  },

  resetCartFocus: function() {
    setTimeout(function() {
      $("#my_cart").focus();
    }, 300);
  },

  updateCartDialog: function() {
    var key,
        keys           = [],
        $cart_contents = $("#my_cart_contents");

    $cart_contents
      .html("")
      .append("\
      <table id='cart_summary'>\
        <caption id='my_cart_title'>Cart Contents</caption>\
        <thead>\
        <tr>\
        <th scope='col'></th>\
        <th scope='col'>Product</th>\
        <th scope='col'>Price</th>\
        <th scope='col'>Quantity</th>\
        <th scope='col'></th>\
        </tr>\
        </thead>\
        <tbody></tbody>\
      </table>\
      <button class='button continue_checkout' href='#' title='Continue to checkout'>Continue to checkout</button>\
    ");

    if (app.elements.cart_count > 0) {

      for (var i = 0; i < localStorage.length; i++) {
        key = localStorage.key(i)

        if (key.indexOf("product_") != -1) {
          keys.push(key);
        }
      }

      $.each(data.products, function(index, element) {

        if ($.inArray(element.pid, keys) > -1) {
          $("#cart_summary tbody").append("\
          <tr id='row_" + index + "'>\
          <td><img class='product_thumb' src='" + element.img_uri  + "' alt='" + element.title  + "'></td> \
          <td tabindex='-1' class='product_title'>" + element.title + "</td>\
          <td class='product_price'>$" + element.price + "</td>\
          <td id='product_quantity_" + index  + "' class='product_quantity'>" + localStorage[element.pid] + "</td>\
          <td class='product_delete_row'>\
            <button class='button row_button remove_row_items' title='Remove all items of this type' data-pid='" + element.pid + "'>x</button>\
            <button class='button row_button increment_row_item' title='Increase quantity by one' data-pid='" + element.pid + "' data-product-quantity='product_quantity_" + index  + "'>+</button>\
            <button class='button row_button decrement_row_item'  title='Decrease quantity by one' data-pid='" + element.pid + "' data-product-quantity='product_quantity_" + index  + "'>-</button>\
          </td>\
          </tr>\
          ")
        }
      });
    } else {
      $cart_contents
        .html("")
        .append("<p class='empty'>-- There are no items in the cart. --</p>");
    }

    app.resetCartFocus();
  },

  showModal: function() {
    $("body").addClass("show_cart");
    $("#container *").attr("tabindex", "-1");
    app.resetCartFocus();
  },

  removeModal: function() {
    var $selected = $("section.selected");

    $("body").removeClass("show_cart");
    app.elements.$container.removeAttr("tabIndex");
    $("#container *").removeAttr("tabindex");
    $("section").attr("tabindex", "-1");

    if ($selected.length) {
      $selected.focus();
    } else {
      $("section")
        .first()
        .focus();
    }
  },

  continueToCheckout: function() {
    app.removeModal();
    alert("Continuing to checkout. The End.");
  },

  cartIsActive: function() {
    return $("body").hasClass("show_cart");
  },

  setConfirmInactive: (function() {
    setTimeout(function() {
      app.elements.confirm_is_active = false;
    }, 300);
  }),

  setEmptyCart: function() {
    app.elements.$my_cart
      .find("thead")
      .html("").end()
      .find("tbody").html("\
        <tr><td><p class='empty'>-- There are no items in the cart. --</p></td></tr>"
      ).end()
      .find(".continue_checkout").hide();
  },

  focusFirstProductTitle: function() {
    $("#cart_summary")
      .find(".product_title")
      .first()
      .focus();
  },

  bindings: function() {

    $(window).load(function() {
      $("#container").focus();
    });

    $(".add_to_cart").on("click", function() {
      app.addToCart(this.dataset.pid);
    });

    $("#page_mask").on("click", function() {

      if (app.cartIsActive()) {
        app.removeModal();
      }
    });

    $("#product_sections > section").on("click", function() {
      $(this)
      .siblings()
      .removeClass("selected")
      .end()
      .addClass("selected");
    });

    $("#shopping_cart").on("click", function() {
      app.showModal();
    });

    $("#close_cart").on("click", function() {
      app.removeModal();
    });

    $(document).on("click", ".continue_checkout", function(event) {
      event.preventDefault();
      app.continueToCheckout();
    });

    $(document).on("click", ".decrement_row_item", function() {
      var remaining_rows;
      app.decrementItemQuantity(this.dataset.pid, this.dataset.productQuantity);

      if (parseInt(localStorage[this.dataset.pid]) < 1) {
        app.removeItems(this.dataset.pid);
        app.removeRow($(this));
        remaining_rows = $("#cart_summary tbody tr").length;

        if (remaining_rows < 1) {
          app.setEmptyCart();
        } else {
          app.focusFirstProductTitle();
        }
      }
    });

    $(document).on("click", ".increment_row_item", function() {
      app.incrementItemQuantity(this.dataset.pid, this.dataset.productQuantity);
    });

    $(document).on("click", ".remove_row_items", function() {
      var key, remaining_rows,
          pid   = this.dataset.pid,
          $body = $("body"),
          confirm_message = "Are you sure you wish to remove all items of this type?";

      app.elements.confirm_is_active = true;

      if (confirm(confirm_message) ) {

        for (var i = 0; i < localStorage.length; i++) {
          key = localStorage.key(i);

          if (key.indexOf("product_") != -1 && key === pid) {
            app.elements.cart_count -= parseInt(localStorage[key]);
            localStorage.removeItem(key);
          }
        }
        app.setConfirmInactive();
        app.removeRow($(this));
        app.updateCartCount();
        remaining_rows = $("#cart_summary tbody tr").length;

        if (remaining_rows < 1) {
          app.setEmptyCart();
        } else {
          app.focusFirstProductTitle();
        }
      } else {
        app.setConfirmInactive();
      }
    });

    $(document).keyup(function(event) {
      var ESC         = 27,
          key_pressed = event.keyCode;

      if (key_pressed === ESC && app.cartIsActive() && !app.elements.confirm_is_active) {
        app.removeModal();
      }
    });

    $(document.documentElement).keydown(function (event) {
      var UP          = 38,
          DOWN        = 40,
          direction   = null,
          key_pressed = event.keyCode,
          $navigable  = $("section"),
          $selected   = $navigable.hasClass("selected");

      if (!app.cartIsActive()) {

        if (key_pressed === UP) {
          direction = "prev";
        } else if (key_pressed === DOWN) {
          direction = "next";
        }
      }

      if (direction != null) {
        event.preventDefault();

        if (!$selected) {
          $navigable
            .first()
            .addClass("selected")
            .focus();
        } else {
          $(".selected")[direction]()
            .addClass("selected")
            .focus()
            .siblings()
            .removeClass("selected");
        }
      }
    });
  }
}

app.init();
})();
