<template>
  <div>
    <NuxtLayout>
      <div class="p-8 md:px-32">
        <NuxtPage />
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { initFlowbite } from "flowbite";

// initialize components based on data attribute selectors
onMounted(() => {
  initFlowbite();
});
</script>
