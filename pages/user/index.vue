<template>
<v-app>
  <v-btn @click="logout">ログアウト</v-btn>
  <p>from /user/index.vue</p>
</v-app>
</template>
<script>
import firebase from '~/plugins/firebase.js'
export default {
  middleware: 'must-be-authenticated',
  methods: {
    logout () {
      firebase.auth().signOut()
        .then(data => {
          this.$store.dispatch('setLogOut')
          this.$store.dispatch('setEmail', '')
          this.$router.push({path: '/'})
          console.log("ログアウトしました")
        })
    }
  }
}
</script>