import api from '@/services/api'
export default {
  fetchTasks () {
    return api().get('tasks')
  },
  addTask (data) {
    return api().post('add_task', data)
  },
  updateTask (data) {
    return api().put('update_task', data)
  },
  removeTask (data) {
    return api().post('remove_task', data)
  }
}
