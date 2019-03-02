<template>
    <div class="helper">
        <span class="left">{{activeNum}} items left</span>
        <span class="tabs">
            <span v-for="state of states"
                  :key="state"
                  @click="filterItem(state)"
                  :class="['state', {actived: filter === state}]"
                  >
                {{state}}
            </span>
        </span>
        <span class="clear" @click="clearTodo">clear completed</span>
    </div>
</template>

<script>
    export default {
        name: 'Tabs',
        data() {
            return {
                states: ['all', 'active', 'completed'],
                filter: 'all'
            }
        },
        props: {
            activeNum: {
                type: Number,
                required: true
            }
        },
        methods: {
            filterItem(state) {
                this.filter = state
                console.log(state)
                this.$emit('filterItem', state)
            },
            clearTodo() {
               this.$emit('clearTodo')
            }

        }
    }
</script>

<style lang="stylus" scoped>
    .helper
        font-weight 100
        display flex
        justify-content space-between
        padding 5px 0
        line-height 30px
        background-color #ffffff
        font-size 14px
        font-smoothing antialiased
    .left, .clear, .tabs
        padding 0 10px
    .left .clear
        width 150px
    .left
        text-align center
    .clear
        text-align right
        cursor pointer
    .tabs
        width 200px
        display flex
        justify-content space-between
        *
            display inline-block
            padding 0 10px
            cursor pointer
            border 1px solid rgba(175,47,47,0)
            &.actived
                border-color rgba(175,47,47,0.4)
                border-radius 5px
</style>