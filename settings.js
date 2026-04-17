// Настройки
function initSettings() {
    // Восстановить сохранённые настройки
    const saved = JSON.parse(localStorage.getItem('toysrus_settings') || '{}');
    
    // Тема
    document.querySelector(`input[name="theme"][value="${saved.theme || 'light'}"]`).checked = true;
    document.getElementById('themeStatus').textContent = saved.theme === 'dark' ? 'Тёмная' : 
        saved.theme === 'retro' ? 'Ретро' : 'Светлая';
    
    // Язык
    document.getElementById('language').value = saved.lang || 'ru';
    document.getElementById('langStatus').textContent = saved.lang === 'en' ? 'English' : 'Русский';
    
    // Тoggles
    ['notifications', 'sounds', 'particles'].forEach(id => {
        document.getElementById(id).checked = saved[id] !== false;
    });
    
    // Анимации
    document.getElementById('animationLevel').value = saved.animLevel || 50;
    document.getElementById('animValue').textContent = saved.animLevel || 50;
}

function saveSettings() {
    const settings = {
        theme: document.querySelector('input[name="theme"]:checked').value,
        lang: document.getElementById('language').value,
        notifications: document.getElementById('notifications').checked,
        sounds: document.getElementById('sounds').checked,
        particles: document.getElementById('particles').checked,
        animLevel: document.getElementById('animationLevel').value
    };
    
    localStorage.setItem('toysrus_settings', JSON.stringify(settings));
    alert('✅ Настройки сохранены!');
    applyTheme(settings.theme);
}

function resetSettings() {
    localStorage.removeItem('toysrus_settings');
    location.reload();
}

function applyTheme(theme) {
    document.body.className = theme;
    document.getElementById('themeStatus').textContent = 
        theme === 'dark' ? 'Тёмная' : theme === 'retro' ? 'Ретро' : 'Светлая';
}

// Инициализация
document.addEventListener('DOMContentLoaded', initSettings);

// События
document.querySelectorAll('input[name="theme"]').forEach(radio => {
    radio.addEventListener('change', (e) => applyTheme(e.target.value));
});

document.getElementById('animationLevel').addEventListener('input', (e) => {
    document.getElementById('animValue').textContent = e.target.value;
});