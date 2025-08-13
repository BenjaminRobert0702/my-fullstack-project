import { ref, onMounted } from 'vue'

export function useDarkMode() {
  const isDark = ref(localStorage.getItem('isDark') === 'true')

  const toggleDark = () => {
    isDark.value = !isDark.value
    localStorage.setItem('isDark', isDark.value)
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  onMounted(() => {
    document.documentElement.classList.toggle('dark', isDark.value)
  })

  return { isDark, toggleDark }
}
