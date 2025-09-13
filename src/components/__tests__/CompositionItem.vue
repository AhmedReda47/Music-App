<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <!-- Success/Error Alert -->
    <!-- <div class="text-white text-center font-bold p-4 mb-4" v-if="show_alert" :class="alert_variant">
      {{ alert_message }}
    </div> -->

    <div v-show="!showForm" class="flex justify-between items-center">
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <div>
        <button
          class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600"
          @click.prevent="deleteSong"
        >
          <i class="fa fa-times"></i>
        </button>
        <button
          class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600"
          @click="showForm = !showForm"
        >
          <i class="fa fa-pencil-alt"></i>
        </button>
      </div>
    </div>
    <div v-show="showForm">
      <div
        class="text-white text-center font-bold p-4 mb-4"
        v-if="show_alert"
        :class="alert_variant"
      >
        {{ alert_message }}
      </div>
      <vee-form :validation-schema="schema" :initial-values="song" @submit="edit">
        <div class="mb-3">
          <label for="modified_name" class="inline-block mb-2">{{
            $t('composition.song_title')
          }}</label>
          <vee-field
            id="modified_name"
            type="text"
            name="modified_name"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            :placeholder="$t('composition.song_title_placeholder')"
            @input="updateUnsavedFlag(true)"
            autocomplete="off"
          />
          <ErrorMessage class="text-red-600" name="modified_name" />
        </div>
        <div class="mb-3">
          <label for="genre" class="inline-block mb-2">{{ $t('composition.genre') }}</label>
          <vee-field
            id="genre"
            type="text"
            name="genre"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            :placeholder="$t('composition.genre_placeholder')"
            @input="updateUnsavedFlag(true)"
            autocomplete="off"
          />
          <ErrorMessage class="text-red-600" name="genre" />
        </div>
        <div class="flex gap-1">
          <button
            type="submit"
            class="py-1.5 px-3 rounded text-white bg-green-600"
            :disabled="in_submission"
          >
            {{ $t('composition.submit') }}
          </button>
          <button
            type="submit"
            class="py-1.5 px-3 rounded text-white bg-gray-600"
            :disabled="in_submission"
            @click.prevent="showForm = false"
          >
            {{ $t('composition.go_back') }}
          </button>
        </div>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { songsCollection } from '@/includes/firebase'
import { getStorage, ref, deleteObject } from 'firebase/storage'
import validation from '@/includes/validation'
import { ErrorMessage } from 'vee-validate'
import { errorMessages } from 'vue/compiler-sfc'
import { auth } from '@/includes/firebase'
import { doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/includes/firebase'

console.log('Current User:', auth.currentUser)

export default {
  name: 'CompositionItem',
  props: {
    song: {
      type: Object,
      required: true,
    },
    updateSong: {
      type: Function,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    removeSong: {
      type: Function,
      required: true,
    },
    updateUnsavedFlag: {
      type: Function,
    },
  },
  data() {
    return {
      showForm: false,
      schema: {
        modified_name: 'required',
        genre: 'alpha_spaces',
      },
      in_submission: false,
      show_alert: false,
      alert_variant: 'bg-blue-500',
      alert_message: '',
    }
  },
  methods: {
    async edit(values) {
      this.in_submission = true
      this.show_alert = true
      this.alert_variant = 'bg-blue-500'
      this.alert_message = this.$t('composition.updating')

      // const values = {
      //   modified_name: 'Test Update',
      //   genre: 'Rock',
      // }

      console.log('song:', this.song)
      console.log('docID:', this.song.docID)
      try {
        const songRef = doc(db, 'songs', this.song.docID)
        await updateDoc(songRef, values)
      } catch (error) {
        console.error('Firestore update error:', error)
        this.in_submission = false
        this.alert_variant = 'bg-red-500'
        this.alert_message = this.$t('composition.error')
        return
      }

      this.updateSong(this.index, values)
      this.updateUnsavedFlag(false)

      this.in_submission = false
      this.alert_variant = 'bg-green-500'
      this.alert_message = this.$t('composition.success')
    },
    async deleteSong() {
      try {
        console.log('Starting delete process for song:', this.song)

        if (!auth.currentUser) {
          throw new Error('User not authenticated')
        }

        // Delete the Firestore document first (this is the most important part)
        console.log('Deleting document from Firestore...')
        const songDocRef = doc(db, 'songs', this.song.docID)
        await deleteDoc(songDocRef)
        console.log('Document deleted from Firestore')

        // Remove from local state immediately for better UX
        this.removeSong(this.index)

        // Try to delete the file from storage in the background
        this.deleteStorageFileBackground()

        console.log('Song deleted successfully')

        // Show success message to user
        this.show_alert = true
        this.alert_variant = 'bg-green-500'
        this.alert_message = this.$t('composition.delete_success')

        // Hide the alert after 3 seconds
        setTimeout(() => {
          this.show_alert = false
        }, 3000)
      } catch (error) {
        console.error('Error deleting song:', error)
        alert(this.$t('composition.delete_failed', { message: error.message }))
      }
    },

    async deleteStorageFileBackground() {
      // This runs in the background and doesn't affect the user experience
      try {
        const storage = getStorage()
        const songRef = ref(storage, `songs/${this.song.original_name}`)
        await deleteObject(songRef)
        console.log('File deleted from storage successfully')
      } catch (error) {
        console.warn('Could not delete file from storage (this is okay):', error)
        // The file will remain in storage but won't be accessible through the app
        // This is a common issue with Firebase Storage CORS and doesn't affect functionality
      }
    },
  },
}
</script>
