<template>
<v-container grid-list-md >
  <v-layout row>
    <v-flex sm6 offset-sm3 >

      <v-card color="grey darken-4" flat>

        <v-flex xs8>
          <v-text-field
            id="testing"
            label="名前"
            :value="this.$store.getters['auth/name']"
            disabled
          >
          </v-text-field>
        </v-flex>

        <v-container fluid>
          <v-layout row>
            <v-flex xs12>
              <v-text-field
                label="本文"
                textarea
                v-model="sendMessage"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
        
        <v-flex offset-xs8>
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
        </v-flex>

      </v-card>

      <v-card color="grey darken-4" flat>
        <v-list two-line >
          <template v-for="(item, index) in threadData">
            <!-- <v-subheader v-if="item.author" :key="`A-${index}`">{{ item.author }}</v-subheader> -->
            <v-list-tile :key="`C-${index}`" avatar>
              <v-list-tile-avatar>
                <img :src="item.profileImage">
                <!-- <img src="https:firebasestorage.googleapis.com/v0/b/sample-project-987bf.appspot.com/o/userProfile%2FbPiThri3a8WWecId5IyjU2TCa3B3%2Flogin.PNG?alt=media&token=3c2e8024-d206-488c-b8b5-7d2fe76aadc4"> -->
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
    }
  },
  created () {
    firebase.firestore().collection('chat-room').doc('public')
      .collection('messages').orderBy('timestamp', 'asc').onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.threadData.unshift({
              author: doc.data().author,
              authorid: doc.data().authorid,
              profileImage: doc.data().profileImage,
              data: doc.data().message,
              timestamp: doc.data().timestamp
          })
        })
      })
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
  }
}
</script>