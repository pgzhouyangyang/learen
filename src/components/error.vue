<template lang="html">
    <div class="container">
        <div class="empty-block" v-if="isempty">
            <div class="">
                <icon type="warn" size="27"/>
                <span style="margin-left:5px">未查询到符合条件的数据</span>
            </div>
        </div>
        <!-- 切换答题模式 -->
        <div class="top-tabbar" v-if="Object.keys(currentData).length">
            <span :class="isAnswer=='answer_no'?'active':''" @click="tabChange('answer_no')">答题模式</span>
            <span :class="isAnswer=='answer_yes'?'active':''" @click="tabChange('answer_yes')">背题模式</span>
        </div>
        <!-- 试题内容 -->
        <div class="content" ref="scrollwrap" @touchstart="_touchstart" @touchmove="_touchmove" @touchend="_touchend">
            <transition-group :name="translateName">
                <div class="questions-item" v-if="on" key="on">
                    <div class="question_type" v-if="Object.keys(currentData).length">
                        <span>{{typeArr[currentData.type-1]}}</span>
                        <span>({{currentData.score}}分/题)</span>
                        <span class="progress" @click="showCard"><span style="color:#10aeff">{{currentIndex+1}}</span>/{{count}}</span>
                    </div>
                    <!-- 正文 -->
                    <div class="question_content">
                        <span v-html="currentData.content"></span>
                    </div>
                    <!-- 选项————答题模式 -->
                    <div class="question_options" v-if="isAnswer=='answer_no'&&currentData.type!=5">
                        <div :class="checked.indexOf(latterArr[num])>=0?'item item_checked':'item'" v-for="(options,num) in currentData.options" @click="response(latterArr[num],options)" :answer="num+1">
                            <div class="item_state">
                                {{latterArr[num]}}
                            </div>
                            <div class="item_con" v-html="options.content">

                            </div>
                        </div>
                    </div>
                    <!-- 选项————背题模式 -->
                    <div class="question_options" v-if="isAnswer=='answer_yes'&&currentData.type!=5">
                        <div :class="options |filterClass" v-for="(options,num) in currentData.options">
                            <div class="item_state">
                                {{latterArr[num]}}
                            </div>
                            <div class="item_con" v-html="options.content">

                            </div>
                        </div>
                    </div>
                    <!-- 解释 -->
                    <div class="best_explain" v-if="isExplain">
                        <div class="best_explaintitle" ref="explaintitle">
                            <span class="">查看答案</span>
                        </div>
                        <div class="answer_wapp">
                            <div class="best_explaincon pt" v-if="currentData.type!=5" v-for="item in answer">{{item.latter+" "}}  {{item.content}}</div>
                            <div class="best_explaincon pt" v-if="currentData.type==5&&item.type=='y'" v-for="item in currentData.calculations">{{item.var}}={{item.val}}</div>
                        </div>
                    </div>
                </div>

                <div class="questions-item" v-else key="off">
                    <div class="question_type" v-if="Object.keys(currentData).length">
                        <span>{{typeArr[currentData.type-1]}}</span>
                        <span>({{currentData.score}}分/题)</span>
                        <span class="progress" @click="showCard"><span style="color:#10aeff">{{currentIndex+1}}</span>/{{count}}</span>
                    </div>
                    <!-- 正文 -->
                    <div class="question_content">
                        <span v-html="currentData.content"></span>
                    </div>
                    <!-- 选项————答题模式 -->
                    <div class="question_options" v-if="isAnswer=='answer_no'&&currentData.type!=5">
                        <div :class="checked.indexOf(latterArr[num])>=0?'item item_checked':'item'" v-for="(options,num) in currentData.options" @click="response(latterArr[num],options)" :answer="num+1" >
                            <div class="item_state">
                                {{latterArr[num]}}
                            </div>
                            <div class="item_con" v-html="options.content">

                            </div>
                        </div>
                    </div>
                    <!-- 选项————背题模式 -->
                    <div class="question_options" v-if="isAnswer=='answer_yes'&&currentData.type!=5">
                        <div :class="options|filterClass" v-for="(options,num) in currentData.options">
                            <div class="item_state">
                                {{latterArr[num]}}
                            </div>
                            <div class="item_con" v-html="options.content">

                            </div>
                        </div>
                    </div>
                    <!-- 解释 -->
                    <div class="best_explain" v-if="isExplain">
                        <div class="best_explaintitle" ref="explaintitle">
                            <span class="">查看答案</span>
                        </div>
                        <div class="answer_wapp">
                            <div class="best_explaincon pt" v-if="currentData.type!=5" v-for="item in answer">{{item.latter+" "}}  {{item.content}}</div>
                            <div class="best_explaincon pt" v-if="currentData.type==5&&item.type=='y'" v-for="item in currentData.calculations">{{item.var}}={{item.val}}</div>
                        </div>
                    </div>
                </div>
            </transition-group >
          </div>

        <!-- 底部按钮 -->
        <div class="footbtns" v-if="Object.keys(currentData).length">
            <span class="pre" @click="preEvent" ref="preBtn">上一题</span>
            <span class="next" @click="nextEvent" ref="nextBtn">下一题</span>
            <span :class="isCollect?'collecton':'collect'">{{isCollect?"移除收藏":"收藏本题"}}</span>
            <span :class="isExplain?'explainon':'explain'" @click="isExplainEvent">{{isExplain?"隐藏答案":"查看答案"}}</span>
        </div>
        <!-- 题卡组件 -->
        <answercard  ref="answercardRef"
        :data="dataList"
        :count="count"
        @jump="jumpIndex"
        ></answercard>
         <div v-transfer-dom>
        <previewer :list="previewerList" ref="previewer" :options="options"></previewer>
        </div>
    </div>
</template>

<script>
import {mapMutations, mapState} from 'vuex'
import {getTopError, getErrorType, getError, favorite, delFavorite} from '../api/request'
import {filterData} from '../common/newDB'
import Answercard from "./answercard"
import { Previewer, TransferDom, Loading, Icon } from 'vux'
import  { LoadingPlugin,Toast  } from 'vux'
import Vue from 'vue'
Vue.use(LoadingPlugin)
Vue.use(Toast)
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
            // 分页
            pageSize: 20,
            pageNow: 1,
            // 总数
            count: 0,
            // 答题模式
            isAnswer: "answer_no",
            // 滑动
            startX: 0,
            moveX: 0,
            disX: 0,
            isLoading: true,
            ids: [],
            isempty: false,
            collectIds: []

        }
    },
    // 组件
    components:{
        Answercard,
        Previewer,
        Loading,
        Icon
    },
    // 生命周期函数 组件创建完成
    created(){
        this.getQuery();
        document.title="错题回顾";
        var parms = {...this.query};
        getErrorType(parms).then((data)=> {
            this.dataList = data.data.typeList;
            this.count = data.data.typeList.length;
            if(this.dataList.length) {
                this.jumpIndex(parseInt(parms.index));
            } else {
                this.isempty = true;
            }
        })
    },
    // 监听
    watch:{
        //监听数组索引变化
        currentIndex(val){
            this.currentData = this.dataList[val];
            if (this.currentData.checked) {
                this.checked=this.currentData.checked;
            }else{
                this.checked="";
            };
            this.$nextTick(()=>{
                var timer = setInterval(()=> {
                    if(this.isLoading) {
                        setTimeout( () => {
                            this.imgbindclick();
                        },600)
                        clearInterval(timer)
                    }
                },10)

            });
        }
    },
    filters:{
        filterClass(item){
            if(item.isAnswer){
                return "item item_checked"
            }
            // if(ans.checked&&ans.checked.indexOf(latter)>=0){
            //     // return "item item_wrong"
            // }
            return "item"
        }
    },
    computed: {
        ...mapState(['query']),
        answer() {
            var answerArr = [];
            if(this.currentData.type != 5) {
                this.currentData.options.map((item,index)=> {
                    if(item.isAnswer) {
                         // latter += this.latterArr[index];
                         answerArr.push({
                             latter: this.latterArr[index],
                             content: item.content
                         })
                    }
                })
            }
            return answerArr;
        },
        // 是否收藏
        isCollect () {
            if(this.currentData.favorite) {
                return true;
            }
            return false;
        },
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
    },
    //方法 事件
    methods: {
        splitIds(operation,index,size) {
            if(!size) {
                size = 20;
            }
            var beginIndex = 0;
            var endIndex = 0;
            if(operation == "pre") {
                if(index >= size) {
                    beginIndex = index - size;
                }
                if(index > 0) {
                    endIndex = index;
                }
            } else {
                beginIndex = parseInt(index/20)*size;
                endIndex = beginIndex + size;
                if((index+1)%20 == 0) {
                    endIndex += size
                }
                if((index-1)%20 == 0) {
                    beginIndex -= size
                }
                if(endIndex >= this.count) {
                    endIndex = this.count;
                }
                if(beginIndex<=0) {
                    beginIndex = 0;
                }
            }
            var ids = [];
            for(var i = beginIndex; i < endIndex; i++) {
                ids.push(this.dataList[i].id);
            }
            this.ids = ids
        },
        getData(fn) {
            this.$vux.loading.show({
                text: '加载中'
            });
            var parms = {...this.query};
            parms.ids =  this.ids
            getError(parms).then((data)=> {
                this.dataList = this.appendData(this.dataList,data.data.testList);
                this.currentData = this.dataList[this.currentIndex];
                this.$vux.loading.hide();
                fn&&fn()
            })
        },
        appendData(data,append) {
            return data.map((item)=> {
                var elt = append.find((it)=> {
                    return it.id == item.id
                })
                if(elt) {
                    item = elt;
                }
                return item;
            });
        },
        ...mapMutations(['getQuery']),
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
        response(letter,options){
            if (this.currentData.type == 2 ) {
                if (this.checked.indexOf(letter)>=0) {
                    this.checked = this.checked.replace(letter,"");
                }else{
                    this.checked += letter;
                }
                this.checked = this.checked.split("").sort().join("");
                this.$set(this.currentData,'checked',this.checked);
                if(this.checked == this.multiAnswer()) {
                    this.$set(this.currentData,'result',true);
                } else {
                    this.$set(this.currentData,'result',false);
                }
            }else{
                this.$set(this.currentData,'checked',letter)
                this.checked = letter;
                if(options.isAnswer) {
                    this.$set(this.currentData,'result',true)
                } else {
                    this.$set(this.currentData,'result',false)
                }

            }
        },
        multiAnswer() {
            var latter = "";
            this.answer.forEach((item,index)=> {
                latter += item.latter
            })
            return latter
        },
        // 上一题
        preEvent() {
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

            this.translateName = "translate-right";
            this.on = !this.on;

            if(this.currentIndex - 1 >= 0 && !this.dataList[this.currentIndex-1].content) {
                this.ids = this.splitIds("pre", this.currentIndex);
                this.isLoading = false;
                this.getData(()=> {
                    this.currentIndex--;
                });
            } else {
                this.currentIndex--;
            }
            if(this.isAnswer == "answer_no") {
                this.isExplain = false;
            } else {
                this.isExplain = true;
            }
        },
        // 下一题
        nextEvent() {
            if(this.currentIndex>=this.count-1){
                // 显示文字
                this.$vux.toast.show({
                    type: 'text',
                    text: '已经是最后一道题',
                    time: 1000,
                    position: 'middle'
                });
                return;
            }
            this.translateName = "translate-left"
            this.on = !this.on;
            if(this.currentIndex+1<=this.count&&!this.dataList[this.currentIndex+1].content) {
                this.splitIds("next",this.currentIndex+1);
                this.getData(()=> {
                    this.currentIndex++
                });
            } else {
                this.currentIndex++
            }
            if(this.isAnswer == "answer_no") {
                this.isExplain = false;
            } else {
                this.isExplain = true;
            }
        },
        // 显示题卡
        showCard(){
            this.$refs.answercardRef.open();
        },
        // 跳转指定题目
        jumpIndex(index) {
            this.currentIndex = index;
            if(!this.dataList[this.currentIndex].content) {
                this.splitIds("next",index);
                this.getData();
            }
            if(this.isAnswer == "answer_no") {
                this.isExplain = false;
            } else {
                this.isExplain = true;
            }
        },
        // 图片预览事件
        imgbindclick(){
            var _this = this
            var imgWrap = document.querySelectorAll(".questions-item")[0]||document.querySelectorAll(".questions-item")[1];
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
        },
        // collectEvent() {
        //     if(this.isCollect) {
        //         delFavorite({
        //             testId: this.currentData.id
        //         }).then((data)=> {
        //             if(data.data.success) {
        //                 this.$set(this.currentData,"favorite",false)
        //                 this.$vux.toast.show({
        //                  text: '取消成功',
        //                  type: "success",
        //                  time: 1000
        //                 })
        //             };
        //         })
        //     } else {
        //         favorite({
        //             testId: this.currentData.id
        //         }).then((data)=> {
        //             if(data.data.success) {
        //                 this.$set(this.currentData,"favorite",true)
        //                 this.$vux.toast.show({
        //                  text: '收藏成功',
        //                  type: "success",
        //                  time: 1000
        //                 })
        //             }
        //         })
        //     }
        // }
    }
}
</script>

<style lang="css" scoped>
    @import "../assets/question.css";
</style>
<style lang="css">
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
    body .weui-toast_text {
        width: auto!important;
        padding: 0 18px;
    }
    body .weui-toast {
        border-radius: 0.1rem;
        top: 50%;
        transform: translate(-50%,-50%);
    }
    body .weui-icon-warn {
        font-size: 25px;
        color: #f76260;
    }
    .pswp__bg {
        background: #fff!important;
    }
    .pswp__top-bar {
        background: #fff!important;
        opacity: 0
    }
</style>
