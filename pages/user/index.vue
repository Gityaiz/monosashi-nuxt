<template>
<v-app>
  <v-btn @click="logout">ログアウト</v-btn>
  <v-btn @click="getStatus">ユーザ情報の表示</v-btn>
  <div v-if="isVisible">
    <v-card-text>
      <v-subheader class="pa-0">ユーザー名</v-subheader>
      <v-text-field
        v-model="update.name"
        :label="user_infos.name"
      ></v-text-field>
    </v-card-text>
    <v-btn @click="updateStatus">ユーザ情報を更新する</v-btn>
  </div>
</v-app>
</template>

<script>
import firebase from '~/plugins/firebase.js'
export default {
  middleware: 'must-be-authenticated',
  data () {
    return {
      user_infos: '',
      isVisible: false,
      isfirst: 'true',
      uid: '',
      update: {
        name: ''
      }
    }
  },
  methods: {
    logout () {
      firebase.auth().signOut()
        .then(data => {
          this.$store.dispatch('auth/setLogOut')
          this.$store.dispatch('auth/setEmail', '')
          this.$store.dispatch('auth/setFireID', '')
          this.$store.dispatch('snackbar/setMessage', 'ログアウトしました')
          this.$store.dispatch('snackbar/snackOn')
          this.$router.push({path: '/'})
        })
    },
    getStatus () {
      if (this.isfirst) {
        firebase.firestore().collection('users').doc(this.$store.state.auth.fireid)
          .get()
          .then(doc => {
            if (doc.exists) {
                this.user_infos = doc.data()
                this.isVisible = !this.isVisible
                this.isfirst = false
            } else {
                // doc.data() will be undefined in this case
                this.$store.dispatch('snackbar/setMessage', 'エラーが発生しました')
                this.$store.dispatch('snackbar/snackOn')
            }
        })
      } else {
        this.isVisible = !this.isVisible
      }
    },
    updateStatus () {
      if (this.user_infos.name === this.update.name || this.update.name === null) {
        return
      }
      firebase.firestore().collection('users').doc(this.$store.state.auth.fireid)
        .update({
          name: this.update.name 
        }).then(data => {
          this.$store.dispatch('snackbar/setMessage', 'ユーザ名を更新しました')
          this.$store.dispatch('snackbar/snackOn')
          this.$router.push({path: '/'})
        })
    }
  }
}
</script>
