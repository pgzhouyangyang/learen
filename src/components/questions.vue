<template lang="html">
    <div class="container">
        <!-- 切换答题模式 -->
        <div class="top-tabbar">
            <span :class="isAnswer=='answer_no'?'active':''" @click="tabChange('answer_no')">答题模式</span>
            <span :class="isAnswer=='answer_yes'?'active':''" @click="tabChange('answer_yes')">背题模式</span>
        </div>
        <!-- 试题内容 -->
        <div class="content" ref="scrollwrap" @touchstart="_touchstart" @touchmove="_touchmove" @touchend="_touchend">
            <transition-group :name="translateName">
                <div class="questions-item" v-if="on" key="on">
                    <div class="question_type" >
                        <span>{{currentData.questionType}}</span>
                        <span>({{currentData.score}}分/题)</span>
                        <span class="progress" @click="showCard"><span style="color:#10aeff">{{currentIndex+1}}</span>/{{count}}</span>
                    </div>
                    <!-- 正文 -->
                    <div class="question_content">
                        <span v-html="currentData.content"></span>
                    </div>
                    <!-- 选项————答题模式 -->
                    <div class="question_options" v-if="isAnswer=='answer_no'">
                        <div :class="checked.indexOf(options.letter)>=0?'item item_checked':'item'" v-for="(options,num) in currentData.options" @click="response(options.letter)" :answer="num+1" >
                            <div class="item_state" v-html="options.letter">

                            </div>
                            <div class="item_con" v-html="options.text">

                            </div>
                        </div>
                    </div>
                    <!-- 选项————背题模式 -->
                    <div class="question_options" v-if="isAnswer=='answer_yes'">
                        <div :class="options.letter,currentData |filterClass" v-for="(options,num) in currentData.options">
                            <div class="item_state" v-html="options.letter">

                            </div>
                            <div class="item_con" v-html="options.text">

                            </div>
                        </div>
                    </div>
                    <!-- 解释 -->
                    <div class="best_explain" v-if="isExplain">
                        <div class="best_explaintitle" ref="explaintitle"></div>
                        <div class="best_explaincon pt">答案：{{currentData.answer[0]}}</div>
                        <div class="best_explaincon pt">无</div>
                    </div>
                </div>

                <div class="questions-item" v-else key="off">
                    <div class="question_type">
                        <span>{{currentData.questionType}}</span>
                        <span>({{currentData.score}}分/题)</span>
                        <span class="progress" @click="showCard"><span style="color:#10aeff">{{currentIndex+1}}</span>/{{count}}</span>
                    </div>
                    <!-- 正文 -->
                    <div class="question_content">
                        <span v-html="currentData.content"></span>
                    </div>
                    <!-- 选项————答题模式 -->
                    <div class="question_options" v-if="isAnswer=='answer_no'">
                        <div :class="checked.indexOf(options.letter)>=0?'item item_checked':'item'" v-for="(options,num) in currentData.options" @click="response(options.letter)" :answer="num+1" >
                            <div class="item_state" v-html="options.letter">

                            </div>
                            <div class="item_con" v-html="options.text">

                            </div>
                        </div>
                    </div>
                    <!-- 选项————背题模式 -->
                    <div class="question_options" v-if="isAnswer=='answer_yes'">
                        <div :class="options.letter,currentData |filterClass" v-for="(options,num) in currentData.options">
                            <div class="item_state" v-html="options.letter">

                            </div>
                            <div class="item_con" v-html="options.text">

                            </div>
                        </div>
                    </div>
                    <!-- 解释 -->
                    <div class="best_explain" v-if="isExplain">
                        <div class="best_explaintitle" ref="explaintitle"></div>
                        <div class="best_explaincon pt">答案：{{currentData.answer[0]}}</div>
                        <div class="best_explaincon pt">无</div>
                    </div>
                </div>
            </transition-group >
          </div>
        <!-- 底部按钮 -->
        <div class="footbtns">
            <span class="pre" @click="preEvent" ref="preBtn">上一题</span>
            <span class="next" @click="nextEvent" ref="nextBtn">下一题</span>
            <span :class="isCollect?'collecton':'collect'" @click="isCollect=!isCollect">{{isCollect?"移除收藏":"收藏本题"}}</span>
            <span :class="isExplain?'explainon':'explain'" @click="isExplainEvent">{{isExplain?"关闭解释":"本题解释"}}</span>
        </div>
        <!-- 题卡组件 -->
        <answercard  ref="answercardRef"
        :data="dataList.body"
        :count="count"
        @jump="jumpIndex"
        ></answercard>
         <div v-transfer-dom>
        <previewer :list="previewerList" ref="previewer" :options="options"></previewer>
        </div>
    </div>
</template>

<script>
import {filterData} from '../common/newDB'
import Answercard from "./answercard"
import { Previewer, TransferDom  } from 'vux'
export default {
    directives: {
        TransferDom
    },
    data(){
        return {
            previewerList:[],
            options: {
                getThumbBoundsFn: () => {
                  // find thumbnail element
                  let thumbnail = document.querySelectorAll('.questions-item img')[this.imgIndex]
                  // get window scroll Y
                  let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
                  // optionally get horizontal scroll
                  // get position of element relative to viewport
                  let rect = thumbnail.getBoundingClientRect();

                  // w = width
                  return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
                  // Good guide on how to get element coordinates:
                  // http://javascript.info/tutorial/coordinates
                }
            },
            imgIndex:0,
            // 切换动画
            on: false,
            // 切换下一题动画类名
            translateName: "translate-left",
            //数据列表
            dataList: [],
            // 是否收藏
            isCollect: false,
            // 是否开启答案
            isExplain: false,
            // 当前数据
            currentData: {},
            // 当前数据索引
            currentIndex: 0,
            // 当前选中选项
            checked: "",
            // 总数
            count: 0,
            // 答题模式
            isAnswer: "answer_no",
            // 滑动
            startX: 0,
            moveX: 0,
            disX: 0
        }
    },
    // 组件
    components:{
        Answercard,
        Previewer
    },
    // 生命周期函数 组件创建完成
    created(){
        // 请求数据
        this.axios.get("../../static/question.json").then((data)=>{
            this.dataList=filterData(data.data.data);
            this.count = this.dataList.body.length;
            this.currentData = this.dataList.body[this.currentIndex];
        });
    },
    // 监听
    watch:{
        //监听数组索引变化
        currentIndex(val){
            this.currentData=this.dataList.body[val];
            if (this.currentData.checked) {
                this.checked=this.currentData.checked;
            }else{
                this.checked="";
            };
            this.$nextTick(()=>{
                setTimeout( () => {
                    this.imgbindclick();
                },600)

            });
        }
    },
    filters:{
        filterClass(letter,ans){
            if(ans.answer[0].indexOf(letter)>=0){
                return "item item_right"
            }
            if(ans.checked&&ans.checked.indexOf(letter)>=0){
                return "item item_wrong"
            }
            return "item"
        }
    },
    mounted() {
        this.imgbindclick();
    },
    //方法 事件
    methods: {
        // 选择答题模式
        tabChange(option) {
            this.isAnswer = option;
            if(option == "answer_yes") {
                this.isExplain = true;
            } else {
                this.isExplain = false;
            }
        },
        // 滑动开始
        _touchstart(event) {
            if(event.touches.length == 1) {
                // 记录手指按下位置
                this.startX = event.touches[0].clientX;
            }

        },
        _touchmove(event) {
            if(event.touches.length == 1) {
                // 滑动过程中的实时位置
                this.moveX = event.touches[0].clientX;
                // 计算滑动距离
                this.disX = this.startX - this.moveX;
            }
        },
        _touchend(event) {
            if(event.changedTouches.length == 1) {
                if(this.disX>0 && this.disX>50) {
                    this.nextEvent();
                }
                if(this.disX<0 && this.disX<-50) {
                    this.preEvent();
                }
            }
            this.disX = 0;
        },
        // 开启/关闭解释
        isExplainEvent(){
            if(this.isAnswer == "answer_yes") {
                return
            }
            this.isExplain=!this.isExplain
        },
        //选择答案
        response(letter){
            if (this.currentData.questionType=="多选题") {
                if (this.checked.indexOf(letter)>=0) {
                    this.checked=this.checked.replace(letter,"");
                }else{
                    this.checked+=letter;
                }
                this.$set(this.currentData,'checked',this.checked)
            }else{
                this.$set(this.currentData,'checked',letter)
                this.checked=letter;
            }
            if(this.currentData.answer[0] == this.checked){
                this.$set(this.currentData,'result',true)

            } else if(this.currentData.answer[0].indexOf(letter)<0) {
                this.$set(this.currentData,'result',false)
            }
        },
        // 上一题
        preEvent(){
            if(this.currentIndex<=0){
                return;
            };
            // this.$refs.preBtn.classList.add("active");
            // setTimeout(() => {
            //     this.$refs.preBtn.classList.remove("active");
            // },300)
            if(this.isAnswer == "answer_no") {
                this.isExplain = false;
            } else {
                this.isExplain = true;
            }
            this.translateName = "translate-right";
            this.on = !this.on;
            this.currentIndex--;
        },
        // 现下一题
        nextEvent(){
            if(this.currentIndex>=this.count-1){
                return;
            };
            // this.$refs.nextBtn.classList.add("active");
            // setTimeout(() => {
            //     this.$refs.nextBtn.classList.remove("active");
            // },300);
            if(this.isAnswer == "answer_no") {
                this.isExplain = false;
            } else {
                this.isExplain = true;
            }

            this.translateName = "translate-left"
            this.on = !this.on;
            this.currentIndex++;
        },
        // 显示题卡
        showCard(){
            if(this.isAnswer == "answer_no") {

                this.$refs.answercardRef.open();

            }
        },
        // 调到指定题目
        jumpIndex(index){
            this.currentIndex=index
        },
        // 图片预览事件
        imgbindclick(){
            var _this = this
            var imgWrap = document.querySelectorAll(".questions-item")[0];
            var imgs = imgWrap.querySelectorAll("img")
            if(imgs.length) {
                for (var i = 0; i < imgs.length; i++) {
                    ;(function(i) {
                        imgs[i].onclick=function(event){
                            event.stopPropagation();
                            var p = imgs[i].clientWidth/imgs[i].clientHeight
                            var h = 800/p
                            _this.previewerList= [(
                                {
                                    src: this.src,
                                    h: h,
                                    w: 800,
                                }
                            )];
                            _this.imgIndex = i;
                            setTimeout( () => {
                                _this.$refs.previewer.show(0)
                            })

                        }

                    })(i)


                }
            }
        }
    }
}
</script>

<style lang="css" scoped>
    @import "../assets/question.css"
</style>
