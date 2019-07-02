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
              :append-icon="visible ? 'visibility' : 'visibility_off'"
              :type="visible ? 'text' : 'password'"
              name="input-10-2"
              label="Password"
              v-model="password"
              @click:append="visible = !visible"
            ></v-text-field>
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
            <div align="right">
            <router-link to="/user/signup" class="no-decorate-font">アカウントをお持ちではないですか？</router-link>
            </div>
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
      password: '',
      visible: false
    }

  },
  methods: {
    loginAction () {
      if (this.username === '' || this.password === '') {
        return
      }
      firebase.auth().signInWithEmailAndPassword(this.username, this.password)
        .then((data) => {
          this.$emit('LoginFormEvent', 0, data);
        }).catch((error) => {
          this.$emit('LoginFormEvent', -1, error.code);
        })
    }
  }
}
</script>
<style>
.no-decorate-font {
  color: white;
  text-decoration : underline;
}

.no-decorate-font:hover {
  color: rgb(84, 177, 243);
  text-decoration : underline;
}

</style>