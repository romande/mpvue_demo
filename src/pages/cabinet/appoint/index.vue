<template>
  <div class="body">
    <div>
      <p class="left">法院</p>
      <picker
        @change="companyPickerChange"
        :range="companyArray"
        range-key="companyName"
        :value="companyIndex"
      >
        <p class="right">{{companyName || '请选择法院'}}</p>
      </picker>
    </div>
    <div class="line"/>
    <div>
      <p class="left">部门</p>
      <picker
        @change="officePickerChange"
        :value="officeIndex"
        :range="officeArray"
        range-key="officeName"
        :disabled="companyId=='' ?true:false"
      >
        <p class="right">{{officeName || '请选择部门'}}</p>
      </picker>
    </div>
    <div class="line"/>
    <div>
      <p class="left">取件人</p>
      <picker
        @change="userPickerChange"
        :value="usersIndex"
        :range="usersArray"
        range-key="name"
        :disabled="officeName=='' ?true:false"
      >
        <p @click="checkOfficName" class="right">{{userName || '请选择取件人'}}</p>
      </picker>
    </div>
    <div class="line"/>
    <button @click="appoint">指派</button>
  </div>
</template>

<script>
import store from "@/store";
import CONSTANT from "@/constants/constant";
import { getCompany } from "@/api/cabinet/appoint";
import { getOffice } from "@/api/cabinet/appoint";
import { getUser } from "@/api/cabinet/appoint";
import { appoint } from "@/api/cabinet/appoint";
import { getCodeContent } from "@/api/qrCode/qrCode";

let mCompanyId = "";
let reverseId = "";
let caseNo = "";
let userId = "";

export default {
  data() {
    return {
      companyArray: [], //法院列表
      companyIndex: 0,
      companyName: "",
      companyId: "",
      officeArray: [], //部门列表
      officeIndex: 0,
      officeName: "",
      officeId: "",
      usersArray: [], //用户列表
      usersIndex: 0,
      userName: ""
    };
  },

  watch: {
    //监听companyId变化
    companyId: function(newQuestion, oldQuestion) {
      this.officeArray = [];
      this.officeName = "";
      this.usersArray = [];
      this.userName = "";
      wx.showLoading({ title: "加载中", mask: true });
      getOffice(this.companyId).then(res => {
        console.log("computedOffice");
        this.officeArray = res.result;
      });
    },
    //监听officeId变化
    officeId: function(newQuestion, oldQuestion) {
      this.usersArray = [];
      this.userName = "";
      wx.showLoading({ title: "加载中", mask: true });
      getUser(this.officeId).then(res => {
        console.log("computedUsers");
        this.usersArray = res.result;
      });
    }
  },

  onLoad: function(options) {
    reverseId = options.reverseId;
    caseNo = options.caseNo;
    mCompanyId = options.companyId;
    console.log("onLoad companyId = " + mCompanyId);
  },
  mounted: function() {
    console.log("mounted");
    wx.showLoading({ title: "加载中", mask: true });
    getCompany().then(res => {
      let array = res.result;
      this.companyArray = array;
      let len = array.length;
      for (let i = 0; i < len; i++) {
        let cid = array[i].companyId;
        if (cid == mCompanyId) {
          this.companyName = array[i].companyName;
          this.companyId = array[i].companyId;
          return;
        }
      }
    });
  },

  methods: {
    //部门空提示
    checkOfficName() {
      if (this.officeName === "") {
        this.userName = "";
        wx.showToast({
          title: "请先选择部门",
          icon: "none",
          duration: 2000
        });
      }
    },
    //指派
    appoint() {
      if (!this.userName) {
        wx.showToast({
          title: "未选择用户",
          icon: "none",
          duration: 1000
        });
        return;
      }

      wx.showModal({
        title: "提示",
        content: "是否确定指派？",
        confirmText: "确定",
        cancelText: "取消",
        success: function(res) {
          console.log(res);
          if (res.confirm) {
            console.log("用户点击确定");
            let cars = [];
            cars.push(caseNo);
            let params = {
              reverseId: reverseId,
              appointUserId: userId,
              caseNos: cars
            };
            appoint(params).then(res => {
              console.log("appoint");
              console.log(res);
              if (res.code === 200) {
                wx.navigateTo({
                  url: "../cabinetCloud/main"
                });
              } else {
                console.log("指派失败！");
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
    //法院选择器回调
    companyPickerChange: function(e) {
      console.log("companyPickerChange" + e.mp.detail.value);
      this.companyName = this.companyArray[e.mp.detail.value].companyName;
      this.companyId = this.companyArray[e.mp.detail.value].companyId;
    },
    //部门选择器回调
    officePickerChange: function(e) {
      console.log("officePickerChange" + e.mp.detail.value);
      this.officeName = this.officeArray[e.mp.detail.value].officeName;
      this.officeId = this.officeArray[e.mp.detail.value].officeId;
    },
    //人员选择器回调
    userPickerChange: function(e) {
      console.log("userPickerChange" + e.mp.detail.value);
      this.userName = this.usersArray[e.mp.detail.value].name;
      userId = this.usersArray[e.mp.detail.value].userId;
    }
  }
};
</script>

<style>
.body {
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100%;
  height: 100%;
}
.body div {
  display: flex;
  flex-flow: row;
  align-items: center;
  width: 100%;
  height: 40px;
}
.body div.line {
  background: #f1f1f1;
  width: 90%;
  height: 1px;
}
.body p.left {
  color: black;
  width: 25%;
  line-height: 30px;
  height: 30px;
  font-size: 16px;
  margin-right: 5%;
  text-align: right;
}
.body picker {
  color: black;
  width: 65%;
  height: 30px;
  text-align: left;
}
.body p.right {
  color: black;
  width: 90%;
  height: 30px;
  font-size: 16px;
  line-height: 30px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
}
.hintP {
  color: #757575;
  width: 90%;
  height: 30px;
  font-size: 16px;
  line-height: 30px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
}
.body button {
  color: #0289ef;
  border-width: 1px;
  border-radius: 20px;
  border-color: #0289ef;
  height: 40px;
  width: 90%;
  line-height: 40px;
  text-align: center;
  border-style: solid;
  margin-top: 20px;
  font-size: 16px;
}
</style>
