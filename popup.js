const setClickListners = () => {
    $('.button-3')[0].addEventListener('click', () => {
        sendClicked()
    });
}

const sendClicked = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'sendRequests' });
    });
}

$(document).ready(() => {
    setClickListners()
});
