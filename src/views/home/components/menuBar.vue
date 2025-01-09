<template>
  <div class="menu-bar pointer-events-all">
    <el-menu
      active-text-color="#ffd04b"
      background-color="#545c64"
      class="el-menu-vertical-demo"
      default-active="2"
      text-color="#fff"
      @select="handleSelect"
    >
      <el-sub-menu index="1">
        <template #title>
          <el-icon><location /></el-icon>
          <span>定位</span>
        </template>
        <el-sub-menu index="1-1">
          <template #title>
            <span>添加</span>
          </template>
          <el-menu-item index="addpoint">添加点</el-menu-item>
          <el-menu-item index="addline">添加线</el-menu-item>
          <el-menu-item index="addpolygon">添加面</el-menu-item>
          <el-menu-item index="addPipeLine">添加管道</el-menu-item>
          <el-menu-item index="addModel">添加几何体</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="1-2">
          <template #title>
            <span>飞行控制</span>
          </template>
          <el-menu-item index="flyToDot">飞向点</el-menu-item>
          <el-menu-item index="flyToEntity">飞向物体</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="1-3">
          <template #title>
            <span>图层控制</span>
          </template>
          <el-menu-item index="addIcon">添加图标</el-menu-item>
          <el-menu-item index="addLabel">添加文字</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="1-4">
          <template #title>html弹窗</template>
          <el-menu-item index="addHtmlElement">弹窗</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="1-5">
          <template #title>粒子动画</template>
          <el-menu-item index="addfire">添加火焰动画</el-menu-item>
          <el-menu-item index="addsmoke">添加烟雾动画</el-menu-item>
          <el-menu-item index="addrain">添加雨滴动画</el-menu-item>
          <el-menu-item index="addsnow">添加雪花动画</el-menu-item>
          <el-menu-item index="addboom">添加爆炸动画</el-menu-item>
          <el-menu-item index="addfog">添加雾动画</el-menu-item>
          <el-menu-item index="removeFog">移除雾动画</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
      <el-sub-menu index="2">
        <template #title>
          <el-icon><icon-menu /></el-icon>
          <span>事件</span>
        </template>
        <el-menu-item-group title="点击事件">
          <el-menu-item index="addClickEvent">添加点击事件</el-menu-item>
          <el-menu-item index="removeClickEvent">移除点击事件</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-menu-item index="removeAllEntities" >
        <el-icon><document /></el-icon>
        <span>移除所有实体</span>
      </el-menu-item>
      <el-menu-item index="4">
        <el-icon><setting /></el-icon>
        <span>Navigator Four</span>
      </el-menu-item>
    </el-menu>
    <!-- //创建 html 元素并隐藏 -->
    <div
      id="htmlelement"
      style="
        position: absolute;
        top: 20px;
        left: 30%;
        display: none;
        background-color: blanchedalmond;
      "
    >
      <h2>测试 Html 网页</h2>
      <h3>测试内容</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from "@element-plus/icons-vue";
import SceneControl from "../sceneControl";

const handleSelect = (index: string) => {
  console.log(index);
  switch (index) {
    case "addpoint":
      SceneControl.api.addPoint([106.4388, 29.4494, 10]);
      break;
    case "addline":
      SceneControl.api.addLine([
      [116.4074, 39.9042, 10], // 北京
      [121.4737, 31.2304, 10], // 上海
      [113.2644, 23.1291, 10]  // 广州
      ]);
      break;
    case "addpolygon":
      SceneControl.api.addPolygon([
        [106.422, 29.4521, 10],
        [106.4307, 29.4436, 10],
        [106.4388, 29.4494, 10],
        [106.4299, 29.4562, 10],
      ]);
      break;
    case "addPipeLine":
      SceneControl.api.addPipeLine();
      break;
    case "addModel":

      break;
    case "addfire":
      SceneControl.api.addFire([106.4388, 29.4494, 11]);
      break;
    case "addsmoke":
      break;
    case "addrain":
      SceneControl.api.addRain([106.4388, 29.4494, 10]);
      break;
    case "addsnow":
      break;
    case "addboom":
      break;
    case "addfog":
      SceneControl.api.addFog();
      break;
    case "removeFog":
      SceneControl.api.removeFog();
      break;
    case "flyToDot":
      SceneControl.api.flyToDot([106.4388, 29.4494, 10]);
      break;
    case "flyToEntity":
      // SceneControl.api.flyToEntity();
      break;
    case "addIcon":
      SceneControl.api.addIcon([106.4388, 29.4494, 10]);
      break;
    case "addLabel":
      SceneControl.api.addLabel([106.4388, 29.4494, 10], "测试文字");
      break;
    case "addClickEvent":
      SceneControl.api.addClickEvent();
      break;
    case "removeClickEvent":
      SceneControl.api.removeClickEvent();
      break;
    case "addHtmlElement":
      // const element = document.getElementById("htmlelement");
      // element.style.display = "block";
      SceneControl.api.addPopup([106.4388, 29.4494, 10], "htmlelement");
      break;
    case "removeAllEntities":
        SceneControl.api.removeAllEntities();
        break;
    default:
      break;
  }
};
</script>

<style scoped lang="scss"></style>
