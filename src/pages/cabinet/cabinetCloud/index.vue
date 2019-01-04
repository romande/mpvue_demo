<template>
  <div class="body">
    <div class="bodyLeft">
      <div class="divHeade">
        <div class="searchBoxOuter">
          <div class="searchBox">
            <img src="../../../../static/img/Search.png" style="margin-left:10px;">
            <input
              placeholder="请输入案号或材料编号"
              v-model="filter_caseOrFileNo"
              type="text"
              @blur="confirmFilter"
            >
            <img
              @click="sanQRCode"
              style="float:right;margin-right:10px;"
              src="../../../../static/img/scan.png"
            >
          </div>

          <img @click="filterClick" class="filter" src="../../../../static/img/filter.png">
        </div>
        <div class="line"></div>
        <div class="tab">
          <p class="tabPDefault" :class="{selected : tabSelected}" @click="changeTab('002')">我的取件</p>
          <p class="tabPDefault" :class="{selected : !tabSelected}" @click="changeTab('001')">我的存件</p>
        </div>
      </div>
      <div class="listView" :class="{listViewHidden : !tabSelected}">
        <div class="item" v-for="(item,index) in listDataA">
          <div class="itemleft" @click="itemClick(item.reverseId)">
            <div class="itemBox1">
              <img
                style="position:relative;top:0px;width:15px;height:30px;display:inline-block;"
                src="../../../../static/img/cabinetIdentification.png"
              >
              <p>{{item.caseNo || '无案号'}}</p>
            </div>
            <div>
              <img src="../../../../static/img/cun.png">
              <p>{{item.senderName}}</p>
            </div>
            <div>
              <img
                style="width:16px;margin-right:2px;margin-left:2px;"
                src="../../../../static/img/dizhi.png"
              >
              <p>{{item.companyName}}{{item.reverseLocation}}</p>
            </div>
          </div>

          <div class="itemright">
            <p>{{item.reverseStateValue || ""}}</p>
            <img
              @click="showQRCode(item)"
              src="../../../../static/img/qrCode.png"
              class="qrcode" :class="{qrcodeHidden : item.reverseState!=='002'}"
            >
          </div>
          <img
            v-if="item.isReturn == true"
            class="imgFlag"
            src="../../../../static/img/backpiece.png"
          >
          <img v-if="item.isOverdue == true" class="imgFlag" src="../../../../static/img/yu.png">
          <img
            v-if="item.isReturn == true && item.isOverdue == true"
            class="imgFlag"
            src="../../../../static/img/backandIdent.png"
          >
        </div>
      </div>

      <div class="listView" :class="{listViewHidden : tabSelected}">
        <div class="item" v-for="(item,index) in listDataB">
          <div class="itemleft" @click="itemClick(item.reverseId)">
            <div class="itemBox1">
              <img
                style="position:relative;top:0px;width:15px;height:30px;"
                src="../../../../static/img/cabinetIdentification.png"
              >
              <p>{{item.caseNo || '无案号'}}</p>
            </div>
            <div>
              <img src="../../../../static/img/qu.png">
              <p>{{item.receiverName}}</p>
            </div>
            <div>
              <img
                style="width:16px;margin-right:2px;margin-left:2px;"
                src="../../../../static/img/dizhi.png"
              >
              <p>{{item.companyName}}{{item.reverseLocation}}</p>
            </div>
          </div>
          <div class="itemright">
            <p>{{item.reverseStateValue || ""}}</p>
          </div>
          <img
            v-if="item.isReturn == true"
            class="imgFlag"
            src="../../../../static/img/backpiece.png"
          >
          <img v-if="item.isOverdue == true" class="imgFlag" src="../../../../static/img/yu.png">
          <img
            v-if="item.isReturn == true && item.isOverdue == true"
            class="imgFlag"
            src="../../../../static/img/backandIdent.png"
          >
        </div>
      </div>
    </div>

    <div class="bodyRightOuter" :class="{filterHidden:!filterShow}">
      <div class="divAlph" @click="hiddenRight"></div>
      <div class="bodyRight">
        <div>流转状态</div>
        <div>
          <p class="bodyRightP" @click="changeDZP" :class="{filterSelected:statusDZP}">待指派</p>
          <p class="bodyRightP" @click="changeDQJ" :class="{filterSelected:statusDQJ}">待取件</p>
          <p class="bodyRightP" @click="changeYSJ" :class="{filterSelected:statusYSJ}">已收件</p>
        </div>
        <div>过滤逾期</div>
        <div>
          <p class="bodyRightP" @click="changeYQ" :class="{filterSelected:statusYQ}">仅显示逾期</p>
        </div>
        <div class="bottom">
          <button class="btnLeft" @click="reSetFilter">重置</button>
          <button class="btnRight" @click="confirmFilter">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import CONSTANT from "@/constants/constant";
import { getFileList } from "@/api/cabinet/cabinet";
import { getCodeContent } from "@/api/qrCode/qrCode";

export default {
  data() {
    return {
      pageIndex: 0,
      pageIsEnd: true,
      reverseUserRole: CONSTANT.REVERSE_CODE_002, //002为取件，001为存件
      tabSelected: true, //true为取件，false为存件

      filter_caseOrFileNo: null, //案号或材料编号
      filter_reverseStates: [], //流转状态
      filter_reverseOverDueStates: [], //预期状态

      filterShow: false,
      statusDZP: false,
      statusDQJ: false,
      statusYSJ: false,
      statusYQ: false,
      listDataA: [],
      listDataB: [],
      slideAnimation: {},
      cabinetPermission: false
    };
  },

  //初始加载
  mounted: function() {
    console.log("mounted");
    this.pageIndex = 0;
    this.listDataA = [];
    this.getListAData();
  },
  onShow: function() {
    this.filterShow = false;
  },
  //页面拉到最顶部触发刷新事件
  onPullDownRefresh() {
    console.log("到顶刷新");
    this.pageIndex = 0;
    this.getListData(true);
  },
  //页面拉到最底部触发的事件
  onReachBottom() {
    console.log("底部刷新");
    if (!this.pageIsEnd) {
      wx.showLoading({ title: "加载中", mask: true });
      this.pageIndex++;
      this.getListData();
    }
  },
  methods: {
    changeDZP() {
      this.statusDZP = !this.statusDZP;
    },
    changeDQJ() {
      this.statusDQJ = !this.statusDQJ;
    },
    changeYSJ() {
      this.statusYSJ = !this.statusYSJ;
    },
    changeYQ() {
      this.statusYQ = !this.statusYQ;
    },
    reSetFilter() {
      this.statusDZP = false;
      this.statusDQJ = false;
      this.statusYSJ = false;
      this.statusYQ = false;
    },
    hiddenRight() {
      this.filterShow = false;
    },

    //筛选按钮确定点击
    confirmFilter() {
      this.hiddenRight();
      this.getListData(true);
    },

    //tab切换，重新获取数据
    changeTab(val) {
      this.pageIndex = 0;
      this.reverseUserRole = val;
      if (val === CONSTANT.REVERSE_CODE_002) {
        this.tabSelected = true;
      } else {
        this.tabSelected = false;
      }
      this.getListData(true);
    },

    //点击扫描二维码
    sanQRCode() {
      let me = this;
      wx.scanCode({
        success: function(res) {
          me.filter_caseOrFileNo = res.result;
          me.getListData(true);
        },
        fail: function() {}
      });
    },

    //筛选图标点击
    filterClick() {
      console.log("filterClick");
      this.filterShow = true;
    },

    //点击跳转详情
    itemClick(reverseId) {
      console.log("itemClick " + reverseId);
      wx.navigateTo({ url: "../detail/main?reverseId=" + reverseId });
    },

    //显示取件二维码
    showQRCode(item) {
      let data = {
        reversePwd: item.reversePwd,
        productId: CONSTANT.PRODUCT_ID_201,
        actionId: CONSTANT.PRODUCT_ID_201_ACTION_01
      };
      getCodeContent(data).then(codeRes => {
        store.dispatch("setIndexText", "取件码");
        store.dispatch("setQrcodeText", codeRes.result);
        wx.navigateTo({ url: "../../qrcode/main" });
      });
    },

    /*************DB操作 ***************/

    getListData(isNew) {
      wx.showLoading({ title: "加载中", mask: true });
      //流转状态和逾期状态
      this.filter_reverseStates = [];
      this.filter_reverseOverDueStates = [];
      if (this.statusDZP) {
        this.filter_reverseStates.push(CONSTANT.CODE_003_001);
      }
      if (this.statusDQJ) {
        this.filter_reverseStates.push(CONSTANT.CODE_003_002);
      }
      if (this.statusYSJ) {
        this.filter_reverseStates.push(CONSTANT.CODE_003_003);
      }
      if (this.statusYQ) {
        this.filter_reverseOverDueStates.push(CONSTANT.CODE_003_004);
      }

      if (this.tabSelected) {
        this.tabSelected = true;
        if (isNew) {
          this.pageIndex = 0;
          this.listDataA = [];
        }
        this.getListAData();
      } else {
        this.tabSelected = false;
        if (isNew) {
          this.pageIndex = 0;
          this.listDataB = [];
        }
        this.getListBData();
      }
      //顶部刷新的关闭操作
      wx.stopPullDownRefresh();
    },

    /**
     * 获取取件列表数据
     **/
    getListAData() {
      let requestBody = {
        pageIndex: this.pageIndex,
        reverseUserRole: this.reverseUserRole, //"002" 002为取件，001为存件
        caseOrFileNo: this.filter_caseOrFileNo,
        reverseStates: this.filter_reverseStates,
        reverseOverDueStates: this.filter_reverseOverDueStates
      };
      getFileList(requestBody).then(res => {
        if(res.pager === undefined ||res.pager === null){
          this.pageIsEnd = true
        } else {
          this.pageIsEnd = res.pager.isEnd
        }
        this.listDataA = this.listDataA.concat(this.parseListResponseData(res));
      });
    },

    /**
     * 获取存件列表数据
     **/
    getListBData() {
      let requestBody = {
        pageIndex: this.pageIndex,
        reverseUserRole: this.reverseUserRole, //"001" 002为取件，001为存件
        caseOrFileNo: this.filter_caseOrFileNo,
        reverseStates: this.filter_reverseStates,
        reverseOverDueStates: this.filter_reverseOverDueStates
      };
      getFileList(requestBody).then(res => {
        if(res.pager === undefined ||res.pager === null){
          this.pageIsEnd = true
        } else {
          this.pageIsEnd = res.pager.isEnd
        }
        this.listDataB = this.listDataB.concat(this.parseListResponseData(res));
      });
    },

    /**
     * （辅助）遍历为最外层caseNo赋值
     **/
    parseListResponseData(res) {
      if (res.result) {
        var len = res.result.length;
        for (var i = 0; i < len; i++) {
          if (res.result[i].cases.length > 0) {
            if (res.result[i].cases[0].files.length > 1) {
              res.result[i].caseNo =
                res.result[i].cases[0].files[0].caseNo + "等...";
            } else {
              res.result[i].caseNo = res.result[i].cases[0].files[0].caseNo;
            }
          } else {
            res.result[i].caseNo = "";
          }
        }
        return res.result;
      } else {
        return [];
      }
    }
  }
};
</script>

<style>
.weuiAA {
  display: none;
}
.weuiBB {
  -webkit-transform: translate(0, 0);
  transform: translate(0, 0);
}

page {
  height: 100%;
}
.filterHidden {
  visibility: hidden;
  /* transform: rotate(0deg) scale(1) translate(-100%, 0%); */
  /* -webkit-transform: rotate(0deg) scale(1) translate(75%, 0%); */
}
.body {
  width: 100%;
  height: 100%;
  display: flex;
  flex: row;
  align-items: center;
}
.bodyLeft {
  height: 100%;
  background: white;
  width: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
}
.divHeade {
  width: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
  position: sticky;
  z-index: 5;
  background: white;
  top: 0%;
  left: 0%;
}

.bodyRightOuter {
  width: 100%;
  height: 100%;
  z-index: 9999;
  position: absolute;
  top: 0px;
  left: 0px;
  position: fixed;
  display: flex;
  flex-flow: row;
}
.divAlph {
  width: 30%;
  height: 100%;
  background: #000;
  opacity: 0.3;
}
.bodyRight {
  background: white;
  width: 70%;
  height: 100%;
  flex-flow: column;
  justify-items: left;
}

.bodyRight div {
  margin-left: 5%;
  color: black;
  width: 100%;
  display: flex;
  flex-flow: row;
  font-size: 16px;
  align-items: center;
  margin-bottom: 5px;
  margin-top: 10px;
}
.bodyRight div.bottom {
  position: absolute;
  width: 40%;
  bottom: 10px;
  right: 10px;
}

.bodyRight button {
  width: 45%;
  font-size: 14px;
  color: #409eff;
  border-color: #409eff;
  height: 40px;
  text-align: center;
  line-height: 40px;
  border-style: solid;
  border-width: 1px;
}

.btnLeft {
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
}
.btnRight {
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
}

.bodyRightP {
  margin-left: 5%;
  color: #929292;
  border-radius: 5px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: 14px;
  border-width: 1px;
  border-color: #929292;
  border-style: solid;
}

.filterSelected {
  color: white;
  background: #409eff;
}

.searchBoxOuter {
  margin-top: 10px;
  margin-left: 5%;
  width: 95%;
  height: 40px;
  display: flex;
  flex-flow: row;
  align-items: center;
  margin-bottom: 8px;
}

.filter {
  width: 25px;
  height: 25px;
  margin-left: 15px;
}
.searchBox {
  border-radius: 8px;
  padding-top: 5px;
  padding-bottom: 5px;
  display: flex;
  flex-flow: row;
  align-items: center;
  width: 85%;
  height: 30px;
  background: #f2f2f2;
}
.searchBox img {
  width: 25px;
  height: 25px;
}

.searchBox input {
  margin-left: 10px;
  margin-right: 10px;
  height: 30px;
  width: 75%;
  line-height: 30px;
  text-align: left;
  font-size: 14px;
}
.line {
  width: 100%;
  background: #f2f2f2;
  height: 1px;
  margin-bottom: 2px;
}
.tab {
  width: 90%;
  font-size: 14px;
  display: flex;
  height: 35px;
  flex-flow: row;
  align-items: center;
}
.tabPDefault {
  width: 50%;
  height: 35px;
  line-height: 35px;
  text-align: center;
  border-bottom: #f2f2f2;
  border-width: 3px;
  border-bottom-style: solid;
}
.selected {
  width: 50%;
  height: 35px;
  line-height: 35px;
  text-align: center;
  border-bottom: #409eff;
  border-width: 3px;
  border-bottom-style: solid;
}
.unSelected {
  width: 50%;
  height: 35px;
  line-height: 35px;
  text-align: center;

  border-bottom: #f2f2f2;
  border-width: 3px;
  border-bottom-style: solid;
}
.listView {
  width: 88%;
  height: 50%;
  /* overflow-y: scroll; */
}

.listViewHidden {
  display: none;
}

.item {
  display: flex;
  align-items: center;
  width: 100%;
  border-bottom-color: #f2f2f2;
  border-width: 1px;
  border-bottom-style: solid;
  position: relative;
  overflow: hidden;
}

.itemleft {
  width: 80%;
}
.itemleft div {
  height: 30px;
  display: flex;
  flex-flow: row;
  align-items: center;
}
.itemleft img {
  width: 20px;
  height: 20px;
  line-height: 20px;
}
.itemleft p {
  height: 20px;
  line-height: 20px;
  text-align: left;
  font-size: 13px;
  width: 80%;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-left: 10px;
}

.itemright {
  width: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #409eff;
  font-size: 14px;
}
.imgFlag {
  width: 50px;
  height: 50px;
  right: 10%;
  top: -10px;
  position: absolute;
}
.qrcode {
  width: 45px;
  height: 45px;
}
.qrcodeHidden {
  visibility: hidden;
}
.imgMark {
  width: 40px;
  height: 40px;
  position: relative;
  z-index: 100;
}
</style>
