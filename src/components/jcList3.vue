<template>
  <div class="index_container depTree bg_color_white jcList">
    <div class="ui_box">
      <!-- <div class="ui_con" v-infinite-scroll="loasd" :infinite-scroll-immediate='false' :infinite-scroll-disabled='infinitedisabled'> -->

      <div class="sear_box">
        <el-input
          class="sear"
          size="small"
          placeholder="车牌号搜索"
          prefix-icon="el-icon-search"
          v-model="input2"
        >
        </el-input>

        <el-button
          class="sear_btn"
          type="warning"
          icon="el-icon-delete"
          size="mini"
          @click="xx"
          >重置</el-button
        >

        <!-- <div class='btnu'>
                    <el-button class='sear_btn' type="primary" icon="el-icon-search" size='mini' @click='cpsear'>搜索</el-button>

                    <el-button class='sear_btn' type="warning" icon="el-icon-delete" size='mini'>重置</el-button>
                </div>-->
      </div>

      <div class="ui_con">
        <div class="jkbox"></div>

        <template>
          <div class="tb_box">
            <div class="xm">桐柏县</div>

            <template v-if="carList_tb.length != 0">
              <div
                v-for="val in carList_tb"
                :carnum="val.carNumber"
                :key="val.id"
                class="car_item"
                :class="val.ads"
              >
                <template v-if="!input2 || val.carNumber.indexOf(input2) != -1">
                  <p
                    @click="xiala(val, 'tb')"
                    @dblclick="new_bf_all(val, 'tb')"
                  >
                    <img
                      v-show="val.xiala_bool"
                      class="xiala_tb"
                      src="../assets/image/x_arr.png"
                    />
                    <img
                      v-show="!val.xiala_bool"
                      class="xiala_tb"
                      src="../assets/image/r_arr.png"
                    />
                    <span
                      >{{ val.sysOrgCode_dictText }}-{{ val.carNumber }}</span
                    >
                  </p>

                  <ul v-show="val.xiala_bool">
                    <li @dblclick.stop="new_bf(1, '球机', val, 'videoTb')">
                      球机
                    </li>
                    <li
                      @dblclick.stop="new_bf(2, '左前摄像机', val, 'videoTb')"
                    >
                      左前摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(3, '左中前摄像机', val, 'videoTb')"
                    >
                      左中前摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(4, '右中前摄像机', val, 'videoTb')"
                    >
                      右中前摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(5, '右前摄像机', val, 'videoTb')"
                    >
                      右前摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(6, '左后摄像机', val, 'videoTb')"
                    >
                      左后摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(7, '左中后摄像机', val, 'videoTb')"
                    >
                      左中后摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(8, '右中后摄像机', val, 'videoTb')"
                    >
                      右中后摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(9, '右后摄像机', val, 'videoTb')"
                    >
                      右后摄像机
                    </li>
                  </ul>
                </template>
              </div>
            </template>

            <template v-else>
              <p class="pad">此县区当前没有在线车辆</p>
            </template>
          </div>
        </template>

        <template>
          <div class="thjc_box">
            <div class="xm">唐河县</div>

            <template v-if="carList_thjc.length != 0">
              <div
                v-for="val in carList_thjc"
                :carnum="val.carNumber"
                :key="val.id"
                class="car_item"
                :class="val.ads"
              >
                <template v-if="!input2 || val.carNumber.indexOf(input2) != -1">
                  <p
                    @click="xiala(val, 'thjc')"
                    @dblclick="new_bf_all(val, 'thjc')"
                  >
                    <img
                      v-show="val.xiala_bool"
                      class="xiala_tb"
                      src="../assets/image/x_arr.png"
                    />
                    <img
                      v-show="!val.xiala_bool"
                      class="xiala_tb"
                      src="../assets/image/r_arr.png"
                    />
                    <span
                      >{{ val.sysOrgCode_dictText }}-{{ val.carNumber }}</span
                    >
                  </p>

                  <ul v-show="val.xiala_bool">
                    <li @dblclick.stop="new_bf(1, '球机', val, 'videoThjc')">
                      球机
                    </li>
                    <li
                      @dblclick.stop="new_bf(2, '左前摄像机', val, 'videoThjc')"
                    >
                      左前摄像机
                    </li>
                    <li
                      @dblclick.stop="
                        new_bf(3, '左中前摄像机', val, 'videoThjc')
                      "
                    >
                      左中前摄像机
                    </li>
                    <li
                      @dblclick.stop="
                        new_bf(4, '右中前摄像机', val, 'videoThjc')
                      "
                    >
                      右中前摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(5, '右前摄像机', val, 'videoThjc')"
                    >
                      右前摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(6, '左后摄像机', val, 'videoThjc')"
                    >
                      左后摄像机
                    </li>
                    <li
                      @dblclick.stop="
                        new_bf(7, '左中后摄像机', val, 'videoThjc')
                      "
                    >
                      左中后摄像机
                    </li>
                    <li
                      @dblclick.stop="
                        new_bf(8, '右中后摄像机', val, 'videoThjc')
                      "
                    >
                      右中后摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(9, '右后摄像机', val, 'videoThjc')"
                    >
                      右后摄像机
                    </li>
                  </ul>
                </template>
              </div>
            </template>

            <template v-else>
              <p class="pad">此县区当前没有在线车辆</p>
            </template>
          </div>
        </template>

        <template>
          <div class="tjc_box">
            <div class="xm">特警队</div>

            <template v-if="carList_tjc.length != 0">
              <div
                v-for="val in carList_tjc"
                :carnum="val.carNumber"
                :key="val.id"
                class="car_item"
                :class="val.ads"
              >
                <template v-if="!input2 || val.carNumber.indexOf(input2) != -1">
                  <p
                    @click="xiala(val, 'tjc')"
                    @dblclick="new_bf_all(val, 'tjc')"
                  >
                    <img
                      v-show="val.xiala_bool"
                      class="xiala_tb"
                      src="../assets/image/x_arr.png"
                    />
                    <img
                      v-show="!val.xiala_bool"
                      class="xiala_tb"
                      src="../assets/image/r_arr.png"
                    />
                    <span
                      >{{ val.sysOrgCode_dictText }}-{{ val.carNumber }}</span
                    >
                  </p>

                  <ul v-show="val.xiala_bool">
                    <li @dblclick.stop="new_bf(1, '球机', val, 'videoTjc')">
                      球机
                    </li>
                    <li
                      @dblclick.stop="new_bf(2, '左前摄像机', val, 'videoTjc')"
                    >
                      左前摄像机
                    </li>
                    <li
                      @dblclick.stop="
                        new_bf(3, '左中前摄像机', val, 'videoTjc')
                      "
                    >
                      左中前摄像机
                    </li>
                    <li
                      @dblclick.stop="
                        new_bf(4, '右中前摄像机', val, 'videoTjc')
                      "
                    >
                      右中前摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(5, '右前摄像机', val, 'videoTjc')"
                    >
                      右前摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(6, '左后摄像机', val, 'videoTjc')"
                    >
                      左后摄像机
                    </li>
                    <li
                      @dblclick.stop="
                        new_bf(7, '左中后摄像机', val, 'videoTjc')
                      "
                    >
                      左中后摄像机
                    </li>
                    <li
                      @dblclick.stop="
                        new_bf(8, '右中后摄像机', val, 'videoTjc')
                      "
                    >
                      右中后摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(9, '右后摄像机', val, 'videoTjc')"
                    >
                      右后摄像机
                    </li>
                  </ul>
                </template>
              </div>
            </template>

            <template v-else>
              <p class="pad">此县区当前没有在线车辆</p>
            </template>
          </div>
        </template>

        <template>
          <div class="nz_box">
            <div class="xm">南召县</div>

            <template v-if="carList_nz.length != 0">
              <div
                v-for="val in carList_nz"
                :carnum="val.carNumber"
                :key="val.id"
                class="car_item"
                :class="val.ads"
              >
                <template v-if="!input2 || val.carNumber.indexOf(input2) != -1">
                  <p
                    @click="xiala(val, 'nz')"
                    @dblclick="new_bf_all(val, 'nz')"
                  >
                    <img
                      v-show="val.xiala_bool"
                      class="xiala_tb"
                      src="../assets/image/x_arr.png"
                    />
                    <img
                      v-show="!val.xiala_bool"
                      class="xiala_tb"
                      src="../assets/image/r_arr.png"
                    />
                    <span
                      >{{ val.sysOrgCode_dictText }}-{{ val.carNumber }}</span
                    >
                  </p>

                  <ul v-show="val.xiala_bool">
                    <li @dblclick.stop="new_bf(1, '球机', val, 'videoNz')">
                      球机
                    </li>
                    <li
                      @dblclick.stop="new_bf(2, '左前摄像机', val, 'videoNz')"
                    >
                      左前摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(3, '左中前摄像机', val, 'videoNz')"
                    >
                      左中前摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(4, '右中前摄像机', val, 'videoNz')"
                    >
                      右中前摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(5, '右前摄像机', val, 'videoNz')"
                    >
                      右前摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(6, '左后摄像机', val, 'videoNz')"
                    >
                      左后摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(7, '左中后摄像机', val, 'videoNz')"
                    >
                      左中后摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(8, '右中后摄像机', val, 'videoNz')"
                    >
                      右中后摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(9, '右后摄像机', val, 'videoNz')"
                    >
                      右后摄像机
                    </li>
                  </ul>
                </template>
              </div>
            </template>

            <template v-else>
              <p class="pad">此县区当前没有在线车辆</p>
            </template>
          </div>
        </template>

        <template>
          <div class="nxjc_box">
            <div class="xm">内乡县</div>

            <template v-if="carList_nxjc.length != 0">
              <div
                v-for="val in carList_nxjc"
                :carnum="val.carNumber"
                :key="val.id"
                class="car_item"
                :class="val.ads"
              >
                <template v-if="!input2 || val.carNumber.indexOf(input2) != -1">
                  <p
                    @click="xiala(val, 'nxjc')"
                    @dblclick="new_bf_all(val, 'nxjc')"
                  >
                    <img
                      v-show="val.xiala_bool"
                      class="xiala_tb"
                      src="../assets/image/x_arr.png"
                    />
                    <img
                      v-show="!val.xiala_bool"
                      class="xiala_tb"
                      src="../assets/image/r_arr.png"
                    />
                    <span
                      >{{ val.sysOrgCode_dictText }}-{{ val.carNumber }}</span
                    >
                  </p>

                  <ul v-show="val.xiala_bool">
                    <li @dblclick.stop="new_bf(1, '球机', val, 'videoNxjc')">
                      球机
                    </li>
                    <li
                      @dblclick.stop="new_bf(2, '左前摄像机', val, 'videoNxjc')"
                    >
                      左前摄像机
                    </li>
                    <li
                      @dblclick.stop="
                        new_bf(3, '左中前摄像机', val, 'videoNxjc')
                      "
                    >
                      左中前摄像机
                    </li>
                    <li
                      @dblclick.stop="
                        new_bf(4, '右中前摄像机', val, 'videoNxjc')
                      "
                    >
                      右中前摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(5, '右前摄像机', val, 'videoNxjc')"
                    >
                      右前摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(6, '左后摄像机', val, 'videoNxjc')"
                    >
                      左后摄像机
                    </li>
                    <li
                      @dblclick.stop="
                        new_bf(7, '左中后摄像机', val, 'videoNxjc')
                      "
                    >
                      左中后摄像机
                    </li>
                    <li
                      @dblclick.stop="
                        new_bf(8, '右中后摄像机', val, 'videoNxjc')
                      "
                    >
                      右中后摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(9, '右后摄像机', val, 'videoNxjc')"
                    >
                      右后摄像机
                    </li>
                  </ul>
                </template>
              </div>
            </template>

            <template v-else>
              <p class="pad">此县区当前没有在线车辆</p>
            </template>
          </div>
        </template>

        <template>
          <div class="sqjc_box">
            <div class="xm">社旗县</div>

            <template v-if="carList_sqjc.length != 0">
              <div
                v-for="val in carList_sqjc"
                :carnum="val.carNumber"
                :key="val.id"
                class="car_item"
                :class="val.ads"
              >
                <template v-if="!input2 || val.carNumber.indexOf(input2) != -1">
                  <p
                    @click="xiala(val, 'sqjc')"
                    @dblclick="new_bf_all(val, 'sqjc')"
                  >
                    <img
                      v-show="val.xiala_bool"
                      class="xiala_tb"
                      src="../assets/image/x_arr.png"
                    />
                    <img
                      v-show="!val.xiala_bool"
                      class="xiala_tb"
                      src="../assets/image/r_arr.png"
                    />
                    <span
                      >{{ val.sysOrgCode_dictText }}-{{ val.carNumber }}</span
                    >
                  </p>

                  <ul v-show="val.xiala_bool">
                    <li @dblclick.stop="new_bf(1, '球机', val, 'videoSqjc')">
                      球机
                    </li>
                    <li
                      @dblclick.stop="new_bf(2, '左前摄像机', val, 'videoSqjc')"
                    >
                      左前摄像机
                    </li>
                    <li
                      @dblclick.stop="
                        new_bf(3, '左中前摄像机', val, 'videoSqjc')
                      "
                    >
                      左中前摄像机
                    </li>
                    <li
                      @dblclick.stop="
                        new_bf(4, '右中前摄像机', val, 'videoSqjc')
                      "
                    >
                      右中前摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(5, '右前摄像机', val, 'videoSqjc')"
                    >
                      右前摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(6, '左后摄像机', val, 'videoSqjc')"
                    >
                      左后摄像机
                    </li>
                    <li
                      @dblclick.stop="
                        new_bf(7, '左中后摄像机', val, 'videoSqjc')
                      "
                    >
                      左中后摄像机
                    </li>
                    <li
                      @dblclick.stop="
                        new_bf(8, '右中后摄像机', val, 'videoSqjc')
                      "
                    >
                      右中后摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(9, '右后摄像机', val, 'videoSqjc')"
                    >
                      右后摄像机
                    </li>
                  </ul>
                </template>
              </div>
            </template>

            <template v-else>
              <p class="pad">此县区当前没有在线车辆</p>
            </template>
          </div>
        </template>

        <template>
          <div class="xichuan_box">
            <div class="xm">淅川县</div>

            <template v-if="carList_xichuan.length != 0">
              <div
                v-for="val in carList_xichuan"
                :carnum="val.carNumber"
                :key="val.id"
                class="car_item"
                :class="val.ads"
              >
                <template v-if="!input2 || val.carNumber.indexOf(input2) != -1">
                  <p
                    @click="xiala(val, 'xichuan')"
                    @dblclick="new_bf_all(val, 'xichuan')"
                  >
                    <img
                      v-show="val.xiala_bool"
                      class="xiala_tb"
                      src="../assets/image/x_arr.png"
                    />
                    <img
                      v-show="!val.xiala_bool"
                      class="xiala_tb"
                      src="../assets/image/r_arr.png"
                    />
                    <span
                      >{{ val.sysOrgCode_dictText }}-{{ val.carNumber }}</span
                    >
                  </p>

                  <ul v-show="val.xiala_bool">
                    <li @dblclick.stop="new_bf(1, '球机', val, 'videoXichuan')">
                      球机
                    </li>
                    <li
                      @dblclick.stop="
                        new_bf(2, '左前摄像机', val, 'videoXichuan')
                      "
                    >
                      左前摄像机
                    </li>
                    <li
                      @dblclick.stop="
                        new_bf(3, '左中前摄像机', val, 'videoXichuan')
                      "
                    >
                      左中前摄像机
                    </li>
                    <li
                      @dblclick.stop="
                        new_bf(4, '右中前摄像机', val, 'videoXichuan')
                      "
                    >
                      右中前摄像机
                    </li>
                    <li
                      @dblclick.stop="
                        new_bf(5, '右前摄像机', val, 'videoXichuan')
                      "
                    >
                      右前摄像机
                    </li>
                    <li
                      @dblclick.stop="
                        new_bf(6, '左后摄像机', val, 'videoXichuan')
                      "
                    >
                      左后摄像机
                    </li>
                    <li
                      @dblclick.stop="
                        new_bf(7, '左中后摄像机', val, 'videoXichuan')
                      "
                    >
                      左中后摄像机
                    </li>
                    <li
                      @dblclick.stop="
                        new_bf(8, '右中后摄像机', val, 'videoXichuan')
                      "
                    >
                      右中后摄像机
                    </li>
                    <li
                      @dblclick.stop="
                        new_bf(9, '右后摄像机', val, 'videoXichuan')
                      "
                    >
                      右后摄像机
                    </li>
                  </ul>
                </template>
              </div>
            </template>

            <template v-else>
              <p class="pad">此县区当前没有在线车辆</p>
            </template>
          </div>
        </template>

        <template>
          <div class="xy_box">
            <div class="xm">新野县</div>

            <template v-if="carList_xy.length != 0">
              <div
                v-for="val in carList_xy"
                :carnum="val.carNumber"
                :key="val.id"
                class="car_item"
                :class="val.ads"
              >
                <template v-if="!input2 || val.carNumber.indexOf(input2) != -1">
                  <p
                    @click="xiala(val, 'xy')"
                    @dblclick="new_bf_all(val, 'xy')"
                  >
                    <img
                      v-show="val.xiala_bool"
                      class="xiala_tb"
                      src="../assets/image/x_arr.png"
                    />
                    <img
                      v-show="!val.xiala_bool"
                      class="xiala_tb"
                      src="../assets/image/r_arr.png"
                    />
                    <span
                      >{{ val.sysOrgCode_dictText }}-{{ val.carNumber }}</span
                    >
                  </p>

                  <ul v-show="val.xiala_bool">
                    <li @dblclick.stop="new_bf(1, '球机', val, 'videoXy')">
                      球机
                    </li>
                    <li
                      @dblclick.stop="new_bf(2, '左前摄像机', val, 'videoXy')"
                    >
                      左前摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(3, '左中前摄像机', val, 'videoXy')"
                    >
                      左中前摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(4, '右中前摄像机', val, 'videoXy')"
                    >
                      右中前摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(5, '右前摄像机', val, 'videoXy')"
                    >
                      右前摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(6, '左后摄像机', val, 'videoXy')"
                    >
                      左后摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(7, '左中后摄像机', val, 'videoXy')"
                    >
                      左中后摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(8, '右中后摄像机', val, 'videoXy')"
                    >
                      右中后摄像机
                    </li>
                    <li
                      @dblclick.stop="new_bf(9, '右后摄像机', val, 'videoXy')"
                    >
                      右后摄像机
                    </li>
                  </ul>
                </template>
              </div>
            </template>

            <template v-else>
              <p class="pad">此县区当前没有在线车辆</p>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { Message, Loading } from "element-ui";
import {
  queryAllPoliceAndDev,
  selectDept,
  gyxyPcInformation,
} from "@/api/system_sj.js";
import { startLoding, endLoding } from "@/request/loading.js";
import EmpMini from "./empMini.vue";
import { ongo, getEncryption, sysLogin, gyxySyMap } from "@/api/login_sj.js";
import {
  getVideoUrl,
  hikControl,
  getVideoUrl2,
  hikControl2,
  getVideoUrlback,
  getCameraCode,
} from "@/api/hkvideosj.js";
import { v4 } from "uuid";
export default {
  name: "jcList",
  props: ["detid"],
  data() {
    return {
      carList_xichuan: [],
      carList_tb: [],
      carList_thjc: [],
      carList_tjc: [],
      carList_nz: [],
      carList_nxjc: [],
      carList_sqjc: [],
      carList_xy: [],
      pagesize: 1,
      sysOrgCode: "",
      infinitedisabled: true,
      time: null,
      input2: "",
    };
  },
  destroyed() {},
  watch: {
    detid: {
      handler(newss, old) {
        this.shitch_dep(newss);
      },

      immediate: false,
    },
  },
  methods: {
    xx() {
      this.input2 = null;
    },
    cpsear() {},
    async new_bf_all(val, bs) {
      clearTimeout(this.time);
      var vnb = [
        {
          cameraIndexCode: "",
          ezvizDirect: 0,
          gpuMode: 0,
          streamMode: 0,
          transMode: 1,
          wndId: 1,
        },
        {
          cameraIndexCode: "",
          ezvizDirect: 0,
          gpuMode: 0,
          streamMode: 0,
          transMode: 1,
          wndId: 2,
        },
        {
          cameraIndexCode: "",
          ezvizDirect: 0,
          gpuMode: 0,
          streamMode: 0,
          transMode: 1,
          wndId: 3,
        },
        {
          cameraIndexCode: "",
          ezvizDirect: 0,
          gpuMode: 0,
          streamMode: 0,
          transMode: 1,
          wndId: 4,
        },
        {
          cameraIndexCode: "",
          ezvizDirect: 0,
          gpuMode: 0,
          streamMode: 0,
          transMode: 1,
          wndId: 5,
        },
        {
          cameraIndexCode: "",
          ezvizDirect: 0,
          gpuMode: 0,
          streamMode: 0,
          transMode: 1,
          wndId: 6,
        },
        {
          cameraIndexCode: "",
          ezvizDirect: 0,
          gpuMode: 0,
          streamMode: 0,
          transMode: 1,
          wndId: 7,
        },
        {
          cameraIndexCode: "",
          ezvizDirect: 0,
          gpuMode: 0,
          streamMode: 0,
          transMode: 1,
          wndId: 8,
        },
        {
          cameraIndexCode: "",
          ezvizDirect: 0,
          gpuMode: 0,
          streamMode: 0,
          transMode: 1,
          wndId: 9,
        },
      ];
      try {
        this.new_bf(1, "", val, "");
        this.new_bf(2, "", val, "");
        this.new_bf(3, "", val, "");
        this.new_bf(4, "", val, "");
        this.new_bf(5, "", val, "");
        this.new_bf(6, "", val, "");
        this.new_bf(7, "", val, "");
        this.new_bf(8, "", val, "");
        this.new_bf(9, "", val, "");
        //--------------------------
        // var res = await  getCameraCode({channelNo:1,code:val.gbInfomation})

        // var bianhao = res.result

        // vnb[0].cameraIndexCode = bianhao

        // var res = await  getCameraCode({channelNo:2,code:val.gbInfomation})

        // var bianhao = res.result

        // vnb[1].cameraIndexCode = bianhao

        // vnb[2].cameraIndexCode = bianhao

        // vnb[3].cameraIndexCode = bianhao

        // vnb[4].cameraIndexCode = bianhao

        // vnb[5].cameraIndexCode = bianhao

        // vnb[6].cameraIndexCode = bianhao

        // vnb[7].cameraIndexCode = bianhao

        // vnb[8].cameraIndexCode = bianhao

        // window.parent.postMessage({
        //     message: 'getCrossHeight2',
        //     height:JSON.stringify(vnb),
        // }, '*');
      } catch (e) {
        // window.parent.postMessage({
        //     message: 'getCrossHeight2',
        //     error:`未获取到${val.carNumber}的nvr信息`,
        // }, '*');
        // Message({
        //     showClose: true,
        //     message:`未获取到${val.carNumber}的nvr信息`,
        //     type:'error',
        //     duration:2000
        // })
      }
    },
    async new_bf(index, name, val, bs) {
      try {
        var ip = "http://41.211.252.154:18888";
        var res = await sysLogin(
          {
            captcha: "",
            checkKey: "",
            password: "123456",
            username: "admin",
          },
          ip
        );

        // sessionStorage.setItem("JC_Token", res.result.token);

        var tokens = res.result.token;

        var res = await getCameraCode(
          { channelNo: index, code: val.gbInfomation },
          ip,
          tokens
        );

        var bianhao = res.result;

        var vnb = {
          bianhao,
        };

        window.parent.postMessage(
          {
            message: "getCrossHeight",
            height: JSON.stringify(vnb),
          },
          "*"
        );
      } catch (e) {
        window.parent.postMessage(
          {
            message: "getCrossHeight",
            error: `未获取到${val.carNumber}的nvr信息`,
          },
          "*"
        );

        // Message({
        //     showClose: true,
        //     message:`未获取到${val.carNumber}的nvr信息`,
        //     type:'error',
        //     duration:2000
        // })
      }
    },
    xiala(val, bs) {
      var that = this;
      // 开启延时器，300ms的间隔区分单击和双击，解决双击时执行两次单击事件
      clearTimeout(that.time);
      that.time = setTimeout(() => {
        // 写单击事件执行的逻辑代码
        if (bs == "xichuan") {
          this.carList_xichuan.forEach((item, i) => {
            if (val.id == item.id) {
              this.$set(this.carList_xichuan, i, {
                ...item,
                xiala_bool: !item.xiala_bool,
              });
            }
          });
        } else if (bs == "tb") {
          this.carList_tb.forEach((item, i) => {
            if (val.id == item.id) {
              this.$set(this.carList_tb, i, {
                ...item,
                xiala_bool: !item.xiala_bool,
              });
            }
          });
        } else if (bs == "thjc") {
          this.carList_thjc.forEach((item, i) => {
            if (val.id == item.id) {
              this.$set(this.carList_thjc, i, {
                ...item,
                xiala_bool: !item.xiala_bool,
              });
            }
          });
        } else if (bs == "tjc") {
          this.carList_tjc.forEach((item, i) => {
            if (val.id == item.id) {
              this.$set(this.carList_tjc, i, {
                ...item,
                xiala_bool: !item.xiala_bool,
              });
            }
          });
        } else if (bs == "nz") {
          this.carList_nz.forEach((item, i) => {
            if (val.id == item.id) {
              this.$set(this.carList_nz, i, {
                ...item,
                xiala_bool: !item.xiala_bool,
              });
            }
          });
        } else if (bs == "nxjc") {
          this.carList_nxjc.forEach((item, i) => {
            if (val.id == item.id) {
              this.$set(this.carList_nxjc, i, {
                ...item,
                xiala_bool: !item.xiala_bool,
              });
            }
          });
        } else if (bs == "sqjc") {
          this.carList_sqjc.forEach((item, i) => {
            if (val.id == item.id) {
              this.$set(this.carList_sqjc, i, {
                ...item,
                xiala_bool: !item.xiala_bool,
              });
            }
          });
        } else if (bs == "xy") {
          this.carList_xy.forEach((item, i) => {
            if (val.id == item.id) {
              this.$set(this.carList_xy, i, {
                ...item,
                xiala_bool: !item.xiala_bool,
              });
            }
          });
        }
      }, 300);
    },

    fasong(data, bs) {
      clearTimeout(this.time);

      var p = Object.assign({}, data, {
        change: v4(),
        ip: data.gbInfomation,
        type: "all",
        bs,
      });
      this.$emit("song", p);
    },
    async gg(ip, bs) {
      var loading_lo;
      var tokens;
      try {
        try {
          var res = await sysLogin(
            {
              captcha: "",
              checkKey: "",
              password: "123456",
              username: "admin",
            },
            ip
          );

          // sessionStorage.setItem("JC_Token", res.result.token);

          tokens = res.result.token;
        } catch (err) {
          // Message({
          //     showClose: true,
          //     message:'网络异常',
          //     type:'error',
          //     duration:2000
          // })
        }

        this.infinitedisabled = true;
        var res = await gyxyPcInformation(
          this.sysOrgCode,
          this.pagesize,
          ip,
          tokens
        );

        if (res && res.result && res.result.records.length != 0) {
          let arrCar = res.result.records;

          var L1 = [],
            L2 = [],
            L3 = [];

          if (bs == "xichuan") {
            arrCar.forEach((item, i) => {
              if (
                item.nvrStatus &&
                (item.ptzStatus == 1 ||
                  item.flStatus == 1 ||
                  item.frStatus == 1 ||
                  item.lgStatus == 1 ||
                  item.rgStatus == 1 ||
                  item.fmlStatus == 1 ||
                  item.fmrStatus == 1 ||
                  item.lmgStatus == 1 ||
                  item.rmgStatus == 1)
              ) {
                L1.push(item);
              }
            });

            arrCar = L1;

            this.carList_xichuan = [...this.carList_xichuan, ...arrCar];

            this.carList_xichuan.forEach((item, i) => {
              if (item.carNumber == this.$route.query.name) {
                item.xiala_bool = true;

                item.ads = "acti";

                $(".xichuan_box").appendTo($(".jkbox"));
              } else {
                item.xiala_bool = false;
              }
            });
          } else if (bs == "tb") {
            arrCar.forEach((item, i) => {
              if (
                item.nvrStatus &&
                (item.ptzStatus == 1 ||
                  item.flStatus == 1 ||
                  item.frStatus == 1 ||
                  item.lgStatus == 1 ||
                  item.rgStatus == 1 ||
                  item.fmlStatus == 1 ||
                  item.fmrStatus == 1 ||
                  item.lmgStatus == 1 ||
                  item.rmgStatus == 1)
              ) {
                L1.push(item);
              }
            });

            arrCar = L1;

            this.carList_tb = [...this.carList_tb, ...arrCar];

            this.carList_tb.forEach((item, i) => {
              if (item.carNumber == this.$route.query.name) {
                item.xiala_bool = true;

                item.ads = "acti";

                $(".tb_box").appendTo($(".jkbox"));
              } else {
                item.xiala_bool = false;
              }
            });
          } else if (bs == "thjc") {
            arrCar.forEach((item, i) => {
              if (
                item.nvrStatus &&
                (item.ptzStatus == 1 ||
                  item.flStatus == 1 ||
                  item.frStatus == 1 ||
                  item.lgStatus == 1 ||
                  item.rgStatus == 1 ||
                  item.fmlStatus == 1 ||
                  item.fmrStatus == 1 ||
                  item.lmgStatus == 1 ||
                  item.rmgStatus == 1)
              ) {
                L1.push(item);
              }
            });

            arrCar = L1;

            this.carList_thjc = [...this.carList_thjc, ...arrCar];

            this.carList_thjc.forEach((item, i) => {
              if (item.carNumber == this.$route.query.name) {
                item.xiala_bool = true;

                item.ads = "acti";

                $(".thjc_box").appendTo($(".jkbox"));
              } else {
                item.xiala_bool = false;
              }
            });
          } else if (bs == "tjc") {
            arrCar.forEach((item, i) => {
              if (
                item.nvrStatus &&
                (item.ptzStatus == 1 ||
                  item.flStatus == 1 ||
                  item.frStatus == 1 ||
                  item.lgStatus == 1 ||
                  item.rgStatus == 1 ||
                  item.fmlStatus == 1 ||
                  item.fmrStatus == 1 ||
                  item.lmgStatus == 1 ||
                  item.rmgStatus == 1)
              ) {
                L1.push(item);
              }
            });

            arrCar = L1;

            this.carList_tjc = [...this.carList_tjc, ...arrCar];

            this.carList_tjc.forEach((item, i) => {
              if (item.carNumber == this.$route.query.name) {
                item.xiala_bool = true;

                item.ads = "acti";

                $(".tjc_box").appendTo($(".jkbox"));
              } else {
                item.xiala_bool = false;
              }
            });
          } else if (bs == "nz") {
            arrCar.forEach((item, i) => {
              if (
                item.nvrStatus &&
                (item.ptzStatus == 1 ||
                  item.flStatus == 1 ||
                  item.frStatus == 1 ||
                  item.lgStatus == 1 ||
                  item.rgStatus == 1 ||
                  item.fmlStatus == 1 ||
                  item.fmrStatus == 1 ||
                  item.lmgStatus == 1 ||
                  item.rmgStatus == 1)
              ) {
                L1.push(item);
              }
            });

            arrCar = L1;

            this.carList_nz = [...this.carList_nz, ...arrCar];

            this.carList_nz.forEach((item, i) => {
              if (item.carNumber == this.$route.query.name) {
                item.xiala_bool = true;

                item.ads = "acti";

                $(".nz_box").appendTo($(".jkbox"));
              } else {
                item.xiala_bool = false;
              }
            });
          } else if (bs == "nxjc") {
            arrCar.forEach((item, i) => {
              if (
                item.nvrStatus &&
                (item.ptzStatus == 1 ||
                  item.flStatus == 1 ||
                  item.frStatus == 1 ||
                  item.lgStatus == 1 ||
                  item.rgStatus == 1 ||
                  item.fmlStatus == 1 ||
                  item.fmrStatus == 1 ||
                  item.lmgStatus == 1 ||
                  item.rmgStatus == 1)
              ) {
                L1.push(item);
              }
            });

            arrCar = L1;

            this.carList_nxjc = [...this.carList_nxjc, ...arrCar];

            this.carList_nxjc.forEach((item, i) => {
              if (item.carNumber == this.$route.query.name) {
                item.xiala_bool = true;

                item.ads = "acti";

                $(".nxjc_box").appendTo($(".jkbox"));
              } else {
                item.xiala_bool = false;
              }
            });
          } else if (bs == "sqjc") {
            arrCar.forEach((item, i) => {
              if (
                item.nvrStatus &&
                (item.ptzStatus == 1 ||
                  item.flStatus == 1 ||
                  item.frStatus == 1 ||
                  item.lgStatus == 1 ||
                  item.rgStatus == 1 ||
                  item.fmlStatus == 1 ||
                  item.fmrStatus == 1 ||
                  item.lmgStatus == 1 ||
                  item.rmgStatus == 1)
              ) {
                L1.push(item);
              }
            });

            arrCar = L1;

            this.carList_sqjc = [...this.carList_sqjc, ...arrCar];

            this.carList_sqjc.forEach((item, i) => {
              if (item.carNumber == this.$route.query.name) {
                item.xiala_bool = true;

                item.ads = "acti";

                $(".sqjc_box").appendTo($(".jkbox"));
              } else {
                item.xiala_bool = false;
              }
            });
          } else if (bs == "xy") {
            arrCar.forEach((item, i) => {
              if (
                item.nvrStatus &&
                (item.ptzStatus == 1 ||
                  item.flStatus == 1 ||
                  item.frStatus == 1 ||
                  item.lgStatus == 1 ||
                  item.rgStatus == 1 ||
                  item.fmlStatus == 1 ||
                  item.fmrStatus == 1 ||
                  item.lmgStatus == 1 ||
                  item.rmgStatus == 1)
              ) {
                L1.push(item);
              }
            });

            arrCar = L1;

            this.carList_xy = [...this.carList_xy, ...arrCar];

            this.carList_xy.forEach((item, i) => {
              if (item.carNumber == this.$route.query.name) {
                item.xiala_bool = true;

                item.ads = "acti";

                $(".xy_box").appendTo($(".jkbox"));
              } else {
                item.xiala_bool = false;
              }
            });
          }
        }

        //    setTimeout(()=>{
        //         var that=this

        //         $('.car_item').each(function(){

        //             console.log($(this).attr('carnum'),that.$route.query.name,'pppppp======')
        //             if($(this).attr('carnum') == that.$route.query.name){

        //                 $(this).css('color','rgb(88 98 167)')
        //                 $(this).css('fontWeight','bold')
        //                 $(this).css('background','rgb(159 173 249 / 50%)')
        //             }

        //         })
        //    },2000)
      } catch (err) {
        console.log(err);

        // endLoding(loading_lo)
        // this.infinitedisabled =false
        // Message({
        // 	showClose: true,
        // 	message:'网络异常',
        // 	type:'error',
        // 	duration:2000
        // })
      }
    },
    async ggp_xichuan() {
      this.gg("http://41.206.1.31:18888", "xichuan");
    },

    async ggp_tb() {
      this.gg("http://41.210.0.123:18888", "tb");
    },

    async ggp_thjc() {
      this.gg("http://41.208.9.226:18888", "thjc");
    },

    async ggp_tjc() {
      this.gg("http://41.211.252.154:18888", "tjc");
    },

    async ggp_nz() {
      this.gg("http://41.201.0.218:18888", "nz");
    },

    async ggp_nxjc() {
      this.gg("http://41.205.32.246:18888", "nxjc");
    },

    async ggp_sqjc() {
      this.gg("http://41.207.0.185:18888", "sqjc");
    },

    async ggp_xy() {
      this.gg("http://41.209.9.213:18888", "xy");
    },
  },

  mounted() {
    this.ggp_xichuan();

    this.ggp_tb();

    this.ggp_thjc();

    this.ggp_tjc();

    this.ggp_nz();

    this.ggp_nxjc();

    this.ggp_sqjc();

    this.ggp_xy();
  },
  components: {
    EmpMini,
  },
};
</script>

<style lang="scss" scoped>
::v-deep ::-webkit-input-placeholder {
  color: #fff;
  font-size: 15px;
}

::v-deep .el-input__inner {
  background-color: rgb(0, 62, 118) !important;
  border: 1px solid #1296db;
  color: #fff;
}

.sear_box {
  display: flex;
  // flex-direction: column;
  // align-items: center;
}
.sear {
  width: 95%;

  border: 1px solid #4696df;
  color: #4696df;
}
.btnu {
  width: 95%;

  display: flex;
  justify-content: space-between;
  margin-top: 5px; /*no*/
}
.sear_btn {
  width: 47%;
}
* {
  font-size: 14px; /*no*/
}
.xiala_tb {
  width: 15px; /*no*/
  margin-right: 2px;
}
.index_container {
  width: 100%;
  height: 100%;
  padding: 10px 0;
  box-sizing: border-box;
  // overflow-y: scroll;
  // overflow-x: hidden;
}

.ui_box {
  width: 100%;
  height: calc(100% - 50px);

  overflow-y: scroll;
  // min-height: 100px;/*no*/
}

.ui_con {
  width: 100%;
  height: 100%;

  // overflow-y: scroll;
}

.xm {
  margin-left: 10px;
  font-weight: bold;
  margin-top: 40px;
}

.car_item {
  width: 100%;
  font-weight: bold;
  color: #4696df;
  padding: 6px 18px;
  box-sizing: border-box;
  padding-left: 20px;
  // display: flex;
  // align-items: center;
  // justify-content: space-between;
  &.nysj_the {
    color: #000;
  }
  &.acti {
    color: rgb(88 98 167);
    font-weight: bold;
    background: rgb(159 173 249 / 50%);
  }
  ul {
    margin-left: 50px;
  }
  li {
    text-indent: 16px; /*no*/
    list-style: none;
    cursor: pointer;
  }

  li:hover {
    font-weight: bold;
    background: #006be6;
    font-size: 18px; /*no*/
    color: #fff;
  }

  &:hover {
    p {
      font-weight: bold;
      background: #006be6;

      color: #fff;

      span {
        font-size: 18px; /*no*/
      }
      img {
        width: 17px; /*no*/
      }
    }
  }

  p:hover {
    font-weight: bold;
    background: #006be6;

    color: #fff;

    span {
      font-size: 18px; /*no*/
    }
    img {
      width: 17px; /*no*/
    }
  }

  p {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
}

.pad {
  text-indent: 30px;
}
</style>
