import { computed, reactive, ref } from 'vue'

type Form = Record<string, unknown>

export type Rule = (value: unknown) => string | null

export function useForm(form: Form, rules: Record<string, Rule[]>) {
    const errors = reactive<Record<keyof Form, string | null>>({})

    const dirty = reactive<Record<keyof Form, boolean>>({})

    const validated = ref(false)

    Object.keys(form).forEach((key) => {
        errors[key] = null
        dirty[key] = false
    })

    function validateField(field: keyof Form) {
        errors[field] = null

        const fieldRules = rules[field]
        if (!fieldRules) return

        for (const rule of fieldRules) {
            const error = rule(form[field])
            if (error) {
                errors[field] = error
                break
            }
        }
    }

    function validateForm() {
        Object.keys(form).forEach((key) => {
            dirty[key] = true
            validateField(key)
        })
        validated.value = true
    }

    const isValid = computed(() => Object.values(errors).every((error) => error === null))

    return {
        errors,
        dirty,
        isValid,
        validated,
        validateField,
        validateForm,
    }
}
