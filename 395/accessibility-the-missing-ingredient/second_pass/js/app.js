(function() {
  var app = {

  elements: {
    $aria_cart_count : $("#cart_count"),
    $aria_item_count : $("#item_count"),
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
    obj.closest("tr").find(".product_quantity")
      .html("0")
      .attr("aria-label", "Item quantity: " + "0");
    app.updateItemCount("0");
    obj.closest("tr").remove();
  },

  incrementItemQuantity: function(pid, quantity_id) {
    var count = parseInt(localStorage[pid]);
    localStorage[pid] = ++count;
    $("#" + quantity_id)
      .html(count)
      .attr("aria-label", "Item quantity: " + count);
    app.updateItemCount(count);
    setTimeout(function() {
      app.updateCartCount();
    }, 10);
  },

  decrementItemQuantity: function(pid, quantity_id) {
    var count = parseInt(localStorage[pid]);
    localStorage[pid] = --count;
    $("#" + quantity_id)
      .html(count)
      .attr("aria-label", "Item quantity: " + count);
    app.updateItemCount(count);
      app.updateCartCount();
    setTimeout(function() {
    }, 10);
  },

  updateItemCount: function(count) {
    app.elements.$aria_item_count
    .html("")
    .html("Item quantity: " + count);
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
    cart_text = "Cart count: " + app.elements.cart_count;

    $("#shopping_cart")
      .html(app.elements.cart_count)
      .attr("aria-label", cart_text);

    app.elements.$aria_cart_count.html(cart_text);
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
        item_quantity,
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
      <button class='button continue_checkout' href='#' aria-label='Continue to checkout'>Continue to checkout</button>\
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
          item_quantity = localStorage[element.pid];
          item_title    = element.title;

          $("#cart_summary tbody").append("\
          <tr id='row_" + index + "'>\
          <td><img class='product_thumb' src='" + element.img_uri  + "' alt='" + item_title  + " thumbnail'></td> \
          <td tabindex='-1' class='product_title'>" + item_title + "</td>\
          <td class='product_price'>$" + element.price + "</td>\
          <td id='product_quantity_" + index  + "' aria-label='Item quantity: " + item_quantity + "' class='product_quantity'>" + item_quantity + "</td>\
          <td class='product_delete_row'>\
            <button aria-controls='row_" + index  +  " cart_count item_count' class='button row_button remove_row_items' aria-label='Remove all " + element.title + "s from the cart?' data-pid='" + element.pid + "'>x</button>\
            <button aria-controls='product_quantity_" + index  + " cart_count item_count' class='button row_button increment_row_item' aria-label='Increase " + item_title + " quantity' data-pid='" + element.pid + "'>+</button>\
            <button aria-controls='product_quantity_" + index  + " cart_count item_count' class='button row_button decrement_row_item' aria-label='Decrease " + item_title + " quantity' data-pid='" + element.pid + "'>-</button>\
          </td>\
          </tr>\
          ")
        }
      });
    } else {
      app.setEmptyCart();
    }

    app.resetCartFocus();
  },

  showModal: function() {
    if (app.elements.$my_cart.attr("aria-hidden") === "true") {
      $("body").addClass("show_cart");
      app.elements.$container.attr("aria-hidden", "true");
      $("#container *").attr("tabindex", "-1");
      app.elements.$my_cart.attr("aria-hidden", "false");
    }
    app.resetCartFocus();
  },

  removeModal: function() {
    var $selected = $("[role=listitem][aria-selected=true]");

    if (app.elements.$my_cart.attr("aria-hidden") === "false") {
      $("body").removeClass("show_cart");
      app.elements.$my_cart.attr("aria-hidden", "true");
      app.elements.$container
        .attr("aria-hidden", "false")
        .removeAttr("tabIndex");
      $("#container *").removeAttr("tabindex");
      $("section").attr("tabindex", "-1");

      if ($selected.length) {
        $selected.focus();
      } else {
        $("section")
          .first()
          .attr("aria-selected", "true")
          .focus();
      }
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
      .find(".continue_checkout")
        .hide()
        .attr("aria-hidden", "true");
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

    $("#product_sections > [role=listitem]").on("click", function() {
      $(this)
      .siblings()
      .attr("aria-selected", "false")
      .end()
      .attr("aria-selected", "true");
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
      var remaining_rows,
      aria_controls = $(this).attr("aria-controls").split(" ")[0];

      app.decrementItemQuantity(this.dataset.pid, aria_controls);

      if (parseInt(localStorage[this.dataset.pid]) < 1) {
        app.removeItems(this.dataset.pid);
        app.removeRow($(this));
        app.updateItemCount("0");
        remaining_rows = $("#cart_summary tbody tr").length;

        if (remaining_rows < 1) {
          app.setEmptyCart();
        } else {
          app.focusFirstProductTitle();
        }
      }
    });

    $(document).on("click", ".increment_row_item", function() {
      var aria_controls = $(this).attr("aria-controls").split(" ")[0];
      app.incrementItemQuantity(this.dataset.pid, aria_controls);
    });

    $(document).on("click", ".remove_row_items", function() {
      var key, remaining_rows,
          pid   = this.dataset.pid,
          row   = $(this).closest("tr"),
          title = row.find(".product_title").html(),
          qty   = row.find(".product_quantity").html(),
          $body = $("body"),
          confirm_message = "Are you sure you wish to remove all " + title + "s from the cart?";

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

    $(document.documentElement).keyup(function (event) {
      var UP          = 38,
          DOWN        = 40,
          direction   = null,
          key_pressed = event.keyCode,
          $navigable  = $("[role=listitem]"),
          $selected   = $("[role=listitem][aria-selected=true]");

      if (!app.cartIsActive()) {

        if (key_pressed === UP) {
          direction = "prev";
        } else if (key_pressed === DOWN) {
          direction = "next";
        }
      }

      if (direction != null) {
        event.preventDefault();

        if (!$selected.length) {
          $navigable
            .first()
            .attr("aria-selected", "true")
            .focus();
        } else {
          $selected[direction]()
            .attr("aria-selected", "true")
            .focus()
            .siblings()
            .attr("aria-selected", "false");
        }
      }
    });
  }
}

app.init();
})();
