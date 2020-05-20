<template>
  <div class="details" v-if="!loading">
    <div
      class="header"
    >{{data.parkName+data.buildName+data.operationStateTitle+'房间'+data.name+'详情'}}</div>
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white" @change="onChange">
      <van-swipe-item v-for="item in picList" :key="item.fileUrl">
        <img v-lazy="item.fileUrl" />
      </van-swipe-item>

      <template #indicator>
        <div class="custom-indicator">{{ current + 1 }}/{{picList?picList.length:'4'}}</div>
      </template>
    </van-swipe>

    <div class="common">
      <div class="commonName">{{data.name}}</div>
      <div class="commonDetail">
        <p style="color:#5D6687">房产编号：{{data.houseCode||''}}</p>
      </div>
      <div class="commonDetail">
        <p>经营业态：{{data.erpSituationIdTitle||''}}</p>
        <p>建筑面积：{{data.dbuildingArea?data.dbuildingArea+'㎡':''}}</p>
      </div>
      <div class="commonDetail">
        <p>运营状态：{{data.operationStateTitle}}</p>
        <p>租赁面积：{{data.leaseOutArea?data.leaseOutArea+'㎡':''}}</p>
      </div>
    </div>
    <div class="common">
      <div class="commonName">配套设施</div>
      <div class="commonDetail-tag">
        <span v-for="item in tagList" :key="item">{{item}}</span>
      </div>
    </div>
    <div class="common">
      <div class="commonName">园区简介</div>
      <div class="commonDetail-tag msg" style="text-indent:20px;word-wrap:break-word;">
        <!-- <pre style="width:100%;word-wrap:break-word;"> </pre> -->
        {{data.parkContent ||'暂无简介'}}
      </div>
    </div>
    <div class="common">
      <div class="commonName">楼宇简介</div>
      <div class="commonDetail-tag msg" style="text-indent:20px;word-wrap:break-word;">
        <!-- <pre style="width:100%;word-wrap:break-word;"> </pre> -->
        {{data.buildNote ||'暂无简介'}}
 
      </div>
    </div>

    <div class="common">
      <div
        class="commonDetail"
        style="justify-content: flex-end"
      >浏览量{{data.pageView?data.pageView+'次':''}}</div>
    </div>
  </div>
  <van-loading class="loading" :style="{'height':height+'px'}" v-else color="#1989fa" />
</template>

<script>
import axios from "axios";
import { request } from "@/utils/libs.js";
export default {
  name: "HelloWorld",
  data() {
    return {
      images: [],
      current: 0,
      data: {},
      tagList: [],
      picList: [],
      loading: true,
      height: 0
    };
  },
  mounted() {
    this.height = document.getElementById("app").offsetHeight;
    console.log(this.$route.query);
    this.loading = true;
    if (this.$route.query && this.$route.query.id) {
      this.getDetails(this.$route.query.id);
    } else {
      // this.loading = false;
      this.$notify({ type: "danger", message: "获取id错误" });
    }
  },

  methods: {
    onChange(index) {
      this.current = index;
    },
    getDetails(id) {
      axios.post(request.baseURL + request.getDetails, { id }).then(res => {
        if (res.data.code == 0) {
          let data = res.data.body;
          // data.picList = ['https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=512261113,365828873&fm=26&gp=0.jpg',]
          this.data = data;
          this.picList = data.picList;
          this.tagList = data.supportingFacilityList
          this.loading = false;
        } else {
          this.$notify({ type: "danger", message: res.data.message });
          this.loading = false;
        }
      });
    }
  }
};
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
  // height: 4rem;
  img {
    width: 100%;
    height: 100%;
  }
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
</style>
