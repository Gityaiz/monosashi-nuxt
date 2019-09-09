<template>
  <login-form @success="LoginSuccess" @failed="LoginFailed"></login-form>
</template>
<script>
import LoginForm from '../../components/LoginForm.vue'
import firebase from '../../plugins/firebase.js'

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
  mounted: {
    ...mapActions("auth", [
      "fireid",
    ]),
  },
  methods: {
    ...mapActions("auth", ["setName"]),
    ...mapActions("auth", ["setEmail"]),
    ...mapActions("auth", ["setFireID"]),
    ...mapActions("auth", ["setProfileImage"]),
    ...mapActions("snackbar", ["setMessage"]),
    ...mapActions("snackbar", ["snackOn"]),
    LoginSuccess (data) {
      // storeにログイン情報をセット
      this.setName('名無し')
      this.setEmail(data.user.email)
      this.setFireID(data.user.uid)
      this.setMessage('ログインに成功しました')
      this.snackOn()

      // ここでユーザー情報を取得する
      return firebase.firestore().collection('users').doc(this.fireid)
        .get()
        .then(doc => {
          if (doc.exists) {
              this.user_infos = doc.data()
          } else {
              // doc.data() will be undefined in this case
              this.setMessage('エラーが発生しました')
              this.snackOn()
              return
          }
        })
      this.setName(this.user_infos.name)
      this.setProfileImage(this.user_infos.profileImage)

      // rootページに遷移 
      this.$router.push({path: '/'})
    },
    LoginFailed (data) {
      this.setMessage('エラーが発生しました')
      this.snackOn()
      this.$router.push({path: '/user/login'})
    }
  }
}
</script>