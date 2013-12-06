$(function () {
  var item_tpl = document.querySelector(".item-template").cloneNode(true);
  item_tpl.setAttribute("class", "shopping-item");

  $("body").on("click", ".page-actions button[name=add]", function() {
    // read a text
    var text = window.prompt("New Shopping item", "...");
    // add a new item to the shopping list
    var new_item = item_tpl.cloneNode(true);
    $(".shopping-list").append(new_item);
    $(new_item).find(".item-name").html(text);
  });

  $("body").on("click", ".page-actions button[name=clear]", function() {
    $(".shopping-list .shopping-item.completed").remove();
  });

  $("body").on("click", ".page-actions button[name=empty]", function() {
    $(".shopping-list .shopping-item").remove();
  });

  $("body").on("click", ".item-actions button[name=complete]", function() {
    $(this).closest(".shopping-item").addClass("completed");
  });

  $("body").on("click", ".item-actions button[name=delete]", function() {
    $(this).closest(".shopping-item").remove();
  });
});
