inspectLink = (link) => {
    console.log(link);

    fetch('https://api.csgoskins.gg/inspect-links', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            link: link.linkUrl,
        }),
    })
        .then((res) => res.json())
        .then((res) => {
            console.log(res);

            if (res.success) {
                if (res.needs_to_connect) {
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        const tab = tabs[0];
                        chrome.tabs.update(tab.id, { url: res.connect_to_url });
                    });

                    chrome.notifications.create({
                        type: 'basic',
                        iconUrl: './assets/csgo-icon.jpg',
                        title: 'Skin Sent',
                        message: 'The skin has been sent to the CS:GO test server, please connect.',
                    });
                } else {
                    chrome.notifications.create({
                        type: 'basic',
                        iconUrl: './assets/csgo-icon.jpg',
                        title: 'Skin Equipped',
                        message: 'You have been equipped with the selected skin in the CS:GO test server.',
                    });
                }
            } else {
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: './assets/csgo-icon.jpg',
                    title: 'Request Failed',
                    message: req.message,
                });
            }
        })
        .catch((error) => {
            console.log(error);

            chrome.notifications.create({
                type: 'basic',
                iconUrl: './assets/csgo-icon.jpg',
                title: 'Request Failed',
                message: 'Something went wrong, please try again.',
            });
        });
};

chrome.contextMenus.create({
    title: 'Test CS:GO skin in-game',
    contexts: ['link'],
    onclick: inspectLink
});
