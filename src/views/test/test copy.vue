<template>

  <div class="section_class">
    
    <div class="selectTable">
      
      <p @click="addPipeLine">添加管道</p>
      
    </div>
    
  </div>
</template>
<script setup>
import { ref } from "vue";
import * as Cesium from "cesium";

const addPipeLine = () => {
  const redTube = viewer.entities.add({
    name: "Red tube with rounded corners",
    polylineVolume: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        -85.0, 32.0, -85.0, 36.0, -89.0, 36.0, -87.84, 42.49,
      ]),
      shape: computeCircle(60000.0),
      material: Cesium.Color.RED,
      cornerType: Cesium.CornerType.ROUNDED,
    },
  });
  viewer.zoomTo(redTube);
};

// 计算管网圆角的方法
const computeCircle = (radius) => {
  const positions = [];
  for (let i = 0; i < 360; i++) {
    const radians = Cesium.Math.toRadians(i);
    positions.push(
      new Cesium.Cartesian2(
        radius * Math.cos(radians),
        radius * Math.sin(radians)
      )
    );
  }
  return positions;
};
</script>
