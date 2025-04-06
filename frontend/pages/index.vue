<template>
  <div class="space-y-8">
    <Carousel :key="$route.fullPath" />

    <section>
      <h1 class="text-center font-bold text-2xl mb-4">Our Products</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="product in products"
          :key="product._id"
          class="border border-gray-200 shadow p-4 mb-7 rounded relative"
        >
          <img
            v-if="product.image"
            :src="`http://localhost:5000/uploads/${product.image}`"
            class="w-80"
          />
          <div class="absolute bottom-0 right-0 bg-white p-6">
            <h2 class="font-bold capitalize">{{ product.name }}</h2>
            <p>${{ product.price }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();

// Buat url-nya jadi computed biar bisa di-watch
const url = computed(() => `${config.public.apiBase}/products?limit=6`);

// useFetch dengan watch ke computed url
const { data, refresh } = useFetch(url, {
  watch: [url], // ini kunci agar page & search bisa trigger fetch ulang
});

const products = computed(() => data.value?.data || []);
</script>
