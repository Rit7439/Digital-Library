const API_URL = 'http://localhost:5000/api';
const authModal = document.getElementById('authModal');
const profileBtn = document.getElementById('profileBtn');
const closeModal = document.getElementById('closeModal');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const toggleSignup = document.getElementById('toggleSignup');
const toggleLogin = document.getElementById('toggleLogin');

// Open modal on profile click
profileBtn.addEventListener('click', () => {
    authModal.classList.remove('hidden');
});

// Close modal
closeModal.addEventListener('click', () => {
    authModal.classList.add('hidden');
});

// Close modal on backdrop click
authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
        authModal.classList.add('hidden');
    }
});

// Toggle to Sign Up form
toggleSignup.addEventListener('click', () => {
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
});

// Toggle to Login form
toggleLogin.addEventListener('click', () => {
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// Login Form Submission
loginForm.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            alert(`Welcome back, ${data.user.fullName}!`);
            authModal.classList.add('hidden');
            updateUIAfterLogin(data.user);
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        alert('Error connecting to server');
        console.error(error);
    }
});

//----Navigation--//
const myBooksSection = document.getElementById('myBooksSection');
const freeBooksSection = document.getElementById('freeBooksSection');
const historySection = document.getElementById('historySection');

const navMyBooks = document.getElementById('navMyBooks');
const navFreeBooks = document.getElementById('navFreeBooks');
const navHistory = document.getElementById('navHistory');

// Back buttons
const backFromMyBooks = document.getElementById('backFromMyBooks');
const backFromFreeBooks = document.getElementById('backFromFreeBooks');
const backFromHistory = document.getElementById('backFromHistory');

function showSection(section) {
    myBooksSection.classList.add('hidden');
    freeBooksSection.classList.add('hidden');
    historySection.classList.add('hidden');
    section.classList.remove('hidden');
}

function backToHome() {
    myBooksSection.classList.add('hidden');
    freeBooksSection.classList.add('hidden');
    historySection.classList.add('hidden');
}

navMyBooks.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(myBooksSection);
});

navFreeBooks.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(freeBooksSection);
});

navHistory.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(historySection);
});

backFromMyBooks.addEventListener('click', backToHome);
backFromFreeBooks.addEventListener('click', backToHome);
backFromHistory.addEventListener('click', backToHome);

// ================= MY BOOKS FILTERING =================
const filterTabs = document.querySelectorAll('.filter-tab');
const mybookItems = document.querySelectorAll('.mybook-item');

filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const filter = tab.dataset.filter;

        // Update active tab
        filterTabs.forEach(t => {
            t.classList.remove('border-blue-900', 'text-blue-900');
            t.classList.add('text-gray-600');
        });
        tab.classList.add('border-blue-900', 'text-blue-900');
        tab.classList.remove('text-gray-600');

        // Filter books
        mybookItems.forEach(item => {
            const status = item.dataset.status;
            if (filter === 'all' || status === filter) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// ================= FREE BOOKS CATEGORY FILTER =================
const freeCategoryBtns = document.querySelectorAll('.free-category');
const freebookItems = document.querySelectorAll('.freebook-item');

freeCategoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.dataset.category;

        // Update active button
        freeCategoryBtns.forEach(b => {
            b.classList.remove('bg-blue-900', 'text-white');
            b.classList.add('bg-gray-200', 'text-gray-700');
        });
        btn.classList.add('bg-blue-900', 'text-white');
        btn.classList.remove('bg-gray-200', 'text-gray-700');

        // Filter books
        freebookItems.forEach(item => {
            const itemCategory = item.dataset.category;
            if (category === 'all' || itemCategory === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// ================= HISTORY TIMELINE FILTER =================
const historyTabs = document.querySelectorAll('.history-tab');
const historyItems = document.querySelectorAll('.history-item');

historyTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const timeline = tab.dataset.timeline;

        // Update active tab
        historyTabs.forEach(t => {
            t.classList.remove('border-blue-900', 'text-blue-900');
            t.classList.add('text-gray-600');
        });
        tab.classList.add('border-blue-900', 'text-blue-900');
        tab.classList.remove('text-gray-600');

        // Filter history items
        historyItems.forEach(item => {
            const status = item.dataset.status;
            if (timeline === 'all' || status === timeline) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// === DROP BOOK ACTION ===
const dropButtons = document.querySelectorAll('.drop-btn');

dropButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.history-item');
        const reasonSelect = card.querySelector('.drop-reason');
        const reason = reasonSelect.value;

        if (!reason) {
            alert('Please select a drop reason.');
            return;
        }

        card.dataset.status = 'dropped';
        const statusTag = card.querySelector('.inline-block');
        if (statusTag) {
            statusTag.textContent = '⊘ Dropped';
            statusTag.className = 'inline-block bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full';
        }

        const reasonNote = document.createElement('p');
        reasonNote.className = 'text-sm text-gray-600 mt-2';
        reasonNote.textContent = `Dropped reason: ${reason}`;

        if (!card.querySelector('.dropped-reason-note')) {
            reasonNote.classList.add('dropped-reason-note');
            card.querySelector('.flex-grow').appendChild(reasonNote);
        }

        const actionWrap = btn.closest('.mt-4');
        if (actionWrap) actionWrap.style.display = 'none';

        // If currently viewing dropdown and not 'all', hide as needed
        const activeTab = document.querySelector('.history-tab.border-blue-900');
        if (activeTab && activeTab.dataset.timeline !== 'all' && activeTab.dataset.timeline !== 'dropped') {
            card.style.display = 'none';
        }
    });
});

// ================= LANGUAGE FILTER SYSTEM =================

const languageBtn = document.getElementById('languageBtn');
const languageMenu = document.getElementById('languageMenu');
const selectedLanguage = document.getElementById('selectedLanguage');
const languageFlag = document.getElementById('languageFlag');
const languageOptions = document.querySelectorAll('.language-option');
const books = document.querySelectorAll('.book-card');

languageBtn.addEventListener('click', () => {
    languageMenu.classList.toggle('hidden');
});

languageOptions.forEach(option => {
    option.addEventListener('click', () => {
        const lang = option.dataset.language;
        const flag = option.dataset.flag;
        const text = option.textContent.trim();

        selectedLanguage.textContent = text;
        languageFlag.textContent = flag;

        localStorage.setItem('libraryLanguage', lang);
        filterLanguage(lang);
        languageMenu.classList.add('hidden');
    });
});

function filterLanguage(lang) {
    books.forEach(book => {
        const bookLang = book.dataset.language;
        if (lang === 'all') {
            book.style.display = 'block';
        } else {
            book.style.display = (bookLang === lang) ? 'block' : 'none';
        }
    });
}

// Load saved language
window.addEventListener('load', () => {
    const savedLang = localStorage.getItem('libraryLanguage');
    if (savedLang) {
        const selected = document.querySelector(`.language-option[data-language="${savedLang}"]`);
        if (selected) {
            selectedLanguage.textContent = selected.textContent.trim();
            languageFlag.textContent = selected.dataset.flag;
        }
        filterLanguage(savedLang);
    }
});

// ================= PROMO SLIDER =================
const slider = document.getElementById('promoSlider');
const dots = document.querySelectorAll('.dot');
const prevSlideBtn = document.getElementById('prevSlide');
const nextSlideBtn = document.getElementById('nextSlide');
const progressBar = document.getElementById('sliderProgress');

let currentSlide = 0;
const totalSlides = slider.children.length;
const slideDuration = 5000;
let sliderTimer;

function updateDots(index) {
    dots.forEach((d, i) => {
        d.classList.remove('bg-white');
        d.classList.add('bg-white/60');
        if (i === index) {
            d.classList.remove('bg-white/60');
            d.classList.add('bg-white');
        }
    });
}

function showSlide(index) {
    currentSlide = (index + totalSlides) % totalSlides;
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    updateDots(currentSlide);
    resetProgress();
    resetTimer();
}

function resetTimer() {
    clearInterval(sliderTimer);
    sliderTimer = setInterval(() => {
        showSlide(currentSlide + 1);
    }, slideDuration);
}

function resetProgress() {
    progressBar.style.width = '0%';
    let progress = 0;
    const step = 100 / (slideDuration / 50);
    const progressInterval = setInterval(() => {
        progress += step;
        if (progress >= 100) {
            progressBar.style.width = '100%';
            clearInterval(progressInterval);
        } else {
            progressBar.style.width = `${progress}%`;
        }
    }, 50);
}

prevSlideBtn.addEventListener('click', () => showSlide(currentSlide - 1));
nextSlideBtn.addEventListener('click', () => showSlide(currentSlide + 1));

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
});

// start
showSlide(0);
resetTimer();

// Sign Up Form Submission
signupForm.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fullName = signupForm.querySelector('input[type="text"]').value;
    const email = signupForm.querySelector('input[type="email"]').value;
    const password = signupForm.querySelectorAll('input[type="password"]')[0].value;
    const confirmPassword = signupForm.querySelectorAll('input[type="password"]')[1].value;

    try {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, password, confirmPassword })
        });
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            alert(`Welcome, ${data.user.fullName}!`);
            authModal.classList.add('hidden');
            updateUIAfterLogin(data.user);
        } else {
            alert(data.message || 'Sign up failed');
        }
    } catch (error) {
        alert('Error connecting to server');
        console.error(error);
    }
});

// Update UI after successful login
function updateUIAfterLogin(user) {
    profileBtn.style.opacity = '0.7';
    profileBtn.title = `Logged in as ${user.fullName}`;
}

// Check if user is already logged in
window.addEventListener('load', () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
        const userData = JSON.parse(user);
        updateUIAfterLogin(userData);
    }
});

window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('heroCaption').classList.add('show');
    }, 600);
});
