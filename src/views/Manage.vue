<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6 px-4 md:px-8 lg:px-10">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      <div class="md:col-span-1">
        <AppUpload ref="upload" :addSong="addSong" />
      </div>
      <div class="md:col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div
            class="px-4 md:px-6 pt-4 md:pt-6 pb-4 md:pb-5 font-bold border-b border-gray-200 flex justify-between items-center"
          >
            <span class="card-title text-lg md:text-xl">{{ $t('manage.my_song') }}</span>
            <i class="fa fa-compact-disc text-green-400 text-xl md:text-2xl"></i>
          </div>
          <div class="p-4 md:p-6">
            <!-- Composition Items -->
            <CompositionItem
              v-for="(song, i) in songs"
              :key="song.docID"
              :song="song"
              :updateSong="updateSong"
              :index="i"
              :removeSong="removeSong"
              :updateUnsavedFlag="updateUnsavedFlag"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import AppUpload from '@/components/Upload.vue'
import CompositionItem from '@/components/__tests__/CompositionItem.vue'
// import useUserStore from '@/stores/user'
import { songsCollection, auth } from '@/includes/firebase'
import { query, where, getDocs } from 'firebase/firestore'
export default {
  name: 'Manage',
  components: {
    AppUpload,
    CompositionItem,
  },
  data() {
    return {
      songs: [],
      unsavedFlag: false,
    }
  },
  async created() {
    if (!auth.currentUser) {
      console.warn('User not logged in')
      return
    }
    const q = query(songsCollection, where('uid', '==', auth.currentUser.uid))
    const snapshot = await getDocs(q)
    snapshot.forEach(this.addSong)
  },
  methods: {
    updateSong(i, values) {
      this.songs[i].modified_name = values.modified_name
      this.songs[i].genre = values.genre
    },
    removeSong(i) {
      this.songs.splice(i, 1)
    },
    addSong(document) {
      const song = {
        ...document.data(),
        docID: document.id,
      }
      this.songs.push(song)
    },
    updateUnsavedFlag(value) {
      this.unsavedFlag = value
    },
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next()
    } else {
      const leave = confirm(this.$t('manage.unsaved_warning'))
      next(leave)
    }
  },

  // beforeRouteLeave(to, from, next){
  //   this.$refs.upload.cancelUploads();
  // }
  // beforeRouteEnter(to, from, next){
  //   const store = useUserStore()
  //   if (store.userLoggedIn) {
  //     next();
  //   } else {
  //     next({ name: 'home' });
  //   }

  // }
}
</script>
