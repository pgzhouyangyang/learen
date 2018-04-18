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
                    <div class="question_type"  v-if="Object.keys(currentData).length">
                        <span>{{typeArr[currentData.type-1]}}</span>
                        <span>({{currentData.score}}分/题)</span>
                        <span class="progress"><span>{{currentIndex+1}}</span>/{{count}}</span>
                    </div>
                    <!-- 正文 -->
                    <div class="question_content">
                        <span v-html="currentData.content"></span>
                    </div>
                    <!-- 选项————答题模式 -->
                    <div class="question_options" v-if="currentData.type!=5">
                        <div :class="latterArr[num]|filterClass(currentData,checked,answer)" v-for="(options,num) in currentData.options" @click="response(latterArr[num])" :answer="num+1" >
                            <div class="item_state">
                                {{latterArr[num]}}
                            </div>
                            <div class="item_con" v-html="options.content">

                            </div>
                        </div>
                    </div>
                    <div class="multiButton" v-if="currentData.type==2||currentData.type==5">
                        <span @click="multiButtonEvent">提交</span>
                    </div>
                    <!-- 解释 -->
                    <div class="best_explain" v-if="isExplain">
                        <div class="best_explaintitle" ref="explaintitle">
                            <span class="">查看答案</span>
                        </div>
                        <div class="answer_wapp">
                            <div class="best_explaincon pt" v-if="currentData.type!=5">{{answer}}</div>
                            <div class="best_explaincon pt" v-if="currentData.type==5&&item.type=='y'" v-for="item in currentData.calculations">{{item.var}}={{item.val}}&emsp;</div>
                        </div>
                        <!-- <div class="best_explaincon pt">无</div> -->
                    </div>
                </div>

                <div class="questions-item" v-else key="off">
                    <div class="question_type"  v-if="Object.keys(currentData).length">
                        <span>{{typeArr[currentData.type-1]}}</span>
                        <span>({{currentData.score}}分/题)</span>
                        <span class="progress"><span>{{currentIndex+1}}</span>/{{count}}</span>
                    </div>
                    <!-- 正文 -->
                    <div class="question_content">
                        <span v-html="currentData.content"></span>
                    </div>
                    <!-- 选项————答题模式 -->
                    <div class="question_options" v-if="currentData.type!=5">
                        <div :class="latterArr[num]|filterClass(currentData,checked,answer)" v-for="(options,num) in currentData.options" @click="response(latterArr[num])" :answer="num+1" >
                            <div class="item_state">
                                {{latterArr[num]}}
                            </div>
                            <div class="item_con" v-html="options.content">

                            </div>
                        </div>
                    </div>
                    <div class="multiButton" v-if="currentData.type==2||currentData.type==5">
                        <span @click="multiButtonEvent">提交</span>
                    </div>
                    <!-- 解释 -->
                    <div class="best_explain" v-if="isExplain">
                        <div class="best_explaintitle" ref="explaintitle">
                            <span class="">查看答案</span>
                        </div>
                        <div class="answer_wapp">
                            <div class="best_explaincon pt" v-if="currentData.type!=5">{{answer}}</div>
                            <div class="best_explaincon pt" v-if="currentData.type==5&&item.type=='y'" v-for="item in currentData.calculations">{{item.var}}={{item.val}}</div>
                        </div>
                        <!-- <div class="best_explaincon pt">无</div> -->
                    </div>
                </div>
            </transition-group >
          </div>
        <!-- 底部按钮 -->
        <div class="footbtns">
            <span class="pre" @click="preEvent" ref="preBtn">上一题</span>
            <span class="next" @click="nextEvent" ref="nextBtn">下一题</span>
            <span :class="isCollect?'collecton':'collect'" @click="collectEvent">{{isCollect?"移除收藏":"收藏本题"}}</span>
            <span class="submit-exam" @click="submit">交卷</span>
        </div>
         <div v-transfer-dom>
        <previewer :list="previewerList" ref="previewer" :options="options"></previewer>
        </div>
        <actionsheet v-model="isShowActions" :show-cancel="showCancel" :menus="menus" @on-click-menu-submit="primarySbmit" :close-on-clicking-mask="closeMask"></actionsheet>
    </div>
</template>

<script>
import {filterData} from '../common/newDB'
import {imgbindclick} from '../common/common'
import {getRandom,addErrorTest,favorite, delFavorite} from '../api/request'
import Answercard from "./answercard"
import { Previewer, TransferDom, Actionsheet, ToastPlugin,Toast } from 'vux'
import {mapMutations, mapState} from 'vuex'
import Vue from 'vue'
Vue.use(ToastPlugin)
Vue.use(Toast)
var timer;
var m = 4;
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
                    label: "确认交卷",
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
            typeArr: ["单选题","多选题","判断题","识图题","计算题"],
            latterArr: ["A","B","C","D","E","F"],
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
            size: 20,
            showCancel: true,
            closeMask: true,
            isLoading: true
        }
    },
    // 生命周期函数 组件创建完成
    created(){
        this.getQuery();
        document.title="随机练习";
        this.getData();
    },
    mounted() {
        this.$nextTick(()=>{
            var timer = setInterval(()=> {
                if(this.isLoading) {
                    setTimeout(()=> {
                        this.imgbindclick();
                    },600);
                    clearInterval(timer)
                }
            },10)
        })
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
        },
        ...mapState(['query']),
        answer() {
            var latter = "";
            if(this.currentData.type != 5) {
                this.currentData.options.map((item,index)=> {
                    if(item.isAnswer) {
                         latter += this.latterArr[index];
                    }
                })
            }

            return latter;
        },
        // 是否收藏
        isCollect () {
            if(this.currentData.favorite) {
                return true;
            }
            return false;
        }
    },
    // 监听
    watch:{
        //监听数组索引变化
        currentIndex(val){
            this.currentData=this.dataList[val];
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
                    if(this.currentData.inputValue) {
                        for(var i in this.currentData.inputValue) {
                            document.querySelector("#"+i).value = this.currentData.inputValue[i].value;
                            document.querySelector("#"+i).style.borderColor = this.currentData.inputValue[i].borderColor;
                            document.querySelector("#"+i).disabled = true;
                        }
                    }
                },600)
            });
        }
    },
    filters:{
        filterClass(letter,ans,checked,answer){
            // if(ans.checked&&checked.indexOf(letter)>=0&&answer.indexOf(letter)>=0){
            //     return "item item_right"
            // }
            // if(ans.checked&&ans.checked.indexOf(letter)>=0){
            //     return "item item_wrong"
            // }
            // return "item"
            if(ans.type == 2) {
                if(!ans.checked&&checked.indexOf(letter)>=0){
                    return "item item_checked"
                }
                if(ans.result == false) {
                    if(answer.indexOf(letter)>=0) {
                        return "item item_right"
                    } else {
                        return "item item_wrong"
                    }
                } else if(ans.result) {
                    if(answer.indexOf(letter)>=0) {
                        return "item item_right"
                    }
                }
            } else {
                if(ans.checked&&checked.indexOf(letter)>=0&&answer.indexOf(letter)>=0){
                    return "item item_right"
                }
                if(ans.checked&&answer.indexOf(letter)<0&&!ans.result){
                    return "item item_wrong"
                }
                if(ans.checked&&answer.indexOf(letter)>=0&&!ans.result){
                    return "item item_right"
                }
            }
            // if(ans.checked&&ans.checked.indexOf(letter)>=0){
            //     return "item item_wrong"
            // }
            return "item"
        }
    },
    //方法 事件
    methods: {
        ...mapMutations(['getQuery']),
        getData() {
            this.isLoading = false
            getRandom({
                skillItem: this.query.skillItem,
                skillLevel: this.query.skillLevel,
                size: this.size
            }).then((data)=> {
                this.dataList=data.data.testList;
                this.count = this.size;
                this.isLoading = true
                if(this.dataList.length) {
                    this.currentData = this.dataList[this.currentIndex];
                }

            })
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
            this.isExplain=!this.isExplain
        },
        //选择答案
        response(latter){
            if(this.currentData.result != undefined) {
                return
            }
            if (this.currentData.type==2) {
                if(this.checked.indexOf(latter) >=0) {
                    this.checked = this.checked.replace(latter, "");
                } else {
                    this.checked += latter;
                }
                this.checked = this.checked.split("").sort().join("");
            }else{
                this.$set(this.currentData,'checked',latter)
                this.checked=latter;
                if(this.answer == this.checked){
                    this.$set(this.currentData,'result',true)
                    setTimeout( ()=> {
                        this.nextEvent()
                    },300)
                } else {
                    this.$set(this.currentData,'result',false)
                    this.isExplain = true;
                    addErrorTest({
                        testId: this.currentData.id
                    }).then((data)=> {
                        console.log(data);
                    })
                }
            };
        },
        multiButtonEvent() {
            if(this.currentData.type == 5) {
                // console.log(document.querySelectorAll("input"));
                var  inputEle = document.querySelectorAll("input");
                this.currentData.inputValue = {};
                this.$set(this.currentData,'result',true);
                this.currentData.calculations.map((item,index)=> {
                    if(item.type == "y") {
                        var inputEle = document.querySelector("#"+item.var);
                        var resultVal = item.val.substring(0,inputEle.value.length);
                        this.currentData.inputValue[item.var] = {
                            value: inputEle.value
                        };
                        if(inputEle.value != resultVal) {
                            this.currentData.inputValue[item.var].borderColor = "red";
                            inputEle.style.borderColor = "red";
                            inputEle.disabled = true;
                            this.isExplain = true;
                            this.$set(this.currentData,'result',false);
                            return
                        }
                    }
                })


            } else if (this.currentData.type == 2) {
                if(this.checked == "") {
                    // 显示文字
                    this.$vux.toast.show({
                        type: 'text',
                        text: '请至少选择一个答案',
                        time: 1000,
                        position: 'middle'
                    });
                    return;
                }
                if(this.answer == this.checked){
                    this.$set(this.currentData,'result',true)
                    setTimeout( ()=> {
                        this.nextEvent()
                    },300)
                } else {
                    this.$set(this.currentData,'result',false)
                    this.isExplain = true;
                    addErrorTest({
                        testId: this.currentData.id
                    }).then((data)=> {
                        console.log(data);
                    })
                }
                this.$set(this.currentData,'checked',this.checked);
            }

        },
        // 上一题
        preEvent(){
            if(this.currentIndex<=0){
                // 显示文字
                this.$vux.toast.show({
                    type: 'text',
                    text: '已经是第一道题',
                    time: 1000,
                    position: 'middle'
                });
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
                // 显示文字
                this.$vux.toast.show({
                    type: 'text',
                    text: '已经是最后一道题',
                    time: 1000,
                    position: 'middle'
                });
                return;
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
            var imgWrap = document.querySelectorAll(".questions-item")[0] || document.querySelectorAll(".questions-item")[1];
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
                    this.primarySbmit();
                } else {
                    this.seconds --;
                }
            },1000)
        },
        computeTime() {
            var um = (s - this.seconds)==0?this.num(m - this.minutes):this.num(m - this.minutes - 1);
            var us = (s - this.seconds)==0?this.num(60 - (s - this.seconds)):this.num((s - this.seconds)+60);
            if(us=="60") {
                us = "00";
            }
            return um+":"+us;
        },
        // 交卷
        submit() {
            this.isShowActions = true;
        },
        // 确认交卷
        primarySbmit() {
            var usedTime = this.computeTime();
            var answertrue = 0;
            var answeredfalse = 0;
            var residue = 0;
            if(this.dataList.length) {
                this.dataList.map((item,index)=>{
                    if(item.result){
                        answertrue++
                    } else if(item.result == false) {
                        answeredfalse++
                    }
                });
            }
            residue = this.count - (answeredfalse+answertrue);
            wx.miniProgram.redirectTo({
                url: "/pages/home/learn/suiji/result/result?usedTime="+usedTime+"&answertrue="+answertrue+"&answeredfalse="+answeredfalse+"&residue="+residue
            });
        },
        collectEvent() {
            if(this.isCollect) {
                delFavorite({
                    testId: this.currentData.id
                }).then((data)=> {
                    if(data.data.success) {
                        this.$set(this.currentData,"favorite",false)
                        this.$vux.toast.show({
                         text: '取消成功',
                         type: "success",
                         time: 1000
                        })
                    }

                })
            } else {
                favorite({
                    testId: this.currentData.id
                }).then((data)=> {
                    if(data.data.success) {
                        this.$set(this.currentData,"favorite",true)
                        this.$vux.toast.show({
                         text: '收藏成功',
                         type: "success",
                         time: 1000
                        })
                    }
                })
            }
        }

    }
}
</script>

<style lang="css" scoped>
    @import "../assets/question.css";
</style>
<style lang="css" scoped>
    .submit-exam {
        background-image: url(../../static/images/menu.png)
    }
    .time-down {
        color: red;
        font-size: 0.48rem;
    }
    .multiButton {
        margin-top: .4rem;
        width: 2rem;
        height: .6rem;
        background-color: #18b4ed;
        border-radius: 4px;
    }
    .multiButton span {
        display: block;
        width: 100%;
        height: 100%;
        font-size: .3rem;
        color: #fff;
        text-align: center;
        line-height: .6rem;
    }
    .pswp__bg {
        background: #fff!important;
    }
    .pswp__top-bar {
        background: #fff!important;
        opacity: 0
    }

</style>
<style>
    body .weui-actionsheet__cell {
        padding: 0.3rem 0;
    }
    body .weui-actionsheet__cell {
        font-size: 0.36rem;
    }
    .weui-loading_toast  .weui-toast__content,.weui-toast_success .weui-toast__content{
        font-size: 0.3rem
    }
    body .weui-icon_toast.weui-loading {
        width: 0.76rem;
        height: 0.76rem;
        margin: 0.6rem 0 0;
    }
    body .weui-icon_toast.weui-icon-success-no-circle {
        margin: 0.44rem 0 0;
    }
    body .weui-icon_toast.weui-icon-success-no-circle:before {
        font-size: 1.1rem;
    }
    .weui-loading_toast,.weui-toast_success {
        font-size: 0.3rem;
    }
    body .weui-toast {
        border-radius: 0.1rem;
        top: 50%;
        transform: translate(-50%,-50%);
    }
    body .weui-toast_text {
        width: auto!important;
        padding: 0 18px;
    }
</style>
