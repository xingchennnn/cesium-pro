<template>
  <div class="cesium-container" id="cesiumContainerapp" ref="cesiumContainer"></div>
  <div class="container pointer-events-none">

    <div class="left-container">
      <!-- <div class="logo">
        123
      </div> -->
      <div class="menu-bar">
        <menu-bar></menu-bar>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 引入cesium 的文件
import "cesium/Build/Cesium/Widgets/widgets.css";
import * as Cesium from "cesium";
import { onMounted } from "vue";
import { ref } from "vue";
// import Scene from "./scenseApi";
import SceneControl from "./sceneControl";
import menuBar from "./components/menuBar.vue";

const cesiumContainer = ref(null);

// const SceneWiewer = ref<Cesium.Viewer | null>(null);

Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMDc5YmU2NS04YmY4LTQ2MzMtODkxYy1lMjFmM2IyNGM1ODciLCJpZCI6MjI5NTQ2LCJpYXQiOjE3MjE0NDY2Mzl9.5jyLlq5jDKAR-mQAICUfSrD93sXqwHRf8KVbL5Rr_i8";

Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
  // 西经度
  89.5,
  // 西纬度
  20.4494,
  // 东经度
  110.4,
  // 北纬度
  61.2
);

onMounted(async() => {
  console.log("cesium", Cesium);
  const viewer = new Cesium.Viewer("cesiumContainerapp", {
    //一般false都是隐藏控件
    // 一种地理位置搜索工具，用于显示相机访问的地理位置,默认使用微软的Bing地图
    // geocoder: false,
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
    // 动画效果 --如果要使用动画效果，请将shouldAnimate设置为true -不然就不会有动画效果
    shouldAnimate: true,
    // 加载地形
    // terrainProvider: await Cesium.CesiumTerrainProvider.fromIonAssetId(3956, {
    //  requestVertexNormals: true
    // })
    // geocoder: Cesium.IonGeocodeProviderType.GOOGLE,
  });
  // 去除版权信息
  (viewer.cesiumWidget.creditContainer as HTMLElement).style.display = "none";
  // 初始化场景控制
  SceneControl.api.init(viewer);
  // 开启地形
  await SceneControl.api.enableTerrain();
});


</script>

<style lang="scss" scoped>
.cesium-container {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

.container {
  display: flex;
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: 2;

  .left-container {
    height: 100%;
    .menu-bar{
      height: 100%;

      overflow-y: scroll;
    }
  }
}

</style>
