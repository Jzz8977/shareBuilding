<template>
  <div class="details" v-if="!loading">
    <div class="header">{{(data.parkName||'')+(data.buildName||'')+'招商详情'}}</div>
    <van-swipe
      v-if="picList.length!=0"
      class="my-swipe"
      :autoplay="3000"
      :style="{'height':width+'px'}"
      :autoHeight="true"
      indicator-color="white"
      @change="onChange"
    >
      <van-swipe-item v-for="(item,i) in picList" :key="i+'-img'" @click="toVrUrl(i)">
        <img src="../assets/vrLogoCenter.png" class="vrCenter" v-if="vrUrl&&i==0" />
        <img src="../assets/vrLogoRightTop.png" class="vrRightTop" v-if="vrUrl&&i==0" />
        <img v-lazy="item.fileUrl" />
      </van-swipe-item>

      <template #indicator>
        <div class="custom-indicator" v-if="picList.length>1">{{ current + 1 }}/{{picList.length}}</div>
      </template>
    </van-swipe>

    <div class="common">
      <div class="commonName">{{data.parkName+data.buildName+data.name}}</div>
      <div class>
        <!-- 别删除，样式出错-->
      </div>
      <div class="commonDetail">
        <p>房产业态：{{data.erpSituationIdTitle||''}}</p>
        <p>建筑面积：{{typeof data.dbuildingArea=='number'?data.dbuildingArea+'㎡':'-'}}</p>
      </div>
      <div class="commonDetail">
        <p>销售状态：{{data.operationStateTitle||'-'}}</p>
        <p>销售总价：{{typeof data.price =='number'?data.price+'元':'-'}}</p>
      </div>
    </div>

    <div class="common" v-if="info.description">
      <div class="commonName">项目简介</div>
      <div class="commonDetail-tag msg" style="word-wrap:break-word;">{{info.description ||'暂无简介'}}</div>
    </div>

    <div class="common" v-if="locationArr.length>0">
      <div class="commonName">地理位置</div>
      <div class="commonDetail-tag msg" style="word-wrap:break-word;position:relative">
        <div id="container"></div>
        <div class="toPark" @click="toPark">到这里去！</div>
      </div>
    </div>
    <div class="common" v-if="info.peripheralDesc||peripheralPics.length>0">
      <div class="commonName">周边配套</div>
      <div class="commonDetail-tag msg" style="word-wrap:break-word;">
        {{info.peripheralDesc ||'暂无简介'}}
        <van-swipe
          v-if="peripheralPics.length!=0"
          class="my-swipe"
          :autoplay="3000"
          :style="{'height':width+'px'}"
          :autoHeight="true"
          indicator-color="white"
          @change="onChange"
        >
          <van-swipe-item v-for="(item,i) in peripheralPics" :key="i+'-img'">
            <img v-lazy="item" />
          </van-swipe-item>

          <template #indicator>
            <div
              class="custom-indicator"
              v-if="peripheralPics.length>1"
            >{{ current + 1 }}/{{peripheralPics.length}}</div>
          </template>
        </van-swipe>
      </div>
    </div>
    <div class="common" v-if="info.parkContent||layoutPics.length>0">
      <div class="commonName">平面布局</div>
      <div class="commonDetail-tag msg" style="word-wrap:break-word;">
        {{info.layoutDesc}}
        <van-swipe
          v-if="layoutPics.length!=0"
          class="my-swipe"
          :autoplay="3000"
          :style="{'height':width+'px'}"
          :autoHeight="true"
          indicator-color="white"
          @change="onChange"
        >
          <van-swipe-item v-for="(item,i) in layoutPics" :key="i+'-img'">
            <img v-lazy="item" />
          </van-swipe-item>

          <template #indicator>
            <div
              class="custom-indicator"
              v-if="layoutPics.length>1"
            >{{ current + 1 }}/{{peripheralPics.length}}</div>
          </template>
        </van-swipe>
      </div>
    </div>

    <div class="common">
      <div class="commonDetail" style="justify-content: flex-end">浏览量{{data.pageView+'次'}}</div>
      <a
        href="androidamap://navi?sourceApplication=appname&amp;poiname=fangheng&amp;lat=36.547901&amp;lon=104.258354&amp;dev=1&amp;style=2"
      >导航</a>
    </div>
  </div>
  <van-loading class="loading" :style="{'height':height+'px'}" v-else color="#1989fa" />
</template>

<script>
import axios from 'axios'
import { request } from '@/utils/libs.js'
export default {
  name: 'HelloWorld',
  data () {
    return {
      images: [],
      current: 0,
      data: {},
      tagList: [],
      picList: [],
      loading: true,
      height: 0,
      width: 0,
      img: [
        {
          fileUrl: require('../assets/nonepic.png')
        }
      ],
      vrImage: '',
      vrUrl: '',
      periphery: '',
      peripheryImageList: [],
      location: '经开大厦',

      info: {},
      peripheralPics: [],
      locationArr: [],
      vrDefault: require('../assets/vrDefault.png'),
      layoutPics: []
    }
  },
  mounted () {
    this.height = document.getElementById('app').offsetHeight
    let width = document.getElementById('app').offsetWidth
    this.width = width * 0.6
    console.log(this.width)
    this.loading = true
    if (this.$route.query && this.$route.query.id && this.$route.query.parkId) {
      this.getDetails(this.$route.query.id)
      this.getInfo(this.$route.query.parkId)
    } else {
      // this.loading = false;
      this.$notify({ type: 'danger', message: '获取id错误' })
    }
  },

  methods: {
    toVrUrl (i) {
      if (i === 0 && this.vrUrl) {
        location.href = this.vrUrl
      }
    },
    onChange (index) {
      this.current = index
    },
    getDetails (id) {
      axios.post(request.baseURL + request.getDetails, { id }).then(res => {
        if (res.data.code == 0) {
          let data = res.data.body
          this.data = data
          this.picList = data.picList || this.img
          this.peripheryImageList = data.picList || this.img
          this.tagList = data.supportingFacilityList || []
          this.vrImage = data.vrImage || ''
          this.vrUrl = data.vrUrl || ''
          if (this.vrUrl) {
            if (this.vrImage) {
              this.picList.unshift({
                fileUrl: this.vrImage
              })
            } else {
              this.picList.unshift({
                fileUrl: this.vrDefault
              })
            }
          }
          this.loading = false
          setTimeout(() => {
            this.initMap()
          }, 1000)
        } else {
          this.$notify({ type: 'danger', message: res.data.message })
          this.loading = false
        }
      })
    },
    getInfo (parkId) {
      axios
        .post(request.baseURL + request.getparkAdditionalInfo + parkId)
        .then(res => {
          if (res.data.code === 0) {
            let info = (this.info = res.data.body)

            let arr = []
            let brr = []
            if (info.peripheralPics) {
              arr = info.peripheralPics.split(',')
            }
            if (info.layoutPics) {
              brr = info.layoutPics.split(',')
            }
            this.layoutPics = brr
            this.peripheralPics = arr
            console.log(this.peripheralPics)
            this.locationArr.push(info.longitude - 0, info.latitude - 0)
          } else {
            this.$notify({ type: 'danger', message: res.data.message })
            this.loading = false
          }
        })
    },
    initMap () {
      let that = this
      // eslint-disable-next-line no-undef
      var map = new AMap.Map('container', {
        resizeEnable: true, // 是否监控地图容器尺寸变化
        zoom: 11, // 初始化地图层级
        center: [116.397428, 39.90923] // 初始化地图中心点
      })

      // 创建纯文本标记
      var text = new AMap.Text({
        map,
        text: that.data.parkName,
        anchor: 'center', // 设置文本标记锚点
        draggable: false,
        cursor: 'pointer',
        angle: 0,
        style: {
          padding: '.1rem .2rem',
          'margin-bottom': '1rem',
          'border-radius': '.1rem',
          'background-color': 'white',
          width: 'auto',
          'border-width': 0,
          'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
          'text-align': 'center',
          'font-size': '14px',
          color: 'black'
        },
        position: that.locationArr
      })
      map.setFitView()
    },
    toPark () {
      let that = this
      const u = navigator.userAgent
      const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
      console.log(this.locationArr)
      // 苹果和安卓头部不一样
      if (isiOS) {
        // 这个是ios操作系统
        var d = new Date()
        var t0 = d.getTime()
        window.location.href =
          'iosamap://navi?sourceApplication=appname&poiname=abc&lat=' + this.locationArr[1] + '&lon=' + this.locationArr[0] + '&dev=0'
        // 判断是否切出浏览器
        setTimeout(function () {
          let hidden =
            window.document.hidden ||
            window.document.mozHidden ||
            window.document.msHidden ||
            window.document.webkitHidden
          if (typeof hidden === 'undefined' || hidden == false) {
            // 应用宝下载地址
            window.location.href =
              'https://uri.amap.com/marker?position=' + that.locationArr[0] + ',' + that.locationArr[1]
          }
        }, 2500)
      } else {
        // 这个是安卓操作系统
        var d = new Date()
        var t0 = d.getTime()
        window.location.href =
        'androidamap://navi?sourceApplication=appname&poiname=fangheng&lat=' + this.locationArr[1] + '&lon=' + this.locationArr[0] + '&dev=1&style=2'
        // 判断是否切出浏览器
        setTimeout(function () {
          let hidden =
            window.document.hidden ||
            window.document.mozHidden ||
            window.document.msHidden ||
            window.document.webkitHidden
          if (typeof hidden === 'undefined' || hidden === false) {
            // 应用宝下载地址
            window.location.href =
              'https://uri.amap.com/marker?position=' + that.locationArr[0] + ',' + that.locationArr[1]
          }
        }, 2500)
      }
    },
    ToggleAppAndH5 (AppUrl, AppCallback = () => {}) {
      // 先走APP
      const ifr = document.createElement('iframe')
      ifr.src = AppUrl
      ifr.style.display = 'none'
      document.body.appendChild(ifr)
      setTimeout(function () {
        document.body.removeChild(ifr)
      }, 3000)

      // 800毫秒后调用H5链接
      let timer = setTimeout(function () {
        clearTimeout(timer)
        AppCallback()
      }, 800)

      window.onblur = function () {
        clearInterval(timer)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"  scoped>
.header {
  font-family: Helvetica;
  letter-spacing: 0;
  font-size: 0.335rem;
  line-height: 25px;
  // font-size: 17px;
  color: #030303;
  letter-spacing: 0;
  // font-weight: bold;
}
.my-swipe {
  width: 100%;
  margin: 0.2rem 0;
}
.my-swipe .van-swipe-item {
  // color: #fff;
  // font-size: 20px;
  // line-height: 150px;
  // text-align: left;
  // background-color: #39a9ed;
  // min-height: 4rem;
  img {
    width: 100%;
    height: 100%;
  }
}
.van-swipe__track {
  width: 100%;
  height: 100%;
}
.my-swipe .custom-indicator {
  position: absolute;
  right: 5px;
  bottom: 5px;
  padding: 2px 5px;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
.details {
  padding: 0.3rem;
  box-sizing: border-box;
}
.common {
  width: 100%;
  margin: 0.4rem 0;
  .commonName {
    font-family: Helvetica;
    font-weight: bolder;
    font-size: 0.33rem;
    color: #0a0c1e;
    letter-spacing: 0;
  }
  .commonDetail {
    font-family: Helvetica;
    // font-size: 0.24rem;
    font-size: 0.295rem;
    color: #666666;
    letter-spacing: 0;
    display: flex;
    justify-content: flex-start;
    height: 25px;
    align-items: center;
    flex-wrap: wrap;
    p {
      width: 45%;
      margin: 0;
    }
  }

  .commonDetail:nth-child(2) {
    // line-height: 30px;
    height: 35px;
    p {
      width: 100%;
    }
  }

  .commonDetail-tag {
    font-family: Helvetica;
    font-size: 0.295rem;
    color: #666666;
    letter-spacing: 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 10px;
    span {
      text-align: center;
      margin: 5px 10px 10px 0;
      min-width: 60px;
      display: inline-block;
      font-size: 0.295rem;
      color: #5d6687;
      padding: 2px 5px;
      border: 1px solid #5d6687;
      border-radius: 4px;
      border-radius: 4px;
    }
  }
}
.loading {
  width: 100%;
  // height: 100px;
  text-align: center;
  box-sizing: border-box;
  .van-loading__spinner {
    top: 40%;
  }
}
.vrCenter {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  width: 60px !important;
  height: 60px !important;
}
.vrRightTop {
  position: absolute;
  top: 20px;
  right: 0;
  width: 80px !important;
  height: 30px !important;
}

#container {
  height: 225px;
  width: 100%;
}
.toPark {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #fff;
  text-align: center;
  color: #fff;
  line-height: 30px;
  height: 30px;
  padding: 0 20px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 1);
}
</style>
<style lang="scss">
.info {
  width: 100%;
  padding: 10px 20px;
  margin-bottom: 1rem;
  border-radius: 0.25rem;
  position: fixed;
  background-color: white;
  border-width: 0;
  box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
}
.amap-marker-content {
}
</style>
