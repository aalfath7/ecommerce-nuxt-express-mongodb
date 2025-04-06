<script setup>
import { useRoute, useRouter } from "vue-router";

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();

const id = route.params.id;
const form = ref({ name: "", price: "", image: null });
const imagePreview = ref("");
const fileInput = ref(null);

// Fetch produk saat halaman dimuat
onMounted(async () => {
  const data = await $fetch(`${config.public.apiBase}/products/${id}`);
  form.value.name = data.name;
  form.value.price = data.price;
  imagePreview.value = data.image
    ? `http://localhost:5000/uploads/${data.image}`
    : "";
});

// Handle file
const handleFile = (e) => {
  form.value.image = e.target.files[0];
  imagePreview.value = URL.createObjectURL(e.target.files[0]);
};

// Submit update
const submit = async () => {
  const formData = new FormData();
  formData.append("name", form.value.name);
  formData.append("price", form.value.price);
  if (form.value.image) formData.append("image", form.value.image);

  await $fetch(`${config.public.apiBase}/products/${id}`, {
    method: "PUT",
    body: formData,
  });

  router.push("/"); // Kembali ke halaman utama
};
</script>

<template>
  <div class="max-w-lg mx-auto">
    <h1 class="text-xl font-bold mb-4">Edit Product</h1>
    <form @submit.prevent="submit" class="space-y-4">
      <input
        v-model="form.name"
        placeholder="Name"
        class="border p-2 rounded w-full"
      />
      <input
        v-model="form.price"
        type="number"
        placeholder="Price"
        class="border p-2 rounded w-full"
      />
      <input type="file" @change="handleFile" ref="fileInput" />
      <img v-if="imagePreview" :src="imagePreview" class="w-32 mt-2" />
      <div class="flex gap-2">
        <button class="bg-blue-600 text-white px-4 py-2 rounded">
          Update Product
        </button>
        <NuxtLink to="/" class="bg-gray-500 text-white px-4 py-2 rounded">
          Cancel
        </NuxtLink>
      </div>
    </form>
  </div>
</template>
