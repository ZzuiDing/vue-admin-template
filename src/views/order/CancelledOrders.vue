<!-- src/views/orders/Cancelled.vue -->
<template>
  <OrderPage status="已取消" />
</template>

<script>
import OrderPage from './OrderPageBase.vue'

export default { name: 'Cancelled', components: { OrderPage }}
</script>
