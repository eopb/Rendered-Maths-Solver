let clickMode: string | null = null;
chrome.storage.sync.get(
  {
    clickCause: "Overlay Window"
  },
  function(items) {
    clickMode = items.clickCause;
  }
);

function updateMLinks() {
  const matches = document.querySelectorAll("script[type='math/tex']");
  matches.forEach(element => {
    var parent = element.parentElement!;

    if (parent.onclick === null) {
      parent.onclick = function(event) {
        if (clickMode === "New Tab") {
          wolframInNewTab(element.textContent!);
        } else {
          removeOldMath();
          const div = document.createElement("div");
          div.id = "MathsOverlay";
          styleDiv(div, event);
          const iframe = document.createElement("iframe");
          iframe.setAttribute("src", walframUrl(element.textContent!));
          styleIframe(iframe);
          div.appendChild(iframe);
          const close = document.createElement("button");
          close.innerHTML = "&#10060;";
          styleButton(close);
          close.onclick = function() {
            removeOldMath();
          };
          div.appendChild(close);
          document.body.appendChild(div);
        }
      };
    }
  });
}

function styleIframe(i: HTMLIFrameElement) {
  i.height = "100%";
  i.width = "100%";
  i.style.resize = "both";
  i.style.border = "3px solid rgb(28,110,164)";
  i.style.borderRadius = "5px";
  i.style.boxShadow = "0px 8px 17px -3px rgba(0,0,0,0.54)";
  i.style.backgroundColor = "#fff";
  i.style.margin = "0";
  i.style.padding = "0";
}

function styleDiv(i: HTMLDivElement, event: MouseEvent) {
  i.style.height = "200";
  i.style.width = "400";
  i.style.position = "fixed";
  i.style.top = `${event.clientY - 5}px`;
  i.style.left = `${event.clientX - 5}px`;
  i.style.margin = "0";
  i.style.padding = "0";
}

function styleButton(i: HTMLButtonElement) {
  i.style.boxShadow = "0px 8px 17px -3px rgba(0,0,0,0.54)";
  i.style.position = "absolute";
  i.style.right = "5px";
  i.style.top = "5px";
}

function removeOldMath() {
  var e = document.getElementById("MathsOverlay");
  if (e !== null) e.remove();
}

updateMLinks();

setInterval(updateMLinks, 2000);

function wolframInNewTab(query: string) {
  window.open(walframUrl(query));
}

var walframUrl = (query: string): string =>
  `https://www.wolframalpha.com/input/?i=${encodeURIComponent(query)}`;
