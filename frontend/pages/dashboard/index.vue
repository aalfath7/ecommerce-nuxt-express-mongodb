<script setup>
const config = useRuntimeConfig();

const limit = 5;
const page = ref(1);
const search = ref("");

// Buat url-nya jadi computed biar bisa di-watch
const url = computed(
  () =>
    `${config.public.apiBase}/products?page=${page.value}&limit=${limit}&search=${search.value}`
);

// useFetch dengan watch ke computed url
const { data, refresh } = useFetch(url, {
  watch: [url], // ini kunci agar page & search bisa trigger fetch ulang
});

const products = computed(() => data.value?.data || []);
const total = computed(() => data.value?.total || 0);

const imagePreview = ref("");
const form = ref({ name: "", price: "", image: null });
const fileInput = ref(null);

const handleFile = (e) => {
  form.value.image = e.target.files[0];
  imagePreview.value = URL.createObjectURL(e.target.files[0]);
};

const submit = async () => {
  const formData = new FormData();
  formData.append("name", form.value.name);
  formData.append("price", form.value.price);
  if (form.value.image) formData.append("image", form.value.image);

  await $fetch(`${config.public.apiBase}/products`, {
    method: "POST",
    body: formData,
  });

  form.value = { name: "", price: "", image: null };
  imagePreview.value = "";
  if (fileInput.value) fileInput.value.value = "";

  refresh();
};

const deleteProduct = async (id) => {
  if (confirm("Are you sure you want to delete this product?")) {
    await $fetch(`${config.public.apiBase}/products/${id}`, {
      method: "DELETE",
    });
    refresh();
  }
};

const deleteAllProducts = async () => {
  if (confirm("Are you sure you want to delete ALL products?")) {
    try {
      await $fetch(`${config.public.apiBase}/products`, {
        method: "DELETE",
      });
      refresh();
    } catch (err) {
      console.error("Failed to delete all products:", err);
    }
  }
};
</script>

<template>
  <div class="mb-6">
    <input
      v-model="search"
      placeholder="Search..."
      class="border p-2 rounded"
    />
  </div>

  <form @submit.prevent="submit" class="space-y-4 mb-6">
    <input
      v-model="form.name"
      placeholder="Name"
      class="border p-2 rounded w-full"
      required
    />
    <input
      v-model="form.price"
      type="number"
      placeholder="Price"
      class="border p-2 rounded w-full"
      required
    />
    <input ref="fileInput" type="file" @change="handleFile" />
    <img v-if="imagePreview" :src="imagePreview" class="w-32 mt-2" />
    <button class="bg-blue-600 text-white px-4 py-2 rounded">
      Add Product
    </button>
  </form>

  <button
    @click="deleteAllProducts"
    class="bg-red-700 text-white px-4 py-2 rounded mb-4"
  >
    Delete All Products
  </button>

  <div
    v-for="product in products"
    :key="product._id"
    class="border p-4 mb-2 rounded flex gap-4 items-center"
  >
    <img
      v-if="product.image"
      :src="`http://localhost:5000/uploads/${product.image}`"
      class="w-20"
    />
    <div>
      <h2 class="font-bold">{{ product.name }}</h2>
      <p>${{ product.price }}</p>
      <div class="flex gap-2 mt-2">
        <NuxtLink
          :to="`/products/${product._id}`"
          class="bg-yellow-400 text-white px-2 py-1 rounded"
        >
          Edit
        </NuxtLink>
        <button
          @click="deleteProduct(product._id)"
          class="bg-red-500 text-white px-2 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  </div>

  <div class="mt-4 flex gap-2">
    <p class="text-sm mt-2">
      Page {{ page }} of {{ Math.ceil(total / limit) }}
    </p>
    <button
      @click="page--"
      :disabled="page <= 1"
      class="bg-gray-300 px-2 py-1 rounded cursor-pointer hover:bg-gray-200"
    >
      Prev
    </button>
    <button
      @click="page++"
      :disabled="page * limit >= total"
      class="bg-gray-300 px-2 py-1 rounded cursor-pointer hover:bg-gray-200"
    >
      Next
    </button>
  </div>
</template>
