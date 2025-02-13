// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.text) {
    // 使用 Chrome 的 TTS API 发音
    chrome.tts.speak(request.text, {
      lang: "ja-JP", // 设置语言为日语
      rate: 1.0,     // 语速
      onEvent: (event) => {
        if (event.type === "end") {
          console.log("Pronunciation finished.");
        }
      }
    });
  }
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "translateJapanese",
      title: "Translate Japanese Word",
      contexts: ["selection"]
    });
  });
  
 // 监听右键菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "translateJapanese" && info.selectionText) {
      const selectedText = info.selectionText.trim(); // 获取选中的文本并去除空格
      translateText(selectedText, tab.id); // 调用翻译函数
    }
  });
  
  // 翻译函数
  async function translateText(text, tabId) {
    try {
      // 调用 Jisho API 进行翻译
      const response = await fetch(`https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(text)}`);
      const data = await response.json();
  
      // 解析 API 返回的数据
      if (data.data && data.data.length > 0) {
        const result = data.data[0]; // 取第一个结果
        const japanese = result.japanese[0].word || result.japanese[0].reading; // 日语单词或读音
        const english = result.senses[0].english_definitions.join(", "); // 英文释义
        // 检查是否有中文释义
        const chinese = result.senses[0].chinese_definitions
        ? result.senses[0].chinese_definitions.join(", ")
        : "No Chinese translation available.";

      // 构建翻译结果
      const translation = `Japanese: ${japanese}\nEnglish: ${english}\nChinese: ${chinese}`;
        // 构建翻译结果
        // const translation = `Japanese: ${japanese}\nEnglish: ${english}`;
  
        // 在页面中显示翻译结果
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          function: showTranslation,
          args: [translation]
        });
      } else {
        // 如果没有找到翻译结果
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          function: showTranslation,
          args: ["No translation found."]
        });
      }
    } catch (error) {
      console.error("Translation error:", error);
      // 显示错误信息
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: showTranslation,
        args: ["Translation failed. Please try again."]
      });
    }
  }
  
  // 在页面中显示翻译结果的函数
  function showTranslation(translation) {
    alert(translation);
  }