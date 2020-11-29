<template>
  <div class="address">
    <TitleCpn :title="'我的地址'"  @left-click="comeBack">
        <div slot="left" class="icon-arrow_lift"></div>
    </TitleCpn>
  <div class="address-box" v-if="addresses.length">
    <div v-for="(item,index) in addresses" :key="index">
      <van-swipe-cell :before-close="beforeClose" :name="index">
     <div class="address-item">
      <div class="address-content"  @click="choseAddress(item)">
        <p class="address-title">{{item.district.districts+item.street}}</p>
        <p class="address-msg"><span>{{item.accept_name}}</span> <span>{{item.sex | filterSex(item.sex)}}</span> <span>{{item.mobile}}</span></p>
      </div>
      <div class="address-edit">
        <span class="edit-icon" @click.stop="editAddress(item)"></span>
      </div>
    </div>
      <template #right>
        <van-button square type="danger" text="删除" class="delete-button" />
      </template>
  </van-swipe-cell>
    </div>
  </div>
  <div class="address-box none-address" v-else>
    <p>暂无地址信息</p>
    <p>请点击底部按钮添加地址信息</p>
  </div>
    <div class="new-address">
      <div @click="AddAddress">新增地址</div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import TitleCpn from '../components/common/TitleCpn'
import {mapState,mapMutations} from 'vuex'
import { SET_ADDRESS,SET_ADDRESSES } from '../store/mutations/mutation-types'
export default {
  data() {
    return {
   
    }
  },
components:{
    TitleCpn
},
computed: {
 ...mapState(['addresses'])
},
filters:{
  filterSex(v){
    return v===0 ? '男' : '女' 
  }
},
activated() {
  
},
methods: {
  ...mapMutations(['SET_ADDRESS','SET_ADDRESSES']),
  // 返回按钮功能
    comeBack(){
        this.$router.go(-1)
    },
  

    beforeClose({ position, instance}) {
      switch (position) {
        case 'left':
        case 'cell':
        case 'outside':
          instance.close();
          break;
        case 'right':
         this.$dialog.confirm({
            message: '确定删除吗？',
          }).then((res) => {
            if(res==='confirm'){
              let index = instance._props.name
              this.addresses.splice(index,1)
              this.SET_ADDRESSES([...this.addresses])
              this.$toast.success('删除成功')
            }

            instance.close();
          }).catch(()=>{});
          break;
      }
    },

 

    // 编辑地址或新增地址
    editAddress(val){
      this.$router.push({name:'EditAddress',params:{ads:val,addresses:this.addresses}})
    },
    AddAddress(){
      this.$router.push({name:'AddAddress'})
    },
    choseAddress(val){
      this.SET_ADDRESS(val)
      if(this.$route.params&&this.$route.params.path){
      this.$router.push(this.$route.params.path)
      return

      }
      this.$router.push('/order')
    }
  
},
created() {
 
},
}
</script>

<style lang="scss" scoped>
$baseColor:#abba11;
  .address{
    position: fixed;
    flex-direction: column;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
    display: flex;
    
    background-color: #f5f8fa;

    .none-address{
      
      p{
        line-height: 50px;
        color: #999999;
        text-align: center;

        &:nth-child(1){
          margin-top: 30vh;
        }
      }
    }
    .address-box{
    padding: 10px;
    flex: 1;
    
    .delete-button {
    height: 100%;
    }
    .address-item{
      display: flex;
      background-color: #fff;
      padding: 20px 10px;
      border-radius: 4px;
      margin-bottom: 10px;

    

      .address-content{
        flex: 1;
       margin-right: 20px;
        .address-title{
        width: 70vw;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 16px;
        line-height: 20px;
        font-weight: 600;
        color: #484b4d;
        margin-bottom: 8px;
        }

        .address-msg{
          font-size: 12px;
          line-height: 14px;
          color: #a0a2a4;
        }


      }
      .address-edit{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-basis: 20px;
        
        .edit-icon{
          width: 20px;
          height: 20px;
          background: url('../assets/images/edit.png') center center no-repeat;
          background-size: 120%;
        }
      }
    }
    } 

    .new-address{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-basis:65px ;
      background-color: #fff;
      padding: 0 40px;

     div{
       flex: 1;
       height: 49px;
       background-color: $baseColor;
       color: #fff;
       font-size: 20px;
       text-align: center;
       font-weight: 600;
       border-radius: 49px;
       line-height: 49px;
     }
    }
  }
</style>