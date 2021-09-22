import $ from './lib/jquery-3.6.0.min'

const removeSplash = splashChildren => {
    for (let child of splashChildren) {
        child.remove()
    }
    console.log($('.vjs-tech'))
    setTimeout(() => { $('.vjs-tech')[0].play() }, 1000)
}

const removeLetterBox = () => {
    $('.vjs-tech')[0].style.objectFit = 'cover'
}

const applyPlayerFunction = () => {
    chrome.storage.sync.get(['settings'], (settings) => {
        settings = settings.settings
        if (settings !== null) {
            if (settings.removeSplash) {
                const splashElems = $('div[class*="useContentRating_contentRating"]')[0]
                const splashChildren = splashElems.children
                removeSplash(splashChildren)
            }
            if (settings.removeLetterBox) removeLetterBox()
        }
        else {
            const defaultSettings = { settings: { removeLetterBox: false, removeSplash: false } }
            chrome.storage.sync.set(defaultSettings)
        }
    })
}

export default applyPlayerFunction