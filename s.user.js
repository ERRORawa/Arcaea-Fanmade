// ==UserScript==
// @name          学习通干检测
// @namespace     ERRORawa
// @version        0.1
// @description    干他丫的
// @author        ERROR
// @run-at        document-idle
// @match        *://*/*
// @grant         frames
// @grant         GM_getValue
// @grant         GM_setValue
// ==/UserScript==

(function() {
	'use strict';
	
	if(location.href.includes("wenxiaobai")) {
		function fillSlateEditor(text) {
			var editor = document.querySelector('.rc-textarea');
			editor.click();
			editor.focus();
			document.execCommand("insertText", false, text);
		}

		window.addEventListener("message", (e) => {
			if(e.data.forWenxiaobai) {
				console.log("[问小白] 接收到题目内容");
				setTimeout(() => {
					fillSlateEditor(e.data.question);
					setTimeout(() => {
						var sendButton = document.querySelector("#j-input-send-msg");
						sendButton.click();
						timer = setInterval(() => {
							try {
								var newestText = document.querySelector("[class^='Answser_answer_content']").innerText;
							} catch {
								var newestText = "notext";
							}
							try {
								var think = document.querySelectorAll("[class^='ShinyText_']");
							} catch {
								var think = "";
							}
							var answer = GM_getValue("answer");
							console.log(newestText);
							if(answer == "notext" || answer != newestText || think.length != 0) {
								answer = newestText;
								GM_setValue("answer", answer);
							} else {
								answer = newestText;
								clearInterval(timer);
								console.log("答案：" + answer);
								window.top.postMessage(
									{
										callback: true,
										currentAnswer: answer,
									},
									"*"
								);
							}
						}, 2000);
					}, 100);
				}, 1000);
			}
		});
		console.log("[问小白] 加载完毕，对学习通发送获取请求");
		window.top.postMessage(
			{
				wenxiaobai: true,
			},
			"*"
		);
	}
	
	if(location.href.includes("baidu")) {
		function fillSlateEditor(text) {
			var editor = document.querySelector('div[data-slate-editor="true"]');

			const dataTransfer = new DataTransfer();
			dataTransfer.setData('text/plain', text);
			const event = new ClipboardEvent('paste', {
					clipboardData: dataTransfer,
					bubbles: true,
					cancelable: true
			});
			editor.dispatchEvent(event);
		}

		window.addEventListener("message", (e) => {
			if(e.data.forBaidu) {
				console.log("[文心一言] 接收到题目内容");
				setTimeout(() => {
					fillSlateEditor(e.data.question);
					setTimeout(() => {
						var sendButton = document.querySelector("div[class^='send_'] div span");
						sendButton.click();
						timer = setInterval(() => {
							try {
								var newestText = document.getElementById("answer_text_id").innerText;
							} catch {
								var newestText = "notext";
							}
							try {
								var think = document.querySelector("[class^='headerMask']").innerText;
							} catch {
								var think = "";
							}
							var answer = GM_getValue("answer");
							console.log(newestText);
							if(answer == "notext" || answer != newestText || think.startsWith("正在思考中")) {
								answer = newestText;
								GM_setValue("answer", answer);
							} else {
								answer = newestText;
								clearInterval(timer);
								console.log("答案：" + answer);
								window.top.postMessage(
									{
										callback: true,
										currentAnswer: answer,
									},
									"*"
								);
							}
						}, 2000);
					}, 100);
				}, 1000);
			}
		});
		GM_setValue("answer", "none");
		var timer = null;
		console.log("[文心一言] 加载完毕，对学习通发送获取请求");
		window.top.postMessage(
			{
				baidu: true,
			},
			"*"
		);
	}
	
	if(location.href.includes("doubao")) {
		function fillSlateEditor(text) {
			var editor = document.querySelector('.semi-input-textarea');
			editor.click();
			editor.focus();
			document.execCommand("insertText", false, text);
		}

		window.addEventListener("message", (e) => {
			if(e.data.forDoubao) {
				console.log("[豆包] 接收到题目内容");
				setTimeout(() => {
					fillSlateEditor(e.data.question);
					setTimeout(() => {
						var sendButton = document.querySelector("#flow-end-msg-send");
						sendButton.click();
						timer = setInterval(() => {
							var allText = document.querySelectorAll("[data-testid='receive_message']");
							var answer = GM_getValue("answer");
							if(allText.length != 0) {
								console.log(allText[allText.length - 1].innerText);
								if(answer != allText[allText.length - 1].innerText || answer.startsWith("根据下列题目") || allText[allText.length - 1].innerText.startsWith("深度思考中")) {
									answer = allText[allText.length - 1].innerText;
									GM_setValue("answer", answer);
								} else {
									allText = document.querySelectorAll("[data-testid='message_text_content']");
									answer = allText[allText.length - 1].innerText;
									clearInterval(timer);
									console.log("答案：" + answer);
									window.top.postMessage(
										{
											callback: true,
											currentAnswer: answer,
										},
										"*"
									);
								}
							}
						}, 1500);
					}, 200);
				}, 3000);
			}
		});
		GM_setValue("answer", "none");
		var timer = null;
		console.log("[豆包] 加载完毕，对学习通发送获取请求");
		window.top.postMessage(
			{
				doubao: true,
			},
			"*"
		);
	}
	
	if(location.href.includes("chaoxing") && location.href.includes("exam")) {
		window.addEventListener("message", (e) => {
			if(title != "考试" && getCookie("pause") != "1") {
				if (e.data.wenxiaobai) {
					console.log("[学习通] 接收到问小白请求，正在发送题目");
					loadAI["1"] = 1;
					e.source.postMessage(
						{
							forWenxiaobai: true,
							question: questionText,
						},
						"*"
					);
				} else if (e.data.baidu) {
					console.log("[学习通] 接收到文心一言请求，正在发送题目");
					loadAI["2"] = 1;
					e.source.postMessage(
						{
							forBaidu: true,
							question: questionText,
						},
						"*"
					);
				} else if (e.data.doubao) {
					console.log("[学习通] 接收到豆包请求，正在发送题目");
					loadAI["3"] = 1;
					e.source.postMessage(
						{
							forDoubao: true,
							question: questionText,
						},
						"*"
					);
				} else if (e.data.callback) {
					var currentAnswer = e.data.currentAnswer;
					console.log("接收到答案：\n" + currentAnswer);
					setAnswer(currentAnswer);
				}
			}
		});
	
		function getCookie(cname) {
			var name = cname + "=";
			var ca = document.cookie.split(';');
			for(var i=0; i<ca.length; i++) {
				var c = ca[i].trim();
				if (c.indexOf(name)==0) return c.substring(name.length,c.length);
			}
			return "";
		}
		
		function setCookie(cname,cvalue,exdays) {
			var d = new Date();
			d.setTime(d.getTime()+(exdays*24*60*60*1000));
			var expires = "expires="+d.toGMTString();
			document.cookie = cname + "=" + cvalue + "; " + expires;
		}
		
		function switchAI(func) {
			var aiList = aiBox.querySelectorAll("iframe");
			console.log(aiList);
			aiList.forEach( aiFrame => {
				aiFrame.classList.add("hideFrame");
			});
			func();
			setCookie("selectAI", select);
			console.log("[更换AI]" + select);
		}
		
		function setAnswer(answer) {
			var title = document.querySelector(".tit").innerText;
			var answers = answer.split("•");
			if(answer == "不知道") {
				document.head.querySelector("title").innerText = "考 试";
				return;
			}
			if(title.includes("单选题")) {
				$(".radioList")[parseInt(answer) - 1].classList.add("answer");
				$(".answer").tap();
			} else if(title.includes("多选题")) {
				var delay = 100;
				answers.forEach(ans => {
					$(".radioList")[parseInt(ans) - 1].classList.add("answer");
				});
				$(".answer").tap();
			} else if(title.includes("填空题")) {
				var grayTits = document.querySelectorAll(".grayTit");
				var answerCon = document.querySelector(".answerCon");
				var iframes = answerCon.querySelectorAll("iframe");
				grayTits.forEach( grayTit => {
					var index = parseInt(grayTit.innerText.substring(1, grayTit.innerText.length - 1)) - 1;
					var textarea = iframes[index].contentDocument.querySelector("p");
					if(textarea.innerHTML != "<br>") {
						if(!confirm(grayTit.innerText + "\n要覆盖原有的内容吗")) {
							return;
						}
					}
					textarea.innerText = answers[index];
				});
			} else if(title.includes("判断题")) {
				$("[name='" + answers[0] + "']").tap();
			} else if(title.includes("简答题")) {
				var answerCon = document.querySelector(".answerCon");
				var frame = answerCon.querySelector("iframe");
				var textarea = frame.contentDocument.querySelector("p");
				if(textarea.innerHTML != "<br>") {
					if(!confirm("要覆盖原有的内容吗")) {
						return;
					}
				}
				textarea.innerText = answer;
			}
			var isLast = document.querySelectorAll(".lastQuestion");
			if(isLast.length == 0) {
				document.querySelector(".next").click();
			} else {
				alert("到最后一题了，再检查一下吧");
			}
		}
		
		function toggleBox() {
			if(button.innerText == "打开AI对话") {
				button.innerText = "隐藏AI对话";
				button.style.right = "100px";
				button.style.top = "11%";
			} else if(button.innerText == "隐藏AI对话") {
				button.innerText = "打开AI对话";
				button.style.right = "50px";
				button.style.top = "7px";
			}
			aiBox.classList.toggle("hideBox");
		}
		
		var title = document.head.querySelector("title").innerText;
		var aiBox = document.createElement("div");
		var selectAI = document.createElement("div");
		var waitLoad = document.createElement("div");
		var customCSS = document.createElement("style");
		var select = getCookie("selectAI");
		var loadAI = { "1": 0, "2": 0, "3": 0 };
		var questionText = "暂无内容";
		
		waitLoad.style.cssText = "position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-size: 40px;";
		waitLoad.innerText = "加载中";
		aiBox.appendChild(waitLoad);
		
		selectAI.style.cssText = "position: absolute; left: 0px; top: 0px; width: 100%; height: 10%;";
		aiBox.appendChild(selectAI);
		
		var buttonCSS = "display: inline-block; width: 30%; height: 100%; background-color: lightgray; color: gray; border-left: 1px solid gray; border-right: 1px solid gray;";
		var iframeCSS = "zoom: 60%; position: absolute; left: 0px; top: 10%; width: 100%; height: 90%;";
		
		var wenxiaobaiButton = document.createElement("button");
		wenxiaobaiButton.style.cssText = buttonCSS;
		var wenxiaobai = document.createElement("iframe");
		wenxiaobai.style.cssText = iframeCSS;
		wenxiaobaiButton.innerText = "问小白";
		selectAI.appendChild(wenxiaobaiButton);
		aiBox.appendChild(wenxiaobai);
		function showWenxiaobai() {
			wenxiaobai.classList.remove("hideFrame");
			select = "1";
			if(loadAI[select] == 0) {
				wenxiaobai.src = "https://www.wenxiaobai.com";
			}
		}
		wenxiaobaiButton.addEventListener("click", function(){
			switchAI(showWenxiaobai);
		});
		
		var baiduButton = document.createElement("button");
		baiduButton.style.cssText = buttonCSS;
		var baidu = document.createElement("iframe");
		baidu.style.cssText = iframeCSS;
		baiduButton.innerText = "文心一言";
		selectAI.appendChild(baiduButton);
		aiBox.appendChild(baidu);
		function showBaidu() {
			baidu.classList.remove("hideFrame");
			select = "2";
			if(loadAI[select] == 0) {
				baidu.src = "https://yiyan.baidu.com";
			}
		}
		baiduButton.addEventListener("click", function(){
			switchAI(showBaidu);
		});
		
		var doubaoButton = document.createElement("button");
		doubaoButton.style.cssText = buttonCSS;
		var doubao = document.createElement("iframe");
		doubao.style.cssText = iframeCSS;
		doubaoButton.innerText = "豆包";
		selectAI.appendChild(doubaoButton);
		aiBox.appendChild(doubao);
		function showDoubao() {
			doubao.classList.remove("hideFrame");
			select = "3";
			if(loadAI[select] == 0) {
				doubao.src = "https://www.doubao.com";
			}
		}
		doubaoButton.addEventListener("click", function(){
			switchAI(showDoubao);
		});
		
		var pauseButton = document.createElement("button");
		pauseButton.style.cssText = buttonCSS;
		pauseButton.innerText = "暂停";
		pauseButton.style.width = "8%";
		selectAI.appendChild(pauseButton);
		function pauseToggle() {
			if(pauseButton.innerText == "暂停") {
				pauseButton.innerText = "运行";
				setCookie("pause", "1");
			} else {
				pauseButton.innerText = "暂停";
				setCookie("pause", "0");
				location.reload();
			}
		}
		pauseButton.addEventListener("click", pauseToggle);
		if(getCookie("pause") == "1") {
			pauseToggle();
		}
		
		if(title == "考试") {
			var button = document.createElement("button");
			button.style.cssText = "position: fixed; top: 7px; right: 50px; width: 100px; height: 50px; background-color: skyblue; z-index: 9001; border-radius: 20px;"
			button.innerText = "打开AI对话";
			document.body.appendChild(button);
			aiBox.style.cssText = "position: fixed; top: 0px; width: 100%; height: 100%; z-index: 9000;";
		} else {
			var button = document.querySelector(".countDown");
			aiBox.style.cssText = "position: fixed; top: 50px; width: 100%; height: 50%; z-index: 9000; box-shadow: 0 50px 100px #00000050;";
		}
		button.addEventListener("click", toggleBox);
		
		customCSS.innerHTML = ".hideBox{ top: 99% !important; width: 1px !important; height: 1px !important; overflow: hidden;} .hideFrame{ width: 1px !important; height: 1px !important; }";
		aiBox.style.backgroundColor = "darkgray";
		aiBox.classList.toggle("hideBox");
		document.body.appendChild(customCSS);
		
		if(select == "") {
			select = "1";
			setCookie("selectAI", select);
			console.log("[首次使用脚本] 设定使用的AI：1");
		}
		
		document.body.appendChild(aiBox);
		
		if(title != "考试") {
			setTimeout(() => {
				switch(select) {
					case "1":
						switchAI(showWenxiaobai);
						break;
					case "2":
						switchAI(showBaidu);
						break;
					case "3":
						switchAI(showDoubao);
						break;
				}
			}, 1000);
			
			setTimeout(() => {
				checkRemainTime = function(){};
				exitCount = function(){};
				fireCheckRemainTime = function(){};
				exitCountAndExitTip = function(){};
				var masks = document.querySelectorAll(".mask_div");
				masks.forEach(mask => {
					mask.style.display = "none";
				});
				document.head.querySelector("title").innerText =
				"考试";
				document.querySelector(".answerProgress span").addEventListener("click", function() {
					location.reload();
				});
				var question = document.querySelector(".answerMain");
				questionText = "根据下列题目给出答案，不要写出过程和解析，只输出最终答案，不要添加多余的内容，要严格按照我的要求输出内容。\n若你不知道正确答案，请不要乱选，而是输出：“不知道”。\n如果是单选题或者多选题，用数字代替字母，按照这样的格式输出：1•3•4；\n如果是判断题，请根据题目输出“true”或“false”；\n如果是填空题，请按照这样的格式输出：“时间•空间”；\n如果是简答题，请直接输出内容。\n请看题：\n" + question.innerText;
			}, 100);
			
			if(getCookie("pause") != "1") {
				setTimeout(() => {
					checkRemainTime = function(){};
					var flag = false;
					for(const loaded in loadAI) {
						if(loadAI[loaded] == 1) {
							flag = true;
							break;
						}
					}
					if(!flag) {
							location.reload();
					}
				}, 15000);
			}
		}
	}
})();