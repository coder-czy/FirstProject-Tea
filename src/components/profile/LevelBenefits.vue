<template>
  <div class="level-benefits">
       <TitleCpn :title="'会员权益'" @left-click="back">
        <div slot="left" class="icon-arrow_lift" ></div>
      </TitleCpn>
      <div class="content">
      <div class="level-top">
          <div class="top-title"><span class="now-level">{{level}} 会员</span><span class="tip">等级说明<span class="icon-keyboard_arrow_right"></span></span></div>
      <div class="level-step">

            <van-steps :active="active" active-color="#abba11">
            <van-step>0</van-step>
            <van-step>100</van-step>
            <van-step>500</van-step>
            <van-step>1000</van-step>
            <van-step>2000</van-step>
            <van-step>5000</van-step>
            </van-steps>
      </div>
        <div class="list">
            <span class="item">v1</span>
            <span class="item">v2</span>
            <span class="item">v3</span>
            <span class="item">v4</span>
            <span class="item">v5</span>
            <span class="item">v6</span>
        </div>
      <p class="level-value">当前成长值</p>

      
      </div>
        <div class="level-center" v-if="levelData.length">
            <van-swipe @change="onChange" touchable :show-indicators="false" :loop="false" :height="190" :width="300" :initial-swipe="active">
                <van-swipe-item  v-for="item in levelData" :key="item.level">
                <span class="current-level" v-if="item.level==active+1">当前等级</span>
                <div class="level-time" v-if="item.level==active+1">有效期至2021-06-06 23:59:59</div>
                    <img :src="item.picture" class="swipe-img">
                    </van-swipe-item>
            
                </van-swipe>
        </div>
        <div class="level-bottom">
            <h2 class="swich-level">V{{swipeLevel}}会员特权</h2>
            <div class="benefit-item">
                <div class="benefit-title">升级特权</div>
                <p class="benefit-name">奈雪的茶</p>
                <div class="card-list">
                    <div class="card-item">
                        <span class="num" v-show="swipeLevel>=5" >x2</span>
                    <div class="item-cover" v-show="swipeLevel<1">
                        <div class="cover"></div>
                        <span class="lock"></span>
                    </div>
                        <img src="../../assets/images/customer-level/1.png" alt="">
                        <p>5元外卖卷</p>
                    </div>
                    <div class="card-item">
                         <span class="num" v-show="swipeLevel>=5" >x2</span>
                          <div class="item-cover" v-show="swipeLevel<1">
                        <div class="cover"></div>
                        <span class="lock"></span>
                    </div>
                        <img src="../../assets/images/customer-level/2.png" alt="">
                        <p>茶饮满2赠1卷</p>
                    </div>
                    <div class="card-item">
                         <span class="num" v-show="swipeLevel>=5" >x2</span>
                          <div class="item-cover" v-show="swipeLevel<3">
                        <div class="cover"></div>
                        <span class="lock"></span>
                    </div>
                        <img src="../../assets/images/customer-level/3.png" alt="">
                        <p>买茶送包卷</p>
                    </div>
                </div>
                <p class="benefit-name">奈雪酒屋</p>
                <div class="card-list">
                    <div class="card-item">
                       
                          <div class="item-cover" v-show="swipeLevel<1">
                        <div class="cover"></div>
                        <span class="lock"></span>
                    </div>
                        <img src="../../assets/images/customer-level/4.png" alt="">
                        <p>酒屋特调卷</p>
                    </div>
                  
                </div>
            </div>
            <div class="benefit-item">
                <div class="benefit-title">生日特权</div>
                <p class="benefit-name">奈雪的茶</p>
                <div class="card-list">
                    <div class="card-item">
                          <div class="item-cover" v-show="swipeLevel<2">
                        <div class="cover"></div>
                        <span class="lock"></span>
                    </div>
                        <img src="../../assets/images/customer-level/5.png" alt="">
                        <p>生日免费卷</p>
                    </div>
                 
                </div>
                <p class="benefit-name">奈雪酒屋</p>
                <div class="card-list">
                    <div class="card-item">
                          <div class="item-cover" v-show="swipeLevel<3">
                        <div class="cover"></div>
                        <span class="lock"></span>
                    </div>
                        <img src="../../assets/images/customer-level/4.png" alt="">
                        <p>生日特调卷</p>
                    </div>
                  
                </div>
            </div>
            <div class="benefit-item">
                <div class="benefit-title">更多权益</div>

                <div class="card-list">
                    <div class="card-item">
                          <div class="item-cover" v-show="swipeLevel<5">
                        <div class="cover"></div>
                        <span class="lock"></span>
                    </div>
                        <img src="../../assets/images/customer-level/8.png" alt="">
                        <p>新品品鉴会</p>
                    </div>
                    <div class="card-item">
                          <div class="item-cover" v-show="swipeLevel<6">
                        <div class="cover"></div>
                        <span class="lock"></span>
                    </div>
                        <img src="../../assets/images/customer-level/9.png" alt="">
                        <p>线下体验活动</p>
                    </div>
                    <div class="card-item">
                          <div class="item-cover" v-show="swipeLevel<6">
                        <div class="cover"></div>
                        <span class="lock"></span>
                    </div>
                        <img src="../../assets/images/customer-level/10.png" alt="">
                        <p>不定期新品体验卷</p>
                    </div>
                 
                </div>
              
            </div>
        </div>
        <p class="rule">会员卡适用于奈雪的茶和奈雪酒屋指定范围</p>
      </div>
  </div>
</template>

<script>
import { apiLevelBenefits } from '../../network/api'
import TitleCpn from '../common/TitleCpn'
export default {
    data() {
        return {
            levelData:[],
            swipeLevel:this.$store.state.member.memberLevel
            
        }
    },
components:{
    TitleCpn
},
computed: {
    level(){
        return this.$store.state.member.cardName
    },
    active(){
        return this.$store.state.member.memberLevel-1
    }
},
methods: {
    back(){
        this.$router.go(-1)
    },
    getData(){
        apiLevelBenefits().then(res=>{
            this.levelData = res.data
            
        })
    },
     onChange(index) {
         this.swipeLevel = index+1
    },
  
},
created() {
    this.getData()
},
}
</script>

<style lang="scss" scoped>
  $baseColor:#abba11;
.level-benefits{
      position: fixed;
        z-index: 55;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #fff;
        .content{
            position: absolute;
            top: 40px;
            left: 0;
            right: 0;
            bottom: 0;
            padding:30PX 15PX ;
            overflow: scroll;

            .list{
           display: flex;
           justify-content: space-between;
           width: 100%;
            .item{
                flex-basis: 25px;
                text-align: center;
                font-size: 12px;
                color: #484b4d;
            }

        }
            .level-value{
                font-size: 14px;
                color: #7f8284;
                text-align: center;
                margin-top: 15px;
            }

        .level-top{
           
            width: 100%;

            .top-title{
            display: flex;
            justify-content: space-between;
            line-height: 30px;
            margin-bottom: 30px;

            .now-level{
                font-size: 18px;
                color: #484b4d;
            }
            .tip{
                font-size: 14px;
                color: #a6aaad;
            }
            .level-step{
                    width: 100%;

            }
                    
            }

        }
        .level-center{
            margin-top: 30px;
            .van-swipe-item{
                position: relative;
                margin-right: 0px;

                .current-level{
                    position: absolute;
                    top: 0;
                    right: 0;
                    background-color: rgba( 0,0,0,.3);
                    padding: 7px 15px;
                    font-size: 14px;
                    color: #fff;
                      border-bottom-left-radius: 4px;
                    border-top-right-radius: 10px;
                }
                .level-time{
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 30px;
                    line-height: 30px;
                    background-color: rgba( 0,0,0,.3);
                    font-size: 14px;
                    color: #c1a67e;
                    text-align: right;
                    border-bottom-left-radius: 10px;
                    border-bottom-right-radius: 10px;
                    padding-right: 10px;
                    

                }
            }
            .swipe-img{
              width: 100%;
            }
        }
        .level-bottom{
        margin-top: 50px;   

        .swich-level{
            font-size: 18px;
            color: #484b4d;
            text-align: center;
            margin-bottom:20px;
        }        
        .benefit-item{
            box-shadow: 0 0 2px 2px #eee;
            margin-bottom: 20px;
            .benefit-title{
                display: inline-block;
                font-size: 12px;
                color: #fff;
                background-color: $baseColor;
                padding: 5px 10px;
                border-top-left-radius: 4px;
                border-bottom-right-radius: 4px;

            }
            .benefit-name{
                font-size: 16px;
                color: #484b4d;
                margin: 20px 0 20px 20px;
            }
            .card-list{
                display: flex;
                flex-wrap: wrap;
                padding: 10px;

                .card-item{
                    position: relative;
                    flex-basis: 33%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    font-size: 12px;
                    color: #787a7d;
                    text-align: center;
                    padding: 15px 5px;
                    
                    .num{
                        
                        border-radius: 50%;
                        padding: 2px;
                        background-color: #ffc210;
                        color: #fff;
                        font-size: 12px;
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(20%,-160%);

                    }
                    .item-cover{
                        width: 100%;
                        height: 100%;
                        .cover{
                           position: absolute;
                           top: 0;
                           left: 0;
                           right: 0;
                           bottom: 0;
                           background-color: rgba(200,200,200,.4);
                           border: 2px solid #fff;
                           box-sizing: border-box;
                           border-radius: 4px;
                        
                            
                           z-index: 1;
                            
                        }
                        .lock{
                            display: inline-block;
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(50%,-50%);
                            width: 10px;
                            height: 10px;
                            background:url('../../assets/images/customer-level/11.png') center center no-repeat;
                            background-size: contain;
                        }
                    }
                    img{
                        width:30px ;
                        margin-bottom: 10px;
                    }
                    p{
                        white-space: nowrap;
                    }
                }

            }
        }


        }
        .rule{
            font-size: 12px;
            text-align: center;
            line-height: 30px;
            color: #a0a4a7;
        }
        }
}
</style>