<template>
  <div class="store-detail">
    <TitleCpn :title="'门店详情'"  @left-click="comeBack">
        <div slot="left" class="icon-arrow_lift"></div>
    </TitleCpn>
    <div class="store-content">
        <!-- 门店地图 -->
          <baidu-map  :center="center" :zoom="zoom" @ready="handler" class="bm-view" ak="DGglTGwPics6rjNW6QudzoaaKhkGuTlR">
              <bm-overlay
                pane="labelPane"
                :class="{sample: true}"
                @draw="draw"
                @mouseover.native="active = true"
                @mouseleave.native="active = false">
                <img :src="img" class="tea-img" v-if="!start">
            </bm-overlay>
             <bm-geolocation  anchor="BMAP_ANCHOR_BOTTOM_RIGHT" 
             :showAddressBar="false" 
             @locationSuccess="getLocation"
             :autoLocation="true">
             </bm-geolocation>

             <bm-driving
             v-if="start"
            :start="start"
            :end="{lng:longitude,lat:latitude}"
            :auto-viewport="true"
            :searchcomplete="searchcomplete"
            :panel="false"
            :selectFirstResult="true"
            >
      </bm-driving>
         </baidu-map>

         <div class="store-item">
            <div class="item-top">
                 <h2>{{store.name}}</h2>
                 <span class="selling">营业中</span>
                 <span class="buy" @click="goOrder">去下单</span>
            </div>
            <p>距离您{{store.distance_text}}</p>
            <div class="item-center">
                <h3>{{store.street}}</h3>
                <div class="left">
                    <div><span class="icon"></span></div>
                    <div><span class="icon1"></span></div>
                </div>
            </div>
            <div class="sell-time">营业时间：{{store.server_time}}</div>
         </div>
         
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import TitleCpn from '../common/TitleCpn'
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import { BmOverlay,BmGeolocation ,BmDriving} from 'vue-baidu-map'
export default {
     data () {
    return {
      center: {lng: 0, lat: 0},
      zoom: 3,
      active: false,
      longitude:this.$store.state.store.longitude,
      latitude:this.$store.state.store.latitude,
      img:this.$store.state.store.image,
      start:null
    }
  },
components:{
    TitleCpn,
    BaiduMap,
    BmOverlay,
    BmGeolocation,
    BmDriving
},
computed: {
    ...mapState(['store'])
},
methods: {
    comeBack(){
        this.$router.go(-1)
    },
    handler ({BMap, map}) {
      
      this.center.lng = this.longitude
      this.center.lat = this.latitude
      this.zoom = 15
    },
      draw ({el, BMap, map}) {
      const pixel = map.pointToOverlayPixel(new BMap.Point(this.longitude, this.latitude))
      el.style.left = pixel.x - 60 + 'px'
      el.style.top = pixel.y - 20 + 'px'
    },
    goOrder(){
        this.$router.push({name:'Order'})
    },
    getLocation({point, AddressComponent, marker}){
        // 
        this.start = {lng:point.lng,lat:point.lat}
    },
    searchcomplete(res){
        
    }
    
},

}
</script>

<style lang="scss" scoped>
$baseColor:#abba11;
  .store-detail{
    position: fixed;
    flex-direction: column;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
    display: flex;
    
    background-color: #f5f5f5;
    .sample {
        width: 60px;
        height: 60px;
        overflow: hidden;
        position: absolute;

        .tea-img{
            width: 100%;
           
        }
        }
    .bm-view {
        width: 100%;
        height: 300px;
        }
    .store-content{
        width: 100%;

        .store-item{
            margin: 20px 10px;
            background-color: #fff;
            padding: 20px 15px;
            border-radius: 6px;

            .item-top{
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom:15px;           

                h2{
                    flex-basis: 130px;

                    font-size: 18px;
                    font-weight: 700;
                    color: #56595a;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
                .selling{
                    flex-basis: 46px;
                    height: 24px;
                    line-height: 24px;
                    color: $baseColor;
                    border: 1px solid $baseColor;
                    font-size: 12px;
                    text-align: center;
                    border-radius: 2px;
                    margin-left: 10px;

                }
                .buy{
                    flex: 1;
                    font-size: 16px;
                    color: $baseColor;
                    text-align: right;

                }
            }
            p{
                font-size: 12px;
                color: #585b5d;
                margin-bottom: 8px;

            }
            .item-center{
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;

                h3{
                    font-size: 12px;
                    color: #a0a4a7;
                    flex-basis: 220px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;

                }
                .left{
                    flex-basis: 70px;
                    display: flex;
                    justify-content: space-between;
                    div{
                        width: 25px;
                        height: 25px;
                        background-color: #e8ecc3;
                        border-radius: 50%;
                        
                        .icon{
                            display: block;
                            width: 100%;
                            height: 100%;
                            background:url('../../assets/images/store/phone.png') center center no-repeat;
                            background-size: 60%;
                        }

                               .icon1 {
                            display: block;
                            width: 100%;
                            height: 100%;
                            background:url('../../assets/images/store/daohang.png') center center no-repeat;
                            background-size: 70%;
                            }
                         
                    }
                }

            }

            .sell-time{
                color: #a0a4a7;
                font-size: 12px;
            }
        }
    }

  }
</style>