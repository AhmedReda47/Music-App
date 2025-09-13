<template>
  <div class="">
    <Header />

    <router-view />

    <app-player />

    <Auth />
  </div>
</template>

<script>
import Header from '@/components/__tests__/Header.vue'
import Auth from '@/components/__tests__/Auth.vue'
import AppPlayer from '@/components/Player.vue'
import { mapWritableState } from 'pinia'
import { useUserStore } from '@/stores/user.js'
import { auth } from './includes/firebase'
import { useI18n } from 'vue-i18n'
import { watch } from 'vue'
export default {
  name: 'App',
  components: {
    Header,
    Auth,
    AppPlayer,
  },
  computed: {
    ...mapWritableState(useUserStore, ['userLoggedIn']),
  },
  setup() {
    const { locale } = useI18n()

    watch(
      () => locale.value,
      (newLocale) => {
        if (newLocale === 'ar') {
          document.documentElement.setAttribute('dir', 'rtl')
          document.documentElement.setAttribute('lang', 'ar')
        } else {
          document.documentElement.setAttribute('dir', 'ltr')
          document.documentElement.setAttribute('lang', 'en')
        }
      },
      { immediate: true }
    )
  },
  created() {
    if (auth.currentUser) {
      this.userLoggedIn = true
    }
  },
}
</script>

<style>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-to {
  opacity: 1;
}

.fade-enter-active {
  transition: opacity 0.5s linear;
}

.fade-leave-from {
  opacity: 1;
}

.fade-leave-to {
  opacity: 0;
}

.fade-leave-active {
  transition: opacity 0.5s linear;
}
</style>
