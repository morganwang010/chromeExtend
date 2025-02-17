// 监听鼠标松开事件，获取选中的文本
document.addEventListener("mouseup", (event) => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      // 检查选中的文本是否包含日语字符
      if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(selectedText)) {
        // 发送选中的文本到后台脚本
        // chrome.runtime.sendMessage({ text: selectedText });
      }
    }
  });