function updateMLinks() {
    console.log("log");
    const matches = document.querySelectorAll("script[type='math/tex']");
    matches.forEach(element => {
        parent = element.parentElement;

        if (parent.onclick === null) {
            parent.onclick = function() {
                // wolfram(element.textContent);
                removeOldMath();
                const iframe = document.createElement("iframe");
                iframe.id = "MathsOverlay";
                iframe.setAttribute("src", walframUrl(element.textContent));
                styleIframe(iframe);
                document.body.appendChild(iframe);
            };
        }
    });
}

function styleIframe(i) {
    i.height = "200";
    i.width = "400";
    i.style.border = "3px solid rgb(28,110,164)";
    i.style.borderRadius = "5px";
    i.style.boxShadow = "0px 8px 17px -3px rgba(0,0,0,0.54)";
    i.style.backgroundColor = "#fff";
    i.style.position = "fixed";
    i.style.top = `${window.event.clientY - 5}px`;
    i.style.left = `${window.event.clientX - 5}px`;
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

setInterval(function() {
    console.log(
        window.event.clientY - 5 ==
        parseInt(document.getElementById("MathsOverlay").style.top)
    );
}, 2000);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    const matches = document.querySelectorAll("script[type='math/tex']");
    sendResponse({ count: matches.length });
});

function wolfram(query) {
    window.open(walframUrl(query));
}

walframUrl = query =>
    `https://www.wolframalpha.com/input/?i=${encodeURIComponent(query)}`;