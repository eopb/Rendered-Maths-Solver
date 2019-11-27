function save_options() {
  const clickCause = (document.getElementById("onclick") as any).value;
  chrome.storage.sync.set({ clickCause }, () => {
    const status = document.getElementById("status")!;
    status.textContent = "Options saved.";
    setTimeout(() => {
      status.textContent = "";
    }, 750);
  });
}

function restore_options() {
  chrome.storage.sync.get(
    {
      clickCause: "Overlay Window"
    },
    items => {
      (document.getElementById("onclick") as HTMLSelectElement).value =
        items.clickCause;
    }
  );
}
document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save")!.addEventListener("click", save_options);
