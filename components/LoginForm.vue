<template>
  <v-layout
    justify-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
      <v-card
        color="blue-grey darken-2"
      >
        <v-layout column wrap>
          <v-flex pt-3 pb-3 pl-5 pr-5 ma-3>
            <v-card-title class="headline">
              ログイン画面
            </v-card-title>

            <v-divider></v-divider>
            <v-text-field
              v-model="username"
              label="E-mail Address"
              required
            >
            </v-text-field>
            <v-text-field
              v-model="password"
              label="Password"
              required
            >
            </v-text-field>
            <v-layout
              align-center
              justify-center
            >
              <v-btn 
                outline
                color="primary"
                @click="loginAction"
              >
                login
              </v-btn>
            </v-layout>

          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import firebase from '~/plugins/firebase.js'
export default {
  data () {
    return {
      username: '',
      password: ''
    }

  },
  methods: {
    loginAction () {
      if (this.username === '' || this.password === '') {
        return
      }
      firebase.auth().signInWithEmailAndPassword(this.username, this.password)
        .then((data) => {
          console.log('success email login');
        }).catch((error) => {
          console.log(error.code);
          this.$emit('LoginFormEvent', error.code);
        })
    }
  }
}
</script>