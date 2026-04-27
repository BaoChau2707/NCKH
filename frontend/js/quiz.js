// Quiz management

class QuizManager {
  constructor() {
    this.currentQuestion = 0;
    this.score = 0;
    this.answered = false;
    this.selectedTime = 15;
    this.questionCount = 10;
    this.difficulty = 'normal';
    this.quizTimer = null;
    this.remainingTime = 0;
    this.timeCardUsed = false;
    
    // Sample quiz data
    this.quizData = [
      { 
        q: "Tính năng nào giúp nghe nhạc khi học?", 
        opts: ["Study Alone", "Group Study", "Quiz", "Mission"], 
        ans: 0 
      },
      { 
        q: "Group Study tối đa bao nhiêu thành viên?", 
        opts: ["2 người", "3 người", "5 người", "10 người"], 
        ans: 1 
      },
      { 
        q: "Để tăng slot Group Study, cần bao nhiêu lá?", 
        opts: ["100 lá", "200 lá", "300 lá", "500 lá"], 
        ans: 2 
      },
      { 
        q: "Module 3 tạo loại câu hỏi gì từ tài liệu?", 
        opts: ["Tự luận", "Điền vào chỗ trống", "Trắc nghiệm", "Ghép đôi"], 
        ans: 2 
      },
      { 
        q: "Nhiệm vụ mỗi ngày tối đa bao nhiêu lá cây?", 
        opts: ["50 lá", "80 lá", "100 lá", "200 lá"], 
        ans: 2 
      },
    ];
    
    this.uploadedText = '';
    
    this.init();
  }
  
  init() {
    // Setup elements
    this.setupEl = document.getElementById('quiz-setup');
    this.playEl = document.getElementById('quiz-play');
    this.doneEl = document.getElementById('quiz-done');
    
    // Settings
    const qCountSlider = document.getElementById('q-count-slider');
    const qCountVal = document.getElementById('q-count-val');
    
    qCountSlider.addEventListener('input', (e) => {
      this.questionCount = parseInt(e.target.value);
      qCountVal.textContent = this.questionCount;
    });
    
    // Time pills
    const timePills = document.querySelectorAll('.time-pill');
    timePills.forEach(pill => {
      pill.addEventListener('click', () => {
        timePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.selectedTime = parseInt(pill.dataset.time);
      });
    });
    
    // Difficulty
    const diffSelect = document.getElementById('difficulty-select');
    diffSelect.addEventListener('change', (e) => {
      this.difficulty = e.target.value;
    });
    
    // Upload area
    const uploadArea = document.getElementById('upload-area');
    uploadArea.addEventListener('click', () => {
      this.handleFileUpload();
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.style.background = '#d0f0d9';
    });
    
    uploadArea.addEventListener('dragleave', () => {
      uploadArea.style.background = '';
    });
    
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.style.background = '';
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.processFile(files[0]);
      }
    });
    
    // Start quiz button
    const startBtn = document.getElementById('start-quiz-btn');
    startBtn.addEventListener('click', () => this.startQuiz());
    
    // Next button
    const nextBtn = document.getElementById('btn-next');
    nextBtn.addEventListener('click', () => this.nextQuestion());
    
    // Reset button
    const resetBtn = document.getElementById('reset-quiz-btn');
    resetBtn.addEventListener('click', () => this.resetQuiz());
    
    // Time card button (will add to UI)
    this.addTimeCardButton();
  }
  
  handleFileUpload() {
    // Check if logged in
    if (!window.authManager || !window.authManager.isUserLoggedIn()) {
      showToast('⚠️ Vui lòng đăng nhập để upload file!');
      setTimeout(() => {
        if (window.authManager) {
          window.authManager.showLoginDialog();
        }
      }, 1000);
      return;
    }
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.pdf,.docx,.doc';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        this.processFile(file);
      }
    };
    input.click();
  }
  
  processFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (file.size > maxSize) {
      showToast('❌ File quá lớn! Tối đa 10MB');
      return;
    }
    
    showToast('⏳ Đang xử lý file...');
    
    const fileType = file.name.split('.').pop().toLowerCase();
    
    if (fileType === 'txt') {
      this.processTxtFile(file);
    } else if (fileType === 'pdf') {
      this.processPdfFile(file);
    } else if (fileType === 'docx' || fileType === 'doc') {
      this.processDocxFile(file);
    } else {
      showToast('❌ Định dạng file không hỗ trợ!');
    }
  }
  
  processTxtFile(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target.result;
      this.uploadedText = text;
      
      // Generate questions
      this.generateQuestionsFromText(text);
      
      // Save file info
      this.saveUploadedFile(file.name, text);
      
      showToast(`✅ Đã tải file: ${file.name}`);
    };
    
    reader.onerror = () => {
      showToast('❌ Lỗi đọc file!');
    };
    
    reader.readAsText(file);
  }
  
  processPdfFile(file) {
    // Use PDF.js library
    if (typeof pdfjsLib === 'undefined') {
      this.loadPdfJs().then(() => {
        this.extractPdfText(file);
      });
    } else {
      this.extractPdfText(file);
    }
  }
  
  loadPdfJs() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  
  async extractPdfText(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }
      
      this.uploadedText = fullText;
      this.generateQuestionsFromText(fullText);
      this.saveUploadedFile(file.name, fullText);
      
      showToast(`✅ Đã xử lý PDF: ${file.name} (${pdf.numPages} trang)`);
    } catch (error) {
      console.error('PDF error:', error);
      showToast('❌ Lỗi xử lý PDF! Vui lòng thử file khác.');
    }
  }
  
  processDocxFile(file) {
    // Use mammoth.js library
    if (typeof mammoth === 'undefined') {
      this.loadMammoth().then(() => {
        this.extractDocxText(file);
      });
    } else {
      this.extractDocxText(file);
    }
  }
  
  loadMammoth() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  
  async extractDocxText(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
      
      this.uploadedText = result.value;
      this.generateQuestionsFromText(result.value);
      this.saveUploadedFile(file.name, result.value);
      
      showToast(`✅ Đã xử lý DOCX: ${file.name}`);
    } catch (error) {
      console.error('DOCX error:', error);
      showToast('❌ Lỗi xử lý DOCX! Vui lòng thử file khác.');
    }
  }
  
  saveUploadedFile(fileName, content) {
    if (!window.authManager || !window.authManager.isUserLoggedIn()) return;
    
    const fileData = {
      name: fileName,
      content: content.substring(0, 1000), // Save first 1000 chars
      uploadedAt: new Date().toISOString(),
      questionCount: this.quizData.length
    };
    
    window.authManager.addUploadedFile(fileData);
  }
  
  generateQuestionsFromText(text) {
    // Simple question generation from text
    // In production, this would use AI/NLP
    
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const newQuestions = [];
    
    for (let i = 0; i < Math.min(this.questionCount, sentences.length); i++) {
      const sentence = sentences[i].trim();
      const words = sentence.split(' ').filter(w => w.length > 3);
      
      if (words.length < 3) continue;
      
      // Create fill-in-the-blank question
      const blankIndex = Math.floor(Math.random() * words.length);
      const correctAnswer = words[blankIndex];
      const question = sentence.replace(correctAnswer, '______');
      
      // Generate wrong answers
      const wrongAnswers = this.generateWrongAnswers(correctAnswer, words);
      
      // Shuffle options
      const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
      const correctIndex = options.indexOf(correctAnswer);
      
      newQuestions.push({
        q: question,
        opts: options,
        ans: correctIndex
      });
    }
    
    if (newQuestions.length > 0) {
      this.quizData = newQuestions;
      showToast(`✨ Đã tạo ${newQuestions.length} câu hỏi từ văn bản!`);
    }
  }
  
  generateWrongAnswers(correct, wordPool) {
    const wrong = [];
    const used = new Set([correct]);
    
    while (wrong.length < 3 && wordPool.length > wrong.length) {
      const word = wordPool[Math.floor(Math.random() * wordPool.length)];
      if (!used.has(word) && word !== correct) {
        wrong.push(word);
        used.add(word);
      }
    }
    
    // Fill with generic wrong answers if needed
    while (wrong.length < 3) {
      wrong.push(`Option ${wrong.length + 1}`);
    }
    
    return wrong;
  }
  
  addTimeCardButton() {
    // Add time card button to quiz play screen
    const progressEl = document.getElementById('quiz-progress');
    if (progressEl && !document.getElementById('use-timecard-btn')) {
      const btn = document.createElement('button');
      btn.id = 'use-timecard-btn';
      btn.textContent = '⏱️ Dùng Time Card (+5 phút)';
      btn.style.cssText = 'margin-left:10px;padding:4px 10px;background:#ff9800;color:white;border:none;border-radius:6px;cursor:pointer;font-size:11px;';
      btn.onclick = () => this.useTimeCard();
      progressEl.parentElement.insertBefore(btn, progressEl.nextSibling);
      btn.style.display = 'none'; // Hide initially
    }
  }
  
  useTimeCard() {
    if (this.timeCardUsed) {
      showToast('⚠️ Đã dùng Time Card rồi!');
      return;
    }
    
    if (window.shopManager && window.shopManager.useTimeCard()) {
      this.remainingTime += 300; // Add 5 minutes
      this.timeCardUsed = true;
      document.getElementById('use-timecard-btn').style.display = 'none';
      showToast('✅ Đã thêm 5 phút!');
    }
  }
  
  startQuiz() {
    this.currentQuestion = 0;
    this.score = 0;
    this.answered = false;
    this.timeCardUsed = false;
    this.remainingTime = this.selectedTime * 60; // Convert to seconds
    
    this.setupEl.style.display = 'none';
    this.playEl.style.display = 'block';
    this.doneEl.style.display = 'none';
    
    // Show time card button if user has cards
    const timeCardBtn = document.getElementById('use-timecard-btn');
    if (timeCardBtn && window.shopManager && window.shopManager.timeCards > 0) {
      timeCardBtn.style.display = 'inline-block';
    }
    
    // Start timer
    this.startQuizTimer();
    
    this.showQuestion();
  }
  
  startQuizTimer() {
    this.quizTimer = setInterval(() => {
      this.remainingTime--;
      this.updateTimerDisplay();
      
      if (this.remainingTime <= 0) {
        this.timeUp();
      }
    }, 1000);
  }
  
  updateTimerDisplay() {
    const progressEl = document.getElementById('quiz-progress');
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;
    const timeStr = `${minutes}:${String(seconds).padStart(2, '0')}`;
    
    // Update progress text to include timer
    progressEl.textContent = `Câu ${this.currentQuestion + 1} / ${this.quizData.length} | ⏱️ ${timeStr}`;
    
    // Change color when time is low
    if (this.remainingTime <= 60) {
      progressEl.style.color = '#d32f2f';
    } else {
      progressEl.style.color = '';
    }
  }
  
  timeUp() {
    clearInterval(this.quizTimer);
    showToast('⏰ Hết giờ!');
    this.finishQuiz();
  }
  
  showQuestion() {
    this.answered = false;
    const data = this.quizData[this.currentQuestion];
    
    // Update progress with timer
    this.updateTimerDisplay();
    
    // Show question
    const questionEl = document.getElementById('quiz-q');
    questionEl.textContent = data.q;
    
    // Show options
    const optsEl = document.getElementById('quiz-opts');
    optsEl.innerHTML = '';
    
    data.opts.forEach((opt, index) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt';
      btn.textContent = String.fromCharCode(65 + index) + '. ' + opt;
      btn.addEventListener('click', () => this.selectAnswer(index, btn, data.ans));
      optsEl.appendChild(btn);
    });
    
    // Hide next button
    document.getElementById('btn-next').style.display = 'none';
  }
  
  selectAnswer(selectedIndex, btn, correctIndex) {
    if (this.answered) return;
    
    this.answered = true;
    
    if (selectedIndex === correctIndex) {
      btn.classList.add('correct');
      this.score++;
    } else {
      btn.classList.add('wrong');
      // Show correct answer
      const opts = document.querySelectorAll('.quiz-opt');
      opts[correctIndex].classList.add('correct');
    }
    
    // Show next button
    document.getElementById('btn-next').style.display = 'block';
  }
  
  nextQuestion() {
    this.currentQuestion++;
    
    if (this.currentQuestion < this.quizData.length) {
      this.showQuestion();
    } else {
      this.finishQuiz();
    }
  }
  
  finishQuiz() {
    // Stop timer
    clearInterval(this.quizTimer);
    
    // Hide question elements
    document.getElementById('quiz-opts').innerHTML = '';
    document.getElementById('quiz-q').textContent = '';
    document.getElementById('quiz-progress').textContent = '';
    document.getElementById('btn-next').style.display = 'none';
    
    const timeCardBtn = document.getElementById('use-timecard-btn');
    if (timeCardBtn) timeCardBtn.style.display = 'none';
    
    // Show results
    this.doneEl.style.display = 'block';
    const scoreEl = document.getElementById('quiz-score');
    const percentage = Math.round((this.score / this.quizData.length) * 100);
    scoreEl.textContent = `Kết quả: ${this.score}/${this.quizData.length} câu đúng (${percentage}%)`;
    
    // Calculate reward based on score
    let reward = 10;
    if (percentage >= 90) reward = 20;
    else if (percentage >= 70) reward = 15;
    else if (percentage < 50) reward = 5;
    
    // Add leaves reward
    if (window.appState) {
      window.appState.leaves = addLeaves(reward, window.appState.leaves);
      updateLeavesDisplay(window.appState.leaves);
      saveData('leaves', window.appState.leaves);
    }
    
    // Update done message
    const doneMsg = this.doneEl.querySelector('div:nth-child(3)');
    if (doneMsg) {
      doneMsg.textContent = `+${reward} lá cây đã được cộng!`;
    }
    
    showToast(`🎉 Hoàn thành quiz! +${reward} lá cây`);
  }
  
  resetQuiz() {
    this.setupEl.style.display = 'block';
    this.playEl.style.display = 'none';
    this.doneEl.style.display = 'none';
    clearInterval(this.quizTimer);
  }
}

// Initialize
let quizManager = null;

function initQuiz() {
  quizManager = new QuizManager();
  window.quizManager = quizManager;
}

// Export
window.initQuiz = initQuiz;
window.QuizManager = QuizManager;
