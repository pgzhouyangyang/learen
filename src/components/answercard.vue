<template lang="html">
    <transition name="ansCardTrans">
    <div class="answercard" v-show="isShowAnsCard" ref="scrollwrap" @scroll="scrollY">
        <div class="answercard-main">
            <ul class="answercard-header" ref="ansheader">
                <li>
                    答对
                    <span class="true">{{answertrue}}</span>
                </li>
                <li>
                    答错
                    <span class="false">{{answerfalse}}</span>
                </li>
                <li>
                    未答
                    <span class="unanswer">{{unanswered}}</span>
                </li>
                <li class="iconfont icon-guanbi close-icon" @click="close"></li>
            </ul>
            <div class="tiban" id="tiban" ref="tibanScroll">
                <div class="classify-top fixedTitle" v-if="Object.keys(classifyData).length>1" v-show="fixedTitle" ref="fixed">
                    <span  class="level levle-left"></span>
                    {{fixedTitle}}
                    <span class="level levle-right"></span>
                </div>
                <div class="classify-item" v-for="(val,key) of classifyData" ref="listGroup">
                    <div class="classify-top" v-if="Object.keys(classifyData).length>1">
                        <span  class="level levle-left"></span>
                        {{val.title}}
                        <span class="level levle-right"></span>
                    </div>
                    <ul class="tiban-list">
                        <li  v-for="(item,index) in val.list" @click="jump(item.index)">
                            <div :class="item.result">
                                {{item.index+1}}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    </transition>
</template>

<script>
import {classQues} from '../common/newDB'
const TITLE_HEIGHT = 48
export default {
    // 父组件传递的数据
    props:["data","count"],
    data(){
        return {
            answered: 0,
            unanswered: 0,
            answertrue: 0,
            answerfalse: 0,
            isShowAnsCard: false,
            currentIndex: 0,
            titleHeight: 0,
            diff: 0
        }
    },
    // 计算属性
    computed:{
        classifyData() {

            return classQues(this.data);
        },
        fixedTitle() {
            if (this.scrollY > 0) {
              return ''
            }
            return this.classifyData[this.currentIndex] ? this.classifyData[this.currentIndex].title : ''
        }
    },
    created() {
        this.listHeight = []
    },
    mounted(){

    },
    watch: {
        isShowAnsCard(val) {
            if(val) {
                setTimeout(() => {
                    this._calculateHeight()
                }, 20)
            }
        },
        diff(val) {
            let fixedTop = (val > 0 && val < TITLE_HEIGHT) ? val - TITLE_HEIGHT : 0
            if (this.fixedTop === fixedTop) {
              return
            }
            this.fixedTop = fixedTop
            this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
            }
    },
    methods: {
        scrollY(e) {

            const listHeight = this.listHeight
            // 当滚动到顶部，newY>0
            if (e.target.scrollTop  == 0) {
              this.currentIndex = 0
              return
            }
            // 在中间部分滚动
            for (let i = 0; i < listHeight.length - 1; i++) {
              let height1 = listHeight[i]
              let height2 = listHeight[i + 1]
              if (e.target.scrollTop >= height1 && e.target.scrollTop < height2) {
                this.currentIndex = i
                this.diff = height2 - e.target.scrollTop
                return
              }
            }
            // 当滚动到底部，且-newY大于最后一个元素的上限
            this.currentIndex = listHeight.length - 2
        },
        _calculateHeight() {
            this.listHeight = []
            const list = this.$refs.listGroup
            let height = 0
            // this.$refs.ansheader.offsetHeight
            this.listHeight.push(height)
            for (let i = 0; i < list.length; i++) {
              let item = list[i]
              height += item.clientHeight
              this.listHeight.push(height)
            }
        },
        open() {
            this.isShowAnsCard = true
            this.data.map((item,index)=>{
                if(item.checked && item.answer.indexOf(item.checked)>=0){
                    item.result = "true"
                    this.answertrue++
                } else if(item.checked && item.answer.indexOf(item.checked)<0) {
                    item.result = "false"
                    this.answerfalse++
                }
            });
            this.unanswered = this.count-(this.answertrue+this.answerfalse)
        },
        close(){
            this.isShowAnsCard = false
        },
        jump(index){
            this.$emit("jump",index);
            this.close();
        }
    }
}
</script>

<style lang="css" scoped>
    .ansCardTrans-enter-active, .fade-leave-active {
        transition: all .5s;
    }
    .ansCardTrans-enter {
        transform: translateY(100%);
    }
    .answercard{
        position: fixed;
        top: 0;
        bottom: 0;
        width:100%;
        z-index: 10;
        background: #fff;
        overflow-y: scroll;
    }
    .answercard::-webkit-scrollbar{
        display: none;
    }
    .answercard-header {
        position: fixed;
        display: block;
        padding: .3rem 0;
        top: 0;
        left: 0.3rem;
        right: 0.3rem;
        border-bottom: 1px solid #f0f0f0;
        background-color: #fff;
        z-index: 1;
    }
    .answercard-header li {
        float: left;
        color: #333;
        font-size: .28rem;
        padding-right: .8rem;
    }
    .answercard-header li span {
        padding-left:.1rem;
    }
    .answercard-header .true {
        color: #54b143;
    }
    .answercard-header .false {
        color: #f25e5e;
    }
    .answercard-header .unanswer {
        color: #999;
    }
    .answercard-header .close-icon{
        float: right;
        padding-right: 0;
    }
    .answercard-main {
        padding: 0 0.3rem;
    }
    .tiban{
        position: relative;
        top: 0.9rem;
        z-index: 0;
        overflow: hidden;
        padding-bottom: 0.3rem
    }
    .tiban-list:after{
        content: " ";
        display: block;
        width: 0;
        height: 0;
        clear: both;
    }
    .tiban-list li{
        float: left;
        width: .9rem;
        margin: .3rem 0 0 .3rem;
    }
    .tiban-list li:nth-of-type(6n+1) {
        margin-left: 0
    }
    .tiban-list li div{
        width: 100%;
        height: .72rem;
        background-color: #d2d2d2;
        border-radius: .06rem;
        text-align: center;
        line-height: .72rem;
        color: #fff;
        font-size: .28rem;
    }
    .classify-top {
        /* padding-top: 0.3rem;
        padding-bottom: 0.3rem; */
        height: 48px;
        font-size: 18px;
        line-height: 48px;
        text-align: center;
        display: flex;
        align-items: baseline;
        /* font-size: 0.36rem; */
    }
    .level {
    	display: inline-block;
    	height: 1px;
    	flex-grow: 1;
    	background-color: #eee;
    }
    .levle-left {
        margin-right: 10px;
    }
    .levle-right {
        margin-left: 10px;
    }
    .tiban-list li div.true{
        background-color: #54b143;
    }
    .tiban-list li div.false{
        background: #f25e5e;
    }
    .fixedTitle {
        position: fixed;
        left: 0.3rem;
        right: 0.3rem;
        top: 0.9rem;
        background: #fff
    }
</style>
