function save_options() {
  var clickCause = (document.getElementById("onclick") as any).value;
  console.log("saving");
  chrome.storage.sync.set(
    {
      clickCause: clickCause
    },
    function() {
      var status = document.getElementById("status")!;
      status.textContent = "Options saved.";
      setTimeout(function() {
        status.textContent = "";
      }, 750);
    }
  );
}

function restore_options() {
  chrome.storage.sync.get(
    {
      clickCause: "Overlay Window"
    },
    function(items) {
      var x: any = document.getElementById("onclick");
      x.value = items.clickCause;
    }
  );
}
document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save")!.addEventListener("click", save_options);
