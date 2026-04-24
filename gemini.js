const WEBHOOK_URL = 'https://discordapp.com/api/webhooks/1492542194870128850/mInnnsxcHerVFC6AP-AtPMclcmADVoj8fjQIirC61lXD32eGWzgVrkNH_8kBvzircBPw';

document.addEventListener('DOMContentLoaded', () => {
    initForm();
    setupToggleEvents();
    document.getElementById('submitBtn').addEventListener('click', sendToDiscord);
});

function initForm() {
    // 初期値を翌日に設定
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('date').value = tomorrow.toISOString().split('T')[0];

    // 時刻初期値 11:00
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

    // 個数の選択肢 (1 - 10) / 初期値 10箱
    document.querySelectorAll('.item-count').forEach(sel => {
        for (let c = 1; c <= 10; c++) {
            const opt = new Option(`${c}箱`, c);
            if (c === 10) opt.selected = true;
            sel.add(opt);
        }
    });
}

function setupToggleEvents() {
    document.querySelectorAll('.row-toggle').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const rowId = `row-${e.target.dataset.row}`;
            const rowElement = document.getElementById(rowId);
            const selects = rowElement.querySelectorAll('select');
            if (e.target.checked) {
                rowElement.classList.remove('disabled-row');
                selects.forEach(s => s.disabled = false);
            } else {
                rowElement.classList.add('disabled-row');
                selects.forEach(s => s.disabled = true);
            }
        });
    });
}

async function sendToDiscord() {
    const rawDate = document.getElementById('date').value;
    const hour = document.getElementById('hour').value;
    const min = document.getElementById('minute').value;
    
    if (!rawDate) return alert("日付を選択してください");

    // 日付と曜日の取得
    const d = new Date(rawDate);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
    const dayName = dayNames[d.getDay()];

    // メッセージのヘッダー部分の組み立て
    // 例：# 04月27日㈪__11:00__納品
    let messageContent = `# ${mm}月${dd}日㈪__${hour}:${min}__納品\n`;

    let activeCount = 0;
    document.querySelectorAll('.input-line').forEach((row) => {
        const isEnabled = row.querySelector('.row-toggle').checked;
        if (isEnabled) {
            const content = row.querySelector('.item-content').value;
            const count = row.querySelector('.item-count').value;
            // 例：## ・`組立（紐）`     `x10箱`
            messageContent += `## ・\`${content}\`     \`x${count}箱\`\n`;
            activeCount++;
        }
    });

    if (activeCount === 0) return alert("送信する行を少なくとも1つ有効にしてください");

    const payload = {
        content: messageContent
    };

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
}