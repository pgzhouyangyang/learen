<template lang="html">
    <transition name="ansCardTrans">
    <div class="answercard" v-show="isShowAnsCard" >
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
                <li class="iconfont icon-guanbi close-icon" @click="close">
                </li>
            </ul>
            <div class="tiban" id="tiban" ref="scrollwrap">
                <!-- <div class="classify-top fixedTitle" v-if="Object.keys(classifyData).length>1" v-show="fixedTitle" ref="fixed">
                    <span  class="level levle-left"></span>
                    {{fixedTitle}}
                    <span class="level levle-right"></span>
                </div> -->
                <div class="classify-item" v-for="(val,key) of classifyData" ref="listGroup" v-if="isClassify">
                    <div class="classify-top">
                        <span  class="level levle-left"></span>
                        {{val.title}}
                        <span class="level levle-right"></span>
                    </div>
                    <ul class="tiban-list">
                        <li  v-for="(item,index) in val.list" @click="jump(item.index)">
                            <div :class="item.result==1?'true':(item.result==0?'false':'')">
                                {{item.index+1}}
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="" v-if="!isClassify">
                    <ul class="tiban-list">
                        <li  v-for="(item,index) in data" @click="jump(index)">
                            <div :class="item.result==1?'true':(item.result==0?'false':'')">
                                {{index+1}}
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
import BScroll from 'better-scroll'
const TITLE_HEIGHT = 48
export default {
    // 父组件传递的数据
    props:{
        data: {
            type: Array
        },
        count: {
            type: Number,
            default: 0,
        },
        isClassify: {
            type: Boolean,
            default: true,
        }
    },
    data(){
        return {
            isShowAnsCard: false,
            currentIndex: 0,
            titleHeight: 0,
            diff: 0,
            latterArr: ["A","B","C","D","E","F"]
        }
    },
    // 计算属性
    computed:{
        classifyData() {
            return classQues(this.data);
        },
        // fixedTitle() {
        //     if (this.scrollY > 0) {
        //       return ''
        //     }
        //     return this.classifyData[this.currentIndex] ? this.classifyData[this.currentIndex].title : ''
        // },
        answertrue() {
            var num = 0;
            this.data.forEach((item,index)=>{
                if(item.result) {
                    num++
                }
            });
            return num;
        },
        answerfalse() {
            var num = 0;
            this.data.forEach((item,index)=>{
                if(item.result == false) {
                    num++
                }
            });
            return num;
        },
        unanswered() {
            return this.count-(this.answertrue+this.answerfalse)
        }
    },
    created() {
        // this.listHeight = []
    },
    mounted(){

    },
    watch: {
        // isShowAnsCard(val) {
        //     if(val) {
        //         setTimeout(() => {
        //             this._calculateHeight();
        //         }, 20)
        //     }
        // },
        diff(val) {
            let fixedTop = (val > 0 && val < TITLE_HEIGHT) ? val - TITLE_HEIGHT : 0
            if (this.fixedTop === fixedTop) {
              return
            }
            this.fixedTop = fixedTop;
            if(this.$refs.fixed) {
                this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
            }

        }
        // data() {
        //     setTimeout(() => {
        //         this._calculateHeight();
        //     }, 20)
        // }
    },
    methods: {
        // scrollY(e) {
        //     const listHeight = this.listHeight
        //     // 当滚动到顶部，newY>0
        //     if (e.target.scrollTop  == 0) {
        //       this.currentIndex = 0
        //       return
        //     }
        //     // 在中间部分滚动
        //     for (let i = 0; i < listHeight.length - 1; i++) {
        //       let height1 = listHeight[i]
        //       let height2 = listHeight[i + 1]
        //       if (e.target.scrollTop >= height1 && e.target.scrollTop < height2) {
        //         this.currentIndex = i
        //         this.diff = height2 - e.target.scrollTop
        //         return
        //       }
        //     }
        //     // 当滚动到底部，且-newY大于最后一个元素的上限
        //     this.currentIndex = listHeight.length - 2
        // },
        // _calculateHeight() {
        //     this.listHeight = []
        //     const list = this.$refs.listGroup
        //     let height = 0
        //     // this.$refs.ansheader.offsetHeight
        //     this.listHeight.push(height)
        //     for (let i = 0; i < list.length; i++) {
        //       let item = list[i]
        //       height += item.clientHeight
        //       this.listHeight.push(height)
        //     }
        // },
        answer(item) {
            var latter = [];
            item.options.map((item,index)=> {
                if(item.isAnswer) {
                     latter.push(this.latterArr[index]);
                }
            })
            return latter;
        },
        open() {
            this.isShowAnsCard = true;
            // this.data.map((item,index)=>{
            //     if(item.checked && this.answer(item).indexOf(item.checked)>=0){
            //         // item.result = "true"
            //         this.answertrue++
            //     } else if(item.checked && this.answer(item).indexOf(item.checked)<0) {
            //         // item.result = "false"
            //         this.answerfalse++
            //     }
            // });
            // this.unanswered = this.count-(this.answertrue+this.answerfalse)
        },
        close(){
            this.isShowAnsCard = false;
            // setTimeout(()=> {
            //     this.answertrue = 0;
            //     this.answerfalse = 0;
            // },300)
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
        transition: all .3s;
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
        overflow: hidden;
    }

    .answercard-header {
        flex: 0  0 1rem;
        line-height: 1rem;
        position: relative;
        z-index: 200;
        box-sizing: border-box;
        border-bottom: 1px solid #f0f0f0;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
    }
    .answercard-header li {
        color: #333;
        font-size: .36rem;
        padding-right: .4rem;
        height: 100%;
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
        width: 1.2rem;
        text-align: center;
        background: red;
        color: #fff;
        font-size: 0.4rem;
    }
    .answercard-main {
        padding: 0 0.3rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }
    .tiban{
        position: relative;
        overflow: auto;
        padding-bottom: 0.3rem;
        flex: 1;
        -webkit-overflow-scrolling:touch
    }
    .tiban::-webkit-scrollbar,.answercard::-webkit-scrollbar{
        display: none;
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
        font-size: .36rem;
    }
    .classify-top {
        height: 0.96rem;
        font-size: 0.36rem;
        line-height: 0.96rem;
        text-align: center;
        display: flex;
        align-items: baseline;
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
        top: 1rem;
        background: #fff;
        z-index: 50;
    }
</style>
