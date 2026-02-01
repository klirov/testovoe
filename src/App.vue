<template>
    <div class="p-6 font-sans space-y-12">
        <div class="max-w-sm space-y-4">
            <form class="flex flex-col gap-3">
                <h2 class="text-lg font-semibold">Тестовая форма регистрации:</h2>
                <div>
                    <p v-if="dirty.email && errors.email" class="mb-1 text-sm text-red-600">
                        {{ errors.email }}
                    </p>
                    <input
                        type="email"
                        v-model="form.email"
                        class="w-full rounded border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
                    />
                </div>
                <div>
                    <p v-if="dirty.password && errors.password" class="mb-1 text-sm text-red-600">
                        {{ errors.password }}
                    </p>
                    <input
                        type="password"
                        v-model="form.password"
                        class="w-full rounded border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
                    />
                </div>
                <button @click.prevent="validateForm" class="mt-2 rounded bg-gray-200 transition">
                    Провалидировать форму
                </button>
            </form>

            <h3 v-if="validated && isValid" class="text-sm text-green-700 font-medium">
                Form is valid!
            </h3>
        </div>
        <div class="space-y-4">
            <h1 class="text-2xl font-bold">Posts</h1>

            <p v-if="isLoading" class="text-gray-600">Loading posts...</p>

            <p v-if="isError" class="text-red-600">Error loading posts: {{ `HTTP${status}: ${error}` }}</p>

            <ul v-if="isSuccess" class="space-y-4">
                <li v-for="post in data" :key="post.id" class="rounded border border-gray-200 p-4">
                    <h3 class="font-semibold">{{ post.title }}</h3>
                    <p class="text-sm text-gray-700">{{ post.body }}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useApi } from './composables/useApi'
import { useForm, type Rule } from './composables/useForm'

type Post = {
    userId: number
    id: number
    title: string
    body: string
}

const { data, isLoading, isSuccess, isError, error, status, request } = useApi()

onMounted(() => request<Post[]>('https://jsonplaceholder.typicode.com/posts'))

const form = reactive({
    email: '',
    password: '',
})

const { errors, dirty, isValid, validated, validateForm } = useForm(form, {
    email: [(value) => (!value ? 'Email обязателен' : null)],
    password: [(value) => ruleForPassword(value)],
})

const ruleForPassword: Rule = (value) => {
    if (typeof value === 'string') {
        return value.length < 6 ? 'Пароль должен содержать минимум 6 символов' : null
    } else {
        return 'Пароль должен быть строкой'
    }
}
</script>
