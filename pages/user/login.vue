<template>
  <login-form v-on:LoginFormEvent="LoginEvent"></login-form>
</template>
<script>
import LoginForm from '../../components/LoginForm.vue'
export default {
  components: {
    LoginForm
  },
  middleware: 'must-not-be-authenticated',
  methods: {
    LoginEvent (resultCode, data) {
      if (resultCode < 0) {
        console.log("ログインに失敗しました")
        this.$router.push({path: '/user/login'})
      }
      // storeにログイン情報をセット
      console.log(resultCode, data)
      this.$store.dispatch('auth/setEmail', data.user.email)
      this.$store.dispatch('auth/setFireID', data.user.uid)
      
      // rootページに遷移 
      this.$router.push({path: '/'})
    }
  }
}
</script>