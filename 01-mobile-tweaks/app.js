$(function () {
  var shoppingListData = [
    { text: "click the empty button", completed: false },
    { text: "click the add button", completed: false },
    { text: "tap an item to set as completed", completed: false },
    { text: "or hold an item to delete it", completed: false },
    { text: "click the clear button", completed: false }
  ];

  var item_tpl = document.querySelector(".item-template").cloneNode(true);
  $(item_tpl).removeClass("item-template");
  $(item_tpl).addClass("shopping-item");

  $("body")
    .on("click", ".about-action", handle_show_about)
    .on("click", ".navbar-brand", handle_hide_about)
    .on("click", ".page-actions button[name=add]", handle_show_input)
    .on("click", ".page-actions button[name=clear]", handle_clear_list)
    .on("click", ".page-actions button[name=empty]", handle_empty_list)
    .on("click", ".shopping-input button[name=cancel]", handle_hide_input)
    .on("keypress", ".shopping-input input", handle_keypress)
    .on("click", ".shopping-input button[name=ok]", handle_add_item);

  $("body").hammer()
    .on("hold swipeleft", ".about-panel", handle_hide_about)
    .on("tap", ".shopping-item", handle_item_completed)
    .on("hold", ".shopping-item", handle_item_delete);

  // try to load from localForage
  localForage.getItem("shopping-list", function(data) {
    if (!!data && data.length > 0) {
      shoppingListData = data;
    }

    shoppingListData.forEach(function(item) {
        add_item(item.text, item.completed);
    });
    scrollToTop();
  });

  function persistListData() {
    localForage.setItem("shopping-list", shoppingListData);
  }

  function handle_show_about() {
    if ($(".navbar-collapse").is(".in")) {
      $(".navbar-collapse").collapse('hide');
    }

    $(".about-panel").show();
  }

  function handle_hide_about() {
    $(".about-panel").hide();
  }

  function handle_keypress(evt) {
    if (evt.which == 13) {
      handle_add_item();
    }
  }

  function handle_show_input() {
    var input = $(".shopping-input input");
    input.val(null);
    scrollToTop();
    $(".shopping-input").fadeIn(function () {
      input.focus();
    });
  }

  function handle_hide_input(cb) {
    if (typeof cb === "function") {
      $(".shopping-input").fadeOut(cb);
    }
  }

  function handle_add_item() {
    var text = $(".shopping-input input").val();
    shoppingListData.push({
      text: text,
      completed: false
    });
    persistListData();
    handle_hide_input(function () {
      add_item(text, false, scrollToBottom);
    });
  }

  function scrollToTop() {
    $("html").scrollTop();
  }

  function scrollToBottom() {
    $("html").scrollTop(html[0].scrollHeight);
  }

  function add_item(text, completed) {
    // read a text
    // add a new item to the shopping list
    if (!!text && text.length > 0) {
      var new_item = $(item_tpl.cloneNode(true));
      $(".shopping-list").append(new_item);
      new_item
        .find(".item-name")
        .html(text);
      if(completed) {
        new_item.addClass("completed");
      }
    }
  }

  function handle_clear_list() {
    $(".shopping-list .shopping-item.completed").remove();
    shoppingListData = shoppingListData.filter(function(item) { return !item.completed; });
    persistListData();
  }

  function handle_empty_list() {
    var ok = window.confirm("Are you sure?");
    if (ok) {
      $(".shopping-list .shopping-item").remove();
      shoppingListData = [];
      persistListData();
    }
  }

  function handle_item_completed(ev) {
    var li = $(this).closest(".shopping-item");
    li.toggleClass("completed");
    var index = $(".shopping-list .shopping-item").index(li);
    shoppingListData[index].completed = !(shoppingListData[index].completed);
    persistListData();
  }

  function handle_item_delete(ev) {
    var ok = window.confirm("Removing item: " +
                            $(this).closest(".shopping-item").text());
    if (ok) {
      $(this).closest(".shopping-item").remove();
    }
  }
});
