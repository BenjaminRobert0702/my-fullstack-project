  <template>
    <div
      class="min-h-screen w-full transition-colors duration-300 relative"
      :class="isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-[#e0eafc] to-[#cfdef3]'"
    >
      <!-- 🌙 Dark Mode Toggle -->
      <button
        @click="toggleDark"
        class="fixed top-2.5 right-5 z-30 bg-black/10 text-black dark:text-white px-3 py-1 rounded-full backdrop-blur border border-black/10 dark:border-white/20 text-sm shadow-md"
      >
        {{ isDark ? '☀️ Light' : '🌙 Dark' }}
      </button>

      <!-- 🔷 App Header -->
      <div
        class="fixed top-0 left-0 w-full px-6 py-3 flex items-center justify-between backdrop-blur bg-white/10 dark:bg-white/5 border-b border-white/30 dark:border-white/10 z-20"
      >
        <h1 class="text-lg font-semibold text-black dark:text-white">RideRay</h1>
      </div>

      <!-- Background Blobs -->
      <div class="absolute w-80 h-80 bg-blue-300 opacity-30 rounded-full blur-3xl -top-40 -left-40 z-0"></div>
      <div class="absolute w-96 h-96 bg-pink-300 opacity-20 rounded-full blur-3xl -bottom-40 -right-40 z-0"></div>

      <!-- 💠 Login Card -->
      <div class="flex items-center justify-center min-h-screen pt-20 relative z-10">
        <div
          ref="card"
          class="login-glass-card w-full max-w-md p-6 mt-16 mb-16 rounded-2xl shadow-xl border border-white/30 text-black dark:text-white relative"
          @mousemove="handleMouseMove"
          @mouseleave="resetMouse"
          :style="cardStyle"
        >
          <h1 class="text-2xl font-bold text-center mb-2">LOGIN</h1>
          <p class="text-sm text-center opacity-70 mb-6">No account needed • We never store your number</p>

          <!-- Phone Input -->
          <form v-if="!waitingOnVerification" @submit.prevent="handleLogin">
            <div class="mb-4">
              <input
                type="text"
                v-maska
                data-maska="##########"
                v-model="credentials.phone"
                :placeholder="placeholderText"
                class="w-full px-4 py-3 rounded-md border border-black/20 dark:border-white/30 bg-white/60 dark:bg-white/10 placeholder-black/50 dark:placeholder-white/60 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black/40 dark:focus:ring-white/30"
              />
            </div>
            <button
              type="submit"
              @click="playClick"
              class="w-full py-2 px-4 rounded-md bg-black/80 dark:bg-white/20 hover:opacity-90 text-white font-medium shadow transition"
            >
              Continue
            </button>
          </form>

          <!-- OTP Input -->
          <form v-else @submit.prevent="handleVerification" class="mt-4">
            <div class="mb-4">
              <input
                type="text"
                v-maska
                data-maska="######"
                v-model="credentials.login_code"
                placeholder="123456"
                class="w-full px-4 py-3 rounded-md border border-black/20 dark:border-white/30 bg-white/60 dark:bg-white/10 placeholder-black/50 dark:placeholder-white/60 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black/40 dark:focus:ring-white/30"
              />
            </div>
            <button
              type="submit"
              @click="playClick"
              class="w-full py-2 px-4 rounded-md bg-black/80 dark:bg-white/20 hover:opacity-90 text-white font-medium shadow transition"
            >
              Verify
            </button>
          </form>
        </div>
      </div>
<!-- 🌈 Gradient Divider -->
      <div class="w-full h-[2px] bg-gradient-to-r from-pink-400 via-indigo-500 to-purple-400 opacity-70 animate-pulse"></div>

<!-- 🍎 MacOS Glassy Scroll Section -->
<section class="relative w-full px-6 py-32 bg-gradient-to-br from-[#fdfbff] to-[#e6ecff] dark:from-[#0f0f1a]/60 dark:to-[#1a1a2f]/60 backdrop-blur-2xl transition-colors duration-300 overflow-hidden">
  
  <!-- Background Blobs -->
  <div class="absolute inset-0 pointer-events-none z-0">
    <div class="absolute w-[400px] h-[400px] bg-pink-400/20 rounded-full blur-[100px] -top-20 -left-20"></div>
    <div class="absolute w-[350px] h-[350px] bg-indigo-400/20 rounded-full blur-[100px] bottom-0 right-0"></div>
  </div>

  <!-- Gradient Divider (moved up) -->
  <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-pink-400 via-indigo-500 to-purple-400 opacity-70 animate-pulse"></div>

  <!-- Content Grid -->
  <div class="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">

    <!-- How It Works -->
    <div class="rounded-2xl border border-white/20 bg-white/50 dark:bg-white/10 shadow-lg backdrop-blur-xl px-8 py-10 space-y-6 text-left transition-all">
      <div class="flex items-center space-x-4">
        <div class="bg-white/30 dark:bg-white/5 p-3 rounded-full backdrop-blur-md shadow">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h11M9 21V3m4 18l4-4m0 0l-4-4m4 4H9" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-black dark:text-white">How RideRay Works</h2>
      </div>

      <p class="italic text-gray-800 dark:text-white/80">
        Your phone, your pin, your ride — <span class="font-medium">that’s it.</span>
      </p>

      <ul class="text-gray-700 dark:text-white/70 text-sm md:text-base leading-relaxed space-y-2 pl-1">
        <li><strong>1.</strong> Enter your number — no account required.</li>
        <li><strong>2.</strong> Set your pickup and destination.</li>
        <li><strong>3.</strong> We instantly match you with a nearby biker.</li>
      </ul>

      <p class="font-medium text-gray-900 dark:text-white/80 pt-2 border-t border-white/20 pt-4 text-sm md:text-base">
        Light, fast, and just enough. Built for campus rides.
      </p>
    </div>

    <!-- About Us -->
    <div class="rounded-2xl border border-white/20 bg-white/50 dark:bg-white/10 shadow-lg backdrop-blur-xl px-8 py-10 space-y-6 text-left transition-all">
      <div class="flex items-center space-x-4">
        <div class="bg-white/30 dark:bg-white/5 p-3 rounded-full backdrop-blur-md shadow">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-pink-500 dark:text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 1.657-1.343 3-3 3s-3-1.343-3-3 3-7 3-7 3 5.343 3 7zM16.5 10a2.5 2.5 0 00-2.45 2h-.1a2.5 2.5 0 000 5h2.05a2.5 2.5 0 100-5h-.1a2.5 2.5 0 00-2.45-2z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-black dark:text-white">About Us</h2>
      </div>

      <p class="text-gray-700 dark:text-white/70 text-sm md:text-base leading-relaxed">
        RideRay was born out of a simple goal: to make short campus commutes faster, safer, and more social.
      </p>
      <p class="text-gray-700 dark:text-white/70 text-sm md:text-base leading-relaxed">
        Designed by students, for students — we built this with minimal friction in mind. No clutter, no complex forms. Just tap, ride, and go.
      </p>
      <p class="text-gray-700 dark:text-white/70 text-sm md:text-base leading-relaxed">
        We believe hyper-local ride sharing can be light, respectful, and radically simple — and that’s what RideRay is.
      </p>
    </div>
  </div>

  <!-- Bottom Gradient Accent -->
  <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[70%] h-12 bg-gradient-to-r from-purple-500 via-pink-400 to-indigo-400 blur-2xl opacity-20 rounded-full mt-24 pointer-events-none"></div>
</section>

    </div>
  </template>

  <script setup>
  import { vMaska } from 'maska'
  import { reactive, ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  import { useDarkMode } from '@/composables/useDarkMode'

  const { isDark, toggleDark } = useDarkMode()
  const router = useRouter()

  const credentials = reactive({ phone: null, login_code: null })
  const waitingOnVerification = ref(false)

  // Typing animation
  const placeholderText = ref('')
  const typingWords = ['9876543210', '9123456789', '9000012345']
  let typingIndex = 0
  let charIndex = 0
  function typePlaceholder() {
    placeholderText.value = '+91 ' + typingWords[typingIndex].slice(0, charIndex++)
    if (charIndex > typingWords[typingIndex].length) {
      charIndex = 0
      typingIndex = (typingIndex + 1) % typingWords.length
      setTimeout(typePlaceholder, 1000)
    } else {
      setTimeout(typePlaceholder, 100)
    }
  }
  onMounted(() => {
    if (localStorage.getItem('token')) router.push({ name: 'landing' })
    typePlaceholder()
  })

  // Click Sound
  const playClick = () => {
    const audio = new Audio('/src/assets/sounds/click.mp3')
    audio.volume = 0.3
    audio.play()
  }

  // Auth
  const getFormattedCredentials = () => {
    let phone = credentials.phone.replace(/\D/g, '')
    if (phone.startsWith('91')) phone = phone.slice(2)
    return { phone: '+91' + phone, login_code: credentials.login_code }
  }
  const handleLogin = () => {
    axios.post('http://localhost/api/login', getFormattedCredentials())
      .then(() => { waitingOnVerification.value = true })
      .catch((err) => alert(err.response?.data?.message || 'Something went wrong'))
  }
  const handleVerification = () => {
    axios.post('http://localhost/api/login/verify', getFormattedCredentials())
      .then((res) => {
        localStorage.setItem('token', res.data)
        router.push({ name: 'landing' })
      })
      .catch((err) => alert(err.response?.data?.message || 'Invalid code'))
  }

  // Light Glow Tracking
  const card = ref(null)
  const cardStyle = ref({})
  function handleMouseMove(e) {
    const rect = card.value.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    cardStyle.value = { '--x': `${x}px`, '--y': `${y}px` }
  }
  function resetMouse() {
    cardStyle.value = { '--x': '50%', '--y': '50%' }
  }
  </script>

  <style scoped>
  html {
    transition: background-color 0.3s ease;
  }
  .login-glass-card {
    position: relative;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 1rem;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow:
      inset 0 0 0.25rem rgba(255, 255, 255, 0.4),
      0 0 1rem rgba(0, 0, 0, 0.15);
  }
  .login-glass-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at var(--x, 50%) var(--y, 50%),
      rgba(255, 255, 255, 0.15),
      transparent 60%
    );
    pointer-events: none;
    transition: background 0.2s ease;
  }
  </style>
