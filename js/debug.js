window.onerror = function (msg, url, line, col, error) {
    const box = document.createElement('div');
    box.style.position = 'fixed';
    box.style.bottom = '0';
    box.style.left = '0';
    box.style.width = '100%';
    box.style.background = 'rgba(255,0,0,0.9)';
    box.style.color = 'white';
    box.style.padding = '10px';
    box.style.zIndex = '99999';
    box.style.fontSize = '12px';
    box.style.fontFamily = 'monospace';
    box.innerHTML = `<strong>Error:</strong> ${msg} <br> ${url}:${line}:${col}`;
    document.body.appendChild(box);
    console.error('Global Error:', error);
};

window.addEventListener('unhandledrejection', event => {
    const box = document.createElement('div');
    box.style.position = 'fixed';
    box.style.top = '0';
    box.style.left = '0';
    box.style.width = '100%';
    box.style.background = 'rgba(255,165,0,0.9)';
    box.style.color = 'black';
    box.style.padding = '10px';
    box.style.zIndex = '99999';
    box.style.fontSize = '12px';
    box.style.fontFamily = 'monospace';
    box.innerHTML = `<strong>Promise Rejection:</strong> ${event.reason}`;
    document.body.appendChild(box);
});
