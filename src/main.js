

// streamee Main JavaScript
// handles dynamic rendering, player state, modal, and accessibility


// --- Tracks Data ---
const tracks = [
    {
        id: 0,
        title: "Blinding Lights",
        artist: "The Weeknd",
        cover: "https://res.cloudinary.com/dek4qzrjz/image/upload/v1751316721/The_Weeknd_-_Blinding_Lights_lok1y7.png",
        duration: "3:20",
        lyrics: "I've been tryna call\nI've been on my own for long enough\nMaybe you can show me how to love, maybe\nI'm goin' through withdrawals\nYou don't even have to do too much\nYou can turn me on with just a touch, baby\n..."
    },
    {
        id: 1,
        title: "Flowers",
        artist: "Miley Cyrus",
        cover: "https://res.cloudinary.com/dek4qzrjz/image/upload/a3820555646_5_dgqdid.jpg",
        duration: "3:20",
        lyrics: "We were good, we were gold\nKinda dream that can't be sold\n..."
    },
    {
        id: 2,
        title: "Save Your Tears",
        artist: "The Weeknd",
        cover: "https://res.cloudinary.com/dek4qzrjz/image/upload/ab67616d0000b2738863bc11d2aa12b54f5aeb36_jma9p0.jpg",
        duration: "3:35",
        lyrics: "Ooh, na-na, yeah\nI saw you dancing in a crowded room (Oh)\n..."
    },
    {
        id: 3,
        title: "Levitating",
        artist: "Dua Lipa",
        cover: "https://res.cloudinary.com/dek4qzrjz/image/upload/1900x1900-000000-80-0-0_r42uxu.jpg",
        duration: "3:23",
        lyrics: "If you wanna run away with me, I know a galaxy\nAnd I can take you for a ride\n..."
    },
    {
        id: 4,
        title: "Peaches",
        artist: "Justin Bieber",
        cover: "https://res.cloudinary.com/dek4qzrjz/image/upload/peaches_lvptq4.jpg",
        duration: "3:18",
        lyrics: "I get my light right from the source\nYeah, yeah (Ooh, that's right)\n..."
    },
    {
        id: 5,
        title: "Stay",
        artist: "The Kid LAROI, Justin Bieber",
        cover: "https://res.cloudinary.com/dek4qzrjz/image/upload/The_Kid_Laroi_and_Justin_Bieber_-_Stay_qqbhxc.png",
        duration: "2:21",
        lyrics: "I do the same thing I told you that I never would\nI told you I'd change, even when I knew I never could\n..."
    },
    {
        id: 6,
        title: "Don't Start Now",
        artist: "Dua Lipa",
        cover: "https://res.cloudinary.com/dek4qzrjz/image/upload/1900x1900-000000-80-0-0_r42uxu.jpg",
        duration: "3:03",
        lyrics: "If you don't wanna see me\nDid a full 180, crazy\n..."
    },
    {
        id: 7,
        title: "As It Was",
        artist: "Harry Styles",
        cover: "https://res.cloudinary.com/dek4qzrjz/image/upload/Harry_Styles_-_As_It_Was_a6mxyi.png",
        duration: "2:47",
        lyrics: "Come on, Harry, we wanna say goodnight to you\nHoldin' me back\n..."
    },
    {
        id: 8,
        title: "Watermelon Sugar",
        artist: "Harry Styles",
        cover: "https://res.cloudinary.com/dek4qzrjz/image/upload/1900x1900-000000-80-0-0_1_nw4c6x.jpg",
        duration: "2:54",
        lyrics: "Tastes like strawberries\nOn a summer evenin'\n..."
    },
    {
        id: 9,
        title: "Dynamite",
        artist: "BTS",
        cover: "https://res.cloudinary.com/dek4qzrjz/image/upload/bts_dynamite_album_cover_by_sivan67_de3oi68-fullview_eev6w4.jpg",
        duration: "3:19",
        lyrics: "'Cause I, I, I'm in the stars tonight\nSo watch me bring the fire and set the night alight\n..."
    },
    {
        id: 10,
        title: "Sunflower",
        artist: "Post Malone, Swae Lee",
        cover: "https://res.cloudinary.com/dek4qzrjz/image/upload/500x500_m1bxas.jpg",
        duration: "2:38",
        lyrics: "Needless to say, I keep her in check\nShe was all bad-bad, nevertheless\n..."
    },
    {
        id: 11,
        title: "Bad Habits",
        artist: "Ed Sheeran",
        cover: "https://res.cloudinary.com/dek4qzrjz/image/upload/edsgeern_tovgl8.jpg",
        duration: "3:50",
        lyrics: "Every time you come around, you know I can't say no\nEvery time the sun goes down, I let you take control\n..."
    }
];

// --- dynamic track card rendering ---
/**
 * Renders track cards into a grid by track indices.
 * @param {string} gridId - The DOM id of the grid container.
 * @param {number[]} trackIndices - Array of track indices to render.
 */
function renderTrackCards(gridId, trackIndices) {
    const grid = document.getElementById(gridId);
    grid.innerHTML = '';
    trackIndices.forEach(idx => {
        const track = tracks[idx];
        const card = document.createElement('div');
        card.className = 'track-card';
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `${track.title} by ${track.artist}`);
        card.onclick = () => openTrackModal(idx);
        card.innerHTML = `
            <img src="${track.cover}" alt="${track.title} cover" class="track-cover">
            <div class="track-play-btn" tabindex="0" aria-label="Play ${track.title}">
                <i class="fas fa-play"></i>
            </div>
            <div class="track-info">
                <div class="track-title">${track.title}</div>
                <div class="track-artist">${track.artist}</div>
            </div>
        `;
        // play button on card
        card.querySelector('.track-play-btn').addEventListener('click', function(e) {
            e.stopPropagation();
            currentTrack = idx;
            updatePlayer(currentTrack);
            if (!isPlaying) togglePlay();
        });
        // keyboard accessibility for card
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                openTrackModal(idx);
            }
        });
        grid.appendChild(card);
    });
}

// --- player state and DOM ---
let currentTrack = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let likedTracks = new Set();
let progressInterval = null;

// DOM elements
const playerTitle = document.querySelector('.player-track-title');
const playerArtist = document.querySelector('.player-track-artist');
const playerCover = document.querySelector('.player-cover');
const playBtn = document.querySelector('.play-btn i');
const progressFill = document.querySelector('.progress-fill');
const progressBar = document.querySelector('.progress-bar');
const progressTimeCurrent = document.querySelector('.progress-time:first-child');
const progressTimeTotal = document.querySelector('.progress-time:last-child');
const heartBtn = document.querySelector('.player-track .fa-heart').parentElement;
const shuffleBtn = document.querySelector('.fa-random').parentElement;
const repeatBtn = document.querySelector('.fa-redo').parentElement;
const nextBtn = document.querySelector('.fa-step-forward').parentElement;
const prevBtn = document.querySelector('.fa-step-backward').parentElement;

/**
 * updates the player UI with the current track info.
 * @param {number} trackIndex
 */
function updatePlayer(trackIndex) {
    const track = tracks[trackIndex];
    playerTitle.textContent = track.title;
    playerArtist.textContent = track.artist;
    playerCover.src = track.cover;
    progressTimeTotal.textContent = track.duration;
    // Like button
    if (likedTracks.has(trackIndex)) {
        heartBtn.classList.add('liked');
        heartBtn.querySelector('i').style.color = 'var(--primary)';
    } else {
        heartBtn.classList.remove('liked');
        heartBtn.querySelector('i').style.color = '';
    }
    progressFill.style.width = '0%';
    progressTimeCurrent.textContent = '0:00';
}

/**
 * toggles play/pause state and updates UI.
 */
function togglePlay() {
    isPlaying = !isPlaying;
    if (isPlaying) {
        playBtn.classList.remove('fa-play');
        playBtn.classList.add('fa-pause');
        updateProgress();
    } else {
        playBtn.classList.remove('fa-pause');
        playBtn.classList.add('fa-play');
        if (progressInterval) clearInterval(progressInterval);
    }
}

/**
 * updates the progress bar and time display.
 */
function updateProgress() {
    if (progressInterval) clearInterval(progressInterval);
    let current = 0;
    const duration = 200; // seconds for demo
    progressInterval = setInterval(() => {
        if (!isPlaying) {
            clearInterval(progressInterval);
            return;
        }
        current++;
        const percent = (current / duration) * 100;
        progressFill.style.width = `${percent}%`;
        const minutes = Math.floor(current / 60);
        const seconds = current % 60;
        progressTimeCurrent.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        if (current >= duration) {
            clearInterval(progressInterval);
            if (isRepeat) {
                updatePlayer(currentTrack);
                togglePlay();
            } else {
                nextTrack();
            }
        }
    }, 1000);
}

// --- shuffle/repeat/like logic ---
function getNextTrackIndex() {
    if (isShuffle) {
        let next;
        do {
            next = Math.floor(Math.random() * tracks.length);
        } while (next === currentTrack && tracks.length > 1);
        return next;
    }
    return (currentTrack + 1) % tracks.length;
}
function getPrevTrackIndex() {
    if (isShuffle) {
        let prev;
        do {
            prev = Math.floor(Math.random() * tracks.length);
        } while (prev === currentTrack && tracks.length > 1);
        return prev;
    }
    return (currentTrack - 1 + tracks.length) % tracks.length;
}
function nextTrack() {
    currentTrack = getNextTrackIndex();
    updatePlayer(currentTrack);
    if (isPlaying) {
        togglePlay();
        togglePlay();
    }
}
function prevTrack() {
    currentTrack = getPrevTrackIndex();
    updatePlayer(currentTrack);
    if (isPlaying) {
        togglePlay();
        togglePlay();
    }
}

// --- event listeners for player controls ---
shuffleBtn.addEventListener('click', function() {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
    shuffleBtn.style.color = isShuffle ? 'var(--primary)' : '';
});
repeatBtn.addEventListener('click', function() {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active', isRepeat);
    repeatBtn.style.color = isRepeat ? 'var(--primary)' : '';
});
heartBtn.addEventListener('click', function() {
    if (likedTracks.has(currentTrack)) {
        likedTracks.delete(currentTrack);
    } else {
        likedTracks.add(currentTrack);
    }
    updatePlayer(currentTrack);
});

// --- modal functions ---
function openTrackModal(trackId) {
    currentTrack = trackId;
    const track = tracks[trackId];
    document.getElementById('modalTrackTitle').textContent = track.title;
    document.getElementById('modalTrackArtist').textContent = track.artist;
    document.getElementById('modalTrackCover').src = track.cover;
    document.getElementById('modalTrackLyrics').textContent = track.lyrics;
    document.getElementById('trackModal').classList.add('active');
    // focus close button for accessibility
    setTimeout(() => {
        document.querySelector('.modal-close').focus();
    }, 100);
}
function closeModal() {
    document.getElementById('trackModal').classList.remove('active');
}
function playCurrentModalTrack() {
    closeModal();
    updatePlayer(currentTrack);
    if (!isPlaying) {
        togglePlay();
    }
}
// keyboard accessibility for modal
window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
});

// --- player controls ---
const playBtnEl = document.querySelector('.play-btn');
playBtnEl.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);
progressBar.addEventListener('click', function(e) {
    const percent = e.offsetX / this.offsetWidth;
    progressFill.style.width = `${percent * 100}%`;
    const duration = 200;
    const current = Math.floor(percent * duration);
    const minutes = Math.floor(current / 60);
    const seconds = current % 60;
    progressTimeCurrent.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
});

// --- render Track Cards ---
renderTrackCards('recently-played-grid', [0,1,2,3,4,5]);
renderTrackCards('made-for-you-grid', [6,7,8,9,10,11]);
// --- Initialize player ---
updatePlayer(0);

// ---accessibility ---
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
    }
});
document.addEventListener('mousedown', function() {
    document.body.classList.remove('user-is-tabbing');
});



// --- custom song card rendering and play logic ---
const recentlyPlayed = document.getElementById("recently-played-grid");

// reusable card rendering function
function renderSongCard(song) {
  const cover = song.coverUrl || "https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2";

  const card = document.createElement("div");
  card.className = "track-card";

  card.innerHTML = `
    <img src="${cover}" class="track-cover" alt="${song.title}">
    <div class="track-info">
      <div class="track-title">${song.title}</div>
      <div class="track-artist">${song.artist}</div>
    </div>
    <button class="track-play-btn" onclick="playSong('${song.fileUrl}', '${song.title}', '${song.artist}', '${cover}')">
      <i class="fas fa-play"></i>
    </button>
  `;

  recentlyPlayed.appendChild(card);
}

// the function to play song in player
function playSong(url, title, artist, cover) {
  document.querySelector(".player-track-title").textContent = title;
  document.querySelector(".player-track-artist").textContent = artist;
  document.querySelector(".player-cover").src = cover;

  if (window.currentAudio) window.currentAudio.pause();

  window.currentAudio = new Audio(url);
  window.currentAudio.play();
}

//it fetch all songs from backend
async function fetchSongs() {
  try {
    const res = await fetch("http://localhost:5000/api/songs"); // my backend URL
    const data = await res.json();

    if (data.status === "success") {
      data.data.songs.forEach(song => {
        renderSongCard({
          title: song.title,
          artist: song.artist,
          url: song.url || song.fileUrl, // fallback if stored as fileUrl
          coverUrl: song.coverUrl
        });
      });
    } else {
      console.error("❌ Failed to fetch songs:", data.message);
    }
  } catch (err) {
    console.error("❌ Error fetching songs:", err);
  }
}

// Run on page load
fetchSongs();

fetch("http://localhost:5000/api/songs")
  .then(res => res.json())
  .then(data => {
    const songsContainer = document.getElementById("songs-container");

    data.data.songs.forEach(song => {
      const songCard = document.createElement("div");
      songCard.className = "song-card";

      songCard.innerHTML = `
        <img src="${song.coverUrl}" alt="${song.title}" class="cover-img"/>
        <h3>${song.title}</h3>
        <p>${song.artist}</p>
        <audio controls>
          <source src="${song.url}" type="audio/mp3">
          Your browser does not support the audio element.
        </audio>
      `;

      songsContainer.appendChild(songCard);
    });
  })
  .catch(err => console.error("Fetch error:", err));

// streamee main javascript
// to fetch songs, render grid, and fixed bottom player

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('songsGrid');
  const playerBar = document.getElementById('playerBar');
  const playerCover = document.getElementById('playerCover');
  const playerTitle = document.getElementById('playerTitle');
  const playerArtist = document.getElementById('playerArtist');
  const playerAudio = document.getElementById('playerAudio');
  const playerSource = document.getElementById('playerSource');

  let currentAudio = null;

  fetch('http://localhost:5000/api/songs')
    .then(res => res.json())
    .then(data => {
      const songs = data.data.songs;
      grid.innerHTML = '';
      songs.forEach(song => {
        // using song.cover or song.coverUrl, and song.url or song.fileUrl
        const cover = song.cover || song.coverUrl || 'https://via.placeholder.com/120x120?text=No+Cover';
        const audioUrl = song.url || song.fileUrl;
        if (!audioUrl) return; // skip if no audio
        const card = document.createElement('div');
        card.className = 'song-card';
        card.innerHTML = `
          <img src="${cover}" alt="Cover" />
          <div class="song-title">${song.title}</div>
          <div class="song-artist">${song.artist}</div>
          <button class="play-btn" aria-label="Play ${song.title}"><i class="fas fa-play"></i></button>
        `;
        const playBtn = card.querySelector('.play-btn');
        playBtn.addEventListener('click', () => {
          playSong({
            ...song,
            cover,
            url: audioUrl
          });
        });
        grid.appendChild(card);
      });
    });

  function playSong(song) {
    playerCover.src = song.cover;
    playerTitle.textContent = song.title;
    playerArtist.textContent = song.artist;
    playerSource.src = song.url;
    playerAudio.load();
    playerBar.style.display = 'flex';
    playerAudio.play();
  }
});
