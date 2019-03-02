<template>
    <div id="app">
        <div id="cover"></div>
        <Header></Header>
        <todo></todo>
        <Footer></Footer>
    </div>
</template>

<script>
    import './assets/styles/app.styl'
    import Header from './todo/header.vue'
    import Footer from './todo/footer.jsx'
    import Todo from './todo/todo.vue'

    export default {
        name: "App",
        components: {
            Header,
            Footer,
            Todo
        }
    }
</script>

<style lang="stylus" scoped>
</style>