<template>
  <div class="details" v-if="!loading">
    <div
      class="header"
    >{{(data.parkName||'')+(data.buildName||'')+'租赁详情'}}</div>
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
      <div class="commonDetail">
        <p style="color:#5D6687">房产编号：{{data.houseCode||'-'}}</p>
      </div>
      <div class="commonDetail">
        <p>经营业态：{{data.erpSituationIdTitle||''}}</p>
        <p>建筑面积：{{typeof data.dbuildingArea=='number'?data.dbuildingArea+'㎡':'-'}}</p>
      </div>
      <div class="commonDetail">
        <p>运营状态：{{data.operationStateTitle||'-'}}</p>
        <p>租赁面积：{{typeof data.leaseOutArea =='number'?data.leaseOutArea+'㎡':'-'}}</p>
      </div>
    </div>
    <div class="common" v-if="tagList.length!=0">
      <div class="commonName">配套设施</div>
      <div class="commonDetail-tag">
        <span v-for="item in tagList" :key="item">{{item}}</span>
      </div>
    </div>
    <div class="common" v-if="data.parkContent.length>0">
      <div class="commonName">园区简介</div>
      <div class="commonDetail-tag msg" style="text-indent:20px;word-wrap:break-word;">
        <!-- <pre style="width:100%;word-wrap:break-word;"> </pre> -->
        {{data.parkContent ||'暂无简介'}}
      </div>
    </div>
    <div class="common" v-if="data.buildNote.length>0">
      <div class="commonName">楼宇简介</div>
      <div class="commonDetail-tag msg" style="text-indent:20px;word-wrap:break-word;">
        <!-- <pre style="width:100%;word-wrap:break-word;"> </pre> -->
        {{data.buildNote ||'暂无简介'}}
      </div>
    </div>

    <div class="common">
      <div class="commonDetail" style="justify-content: flex-end">浏览量{{data.pageView+'次'}}</div>
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
      vrDefault: require('../assets/vrDefault.png')
    }
  },
  mounted () {
    this.height = document.getElementById('app').offsetHeight
    let width = document.getElementById('app').offsetWidth
    this.width = width * 0.6
    console.log(this.width)
    this.loading = true
    if (this.$route.query && this.$route.query.id) {
      this.getDetails(this.$route.query.id)
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
          // data.picList = ['https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=512261113,365828873&fm=26&gp=0.jpg',]
          this.data = data
          this.picList = data.picList || this.img
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
        } else {
          this.$notify({ type: 'danger', message: res.data.message })
          this.loading = false
        }
      })
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
</style>
