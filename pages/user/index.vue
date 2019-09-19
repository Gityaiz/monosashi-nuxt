<template>
  <div>
    <v-btn @click="getStatus">ユーザ情報の表示</v-btn>
    <v-divider></v-divider>
    <v-layout row wrap v-if="isVisible">
      <v-flex>
          <v-btn @click="updateStatus(), updateProfileImage()" block>ユーザ情報を更新する</v-btn>
          <v-layout column align-center>
            <v-avatar :tile="false" size="300px" color="grey lighten-4">
              <img :src="user_infos.profileImage" alt="avatar">
            </v-avatar>
            <label class="profile_graph">
            画像アップロード
            <input type="file" @change="selectFile"/>
          </label>
          </v-layout>
        <v-card dark>
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
  </div>
</template>

<script>
import firebase from '../../plugins/firebase.js'
import { mapGetters, mapActions } from 'vuex'
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
      profileImage: ''
    }
  },
  computed: {
    ...mapGetters("auth", [
      "fireid",
    ]),
  },
  methods: {
    ...mapActions("snackbar", ["setMessage"]),
    ...mapActions("snackbar", ["snackOn"]),
    ...mapActions("auth", ["setName"]),
    ...mapActions("auth", ["setProfileImage"]),
    getStatus () {
      if (this.isfirst) {
        return firebase.firestore().collection('users').doc(this.fireid)
          .get()
          .then(doc => {
            if (doc.exists) {
              this.user_infos = doc.data()
              this.isVisible = !this.isVisible
              this.isfirst = false
            } else {
              // doc.data() will be undefined in this case
              this.setMessage('エラーが発生しました')
              this.snackOn()
            }
        })
        .catch(() => {
          this.setMessage('ユーザー情報が取得できませんでした')
          this.snackOn()
        })
      } else {
        this.isVisible = !this.isVisible
      }
    },
    updateStatus () {
      if (this.user_infos.name === this.update.name || this.update.name === '') {
        return
      }
      firebase.firestore().collection('users').doc(this.fireid)
        .update({
          name: this.update.name 
<<<<<<< HEAD
        }).then(data => {
          this.setName(this.update.name)
          this.setMessage('ユーザ名を更新しました')
          this.snackOn()
=======
        })
        .then(data => {
          this.setName(this.update.name)
          this.setMessage('ユーザ名を更新しました')
          this.snackOn()
        })
        .catch(() => {
          this.setMessage('ユーザー情報の更新でエラーが発生しました')
          this.snackOn()
>>>>>>> for-master-deploy
        })
    },
    selectFile (e) {
      e.preventDefault();
      let files = e.target.files;
      this.profileImage = files[0];
    },
    updateProfileImage () {
      if ( this.profileImage === '' ) {
        return
      }

      const storepath = 'userProfile' + '/' + this.fireid + '/' + this.profileImage.name
      return firebase.storage().ref().child(storepath).put(this.profileImage)
        .then((snapshot) => {
          // 成功時の処理
          let imageUrl
          firebase.storage().ref().child(storepath).getDownloadURL().then((url) => {
            imageUrl = url
          })
            .then(() => {
              firebase.firestore().collection('users').doc(this.fireid).set({
                profileImage: imageUrl
              }, {merge: true})
            })
        })
        .then(() => {
          this.setProfileImage()
          this.setMessage('プロフィール画像を更新しました')
          this.snackOn()
          this.$router.push({path: '/'})
<<<<<<< HEAD
=======
        })
        .catch(() => {
          this.setMessage('プロフィール画像の更新中にエラーが発生しました')
          this.snackOn()
>>>>>>> for-master-deploy
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
  height: 20px;
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
