const WEBHOOK_URL = 'https://discordapp.com/api/webhooks/1492542194870128850/mInnnsxcHerVFC6AP-AtPMclcmADVoj8fjQIirC61lXD32eGWzgVrkNH_8kBvzircBPw';

let lastGeneratedMessage = "";

document.addEventListener('DOMContentLoaded', () => {
    initForm();
    setupEvents();
    syncUI();
});

function initForm() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('date').value = tomorrow.toISOString().split('T')[0];

    const hourSel = document.getElementById('hour');
    for (let h = 9; h <= 18; h++) {
        const hh = String(h).padStart(2, '0');
        hourSel.add(new Option(`${hh}時`, hh, h===11, h===11));
    }
    const minSel = document.getElementById('minute');
    [0, 15, 30, 45].forEach(m => {
        const mm = String(m).padStart(2, '0');
        minSel.add(new Option(`${mm}分`, mm, m===0, m===0));
    });

    document.querySelectorAll('.item-count').forEach(sel => {
        for (let c = 1; c <= 10; c++) {
            sel.add(new Option(`${c}箱`, c, c===10, c===10));
        }
    });
}

function setupEvents() {
    // 入力フォームの操作監視
    document.querySelectorAll('select, input:not(#editEnable)').forEach(el => {
        // クリックや変更を試みた際のチェック
        el.addEventListener('mousedown', (e) => checkEditMode(e));
        
        el.addEventListener('change', () => {
            if (el.classList.contains('row-toggle')) {
                const row = document.getElementById(`row-${el.dataset.row}`);
                const selects = row.querySelectorAll('select');
                if (el.checked) { row.classList.remove('disabled-row'); selects.forEach(s => s.disabled = false); }
                else { row.classList.add('disabled-row'); selects.forEach(s => s.disabled = true); }
            }
            syncUI();
        });
    });

    // 編集モードでの直接入力監視
    document.getElementById('messageEditor').addEventListener('input', () => {
        if (document.getElementById('editEnable').checked) {
            updatePreviewFromEditor();
        }
    });

    // 編集モード切り替え
    const editToggle = document.getElementById('editEnable');
    const editor = document.getElementById('messageEditor');
    editToggle.addEventListener('change', () => {
        editor.readOnly = !editToggle.checked;
        if (!editToggle.checked) syncUI(); 
    });

    document.getElementById('submitBtn').addEventListener('click', sendToDiscord);
}

// 編集モードがONのときにフォーム操作をブロックする関数
function checkEditMode(e) {
    const isEditOn = document.getElementById('editEnable').checked;
    if (isEditOn) {
        e.preventDefault(); // 操作をキャンセル
        alert("編集モードをOFFにしてください");
    }
}

function syncUI() {
    if (document.getElementById('editEnable').checked) return;

    const rawDate = document.getElementById('date').value;
    const hour = document.getElementById('hour').value;
    const min = document.getElementById('minute').value;
    if (!rawDate) return;

    const d = new Date(rawDate);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    
    // ご指定のマークダウン形式
    let message = `# ${mm}月${dd}日㈪__${hour}:${min}__納品\n`;
    let activeExist = false;
    document.querySelectorAll('.input-line').forEach((row) => {
        if (row.querySelector('.row-toggle').checked) {
            const item = row.querySelector('.item-content').value;
            const count = row.querySelector('.item-count').value;
            message += `## ・\`${item}\`　　　\`x${count}箱\`\n`;
            activeExist = true;
        }
    });

    const finalMsg = activeExist ? message : "";
    document.getElementById('messageEditor').value = finalMsg;
    lastGeneratedMessage = finalMsg;
    updatePreviewDisplay(finalMsg);
}

function updatePreviewFromEditor() {
    updatePreviewDisplay(document.getElementById('messageEditor').value);
}

function updatePreviewDisplay(msg) {
    const preview = document.getElementById('previewDisplay');
    if (!msg) { preview.innerHTML = "内容がありません"; return; }

    let html = msg
        .replace(/^# (.*$)/gm, '<span class="preview-h1">$1</span>')
        .replace(/^## (.*$)/gm, '<span class="preview-h2">$1</span>')
        .replace(/`(.*?)`/g, '<span class="preview-code">$1</span>');
    preview.innerHTML = html;
}

async function sendToDiscord() {
    const finalContent = document.getElementById('messageEditor').value.trim();
    if (!finalContent) return alert("送信する内容がありません。");

    if (finalContent !== lastGeneratedMessage) {
        if (!confirm("編集されたメッセージを送信してもよろしいですか？")) return;
    }

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: finalContent })
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
    statusDiv.style.backgroundColor = color;
    statusDiv.style.display = "block";
    setTimeout(() => { statusDiv.style.display = "none"; }, 5000);
}