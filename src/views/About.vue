<template>
  <div>
    <!-- Hero Section -->
    <section class="mb-8 py-12 md:py-20 text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"
      ></div>
      <div class="container mx-auto px-4">
        <div class="text-black main-header-content relative z-10">
          <h1 class="font-bold text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-5 text-shadow">
            {{ $t('about.title') }}
          </h1>
          <p class="w-full md:w-8/12 mx-auto text-base md:text-lg text-shadow">
            {{ $t('about.subtitle') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="container mx-auto px-4 md:px-8 lg:px-20">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div
          class="px-4 md:px-6 pt-4 md:pt-6 pb-4 md:pb-5 font-bold border-b border-gray-200"
          v-icon-secondary="{ icon: 'info-circle', right: true }"
        >
          <span class="card-title text-lg md:text-xl">{{ $t('about.our_story') }}</span>
        </div>

        <div class="p-4 md:p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
            <!-- Mission -->
            <div class="bg-gray-50 p-4 md:p-6 rounded-lg">
              <div class="flex items-center mb-3 md:mb-4">
                <i class="fas fa-bullseye text-green-500 text-xl md:text-2xl mr-3"></i>
                <h3 class="text-lg md:text-xl font-bold text-gray-800">
                  {{ $t('about.mission_title') }}
                </h3>
              </div>
              <p class="text-gray-600 leading-relaxed text-sm md:text-base">
                {{ $t('about.mission_description') }}
              </p>
            </div>

            <!-- Vision -->
            <div class="bg-gray-50 p-4 md:p-6 rounded-lg">
              <div class="flex items-center mb-3 md:mb-4">
                <i class="fas fa-eye text-blue-500 text-xl md:text-2xl mr-3"></i>
                <h3 class="text-lg md:text-xl font-bold text-gray-800">
                  {{ $t('about.vision_title') }}
                </h3>
              </div>
              <p class="text-gray-600 leading-relaxed text-sm md:text-base">
                {{ $t('about.vision_description') }}
              </p>
            </div>
          </div>

          <!-- Features -->
          <div class="mb-6 md:mb-8">
            <h3 class="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 text-center">
              {{ $t('about.features_title') }}
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <div class="text-center p-3 md:p-4">
                <div
                  class="bg-green-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4"
                >
                  <i class="fas fa-music text-green-600 text-lg md:text-2xl"></i>
                </div>
                <h4 class="font-bold text-base md:text-lg mb-2">
                  {{ $t('about.feature1_title') }}
                </h4>
                <p class="text-gray-600 text-xs md:text-sm">
                  {{ $t('about.feature1_description') }}
                </p>
              </div>

              <div class="text-center p-3 md:p-4">
                <div
                  class="bg-blue-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4"
                >
                  <i class="fas fa-users text-blue-600 text-lg md:text-2xl"></i>
                </div>
                <h4 class="font-bold text-base md:text-lg mb-2">
                  {{ $t('about.feature2_title') }}
                </h4>
                <p class="text-gray-600 text-xs md:text-sm">
                  {{ $t('about.feature2_description') }}
                </p>
              </div>

              <div class="text-center p-3 md:p-4 sm:col-span-2 lg:col-span-1">
                <div
                  class="bg-purple-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4"
                >
                  <i class="fas fa-cloud-upload-alt text-purple-600 text-lg md:text-2xl"></i>
                </div>
                <h4 class="font-bold text-base md:text-lg mb-2">
                  {{ $t('about.feature3_title') }}
                </h4>
                <p class="text-gray-600 text-xs md:text-sm">
                  {{ $t('about.feature3_description') }}
                </p>
              </div>
            </div>
          </div>

          <!-- Technology Stack -->
          <div class="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 md:p-6 rounded-lg">
            <h3 class="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-center">
              {{ $t('about.tech_title') }}
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-center">
              <div class="bg-white bg-opacity-20 p-2 md:p-3 rounded">
                <i class="fab fa-vuejs text-2xl md:text-3xl mb-1 md:mb-2"></i>
                <p class="font-semibold text-xs md:text-sm">Vue.js 3</p>
              </div>
              <div class="bg-white bg-opacity-20 p-2 md:p-3 rounded">
                <i class="fas fa-database text-2xl md:text-3xl mb-1 md:mb-2"></i>
                <p class="font-semibold text-xs md:text-sm">Firebase</p>
              </div>
              <div class="bg-white bg-opacity-20 p-2 md:p-3 rounded">
                <i class="fab fa-js-square text-2xl md:text-3xl mb-1 md:mb-2"></i>
                <p class="font-semibold text-xs md:text-sm">JavaScript</p>
              </div>
              <div class="bg-white bg-opacity-20 p-2 md:p-3 rounded">
                <i class="fas fa-palette text-2xl md:text-3xl mb-1 md:mb-2"></i>
                <p class="font-semibold text-xs md:text-sm">Tailwind CSS</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'About',
}
</script>

<style scoped>
.introduction-bg {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.main-header-content {
  position: relative;
  z-index: 10;
}

.card-title {
  color: #1f2937;
  font-size: 1.25rem;
}

.text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}
</style>
