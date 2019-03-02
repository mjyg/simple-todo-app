<template>
    <section class="todo">
        <input placeholder="接下来做什么？"
               class="input-add"
               @keyup.enter="enterTodo">
        </input>
        <item v-for="todo of filterTodos"
              :todo="todo"
              :key="todo.id"
              @deleteItem="deleteItem"></item>
        <tabs @filterItem="filterItem"
              @clearTodo="clearTodo" :activeNum="activeNum"></tabs>
    </section>
</template>


<script>
    import Item from './item.vue'
    import Tabs from './tabs.vue'

    export default {
        name: 'Todo',
        components: {
            Item,
            Tabs
        },
        data() {
            return {
                todos: [],
                id: 0,
                state: 'all'
            }
        },
        computed: {
            filterTodos() {
                if (this.state === 'all') {
                    return this.todos
                }
                if (this.state === 'active') {
                    return this.todos.filter(todo => !todo.completed)
                }
                return this.todos.filter(todo => todo.completed)
            },
            activeNum() {
                return this.todos.filter(todo => !todo.completed).length
            }
        },
        methods: {
            enterTodo(event) {
                let  content = event.target.value.trim();
                if (content) {
                    this.todos.unshift({
                        id: this.id ++,
                        content,
                        completed: false
                    })
                    event.target.value = ''
                }
            },
            deleteItem(id) {
                this.todos.splice(this.todos.findIndex(todo => todo.id === id), 1)
            },
            filterItem(state) {
                this.state = state
            },
            clearTodo() {
                this.todos = this.todos.filter(todo => !todo.completed)
            }
         }
    }
</script>

<style lang="stylus" scope>
    .todo {
        width 600px
        margin 0 auto
        box-shadow 0 0 5px #666
        .input-add {
            position relative
            margin 0
            width 100%
            font-size 24px
            font-family inherit
            font-weight inherit
            line-height 1.4em
            border none
            outline none
            color inherit
            box-sizing border-box
            font-smoothing antialiased
            padding 16px 16px 16px 36px
            border none
            box-shadow inset 0 -2px 1px rgba(0, 0, 0, 0.03)
        }
    }

</style>