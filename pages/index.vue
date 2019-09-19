<template>
  <v-container grid-list-md text-xs-center>
    <v-layout justify-center align-center>
      <v-flex xs12>
        <v-progress-circular v-show="loading" :size="70" :width="7" indeterminate color="purple"></v-progress-circular>
        <v-jumbotron :src="this.topImageUrl" dark height="1000px" v-show="!loading">
          <v-container fill-height fluid>
            <v-layout align-content-center fill-height wrap>
              <v-flex text-xs-center xs12>
                <span class="titleMessage">気になるキーワードで検索して友達と会話を楽しもう</span>
                <v-text-field
                  append-icon="search"
                  :append-icon-cb="jumpToThreadPage"
                  label="話したいトピックを入力"
                  solo-inverted
                  flat
                  v-model="searchKeyword"
                  light
                  @keyup.enter="submitSearchKeyword"
                  @keypress="setCanSubmit"
                ></v-text-field>
                <div class="trendArea-all">
                  <span class="trendarea-title">
                    最新検索キーワード
                    <br />
                  </span>
                  <v-divider></v-divider>
                  <div
                    class="trendarea-keyword"
                    v-on:click="jumpToThreadPage(item.name)"
                    v-for="(item,index) in trendThreadref"
                    :key="index"
                  >
                    <span class="trendKeyword">
                      {{item.name}}
                      <br />
                    </span>
                  </div>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-jumbotron>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from "../plugins/firebase.js";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      searchKeyword: "",
      topImageUrl: "",
      canSubmit: false,
      gradient: "to top right, rgba(63,81,181, .7), rgba(25,32,72, .7)",
      loading: true,
      trendThreadref: []
    };
  },
  created() {
    // top画像をストレージから取得
    firebase.storage().ref().child("public/plane.png").getDownloadURL()
      .then(url => {
        this.topImageUrl = url;
        this.loading = false;
      })
      .catch((error) => {
        this.setMessage('top画像を取得できませんでした')
        this.snackOn()
      })
    // 最新更新スレッド上位６つを取得（スレッドが６つに満たない場合は存在するスレッドのみ取得）
    firebase.firestore().collection("chat-room").orderBy("updated", "esc").limit(6).get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          // doc.data() is never undefined for query doc snapshots
          this.trendThreadref.unshift({
            name: doc.id
          });
        });
      })
      .catch((error) => {
        this.setMessage('最新スレッドが取得できませんでした')
        this.snackOn()
      })
  },
  methods: {
    ...mapActions("contents", ["setTopic"]),
    ...mapActions("snackbar", ["setMessage"]),
    ...mapActions("snackbar", ["snackOn"]),
    jumpToThreadPage(Keyword) {
      // ストアに検索キーワードをセットしてスレッドページに移動
      this.setTopic(Keyword);
      this.searchKeyword = "";
      this.$router.push({ path: "/thread/" });
    },
    submitSearchKeyword() {
      if (!this.canSubmit) {
        return;
      }
      if (this.searchKeyword === "") {
        return;
      }
      this.canSubmit = false;
      this.jumpToThreadPage(this.searchKeyword);
    },
    setCanSubmit() {
      this.canSubmit = true;
    }
  }
};
</script>

<style scoped>
.titleMessage {
  color: rgb(0, 0, 0);
  font-size: 300%;
}
.trendArea-all {
  margin: 5px;
  background-color: rgba(0, 0, 0, 0.2);
}
.trendarea-title {
  color: rgb(0, 0, 255);
  font-weight: bold;
  font-size: 200%;
}
.trendarea-keyword {
  color: rgb(0, 0, 120);
  font-size: 120%;
}
.trendarea-keyword:hover {
  color: rgb(0, 0, 120);
  font-size: 120%;
  font-weight: bold;
  background-color: rgba(0, 0, 255, 0.1);
  cursor: pointer;
}
.topMenu {
  color: rgb(0, 0, 0);
  font-size: 200%;
}
.topMenu:hover {
  color: rgb(0, 0, 255);
  font-size: 200%;
}
</style>