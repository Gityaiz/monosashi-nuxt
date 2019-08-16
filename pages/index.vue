<template>
	<v-app>
		<v-container grid-list-md text-xs-center>
			<v-layout justify-center align-center>
				<v-flex xs12>
						<v-jumbotron
							:src="this.topImageUrl"
							dark
							height=1000px
						>
							<v-container fill-height fluid>
								<v-layout align-content-center fill-height wrap>
								<!--
									<v-flex xs1 offset-xs5>
										<nuxt-link to="/" class="topMenu">Home</nuxt-link>
									</v-flex>
									<v-flex xs1>
										<nuxt-link to="/user" class="topMenu">User</nuxt-link>
									</v-flex>
									-->
									<v-flex text-xs-center xs12>
										<span class="titleMessage">気になるキーワードで検索して友達と会話を楽しもう</span>
										<v-text-field
											append-icon="search"
											:append-icon-cb="search"
											label="話したいトピックを入力"
											solo-inverted
											flat
											v-model='searchKeyword'
											light
											@keyup.enter="submitSearchKeyword"
											@keypress="setCanSubmit"
										></v-text-field>

									</v-flex>
								</v-layout>
							</v-container>
						</v-jumbotron>
				</v-flex>
			</v-layout>
		</v-container>
	</v-app>
</template>

<script>
import firebase from '~/plugins/firebase.js'

export default {
  data () {
    return {
      searchKeyword: '',
      topImageUrl: '',
			canSubmit: false,
      gradient: 'to top right, rgba(63,81,181, .7), rgba(25,32,72, .7)',
    }
  },
  created () {
    firebase.storage().ref().child('public/plane.png').getDownloadURL()
      .then ((url) => {
        this.topImageUrl = url
      })
  },
  methods: {
    search () {
      if (this.searchKeyword === '') {
        return
      }
			this.$store.dispatch('contents/setTopic', this.searchKeyword)
			this.searchKeyword = ''
			this.$router.push({path: '/thread/'})
    },
		submitSearchKeyword () {
			if(!this.canSubmit) {
				return
			}
			this.canSubmit = false
			this.search()
		},
		setCanSubmit () {
			this.canSubmit = true
		}
	}
}
</script>

<style scoped>
.titleMessage {
	color: rgb(0,0,0);
	font-size: 300%;
}
.topMenu {
	color: rgb(0,0,0);
	font-size: 200%
}
.topMenu:hover {
	color: rgb(0,0,255);
	font-size: 200%
}
</style>