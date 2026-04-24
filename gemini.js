const WEBHOOK_URL = 'https://discordapp.com/api/webhooks/1492542194870128850/mInnnsxcHerVFC6AP-AtPMclcmADVoj8fjQIirC61lXD32eGWzgVrkNH_8kBvzircBPw';

document.addEventListener('DOMContentLoaded', () => {
    initForm();
    setupEvents();
    updatePreview();
});

function initForm() {
    // 翌日の日付設定
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('date').value = tomorrow.toISOString().split('T')[0];

    // 時刻初期値 (9-18) / 11:00
    const hourSel = document.getElementById('hour');
    const minSel = document.getElementById('minute');
    for (let h = 9; h <= 18; h++) {
        const hh = String(h).padStart(2, '0');
        hourSel.add(new Option(`${hh}時`, hh, h===11, h===11));
    }
    [0, 15, 30, 45].forEach(m => {
        const mm = String(m).padStart(2, '0');
        minSel.add(new Option(`${mm}分`, mm, m===0, m===0));
    });

    // 個数 (1-10) / 10箱
    document.querySelectorAll('.item-count').forEach(sel => {
        for (let c = 1; c <= 10; c++) {
            sel.add(new Option(`${c}箱`, c, c===10, c===10));
        }
    });
}

function setupEvents() {
    // スイッチ切り替え
    document.querySelectorAll('.row-toggle').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const row = document.getElementById(`row-${e.target.dataset.row}`);
            const selects = row.querySelectorAll('select');
            if (e.target.checked) {
                row.classList.remove('disabled-row');
                selects.forEach(s => s.disabled = false);
            } else {
                row.classList.add('disabled-row');
                selects.forEach(s => s.disabled = true);
            }
            updatePreview();
        });
    });

    // 全入力要素の変更を監視してプレビュー更新
    document.querySelectorAll('select, input').forEach(el => {
        el.addEventListener('change', updatePreview);
    });

    document.getElementById('submitBtn').addEventListener('click', sendToDiscord);
}

function buildMessage() {
    const rawDate = document.getElementById('date').value;
    const hour = document.getElementById('hour').value;
    const min = document.getElementById('minute').value;
    
    if (!rawDate) return "";

    const d = new Date(rawDate);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
    const dayName = dayNames[d.getDay()];

    let message = `# ${mm}月${dd}日㈪__${hour}:${min}__納品\n`;

    let activeExist = false;
    document.querySelectorAll('.input-line').forEach((row) => {
        const isEnabled = row.querySelector('.row-toggle').checked;
        if (isEnabled) {
            const item = row.querySelector('.item-content').value;
            const count = row.querySelector('.item-count').value;
            message += `## ・\`${item}\`　　　\`x${count}箱\`\n`;
            activeExist = true;
        }
    });

    return activeExist ? message : "";
}

function updatePreview() {
    const msg = buildMessage();
    const previewArea = document.getElementById('previewArea');
    
    if (!msg) {
        previewArea.innerHTML = "送信する行を有効にしてください";
        return;
    }

    // Markdown to HTML for preview
    let html = msg
        .replace(/^# (.*$)/gm, '<span class="preview-h1">$1</span>')
        .replace(/^## (.*$)/gm, '<span class="preview-h2">$1</span>')
        .replace(/`(.*?)`/g, '<span class="preview-code">$1</span>');

    previewArea.innerHTML = html;
}

async function sendToDiscord() {
    const messageContent = buildMessage();
    if (!messageContent) return alert("有効な行がありません。");

    const payload = { content: messageContent };

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            showStatus("✅ 送信完了！", "#2ecc71");
        } else {
            throw new Error();
        }
    } catch (e) {
        showStatus("❌ 送信失敗", "#e74c3c");
    }
}

function showStatus(msg, color) {
    const statusDiv = document.getElementById('statusMessage');
    statusDiv.innerText = msg;
    statusDiv.style.color = "white";
    statusDiv.style.backgroundColor = color;
    statusDiv.style.display = "block";
    setTimeout(() => { statusDiv.style.display = "none"; }, 5000);
}