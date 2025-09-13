<template>
  <div>
    <!-- Header -->
    <header id="header" class="bg-gray-700">
      <nav class="container mx-auto flex justify-between items-center py-3 md:py-5 px-4">
        <!-- App Name -->
        <router-link
          class="text-white font-bold uppercase text-lg md:text-2xl me-2 md:me-4"
          :to="{ name: 'home' }"
          exact-active-class="no-active"
        >
          {{ $t('home.logoText') }}
        </router-link>

        <!-- Hamburger (small screens only) -->
        <button
          @click="isMenuOpen = !isMenuOpen"
          class="text-white md:hidden focus:outline-none"
        >
          <i v-if="!isMenuOpen" class="fa fa-bars text-2xl"></i>
          <i v-else class="fa fa-times text-2xl"></i>
        </button>

        <!-- Desktop Menu -->
        <div class="hidden md:flex flex-grow items-center">
          <ul class="flex flex-row mt-1">
            <li>
              <router-link
                class="px-1 md:px-2 text-white text-sm md:text-base"
                :to="{ name: 'about' }"
              >
                {{ $t('home.about') }}
              </router-link>
            </li>
            <li v-if="!userStore.userLoggedIn">
              <a
                class="px-1 md:px-2 text-white text-sm md:text-base"
                href="#"
                @click.prevent="toggleAuthModal"
              >
                {{ $t('home.logIn') }} / {{ $t('home.register') }}
              </a>
            </li>
            <template v-else>
              <li>
                <router-link
                  class="px-1 md:px-2 text-white text-sm md:text-base"
                  :to="{ name: 'manage' }"
                >
                  {{ $t('home.manage') }}
                </router-link>
              </li>
              <li>
                <a
                  class="px-1 md:px-2 text-white text-sm md:text-base"
                  href="#"
                  @click.prevent="signOut"
                >
                  {{ $t('home.logOut') }}
                </a>
              </li>
            </template>
          </ul>
          <ul class="ms-auto">
            <li>
              <a
                class="px-1 md:px-2 text-white text-sm md:text-base"
                href="#"
                @click.prevent="changeLocale"
              >
                {{ currentLocale }}
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Mobile Menu -->
      <transition name="slide-fade">
        <div
          v-if="isMenuOpen"
          class="md:hidden bg-gray-800 text-white px-6 py-4 space-y-3"
        >
          <ul class="flex flex-col space-y-2">
            <li>
              <router-link
                class="block text-sm"
                :to="{ name: 'about' }"
                @click="isMenuOpen = false"
              >
                {{ $t('home.about') }}
              </router-link>
            </li>
            <li v-if="!userStore.userLoggedIn">
              <a
                class="block text-sm"
                href="#"
                @click.prevent="toggleAuthModal"
              >
                {{ $t('home.logIn') }} / {{ $t('home.register') }}
              </a>
            </li>
            <template v-else>
              <li>
                <router-link
                  class="block text-sm"
                  :to="{ name: 'manage' }"
                  @click="isMenuOpen = false"
                >
                  {{ $t('home.manage') }}
                </router-link>
              </li>
              <li>
                <a
                  class="block text-sm"
                  href="#"
                  @click.prevent="signOut"
                >
                  {{ $t('home.logOut') }}
                </a>
              </li>
            </template>
          </ul>
          <div class="pt-3 border-t border-gray-600">
            <a
              class="block text-sm"
              href="#"
              @click.prevent="changeLocale"
            >
              {{ currentLocale }}
            </a>
          </div>
        </div>
      </transition>
    </header>
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import useModalStore from '@/stores/modal'
import { useUserStore } from '@/stores/user'

export default {
  name: 'Header',
  data() {
    return {
      selectedLocale: this.$i18n.locale,
      isMenuOpen: false, // <-- للتحكم في إظهار/إخفاء المينيو
    }
  },
  watch: {
    selectedLocale(newVal) {
      this.$i18n.locale = newVal
    },
  },
  computed: {
    ...mapStores(useModalStore, useUserStore),
    currentLocale() {
      if (this.$i18n.locale === 'fr') return 'French'
      if (this.$i18n.locale === 'en') return 'English'
      return 'العربية'
    },
  },
  methods: {
    toggleAuthModal() {
      this.modalStore.isOpen = !this.modalStore.isOpen
    },
    signOut() {
      this.userStore.signOut()
      if (this.$route.name === 'manage') {
        this.$router.push({ name: 'home' })
      }
      this.isMenuOpen = false
    },
    changeLocale() {
      if (this.$i18n.locale === 'en') {
        this.$i18n.locale = 'ar'
      } else if (this.$i18n.locale === 'ar') {
        this.$i18n.locale = 'fr'
      } else {
        this.$i18n.locale = 'en'
      }
    },
  },
}
</script>

<style scoped>
/* Transition animation for mobile menu */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
