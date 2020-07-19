<template>
  <div class="home">
    <MapboxMap
      :center="[-74.0066, 40.7135]"
      class="map"
    />
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
