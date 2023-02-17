chrome.runtime.onConnect.addListener(port => {
  console.log("background script: port connected");
  if (port.name === "popup") {
    port.onMessage.addListener(message => {
      console.log("background script: message received", message);
      if (message.getLinks) {
        console.log("background script: getLinks message received");
        let links = [];
        let tabCount = 0;
        chrome.tabs.query({}, tabs => {
          tabCount = tabs.length;
          for (let tab of tabs) {
            chrome.tabs.executeScript(tab.id, {
              code: `(() => {
                console.log("background script: script injected into tab", ${tab.id});
                let elements = document.getElementsByClassName('project-name has-tip');
                for (let element of elements) {
                  let anchor = element.getElementsByTagName('a')[0];
                  if (anchor) {
                    console.log("background script: link found", anchor.href);
                    return anchor.href;
                  }
                }
                return null;
              })()`
            }, results => {
              if (!results) {
                console.error("background script: error executing script in tab", tab.id);
                return;
              }
              let result = results[0];
              if (result !== null) {
                links.push(result);
              }
              if (links.length === tabCount) {
                console.log("background script: all links found", links);
                port.postMessage({ links: links });
              }
            });
          }
        });
      }
    });
  }
});
