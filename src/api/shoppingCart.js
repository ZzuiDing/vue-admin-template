import request from '@/utils/request'

// 添加商品到购物车
export function addToCart(data) {
  return request({
    url: 'http://localhost:9090/spba-api/ShoppingCart/add',
    method: 'post',
    data
  })
}

// 从购物车删除商品
export function deleteFromCart(id) {
  return request({
    url: 'http://localhost:9090/spba-api/ShoppingCart/delete',
    method: 'get',
    params: { id }
  })
}

// 更新购物车中的商品
export function updateCartItem(data) {
  return request({
    url: 'http://localhost:9090/spba-api/ShoppingCart/update',
    method: 'post',
    data
  })
}

// 获取购物车中的商品列表
export function getCartItems() {
  return request({
    url: 'http://localhost:9090/spba-api/ShoppingCart/get',
    method: 'get'
  })
}

// 删除购物车中的商品
export function deleteCartItem(id) {
  return request({
    url: 'http://localhost:9090/spba-api/ShoppingCart/delete?id=' + id,
    method: 'get',
    params: { id }
  })
}
