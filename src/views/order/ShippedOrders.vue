<!-- src/views/orders/Shipped.vue -->
<template>
  <OrderPage status="已发货" />
</template>

<script>
import OrderPage from './OrderPageBase.vue'

export default { name: 'Shipped', components: { OrderPage }}
</script>
