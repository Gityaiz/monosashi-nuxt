<template>
<v-container grid-list-md >
  <v-layout row>
    <v-flex xs12 >


      <v-text-field
        append-icon="search"
        :append-icon-cb="search"
        label="フリーワードで移動先を選択する"
        solo-inverted
        class="mx-3"
        flat
        v-model='searchKeyword'
      ></v-text-field>

      <v-card color="grey darken-4" flat>
        <v-flex xs8>
          <v-text-field
            id="testing"
            label="名前"
            :value="$store.state.auth.name"
            disabled
          >
          </v-text-field>
        </v-flex>

        <v-container fluid>
          <v-layout row>
            <v-flex xs12>
              <v-text-field
                label="メッセージを入力しよう"
                textarea
                v-model="sendMessage"
              ></v-text-field>
            </v-flex>
          </v-layout>
        
          <v-card-actions>
            <v-btn 
              outline
              color="primary"
              round
              @click="addComment()"
            >
              投稿
            </v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
      <v-alert :value="true" outline :color="alertColor" :icon="alertIcon">
        {{ alertText}}
      </v-alert>
      <v-card color="grey darken-4" flat>
        <v-list two-line >
          <template v-for="(item, index) in threadData">
            <v-list-tile :key="`C-${index}`" avatar>
              <v-list-tile-avatar>
                <img :src="item.profileImage">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="item.author"></v-list-tile-title>
                <v-list-tile-sub-title v-html="item.data"></v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider :key="`B-${index}`"></v-divider>
          </template>
        </v-list>
      </v-card>

    </v-flex>
  </v-layout>
  </v-container>
</template>

<script>
import firebase from '~/plugins/firebase.js'

export default {
  data () {
    return {
      threadData: [],
      sendMessage: '',
      active: null,
      searchKeyword: '',
      alertColor: '', // color の取る値   success => 緑  info => 青  warning => 黄色  error => 赤 (その他色)
      alertIcon: '',  // icon の取る値   check_circle => レ点    info => i  priority_high => !〇  warning => !△
      alertText: ''
    }
  },
  created () {
    this.initInfo ()
    this.openThread ('public')
  },
  methods: {
    addComment () {
      if (this.sendMessage === '') {
        return
      }
      
      firebase.firestore().collection('chat-room').doc('public')
        .collection('messages').doc().set({
          author: this.$store.state.auth.name,
          authorid: this.$store.state.auth.fireid,
          profileImage: this.$store.state.auth.profileImageUrl,
          message: this.sendMessage,
          timestamp: new Date()
        })  

      // 投稿メッセージは空にする    
      this.sendMessage = ''
    },
    initInfo () {
      this.threadData = []
      this.sendMessage = ''
      this.active = null
    },
    openThread (docName) {
      this.initInfo()
      firebase.firestore().collection('chat-room').doc(docName)
        .collection('messages').orderBy('timestamp', 'asc').onSnapshot(querySnapshot => {
          querySnapshot.docChanges().forEach(change => {
            console.log('doc:', change.type)
            if (change.type ==='added') {
              this.threadData.unshift({
                  author: change.doc.data().author,
                  authorid: change.doc.data().authorid,
                  profileImage: change.doc.data().profileImage,
                  data: change.doc.data().message,
                  timestamp: change.doc.data().timestamp
              })
            }
          })
        })
      this.alertColor = 'info'
      this.alertIcon = 'info'
      this.alertText = docName + 'にアクセスしています'
    },
    search () {
      if (this.searchKeyword === '') {
        return
      }
      firebase.firestore().collection('chat-room').doc(this.searchKeyword).get()
        .then(doc => {
          if (!doc.exists) {
            firebase.firestore().collection('chat-room').doc(this.searchKeyword).collection('messages').doc().set({
              author: this.$store.state.auth.name,
              authorid: this.$store.state.auth.fireid,
              profileImage: this.$store.state.auth.profileImageUrl,
              message: 'スレッドを作成しました',
              timestamp: new Date()
            })
            this.$store.dispatch('snackbar/setMessage', '新たにスレッドを作成しました')
            this.$store.dispatch('snackbar/snackOn')
            this.openThread(this.searchKeyword)
            this.searchKeyword = ''
            return
          } else {
            this.openThread(this.searchKeyword)
          }
      })
    }
  }
}
</script>