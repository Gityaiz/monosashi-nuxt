<template>
  <signup-form @success="SignupSuccess" @failed="SignupFailed"></signup-form>
</template>
<script>
import SignupForm from '../../components/SignupForm.vue'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    SignupForm
  },
  methods: {
    ...mapActions("snackbar", ["setMessage"]),
    ...mapActions("snackbar", ["snackOn"]),
    
    SignupSuccess ( data ) {
      this.setMessage('ユーザーの作成に成功しました')
      this.snackOn()
      this.$router.push({path: '/user/login'})
    },
    SignupFailed ( data ) {
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