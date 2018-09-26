<template>
  <div class="container" id="app">
    <div class="add-task">
      <div class="input-group">
        <input class="input-task" v-model="newTask" @input="checkDuplicate" placeholder="New task"/>
        <div class="input-alarm" v-if="duplicated">Duplicate isn't allowed</div>
      </div>
      <button class="add-button" @click="addTask" :disabled="duplicated || !newTask">
        <font-awesome-icon icon="plus" />
        <span class="button-title">Add</span>
      </button>
    </div>
    <ul class="task-list" v-if="tasks.length">
      <li class="task-item" v-for="task in tasks" :key="task.id">
        <input class="task-name"
               v-model="task.name"
               :ref="'task'+task.id"
               :disabled="!task.editing"
        />
        <div class="task-actions">
          <template>
            <font-awesome-icon icon="check"
                               v-if="task.editing"
                               class="task-action"
                               @click="updateTask(task)"
            />
            <font-awesome-icon icon="pen"
                               v-else
                               class="task-action"
                               @click="editTask(task)"
            />
          </template>
          <font-awesome-icon icon="trash" class="task-action" @click="removeTask(task)"/>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import taskService from './services/taskService'

export default {
  name: 'app',
  data: () => ({
    tasks: [],
    newTask: '',
    duplicated: false
  }),
  methods: {
    addTask () {
      const timestamp = +new Date()
      const task = {
        id: this.tasks.length ? this.tasks[this.tasks.length - 1].id + 1 : 0,
        name: this.newTask,
        createdAt: timestamp,
        updatedAt: timestamp,
        editing: false
      }
      this.tasks.push(task)
      this.newTask = ''
      taskService.addTask(task)
        .then(res => {
        console.log(res)
        })
    },
    editTask (task) {
      task.editing = true
      this.$set(this.tasks, this.tasks.indexOf(task), task);
      setTimeout(() => {
        this.$refs['task'+task.id][0].focus()
      }, 0)
    },
    updateTask(task) {
      console.log(task.name)
      console.log(this.tasks[this.tasks.indexOf(task)].name === task.name)
      task.editing = false
      task.updatedAt = +new Date()
      this.$set(this.tasks, this.tasks.indexOf(task), task);
      taskService.updateTask(task)
        .then(res => {
          console.log(res)
        })
    },
    removeTask (task) {
      console.log(task)
      this.tasks = this.tasks.filter(item => item.id !== task.id)
      taskService.removeTask(task)
        .then(res => {
          console.log(res)
        })
    },
    checkDuplicate () {
      this.duplicated = this.tasks.some(task => task.name === this.newTask)
    }
  },
  created () {
    taskService.fetchTasks()
      .then(res => {
        this.tasks = res.data
        for (const task of this.tasks) {
          console.log(task)
          task['editing'] = false
        }
      })
  }
}
</script>

<style scoped lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.container {
  margin: 60px 20%;
  box-shadow: 0 0 3px 0 #e3e3e3;
}

.add-task {
  display: flex;
  width: calc(100% - 30px);
  padding: 10px 15px;
  background-color: #f8f8f8;

  .input-group {
    position: relative;

    max-width: 100%;
    flex-grow: 1;
    display: flex;
    align-items: center;

    .input-task {
      height: 24px;
      border: 1px #bebebe solid;
      border-radius: 12px;
      background-color: #ffffff;
      font-size: 14px;
      padding: 0 10px;
      width: calc(100% - 0px);
      &:focus {
        outline: none;
        border: 1px solid #bebeff;

    }
    }

    .input-alarm {
      position: absolute;
      right: 0;
      top: 50%;
    }
  }
  .add-button {
    cursor: pointer;
    background-color: #9999ff;
    color: #ffffff;
    height: 26px;
    border-radius: 13px;
    padding: 0 10px;
    font-size: 14px;
    border: none;
    margin-left: 15px;
      .button-title {
        margin-left: 5px;
      }
    &:disabled {
      background-color: #ddddff;
    }
  }
}
.task-list {
  list-style: none;
  padding: 5px 30px;
  margin: 0;
  box-shadow: inset 0px 5px 5px -5px #888;

  .task-item {
    display: flex;
    justify-content: space-between;
    height: 26px;
    padding: 5px 0;
    align-items: center;
    border-bottom: 1px solid #f3f3f3;
    &:last-child {
      border-bottom: none;
    }

    .task-name {
      background-color: #ffffff;
      border: none;
      width: calc(100% - 62px);
      &:focus {
        outline: none;
        border-bottom: 1px solid #bebeff;
      }
    }
    .task-actions {
      display: flex;

      .task-action {
        cursor: pointer;
        height: 16px;
        width: 16px;
        border-radius: 100%;
        padding: 3px;
        background-color: #ffffff;
        color: #bebebe;
        border: 2px solid #bebebe;
        margin-left: 5px;
        &:hover {
          border-color: #9999ff;
          color: #9999ff;
        }
      }
    }
  }
}
</style>
