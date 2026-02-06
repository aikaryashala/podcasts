/**
 * AI Karyashala Podcasts - Main JavaScript
 * YouTube-style interface with clickable thumbnails and modal player
 */

// ============================================
// VIDEO DATA - Hardcoded podcast entries
// ============================================
const videoData = [
    {
        date: "27-10-2025",
        topic: "Stack frames explanation using program counter",
        file: "assets/videos/Stackframes.m4a"
    },
    {
        date: "23-11-2025",
        topic: "C++ compiler, Python interpreter, Java compile to byte code and run on JVM",
        file: "assets/videos/c++ compiler.m4a"
    },
    {
        date: "24-11-2025",
        topic: "Python VM, Python ByteCode, Python debugging",
        file: "assets/videos/pythonvm.m4a"
    },
    {
        date: "10-12-2025",
        topic: "Python is Value-Typed Language, integer object, container datatypes: list, set, dict, tuple",
        file: "assets/videos/pythonvaluetyped.m4a"
    },
    {
        date: "13-12-2025",
        topic: "9th Dec class: some Python concepts with program",
        file: "assets/videos/python concepts.m4a"
    },
    {
        date: "17-12-2025",
        topic: "Caches: DNS cache in browser, DNS cache in OS, website files cache, CPU L1/L2 cache",
        file: "assets/videos/caches.m4a"
    },
    {
        date: "17-12-2025",
        topic: "DNS to IP Address, HTTP Request",
        file: "assets/videos/dns to ip.mp4"
    },
    {
        date: "19-12-2025",
        topic: "Programs: C, Python, Java — how programs are converted to run on machine",
        file: "assets/videos/how programs.m4a"
    },
    {
        date: "19-12-2025",
        topic: "Call Stack Internals: running in memory, program counter, return address",
        file: "assets/videos/call stack internals.m4a"
    },
    {
        date: "24-12-2025",
        topic: "C process execution flow and function call stack; stack frames, PC, base pointer, SP; view in lldb",
        file: "assets/videos/Cprocessexecution.m4a"
    },
    {
        date: "25-12-2025",
        topic: "AIK BT customized lldb command",
        file: "assets/videos/aikbt.m4a"
    },
    {
        date: "02-01-2026",
        topic: "Client-server model with SSH remote sessions: SSH client and sshd server",
        file: "assets/videos/clientserver.m4a"
    },
    {
        date: "02-01-2026",
        topic: "APIs in client-server model",
        file: "assets/videos/api in client server.m4a"
    },
    {
        date: "03-01-2026",
        topic: "URL, URI, request/response, curl, netcat, browser dev-tools",
        file: "assets/videos/url uri.m4a"
    }
];

// ============================================
// DOM ELEMENTS
// ============================================
const videoGrid = document.getElementById('videoGrid');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');
const videoCountEl = document.getElementById('videoCount');
const noResultsEl = document.getElementById('noResults');

// Modal elements
const videoModal = document.getElementById('videoModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalVideo = document.getElementById('modalVideo');
const modalVideoSource = document.getElementById('modalVideoSource');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');

// ============================================
// RENDER VIDEO CARDS (YouTube-style thumbnails)
// ============================================

/**
 * Creates a YouTube-style video card with thumbnail
 * @param {Object} video - Video data object with date, topic, and file
 * @param {number} index - Index of the video in the array
 * @returns {HTMLElement} - Video card DOM element
 */
function createVideoCard(video, index) {
    const card = document.createElement('article');
    card.className = 'video-card';
    card.setAttribute('data-index', index);
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Play: ${video.topic}`);

    const formattedDate = video.date;

    card.innerHTML = `
        <div class="video-thumbnail">
            <!-- Date badge overlay -->
            <span class="date-badge">${formattedDate}</span>
            <!-- Play button thumbnail -->
            <div class="thumbnail-placeholder">
                <div class="play-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </div>
                <span class="thumbnail-text">Click to play</span>
            </div>
        </div>
        <div class="card-content">
            <p class="card-date">${formattedDate}</p>
            <p class="card-topic">${video.topic}</p>
        </div>
    `;

    // Click to open modal
    card.addEventListener('click', () => openVideoModal(video));

    // Keyboard accessibility
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openVideoModal(video);
        }
    });

    return card;
}

/**
 * Renders all video cards to the grid
 * @param {Array} videos - Array of video data objects to render
 */
function renderVideoCards(videos) {
    videoGrid.innerHTML = '';

    if (videos.length === 0) {
        noResultsEl.style.display = 'block';
        videoGrid.style.display = 'none';
    } else {
        noResultsEl.style.display = 'none';
        videoGrid.style.display = 'grid';

        videos.forEach((video, index) => {
            const card = createVideoCard(video, index);
            videoGrid.appendChild(card);
        });
    }

    updateVideoCount(videos.length);
}

/**
 * Updates the displayed video count
 * @param {number} count - Number of videos to display
 */
function updateVideoCount(count) {
    videoCountEl.textContent = count;
}

// ============================================
// VIDEO MODAL FUNCTIONALITY
// ============================================

/**
 * Opens the video modal and plays the selected video
 * @param {Object} video - Video data object
 */
function openVideoModal(video) {
    // Set video source
    modalVideoSource.src = video.file;
    modalVideo.load();

    // Set info
    modalTitle.textContent = video.topic;
    modalDate.textContent = video.date;

    // Show modal
    videoModal.classList.add('active');
    document.body.classList.add('modal-open');

    // Auto-play
    modalVideo.play().catch(err => {
        console.log('Autoplay prevented:', err);
    });
}

/**
 * Closes the video modal
 */
function closeVideoModal() {
    // Pause and reset video
    modalVideo.pause();
    modalVideo.currentTime = 0;

    // Hide modal
    videoModal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

// Modal event listeners
modalClose.addEventListener('click', closeVideoModal);
modalOverlay.addEventListener('click', closeVideoModal);

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('active')) {
        closeVideoModal();
    }
});

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

/**
 * Filters videos based on search query
 * @param {string} query - Search query string
 * @returns {Array} - Filtered array of video objects
 */
function filterVideos(query) {
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) {
        return videoData;
    }

    return videoData.filter(video => {
        const topicMatches = video.topic.toLowerCase().includes(normalizedQuery);
        const dateMatches = video.date.includes(normalizedQuery);
        return topicMatches || dateMatches;
    });
}

/**
 * Handles search input changes with debounce
 */
let searchTimeout = null;
function handleSearchInput() {
    const query = searchInput.value;

    clearSearchBtn.style.display = query.length > 0 ? 'flex' : 'none';

    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        const filteredVideos = filterVideos(query);
        renderVideoCards(filteredVideos);
    }, 200);
}

/**
 * Clears the search input and shows all videos
 */
function clearSearch() {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    renderVideoCards(videoData);
    searchInput.focus();
}

// ============================================
// EVENT LISTENERS
// ============================================

searchInput.addEventListener('input', handleSearchInput);
clearSearchBtn.addEventListener('click', clearSearch);

// Escape to clear search (when not in modal)
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.activeElement === searchInput) {
        clearSearch();
    }
});

// ============================================
// INITIALIZATION
// ============================================

function init() {
    renderVideoCards(videoData);
    console.log('🎙️ AI Karyashala Podcasts loaded successfully!');
    console.log(`📹 Total videos: ${videoData.length}`);
}

document.addEventListener('DOMContentLoaded', init);
