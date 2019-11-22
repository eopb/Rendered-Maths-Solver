chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    const matches = document.querySelectorAll("script[type='math/tex']");
    sendResponse({ count: matches.length });
});