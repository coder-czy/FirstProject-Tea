<template>
  <div class="goods-cover" v-show="isShowDetail" @click="closeDetail">
      <div class="goods-detail" v-if="detailFood" v-show="detailFood.use_property" @click.stop="">
          
          <div class="detail-top">
              <span class="collect"></span>
              <span class="close" @click="closeDetail"></span>
              <div  class="detail-img">
              <img v-if="detailFood.imageArr" :src="detailFood.imageArr[0]">

              </div>
          </div> 
          <div class="detail-center" ref="detail">

            <div>
                <h2 class="food-name">{{detailFood.name}}</h2>
                <p class="food-content">{{detailFood.content}}</p>
                <div class="detail-property" v-if="detailFood&&detailFood.use_property" >
                <div class="property-item" v-for="(item,index) in property" :key="index">

                <p class="property-name">{{item.name}} <span class="detail-desc" v-if="item.desc">{{`(${item.desc})`}}</span> </p>

                <span class="property-val"  v-for="(v, i) in item.values" :key="i" 
                :class="{active:v.is_default}" @click="toggleProperty(item.id,v.id)">{{v.value}}</span>
                </div>
                 </div>
            </div>

          </div>
          <div class="detail-bottom">
              <div class="select-content">
                  <div class="content-left">
                      <p class="food-price">¥{{detailFood.price}}</p>
                      <p class="select-property">{{selectProperty}}</p>
                  </div>
                  <div class="content-right">
                      <Count :count="count" @add-count="addCount" @reduce-count="reduceCount"/>
                  </div>
              </div>
              <div class="add-shopcart" @click="addShopCartCount" :class="{'sell-out':!detailFood.is_sell}">加入购物车</div>
          </div>
      </div>
        <div class="no-property"  v-if="detailFood" v-show="!detailFood.use_property">
            <div class="detail-top">
              <span class="collect"></span>
              <span class="close" @click="closeDetail"></span>
              <div  class="detail-img">
              <img v-if="detailFood.imageArr" :src="detailFood.imageArr[0]">

              </div>
          </div> 
          <div class="detail-center">
                <h2 class="food-name">{{detailFood.name}}</h2>
            <p class="food-content">{{detailFood.content}}</p>
          </div>
            <div class="detail-bottom">
              <div class="select-content">
                  <div class="content-left">
                      <p class="food-price">¥{{detailFood.price}}</p>
                  </div>
                  <div class="content-right">
                      <Count :count="count" @add-count="addCount" @reduce-count="reduceCount"/>
                  </div>
              </div>
              <div class="add-shopcart" @click="addShopCartCount" :class="{'sell-out':!detailFood.is_sell}">加入购物车</div>
          </div>
        </div>
  </div>
</template>

<script>
import Count from '../common/Count'
import BetterScroll from 'better-scroll'
import {mapMutations} from 'vuex'

import {SET_CART} from '../../store/mutations/mutation-types'

export default {
    data() {
        return {
            count:1,
            currentIndex:0,
            propertyMsg:[],
            property:[],
            cart :this.$store.state.cart
 
        }
    },

    props:{
        isShowDetail:{
            type:Boolean,
            default:false   

        },
        detailFood:{
            type:Object
            
        },
        menuId:{
            type:Number
        }
    },
    computed: {
        selectProperty(i){
            let result =[]
        if(this.detailFood&&this.detailFood.property){
            this.property.forEach(v=>{
                v.values.forEach(i=>{
                    if(i.is_default){
                        result.push(i.value)
                    }
                })
            })
        }
            
        
            return result.join(',')
        }
    },
    watch: {
        isShowDetail(newval,val){
            if(newval!==val){
                this.count = 1
                this.initScroll()
                this.getCart()
            }
        },
        detailFood(newval,val){
             if(newval!==val){
               this.property = JSON.parse(JSON.stringify(this.detailFood.property))
               
            }
        }
   
    },
    methods: {
        ...mapMutations(['SET_CART']),
    closeDetail(){
        this.$emit('close-detail')
       

    },
   

    // 切换属性
    toggleProperty(pId,vId){
      if(this.detailFood&&this.detailFood.property){
        let property = this.property
        
        property.forEach(v=>{
            if(v.id===pId){
                v.values.forEach(f=>{
                    if(f.id===vId){
                        this.$set(f,'is_default',1)
                        
                        // this.$set(this.detailFood,'name','哈哈哈')
                    }else{
                        this.$set(f,'is_default',0)
                    }
                })
            }
        })
          
      }
    },

    addShopCartCount(){
        // 
        this.$emit('add-count',{id:this.detailFood.id,num:this.count,goods:this.detailFood})
        let thisFood = {id:this.detailFood.id,name:this.detailFood.name,image:this.detailFood.images,count:this.count,price:this.detailFood.price,property:JSON.parse(JSON.stringify(this.property))}
        let {use_property} = this.detailFood
        if(!this.cart.length){
            this.SET_CART([thisFood])

        }else{
            // 判断商品是否有property属性
            let flag = true

            if(!use_property){
                let npCart = this.cart.map(f=>{
                    if(thisFood.id===f.id){
                        flag=false
                         return {...f,count:f.count+thisFood.count}
                    }else{
                        return f
                    }
                })
                
            if(flag){
                    //   

                this.SET_CART([thisFood,...npCart])
            }else{
                    //   

                  this.SET_CART(npCart)
            }
                  this.closeDetail()
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
                        // 
                     for(let k=0;k<thisFood.property[j].values.length;k++){
                         

                    if(!v.property[j].values[k].is_default==thisFood.property[j].values[k].is_default){
                            //  
                              return v

                    }else{
                        l++
                     
                        if(l===len){
                        // 
                        flag =false
                        return {...v,count:v.count+thisFood.count}
                        }
                            
                         }
                        }
                    }

                 }else{
                    //   
                     return v
                 }

            })
            
          

            if(flag){
                    //   

                this.SET_CART([thisFood,...newCart])
            }else{
                    //   

                  this.SET_CART(newCart)
            }
        }
    
        
        this.closeDetail()
    },
    addCount(){
        this.count++
    },
    reduceCount(){
        this.count=this.count<=1 ? 1 : this.count -1
   },
        // 初始化better-scrool
       initScroll(){
           this.$nextTick(()=>{
               if(!this.detailScroll){

                   this.detailScroll = new BetterScroll(this.$refs.detail,{
                       click:true,
                       bounce:false
        
                   }) 
               }else{
                   this.detailScroll.refresh()
               }
           })
        },


        getCart(){
        this.cart = this.$store.state.cart
        // 
     },
    },

 
     

   
    components:{
        Count
    },
    beforeDestroy() {

        this.detailScroll&&this.detailScroll.destroy()
    },
  
    
}
     
</script>

<style lang="scss" scoped>
@import '../../style/goodsDetail.scss'
</style>