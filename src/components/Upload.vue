<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div
      class="px-4 md:px-6 pt-4 md:pt-6 pb-4 md:pb-5 font-bold border-b border-gray-200 flex justify-between items-center"
    >
      <span class="card-title text-lg md:text-xl">{{ $t('upload.upload') }}</span>
      <i class="fas fa-upload text-green-400 text-xl md:text-2xl"></i>
    </div>
    <div class="p-4 md:p-6">
      <div
        class="w-full px-4 md:px-10 py-12 md:py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': is_dragover }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="is_dragover = false"
        @dragover.prevent.stop="is_dragover = true"
        @dragenter.prevent.stop="is_dragover = true"
        @dragleave.prevent.stop="is_dragover = false"
        @drop.prevent.stop="upload($event)"
      >
        <h5 class="text-sm md:text-base">{{ $t('upload.drop') }}</h5>
      </div>
      <input type="file" multiple @change="upload($event)" />
      <hr class="my-6" />
      <!-- progress Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <div class="font-bold text-sm" :class="upload.text_class">
          <i :class="upload.icon"></i> {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <div
            class="transition-all progress-bar bg-blue-400"
            :class="upload.variant"
            :style="{ width: upload.current_progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage, auth, songsCollection } from '@/includes/firebase'
import { addDoc, getDoc } from 'firebase/firestore'

export default {
  name: 'Upload',
  data() {
    return {
      is_dragover: false,
      uploads: [],
    }
  },
  props: ['addSong'],
  methods: {
    upload($event) {
      this.is_dragover = false

      // Check if user is authenticated
      if (!auth.currentUser) {
        console.error('User must be logged in to upload files')
        alert(this.$t('upload.login_required'))
        return
      }

      console.log('User authenticated for upload:', {
        uid: auth.currentUser.uid,
        displayName: auth.currentUser.displayName,
        email: auth.currentUser.email,
      })

      const files = $event.dataTransfer ? [...$event.dataTransfer.files] : [...$event.target.files]

      files.forEach((file) => {
        if (file.type !== 'audio/mpeg') {
          console.log('Skipping non-audio file:', file.name)
          return
        }

        if (!navigator.onLine) {
          this.uploads.push({
            task: {},
            current_progress: 100,
            name: file.name,
            variant: 'bg-red-400',
            icon: 'fas fa-times',
            text_class: 'text-red-400',
          })
          return
        }

        console.log('Starting upload for file:', file.name)
        const fileRef = storageRef(storage, `songs/${file.name}`)
        const uploadTask = uploadBytesResumable(fileRef, file)

        this.uploads.push({
          task: uploadTask,
          current_progress: 0,
          name: file.name,
          variant: 'bg-blue-400',
          icon: 'fas fa-spinner fa-spin',
          text_class: '',
        })
        const newIndex = this.uploads.length - 1
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            this.uploads[newIndex].current_progress = progress
          },
          (error) => {
            this.uploads[newIndex].variant = 'bg-red-400'
            this.uploads[newIndex].icon = 'fas fa-times'
            this.uploads[newIndex].text_class = 'text-red-500'
            console.log(error)
          },
          async () => {
            const snapshot = uploadTask.snapshot
            const downloadUrl = await getDownloadURL(snapshot.ref)

            // Debug logging
            console.log('Current user:', auth.currentUser)
            console.log('User UID:', auth.currentUser?.uid)
            console.log('User display name:', auth.currentUser?.displayName)

            const song = {
              uid: auth.currentUser.uid,
              display_name: auth.currentUser.displayName,
              original_name: snapshot.ref.name,
              modified_name: snapshot.ref.name,
              genre: '',
              comment_count: 0,
              url: downloadUrl,
            }

            console.log('Song data to be added:', song)

            try {
              const songRef = await addDoc(songsCollection, song)
              const songSnapshot = await getDoc(songRef)
              this.addSong(songSnapshot)
              console.log('Song added successfully to Firestore')
            } catch (error) {
              console.error('Error adding song to Firestore:', error)
              this.uploads[newIndex].variant = 'bg-red-400'
              this.uploads[newIndex].icon = 'fas fa-times'
              this.uploads[newIndex].text_class = 'text-red-500'
              return
            }

            this.uploads[newIndex].variant = 'bg-green-400'
            this.uploads[newIndex].icon = 'fas fa-check'
            this.uploads[newIndex].text_class = 'text-green-500'
          },
        )
      })
    },
    cancelUploads() {
      this.uploads.forEach((upload) => {
        upload.task.cancel()
      })
    },
  },
  beforeUnmount() {
    this.uploads.forEach((upload) => {
      upload.task.cancel()
    })
  },
}
</script>

<style scoped></style>
