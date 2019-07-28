<template>
<v-app>
  <v-btn @click="getStatus">ユーザ情報の表示</v-btn>
  <v-divider></v-divider>
  <v-layout wrap v-if="isVisible">
    <v-flex
      shrink
      pa-1
    >
      <v-card
        dark
      >
        <label class="profile_graph">
          プロフィール画像を選択してください
          <input type="file" @change="selectFile"/>
        </label>
      </v-card>
    </v-flex>
    <v-flex
      pa-1
    >
      <v-btn @click="updateStatus(), updateProfileGraph()" block>ユーザ情報を更新する</v-btn>    
      <v-card
        dark
      >
        <v-card-text>
          <div display=flex;>
          <v-subheader class="pa-0">ユーザー名</v-subheader>
          <v-text-field
            v-model="update.name"
            :label="user_infos.name"
          ></v-text-field>
          </div>
        </v-card-text>
      </v-card> 
    </v-flex>
  </v-layout>
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
      },
      profileGraph: ''
    }
  },
  methods: {
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
      if (this.user_infos.name === this.update.name || this.update.name === '') {
        return
      }
      firebase.firestore().collection('users').doc(this.$store.state.auth.fireid)
        .update({
          name: this.update.name 
        }).then(data => {
          this.$store.dispatch('snackbar/setMessage', 'ユーザ名を更新しました')
          this.$store.dispatch('snackbar/snackOn')
        })
    },
    selectFile (e) {
      e.preventDefault();
      let files = e.target.files;
      this.profileGraph = files[0];
    },
    updateProfileGraph () {
      if ( this.profileGraph === '' ) {
        return
      }
      const uid = this.$store.state.auth.fireid
      const storepath = 'userProfile' + '/' + uid + '/' + this.profileGraph.name
      firebase.storage().ref().child(storepath).put(this.profileGraph)
        .then((snapshot) => {
            firebase.firestore().collection('users').doc(uid)
              .get().then((doc) => {
                  firebase.firestore().collection('users').doc(uid).set({
                    profileGraph: storepath
                  }, {merge: true})
                this.$store.dispatch('snackbar/setMessage', 'プロフィール画像を更新しました')
                this.$store.dispatch('snackbar/snackOn')
                this.$router.push({path: '/'})
              })
        })
    }
  }
}
</script>
<style lang="scss">

.profile_graph {
  input {
    display: none;
  }
}

.profile_graph {
  display: flex;
  width: 200px;
  height: 200px;
  padding: 20px;
  justify-content: center;
  align-items: center;
  border: solid 1px #888;
  cursor: pointer;
  cursor: hand;
} 

.profile_graph::after {
  content: '+';
  font-size: 1rem;
  color: #888;
  padding-left: 1rem;
}
</style>
