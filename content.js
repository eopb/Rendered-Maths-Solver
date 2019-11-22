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
    });
}

updateMLinks();

setInterval(updateMLinks, 2000);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    const matches = document.querySelectorAll("script[type='math/tex']");
    sendResponse({ count: matches.length });
});

function wolfram(query) {
    window.open(
        `https://www.wolframalpha.com/input/?i=${encodeURIComponent(query)}`
    );
}