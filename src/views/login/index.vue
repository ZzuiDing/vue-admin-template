<template>
  <div class="login-container">
    <el-form
      ref="form"
      :model="isLogin ? loginForm : registerForm"
      :rules="isLogin ? loginRules : registerRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">{{ isLogin ? 'Login Form' : 'Register Form' }}</h3>
      </div>

      <!-- 登录表单 -->
      <template v-if="isLogin">
        <el-form-item prop="username">
          <span class="svg-container"><svg-icon icon-class="user" /></span>
          <el-input v-model="loginForm.username" placeholder="Username" />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container"><svg-icon icon-class="password" /></span>
          <el-input
            :key="passwordType"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;margin-bottom:30px;"
          @click.native.prevent="handleLogin"
        >Login
        </el-button>
      </template>

      <!-- 注册表单 -->
      <template v-else>
        <el-form-item prop="name">
          <el-input v-model="registerForm.name" placeholder="Name" />
        </el-form-item>

        <el-form-item prop="email">
          <el-input v-model="registerForm.email" placeholder="Email" />
        </el-form-item>

        <el-form-item prop="phone">
          <el-input v-model="registerForm.phone" placeholder="Phone" />
        </el-form-item>

        <el-form-item prop="passwd">
          <el-input v-model="registerForm.passwd" type="password" placeholder="Password" />
        </el-form-item>

        <el-form-item prop="captcha">
          <el-input v-model="registerForm.captcha" placeholder="Enter CAPTCHA" />
          <div style="margin-top: 5px; color: #bbb;">验证码: {{ fakeCaptcha }}</div>
        </el-form-item>

        <el-button type="primary" style="width:100%;margin-bottom:30px;" @click="handleRegister">Register</el-button>
      </template>

      <div class="tips">
        <span style="cursor: pointer;" @click="toggleForm">
          {{ isLogin ? "No account? Register now" : "Already have an account? Login" }}
        </span>
      </div>
      <!-- 返回主页按钮 -->
      <el-button
        type="text"
        style="width:100%;margin-top:10px;"
        @click="goHome"
      >Back to Home
      </el-button>
    </el-form>
  </div>
</template>

<script>
// import {validUsername} from '@/utils/validate'
import request from '@/utils/request'

export default {
  name: 'Login',
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!validUsername(value)) {
    //     callback(new Error('Please enter the correct user name'))
    //   } else {
    //     callback()
    //   }
    // }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('Password must be at least 6 characters'))
      } else {
        callback()
      }
    }
    // const validateEmail = (rule, value, callback) => {
    //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    //   if (!emailRegex.test(value)) {
    //     callback(new Error('Invalid email format'))
    //   } else {
    //     callback()
    //   }
    // }
    // const validatePhone = (rule, value, callback) => {
    //   const phoneRegex = /^1[3-9]\d{9}$/
    //   if (!phoneRegex.test(value)) {
    //     callback(new Error('Invalid phone number'))
    //   } else {
    //     callback()
    //   }
    // }
    const validateCaptcha = (rule, value, callback) => {
      if (value !== '1234') {
        callback(new Error('Incorrect CAPTCHA'))
      } else {
        callback()
      }
    }

    return {
      isLogin: true,
      fakeCaptcha: '1234', // 模拟验证码
      loginForm: {
        username: 'admin',
        password: '114514'
      },
      registerForm: {
        name: '',
        email: '',
        phone: '',
        passwd: '',
        captcha: ''
      },
      loginRules: {
        // username: [{required: true, trigger: 'blur', validator: validateUsername}],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      registerRules: {
        name: [{ required: true, message: 'Please enter name', trigger: 'blur' }],
        // email: [{required: true, trigger: 'blur', validator: validateEmail}],
        // phone: [{required: true, trigger: 'blur', validator: validatePhone}],
        passwd: [{ required: true, min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }],
        captcha: [{ required: true, trigger: 'blur', validator: validateCaptcha }]
      },
      passwordType: 'password',
      loading: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    toggleForm() {
      this.isLogin = !this.isLogin
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    showPwd() {
      this.passwordType = this.passwordType === 'password' ? '' : 'password'
    },
    handleLogin() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        this.loading = true
        this.$store.dispatch('user/login', this.loginForm).then(() => {
          this.$router.push({ path: this.redirect || '/backend/dashboard' })
        }).finally(() => {
          this.loading = false
        })
      })
    },
    handleRegister() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        // 模拟提交注册请求
        console.log('Register Info:', this.registerForm)
        request.post('http://localhost:9090/spba-api/user/register', this.registerForm).then(response => {
          if (response.code !== 20000) {
            this.$message.error('Registration failed: ' + response.message)
            return
          }
        }).catch(error => {
          console.error('Registration error:', error)
          this.$message.error('Registration failed: ' + error.message)
        })

        this.$message.success('Registration successful!')

        // 清空表单并切换回登录
        this.registerForm = {
          name: '',
          email: '',
          phone: '',
          passwd: '',
          captcha: ''
        }
        this.isLogin = true
      })
    },
    goHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
