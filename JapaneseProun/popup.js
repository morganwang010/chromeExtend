document.getElementById("pronounceButton").addEventListener("click", () => {
  const text = document.getElementById("textInput").value.trim();
  if (text) {
    // 发送文本到后台脚本进行发音
    chrome.runtime.sendMessage({ text });
  }
});