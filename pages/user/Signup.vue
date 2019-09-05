<template>
  <signup-form @success="successSignup" @failed="failedSignUp"></signup-form>
</template>
<script>
import SignupForm from '../../components/SignupForm.vue'
export default {
  components: {
    SignupForm
  },
  methods: {
    successSignup ( data ) {
      this.$store.dispatch('snackbar/setMessage', 'ユーザーの作成に成功しました')
      this.$store.dispatch('snackbar/snackOn')
      this.$router.push({path: '/user/login'})
    },
    failedSignup ( data ) {
      if (data == 'any is blank') {
        this.$store.dispatch('snackbar/setMessage', '必要事項を埋めてください')
        this.$store.dispatch('snackbar/snackOn')
      }

      if( data == 'password differs from confirm') {
        this.$store.dispatch('snackbar/setMessage', 'パスワードと確認パスワードが異なります')
        this.$store.dispatch('snackbar/snackOn')
      }
    },
  }
}
</script>