<template>
	<div class="container">
		<div class="intro">
			<img src="../assets/images/logo.png" />
			<div class="tips">
				<p>一杯好茶，一口软欧包</p>
				
				在奈雪遇见两种美好
			</div>
		</div>
		<div class="bottom">
            <van-form >
                <van-field
                v-model="userInfo.phone"
                name="手机号"
                label="手机号"
                placeholder="请输入手机号"
                autocomplete="off"
                />
                 <van-field
                v-model="userInfo.password"
                :type="isRegisterPassword ? 'password' : 'text'"
                name="密码"
                label="密码"
                placeholder="请输入密码"
                :right-icon="isRegisterPassword ? 'closed-eye' : 'eye-o'"
                autocomplete="off"
                @click-right-icon="toggleRegsiterPasswordType"
                />
                    <div class="commit-btn">
                <van-button round block color="#a3b248" @click="login">
                    登录
                </van-button>
                </div>
                <div class="commit-btn">
                <van-button round block type="default" @click="toggleRegisterBox">
                    注册
                </van-button>
                </div>
             <!-- <div class="toggleText">
            忘记密码？
             </div> -->
            </van-form>



			<div class="text-center">
				<p class="text-title">新用户登录即加入会员，享会员权益</p>
				<div class="member">
					<div class="member-item">
						<img src="../assets/images/mine/rhyl.png" />
						<div>入会有礼</div>
					</div>
					<div class="member-item">
						<img src="../assets/images/mine/jfdh.png" />
						<div>积分兑换</div>
					</div>
					<div class="member-item">
						<img src="../assets/images/mine/sjtq.png" />
						<div>升级特权</div>
					</div>
					<div class="member-item">
						<img src="../assets/images/mine/srtq.png" />
						<div>生日特权</div>
					</div>
					<div class="member-item">
						<img src="../assets/images/mine/nxbz.png" />
						<div>奈雪宝藏</div>
					</div>
				</div>
				
			</div>
		</div>

          <!-- 注册 -->
    <van-popup class="register-box" v-model="isShow" position="bottom" closeable>
       <div class="register-title">注册</div>
       <van-form>

        <van-field
          v-model="userRegisterInfo.phone"
          name="手机号"
          label="手机号"
          placeholder="11位手机号"
          autocomplete="off"
        />

        <van-field
          v-model="userRegisterInfo.password"
          :type="isRegisterPassword ? 'password' : 'text'"
          name="密码"
          label="密码"
          placeholder="字母数字_组合且字母开头(6-16位)"
          :right-icon="isRegisterPassword ? 'closed-eye' : 'eye-o'" 
          autocomplete="off"
          @click-right-icon="toggleRegsiterPasswordType"
        />

        <van-field
          v-model="userRegisterInfo.nickName"
          name="昵称"
          label="昵称"
          placeholder="字母数字_汉字组合(1-10位)"
          autocomplete="off"
        />

        <div class="commit-btn register-btn">
          <van-button round block color="#a3b248" @click="register">
            注册
          </van-button>
        </div>
      </van-form>

    </van-popup>
	</div>
</template>

<script>


  //导入表单验证模块
  import {validForm} from '../assets/tool/validForm'
  import {mapMutations} from 'vuex'
  import {setLoginStatus} from '../store/mutations/mutation-types'
  import axios from 'axios'

  export default {
    name: 'Login',
    data() {

      return {
        //用户登录信息
        userInfo: {
          phone: '',
          password: ''
        },

        //用户注册信息
        userRegisterInfo: {
          phone: '',
          password: '',
          nickName: ''
        },
        appkey:'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',

        //是否显示注册框
        isShow: false,

        //切换注册密码框的类型
        isRegisterPassword: true
      };
    },

    methods: {
      ...mapMutations(['setLoginStatus']),
      //切换注册框
      toggleRegisterBox() {
        this.isShow = true;
      },

      //切换注册密码框的类型
      toggleRegsiterPasswordType() {
        this.isRegisterPassword = !this.isRegisterPassword;
      },

      //注册
      register() {
        //构造表单验证信息
        let o = {
          phone: {
            value: this.userRegisterInfo.phone,
            errorMsg: '手机号格式不正确',
            reg: /^1[3-9]\d{9}$/
          },
          password: {
            value: this.userRegisterInfo.password,
            errorMsg: '密码格式不正确',
            reg: /^[A-Za-z]\w{5,15}$/
          },
          nickName: {
            value: this.userRegisterInfo.nickName,
            errorMsg: '昵称格式不正确',
            reg: /^[\w\u4e00-\u9fa5]{1,10}$/
          },
        };

        let isPass = validForm.valid(o);

        if (isPass) {

          // 

          //复制用户注册信息
          let userInfo = Object.assign({}, this.userRegisterInfo);
          userInfo.appkey = this.appkey;
          
          

          //启动加载提示
          this.$toast.loading({
            //文本提示
            message: '加载中...',
            //禁止穿透点击
            forbidClick: true,
            //提示时间, 0: 没有时间限制
            duration: 0
          });

          //发起注册请求
            
           let paramsString = '';
            for (let key in userInfo) {
            paramsString += `${key}=${userInfo[key]}&`;
            }

           userInfo = paramsString.slice(0, -1);
            
          axios({
            //请求类型
            method: 'post',
            //请求路径
            url: 'http://www.kangliuyong.com:10002/register',

            //POST请求参数, object
            data: userInfo,

            headers:{
               'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            responseType:'json'
            

          }).then(result => {
            //关闭加载提示
            this.$toast.clear();

            if (result.data.code == 100) {
              this.isShow = false;
            } else {
              //如果注册失败，手机被注册了
              this.$toast(result.data.msg);
            }

            // 
          }).catch(err => {
            //关闭加载提示
            this.$toast.clear();

            
          })

        }
      },

      //登录
      login() {
        //构造表单验证信息
        let o = {
          phone: {
            value: this.userInfo.phone,
            errorMsg: '手机号格式不正确',
            reg: /^1[3-9]\d{9}$/
          },
          password: {
            value: this.userInfo.password,
            errorMsg: '密码格式不正确',
            reg: /^[A-Za-z]\w{5,15}$/
          }
        };

        let isPass = validForm.valid(o);
        if (isPass) {
          //发起登录请求
          //复制用户注册信息
          let userInfo = Object.assign({}, this.userInfo);
          userInfo.appkey = this.appkey;
               
           let paramsString = '';
            for (let key in userInfo) {
            paramsString += `${key}=${userInfo[key]}&`;
            }

           userInfo = paramsString.slice(0, -1);
            
          this.$toast.loading({
            message: '加载中...',
            forbidClick: true,
            duration: 0
          });

          //发起注册请求
          axios({
                //请求类型
            method: 'post',
            //请求路径
            url: 'http://www.kangliuyong.com:10002/login',

            //POST请求参数, object
            data: userInfo,

            headers:{
               'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            responseType:'json'
            
          }).then(result => {
            this.$toast.clear();

            

            if (result.data.code == 200) {
              //登录成功
              //保存token, 以便后面验证登录
              localStorage.setItem('_tk', result.data.token);
              this.setLoginStatus(true)
              this.$router.push({name:'Home'})
              //其他操作

            } else {
              this.$toast(result.data.msg);
            }

          }).catch(err => {
            this.$toast.clear();

            
          })        


        }
      },

      //跳转到首页
      goState() {
        this.$router.push({name: 'Home'});
      }
    }
  }
</script>
<style lang="scss" scoped>
$baseColor :#a3b248;
.container{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 40;
    background-color: #fefefe;

	.intro {
		width: 100%;
		padding: 30px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-evenly;
		font-size:14px;
		color: $baseColor;
		
		img {
			width: 100px;
			height: 100px;
		}
		
		.tips {
			line-height: 24px;
			text-align: center;
            margin-top: 10px;
		}
	}
	
	.bottom {
		height: 40vh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 0 40px;

        .toggleText{
            font-size: 12px;
            color: #aaa;
            text-align: right;
        }

	

        .text-center{
            margin-top: 60px;

        .text-title{
            font-size: 14px;
            color: #777;
            text-align: center;
            margin-bottom: 20px;

        }

        .member{
            display: flex;
            justify-content: center;
            margin-top: 20px;
            width: 100%;

            .member-item{
                flex: 1;
                text-align: center;
                font-size: 12px;
                color: #aaa;

                img{
                    width: 37px;
                    margin-bottom: 4px;
                }
            }
        }

        .power-declare{
            margin-top: 30px;
            line-height: 30px;
            font-size: 14px;
            color: blue;
            text-decoration: underline;
            text-align: right;
        }

        }
		
		
	}

    .register-title{
        color: #444;
        font-size: 18px;
        font-weight: bold;
        padding:16px 16px;
    }
    .van-field{
        margin: 10px 0;
    }
    .commit-btn{
        margin: 10px 0;
    }
}
</style>
