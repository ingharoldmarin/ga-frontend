import { ref, computed, watch } from 'vue'
import { userService } from '@/api/userService'
import { useAuthStore } from '@/stores/auth'

function debounce(fn, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export function useUsers() {
  const authStore = useAuthStore()

  const users        = ref([])
  const loading      = ref(false)
  const errorMessage = ref('')
  const searchQuery  = ref('')
  const currentPage  = ref(1)
  const perPage      = ref(25)
  const totalUsers   = ref(0)
  const totalPages   = ref(1)

  const coordinatorSchoolIds = computed(() =>
    authStore.isCoordinator
      ? (authStore.user?.schools?.map(s => s.id) ?? [])
      : []
  )

  const buildFilters = () => {
    const filters = {}
    if (searchQuery.value.trim()) filters.search = searchQuery.value.trim()
    if (authStore.isCoordinator)  filters.schoolIds = coordinatorSchoolIds.value
    if (authStore.isCoordinator)  filters.excludeAdmins = true
    return filters
  }

  const loadUsers = async (page = currentPage.value) => {
    loading.value = true
    errorMessage.value = ''
    try {
      const response = await userService.getAll(page, perPage.value, buildFilters())
      users.value      = response.data ?? []
      totalUsers.value = response.total ?? 0
      totalPages.value = response.last_page ?? 1
      currentPage.value = response.current_page ?? page
    } catch (err) {
      errorMessage.value = err.response?.data?.message || 'Error al cargar usuarios'
    } finally {
      loading.value = false
    }
  }

  const debouncedSearch = debounce(() => {
    currentPage.value = 1
    loadUsers(1)
  }, 350)

  watch(searchQuery, debouncedSearch)

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
      loadUsers(page)
    }
  }

  const visiblePages = computed(() => {
    const pages = []
    const total   = totalPages.value
    const current = currentPage.value
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      if (current > 3)           pages.push('...')
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i)
      if (current < total - 2)   pages.push('...')
      pages.push(total)
    }
    return pages
  })

  return {
    users, loading, errorMessage,
    searchQuery, currentPage, perPage, totalUsers, totalPages,
    coordinatorSchoolIds,
    loadUsers, goToPage, visiblePages,
  }
}
