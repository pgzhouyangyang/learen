<template lang="html">
    <div class="">
        <h1>{{data}}</h1>
        <h1>{{a}}</h1>
        <h1>{{b}}</h1>
        <h1>{{c}}</h1>
        <h1>{{d}}</h1>
        <h1>{{e}}</h1>

        <button type="button" name="button">点击</button>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {

        }
    },
    created() {
        // console.log(this.$store);
    },
    // computed: mapState({
    //     a: "a",
    //     b: 'b',
    //     c: state => state.c,
    //     d: function(state) {
    //         console.log(this);
    //         return state.d
    //     },
    //     e(state) {
    //         console.log(this);
    //         return state.e
    //     },
    //     e: (state) => {
    //         console.log(this);
    //         return state.e
    //     }
    // })
    // computed: mapState([
    //     "a","b","c","d","e"
    // ]),
    computed: {
        data() {
            return "局部"
        },
        ...mapState({
            a: "a",
            b: 'b',
            c: state => state.c,
            d: function(state) {
                console.log(this);
                return state.d
            },
            e(state) {
                console.log(this);
                return state.e
            },
            e: (state) => {
                console.log(this);
                return state.e
            }
        })
    }
}
</script>

<style lang="css">
</style>
