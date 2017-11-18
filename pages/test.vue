<template>
  <div>
    <p>i am test vue file</p>
    <p>{{ testData }}</p>
  </div>
  
</template>
<script>
export default {
  data () {
    return {
      testData: 'hello world'
    }
  },
  layout: 'test' 
}
</script>
<style scoped>
  
</style>