<template>
  <!-- Player -->
  <div class="fixed bottom-0 left-0 bg-white px-4 py-3 w-full border-t border-gray-200">
    <div class="flex items-center justify-between gap-4">
      <!-- Play/Pause Button -->
      <button type="button" @click.prevent="toggleAudio" class="text-gray-600 text-2xl shrink-0">
        <i class="fa" :class="{ 'fa-play': !playing, 'fa-pause': playing }"></i>
      </button>

      <!-- Current Time -->
      <span class="text-gray-500 text-sm w-12 text-center shrink-0">
        {{ seek }}
      </span>

      <!-- Song Info + Scrubber -->
      <div class="flex flex-col flex-1 min-w-0">
        <!-- Song Info -->
        <div v-if="current_song.modified_name" class="truncate text-center text-sm mb-1">
          <span class="font-bold capitalize">{{ current_song.modified_name }}</span>
          {{ $t('player.by') }}
          <span>{{ current_song.display_name }}</span>
        </div>
        <!-- Progress Bar -->
        <div
          @click.prevent="updateSeek"
          class="w-full h-2 rounded bg-gray-200 relative cursor-pointer"
        >
          <span class="absolute -top-2 text-green-600 text-sm" :style="{ left: playerProgress }">
            <i class="fas fa-circle"></i>
          </span>
          <span
            class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
            :style="{ width: playerProgress }"
          ></span>
        </div>
      </div>

      <!-- Duration -->
      <span class="text-gray-500 text-sm w-12 text-center shrink-0">
        {{ duration }}
      </span>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import { usePlayerStore } from '@/stores/player'

export default {
  name: 'Player',
  methods: {
    ...mapActions(usePlayerStore, ['toggleAudio', 'updateSeek']),
  },
  computed: {
    ...mapState(usePlayerStore, ['playing', 'duration', 'seek', 'playerProgress', 'current_song']),
  },
}
</script>

<style scoped></style>
