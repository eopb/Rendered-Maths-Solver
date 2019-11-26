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
    let parent = element.parentElement!;

    if (parent.onclick === null) {
      parent.onclick = function(event) {
        if (clickMode === "New Tab") {
          wolframInNewTab(element.textContent!);
        } else {
          removeOldMath();

          const div = document.createElement("div");
          div.id = "MathsOverlay";
          style.styleDiv(div.style);
          style.positionDiv(div.style, event);

          const iframe = document.createElement("iframe");
          iframe.setAttribute("src", walframUrl(element.textContent!));
          style.styleIframe(iframe.style);
          div.appendChild(iframe);

          const close = document.createElement("button");
          close.innerHTML = "&#10060;";
          style.styleButton(close.style);
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

namespace style {
  export function styleIframe(ecss: CSSStyleDeclaration) {
    ecss.height = "100%";
    ecss.width = "100%";
    ecss.resize = "both";
    ecss.border = "3px solid rgb(28,110,164)";
    ecss.borderRadius = "5px";
    ecss.boxShadow = "0px 8px 17px -3px rgba(0,0,0,0.54)";
    ecss.backgroundColor = "#fff";
    ecss.margin = "0";
    ecss.padding = "0";
  }

  export function styleDiv(ecss: CSSStyleDeclaration) {
    ecss.height = "200";
    ecss.width = "400";
    ecss.margin = "0";
    ecss.padding = "0";
  }
  export function positionDiv(ecss: CSSStyleDeclaration, event: MouseEvent) {
    ecss.position = "fixed";
    ecss.top = `${event.clientY - 5}px`;
    ecss.left = `${event.clientX - 5}px`;
  }

  export function styleButton(ecss: CSSStyleDeclaration) {
    ecss.boxShadow = "0px 8px 17px -3px rgba(0,0,0,0.54)";
    ecss.position = "absolute";
    ecss.right = "5px";
    ecss.top = "5px";
  }
}
function removeOldMath() {
  const e = document.getElementById("MathsOverlay");
  if (e !== null) e.remove();
}

updateMLinks();

setInterval(updateMLinks, 2000);

function wolframInNewTab(query: string) {
  window.open(walframUrl(query));
}

let walframUrl = (query: string): string =>
  `https://www.wolframalpha.com/input/?i=${encodeURIComponent(query)}`;
