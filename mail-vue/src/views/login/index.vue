<template>
  <div id="login-box" :style="background" v-loading="oauthLoading" element-loading-text="登录中...">
    <div class="form-wrapper">
      <div class="container">
        <div class="logo-section">
          <Icon icon="mdi:email-outline" width="48" height="48" class="logo-icon" />
        </div>
        <h1 class="form-title">{{ settingStore.settings.title }}</h1>
        <p class="form-desc" v-if="show === 'login'">{{ $t('loginTitle') }}</p>
        <p class="form-desc" v-else>{{ $t('regTitle') }}</p>
        <div v-show="show === 'login'">
          <el-input :class="settingStore.settings.loginDomain === 0 ? 'email-input' : ''" v-model="form.email"
                    type="text" :placeholder="$t('emailAccount')" autocomplete="off">
            <template #append v-if="settingStore.settings.loginDomain === 0">
              <div @click.stop="openSelect">
                <el-select
                    v-if="show === 'login'"
                    ref="mySelect"
                    v-model="suffix"
                    :placeholder="$t('select')"
                    class="select"
                >
                  <el-option
                      v-for="item in domainList"
                      :key="item"
                      :label="item"
                      :value="item"
                  />
                </el-select>
                <div style="color: var(--el-text-color-primary)">
                  <span>{{ suffix }}</span>
                  <Icon class="setting-icon" icon="mingcute:down-small-fill" width="20" height="20"/>
                </div>
              </div>
            </template>
          </el-input>
          <el-input v-model="form.password" :placeholder="$t('password')" type="password" autocomplete="off">
          </el-input>
          <el-button class="btn" type="primary" @click="submit" :loading="loginLoading"
          >{{ $t('loginBtn') }}
          </el-button>
          <el-button class="btn" v-if="settingStore.settings.linuxdoSwitch"  style="margin-top: 10px"  @click="linuxDoLogin">
            <el-avatar src="/image/linuxdo.webp" :size="18" style="margin-right: 10px" />LinuxDo
          </el-button>
        </div>
        <div v-show="show !== 'login'">
          <el-input class="email-input" v-model="registerForm.email" type="text" :placeholder="$t('emailAccount')"
                    autocomplete="off">
            <template #append>
              <div @click.stop="openSelect">
                <el-select
                    v-if="show !== 'login'"
                    ref="mySelect"
                    v-model="suffix"
                    :placeholder="$t('select')"
                    class="select"
                >
                  <el-option
                      v-for="item in domainList"
                      :key="item"
                      :label="item"
                      :value="item"
                  />
                </el-select>
                <div>
                  <span>{{ suffix }}</span>
                  <Icon class="setting-icon" icon="mingcute:down-small-fill" width="20" height="20"/>
                </div>
              </div>
            </template>
          </el-input>
          <el-input v-model="registerForm.password" :placeholder="$t('password')" type="password" autocomplete="off"/>
          <el-input v-model="registerForm.confirmPassword" :placeholder="$t('confirmPwd')" type="password"
                    autocomplete="off"/>
          <el-input v-if="settingStore.settings.regKey === 0" v-model="registerForm.code" :placeholder="$t('regKey')"
                    type="text" autocomplete="off"/>
          <el-input v-if="settingStore.settings.regKey === 2" v-model="registerForm.code"
                    :placeholder="$t('regKeyOptional')" type="text" autocomplete="off"/>
          <div v-show="verifyShow"
               class="register-turnstile"
               :data-sitekey="settingStore.settings.siteKey"
               data-callback="onTurnstileSuccess"
               data-error-callback="onTurnstileError"
               data-after-interactive-callback="loadAfter"
               data-before-interactive-callback="loadBefore"
          >
            <span style="font-size: 12px;color: #F56C6C" v-if="botJsError">{{ $t('verifyModuleFailed') }}</span>
          </div>
          <el-button class="btn" style="margin: 0" type="primary" @click="submitRegister" :loading="registerLoading"
          >{{ $t('regBtn') }}
          </el-button>
          <el-button v-if="settingStore.settings.linuxdoSwitch" class="btn" style="margin-top: 10px"  @click="linuxDoLogin">
            <el-avatar src="/image/linuxdo.webp" :size="18" style="margin-right: 10px" />LinuxDo
          </el-button>
        </div>
        <template v-if="settingStore.settings.register === 0">
          <div class="switch" @click="show = 'register'" v-if="show === 'login'">{{ $t('noAccount') }}
            <span>{{ $t('regSwitch') }}</span></div>
          <div class="switch" @click="show = 'login'" v-else>{{ $t('hasAccount') }} <span>{{ $t('loginSwitch') }}</span>
          </div>
        </template>
      </div>
    </div>
    <el-dialog class="bind-dialog" v-model="showBindForm"  title="注册邮箱" >
      <div class="bind-container">
        <el-input v-model="bindForm.email" type="text" :placeholder="$t('emailAccount')" autocomplete="off">
          <template #append>
            <div @click.stop="openSelect">
              <el-select
                  ref="mySelect"
                  v-model="suffix"
                  :placeholder="$t('select')"
                  class="select"
              >
                <el-option
                    v-for="item in domainList"
                    :key="item"
                    :label="item"
                    :value="item"
                />
              </el-select>
              <div>
                <span>{{ suffix }}</span>
                <Icon class="setting-icon" icon="mingcute:down-small-fill" width="20" height="20"/>
              </div>
            </div>
          </template>
        </el-input>
        <el-input v-if="settingStore.settings.regKey === 0" v-model="bindForm.code" :placeholder="$t('regKey')"
                  type="text" autocomplete="off"/>
        <el-input v-if="settingStore.settings.regKey === 2" v-model="bindForm.code"
                  :placeholder="$t('regKeyOptional')" type="text" autocomplete="off"/>
        <el-button class="btn" type="primary" @click="bind" :loading="bindLoading"
        >绑定
        </el-button>
      </div>
    </el-dialog>
    <a class="github" href="https://github.com/maillab/cloud-mail">
      <Icon icon="mingcute:github-line" color="#1890ff" width="20" height="20" />
    </a>
  </div>
</template>

<script setup>
import router from "@/router";
import {computed, nextTick, reactive, ref} from "vue";
import {login} from "@/request/login.js";
import {register} from "@/request/login.js";
import {isEmail} from "@/utils/verify-utils.js";
import {useSettingStore} from "@/store/setting.js";
import {useAccountStore} from "@/store/account.js";
import {useUserStore} from "@/store/user.js";
import {useUiStore} from "@/store/ui.js";
import {Icon} from "@iconify/vue";
import {cvtR2Url} from "@/utils/convert.js";
import {loginUserInfo} from "@/request/my.js";
import {permsToRouter} from "@/perm/perm.js";
import {useI18n} from "vue-i18n";
import {oauthBindUser, oauthLinuxDoLogin} from "@/request/ouath.js";

const {t} = useI18n();
const accountStore = useAccountStore();
const userStore = useUserStore();
const uiStore = useUiStore();
const settingStore = useSettingStore();
const loginLoading = ref(false)
const bindLoading = ref(false)
const oauthLoading = ref(false);
const showBindForm = ref(false);
const show = ref('login')

const bindForm = reactive({
  email: '',
  oauthUserId: '',
  code: ''
})

const form = reactive({
  email: '',
  password: '',

});
const mySelect = ref()
const suffix = ref('')
const registerForm = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  code: null
})
const domainList = settingStore.domainList;
const registerLoading = ref(false)
suffix.value = domainList[0]
const verifyShow = ref(false)
let verifyToken = ''
let turnstileId = null
let botJsError = ref(false)
let verifyErrorCount = 0

window.onTurnstileSuccess = (token) => {
  verifyToken = token;
};

window.onTurnstileError = (e) => {
  if (verifyErrorCount >= 4) {
    return
  }
  verifyErrorCount++
  // 人机验证加载失败，尝试重新加载
  setTimeout(() => {
    nextTick(() => {
      if (!turnstileId) {
        turnstileId = window.turnstile.render('.register-turnstile')
      } else {
        window.turnstile.reset(turnstileId);
      }
    })
  }, 1500)
};

window.loadAfter = (e) => {
  // Turnstile 加载完成后的回调
}

window.loadBefore = (e) => {
  // Turnstile 开始加载前的回调
}

const background = computed(() => {
  if (settingStore.settings.background) {
    return {
      'background-image': `url(${cvtR2Url(settingStore.settings.background)})`,
      'background-repeat': 'no-repeat',
      'background-size': 'cover',
      'background-position': 'center'
    }
  }
  return uiStore.dark 
    ? { 'background': '#202123' }
    : { 'background': '#ffffff' }
})

const openSelect = () => {
  mySelect.value.toggleMenu()
}

function linuxDoLogin() {
  const clientId = settingStore.settings.linuxdoClientId
  const redirectUri = encodeURIComponent(settingStore.settings.linuxdoCallbackUrl)
  window.location.href =
      `https://connect.linux.do/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid+profile+email`
}

linuxDoGetUser();

async function linuxDoGetUser() {

  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')

  if (code) {

    oauthLoading.value = true
    oauthLinuxDoLogin(code).then(data => {

      bindForm.oauthUserId = data.userInfo.oauthUserId;

      if (!data.token) {
        showBindForm.value = true
        oauthLoading.value = false
        ElMessage({
          message: '请注册绑定一个邮箱',
          type: 'warning',
          duration: 4000,
          plain: true,
        })
        return;
      }

      saveToken(data.token);
    }).catch(() => {
      oauthLoading.value = false
    })
  }

  const cleanUrl = window.location.origin + window.location.pathname
  window.history.replaceState({}, '', cleanUrl)
}

function bind() {

  if (!bindForm.email) {
    ElMessage({
      message: t('emptyEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }


  if (bindForm.email.length < settingStore.settings.minEmailPrefix) {
    ElMessage({
      message: t('minEmailPrefix', {msg: settingStore.settings.minEmailPrefix}),
      type: 'error',
      plain: true,
    })
    return
  }

  let email = bindForm.email + suffix.value;


  if (!isEmail(email)) {
    ElMessage({
      message: t('notEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (settingStore.settings.regKey === 0) {

    if (!bindForm.code) {

      ElMessage({
        message: t('emptyRegKeyMsg'),
        type: 'error',
        plain: true,
      })
      return
    }

  }

  const form = {email: bindForm.email + suffix.value, oauthUserId: bindForm.oauthUserId, code: bindForm.code}

  bindLoading.value = true
  oauthBindUser(form).then(data => {
    saveToken(data.token)
  }).catch(() => {
    bindLoading.value = false
  })
}

const submit = () => {

  if (!form.email) {
    ElMessage({
      message: t('emptyEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  let email = form.email + (settingStore.settings.loginDomain === 0 ? suffix.value : '');

  if (!isEmail(email)) {
    ElMessage({
      message: t('notEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (!form.password) {
    ElMessage({
      message: t('emptyPwdMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  loginLoading.value = true
  login(email, form.password).then(async data => {
    await saveToken(data.token)
  }).finally(() => {
    loginLoading.value = false
  })
}

async function saveToken(token) {
  localStorage.setItem('token', token)
  const user = await loginUserInfo();
  accountStore.currentAccountId = user.account.accountId;
  accountStore.currentAccount = user.account;
  userStore.user = user;
  const routers = permsToRouter(user.permKeys);
  routers.forEach(routerData => {
    router.addRoute('layout', routerData);
  });
  await router.replace({name: 'layout'})
  uiStore.showNotice()
  oauthLoading.value = false;
  bindLoading.value = false;
}


function submitRegister() {

  if (!registerForm.email) {
    ElMessage({
      message: t('emptyEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (registerForm.email.length < settingStore.settings.minEmailPrefix) {
    ElMessage({
      message: t('minEmailPrefix', {msg: settingStore.settings.minEmailPrefix}),
      type: 'error',
      plain: true,
    })
    return
  }

  if (!isEmail(registerForm.email + suffix.value)) {
    ElMessage({
      message: t('notEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (!registerForm.password) {
    ElMessage({
      message: t('emptyPwdMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (registerForm.password.length < 6) {
    ElMessage({
      message: t('pwdLengthMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (registerForm.password !== registerForm.confirmPassword) {

    ElMessage({
      message: t('confirmPwdFailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (settingStore.settings.regKey === 0) {

    if (!registerForm.code) {

      ElMessage({
        message: t('emptyRegKeyMsg'),
        type: 'error',
        plain: true,
      })
      return
    }

  }

  if (!verifyToken && (settingStore.settings.registerVerify === 0 || (settingStore.settings.registerVerify === 2 && settingStore.settings.regVerifyOpen))) {
    if (!verifyShow.value) {
      verifyShow.value = true
      nextTick(() => {
        if (!turnstileId) {
          try {
            turnstileId = window.turnstile.render('.register-turnstile')
          } catch (e) {
            botJsError.value = true
            // 人机验证 JS 加载失败
          }
        } else {
          window.turnstile.reset('.register-turnstile')
        }
      })
    } else if (!botJsError.value) {
      ElMessage({
        message: t('botVerifyMsg'),
        type: "error",
        plain: true
      })
    }
    return;
  }

  registerLoading.value = true

  const form = {
    email: registerForm.email + suffix.value,
    password: registerForm.password,
    token: verifyToken,
    code: registerForm.code
  }

  register(form).then(({regVerifyOpen}) => {
    show.value = 'login'
    registerForm.email = ''
    registerForm.password = ''
    registerForm.confirmPassword = ''
    registerForm.code = ''
    registerLoading.value = false
    verifyToken = ''
    settingStore.settings.regVerifyOpen = regVerifyOpen
    verifyShow.value = false
    ElMessage({
      message: t('regSuccessMsg'),
      type: 'success',
      plain: true,
    })
  }).catch(res => {

    registerLoading.value = false

    if (res.code === 400) {
      verifyToken = ''
      settingStore.settings.regVerifyOpen = true
      if (turnstileId) {
        window.turnstile.reset(turnstileId)
      } else {
        nextTick(() => {
          turnstileId = window.turnstile.render('.register-turnstile')
        })
      }
      verifyShow.value = true

    }
  });
}

</script>


<style>
.el-select-dropdown__item {
  padding: 0 15px;
}

.no-autofill-pwd {
  .el-input__inner {
    -webkit-text-security: disc !important;
  }
}
</style>

<style lang="scss" scoped>

#login-box {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow-y: auto;
}

.form-wrapper {
  width: 100%;
  max-width: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  width: 100%;
  background: var(--el-bg-color);
  padding: 48px 40px;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--el-border-color-lighter);
  
  @media (max-width: 767px) {
    padding: 32px 24px;
    box-shadow: none;
    border: none;
  }

  .logo-section {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
    
    .logo-icon {
      color: #10a37f;
    }
  }

  .form-title {
    font-size: 32px;
    font-weight: 600;
    text-align: center;
    margin: 0 0 8px 0;
    color: var(--el-text-color-primary);
    line-height: 1.2;
  }

  .form-desc {
    font-size: 16px;
    text-align: center;
    margin: 0 0 32px 0;
    color: var(--el-text-color-secondary);
    font-weight: 400;
  }

  .el-input {
    height: 52px;
    width: 100%;
    margin-bottom: 16px;
    
    :deep(.el-input__wrapper) {
      border-radius: 8px;
      background: var(--el-fill-color-blank);
      box-shadow: 0 0 0 1px var(--el-border-color) inset;
      padding: 0 16px;
      transition: all 0.2s;
      
      &:hover {
        box-shadow: 0 0 0 1px var(--el-color-primary) inset;
      }
      
      &.is-focus {
        box-shadow: 0 0 0 2px var(--el-color-primary) inset;
      }
    }

    :deep(.el-input__inner) {
      height: 50px;
      font-size: 16px;
      line-height: 50px;
    }
  }

  .email-input :deep(.el-input__wrapper) {
    border-radius: 8px 0 0 8px;
  }

  .btn {
    height: 52px;
    width: 100%;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 0;
    background: #10a37f;
    border-color: #10a37f;
    transition: all 0.2s;
    
    &:hover {
      background: #0d8c6f;
      border-color: #0d8c6f;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(16, 163, 127, 0.3);
    }
    
    &:active {
      transform: translateY(0);
    }
  }

  .switch {
    margin-top: 24px;
    text-align: center;
    font-size: 14px;
    color: var(--el-text-color-secondary);

    span {
      color: #10a37f;
      cursor: pointer;
      font-weight: 500;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

:deep(.el-select-dropdown__item) {
  padding: 0 10px;
}

:deep(.bind-dialog) {
  width: 400px !important;
  border-radius: 12px;
  
  @media (max-width: 440px) {
    width: calc(100% - 40px) !important;
    margin-right: 20px !important;
    margin-left: 20px !important;
  }
}

.bind-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
}

.setting-icon {
  position: relative;
  top: 6px;
}

.github {
  position: fixed;
  width: 44px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: var(--el-bg-color);
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  border: 1px solid var(--el-border-color-lighter);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
}

:deep(.el-input-group__append) {
  padding: 0 !important;
  padding-left: 12px !important;
  padding-right: 8px !important;
  background: var(--el-fill-color-blank);
  border-radius: 0 8px 8px 0;
  border-left: 1px solid var(--el-border-color);
}

:deep(.el-button+.el-button) {
  margin: 0;
  margin-top: 12px;
}

.register-turnstile {
  margin-bottom: 18px;
}

.select {
  position: absolute;
  right: 30px;
  width: 100px;
  opacity: 0;
  pointer-events: none;
}

.custom-style {
  margin-bottom: 10px;
}

.custom-style .el-segmented {
  --el-border-radius-base: 8px;
  width: 180px;
}

</style>
