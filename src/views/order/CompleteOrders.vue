<!-- src/views/orders/Completed.vue -->
<template>
  <OrderPage status="已完成" />
</template>

<script>
import OrderPage from './OrderPageBase.vue'

export default { name: 'Completed', components: { OrderPage }}
</script>
