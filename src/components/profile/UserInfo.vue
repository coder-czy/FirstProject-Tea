<template>
  <div class="edit-address">
      <TitleCpn @left-click="back" :title="'用户信息'">
        <div slot="left" class="icon-arrow_lift" ></div>
      </TitleCpn>
      <div class="edit-content" :key="keyNum">
          <div class="form">
           <FormItem :title="'昵称'">
               <input type="text" placeholder="请输入昵称" v-model="nickname" slot="center">
           </FormItem>
           <FormItem :title="'手机号'">
              <p slot="center">{{memberData.mobilePhone}}</p>
           </FormItem>
           <FormItem :title="'性别'">
              <div slot="center" class="select-sex">
                  <span v-for="(item, index) in ['先生','女士']" :key="index" :class="{active: currentIndex===index}" @click="changeSex(index)">{{item}}</span>
              </div>
           </FormItem>
           <FormItem :title="'生日'">
            
               <p slot="center"  @click="changeBirth">{{birthday || '生日当天有惊喜'}}</p>
               <div slot="right" class="icon-keyboard_arrow_right arrow-right"    @click="changeBirth"></div>

           </FormItem>
           <FormItem :title="'入会时间'">
               <p slot="center">{{memberData.openingCardDate}}</p>
           </FormItem>
          </div>
      </div>
      <div class="save" @click="setMember">保存</div>


      <van-popup v-model="show" position="bottom" :style="{ height: '50%' }" >
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
       
        @confirm="confirmDate"
        @cancel="cancelDate"
        :formatter="formatter"
        :columns-order="[ 'year','month', 'day']"
        />
        </van-popup>
  </div>
</template>

<script>
import TitleCpn from '../common/TitleCpn'
import FormItem from '../address/FormItem'
import {mapState,mapMutations} from 'vuex'
import {SET_MEMBER} from '../../store/mutations/mutation-types'
import {formatDateTime} from '../../assets/tool/util'
export default {
name:'userInfo',
components:{
    TitleCpn,
    FormItem
},
data() {
    return {
       currentIndex:0,
       memberData:{},
       birthday:'',
       nickname:'',
       show:false,
       minDate: new Date(1900, 0, 1),
       maxDate: new Date(2025, 0, 1),
       currentDate: new Date(),
    }
},

activated(){
    this.setMemberData()
    this.changeIndex()
},
computed: {
    ...mapState(['member']),
    newMember(){
        return {...this.memberData,gender:this.currentIndex,nickname:this.nickname,birthday:this.birthday}
    },
    keyNum(){
        return Math.random()
    }
   
},
methods: {
    ...mapMutations(['SET_MEMBER']),
    back(){
        this.$router.go(-1)
    },
    changeSex(i){
        this.currentIndex = i
    },
    changeIndex(){
        this.currentIndex = this.member.gender
        this.birthday = this.member.birthday
        this.nickname = this.member.nickname
    },
    setMemberData(){
        this.memberData =this.member
    },
    changeBirth(){
        this.show = true

    },
    confirmDate(val){
        this.show = false
        
        this.birthday = formatDateTime(val,'yyyy-MM-dd')
    },
    cancelDate(){
        this.show =false
    },
      formatter(type, val) {
      if (type === 'year') {
        return val + '年';
      }
      if (type === 'month') {
        return val + '月';
      }
      if (type === 'day') {
        return val + '日';
      }
      return val;
    },
    setMember(){
        this.SET_MEMBER(this.newMember)
        this.$toast.success('修改资料成功');
        this.back()
    }

    
    
   
},
created() {
   this.changeIndex()
   this.setMemberData()

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