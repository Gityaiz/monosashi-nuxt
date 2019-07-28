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
        this.$store.dispatch('snackbar/setMessage', 'エラーが発生しました')
        this.$store.dispatch('snackbar/snackOn')
        this.$router.push({path: '/user/login'})
      }
      // storeにログイン情報をセット
      this.$store.dispatch('auth/setEmail', data.user.email)
      this.$store.dispatch('auth/setFireID', data.user.uid)
      this.$store.dispatch('snackbar/setMessage', 'ログインに成功しました')
      this.$store.dispatch('snackbar/snackOn')
      // rootページに遷移 
      this.$router.push({path: '/'})
    }
  }
}
</script>