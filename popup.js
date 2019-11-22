document.addEventListener(
    "DOMContentLoaded",
    function() {
        document.querySelector("button").addEventListener("click", onclick, false);

        function onclick() {
            chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, "hi ethan", setCount);
            });
        }

        function setCount(res) {
            const div = document.createElement("div");
            div.textContent = `${res.count} scripts`;
            document.body.appendChild(div);
        }
    },
    false
);