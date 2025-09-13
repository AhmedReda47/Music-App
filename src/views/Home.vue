<template>
  <div>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"
      ></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">{{ $t('home.listen') }}</h1>
          <p class="w-full md:w-8/12 mx-auto">
            {{ $t('home.title') }}
          </p>
        </div>
      </div>

      <img
        class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="../../template/assets/img/introduction-music.png"
      />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto px-4 md:px-8 lg:px-20">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div
          class="px-4 md:px-6 pt-4 md:pt-6 pb-4 md:pb-5 font-bold border-b border-gray-200"
          v-icon-secondary="{ icon: 'headphones-alt', right: true }"
        >
          <span class="card-title text-lg md:text-xl">{{ $t('home.songs') }}</span>
        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <SongItem v-for="song in songs" :key="song.docID" :song="song" />
        </ol>
        <!-- .. end Playlist -->
        <!-- Loading Spinner -->
        <div v-if="pendingRequest" class="py-4 text-center">
          <i class="fa fa-spinner fa-spin text-green-500 text-2xl"></i>
          <p class="text-gray-600 mt-2">{{ $t('home.loading') }}</p>
        </div>

        <!-- No More Songs -->
        <div v-else-if="noMoreSongs" class="py-4 text-center">
            <p class="text-gray-500">{{ $t('home.no') }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { songsCollection } from '@/includes/firebase'
import { getDocs, query, where, orderBy, limit, startAfter, doc, getDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import SongItem from '@/components/__tests__/songItem.vue'

export default {
  name: 'Home',
  components: {
    SongItem,
  },
  data() {
    return {
      songs: [],
      maxPerPage: 1,
      pendingRequest: false,
      lastDoc: null, // 🆕 نستخدمه للتصفح (pagination)
      noMoreSongs: false,
    }
  },
  async created() {
    this.getSongs()
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      if (this.noMoreSongs) return

      const scrollPosition = window.scrollY + window.innerHeight
      const bottomOfPage = document.body.offsetHeight - 2 // small offset for precision

      if (scrollPosition >= bottomOfPage) {
        this.getSongs()
      }
    },

    async getSongs() {
      const auth = getAuth()
      const user = auth.currentUser

      if (!user) return // تأكد أن المستخدم مسجل دخول
      if (this.pendingRequest || this.noMoreSongs) return
      if (this.pendingRequest) return

      this.pendingRequest = true

      let q

      if (this.lastDoc) {
        // لو عندنا صفحة قديمة → نجيب الصفحة اللي بعدها
        q = query(
          songsCollection,
          where('uid', '==', user.uid),
          orderBy('modified_name'),
          startAfter(this.lastDoc),
          limit(this.maxPerPage),
        )
      } else {
        // أول صفحة
        q = query(
          songsCollection,
          where('uid', '==', user.uid),
          orderBy('modified_name'),
          limit(this.maxPerPage),
        )
      }

      const snapshots = await getDocs(q)

      if (snapshots.empty) {
        this.noMoreSongs = true
        this.pendingRequest = false
        return
      }
      this.lastDoc = snapshots.docs[snapshots.docs.length - 1] // 🆕 تحديث آخر Doc

      snapshots.forEach((document) => {
        this.songs.push({
          docID: document.id,
          ...document.data(),
        })
      })

      this.pendingRequest = false
    },
  },
}
</script>
