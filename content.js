function updateMLinks() {
    console.log("log");
    const matches = document.querySelectorAll("script[type='math/tex']");
    matches.forEach(element => {
        parent = element.parentElement;
        if (parent.onclick === null) {
            parent.onclick = function() {
                wolfram(element.textContent);
            };
        }
        if (parent.onmousemove === null) {
            parent.onmouseover = function() {
                removeOldMath();
                const iframe = document.createElement("iframe");
                iframe.id = "MathsOverlay";
                iframe.setAttribute("src", walframUrl(element.textContent));
                iframe.style.backgroundColor = "#fff";
                iframe.style.position = "fixed";
                iframe.style.top = `${window.event.clientY - 5}px`;
                iframe.style.left = `${window.event.clientX - 5}px`;
                iframe.classList.add("hoverP");
                iframe.onmouseover = function() {};
                iframe.onmouseout = function() {};
                document.body.appendChild(iframe);
            };
            parent.onmouseleave = function() {
                e = document.getElementById("MathsOverlay");
                if (e !== null) {
                    e.classList.remove("hoverP");
                }
                removeMath();
            };
        }
    });
}

function removeMath() {
    e = document.getElementById("MathsOverlay");
    console.log(e);
    if (
        e !== null &&
        !e.classList.contains("hoverP") &&
        !(window.event.clientY - 5 == parseInt(e.style.top))
    ) {
        e.remove();
    }
}

function removeOldMath() {
    e = document.getElementById("MathsOverlay");
    console.log("adlksj");
    if (e !== null) {
        e.remove();
    }
}

updateMLinks();

setInterval(updateMLinks, 2000);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    const matches = document.querySelectorAll("script[type='math/tex']");
    sendResponse({ count: matches.length });
});

function wolfram(query) {
    window.open(walframUrl(query));
}

walframUrl = query =>
    `https://www.wolframalpha.com/input/?i=${encodeURIComponent(query)}`;