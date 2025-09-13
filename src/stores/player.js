import { defineStore } from 'pinia'
import { Howl } from 'howler'
import helper from '../includes/helper'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    current_song: {},
    sound: null,
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%',
    rafId: null,
  }),
  actions: {
    async newSong(song) {
      if (this.sound) {
        this.sound.unload()
        if (this.rafId) cancelAnimationFrame(this.rafId)
      }

      this.current_song = song

      this.sound = new Howl({
        src: [song.url],
        html5: true,
      })

      this.sound.play()

      this.sound.on('play', () => {
        this.startProgressLoop()
      })

      this.sound.on('pause', () => {
        if (this.rafId) cancelAnimationFrame(this.rafId)
      })

      this.sound.on('end', () => {
        if (this.rafId) cancelAnimationFrame(this.rafId)
        this.seek = '00:00'
        this.duration = helper.formateTime(this.sound.duration())
        this.playerProgress = '0%'
      })
    },

    async toggleAudio() {
      if (!this.sound) return

      if (this.sound.playing()) {
        this.sound.pause()
      } else {
        this.sound.play()
      }
    },

    startProgressLoop() {
      // Cancel any existing animation frame first
      if (this.rafId) {
        cancelAnimationFrame(this.rafId)
      }

      const update = () => {
        if (!this.sound) return

        this.seek = helper.formateTime(this.sound.seek())
        this.duration = helper.formateTime(this.sound.duration())
        this.playerProgress = `${(this.sound.seek() / this.sound.duration()) * 100}%`

        if (this.sound.playing()) {
          this.rafId = requestAnimationFrame(update)
        } else {
          this.rafId = null
        }
      }
      this.rafId = requestAnimationFrame(update)
    },

    updateSeek(event) {
      if (!this.sound) return

      const { x, width } = event.currentTarget.getBoundingClientRect()
      const clickX = event.clientX - x
      const percentage = clickX / width
      const seconds = this.sound.duration() * percentage

      this.sound.seek(seconds)

      // Update the progress immediately after seeking
      this.seek = helper.formateTime(this.sound.seek())
      this.duration = helper.formateTime(this.sound.duration())
      this.playerProgress = `${(this.sound.seek() / this.sound.duration()) * 100}%`

      // Ensure the progress loop continues if the sound is playing
      if (this.sound.playing() && !this.rafId) {
        this.startProgressLoop()
      }
    },
  },
  getters: {
    playing: (state) => {
      return state.sound && typeof state.sound.playing === 'function'
        ? state.sound.playing()
        : false
    },
  },
})
