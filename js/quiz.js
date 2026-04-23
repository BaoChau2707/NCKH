// Quiz management

class QuizManager {
  constructor() {
    this.currentQuestion = 0;
    this.score = 0;
    this.answered = false;
    this.selectedTime = 15;
    this.questionCount = 10;
    this.difficulty = 'normal';
    
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
      showToast('Tính năng upload file PDF/DOCX!');
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
  }
  
  startQuiz() {
    this.currentQuestion = 0;
    this.score = 0;
    this.answered = false;
    
    this.setupEl.style.display = 'none';
    this.playEl.style.display = 'block';
    this.doneEl.style.display = 'none';
    
    this.showQuestion();
  }
  
  showQuestion() {
    this.answered = false;
    const data = this.quizData[this.currentQuestion];
    
    // Update progress
    const progressEl = document.getElementById('quiz-progress');
    progressEl.textContent = `Câu ${this.currentQuestion + 1} / ${this.quizData.length}`;
    
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
    // Hide question elements
    document.getElementById('quiz-opts').innerHTML = '';
    document.getElementById('quiz-q').textContent = '';
    document.getElementById('quiz-progress').textContent = '';
    document.getElementById('btn-next').style.display = 'none';
    
    // Show results
    this.doneEl.style.display = 'block';
    const scoreEl = document.getElementById('quiz-score');
    scoreEl.textContent = `Kết quả: ${this.score}/${this.quizData.length} câu đúng`;
    
    // Add leaves reward
    if (window.appState) {
      window.appState.leaves = addLeaves(10, window.appState.leaves);
      updateLeavesDisplay(window.appState.leaves);
      saveData('leaves', window.appState.leaves);
    }
    
    showToast('🎉 Hoàn thành quiz! +10 lá cây');
  }
  
  resetQuiz() {
    this.setupEl.style.display = 'block';
    this.playEl.style.display = 'none';
    this.doneEl.style.display = 'none';
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
