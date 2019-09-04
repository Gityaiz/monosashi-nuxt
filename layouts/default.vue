<template>
  <v-app dark>
    <v-toolbar :clipped-left="clipped" fixed app>
      <!-- <v-toolbar-side-icon @click="drawer = !drawer" /> -->
      <v-toolbar-title>
        <router-link to="/" class="toolbar-font">{{ title }}</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <router-link to="/user/login" v-if="email == ''" class="toolbar-font">ログイン</router-link>
      <v-menu
        bottom
        offset-y
        v-if="email != ''"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            text
            depressed
            class="toolbar-font"
          >{{ email }} </v-btn>
        </template>
        <v-list
          v-for="(item, i) in userItems"
          :key="i"
        >
          <v-list-tile @click="userMenu(item.title)">
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <router-link to='/user' v-else  class="toolbar-font">{{ email }} </router-link>
    </v-toolbar>
    <v-snackbar
      top
      v-model='snackbarVisible'
    >
      {{ this.message }}
    </v-snackbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import firebase from '~/plugins/firebase.js'
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters('auth', [
      'email', 
    ]),
    ...mapGetters('snackbar', [
      'message', 
      'status'
    ]),
    // snackbarが自動でfalseに設定するためセッタを用意して、明示的にdispatchからOffするようにする
    snackbarVisible: {
      get() {
        return this.isEnable
      },
      set() {
        return this.snackOff()
      }
    },
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      isSnackbar: false,
      items: [
        {
          icon: 'home',
          title: 'home',
          to: '/'
        },
        {
          icon: 'home',
          title: 'ユーザーページ',
          to: '/user'
        }
      ],
      userItems: [
        {
          title: 'ユーザーページ',
          link: '/users'
        },
        {
          title: 'ログアウト',
          link: ''
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'なんでもTalk！',
      methods: {
        moveToRoot () {
          this.$router.push({path: '/'})
        }
      }
    }
  },
  methods: {
    ...mapActions("auth", ["setLogOut"]),
    ...mapActions("snackbar", ["snackOn"]),
    ...mapActions("snackbar", ["snackOff"]),
    ...mapActions("snackbar", ["setMessage"]),

    userMenu (selectedMenu) {
      if (selectedMenu === 'ユーザーページ') {
        this.$router.push({path: '/user'})
      }

      if (selectedMenu === 'ログアウト') {
        firebase.auth().signOut()
          .then(data => {
            this.setLogOut()
            this.setMessage('ログアウトしました')
            this.snackOn()
            this.$router.push({path: '/'})
          })
      }
    }
  }
}
</script>
<style>
.toolbar-font {
  color: white;
  font-size: 150%;
  text-decoration: none;
  text-transform: none;
}

.userMenu-item {
  cursor: hand;
}
</style>