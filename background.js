import $ from './lib/jquery-3.6.0.min'
import applyPlayerFunction from './player_functions'

const fetchData = (title, year) => {
    return new Promise(resolve => {
        const request = new XMLHttpRequest()
        // TODO: Sensitive data marker
        const url = `https://openapi.naver.com/v1/search/movie.json?query=${title}&yearfrom=${year}&yearto=${year}`
        request.open('GET', url)
        // TODO: Sensitive data marker
        request.setRequestHeader('X-Naver-Client-Id', 'REDACTED')
        request.setRequestHeader('X-Naver-Client-Secret', 'REDACTED')
        request.setRequestHeader('X-Requested-With', 'REDACTED')
        request.onload = () => {
            if (request.status === 200) {
                const response = JSON.parse(request.responseText)
                if (!response.items.length) return
                const rating = response.items[0].userRating
                const movieUrl = response.items[0].link
                resolve({ rating, movieUrl })
            }
        }
        request.send()
    }
    )
}

const showRating = async ratingModal => {
    const windowSize = $(window).width()
    if (!ratingModal.innerText.includes('/')) {
        const titleModal = $('div[class*="PreviewModalHeader_previewModalTextHeader"]')[0]
        const ratingModalSubstrings = ratingModal.innerText.split(' ')
        const { rating, movieUrl } = await fetchData(titleModal.innerText, ratingModalSubstrings[ratingModalSubstrings.length - 1])
        if (rating && movieUrl && !ratingModal.innerText.includes('/')) {
            ratingModal.innerText += ' • ★' + Math.round(rating) + '/10'
            ratingModal.setAttribute('href', movieUrl)
            if (windowSize <= 1680) ratingModal.style.fontSize = 'x-small'
            else ratingModal.style.fontSize = 'small'
        }
    }
}

if (window.sessionStorage !== 'undefined') {
    chrome.runtime.onMessage.addListener(message => {
        console.log($('.vjs-tech')[0].style)
        switch (message.action) {
            case 'removeLetterBoxOn': $('.vjs-tech')[0].style.objectFit = 'cover'
            case 'removeLetterBoxOff': $('.vjs-tech')[0].style.objectFit = 'contain'
        }
    });
    const target = document.documentElement || document.body
    let isPlayerFunctionApplied = false
    const observer = new MutationObserver(mutation => {
        const modal = $('div[class*="PreviewModalMetadata_previewModalAttributesHeader"]')[0]
        if (mutation[0].target.baseURI.includes('https://www.coupangplay.com/play') && !isPlayerFunctionApplied) {
            // TODO: Find a better way to detect if the palyerfunctions are already applied.
            observer.disconnect()
            applyPlayerFunction()
            observer.observe(target, config)
            setTimeout(() => { isPlayerFunctionApplied = true }, 1000)
        }
        else if (modal) {
            observer.disconnect()
            showRating(modal)
            observer.observe(target, config)
        }

    })
    // configuration of the observer:
    const config = {
        attributes: true,
        childList: true,
        subtree: true
    };
    observer.observe(target, config);
}