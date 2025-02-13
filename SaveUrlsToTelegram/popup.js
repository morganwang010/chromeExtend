document.getElementById('save-url').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url;
    const title = tabs[0].title;
    const botToken = '7516898905:AAFJ1FYwNbij8FPXBNxCWuGtKefv9ruI6Bg'; // 替换为你的 Telegram Bot 令牌
    const channelId = '@urlsfavorit'; // 替换为你的 Telegram 频道 ID
    const message = `[${title}](${url})`;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: channelId,
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
});
