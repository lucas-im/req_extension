import $ from './lib/jquery-3.6.0.min'
import targetUrls from './data'

const sendRequests = async () => {
    let response = {}
    try {
        for (let i = 0; i < targetUrls.length; i++) {
            $.ajax({
                url: targetUrls[i],
                complete: function (data) {
                    response[i + ' ' + targetUrls[i]] = data.responseText || data.statusText
                    if (i === targetUrls.length - 1) {
                        saveAsJson([response])
                    }
                }
            })
        }
    }
    catch (error) {
        alert('failed to download! ' + error);
    }
}

const saveAsJson = async (response) => {
    const blob = new Blob([JSON.stringify(response)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'response.json'
    link.click()
}

if (window.sessionStorage !== 'undefined') {
    chrome.runtime.onMessage.addListener(message => {
        switch (message.action) {
            case 'sendRequests': sendRequests()
                break
        }
    });
}