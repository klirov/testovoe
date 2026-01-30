<template>
    <div>
        <div id="use-form">
            <form>
                <h2>Тестовая форма регистрации:</h2>
                <div>
                    <p v-if="dirty.email && errors.email">{{ errors.email }}</p>
                    <input type="email" v-model="form.email" />
                </div>
                <div>
                    <p v-if="dirty.password && errors.password">{{ errors.password }}</p>
                    <input type="password" v-model="form.password" />
                </div>
                <button @click.prevent="validateForm">Провалидировать форму</button>
            </form>

            <h3 v-if="validated && isValid">Form is valid!</h3>
        </div>
        <div id="use-api">
            <h1>Posts</h1>

            <p v-if="isLoading">Loading posts...</p>

            <p v-if="isError">Error loading posts: {{ `HTTP${status}: ${error}` }}</p>

            <ul v-if="isSuccess">
                <li v-for="post in data" :key="post.id">
                    <h3>{{ post.title }}</h3>
                    <p>{{ post.body }}</p>
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
<style scoped>
* {
    font-family: Inter, sans-serif;
}
#use-form {
    max-width: 360px;
    margin-bottom: 32px;
}

form {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

input {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid #d0d0d0;
    border-radius: 4px;
}

input:focus {
    outline: none;
    border-color: #888;
}

p {
    margin: 0 0 4px;
    font-size: 13px;
    color: #c0392b;
}

button {
    margin-top: 8px;
    padding: 8px 10px;
    border: none;
    border-radius: 4px;
    background: #eee;
    cursor: pointer;
}

button:hover {
    background: #e0e0e0;
}

h3 {
    margin-top: 12px;
    font-size: 14px;
    color: #2e7d32;
}
</style>
