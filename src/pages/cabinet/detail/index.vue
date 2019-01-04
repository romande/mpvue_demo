<template>
  <div class="body">
    <div class="top">
      <p class="topP">{{reverseDetail.reverseStateValue||""}}</p>
      <div @click="showQRCode" v-if="reverseDetail.reverseState === '002'" class="qrCodeDiv">
        <img src="../../../../static/img/qrCode.png">
        <p>取件码</p>
      </div>
    </div>
    <div class="header">
      <div></div>
      <p>存取件人</p>
    </div>
    <div class="saveFetch">
      <img src="../../../../static/img/cun.png">
      <div class="div2Row" v-if="reverseState === '003'">
        <p class="p1">{{reverseDetail.senderName}}</p>
        <p class="p2">{{reverseDetail.senderMobile}}</p>
      </div>
      <div class="div3Row" v-else-if="reverseState === '002'">
        <p class="p1">{{reverseDetail.senderName}}</p>
        <p class="p2">{{reverseDetail.companyName}}</p>
        <p class="p2">{{reverseDetail.officeName}}</p>
      </div>
    </div>
    <div class="saveFetch" style="margin-bottom:5px;">
      <img src="../../../../static/img/qu.png">
      <div class="div3Row" v-if="reverseState === '003'">
        <p class="p1">{{reverseDetail.receiverName}}</p>
        <p class="p2">{{reverseDetail.companyName}}</p>
        <p class="p2">{{reverseDetail.officeName}}</p>
      </div>
      <div class="div2Row" v-if="reverseState === '002'">
        <p class="p1">{{reverseDetail.receiverName}}</p>
        <p class="p2">{{reverseDetail.receiverMobile}}</p>
      </div>
    </div>
    <div class="header">
      <div></div>
      <p>流转材料</p>
    </div>
    <div class="saveFetch">
      <img style="width:18px;height:25;margin-top:10px;" src="../../../../static/img/dizhi.png">
      <div class="div1Row">
        <p>{{reverseDetail.companyName}}{{reverseDetail.reverseLocation}}</p>
      </div>
    </div>

    <div class="saveFetch" style="padding-bottom:5px;">
      <img
        style="margin-top:5px;width:18px;height:25;margin-top:10px;"
        src="../../../../static/img/anhao.png"
      >
      <div class="div2Row">
        <p class="p1">{{reverseDetail.cases[0].files[0].caseNo || '无案号'}}</p>
        <p class="p2">{{reverseDetail.cases[0].files[0].fileNo ||''}}</p>
      </div>
    </div>
    <div class="header" style="margin-top:5px;">
      <div></div>
      <p>流转信息</p>
    </div>
    <div class="listView">
      <div class="item" @click="itemClick" v-for="(item,index) in reverseDetail.reverseStep">
        <div style="width:20%;">
          <p v-if="index===0" style="color:black;font-size:15px;">{{itemDate[index] || ''}}</p>
          <p v-else>{{itemDate[index] || ''}}</p>
          <p v-if="index===0" style="color:black;font-size:13px;">{{itemTime[index] || ''}}</p>
          <p v-else>{{itemTime[index] || ''}}</p>
          <br>
        </div>
        <div style="width:25px;">
          <img class="itemImgBig" v-if="index===0" src="../../../../static/img/blueyuan.png">
          <img class="itemImg" v-else src="../../../../static/img/grayyuan.png">
          <img class="lineVImg" v-if="index!==arrayLenght" src="../../../../static/img/line.png">
        </div>
        <div style="align-items:left;">
          <p v-if="index===0" style="color:#409EFF;font-size:15px;">{{item.stepStateValue}}</p>
          <p v-else>{{item.stepStateValue}}</p>

          <p
            v-if="index===0 && item.stepState ==='003'"
            style="color:#409EFF;"
          >收件人:{{item.toUserName}}</p>
          <p
            v-else-if="index===0 && item.stepState ==='002'"
            style="color:#409EFF;"
          >发起人:{{item.fromUserName}} 收件人:{{item.toUserName}}</p>
          <p v-else>发起人:{{item.fromUserName}} 收件人:{{item.toUserName}}</p>
        </div>
      </div>
    </div>
    <!-- 占位符 -->
    <div style="height:55px;width:100%;background:#ffffff;"></div>
    <!-- 占位符 -->
    <div
      class="bottomDiv"
      v-if="reverseDetail.reverseState ==='002' || reverseDetail.reverseState ==='001'"
    >
      <button
        class="bottomBtn"
        v-if="reverseDetail.receiverId == loginUserId || reverseDetail.senderId == reverseDetail.receiverId"
        @click="appointClick"
      >指派</button>
      <button
        class="bottomBtn"
        v-if="reverseDetail.senderId == loginUserId && reverseDetail.senderId != reverseDetail.receiverId"
        @click="repealClick"
      >撤销流转</button>
    </div>
  </div>
</template>

<script>
// 导入 click-counter 组件
import store from "@/store";
import CONSTANT from "@/constants/constant";
import { getCodeContent } from "@/api/qrCode/qrCode";
import { getDetail } from "@/api/cabinet/cabinetDetail";
import { repeal } from "@/api/cabinet/repeal";

let reverseId = "";

export default {
  // components: { detailBody },

  data() {
    return {
      reverseDetail: { cases: [{ files: [{ caseNo: "" }] }] },
      reverseState: "", //当前流转状态 003-已取件、002待取件
      caseNo: "", //当前文件流转案号
      itemDate: [], //流转记录日期数组
      itemTime: [], //流转记录时间数组
      arrayLenght: -1, //流转记录数量
      loginUserId: "" //当前登录用户ID
    };
  },
  onLoad: function(options) {
    console.log("onLoad");
    reverseId = options.reverseId;
  },
  onShow: function() {
    wx.showLoading({ title: "加载中", mask: true });
    console.log("reverseId = " + reverseId);
    let userInfo = store.getters.userInfo;
    this.loginUserId = userInfo.userId;

    getDetail(reverseId).then(res => {
      console.log(res);
      this.reverseDetail = res.result;
      this.reverseState = res.result.reverseState;
      this.caseNo = this.reverseDetail.cases[0].files[0].caseNo;
      this.parseDate();
      var steps = this.reverseDetail.reverseStep;
      this.arrayLenght = steps.length - 1;
    });
  },

  //页面拉到最顶部触发刷新事件
  onPullDownRefresh() {
    wx.showLoading({ title: "加载中", mask: true });
    this.getFileDetail();
  },
  methods: {
    //初始化流转记录日期-时间数组
    parseDate() {
      if (this.reverseDetail) {
        var steps = this.reverseDetail.reverseStep;
        console.log("steps = " + steps.length);
        var tempDtaeArray = [];
        var tempTimeArray = [];
        for (var i = 0; i < steps.length; i++) {
          var date = new Date(steps[i].createDate);
          const year = date.getFullYear();
          var month = date.getMonth() + 1;
          var day = date.getDate();
          var hour = date.getHours();
          var minute = date.getMinutes();
          const second = date.getSeconds();

          if (month < 10) {
            month = "0" + month;
          }
          if (day < 10) {
            day = "0" + day;
          }
          if (hour < 10) {
            hour = "0" + hour;
          }
          if (minute < 10) {
            minute = "0" + minute;
          }

          tempDtaeArray.push(month + "-" + day);
          tempTimeArray.push([hour + ":" + minute]);
        }
      }
      this.itemDate = tempDtaeArray;
      this.itemTime = tempTimeArray;
    },
    appointClick() {
      wx.navigateTo({
        url:
          "../appoint/main?reverseId=" +
          reverseId +
          "&caseNo=" +
          this.caseNo +
          "&companyId=" +
          this.reverseDetail.companyId
      });
    },
    repealClick() {
      console.log("repealClick = " + this.reverseDetail.cases.length);
      let reversePwd = this.reverseDetail.reversePwd;
      let mobile = this.reverseDetail.receiverMobile;
      let caseNos = [];
      if (this.reverseDetail.cases.length > 0) {
        for (let i = 0; i < this.reverseDetail.cases.length; i++) {
          caseNos.push(this.reverseDetail.cases[i].files[0].caseNo);
        }
      }
      wx.showModal({
        title: "提示",
        content: "是否撤销流转？",
        confirmText: "确定",
        cancelText: "取消",
        success: function(res) {
          if (res.confirm) {
            console.log("用户点击确定");
            wx.showLoading({ title: "加载中", mask: true });
            repeal({
              reverseId: reverseId,
              reversePwd: reversePwd,
              mobile: mobile,
              caseNos: caseNos
            }).then(res => {
              console.log("repeal");
              if (res.code === 200) {
                console.log("撤销成功！");
                wx.navigateTo({
                  url: "../cabinetCloud/main"
                });
              } else {
                console.log("撤销失败！");
                wx.showToast({
                  title: res.message,
                  icon: "none",
                  duration: 2000
                });
              }
            });
          } else {
            console.log("用户点击取消");
          }
        }
      });
    },
    showQRCode() {
      let data = {
        reversePwd: this.reverseDetail.reversePwd,
        productId: CONSTANT.PRODUCT_ID_201,
        actionId: CONSTANT.PRODUCT_ID_201_ACTION_01
      };
      getCodeContent(data).then(codeRes => {
        store.dispatch("setIndexText", "取件码");
        store.dispatch("setQrcodeText", codeRes.result);
        wx.navigateTo({ url: "../../qrcode/main" });
      });
    },
    getFileDetail() {
      console.log("reverseId = " + reverseId);
      getDetail(reverseId).then(res => {
        console.log(res);
        this.reverseDetail = res.result;
        this.reverseState = res.result.reverseState;

        wx.stopPullDownRefresh();
      });
    }
  }
};
</script>

<style>
.body {
  width: 100%;
  height: 100%;

  background: #f2f2f2;
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
  background: white;
  align-items: center;
  height: 40px;
  margin-bottom: 1px;
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
  background: white;
}
.saveFetch img {
  margin-left: 10%;
  margin-top: 8px;
  width: 25px;
  height: 25px;
}
.saveFetch div.div1Row {
  margin-left: 15px;
  height: 50px;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-items: center;
}

.saveFetch div.div1Row p {
  height: 50px;
  font-size: 16px;
  color: black;
  line-height: 50px;
}

.saveFetch div.div2Row {
  margin-left: 15px;
  display: flex;
  height: 60px;
  flex-flow: column;
  justify-items: center;
}
.saveFetch div.div3Row {
  margin-left: 15px;
  display: flex;
  height: 90px;
  flex-flow: column;
  justify-items: center;
}
.saveFetch p.p1 {
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  color: black;
}

.saveFetch p.p2 {
  height: 25px;
  line-height: 25px;
  font-size: 14px;
  color: #949494;
}

.listView {
  width: 100%;
  background: white;
  min-height: 10%;
  padding-top: 10px;
  padding-bottom: 10px;
}
.item {
  display: flex;
  flex-flow: row;
  width: 100%;
  background: white;
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
.top {
  display: flex;
  width: 100%;
  height: 70px;
  background: white;
  flex-flow: row;
  align-items: center;
  margin-bottom: 5px;
}

.topP {
  width: 70%;
  color: #0289ef;
  line-height: 60px;
  height: 60px;
  margin-left: 5%;
  font-size: 20px;
}

.qrCodeDiv {
  width: 15%;
  display: flex;
  flex-flow: column;
  align-items: center;
  height: 60px;
}
.qrCodeDiv img {
  width: 40px;
  height: 40px;
}
.qrCodeDiv p {
  width: 100%;
  line-height: 15px;
  height: 15px;
  font-size: 12px;
  text-align: center;
}
.bottomDiv {
  width: 100%;
  height: 55px;
  background: white;
  float: bottom;
  bottom: 0px;
  position: fixed;
}
.bottomBtn {
  width: 90%;
  height: 40px;
  color: #0289ef;
  border-width: 1px;
  border-radius: 20px;
  border-color: #0289ef;
  line-height: 40px;
  text-align: center;
  border-style: solid;
  margin-top: 6px;
  font-size: 16px;
}
</style>
