<template>
<v-container grid-list-md >
  <v-layout row　wrap>
    <v-flex xs12 >

      <v-alert :value="true" outline :color="alertColor" :icon="alertIcon">
        {{ alertText}}
      </v-alert>

      <v-card color="grey darken-4" flat>
        <v-flex xs12>
          <v-text-field
            id="testing"
            label="名前"
            :value="name"
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
                @keyup.enter="submitSearchKeyword"
								@keypress="setCanSubmit"
              ></v-text-field>
            </v-flex>
          </v-layout>
        
          <v-card-actions>
            <v-btn 
              outline
              color="primary"
              round
              @click="addComment(sendMessage)"
            >
              投稿
            </v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
      
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
import firebase from '../../plugins/firebase.js'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      threadData: [],
      sendMessage: '',
      active: null,
      searchKeyword: '',
      alertColor: '', // color の取る値   success => 緑  info => 青  warning => 黄色  error => 赤 (その他色)
      alertIcon: '',  // icon の取る値   check_circle => レ点    info => i  priority_high => !〇  warning => !△
      alertText: '',
      openedTopic:'',
      canSubmit: false,
    }
  },
  computed: {
    ...mapGetters('auth', [
      'name',
      'email', 
      'fireid',
      'profileImage'
    ]),
    ...mapGetters('contents', [
      'topic', 
    ]),
  },
  mounted () {
    this.searchThread(this.topic)
  },
  methods: {
    ...mapActions("snackbar", ["setMessage"]),
    ...mapActions("snackbar", ["snackOn"]),
    addComment ( message ) {
      // 送信時のEnterが入ってしまうためnullとならないので改行を削除する
      message = message.replace(/\r?\n/g, '');
      if ( message === '') {
        return
      }

      if (this.fireid === '') {
        this.sendMessage = ''
        return
      }
      return firebase.firestore().collection('chat-room').doc(this.openedTopic).collection('messages').doc().set({
        author: this.name,
        authorid: this.fireid,
        profileImage: this.profileImage,
        message: this.sendMessage,
        timestamp: new Date()
      })
      .then(() => {
        // スレッドの最終更新日時をアップデート
        firebase.firestore().collection('chat-room').doc(this.openedTopic).set({
          updated: new Date(),
        }, {merge: true})
          .then(() => {
            // 投稿メッセージは空にする    
            this.sendMessage = ''     
          })
          .catch(() => {
            // スレッドの最終更新日時が更新されないだけなため、特にエラーは処理しない
          })
      })
      .catch(() => {
        // リファレンスを見る限りここにはいってこない
        this.setMessage('コメント投稿に失敗しました')
        this.snackOn()
      })
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
      this.openedTopic = docName
      this.alertColor = 'info'
      this.alertIcon = 'info'
      this.alertText = docName + 'ルームにようこそ！'
    },
    searchThread (keyword) {
      if (keyword === '') {
        return
      }
      return firebase.firestore().collection('chat-room').doc(keyword).get()
        .then(documentSnapshot => {
          if (!documentSnapshot.exists) {
            // 未ログイン状態の場合スレッドの作成は認めない
            if ( this.fireid === '') {
              this.setMessage('新しいスレッドの作成はログイン済みの状態で行なってください')
              this.snackOn()
              this.$router.push({path: '/'})
            }
            // スレッドの最終更新日時をアップデート
            firebase.firestore().collection('chat-room').doc(keyword).set({
              created: new Date(),
              updated: new Date(),
            })
            firebase.firestore().collection('chat-room').doc(keyword).collection('messages').doc().set({
              author: this.name,
              authorid: this.fireid,
              profileImage: this.profileImage,
              message: 'スレッドを作成しました',
              timestamp: new Date()
            })

            this.setMessage('新たにスレッドを作成しました')
            this.snackOn()
            this.openThread(keyword)
          } else {
            // 未ログイン状態であってもスレッドメッセージの読み込みは許可する（特に条件分岐しない）
            this.openThread(keyword)
          }
      })
      .catch(() => {
        this.setMessage('スレッドが見つかりませんでした')
        this.snackOn()
      })
    },
    submitSearchKeyword () {
			if(!this.canSubmit) {
				return
			}
      this.canSubmit = false
      this.addComment()
		},
		setCanSubmit () {
			this.canSubmit = true
		}
  }
}
</script>