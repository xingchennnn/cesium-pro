<template>
  <div>

  </div>
</template>

<script setup lang="ts">
import EventBus  from "@/utils/eventBus/EventBus";
import { onMounted, onUnmounted } from "vue";

onMounted(() => { 
  // 监听test事件
  EventBus.on("test", (data: any) => {
    console.log(data);
  })

  setTimeout(() => { 
    // 触发test事件
    EventBus.emit("test", { name: "cesium" });
  }, 2000)

  onUnmounted(() => {
    // 移除test事件监听
    EventBus.off("test");
  })
})

</script>

<style scoped lang="scss">

</style>