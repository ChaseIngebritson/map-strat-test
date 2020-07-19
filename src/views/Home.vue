<template>
  <div class="home">
    <MapboxMap class="map" />
  </div>
</template>

<script>
import MapboxMap from '@/components/MapboxMap.vue'

export default {
  name: 'Home',
  components: {
    MapboxMap
  }
}
</script>

<style lang="scss">
.home {
  height: 75vh;
}
</style>
