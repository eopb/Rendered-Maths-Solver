let clickMode: string | null = null;
chrome.storage.sync.get(
  {
    clickCause: "Overlay Window"
  },
  function(items) {
    clickMode = items.clickCause;
  }
);

class MathElements {
  matches: MathElement[];
  constructor() {
    this.matches = [
      ...document.querySelectorAll("script[type='math/tex']")
    ].map(x => new MathElement(x.textContent!, x.parentElement!));
  }
  onEach(fn: (e: MathElement) => void): void {
    this.matches.forEach(fn);
  }
}

class MathElement {
  latex: string;
  parent: HTMLElement;
  constructor(latex: string, parent: HTMLElement) {
    this.latex = latex;
    this.parent = parent;
  }
  newTab() {
    console.log(this.latex);
    wolframInNewTab(this.latex);
  }
  newOverlayWindow(event: MouseEvent) {
    removeOldMath();

    const div = document.createElement("div");
    div.id = "MathsOverlay";
    Style.styleDiv(div.style);
    Style.positionDiv(div.style, event);

    const iframe = document.createElement("iframe");
    iframe.setAttribute("src", walframUrl(this.latex));
    Style.styleIframe(iframe.style);
    div.appendChild(iframe);

    const close = document.createElement("button");
    close.innerHTML = "&#10060;";
    Style.styleButton(close.style);
    close.onclick = function() {
      removeOldMath();
    };

    div.appendChild(close);
    document.body.appendChild(div);
  }
}

function updateMLinks() {
  const maths = new MathElements();
  maths.onEach(element => {
    let parent = element.parent;

    if (parent.onclick === null) {
      parent.onclick =
        clickMode === "New Tab"
          ? () => element.newTab()
          : e => element.newOverlayWindow(e);
    }
  });
}

namespace Style {
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
