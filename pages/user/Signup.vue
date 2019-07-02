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
        this.$store.dispatch('snackbar/setMessage', 'エラーが発生しました')
        this.$store.dispatch('snackbar/snackOn')
        this.$router.push({path: '/user/signup'})
      }
      this.$store.dispatch('snackbar/setMessage', 'ユーザーを作成しました')
      this.$store.dispatch('snackbar/snackOn')
      this.$router.push({path: '/user/login'})
    }
  }
}
</script>