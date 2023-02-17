if (chrome.runtime.connect) {
  console.log("popup script: message port is open");
  let port = chrome.runtime.connect({ name: "popup" });
  port.postMessage({ getLinks: true });
  port.onMessage.addListener(response => {
    console.log("popup script: message received from background", response);
    if (response.links) {
      console.log("popup script: received links", response.links);
      let linksContainer = document.getElementById("links-container");
      for (let link of response.links) {
        linksContainer.value += link + "\n";
      }
    }
  });
} else {
  console.log("popup script: message port is closed");
}
