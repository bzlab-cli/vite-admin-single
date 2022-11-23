<template>
  <div class="login-container">
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">
          {{ login.title }}
        </h3>
      </div>

      <el-form-item prop="account">
        <span class="svg-container">
          <el-icon><User /></el-icon>
        </span>
        <el-input
          ref="userNameRef"
          v-model="loginForm.account"
          :placeholder="login.account"
          name="account"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <el-icon><Lock /></el-icon>
        </span>
        <el-input
          :key="passwordType"
          ref="passwordRef"
          v-model="loginForm.password"
          :type="passwordType"
          :placeholder="login.password"
          name="password"
          tabindex="2"
          autocomplete="on"
          @keyup.enter="handleLogin"
        />
      </el-form-item>

      <el-button :loading="loading" type="primary" class="submit" @click.prevent="handleLogin">
        {{ login.logIn }}
      </el-button>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, watch, ref, toRefs } from 'vue'
import { useRoute, LocationQuery, useRouter } from 'vue-router'
import { useUserStore } from '@/views/admin/store/modules/user'

const validateAccount = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('请输入手机号'))
  } else {
    callback()
  }
}

const validatePassword = (rule: any, value: string, callback: any) => {
  if (!value) {
    return callback(new Error('请输入密码'))
  }
  if (value.length < 6) {
    return callback(new Error('密码最少6位'))
  }
  callback()
}

export default defineComponent({
  setup() {
    const userNameRef = ref(null)
    const passwordRef = ref(null)
    const loginFormRef = ref(null)
    const router = useRouter()
    const route = useRoute()
    const userStore = useUserStore()
    const state = reactive({
      login: {
        title: '管理平台',
        logIn: '登录',
        account: '请输入手机号',
        password: '请输入密码'
      },
      loginForm: {
        account: '',
        password: ''
      },
      loginRules: {
        account: [{ validator: validateAccount, trigger: 'blur' }],
        password: [{ validator: validatePassword, trigger: 'blur' }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: '',
      otherQuery: {}
    })

    const methods = reactive({
      handleLogin: () => {
        ;(loginFormRef.value as any).validate(async (valid: boolean) => {
          if (valid) {
            state.loading = true
            try {
              await userStore.login(state.loginForm)
            } catch (error) {
              state.loading = false
            }
            router
              .push({
                path: state.redirect || '/',
                query: state.otherQuery
              })
              .catch(err => {
                console.warn(err)
              })
            state.loading = false
          } else {
            return false
          }
        })
      }
    })

    function getOtherQuery(query: LocationQuery) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {} as LocationQuery)
    }

    watch(
      () => route.query,
      (query: any) => {
        if (query) {
          state.redirect = query.redirect?.toString() ?? ''
          state.otherQuery = getOtherQuery(query)
        }
      }
    )

    onMounted(() => {
      if (state.loginForm.account === '') {
        ;(userNameRef.value as any).focus()
      } else if (state.loginForm.password === '') {
        ;(passwordRef.value as any).focus()
      }
    })

    return {
      userNameRef,
      passwordRef,
      loginFormRef,
      ...toRefs(state),
      ...toRefs(methods)
    }
  }
})
</script>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: $loginBg;
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    :deep(.el-input__wrapper) {
      background: transparent;
      padding: 0;
      box-shadow: none;
    }
    :deep(input) {
      height: 47px;
      background: transparent;
      border: 0;
      border-radius: 0;
      padding: 12px 5px 12px 15px;
      color: $lightGray;
      caret-color: $loginCursorColor;
      -webkit-appearance: none;
      &:-webkit-autofill {
        box-shadow: 0 0 0 1000px $loginBg inset !important;
        -webkit-text-fill-color: #ffffff !important;
      }
    }
  }
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .submit {
    width: 100%;
    margin-bottom: 30px;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $darkGray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $lightGray;
      margin: 0 auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
}
</style>
