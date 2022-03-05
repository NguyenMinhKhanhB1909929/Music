const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "NMK-PLAYER";

const heading = $("header h2");
const cdThump = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const playing = $(".player");
const progress = $(".progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");
const string = "hello Word";

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  setconfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  songs: [
    {
      name: "Độ tộc 2",
      singer: "Mixi",
      path: "./assets/music/Do-Toc-2.mp3",
      img: "./assets/img/Do-Toc-2.jpg",
    },
    {
      name: "Túy Âm",
      singer: "Xesi",
      path: "./assets/music/Tuy-Am.mp3",
      img: "./assets/img/Tuy-Am.jpg",
    },
    {
      name: "Lạc Trôi",
      singer: "Sơn Tùng MTP",
      path: "./assets/music/Lac-Troi.mp3",
      img: "./assets/img/Lac-Troi.jpg",
    },
    {
      name: "Độ tộc 2",
      singer: "Mixi",
      path: "./assets/music/Do-Toc-2.mp3",
      img: "./assets/img/Do-Toc-2.jpg",
    },
    {
      name: "Túy Âm",
      singer: "Xesi",
      path: "./assets/music/Tuy-Am.mp3",
      img: "./assets/img/Tuy-Am.jpg",
    },
    {
      name: "Lạc Trôi",
      singer: "Sơn Tùng MTP",
      path: "./assets/music/Lac-Troi.mp3",
      img: "./assets/img/Lac-Troi.jpg",
    },
    {
      name: "Độ tộc 2",
      singer: "Mixi",
      path: "./assets/music/Do-Toc-2.mp3",
      img: "./assets/img/Do-Toc-2.jpg",
    },
    {
      name: "Túy Âm",
      singer: "Xesi",
      path: "./assets/music/Tuy-Am.mp3",
      img: "./assets/img/Tuy-Am.jpg",
    },
    {
      name: "Lạc Trôi",
      singer: "Sơn Tùng MTP",
      path: "./assets/music/Lac-Troi.mp3",
      img: "./assets/img/Lac-Troi.jpg",
    },
  ],
  render() {
    const htmls = this.songs.map((song, index) => {
      return `
                <div class="song ${
                  this.currentIndex === index ? "active" : ""
                }" data-index="${index}">
                    <div class="thumb" style="background-image: url('${
                      song.img
                    }')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties() {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handelEvent() {
    const _this = this;
    const cdWidth = cd.offsetWidth;
    // Xử lý CD xoay
    const cdThumpAnimate = cdThump.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000,
        iterations: Infinity,
      }
    );
    cdThumpAnimate.pause();
    // Xứ lý phóng to / thu nhỏ trong CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newcdWidth = cdWidth - scrollTop;
      cd.style.width = newcdWidth > 0 ? newcdWidth + "px" : 0;
      cd.style.opacity = newcdWidth / cdWidth;
    };
    // Xử lý khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Khi song được play
    audio.onplay = function () {
      _this.isPlaying = true;
      playing.classList.add("playing");
      cdThumpAnimate.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    // Khi song bị pause
    audio.onpause = function () {
      _this.isPlaying = false;
      playing.classList.remove("playing");
      cdThumpAnimate.pause();
    };
    // Khi next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
    };
    // Khi prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
    };
    // Khi play random song
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      if (_this.isRepeat) {
        repeatBtn.classList.remove("active", _this.isRepeat);
        _this.isRepeat = !_this.isRepeat;
      }
      randomBtn.classList.toggle("active", _this.isRandom);
      _this.setconfig("isRepeat", _this.isRepeat);
      _this.setconfig("isRandom", _this.isRandom);
    };
    // Phần trăm của song
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.value = progressPercent;
      }
    };
    // Xử lý khi tua song
    progress.oninput = function (e) {
      const seekTime = (audio.duration * e.target.value) / 100;
      audio.currentTime = seekTime;
    };
    // Xử lý khi kết thúc bài hát
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };
    // Xử lý khi repeat song
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      if (_this.isRandom) {
        randomBtn.classList.remove("active");
        _this.isRandom = !_this.isRandom;
      }
      repeatBtn.classList.toggle("active", _this.isRepeat);
      _this.setconfig("isRepeat", _this.isRepeat);
      _this.setconfig("isRandom", _this.isRandom);
    };
    // Xử lý khi click vào song
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        if (e.target.closest(".option")) {
        } else if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
      }
    };
  },
  loadConfig() {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;

    repeatBtn.classList.toggle("active", this.isRepeat);
    randomBtn.classList.toggle("active", this.isRandom);
  },
  scrollToActiveSong() {
    setTimeout(() => {
      if (this.currentIndex <= 2) {
        $(".song.active").scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      } else {
        $(".song.active").scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, 100);
  },
  loadCurrentSong() {
    heading.textContent = this.currentSong.name;
    cdThump.style.backgroundImage = `url(${this.currentSong.img})`;
    audio.src = this.currentSong.path;
  },
  nextSong() {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong() {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong() {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start() {
    this.loadConfig();
    // Định nghĩa các thuộc tính cho Object
    this.defineProperties();
    // Lắng nghe / xử lý các event
    this.handelEvent();
    // Tải thông tin bài hát đầu tiên khi chạy ứng dụng
    this.loadCurrentSong();
    // Render playlist
    this.render();
  },
};

app.start();
