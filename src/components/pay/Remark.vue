<template>
  <div class="remark">
          <TitleCpn @left-click="comeBack">
                   <div class="icon-arrow_lift" slot="left" ></div>
         </TitleCpn>
      <div class="content">
          <div class="text-box">
              <textarea class="remark-text" placeholder="请填写备注信息" v-model="remarkData"  cols="30" rows="10" maxlength="50"></textarea>
              <span class="count">{{remarkData.length}}/50</span>
          </div>
          <h2 class="remark-title">快捷输入</h2>
          <div class="k-ipt">
              <span @click="checkIt(index)" class="remark-item" v-for="(item,index) in remarkItem" :key="index">{{item}}</span>
          </div>

          <div class="complete" @click="completed">完成</div>
      </div>
  </div>
</template>

<script>
import TitleCpn from '../common/TitleCpn'

export default {
    data() {
        return {
            remarkData:'',
            remarkItem:[
                '请放门把手上',
                '请放门口',
                '请放请放前台桌上',
                '如地址封闭管理，请电话与我联系'
            ]
        }
    },
components:{
    TitleCpn
},
methods: {
    comeBack(){
        this.$router.go(-1)
    },
    checkIt(i){
        let str = this.remarkData
        str += this.remarkItem[i]
       this.remarkData= str.length >50 ? str.slice(0,50) : str 
    },
    completed(){
        this.$router.push({name:'Pay',params:{remark:this.remarkData}})
    }
},
}
</script>

<style lang="scss" scoped>
    $baseColor:#abba11;
    .remark{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #f5f8fa;
        padding: 10px;
        .content{
            .text-box{
                position: relative;
                 .remark-text{
                width: 100%;
                border: none;

                &::-webkit-input-placeholder{
                    color: #b9b9b9;
                }
            }
            .count{
                padding: 2px;
                position: absolute;
                bottom: 2px;
                right: 10px;
                background-color: #f5f8fa;

            }
            }
            .remark-title{
                color: #999999;
                margin-top: 25px 0 20px 0;
            }
            .k-ipt{
            display: flex;
            flex-wrap: wrap;

                .remark-item{
                    border: 1px solid $baseColor;
                    padding:6px 10px ;
                    color: $baseColor;
                    margin: 10px 10px 10px 0;
                    border-radius: 2px;
                }
            }
           .complete{
               margin: 60px 38px 0 38px;
               background-color: $baseColor;
               font-size: 18px;
               font-weight: 700;
               color: #fff;
               height: 50px;
               text-align: center;
               line-height: 50px;
               border-radius: 50px;
           }
        }
    }
</style>