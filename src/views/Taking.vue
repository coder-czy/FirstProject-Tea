<template>
  <div class="taking">
    <TitleCpn />
    <div class="has-taking clearBar" v-if="takingData.length>0">
      <TakingItem  v-for="(item,index) in takingData" :key="index" :payList="item" @comfirm="comfirm(index,$event)"/>
    </div>

    
     <div class="none-taking" v-else>
       <div class="bg-img"><img src="../assets/images/loading.gif" alt=""></div>
       <div class="none-taking-title">
         <p>您还没有点单</p>
         <p>快去犒劳一下自己吧~</p>
       </div>
       <div class="go-order" @click="goOrder">
         去点餐
       </div>
       <p class="order-history" @click="goMyOrder">查看历史订单</p>

     </div>
  </div>
</template>

<script>
import {formatDateTime} from '../assets/tool/util'
import TitleCpn from '../components/common/TitleCpn'
import TakingItem from '../components/taking/TakingItem'
import {mapMutations, mapState} from 'vuex'
export default {
  data() {
    return {
      payList:null,
      active:0
    }
  },
  computed: {
    ...mapState(['store','takingData','order']),
   
    
  },
  filters:{
      // 用户所选的商品的属性
     filterProperty(food){
            let result =[]
        
           if(food&&food.property){
                food.property.forEach(v=>{
                v.values.forEach(i=>{
                    if(i.is_default){
                        result.push(i.value)
                    }
                })
            })
           }
        
            return result.join(',')
        },
          getItemListPrice(food){
        return food.count*food.price
    }
  },
components:{
  TitleCpn,
  TakingItem
},
methods: {
  ...mapMutations(['SET_TakingData','SET_ORDER']),
  goOrder(){
    this.$router.push('/order')
  },
  goMyOrder(){
    this.$router.push('/myOrder')
  },
   getData(){
     if( this.$route.params.foods){
       
      this.payList = this.$route.params.foods
      
     }
  },
  comfirm(index,totalPrice){
    
    let data = [...this.takingData]
     let good= data.splice(index,1)
   let orderData={
     completed_time:formatDateTime (new Date()),
     total_amount:totalPrice,
     status_text:'已完成',
     ...good[0]
   }
    this.SET_TakingData(data)
    this.SET_ORDER([orderData,...this.order])

    
  }
  },
  activated() {
    this.getData()
  },
}
</script>

<style lang="scss" scoped>
$baseColor:#abba11;
.taking{
   position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  background-color: #f1f7fa;
  .has-taking{
    position: absolute;
    left: 0;
    top: 40px;
    right: 0;
    bottom: 48px;
    overflow: scroll;
    margin: 10px;
    padding-bottom:48px;

  }
  

  .none-taking{
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    left: 0;
    top: 40px;
    right: 0;
    bottom: 48px;
    background-color: #fefefe;

    .bg-img{

      img{
        height: 140px;
      }
    }
    .none-taking-title{
      p{
        color: #707275;
        font-size: 14px;
        line-height: 28px;
        text-align: center;
      }
    }
    .go-order{
      height: 50px;
      width: 175px;
      border-radius: 50px;
      font-size: 18px;
      color: #fff;
      background-color: $baseColor;
      text-align: center;
      line-height: 50px;
      margin: 50px 0 22px 0;
    }

    .order-history{
      font-size: 14px;
      color: $baseColor;

    }
    
  }
}
</style>