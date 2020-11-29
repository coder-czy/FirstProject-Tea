<template>
  <div class="pay">
    <TitleCpn @left-click="comeBack">
      <div class="icon-arrow_lift" slot="left"></div>
    </TitleCpn>
    <div class="pay-content">
      <div class="pay-type">
        <div class="take-in" v-if="orderType == 'takeout'">
          <div class="title" @click="goAddress">
            <div class="title-left">
              <p class="ads-name">{{ address.street }}</p>
              <p class="msg">{{ address.accept_name + address.mobile }}</p>
            </div>
            <div class="title-right">
              <i class="icon-keyboard_arrow_right"></i>
            </div>
          </div>
          <div class="send-time">
            <div class="send-left">
              <p class="time-title">预计送达时间</p>
              <p class="send-tip">特殊时期减少接触，请修改下方订单备注</p>
            </div>
            <div class="send-right" @click="choseTime">
              <span class="time">{{sendTime || currentTime}}</span>
              <i class="icon-keyboard_arrow_right"></i>
            </div>
          </div>
        </div>
        <div class="take-out" v-else>
          <div class="take-sotre">
            <div class="store-left">
              <h2 class="store-name">{{ store.name }}</h2>
            </div>
            <div class="store-right">
              <span class="store-icon"></span>
            </div>
          </div>
          <div class="person-msg">
            <div class="msg-left">联系电话</div>
            <div class="msg-right">
              <span class="mobile">{{ address.mobile }}</span>
              <span class="write-btn">自动填写</span>
            </div>
          </div>
          <div class="take-time">
            <div class="time-left">预计取餐时间</div>
            <div class="time-right"  @click="choseTime">
              <span class="text"> {{sendTime || '立即取餐'}}</span>
              <i class="icon-keyboard_arrow_right"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="goods-list">
        <div class="goods-item" v-for="(item, index) in foods" :key="index">
          <div class="item-top">
            <div class="item-left">{{ item.name }}</div>
            <div class="item-center">x {{ item.count }}</div>
            <div class="item-right">¥{{ item.price * item.count }}</div>
          </div>
          <div class="item-bottom" v-if="item.property.length">
            {{ item.property }}
          </div>
        </div>
      </div>
      <p class="benefit-tip">
        <span class="tip-icon">!</span> 优惠券不与满赠、满减活动共享
      </p>
      <div class="check-package">
        <div class="package-item" @click="goGiftCards">
          <div class="package-icon"><span class="zhi">值</span></div>
          <div class="package-name">3.9元起购会员卷包</div>
          <div class="to-buy">
            立即购买
            <i class="icon-keyboard_arrow_right"></i>
          </div>
        </div>
        <div class="takein-money" v-if="orderType == 'takeout'">
          <div class="money-item">
            <span>包装费</span>
            <span>¥2</span>
          </div>
          <div class="money-item">
            <span>配送费</span>
            <span>¥5</span>
          </div>
        </div>
        <div class="package-item">
          <div class="package-icon"><span class="juan">卷</span></div>
          <div class="package-name">奈雪卷</div>
          <div class="to-buy">
            1张可用
            <i class="icon-keyboard_arrow_right"></i>
          </div>
        </div>
        <div class="package-item">
          <div class="package-icon"><span class="ka">卡</span></div>
          <div class="package-name">礼品卡</div>
          <div class="to-buy">
            请选择
            <i class="icon-keyboard_arrow_right"></i>
          </div>
        </div>
      </div>
      <div class="pay-type">
        <h2>支付方式</h2>
        <div class="balance">
          <div
            class="balance-top"
            :class="{ active: member.balance >= getTotalPrice }"
          >
            <div class="balance-left">
              <van-icon name="gold-coin" class="font-icon" />
              <p>
                余额支付<span class="fs">(余额 ¥{{ member.balance }})</span>
              </p>
            </div>
            <div class="balance-right">
              <p class="fs">{{member.balance>0? '':'余额不足'}}</p>
              <div class="icon-box" @click="togglePayType('balance')">
                <div class="icon-border"></div>
                <van-icon name="checked" v-show="!isWechat" />
              </div>
            </div>
          </div>
          <span class="balance-bottom">储值最高享买一赠一卷 </span>
        </div>
        <div class="wechat">
          <div class="wechat-left">
            <van-icon name="wechat" class="font-icon" />
            <p>微信支付</p>
          </div>
          <div class="wechat-right">
            <div class="icon-box" @click="togglePayType('wechat')">
              <div class="icon-border"></div>
              <van-icon name="checked" v-show="isWechat" />
            </div>
          </div>
        </div>
      </div>
      <div class="remark" @click="toRemark">
        <p>备注</p>
        <div class="to-remark">
          <p>{{ getRemark || "点击填写备注" }}</p>
        </div>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="package-bottom">
      <div class="bottom-btn">
        <div class="price">
          合计<span class="money">¥{{ getTotalPrice}}</span>
        </div>
        <div class="buy-btn" @click="goBuy">购买</div>
      </div>
    </div>
    <router-view></router-view>
    <van-popup v-model="show" position="bottom" @click-overlay="closePopup" :style="{ height: '30%' }" >

      <van-datetime-picker v-model="currentTime" type="time" @confirm="getTime" @cancel="closePopup" />
    </van-popup>
  </div>
</template>

<script>
import TitleCpn from "../components/common/TitleCpn";
import { mapMutations, mapState } from "vuex";
import { SET_PAY } from "../store/mutations/mutation-types";
export default {
  data() {
    return {
      remarkText: "",
      foods: [],
      isWechat: true,
      show:false,
      currentTime:'',
      sendTime:''
    };
  },
  filters: {
  
    // 计算每一列商品的总价格
    getItemListPrice(food) {
      return food.count * food.price;
    },
  },
  components: {
    TitleCpn,
  },
  computed: {
    ...mapState(["address", "orderType", "store", "member",'takingData']),
    getRemark() {
      if (this.$route.params.remark) {
        return this.$route.params.remark;
      }
    },
    getTotalPrice() {
      if (this.foods) {
       let price=  this.foods.reduce((oldval, val) => {
          return oldval + val.count * val.price;
        }, 0);

        if(this.orderType=='takein'){
          return price
        }else{
          return price+7
        }
      }
    },
   
  },
  methods: {
    ...mapMutations(["SET_PAY","SET_TakingData",'SET_MEMBER']),
    comeBack() {
      this.$router.go(-1);
    },
    toRemark() {
      this.$router.push("/pay/remark");
    },
    goGiftCards() {
      this.$router.push("/giftCards");
      // 
    },
     choseTime(){
      this.show  =true
    },
    closePopup(){
      this.show = false
    },
    getTime(val){
      this.sendTime = val
      this.show = false
    },
    goAddress() {
      this.$router.push({ name: "Address", params: { path: "/pay" } });
    },
    getData() {
      // return 
      if (Object.keys(this.address).length<=0&&this.orderType!=='takein') {
        this.$router.push("/address");
      }
      if (this.$route.params.foods) {
        let food =JSON.parse(JSON.stringify(this.$route.params.foods))  ;

        for(let i=0;i<food.length;i++){
            if (Array.isArray(food[i].property)&&food[i].property.length>0) {
              
          let result =[]
          food[i].property.forEach((v) => {
           v.values.forEach((i) => {
             if (i.is_default) {
               result.push(i.value);
             }
           });
         });
         food[i].property= result.join(",")
        }
        }

          
          this.foods = food
      }
      //   
    },
    goBuy() {
      // return 
      let data  = {
        goods:this.foods,
        orderType:this.orderType=='takein' ? '打包' : '外卖',
        postscript:this.orderType=='takein' ? '打包' : '外卖',
        order_no:`NO${new Date().getTime()}`,
        pay_mode:this.isWechat ? '微信支付' :'余额支付',
        multi_store:this.store.name

      }
      if(!this.isWechat){
        let balance = this.member.balance-this.getTotalPrice
        this.SET_MEMBER({...this.member,balance})
      }
      this.SET_TakingData([data,...this.takingData])
      // 
       this.$router.push({name:'Taking'})
       this.SET_PAY(true)
    },
    //   切换支付方式
    togglePayType(type) {
      if (this.member.balance >= this.getTotalPrice) {
        if (
          (this.isWechat && type == "wechat") ||
          (!this.isWechat && type == "balance")
        ){

          return;
        }
        this.isWechat = !this.isWechat;
      }
    },
  },
  activated() {
    this.getData();
    this.currentTime =  `${new Date().getHours()}:${new Date().getMinutes()}`
  },
};
</script>

<style lang="scss" scoped>
$baseColor: #abba11;

.pay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 30;
  background-color: #f5f8fa;

  .pay-content {
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    bottom: 60px;
    background-color: #fff;
    margin: 10px;
    padding: 15px;
    overflow: scroll;

    .icon-keyboard_arrow_right {
      position: relative;
      top: 0;
      right: -5px;
      font-size: 25px;
      color: #919191;
      text-align: right;
      vertical-align: middle;
    }

    .take-in {
      .title {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 25px;

        .title-left {
          flex: 1;
          color: #484b4d;

          .ads-name {
            font-size: 18px;
            color: #2a2a2a;
            margin-bottom: 10px;
            font-weight: 600;
          }

          .msg {
            font-size: 14px;
            color: #b0b0b0;
          }
        }
        .title-right {
          flex-basis: 50px;
          text-align: right;
        }
      }
      .send-time {
        display: flex;
        justify-content: center;
        align-items: center;

        .send-left {
          flex: 1;
          .time-title {
            font-size: 16px;
            color: #6f7173;
            margin-bottom: 8px;
          }
          .send-tip {
            font-size: 12px;
            color: $baseColor;
          }
        }
        .send-right {
          flex-basis: 50px;

          .time {
            font-size: 14px;
            color: #3b3b3b;
          }
        }
      }
    }
    .take-out {
      .take-sotre {
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: 50px;

        .store-left {
          flex: 1;
          color: #56595a;
        }
        .store-right {
          flex-basis: 20px;
          .store-icon {
            display: inline-block;
            width: 20px;
            height: 20px;
            background: url("../assets/images/order/location.png") center center
              no-repeat;
            background-size: contain;
          }
        }
      }
      .person-msg {
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: 50px;
        border-top: 1px solid #f1f2f3;

        .msg-left {
          flex-basis: 80px;
          color: #484b4d;
        }
        .msg-right {
          flex: 1;
          font-size: 12px;
          color: #7f8285;
          text-align: right;

          .write-btn {
            padding: 4px 8px;
            border: 1px solid $baseColor;
            border-radius: 2px;
            color: $baseColor;
            margin-left: 8px;
          }
        }
      }
      .take-time {
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: 50px;
        .time-left {
          flex: 1;
          text-align: left;
          color: #484b4d;
        }
        .time-right {
          flex: 1;
          text-align: right;

          .text {
            color: $baseColor;
          }
        }
      }
    }
    .goods-list {
      margin: 30px 0;
      .goods-item {
        padding: 10px 0;
        height: 57px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .item-top {
          display: flex;
          justify-content: center;
          align-items: center;

          .item-left {
            flex: 1;
            color: #7c7e7f;
          }
          .item-center {
            flex-basis: 40px;
            color: #56595a;
            text-align: center;
            margin-right: 30px;
          }
          .item-right {
            flex-basis: 60px;
            color: #484b4d;
            text-align: right;
            font-weight: 700;
            font-size: 20px;
          }
        }
        .item-bottom {
          font-size: 12px;
          color: #a1a1a1;
          margin-top: 5px;
        }
      }
    }
    .benefit-tip {
      color: #ffc210;
      font-size: 12px;
      .tip-icon {
        display: inline-block;
        width: 15px;
        height: 15px;
        line-height: 15px;
        text-align: center;
        vertical-align: middle;
        padding: 3px;
        border-radius: 50%;
        border: 1px solid #ffc210;
        margin-right: 3px;
      }
    }
    .check-package {
      margin-top: 20px;
      .package-item {
        display: flex;
        justify-content: center;
        align-items: center;

        .package-icon {
          flex-basis: 50px;
          line-height: 50px;
          span {
            vertical-align: middle;

            background-color: $baseColor;
            color: #fff;
            padding: 4px;
            border-radius: 2px;

            &.zhi {
              background-color: #ffc210;
            }
          }
        }
        .package-name {
          flex: 1;
          color: #484b4d;
        }
        .to-buy {
          flex-basis: 100px;
          text-align: right;
          color: $baseColor;
        }
      }
    }
    .takein-money {
      .money-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 30px;
        font-size: 14px;
        color: #505050;
      }
    }
    .pay-type {
      margin-top: 20px;
      h2 {
        color: #666666;
        line-height: 40px;
      }
      .balance {
        margin-top: 10px;

        .balance-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #c2c2c2;
          margin-bottom: 8px;
          &.active {
            color: #505050;
            .font-icon {
              color: #505050;
            }
          }
          .font-icon {
            color: #c2c2c2;
          }
          .fs {
            font-size: 14px;
          }

          .balance-right,
          .balance-left {
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
        .balance-bottom {
          background-color: $baseColor;
          color: #fff;
          font-size: 12px;
          padding: 2px 6px;
          border-top-left-radius: 15px;
          border-bottom-right-radius: 15px;
          .icon-keyboard_arrow_right {
            font-size: 12px;
            color: #fff;
          }
        }
      }
      .wechat {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 0;

        .wechat-left {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
      .font-icon {
        font-size: 22px;
        color: #07c160;
        margin-right: 5px;
      }
      /deep/.van-icon-checked {
        font-size: 22px;
        color: $baseColor;
      }
      .icon-border {
        position: absolute;
        top: 0;
        left: 0;
        width: 22px;

        height: 22px;
        font-size: 20px;
        text-align: left;
        color: $baseColor;
        line-height: 20px;
        border-radius: 50%;
        border: 1px solid #aaa;
      }
      .icon-box {
        position: relative;
        width: 22px;
        height: 22px;
        margin-left: 5px;
      }
    }
    .remark {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #484b4d;

      .to-remark {
        flex-basis: 80%;
        overflow: hidden;
        p {
          width: 100%;
          color: $baseColor;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: right;
        }
      }
    }
  }
  .package-bottom {
    position: absolute;
    bottom: 0;
    left: -10px;
    right: 0;

    background-color: #fff;

    .bottom-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 60px;
      line-height: 60px;
      background-color: #fff;
      .price {
        flex: 1;
        height: 100%;
        padding-left: 20px;
        color: #7a7d7f;
        font-size: 12px;

        .money {
          color: #4f5253;
          font-size: 20px;
          font-weight: bold;
          margin-left: 8px;
        }
      }
      .buy-btn {
        flex-basis: 110px;
        background-color: $baseColor;
        height: 100%;
        text-align: center;
        color: #fff;
        font-size: 18px;
        font-weight: 700;
      }
    }
  }
}
</style>