<template>
  <signup-form v-on:SignupFormEvent="signupEvent"></signup-form>
</template>
<script>
import SignupForm from '../../components/SignupForm.vue'
export default {
  components: {
    SignupForm
  },
  methods: {
    signupEvent (resultCode, data) {
      if (resultCode < 0) {
        console.log("ユーザーの作成に失敗しました")
        this.$router.push({path: '/user/signup'})
      }
      console.log("data:",data)
      this.$router.push({path: '/user/login'})
    }
  }
}
</script>