<template>
  <login-form v-on:LoginFormEvent="LoginEvent"></login-form>
</template>
<script>
import LoginForm from '../../components/LoginForm.vue'
import firebase from '~/plugins/firebase.js'

export default {
  components: {
    LoginForm
  },
  data () {
    return {
      user_infos: '',
    }
  },
  middleware: 'must-not-be-authenticated',
  methods: {
    async LoginEvent (resultCode, data) {
      if (resultCode < 0) {
        this.$store.dispatch('snackbar/setMessage', 'エラーが発生しました')
        this.$store.dispatch('snackbar/snackOn')
        this.$router.push({path: '/user/login'})
      }
      // storeにログイン情報をセット
      this.$store.dispatch('auth/setName', '名無し')
      this.$store.dispatch('auth/setEmail', data.user.email)
      this.$store.dispatch('auth/setFireID', data.user.uid)
      this.$store.dispatch('snackbar/setMessage', 'ログインに成功しました')
      this.$store.dispatch('snackbar/snackOn')

      // ここでユーザー情報を取得する
      await firebase.firestore().collection('users').doc(this.$store.state.auth.fireid)
        .get()
        .then(doc => {
          if (doc.exists) {
              this.user_infos = doc.data()
          } else {
              // doc.data() will be undefined in this case
              this.$store.dispatch('snackbar/setMessage', 'エラーが発生しました')
              this.$store.dispatch('snackbar/snackOn')
              return
          }
        })
      
      this.$store.dispatch('auth/setName', this.user_infos.name)
      this.$store.dispatch('auth/setProfileImage', this.user_infos.profileImage)

      // rootページに遷移 
      this.$router.push({path: '/'})
    }
  }
}
</script>