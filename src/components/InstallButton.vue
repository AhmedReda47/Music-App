<template>
  <button
    v-if="canInstall"
    @click="installApp"
    class="px-4 py-2 bg-green-500 text-white rounded-lg"
  >
    Install App



    
  </button>
</template>

<script setup>
import { ref, onMounted } from "vue";

const canInstall = ref(false);
let deferredPrompt = null;

onMounted(() => {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    canInstall.value = true;
  });
});

const installApp = async () => {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log("User choice:", outcome);
  deferredPrompt = null;
  canInstall.value = false;
};
</script>
