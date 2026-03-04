async function loadIncludes() {
    // Top-bar + Header
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        try {
            const response = await fetch('./parts/topbar-header.html');
            headerPlaceholder.outerHTML = await response.text();
        } catch (e) {
            console.error('Ошибка загрузки шапки:', e);
        }
    }
    
    // Footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        try {
            const response = await fetch('./parts/footer.html');
            footerPlaceholder.outerHTML = await response.text();
        } catch (e) {
            console.error('Ошибка загрузки футера:', e);
        }
    }
}

document.addEventListener('DOMContentLoaded', loadIncludes);
