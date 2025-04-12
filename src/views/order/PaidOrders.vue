<!-- src/views/orders/Paid.vue -->
<template>
  <OrderPage status="已支付" />
</template>

<script>
import OrderPage from './OrderPageBase.vue'

export default { name: 'Paid', components: { OrderPage }}
</script>
