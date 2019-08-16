<template>
  <v-app dark>
  <!--
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-tile
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
              <v-list-tile-title v-text="item.title" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    -->
    <v-toolbar
      :clipped-left="clipped"
      fixed
      app
    >
      <!-- <v-toolbar-side-icon @click="drawer = !drawer" /> -->
      <v-toolbar-title>
        <router-link to="/" class="toolbar-font">{{ title }}</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <router-link to="/user/login" v-if="this.$store.getters['auth/email'] == ''" class="toolbar-font">ログイン</router-link>
      <v-menu
        bottom
        offset-y
        v-if="!this.$store.getters['auth/email'] == ''"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            text
            depressed
            class="toolbar-font"
          >{{ $store.getters['auth/email'] }} </v-btn>
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
      <router-link to='/user' v-else  class="toolbar-font">{{ this.$store.getters['auth/email'] }} </router-link>
    </v-toolbar>
    <v-snackbar
      top
      v-model='snackbarVisible'
    >
      {{ this.$store.getters['snackbar/message'] }}
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
export default {
  computed: {
    // snackbarが自動でfalseに設定するためセッタを用意して、明示的にdispatchからOffするようにする
    snackbarVisible: {
      get() {
        return this.$store.state.snackbar.isEnable
      },
      set() {
        return this.$store.dispatch('snackbar/snackOff')
      }
    }
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
      title: 'もっとTalk！',
      methods: {
        moveToRoot () {
          this.$router.push({path: '/'})
        }
      }
    }
  },
  methods: {
    userMenu (selectedMenu) {
      if (selectedMenu === 'ユーザーページ') {
        this.$router.push({path: '/user'})
      }

      if (selectedMenu === 'ログアウト') {
        firebase.auth().signOut()
          .then(data => {
            this.$store.dispatch('auth/setLogOut')
            this.$store.dispatch('auth/setEmail', '')
            this.$store.dispatch('auth/setFireID', '')
            this.$store.dispatch('snackbar/setMessage', 'ログアウトしました')
            this.$store.dispatch('snackbar/snackOn')
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