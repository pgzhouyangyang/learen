<template lang="html">
    <!-- <div class="home">
        <router-link to="/questions">顺序练习</router-link>
        <router-link to="/suiji">随机练习</router-link>
    </div> -->

</template>

<script>
export default {
    data() {
        return {
            skill_id: this.$route.query.skill_id,
            level_id: this.$route.query.level_id,
            type_id: this.$route.query.type_id
        }
    },
    created() {
        // alert(
        //     "skill_id:  " +this.skill_id + "\n"+
        //     "level_id:  " +this.level_id + "\n"+
        //     "type_id:  " +this.type_id + "\n"
        // )
        this.$router.push({
            name: "questions",
            params: {
                skill: this.skill_id,
                level: this.level_id,
                type: this.type_id
            }
        })
    }
}
</script>

<style lang="css">
    .home {
        margin: 100px auto;
        display: flex;
        justify-content: space-around;
        text-align: center;
    }
</style>
