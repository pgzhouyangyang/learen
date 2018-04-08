<template>
  <div id="app" class="app">
    <router-view class="router"/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
.app {
    height:100%;
}
.container {
    min-width: 100%;
    height: 100%;
    display: -webkit-box;
    display: flex;
    min-height: 100vh;
    flex-direction: column;
}
.content{
    width: 100%;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    position: relative;
}
.content::-webkit-scrollbar{
    display: none;
}
.questions-item {
    padding: 0.3rem 0.3rem;
    font-size: .36rem;
    color: #333;
    line-height: 1.7;
    text-align: left;
    position: absolute;
}


.footbtns{
    height: 1.08rem;
    border-top: 1px solid #e7e5e2;
    background: #fff;
    display: -webkit-box;
    display: -moz-box;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    border-top: 1px solid #f0f0f0;
}
.footbtns span{
    -webkit-flex: 1;
    flex: 1;
    -webkit-box-flex: 1;
    display: block;
    text-align: center;
    padding-top: 0.7rem;
    font-size: 0.26rem;
    color: #999;
    background-position: center 0.14rem ;
    background-repeat: no-repeat;
    background-size: 0.46rem;

}

.questions-item img{
    max-height: 120px;
    width: auto;
    max-width: 100% !important;
    display: block;
    margin: 0 auto;
}

</style>
