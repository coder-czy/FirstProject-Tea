<template>
  <div class="order">
    <!-- 网络异常时的empty组件 -->
      <van-empty v-if="loading" :image="image" class="empty">
      <p v-if="refreshText" class="refresh">网络异常，请点击 <i @click="refreshRquest" class="rf">刷新</i> </p>
    </van-empty>
    <div v-else>
      <!-- 订餐头部 -->
      <TitleCpn />
      <div class="order-header-container">
      
        <div class="header-top">
          <div class="header-top-left" v-if="orderType==='takeout'&&address.street">
            <p class="left-title"><span class="icon"></span>{{address.street}}</p>
            <p class="left-store">由<span class="store">{{store.name}}</span>配送</p>
          </div>
          <div class="header-top-left" v-else >
            <p class="store-title" @click="goStore"><span class="icon"></span>{{store.name}}
            <van-icon name="arrow" class="arrow-icon"/></p>
            <p class="left-store">距离您{{store.distance_text}}</p>
          </div>
          <div class="header-top-right">
            <div class="switch" @click="changeType" >
              <span class="zq" :class="{active:orderType==='takein'}">自取</span>
              <span class="wm" :class="{active:orderType==='takeout'}">外卖</span>
              <span class="bg" :class="{active:orderType==='takeout'}"></span>
            </div>
          </div>
        </div>
        <div class="header-bottom" @click="goPackages">
          <span>“霸气mini卡"超级购券活动，赶紧去购买</span><van-icon name="arrow" class="arrow-icon"/>
        </div>
      </div>

      <!-- 订餐商品内容 -->
       <div class="goods-container">
         <!-- 左边菜单 -->
          <div class="goods-menu" ref="menu">
                <ul>
              <li class="menu-item" v-for="(g,index) in goods" :key="index" :class="{active:currentIndex===index}" @click="scrollToGoodItem(index)"> 
                <van-icon :badge="menuCount(g)">
              <span class="menu-item-text">{{g.name}}</span>
              </van-icon>
              </li>
            </ul>
          </div>
          <!-- 右边的商品列表 -->   
        <div class="goods-list" ref="goods">
            <ul >
              <div class="goods-swipe">

                <van-swipe  :autoplay="8000"  indicator-color="white">
                <van-swipe-item v-for="(i, index) in ads" :key="index" >
                  <img :src="i.image"/>
                </van-swipe-item>
              </van-swipe>
              </div>
              <div v-for="(item , index) in goods" :key="index"  ref="goodsList">
          
          <li class="list-item">
          <p class="item-name"> {{item.name}}<img :src="item.icon" class="name-icon"></p>
            </li>
          
          <ol>
            <li v-for="(g,i) in item.goods_list" :key="i" class="line"  @click="openGoodsDetail(g,item.id)">
              <!-- 商品 -->
              <GoodsListItem :goods="g" @add-count="addCount" @reduce-count="reduceCount"/>

            </li>
          </ol>      
              </div>
        </ul>
        </div>
      
       </div>
    
    <!-- 购物车 -->
    <ShopCart :goods="goods" @add-count="addCount" @reduce-count="reduceCount" @empty-list="emptyList" @pay-account="pay"/>

                  <!-- 商品详情 -->
        <GoodsDetail :isShowDetail="isShowDetail"
         @close-detail="closeDetail"
          :detailFood="detailGoods"
          @add-count="addCount"
          :menuId="menuId"
          />

    </div>

  </div>
</template>

<script>
import TitleCpn from '../components/common/TitleCpn'
import GoodsListItem from '../components/common/GoodsListItem'
import ShopCart from '../components/order/ShopCart'
import GoodsDetail from '../components/order/GoodsDetail'

import BetterScroll from 'better-scroll'
import {apiGoods,apiAds,apiStore} from '../network/api'
import {mapMutations,mapState} from 'vuex'
import { SET_ORDER_TYPE,SET_CART,REMOVE_CART, SET_STORE, SET_PAY } from '../store/mutations/mutation-types'

export default {
  data() {
    return {
    goods:[],
    loading:false,
    image:'',
    refreshText:false,
    currentIndex:0,
    isWm:false,
    ads:[],
    isShowDetail:false,
    detailGoods:null,
    menuId:0,
    
   
    }
  },
  computed: {
    ...mapState(['cart','orderType','store','address']),
    shopCartCount(){
     
    },
    // 计算菜单里添加的数量
    menuCount(){
      
      return (g)=>{
      let {goods_list} = g
      let num = 0
      for(let i=0;i<goods_list.length;i++){
        if(goods_list[i]&&goods_list[i].count){
          num += goods_list[i].count
        }
        continue
      }
      return num || ''
      }
    }
  },
  components:{
    TitleCpn,
    GoodsListItem,
    ShopCart,
    GoodsDetail
  },
  created() {
   this.getData()
  
  },
  activated() {
    this.isEmpty()
  },
  methods: {
    ...mapMutations(['SET_ORDER_TYPE','SET_CART','REMOVE_CART','SET_STORE','SET_PAY']),
      // 作商品的网络请求
     getData(){
       apiGoods().then(res=>{
          this.goods = res.data
         this.initBetterScrol()
       })
       apiAds().then(res=>{
         this.ads = res.data
         this.initBetterScrol()
       })
       apiStore().then(res=>{
         this.SET_STORE(res.data)
       })
       
      },
 
       
        goPackages(){
          this.$router.push('/packages')
          // 
      },
      goStore(){
        this.$router.push('/storeDetail')
      },
          refreshRquest(){
            if(this.timer){
              clearTimeout(this.timer)
            }

            this.timer = setTimeout(() => {
              this.timer = null
              this.getData()
            }, 300);
          },
          // 切换按钮
          changeType(){
           
              
              if(this.orderType==='takein'){
  
                this.SET_ORDER_TYPE('takeout')
                if(!Object.keys(this.address).length){

                  this.$router.push('/address')
                }
              }else{
                this.SET_ORDER_TYPE('takein')
  
              }
            
       
          },
          // 初始化better-scroll
          initBetterScrol(){
            this.$nextTick(()=>{

              if(!this.menuScroll){
          
                this.menuScroll = new BetterScroll(this.$refs.menu,{
                  click:true,
                  bounce:false
                })
              }else{
                this.menuScroll.refresh()
              }
              if(!this.goodsScroll){
                this.goodsScroll = new BetterScroll(this.$refs.goods,{
                  click:true,
                  bounce:false
                })
                this.goodsScroll.on('scrollEnd',this.scrollHandle)
              }else{
                this.goodsScroll.refresh()

              }
            })
          },
          scrollHandle({y}){
            // 
            y=Math.abs(y)
            for(let i=0;i<this.$refs.goodsList.length;i++){
              if(i===this.$refs.goodsList.length-1){
                this.currentIndex = i
                break
              }
              let top = this.$refs.goodsList[i].offsetTop
              let nextTop = this.$refs.goodsList[i+1].offsetTop

              if(y>=top&&y<nextTop){
                this.currentIndex = i
                break
              }
            }

          },
          // 点击菜单滚动到对应的商品区域
          scrollToGoodItem(i){
            this.goodsScroll.scrollToElement(this.$refs.goodsList[i],300)
            this.currentIndex = i
          },
          // 打开商品详情
          openGoodsDetail(goods,id){

            
            this.isShowDetail = true
            this.detailGoods = goods,
            this.menuId = id
          },
          // 关闭详情页
          closeDetail(){
            this.isShowDetail=false
          },
          // 将详情里的添加的数量添加到对应商品中
          addCount(val){
            // 
            for(let i=0;i<this.goods.length;i++){ 

              let {goods_list} = this.goods[i]
              let food = goods_list.find(f=>f.id===val.id)

              if(food&&!food.count){
                // 在对应商品中添加count属性
                this.$set(food,'count',val.num)
                break

              }else if(food&&food.count){
                food.count+=val.num
                break

             
              }
          
            }
          
          // 加入购物车数组
        let thisFood = {id:val.id,name:val.goods.name,count:1,image:val.goods.images,price:val.goods.price,property:JSON.parse(JSON.stringify(val.goods.property))}
        let {property} = val.goods
        if(!this.cart.length){
            this.SET_CART([thisFood])
            return

        }else{
            // 判断商品是否有property属性
            let flag = true

            if(!property.length){
                let npCart = this.cart.map(f=>{
                    if(thisFood.id===f.id){
                        flag=false
                         return {...f,count:f.count+thisFood.count}
                    }else{
                        return f
                    }
                })
                
            if(flag){
                      

                this.SET_CART([thisFood,...npCart])
            }else{
                      

                  this.SET_CART(npCart)
            }
                 
                return 
            }
            // 先判断是否有相同的
          let newCart=  this.cart.map(v=>{
                // 如果相等对property进行遍历
                 if(v.id==thisFood.id){
                     
                     let len=0
                     let l=0
                     thisFood.property.forEach(v=>{
                         len+=v.values.length
                     })
                    for(let j=0;j<thisFood.property.length;j++){
                        
                     for(let k=0;k<thisFood.property[j].values.length;k++){
                         

                    if(!v.property[j].values[k].is_default==thisFood.property[j].values[k].is_default){
                             
                              return v

                    }else{
                        l++
                     
                        if(l===len){
                        
                        flag =false
                        return {...v,count:v.count+thisFood.count}
                        }
                            
                         }
                        }
                    }

                 }else{
                      
                     return v
                 }

            })
            
          

            if(flag){
                      

                this.SET_CART([thisFood,...newCart])
            }else{
                      

                  this.SET_CART(newCart)
            }
        }
    


            
          },
          // 减少商品
          reduceCount(g){
            let {id} = g
            for(let j=0;j<this.goods.length;j++){
              let {goods_list} = this.goods[j] 
              let f = goods_list.find(s=>s.id===id)
              if(f){

                f.count--
                break
              }
              continue
            }
           let reduceCart = this.cart.map(v=>{
             if(v.id===g.id){
               if(v.count>1){
                 return {...v,count:v.count-1}
               }else{
                  return 1
               }
             }else{
               return v
             }
           })
           if(reduceCart.indexOf(1)>-1){

             let index = reduceCart.indexOf(1)
             reduceCart.splice(index,1)
             this.SET_CART(reduceCart)
           }else{
             this.SET_CART(reduceCart)
           }

          },
            // 清空购物车
            emptyList(){
               this.goods.forEach(f => {
                f.goods_list.forEach((i)=>{
                if(i.count){
                  i.count =0
                }
              })
            });
            this.REMOVE_CART()
            },
            // 买单
            pay(){
              
              this.$toast.loading({
                message:'结算中',
                forbidClick: true,
                duration:200
              })
              if(Object.keys(this.address).length>0||this.orderType=='takein'){

                this.$router.push({name:'Pay',params:{foods:this.cart}})
              }else{
                this.$router.push({name:'Address'})
              }
            },
            isEmpty(){
              if(this.$store.state.isPay){
                this.emptyList()
                this.SET_PAY(false)
              }
            }
            

  },
  beforeDestroy() {
    this.menuScroll&&this.menuScroll.destory()
    this.goodsScroll&&this.goodsScroll.destory()
  },
  

  
}
</script>

<style lang="scss" scoped>
$baseColor:#a9b910;
  .order{
    height: 100vh;
    position: relative;
    .empty{
      height: 100vh;
    }
    .rf{
      color: blue;
    }
  .order-header-container{
    background-color: #fefefe;
    .header-top{
      display: flex;
      padding: 20px 10px 15px 10px;
      align-items: center;

      .header-top-left{
        flex: 1;

        .store-title{
          font-size: 14px;
          color: rgb(73,75,77);
          font-weight: 600;
          margin-bottom: 10px;

          &+p{
            margin-bottom: 4px;
          }
          .arrow-icon{
            vertical-align: middle;
          }
        }
        .left-title{
        font-size: 20px;
        color: #595a5c;
        font-weight: 800;
        margin-bottom: 10px;

        .icon{
          display: inline-block;
          width: 14px;
          height: 14px;
          margin-right:8px;
          background: url('../assets/images/order/location.png') center center no-repeat;
          background-size: contain;

        }
      }
      .left-store{
        color: #929294;
        font-size: 12px;

        .store{
          display: inline-block;
          color: $baseColor;
          margin: 0 8px;
        }

      }

      }
      .header-top-right{
        flex-basis: 112px;

        .switch{
          position: relative;
          width: 112px;
          height: 30px;
          line-height: 30px;
          color: #919193;
          font-size: 12px;
          border-radius: 30px;
          background: #f5f5f5;
          font-weight: 200;

          span{
            position: relative;
            display: inline-block;
            z-index: 10;
            
          }
          .zq{
            margin: 0 30px 0 18px;

            &.active{
              color: #fff;
            }
          }
          .wm{

             &.active{
              color: #fff;
            }
          }
          .bg{
            position: absolute;
            top: 0;
            left: 0;
            width: 60px;
            height: 30px;
            border-radius: 30px;
            background: $baseColor;
            z-index: 1;
            transition: all .1s linear;

             &.active{
              top: 0;
              left: 52px;
            }
          }

        }
      }
      
    }
    .header-bottom{
      height: 35px;
      width: 100%;
      background-color: #e7e9ce;
      color: $baseColor;
      font-size: 14px;
      line-height: 35px;
      padding: 0 15px ;

      .arrow-icon{
        float: right;
        margin-top: 9px;
      }
    }

  }

      .goods-container{
      display: flex;
      position: absolute;
      top: 158px;
      right: 0;
      bottom: 48px;
      left: 0;
      overflow: hidden;
    }

  .goods-menu{
    flex-basis: 98px;
    
    height: 100%;
    overflow: hidden;
 
    .menu-item{
      position: relative;
      display: table;
      padding: 10px 20px 10px 10px;
      height: 48px;
      width: 98px;
      font-size: 12px;
      font-weight: 200;
      line-height: 28px;
      background-color: #fefefe;
      color: #8e8f91;

      .van-info{
        background-color: $baseColor;
      }

      .menu-item-text{
        width: 68px;
        display: table-cell;
        vertical-align: middle;
        

      }

    
     &.active{
      background-color: #f5f5f5;
      color:#5a5a5c;
      }
    }
    
  } 

  .goods-list{
    flex: 1;
    height: 100%;
    padding-right: 10px;
    overflow: hidden;
    .item-name{
      border-left: 2px solid $baseColor;
      padding-left: 8px;
      background-color: #f5f5f5;
    }
    .van-swipe{
      overflow: hidden;
      width: 264px;
      margin: 10px 0 10px 10px;
   
      img{
        width: 264px;

      }
      .van-swipe-item{
        width: 100%;
      }
    }


    .list-item{
      position: relative;
      padding-left: 10px;
      font-size: 12px;
      color: rgb(147,153,159);
      line-height: 26px;
      background-color:#fefefe;
      
      
     .name-icon{
       width: 15px;
       height: 15px;
       vertical-align: middle;
       margin-left: 8px;
     }
    }
  }

  }
</style>