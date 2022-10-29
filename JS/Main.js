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
const repeatBtn = $('.btn-repeat')
const volumeBtn = $('.btn-volume')
const volumeSetUp  = $('.volume-set-up')


const app = {
  currentIndex: 0,
  isPlaying: false,
  songs: [
    {
      id : 0,
      name: 'Quên Anh ĐI',
      singer: 'MONO',
      path: './assests/music/song1.mp3',
      image: './assests/img/song1.jpg',
    },
    {
      id : 1,
      name: 'Waiting For You',
      singer: 'MONO',
      path: './assests/music/song2.mp3',
      image: './assests/img/song1.jpg',
    },
    {
      id : 2,
      name: 'Em Là',
      singer: 'MONO',
      path: './assests/music/song3.mp3',
      image: './assests/img/song1.jpg',
    },
    {
      id : 3,
      name: 'Buông',
      singer: 'MONO',
      path: './assests/music/song4.mp3',
      image: './assests/img/song1.jpg',
    },
    {
      id : 4,
      name: 'Anh Không Thể',
      singer: 'MONO',
      path: './assests/music/song5.mp3',
      image: './assests/img/song1.jpg',
    },
    {
      id : 5,
      name: 'L.I.E',
      singer: 'MONO',
      path: './assests/music/song6.mp3',
      image: './assests/img/song1.jpg',
    },
    {
      id : 6,
      name: 'Do You',
      singer: 'MONO',
      path: './assests/music/song7.mp3',
      image: './assests/img/song1.jpg',
    },
    {
      id : 7,
      name: 'Sparkle',
      singer: 'RADWIMPS',
      path: './assests/music/song8.mp3',
      image: './assests/img/song8.png',
    },
    {
      id : 8,
      name: 'Grand Escape',
      singer: 'RADWIMPS',
      path: './assests/music/song9.mp3',
      image: './assests/img/song9.jpg',
    },
  ],

  render: function(){
    const htmls = this.songs.map(song => {
      return `<div class="song" data-id="${song.id}">
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
    $('.playlist').innerHTML = htmls.join('')
  },
  defineProperties: function(){
    Object.defineProperty(this, 'currentSong', {
      get: function() {
        return this.songs[this.currentIndex]
      }
    })
  },
  handleEvents: function() {
    const _this = this
    const cdWidth = cd.offsetWidth

    // Xu ly CD quay / dung 
    const cdThumbAnimate = cdThumb.animate([
      {transform: 'rotate(360deg)'}
    ], {
      duration: 10000, // 10 seconds
      iterations: Infinity
    })
    cdThumbAnimate.pause()

    // Xu ly phong to/ thu nho CD
    document.onscroll = function() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const newCdWidth = cdWidth - scrollTop
      cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
      cd.style.opacity = newCdWidth / cdWidth
    }

    // Xu ly khi click play
    playBtn.onclick = function(){
      if(_this.isPlaying) {
        audio.pause()
      } else {
        audio.play()
      }
    }

    // Xu ly khi click repeat
    repeatBtn.onclick = function() {
      audio.currentTime = 0
    }

    // Khi song duoc play
    audio.onplay = function(){
      _this.isPlaying = true
      player.classList.add('playing')
      cdThumbAnimate.play()
    }

    // Khi song bi pause
    audio.onpause = function() {
      _this.isPlaying = false
      player.classList.remove('playing')
      cdThumbAnimate.pause()
    }

    // Khi tien do bai hat thay doi
    audio.ontimeupdate = function(){
      if (audio.duration) {
        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
        progress.value = progressPercent
      }
    }

    volumeBtn.onclick = function(e){
      console.log(1)
     
      if(!volumeSetUp.classList[1]){
        volumeSetUp.classList.add('show')
      } else {
        volumeSetUp.classList.remove('show')
      }
    }

    

    // Khi thanh volume bi dieu chinh
    volumeSetUp.onchange = function(e){
        
        audio.volume = e.target.value
    }

    // Xu ly khi tua song
    progress.onchange = function(e) {
      const seekTime = audio.duration / 100 * e.target.value
      audio.currentTime = seekTime 
    }

    //Khi next song
    nextBtn.onclick = function() {
      _this.nextSong()
      audio.play()
    }

    // Khi prev song
    prevBtn.onclick = function() {
      _this.prevSong()
      audio.play()
    }
  },
  loadCurrentSong: function(){
    heading.textContent = this.currentSong.name
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src = this.currentSong.path
  },
  nextSong: function() {
    this.currentIndex++
    if (this.currentIndex >= this.songs.length ) {
      this.currentIndex = 0
    }
    this.loadCurrentSong()
  },

  prevSong: function() {
    this.currentIndex--
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1
    }
    this.loadCurrentSong()
  },

  start: function() {
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

const songs = $$('.song')

songs.forEach((song) => {
  song.onclick = () => {
    app.currentIndex = song.dataset.id
    app.loadCurrentSong()
    audio.play()
  }
})


