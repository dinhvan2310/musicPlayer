const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const resetBtn = $('.btn-reset')
const volumeBtn = $('.btn-volume')
const volumeSetUp = $('.volume-set-up')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')


const app = {
  currentIndex: 0,
  viewedIndex: [],
  prevScrollTop: 0,
  isPlaying: false,
  isVolumeUp: false,
  isRandomUp: false,
  isRepeatUp: false,
  isScroll: true,
  songs: [
    {
      id: 0,
      name: 'Quên Anh ĐI',
      singer: 'MONO',
      path: './assests/music/song1.mp3',
      image: './assests/img/song1.jpg',
    },
    {
      id: 1,
      name: 'Waiting For You',
      singer: 'MONO',
      path: './assests/music/song2.mp3',
      image: './assests/img/song1.jpg',
    },
    {
      id: 2,
      name: 'Em Là',
      singer: 'MONO',
      path: './assests/music/song3.mp3',
      image: './assests/img/song1.jpg',
    },
    {
      id: 3,
      name: 'Buông',
      singer: 'MONO',
      path: './assests/music/song4.mp3',
      image: './assests/img/song1.jpg',
    },
    {
      id: 4,
      name: 'Anh Không Thể',
      singer: 'MONO',
      path: './assests/music/song5.mp3',
      image: './assests/img/song1.jpg',
    },
    {
      id: 5,
      name: 'L.I.E',
      singer: 'MONO',
      path: './assests/music/song6.mp3',
      image: './assests/img/song1.jpg',
    },
    {
      id: 6,
      name: 'Do You',
      singer: 'MONO',
      path: './assests/music/song7.mp3',
      image: './assests/img/song1.jpg',
    },
    {
      id: 7,
      name: 'Sparkle',
      singer: 'RADWIMPS',
      path: './assests/music/song8.mp3',
      image: './assests/img/song8.png',
    },
    {
      id: 8,
      name: 'Grand Escape',
      singer: 'RADWIMPS',
      path: './assests/music/song9.mp3',
      image: './assests/img/song9.jpg',
    },
  ],

  render: function () {
    let _this = app
    const htmls = this.songs.map((song, index) => {
      return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-id="${song.id}">
        <div class="thumb" style="background-image: url('${song.image}');">
        </div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>`
    })
    playList.innerHTML = htmls.join('')

    playList.onclick = function (e) {
      const songsClass = $$('.song')
      const songNode = e.target.closest('.song:not(.active)')
      if (songNode || e.target.closest('.option')) {
        // Xu ly khi click vao song
        if (songNode) {
          songsClass[_this.currentIndex].classList.remove('active') //phuong an 1
          _this.currentIndex = Number(songNode.dataset.id)
          songsClass[_this.currentIndex].classList.add('active') // Phuong an 1
          // _this.render()  // phuong an 2
          _this.loadCurrentSong()
          audio.play()
        }
        // Xu ly khi click vao option
        if (e.target.closest('.option')) {

        }
      }
    }



  },
  defineProperties: function () {
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.currentIndex]
      }
    })
  },
  handleEvents: function () {
    const _this = this
    const cdWidth = cd.offsetWidth

    // Xu ly CD quay / dung 
    const cdThumbAnimate = cdThumb.animate([
      { transform: 'rotate(360deg)' }
    ], {
      duration: 10000, // 10 seconds
      iterations: Infinity
    })
    cdThumbAnimate.pause()

    // Xu ly phong to/ thu nho CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      if (_this.isScroll) {
        if (scrollTop < _this.prevScrollTop) {
          const newCdWidth = cdWidth - scrollTop
          if (cd.offsetWidth > newCdWidth) {

          } else {

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
          }
        } else {
          const newCdWidth = cdWidth - scrollTop
          cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
          cd.style.opacity = newCdWidth / cdWidth
        }
        
      }
      if (_this.currentIndex === 0) {
        const newCdWidth = cdWidth - scrollTop
          cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
          cd.style.opacity = newCdWidth / cdWidth
      }
      _this.prevScrollTop = scrollTop
    }

    // Xu ly khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause()
      } else {
        audio.play()
      }
    }

    // Xu ly khi click reset
    resetBtn.onclick = function () {
      audio.currentTime = 0
      audio.play()
    }

    // Xu ly khi click repeat
    repeatBtn.onclick = function () {
      _this.isRepeatUp = !_this.isRepeatUp
      repeatBtn.classList.toggle('active', _this.isRepeatUp)
    }

    // Khi click random song
    randomBtn.onclick = function () {
      _this.isRandomUp = !_this.isRandomUp
      randomBtn.classList.toggle('active', _this.isRandomUp)
    }

    // Khi song duoc play
    audio.onplay = function () {
      _this.isPlaying = true
      player.classList.add('playing')
      cdThumbAnimate.play()
    }

    // Khi song bi pause
    audio.onpause = function () {
      _this.isPlaying = false
      player.classList.remove('playing')
      cdThumbAnimate.pause()
    }

    // Khi tien do bai hat thay doi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
        progress.value = progressPercent
      }
    }

    // Khi bai hat ket thuc
    audio.onended = function () {
      if (_this.isRepeatUp) {
        resetBtn.click()
      } else {
        nextBtn.click()
      }
    }

    // Khi ly khi click volume
    volumeBtn.onclick = function (e) {
      _this.isVolumeUp = !_this.isVolumeUp
      volumeSetUp.classList.toggle('show', _this.isVolumeUp)
      e.stopPropagation()
    }

    window.onclick = () => {
      if (_this.isVolumeUp) {
        _this.isVolumeUp = !_this.isVolumeUp
        volumeSetUp.classList.remove('show', _this.isVolumeUp)
      }
    }


    // Khi thanh volume bi dieu chinh
    volumeSetUp.ontouchmove = function (e) {
      audio.volume = e.target.value
    }
    volumeSetUp.ontouchend = () => {
      if (_this.isVolumeUp) {
        _this.isVolumeUp = !_this.isVolumeUp
        volumeSetUp.classList.remove('show', _this.isVolumeUp)
      }
    }

    // Xu ly khi tua song
    progress.oninput = function (e) {
      const seekTime = audio.duration / 100 * e.target.value
      audio.currentTime = seekTime
    }

    //Khi next song
    nextBtn.onclick = function () {

      const songsClass = $$('.song')
      songsClass[_this.currentIndex].classList.remove('active')
      if (_this.isRandomUp) {
        _this.playRandomSong()
      } else {
        _this.nextSong()
      }
      songsClass[_this.currentIndex].classList.add('active')
      audio.play()
      _this.render()
      _this.scrollToActiveSong()

      

    }

    // Khi prev song
    prevBtn.onclick = function () {

      const songsClass = $$('.song')
      songsClass[_this.currentIndex].classList.remove('active')
      if (_this.isRandomUp) {
        _this.playRandomSong()
      } else {
        _this.prevSong()
      }
      songsClass[_this.currentIndex].classList.add('active')
      audio.play()
      _this.render()
      _this.scrollToActiveSong()

    }


  },

  scrollToActiveSong: function () {
    this.isScroll = false

      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })

    setTimeout(() => {
      this.isScroll = true

    }, 750)
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src = this.currentSong.path
  },
  nextSong: function () {
    this.currentIndex++
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0
    }
    this.loadCurrentSong()
  },

  prevSong: function () {

    this.currentIndex--
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1
    }
    this.loadCurrentSong()
  },


  playRandomSong: function () {
    let randomIndex
    if (this.viewedIndex.length === this.songs.length) {
      this.viewedIndex = []
    }
    do {
      randomIndex = Math.floor(Math.random() * this.songs.length)
    } while (this.viewedIndex.includes(randomIndex))

    this.currentIndex = randomIndex
    this.viewedIndex.push(this.currentIndex)
    this.loadCurrentSong()
    audio.play()
  },

  start: function () {
    // Dinh nghia cac thuoc tinh cho object
    this.defineProperties()

    // Lang nghe / xu ly cac xu kien (DOM Event)
    this.handleEvents()

    // Tai thong tin bai hat dau tien vao UI khi chay ung dung
    this.loadCurrentSong()
    // Render playlist



    this.render()
  },
}

app.start()
