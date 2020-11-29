<template>
    <div class="taking-item">
<div class="taking-top">
        <h2>{{payList.multi_store}}</h2> <div class="top-right">
          <span class="icon"></span>
          <span class="icon"></span>
          </div>
      </div>
      <div class="step">
        <div class="step-top">
           <div class="step-img">
            <img v-if="active<0" src="../../assets/images/order/ordered.png" alt="">
            <img v-else src="../../assets/images/order/ordered_selected.png" alt="">
        </div>
           <div class="step-img">
            <img v-if="active<1" src="../../assets/images/order/production.png" alt="">
            <img v-else src="../../assets/images/order/production_selected.png" alt="">
        </div>
           <div class="step-img">
            <img v-if="active<2" src="../../assets/images/order/delivery.png" alt="">
            <img v-else src="../../assets/images/order/delivery_selected.png" alt="">
        </div>
           <div class="step-img">
            <img v-if="active<3" src="../../assets/images/order/delivered.png" alt="">
            <img v-else src="../../assets/images/order/delivered_selected.png" alt="">
        </div>

        </div>
        <div class="step-bottom">
          <div class="step-text" :class="{activeColor:active>=0}">已下单</div>
          <div class="line" :class="{activeColor:active>=1}"></div>
          <div class="step-text" :class="{activeColor:active>=1}">制作中</div>
          <div class="line" :class="{activeColor:active>=2}"></div>
          <div class="step-text" :class="{activeColor:active>=2}">配送中</div>
          <div class="line" :class="{activeColor:active>=3}"></div>
          <div class="step-text" :class="{activeColor:active>=3}">已送达</div>
        </div>
       
      </div>
      <!-- <p class="tip">您前面还有<span class="num"> 4 </span>单待制作</p> -->


         <div class="goods-list">
              <div class="goods-item" v-for="(item,index) in payList.goods" :key="index">
                <div class="item-top">
                <div class="item-left">{{item.name}}</div>
                  <div class="item-center">x{{item.count}}</div>
                  <div class="item-right">¥{{item |getItemListPrice}}</div>
                </div>
                <div class="item-bottom" v-if="item.property.length>0">
                   {{item.property}}
                </div>
              </div>

          </div>

          <div class="pay-type">
            <div class="pay-left">
             支付方式
            </div>
            <div class="pay-right">{{payList.pay_mode}}</div>
          </div>
          <div class="pay-type" v-if="payList.orderType!=='打包'">
            <div class="pay-left">
            包装费
            </div>
            <div class="pay-right" >¥2</div>
          </div>
          <div class="pay-type" v-if="payList.orderType!=='打包'">
            <div class="pay-left">
             配送费
            </div>
            <div class="pay-right">¥5</div>
          </div>
          <div class="pay-type">
            <div class="pay-left">
             用餐方式
            </div>
            <div class="pay-right">{{payList.orderType}}</div>
          </div>
          <div class="pay-type">
            <div class="pay-left">
             金额总计
            </div>
            <div class="pay-right pay-price">¥{{getTotalPrice}}</div>
          </div>
            <div class="completed"><div class="btn"  @click="comfirm">确认收货</div></div>
    </div>
</template>

<script>

    export default {
        name:"TakingItem",
        data(){
            return {

                active:0
            }
        },
        props:{
            payList:{
                type:Object
            }
        },
         filters:{
      // 用户所选的商品的属性
   
          getItemListPrice(food){
       
            return food.count*food.price

      
    }
    },
     computed: {
     getTotalPrice(){
       let price= this.payList.goods.reduce((oldval,val)=>{
            return oldval+val.count*val.price
        },0)
         if(this.payList.orderType=='打包'){
             return price
           }else{
            return price+7
        }
    },
    
  },
  methods: {
      comfirm(){
          this.$emit('comfirm',this.getTotalPrice)
        //   
      }
  },
    }
</script>

<style lang="scss" scoped>
$baseColor:#abba11;
    .taking-item{
        background-color: #fefefe;
        margin-bottom: 10px;
    }
    .completed{
      display: flex;
      justify-content: flex-end;
      align-items:center;
      height: 50px;
      margin-top: 10px;
      .btn{
        height: 30px;
        color: #fff;
        padding: 5px 10px;
        font-size: 14px;
        line-height: 20px;
        border-radius: 4px;
        background-color: $baseColor;
      }
    }
    .step{
      margin: 20px 40px;
    }
    .step-top{
      display: flex;
      justify-content: space-between;
      align-items: center;

    .step-img{
      width: 50px;
      height: 50px;
      img{
        width: 100%;
      }
    }
    }
    .step-bottom{
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .line{
        width: 25px;
        height: 1px;
        background-color:#a2a2a4 ;
        &.activeColor{
          background-color: $baseColor;
        }
      }
      .step-text{
        font-size: 14px;
        color: #a2a2a4;
        &.activeColor{
          color: #727375;
        }
      }
    }
    .pay-type{
      display: flex;
      justify-content: space-between;
      align-items:center;
      font-size: 14px;
      line-height: 40px;

      .pay-left{
        color: #7e7f80;
      }

      .pay-right{
         color:#5b5b5c;
          font-weight: 600;
          
      }
      .pay-price{
        font-size: 20px;
      }
    }

    .tip{
      font-size: 14px;
      color: #a3a3a5;
      text-align: center;
      line-height: 30px;
      margin-top: 30px;

      .num{
        color: $baseColor;
      }
    }  .goods-list{
                margin: 30px 0;
                .goods-item{
                  height: 62px;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                    padding: 10px 0;
                   .item-top{
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    .item-left{
                        flex: 1;
                        color:#7c7e7f;
                    }
                    .item-center{
                        flex-basis: 40px;
                        color:#68686a;
                        margin-right: 40px;
                        text-align: center;
                    }
                    .item-right{
                        flex-basis: 60px;
                        color:#5b5b5c;
                        text-align: right;
                        font-weight: 600;
                        font-size: 20px;

                    }
                }
                .item-bottom{
                    font-size: 12px;
                    color: #a1a1a1;
                    margin-top: 10px;
                }
 
                }
                
            }
    .taking-top{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 10px;
      color: #7b7b7b;


      .top-right{
        .icon{
          display: inline-block;
          margin:0 10px;
          width: 25px;
          height: 25px;
          background: url('../../assets/images/order/mobile.png') center center no-repeat;
          background-size: contain;
          &:last-child{
          background: url('../../assets/images/order/navigation.png') center center no-repeat;
          background-size: contain;

          }
        }
      }


    }
  
</style>