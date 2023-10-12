export const isValidUrl = (searchterms) => {
    try {
        new URL(searchterms);
        return true;
    } catch (error) {
        return false;
    }
}

export const isSpotifyUrl = (url) => {
    const index = url.hostname.split('.').indexOf('spotify');
    return index === -1 ? false : true;
}

export const isSpotifyPlaylist = (url) => {
    const pathname = url.pathname.split('/')[1];
    return pathname === 'playlist';
}

export const isYoutubeUrl = (url) => {
    const index = url.hostname.split('.').indexOf('youtube');
    return index === -1 ? false : true;
}

export const isYoutubePlaylist = (url) => {
    const pathname = url.pathname.split('/')[1];
    return pathname === 'playlist';
}