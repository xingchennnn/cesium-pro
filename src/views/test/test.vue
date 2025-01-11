<template>
  <div>
    <h1>This is a test page</h1>
    <p>Count: {{ counterStore.count }}</p>
    <button @click="increment2">Increment</button>
  </div>
</template>

<script setup lang="ts">
// vue3 setup 写法
import { ref, onMounted, onUnmounted } from 'vue'
import {useCounterStore} from '@/stores/counter'
  // 页面加载完成后，从 store 中获取数据
const counterStore = useCounterStore()
  
const count = ref(0)
// onMounted 生命周期钩子--页面加载完成
onMounted(() => { 
  console.log('mounted',counterStore.count)


  // 数据修改
  count.value = counterStore.count
  // 卸载页面
  onUnmounted(() => { 
    console.log('unmounted')
  })
})

// const increment = () => {
//   // 数据修改
//   count.value++
// }

function increment2() {
  // 数据修改
  counterStore.increment()
}


// vue3 写法
// import { defineComponent , ref } from 'vue'

// export default defineComponent({
//   setup () {
//     const count = ref(0)

//     return {count}
//   }
// })
// vue2 写法
// export default {
//   data() {
//     return {
//       count: 1
//     }
//   },

//   // `mounted` 是生命周期钩子，之后我们会讲到
//   mounted() {
//     // `this` 指向当前组件实例
//     console.log(this.count) // => 1

//     // 数据属性也可以被更改
//     this.count = 2
//   }
// }
</script>

<style scoped>

</style>