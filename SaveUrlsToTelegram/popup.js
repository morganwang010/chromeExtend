// 页面加载时从storage读取配置
document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get(['botToken', 'channelId'], function(data) {
    if (data.botToken && data.channelId) {
      // 如果已有配置，隐藏输入框
      document.getElementById('config-form').style.display = 'none';
      document.getElementById('config-status').textContent = '配置已保存';
      document.getElementById('clear-config').style.display = 'block';
    }
  });
});

// 清除配置
document.getElementById('clear-config').addEventListener('click', () => {
  chrome.storage.sync.remove(['botToken', 'channelId'], function() {
    document.getElementById('config-form').style.display = 'block';
    document.getElementById('config-status').textContent = '';
    document.getElementById('clear-config').style.display = 'none';
    document.getElementById('token-input').value = '';
    document.getElementById('channel-input').value = '';
  });
});

// 保存URL
document.getElementById('save-url').addEventListener('click', () => {
  chrome.storage.sync.get(['botToken', 'channelId'], function(data) {
    if (!data.botToken || !data.channelId) {
      // 如果没有配置，先保存
      const botToken = document.getElementById('token-input').value;
      const channelId = document.getElementById('channel-input').value;
      
      if (!botToken || !channelId) {
        alert('请先输入Bot Token和Channel ID');
        return;
      }

      chrome.storage.sync.set({ botToken, channelId }, function() {
        document.getElementById('config-form').style.display = 'none';
        document.getElementById('config-status').textContent = '配置已保存';
        document.getElementById('clear-config').style.display = 'block';
        sendUrl(botToken, channelId);
      });
    } else {
      // 已有配置，直接发送
      sendUrl(data.botToken, data.channelId);
    }
  });
});

function sendUrl(botToken, channelId) {
  alert(botToken);
  alert(channelId);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url;
    const title = tabs[0].title;
    const message = `[${title}](${url})`;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: "@"+ channelId,
        text: message,
        parse_mode: 'Markdown',
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.ok) {
        alert('URL 已成功发送到 Telegram 频道');
      } else {
        alert('发送失败: ' + data.description);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('发送失败: ' + error.message);
    });
  });
};
