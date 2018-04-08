<template lang="html">
    <div class="footbtns">
        <span class="prev" @click="preEvent" ref="prevBtn">上一题</span>
        <span class="next" @click="nextEvent" ref="nextBtn">下一题</span>
        <span :class="isCollect?'collecton':'collect'" @click="isCollect=!isCollect">{{isCollect?"移除收藏":"收藏本题"}}</span>
        <span :class="isExplain?'explainon':'explain'" @click="isExplainEvent">{{isExplain?"关闭解释":"本题解释"}}</span>
    </div>
</template>

<script>
export default {
    prop: ["btns"]
    data() {
        return {

        }
    },
    computed: {
        btns() {
            return this.createfoot(this.btns)
        }
    },
    methods: {
        createfoot(data) {
            data.map((item) => {

            })
        }
    }
}
</script>

<style lang="css" scoped>
.footbtns .prev {
    background-image: url(../../static/images/lx_bottom_btn_pre.png)
}
.footbtns .next {
    background-image: url(../../static/images/lx_bottom_btn_next.png)
}
.footbtns .collect {
    background-image: url(../../static/images/lx_bottom_btn_collect.png)
}
.footbtns .explain {
    background-image: url(../../static/images/lx_bottom_btn_explain.png)
}

.footbtns .collecton {
    color: #54b244;
    background-image: url(../../static/images/lx_bottom_btn_collect_on.png);
}
.footbtns .explainon {
    color: #54b244;
    background-image: url(../../static/images/lx_bottom_btn_explain_on.png)
}
.best_explain{
    margin-top: 0.3rem;
    background-color: #fff;
}
.best_explaintitle {
    background: url(../../static/images/lx_best_explain.jpg) no-repeat;
    background-size: 66px;
    height: 22px;
}
.best_explaincon {
    color: #963;
    font-size: 15px;
    line-height: 20px;
    padding-top: 15px;
}
</style>
