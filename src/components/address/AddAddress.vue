<template>
  <div class="edit-address">
      <TitleCpn @left-click="back">
        <div slot="left" class="icon-arrow_lift" ></div>
      </TitleCpn>
      <div class="edit-content" v-if="adsData">
          <div class="form">
           <FormItem :title="'收货人'">
               <input type="text" placeholder="请输入收货人" v-model="adsData.accept_name" slot="center">
           </FormItem>
           <FormItem :title="'性别'">
              <div slot="center" class="select-sex">
                  <span v-for="(item, index) in ['先生','女士']" :key="index" :class="{active: currentIndex===index}" @click="changeSex(index)">{{item}}</span>
              </div>
           </FormItem>
           <FormItem :title="'手机号'">
               <input type="text" placeholder="请输入收货人联系方式" v-model="adsData.mobile" slot="center">
           </FormItem>
           <FormItem :title="'收货地址'">
               <p slot="center" @click="showErea">{{adsData.district.districts||'请选择收货地址'}}</p>
               <div slot="right" class="icon-keyboard_arrow_right arrow-right" @click="showErea"></div>
           </FormItem>
           <FormItem :title="'详细地址'">
               <input type="text" placeholder="请输入收货人详细地址" v-model="adsData.street" slot="center">
           </FormItem>
          </div>
      </div>
      <div class="save" @click="saveAddress">保存</div>
       <van-popup v-model="show" position="bottom" :style="{ height: '50%' }" >
         <van-area
            title="标题"
            :area-list="areaList"
          
            @confirm="changeDistrict"
            @cancel="cancelChange"
            />
        </van-popup>
  </div>
</template>

<script>
import TitleCpn from '../common/TitleCpn'
import FormItem from './FormItem'
import {mapMutations} from 'vuex'
import {SET_ADDRESSES} from '../../store/mutations/mutation-types'
import areaList from '../../assets/tool/area'
export default {
components:{
    TitleCpn,
    FormItem
},
data() {
    return {
        currentIndex:0,
        adsData:{
            "id": 0,
            "accept_name": "",
            "mobile": "",
            "province_name": "",
            "area": 440306,
            "city": 440300,
            "sex": 0,
            "district": {
                "districts": "",
                "area": "",
                "city": "",
                "province": ""
            },
            "street": "",
            "inner": false,
            "lat": "",
            "door_number": "AB1234",
            "is_default": 0,
            "province": 440000,
            "area_name": "",
            "city_name": "",
            "poiname": ""
        }, 
        show:false,
        areaList
    }
},
computed: {
    
},
methods: {
    ...mapMutations(['SET_ADDRESSES']),
    back(){
        this.$router.go(-1)
    },
    changeSex(i){
        this.currentIndex = i
        this.adsData.sex=this.currentIndex
    },

    saveAddress(){
        // 判断地址是否为空
        // 判断手机号码是否符合标准
        let regx = /^[1]([3-9])[0-9]{9}$/
        if(!regx.test(this.adsData.mobile)){
             this.$toast('请填写中国大陆地区手机号')
            return
        }
        // 判断是否填写地址
       if(!this.adsData.district.districts.length ||!this.adsData.accept_name.length){
           this.$toast('请完善地址信息')
            return
        }
        if(!this.adsData.street.length){
            this.$toast('请填写详细地址')
            return
        }
        
        let addresses = this.$store.state.addresses
        
       addresses.push({...this.adsData,"id":addresses.length+1})
        this.SET_ADDRESSES([...addresses])
        this.back()
        this.$toast.success('地址添加成功');
        },
        showErea(){
            this.show = true
        },
        changeDistrict(val){
            this.adsData={...this.adsData,
            "province_name":val[0].name,
            "area": val[2].code,
            "city": val[1].code,
            "district": {
            "districts": val[0].name+val[1].name+val[2].name,
            "area": val[2].name,
            "city": val[1].name,
            "province": val[0].code,
            "area_name": val[2].name,
            "city_name": val[1].name,
             },
            }
            this.show = false
        },
        cancelChange(){
            this.show = false

        }
},
created() {

},
}
</script>

<style lang="scss" scoped>
$baseColor:#abba11;
    .edit-address{
        position: fixed;
        z-index: 55;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #f5f5f5;

        .save{
        position: absolute;
        left: 40px;
        right: 40px;
        bottom: 192px;
        height: 50px;
        border-radius: 50px;
        background-color: $baseColor;
        font-size: 16px;
        color: #fff;
        line-height: 50px;
        text-align: center;
        }
        .edit-content{
            padding:10px 15px 0 15px ;
            
            .form{
                
                background-color: #fff;
                 input{
                     border: none;
                     height: 35px;
                     font-size: 14px;

                 }
                 input::-webkit-input-placeholder {
                     color: #dbdbdb;

                 }
                 p{
                     font-size: 14px;
                       color: #dbdbdb;
                 }
                 .arrow-right{
                     font-size: 24px;
                     color: #898d98;
                 }
                 .select-sex{
                     span{
                         display: inline-block;
                         width: 78px;
                         height: 30px;
                         color:#a0a4a7 ;
                         line-height: 30px;
                         text-align: center;
                         border: 1px solid #a0a4a7;
                         border-radius: 3px;
                         margin-right: 5px;

                         &.active{
                             background-color: $baseColor;
                             color: #fff;
                             border: none;
                         }

                     }
                 }
            }
        }
    }
</style>