<template>
  <login-form @success="LoginSuccess" @failed="LoginFailed"></login-form>
</template>
<script>
import LoginForm from '../../components/LoginForm.vue'
import firebase from '../../plugins/firebase.js'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    LoginForm
  },
  middleware: 'must-not-be-authenticated',
  computed: {
    ...mapGetters("auth", [
      "fireid",
    ])
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

      // ここでユーザー情報を取得する
      return firebase.firestore().collection('users').doc(this.fireid)
        .get()
        .then(doc => {
          if (doc.exists) {
            let user_infos = doc.data()
            this.setName(user_infos.name)
            this.setProfileImage(user_infos.profileImage)
            this.setMessage('ログインに成功しました')
            this.snackOn()
            // rootページに遷移 
            this.$router.push({path: '/'})
          } else {
              // doc.data() will be undefined in this case
              this.setMessage('エラーが発生しました')
              this.snackOn()
              return
          }
        })
    },
    LoginFailed (data) {
      // dataにサインイン失敗時のエラー内容が入っている
      this.setMessage('エラーが発生しました')
      this.snackOn()
      this.$router.push({path: '/user/login'})
    }
  }
}
</script>