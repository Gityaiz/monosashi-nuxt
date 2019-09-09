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
    ...mapActions("snackbar", ["setMessage"]),
    ...mapActions("snackbar", ["snackOn"]),
    successSignup ( data ) {
      this.setMessag('ユーザーの作成に成功しました')
      this.snackOn()
      this.$router.push({path: '/user/login'})
    },
    failedSignup ( data ) {
      if (data == 'any is blank') {
        this.setMessage('必要事項を埋めてください')
        this.snackOn()
      }

      if( data == 'password differs from confirm') {
        this.setMessage('パスワードと確認パスワードが異なります')
        this.snackOn()
      }
    },
  }
}
</script>