import { Validator } from "../../Main_Resource/Validator.js"

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


const PLAYER_STORAGE_KEY = 'THAO_PLAYER'

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
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')
const volumeSetUp = $('.volume-set-up')
const formLogin =  $('.form__logIn')
const formSignUp = $('.form__signUp')
const signUpBtn = $('#signUpBtn')
const signUpSubmit = $('#signUpSubmit')

let show 

signUpBtn.onclick = function () {
  formLogin.style.display = 'none'
  formSignUp.style.display = 'flex'
}

Validator({
  form: "#form-1",
  formGroupSelector: ".form-group",
  errorSelector: ".form-message",
  rules: [
    Validator.isRequired("#fullname", "Vui long nhap ten day du cua ban"),
    Validator.isRequired("#email"),
    Validator.isEmail("#email"),
    Validator.minLength("#password", 6),
    Validator.isRequired("#password_confirmation"),
    Validator.isRequired("input[name='gender']"),
  
    Validator.isRequired("#province", "Vui long chon tinh thanh"),
    Validator.isConfirmed(
      "#password_confirmation",
      function () {
        return document.querySelector("#form-1 #password").value;
      },
      "Mat khau nhap lai khong chinh xac"
    )
  ],
  onSubmit: function (data) {
    //call API
    console.log(data);

    var accounts = JSON.parse(localStorage.getItem('accounts'))
    if (accounts === null)  accounts = []
    accounts.push({
      email: data.email,
      password: data.password,
    })
    localStorage.setItem('accounts', JSON.stringify(accounts))
    formSignUp.style.display = 'none'
    player.style.display = 'block'
    app.start()
  }
});


Validator({
  form: "#form-2",
  formGroupSelector: ".form-group",
  errorSelector: ".form-message",
  rules: [
    Validator.isRequired("#email", "Vui long nhap email"),
    Validator.minLength("#password", 6),
  ],
  onSubmit: function (data) {
    //call API
    console.log(data);
    

    var accounts = JSON.parse(localStorage.getItem('accounts'))
    
    accounts.forEach((account) => {
      if (account.email === data.email && account.password === data.password) {
        formLogin.style.display = 'none'
        player.style.display = 'block'
        app.start()
    }})




  }
});

    









const app = {
  currentIndex: 0,
  viewedIndex: [],
  prevScrollTop: 0,
  isPlaying: false,
  isVolumeUp: false,
  isRandomUp: false,
  isRepeatUp: false,
  isScroll: true,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
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

  setConfig: function(key, value) {
    this.config[key] = value
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
  },

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
    console.log(cd.offsetWidth)

    

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
          console.log(newCdWidth)
          if (cd.offsetWidth > newCdWidth) {

          } else {

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
          }
        } else {
          const newCdWidth = cdWidth - scrollTop
          console.log(newCdWidth)

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
      _this.setConfig('isRepeatUp', _this.isRepeatUp)
      repeatBtn.classList.toggle('active', _this.isRepeatUp)
    }

    // Khi click random song
    randomBtn.onclick = function () {
      _this.isRandomUp = !_this.isRandomUp
      _this.setConfig('isRandomUp', _this.isRandomUp)
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
    volumeSetUp.oninput = function (e) {
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

    //Xu ly khi an phim Right || Left Arrow || Up Arrow || Down Arrow
    window.onkeydown = (e) => {
      e.preventDefault();
      if (e.keyCode === 39) {
        nextBtn.click()
      }
      if (e.keyCode === 37) {
        prevBtn.click()
      }
      if(e.keyCode === 32) {
        playBtn.click()
      }
      if (e.keyCode === 38) {
        
        if (audio.volume <= 0.9) {
          audio.volume = audio.volume + 0.1
        }
        if (audio.volume > 0.9) {
          audio.volume = 1
        }
        
        volumeSetUp.value = audio.volume
        
        clearTimeout(show)
        volumeSetUp.classList.add('show', _this.isVolumeUp)
        show = setTimeout(function(){
          volumeSetUp.classList.remove('show', _this.isVolumeUp)
          
        console.log(audio.volume, "len")
        },2000)


        

      }
      if (e.keyCode === 40) {
        if (audio.volume >= 0.1) {
          audio.volume = audio.volume - 0.1
        } else if (audio.volume < 0.1) {
          audio.volume = 0
        }
        volumeSetUp.value = audio.volume
        
        clearTimeout(show)
        volumeSetUp.classList.add('show', _this.isVolumeUp)
        show = setTimeout(function(){
          volumeSetUp.classList.remove('show', _this.isVolumeUp)
          console.log(audio.volume, "xuong")
        },2000)


        

      }
      
      
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
  
  loadConfig: function() {
    this.isRandomUp = this.config.isRandomUp
    this.isRepeatUp = this.config.isRepeatUp
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

    this.loadConfig()

    // Dinh nghia cac thuoc tinh cho object
    this.defineProperties()

    // Lang nghe / xu ly cac xu kien (DOM Event)
    this.handleEvents()

    // Tai thong tin bai hat dau tien vao UI khi chay ung dung
    this.loadCurrentSong()
    // Render playlist



    this.render()


    repeatBtn.classList.toggle('active', this.isRepeatUp)
    randomBtn.classList.toggle('active', this.isRandomUp)

  },
}


