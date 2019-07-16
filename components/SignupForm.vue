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
              アカウントを作成する
            </v-card-title>

            <v-divider></v-divider>
            <v-text-field
              v-model="username"
              label="E-mail Address"
              required
            >
            </v-text-field>
            <v-text-field
              :append-icon="visible1 ? 'visibility' : 'visibility_off'"
              :rules="[rules.required, rules.min]"
              :type="visible1 ? 'text' : 'password'"
              name="input-10-2"
              label="Password"
              hint="At least 8 characters"
              v-model="password"
              @click:append="visible1 = !visible1"
            ></v-text-field>
            <v-text-field
              :append-icon="visible2 ? 'visibility' : 'visibility_off'"
              :rules="[rules.required, rules.confirmMatch]"
              :type="visible2 ? 'text' : 'password'"
              name="input-10-2"
              label="Confirm password"
              v-model="confirm_password"
              @click:append="visible2 = !visible2"
            ></v-text-field>
            <v-layout
              align-center
              justify-center
            >
              <v-btn 
                outline
                color="primary"
                @click="signupWithEmail"
              >
                Create Account
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
      password: '',
      confirm_password: '',
      visible1: false,
      visible2: false,
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
        confirmMatch: v => v == this.password || 'Unmatch password'
      }
    }
  },
  methods: {
    signupWithEmail () {
      if (this.username === '' || this.password === '' || this.confirm_password === '') {
        return
      }
      if ( this.password != this.confirm_password ) {
        return
      }

      firebase.auth().createUserWithEmailAndPassword(this.username, this.password)
        .then(data => {
          this.$emit('SignupFormEvent', 0, data);
        }).catch(function (error) {
          this.username = ''
          this.password = ''
          this.confirm_password = ''
          this.$emit('SignupFormEvent', -1, error);
        })
    }
  }
}
</script>