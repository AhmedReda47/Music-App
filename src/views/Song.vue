<template>
  <main>
    <!-- Music Header -->
    <section
  class="w-full mb-8 py-14 text-center text-white relative px-6 sm:px-10 md:px-20"
>
  <!-- Background -->
  <div
    class="absolute inset-0 w-full h-full bg-cover bg-center music-bg"
    style="background-image: url(/assets/img/song-header.png)"
  ></div>

  <!-- Overlay for readability -->
  <div class="absolute inset-0 bg-black/50"></div>

  <!-- Content -->
  <div class="container mx-auto flex flex-col sm:flex-row items-center relative z-50">
    <button
      @click.prevent="playing ? toggleAudio() : newSong(song)"
      type="button"
      class="h-20 w-20 sm:h-24 sm:w-24 text-2xl sm:text-3xl bg-white text-black rounded-full focus:outline-none flex items-center justify-center"
    >
      <i class="fas" :class="{ 'fa-play': !playing, 'fa-pause': playing }"></i>
    </button>

    <div class="text-left mt-6 sm:mt-0 sm:ml-8">
      <div class="text-2xl sm:text-3xl font-bold">
        {{ song.modified_name }}
      </div>
      <div class="text-sm sm:text-base">{{ song.genre }}</div>
      <div class="song-price mt-2 text-center md:text-left">
        {{ $n(1, 'currency') }}
      </div>
    </div>
  </div>
</section>


    <!-- Form -->
    <section class="container mx-auto mt-6 px-4 md:px-8 lg:px-20" id="comments">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div
          class="px-4 md:px-6 pt-4 md:pt-6 pb-4 md:pb-5 font-bold border-b border-gray-200 flex justify-between items-center"
        >
          <span class="card-title text-lg md:text-xl">{{
            $t('song.comment_count', song.comment_count, { count: song.comment_count })
          }}</span>
          <i class="fa fa-comments text-green-400 text-xl md:text-2xl"></i>
        </div>
        <div class="p-4 md:p-6">
          <div
            class="text-white text-center font-bold p-4 mb-4"
            v-if="comment_show_alert"
            :class="comment_alert_variant"
          >
            {{ comment_alert_message }}
          </div>
          <vee-form :validation-schema="schema" @submit="addComment" v-if="userLoggedIn">
            <vee-field
              as="textarea"
              name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              :placeholder="$t('song.placeholder')"
            ></vee-field>
            <ErrorMessage class="text-red-600" name="comment" />
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600"
              :disabled="comment_in_submission"
            >
              {{ $t('song.submit') }}
            </button>
          </vee-form>
          <select
            v-model="sort"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="1">{{ $t('song.latest') }}</option>
            <option value="2">{{ $t('song.oldest') }}</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto px-4 md:px-8 lg:px-20">
      <li
        class="p-4 md:p-6 bg-gray-50 border border-gray-200"
        v-for="comment in sortedComments"
        :key="comment.docID"
      >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ formatRelative(comment.datePosted) }}</time>
        </div>

        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script>
import { doc, getDoc, addDoc, query, where, getDocs, updateDoc } from 'firebase/firestore'
import { db, auth, commentsCollection, songsCollection } from '@/includes/firebase'
import { ErrorMessage } from 'vee-validate'
import { mapState, mapActions } from 'pinia'
import { useUserStore } from '@/stores/user'
import { usePlayerStore } from '@/stores/player'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export default {
  name: 'Song',
  data() {
    return {
      song: {},
      schema: {
        comment: 'required|min:3',
      },
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: 'bg-blue-500',
      comment_alert_message: '',
      comments: [],
      sort: '1',
    }
  },
  computed: {
    ...mapState(useUserStore, ['userLoggedIn']),
    ...mapState(usePlayerStore, ['playing']),
    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        if (this.sort === '1') {
          return new Date(b.datePosted) - new Date(a.datePosted)
        }
        return new Date(a.datePosted) - new Date(b.datePosted)
      })
    },
  },
  async mounted() {
    try {
      const id = this.$route.params.id
      console.log('Route param id:', id)

      const docRef = doc(db, 'songs', id)
      const docSnapshot = await getDoc(docRef)

      console.log('Exists:', docSnapshot.exists())

      if (!docSnapshot.exists()) {
        console.log('Not found, redirecting...')
        this.$router.push({ name: 'home' })
        return
      }

      const { sort } = this.$route.query

      this.sort = sort === '1' || sort === '2' ? sort : '1'

      this.song = docSnapshot.data()
      this.getComments()
    } catch (error) {
      console.error('Firestore error:', error.message)
      // في حالة أي error غير متوقع → رجّع اليوزر للـ home برضه
      this.$router.push({ name: 'home' })
    }
  },
  methods: {
    ...mapActions(usePlayerStore, ['newSong', 'toggleAudio']),
    async addComment(values, { resetForm }) {
      this.comment_in_submission = true
      this.comment_show_alert = true
      this.comment_alert_variant = 'bg-blue-500'
      this.comment_alert_message = this.$t('song.comment_waiting')

      try {
        const comment = {
          content: values.comment,
          datePosted: new Date().toString(),
          sid: this.$route.params.id,
          name: auth.currentUser?.displayName || 'Anonymous',
          uid: auth.currentUser?.uid || null,
        }

        await addDoc(commentsCollection, comment)

        this.song.comment_count += 1
        const songRef = doc(db, 'songs', this.$route.params.id)
        await updateDoc(songRef, {
          comment_count: this.song.comment_count,
        })

        this.comment_in_submission = false
        this.comment_alert_variant = 'bg-green-500'
        this.comment_alert_message = this.$t('song.comment_success')
        resetForm()
      } catch (error) {
        console.error('Error adding comment:', error)
        this.comment_in_submission = false
        this.comment_alert_variant = 'bg-red-500'
        this.comment_alert_message = this.$t('song.comment_error')
      }
    },
    async getComments() {
      try {
        const id = this.$route.params.id

        // build query
        const q = query(commentsCollection, where('sid', '==', id))

        // run query
        const querySnapshot = await getDocs(q)

        // convert snapshot to array of objects
        const comments = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        this.comments = comments
      } catch (err) {
        console.error('Error fetching comments:', err)
      }
    },
    formatRelative(dateInput) {
      if (!dateInput) return ''

      const date =
        dateInput instanceof Date
          ? dateInput
          : dateInput.toDate instanceof Function
            ? dateInput.toDate()
            : new Date(dateInput)

      return dayjs(date).fromNow()
      // e.g. "2 hours ago", "a day ago", "just now"
    },
  },
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) {
        return
      }

      this.$router.push({
        query: {
          sort: newVal,
        },
      })
    },
  },
}
</script>

<style></style>
