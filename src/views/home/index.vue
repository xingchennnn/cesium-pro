<template>
  <div
    class="cesium-container"
    id="cesiumContainerapp"
    ref="cesiumContainer"
  ></div>
  <!-- <div>234</div> -->
</template>

<script setup lang="ts">
// 引入cesium 的文件
import "cesium/Build/Cesium/Widgets/widgets.css";
import * as Cesium from "cesium";
import { onMounted } from "vue";
import { ref } from "vue";
import Scene from "./scense";

const cesiumContainer = ref(null);

const SceneWiewer = ref<Scene | null>(null);

Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMDc5YmU2NS04YmY4LTQ2MzMtODkxYy1lMjFmM2IyNGM1ODciLCJpZCI6MjI5NTQ2LCJpYXQiOjE3MjE0NDY2Mzl9.5jyLlq5jDKAR-mQAICUfSrD93sXqwHRf8KVbL5Rr_i8";
onMounted(async() => {
  console.log("cesium", Cesium);
  const viewer = new Cesium.Viewer("cesiumContainerapp", {
    //一般false都是隐藏控件
    // 一种地理位置搜索工具，用于显示相机访问的地理位置,默认使用微软的Bing地图
    geocoder: false,
    //首页位置，点击之后将视图跳转到默认视角
    homeButton: false,
    //切换2D、3D 和 Columbus View (CV) 模式
    sceneModePicker: false,
    //选择三维数字地球的底图（imagery and terrain）
    baseLayerPicker: false,
    //帮助提示，如何操作数字地球
    navigationHelpButton: false,
    //控制视窗动画的播放速度
    animation: false,
    //展示商标版权和数据源
    //creditContainer: 'cesiumContainer',
    //展示当前时间和允许用户在进度条上拖动到任何一个指定的时间
    timeline: false,
    //视察全屏按钮
    fullscreenButton: false,
    //切换vr模式
    vrButton: false,
    // 加载地形
    // terrainProvider: await Cesium.CesiumTerrainProvider.fromIonAssetId(3956, {
    //  requestVertexNormals: true
    // })
  });
  // 去除版权信息
  (viewer.cesiumWidget.creditContainer as HTMLElement).style.display = "none";

  console.log("viewer", viewer);
  SceneWiewer.value = new Scene(viewer);

  SceneWiewer.value.fitTo([106.4388,29.4494,281])
});


</script>

<style lang="scss" scoped>
.cesium-container {
  width: 100vw;
  height: 100vh;
}
</style>
