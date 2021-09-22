const updateComponents = settings => {
    console.log('entrY')
    console.log(settings)
    console.log( $('#remove-splash')[0].checked)
    $('#remove-letterbox')[0].checked = settings.removeLetterBox
    $('#remove-splash')[0].checked = settings.removeSplash
    setClickListners()
}

const setClickListners = () => {
    $('#remove-letterbox')[0].addEventListener('change', (e) => {
        applyRemoveLetterBox(e.returnValue)
        saveSettings();
    });
    $('#remove-splash')[0].addEventListener('change', () => {
        saveSettings();
    });
}

const applyRemoveLetterBox = (toggle) => {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {action: `removeLetterBox${toggle ? 'On' : 'Off'}`});  
    });
}

const saveSettings = () => {
    console.log('setting settings now')
    chrome.storage.sync.set( { settings: { removeLetterBox: $('#remove-letterbox')[0].checked, removeSplash: $('#remove-splash')[0].checked }} )
}

$(document).ready(() => {
  chrome.storage.sync.get(['settings'], (settings) => {
        console.log('popup init')
      console.log(`is settings null ${settings === null}`)
    if (settings === null) {
        const defaultSettings = { settings: { removeLetterBox: false, removeSplash: false } }
        chrome.storage.sync.set(defaultSettings)
        updateComponents(defaultSettings)
    }
    else {
        updateComponents(settings.settings)
    }
  });
});
