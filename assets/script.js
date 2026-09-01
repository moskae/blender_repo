document.addEventListener("DOMContentLoaded", function() {
    // 1. Настраиваем базовую разметку шапки страницы
    document.title = "Blender Extensions Repository";
    const h1 = document.querySelector("h1");
    if (h1) h1.textContent = "⚡ Репозиторий Расширений Blender";

    // Создаем красивый подзаголовок вместо стандартного текста
    const p = document.createElement("p");
    p.className = "subtitle";
    p.textContent = "Собственный независимый источник дополнений";
    h1.parentNode.insertBefore(p, h1.nextSibling);

    // 2. Создаем красивый блок интеграции с кнопкой копирования
    const repoBox = document.createElement("div");
    repoBox.className = "repo-box";

    const infoText = document.createElement("p");
    infoText.style.margin = "0 0 15px 0";
    infoText.innerHTML = "Чтобы установить эти аддоны, добавьте адрес репозитория в настройки Blender (<i>Preferences → Get Extensions → Repositories</i>):";

    const copyBtn = document.createElement("button");
    copyBtn.className = "repo-url-btn";
    copyBtn.textContent = "📋 Скопировать URL для Blender";

    copyBtn.addEventListener("click", () => {
        const repoUrl = window.location.origin + window.location.pathname + "index.json";
        navigator.clipboard.writeText(repoUrl).then(() => {
            copyBtn.textContent = "✅ URL скопирован в буфер!";
            copyBtn.style.backgroundColor = "#28a745";
            setTimeout(() => {
                copyBtn.textContent = "📋 Скопировать URL для Blender";
                copyBtn.style.backgroundColor = "";
            }, 2000);
        });
    });

    repoBox.appendChild(infoText);
    repoBox.appendChild(copyBtn);
    p.parentNode.insertBefore(repoBox, p.nextSibling);

    // 3. Создаем сетку для карточек аддонов
    const grid = document.createElement("div");
    grid.className = "addons-grid";
    repoBox.parentNode.insertBefore(grid, repoBox.nextSibling);

    // 4. Загружаем index.json и генерируем карточки
    fetch("./index.json")
    .then(response => response.json())
    .then(data => {
        if (!data.extensions || data.extensions.length === 0) {
            grid.innerHTML = "<p style='color: var(--text-muted);'>Репозиторий пуст или расширения еще не добавлены.</p>";
            return;
        }

        data.extensions.forEach(addon => {
            const card = document.createElement("div");
            card.className = "addon-card";

            // Извлекаем данные из манифеста расширения
            const name = addon.name || "Без названия";
            const version = addon.version || "1.0.0";
            const author = addon.author || "Не указан";
            const description = addon.description || "Описание отсутствует.";

            // Blender формирует путь скачивания относительно корня репозитория
            const downloadUrl = addon.archive_url;

            card.innerHTML = `
            <div>
            <div class="addon-header">
            <h3 class="addon-title">${name}</h3>
            <span class="addon-version">v${version}</span>
            </div>
            <p class="addon-author">Автор: ${author}</p>
            <p class="addon-description">${description}</p>
            </div>
            <a href="${downloadUrl}" class="download-link" download>📥 Скачать .zip напрямую</a>
            `;

            grid.appendChild(card);
        });
    })
    .catch(err => {
        console.error("Ошибка загрузки манифеста расширений:", err);
        grid.innerHTML = "<p style='color: #dc3545;'>Не удалось загрузить данные об аддонах.</p>";
    });
});
