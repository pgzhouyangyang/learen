<template lang="html">
    <div class="container">
        <!-- 切换答题模式 -->
        <div class="top-tabbar">
            <div class="time-down">
                {{minute}} : {{second}}
            </div>
        </div>
        <!-- 试题内容 -->
        <div class="content" ref="scrollwrap" @touchstart="_touchstart" @touchmove="_touchmove" @touchend="_touchend">
            <transition-group :name="translateName">
                <div class="questions-item" v-if="on" key="on">
                    <div class="question_type" >
                        <span>{{currentData.questionType}}</span>
                        <span>({{currentData.score}}分/题)</span>
                        <span class="progress"><span style="color:#10aeff">{{currentIndex+1}}</span>/{{count}}</span>
                    </div>
                    <!-- 正文 -->
                    <div class="question_content">
                        <span v-html="currentData.content"></span>
                    </div>
                    <!-- 选项————答题模式 -->
                    <div class="question_options">
                        <div :class="options.letter|filterClass(currentData,checked)" v-for="(options,num) in currentData.options" @click="response(options.letter)" :answer="num+1" >
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
                        <span class="progress"><span style="color:#10aeff">{{currentIndex+1}}</span>/{{count}}</span>
                    </div>
                    <!-- 正文 -->
                    <div class="question_content">
                        <span v-html="currentData.content"></span>
                    </div>
                    <!-- 选项————答题模式 -->
                    <div class="question_options">
                        <div :class="options.letter|filterClass(currentData,checked)" v-for="(options,num) in currentData.options" @click="response(options.letter)" :answer="num+1" >
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
            <span class="submit-exam" @click="submit">交卷</span>
        </div>
         <div v-transfer-dom>
        <previewer :list="previewerList" ref="previewer" :options="options"></previewer>
        </div>
        <actionsheet v-model="isShowActions" :show-cancel="true" :menus="menus" @on-click-menu-submit="primarySbmit" ></actionsheet>
    </div>
</template>

<script>
import {filterData} from '../common/newDB'
import {imgbindclick} from '../common/common'
import Answercard from "./answercard"
import { Previewer, TransferDom, Actionsheet } from 'vux'
var timer;
var m = 9;
var s = 0;
export default {
    directives: {
        TransferDom
    },
    data(){
        return {
            isShowActions: false,
            menus:[
                {
                    label: "交卷后，错题可从错题回顾中查看。",
                    type: "disabled",
                },
                {
                    label: "确认",
                    type: "warn",
                    value: "submit"
                },
            ],
            // 倒计时
            minutes:m,
            seconds:s,
            // 图片预览列表
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
            // 滑动
            startX: 0,
            moveX: 0,
            disX: 0,
        }
    },
    // 生命周期函数 组件创建完成
    created(){
        // 请求数据
        this.axios.get("../../static/question.json").then((data)=>{
            this.dataList=filterData(data.data.data);
            this.count = data.data.data.count;
            this.currentData = this.dataList.body[this.currentIndex];
        });
        document.title="随机练习";
    },
    mounted() {
        this.imgbindclick();

        // 开启倒计时
        this.down();
    },
    // 组件
    components:{
        Answercard,
        Previewer,
        Actionsheet
    },
    computed: {
        minute() {
            return this.num(this.minutes)
        },
        second() {
            return this.num(this.seconds)
        }
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
            if(this.currentData.result == false) {
                this.isExplain = true
            } else {
                this.isExplain = false
            }
            this.$nextTick(()=>{
                setTimeout( () => {
                    this.imgbindclick();
                },600)
            });
        }
    },
    filters:{
        filterClass(letter,ans,checked){
            if(ans.checked&&checked.indexOf(letter)>=0&&ans.answer[0].indexOf(letter)>=0){
                return "item item_right"
            }
            if(ans.checked&&ans.checked.indexOf(letter)>=0){
                return "item item_wrong"
            }
            return "item"
        }
    },
    //方法 事件
    methods: {
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
            this.isExplain=!this.isExplain
        },
        //选择答案
        response(letter){
            if(this.currentData.checked) {
                return
            }
            if (this.currentData.questionType=="多选题") {
                if (this.checked.indexOf(letter)>=0) {
                    this.checked=this.checked.replace(letter,"");
                }else{
                    this.checked+=letter;
                }
                this.$set(this.currentData,'checked',this.checked);

            }else{
                this.$set(this.currentData,'checked',letter)
                this.checked=letter;
            };
            if(this.currentData.answer[0] == this.checked){
                this.$set(this.currentData,'result',true)
                setTimeout( ()=> {
                    this.nextEvent()
                },500)

            } else if(this.currentData.answer[0].indexOf(letter)<0) {
                this.$set(this.currentData,'result',false)
                this.isExplain = true;
            }

        },
        // 上一题
        preEvent(){
            if(this.currentIndex<=0){
                return;
            };
            this.isExplain = false;
            this.translateName = "translate-right";
            this.on = !this.on;
            this.currentIndex--;
        },
        // 现下一题
        nextEvent(){
            if(this.currentIndex>=this.count-1){
                return;
            };

            this.translateName = "translate-left"
            this.on = !this.on;
            this.currentIndex++;

        },
        // 调到指定题目
        jumpIndex(index){
            this.currentIndex=index
        },
        // 关闭题卡
        answercardClose() {
            this.cardON = false
        },
        // 图片预览事件
        imgbindclick(){
            var imgWrap = document.querySelectorAll(".questions-item")[0];
            imgbindclick(imgWrap,this)
        },

        num(t) {
            return t<10 ? "0"+t : ""+t
        },
        down() {
            timer = setInterval(() => {
                if(this.seconds == 0 && this.minutes != 0) {
                    this.seconds = 59;
                    this.minutes -= 1;
                } else if(this.minutes == 0 && this.seconds == 0) {
                    clearInterval(timer);
                    alert("结束");
                } else {
                    this.seconds --;
                }
            },1000)
        },
        computeTime() {
            var um = (s - this.seconds)>0?this.num(m - this.minutes):this.num(m - this.minutes - 1);
            var us = (s - this.seconds)>0?this.num(60 - (s - this.seconds)):this.num((s - this.seconds)+60);
            return um+":"+us
        },
        // 交卷
        submit() {
            this.isShowActions = true;
        },
        // 确认交卷
        primarySbmit() {
            var usedTime = this.computeTime();
            var answertrue = 0;
            var answeredfalse = 0
            this.dataList.body.map((item,index)=>{
                if(item.checked && item.answer.indexOf(item.checked)>=0){
                    answertrue++
                }
            });
            answeredfalse = this.count-answertrue;
            wx.miniProgram.redirectTo({
                url: "/pages/home/learn/suiji/result/result?usedTime="+usedTime+"&answertrue="+answertrue+"&answeredfalse="+answeredfalse
            });
        }

    }
}
</script>

<style lang="css" scoped>
    @import "../assets/question.css"

</style>
<style lang="css" scoped>
    .submit-exam {
        background-image: url(../../static/images/menu.png)
    }
    .time-down {
        color: red;
        font-size: 0.48rem;
    }
</style>
