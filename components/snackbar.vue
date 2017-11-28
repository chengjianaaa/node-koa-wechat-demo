<template lang="pug">
  transition(name=swing)
    .snackbar(v-if='open')
      .snackbar-content
        slot(name='body')
        slot(name='action', @click='$emit("update:open", false)')
</template>

<script>
export default {
  props: {
    open: {
      default: false // 控制是否显示该snackbar组件
    }
  },
  watch: {
    'open': function (newVal, oldVal) {
      if (newVal) {
        // 3s后隐藏
        var timer = setTimeout(() => {
          this.$emit('update:open', false)
          clearTimeout(timer)
        }, 3 * 1000)
      }
    }
  }
}
</script>

<style scoped lang='sass'>
  @import '~static/sass/color'
  $snackbar-padding: 24px
  .snackbar
    position: fixed
    bottom: 0
    left: 0
    right: 0
    z-index: 999
    display: flex
    justify-content: center
    .snackbar-content
      flex-grow: 0
      min-height: 48px
      min-width: calc(320px - #{$snackbar-padding})
      padding: 0 $snackbar-padding
      display: flex
      align-items: center
      justify-content: space-between
      line-height: 24px
      font-size: 16px
      background-color: $grey-900
      color: #fff
      .action
        margin-left: 24px
        color: $amber
  .swing-enter-active, .swing-leave-active 
    transition: all 200ms
  .swing-enter, .swing-leave-active 
    opacity: .3
    transform: translateY(100%)
</style>