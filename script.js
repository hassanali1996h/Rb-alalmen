// script.js

// تحميل السور من ملف JSON fetch("surahs_full.json") .then(response => response.json()) .then(data => { console.log("✅ تم تحميل السور بنجاح");

const surahInput = document.querySelector("#surah-input");
const displayBtn = document.querySelector("#display-btn");
const resultDiv = document.querySelector("#result");

function displaySurah() {
  const value = surahInput.value.trim();
  if (!value) return;

  let surah = null;
  // إذا المستخدم كتب رقم
  if (!isNaN(value)) {
    const index = parseInt(value);
    surah = data.find(s => s.index === index);
  } else {
    // إذا كتب الاسم
    surah = data.find(s => s.name === value || s.name.includes(value));
  }

  if (!surah) {
    resultDiv.innerHTML = `<p style='color:red;'>❌ لم يتم العثور على السورة</p>`;
    return;
  }

  const html = `
    <h2>${surah.index} - ${surah.name}</h2>
    <ol>
      ${surah.verses.map(v => `<li>${v}</li>`).join("")}
    </ol>
  `;
  resultDiv.innerHTML = html;
}

displayBtn.addEventListener("click", displaySurah);

// السماح بالضغط على Enter
surahInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") displaySurah();
});

}) .catch(error => { console.error("❌ فشل تحميل السور", error); });




function displayAnalyzeResults(words) {
  if (!Array.isArray(words) || words.length === 0) return;

  const tableHTML = `
    <div class="overflow-x-auto mt-4">
      <table class="min-w-full bg-white border border-gray-300 rounded shadow text-sm">
        <thead class="bg-green-700 text-white">
          <tr>
            <th class="px-4 py-2 border">#</th>
            <th class="px-4 py-2 border">الكلمة</th>
            <th class="px-4 py-2 border">القيمة</th>
            <th class="px-4 py-2 border">التبسيط</th>
          </tr>
        </thead>
        <tbody>
          ${words.map((word, i) => `
            <tr class="text-center">
              <td class="px-4 py-1 border">${i + 1}</td>
              <td class="px-4 py-1 border">${word.text}</td>
              <td class="px-4 py-1 border">${word.value}</td>
              <td class="px-4 py-1 border">${word.simplified ?? "-"}</td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;

  const resultContainer = document.getElementById("result");
  resultContainer.innerHTML = tableHTML;
}



let allSurahsData = {};

async function loadSurahsLocally() {
  try {
    const res = await fetch('surahs_full.json');
    allSurahsData = await res.json();
  } catch (err) {
    console.error("فشل تحميل السور المحلية:", err);
  }
}

function loadSurah(surahId) {
  const surah = allSurahsData[surahId];
  if (!surah) {
    alert("تعذر العثور على السورة.");
    return;
  }

  const fullText = surah.join(" ");
  document.getElementById("inputText").value = fullText;
  analyze();
}

// تحميل السور تلقائيًا عند بداية الصفحة
window.addEventListener('DOMContentLoaded', loadSurahsLocally);



// ✅ زر نسخ النتيجة مع تنبيه مرئي وتغيير لون
function copyResult() {
  const resultText = document.getElementById("result").innerText + "\n" +
                     document.getElementById("wordDetails").innerText;
  navigator.clipboard.writeText(resultText).then(() => {
    const copyBtn = document.getElementById("copyBtn");
    const originalColor = copyBtn.style.backgroundColor;
    copyBtn.style.backgroundColor = "#16a34a"; // أخضر
    copyBtn.textContent = "✔ تم النسخ";
    setTimeout(() => {
      copyBtn.style.backgroundColor = originalColor;
      copyBtn.textContent = "نسخ النتيجة";
    }, 2000);
  });
}

// ✅ إدخال صوتي باستخدام SpeechRecognition
function initVoiceInput() {
  const micBtn = document.getElementById("micBtn");
  const inputField = document.getElementById("inputText");

  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    micBtn.disabled = true;
    micBtn.textContent = "🎤 غير مدعوم";
    return;
  }

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "ar-SA";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  micBtn.addEventListener("click", () => {
    micBtn.textContent = "🎙️ يستمع...";
    recognition.start();
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    inputField.value = transcript;
    micBtn.textContent = "🎤 إدخال صوتي";
    analyze();
  };

  recognition.onerror = () => {
    micBtn.textContent = "🎤 حاول مرة أخرى";
  };
}

window.addEventListener("DOMContentLoaded", initVoiceInput);
