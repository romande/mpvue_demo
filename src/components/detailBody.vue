<template>
  <div class="body">
    <p style="color:#0289EF;font-size:20px;width:90%;height:40px;margin-left:10%;">待取件</p>
    <div class="lineH"/>
    <div class="header">
      <div></div>
      <p>存取件人</p>
    </div>
    <div class="saveFetch">
      <img src="../../static/img/cun.png">
      <div>
        <p style="font-size:16px;color:black;">{{reverseDetail.senderName}}</p>
        <p>{{reverseDetail.companyName}}</p>
        <p>{{reverseDetail.officeName}}</p>
      </div>
    </div>
    <div class="saveFetch">
      <img src="../../static/img/qu.png">
      <div>
        <p style="font-size:16px;color:black;">{{reverseDetail.receiverName}}</p>
        <p>{{reverseDetail.receiverMobile}}</p>
      </div>
    </div>
    <div class="lineH"/>
    <div class="header">
      <div></div>
      <p>流转材料</p>
    </div>
    <div class="saveFetch">
      <img style="width:18px;height:25;" src="../../static/img/dizhi.png">
      <div>
        <p
          style="font-size:16px;color:black;"
        >{{reverseDetail.companyName}}{{reverseDetail.reverseLocation}}</p>
      </div>
    </div>

    <div class="saveFetch">
      <img style="margin-top:5px;width:18px;height:25;" src="../../static/img/anhao.png">
      <div>
        <p style="font-size:16px;color:black;">{{cases.files[0].caseNo || '无案号'}}</p>
        <p>{{files.fileNo}}</p>
      </div>
    </div>
    <div class="lineH"/>
    <div class="header">
      <div></div>
      <p>流转信息</p>
    </div>
    <div class="listView">
      <div class="item" @click="itemClick" v-for="(item,index) in reverseDetail.reverseStep">
        <div style="width:20%;">
          <p v-if="index===0" style="color:black;font-size:16px;">{{item.pa}}</p>
          <p v-else>{{item.dateD}}</p>
          <p v-if="index===0" style="color:black;font-size:12px;">13：48</p>
          <p v-else>dateT</p>
          <br>
        </div>
        <div style="width:25px;">
          <img class="itemImgBig" v-if="index===0" src="../../static/img/blueyuan.png">
          <img class="itemImg" v-else src="../../static/img/grayyuan.png">
          <img class="lineVImg" src="../../static/img/line.png">
        </div>
        <div style="align-items:left;">
          <p v-if="index===0" style="color:#409EFF;font-size:16px;">{{item.stepStateValue}}</p>
          <p v-else>{{item.stepStateValue}}</p>

          <p v-if="index===0" style="color:#409EFF;font-size:12px;">发起人:{{item.fromUserName}}</p>
          <p v-else>发起人:{{item.fromUserName}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // 增加一个可从外部传入的属性initNum
  props: {
    bodyData: {
      
      

    }
  },

  data() {
    return {
      reverseDetail: this.bodyData,
      listData: [
        { pa: "A" },
        { pa: "B" },
        { pa: "C" },
        { pa: "D" },
        { pa: "E" },
        { pa: "F" },
        { pa: "G" },
        { pa: "H" },
        { pa: "I" },
        { pa: "J" },
        { pa: "K" },
        { pa: "L" },
        { pa: "M" },
        { pa: "N" },
        { pa: "1" },
        { pa: "2" },
        { pa: "3" },
        { pa: "4" },
        { pa: "5" },
        { pa: "6" },
        { pa: "7" },
        { pa: "8" },
        { pa: "9" },
        { pa: "10" },
        { pa: "11" },
        { pa: "12" },
        { pa: "13" },
        { pa: "14" }
      ]
    };
  },
  methods: {}
};
</script>

<style>
.body {
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
}

.lineH {
  width: 100%;
  height: 5px;
  background: #f2f2f2;
}
.header {
  width: 100%;
  display: flex;
  align-items: center;
  height: 40px;
  border-width: 1px;
  border-bottom: #f2f2f2;
  border-bottom-style: solid;
}

.header div {
  height: 60%;
  width: 5px;
  background: #409eff;
  margin-left: 5%;
}
.header p {
  margin-left: 10px;
  font-size: 16px;
  color: black;
}

.saveFetch {
  display: flex;
  flex-flow: row;
  width: 100%;
  margin-top: 5px;
}
.saveFetch img {
  margin-left: 10%;
  width: 25px;
  height: 25px;
}
.saveFetch div {
  margin-left: 15px;
  display: flex;
  flex-flow: column;
  justify-items: center;
}
.saveFetch p {
  font-size: 14px;
  color: #949494;
}
.listView {
  width: 90%;
  max-height: 30%;
}
.item {
  display: flex;
  flex-flow: row;
}
.item div {
  margin-left: 10px;
  display: flex;
  flex-flow: column;
  align-items: center;
}
.item p {
  font-size: 12px;
  color: #c4c4c4;
}

.itemImg {
  width: 15px;
  height: 15px;
}

.lineVImg {
  height: 35px;
  width: 2px;
}
.itemImgBig {
  width: 20px;
  height: 20px;
}
</style>
