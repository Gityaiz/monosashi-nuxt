<template>
	<div>
		<v-jumbotron
			:src="this.topImageUrl"
			dark
		>
			<v-container fill-height>
				<v-layout align-center>
					<v-flex text-xs-center>
						<h1 class="titleMessage">フリーチャット</h1>
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
  </div>
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
	font-size: 300%;
	color: rgb(0,0,0);
}

</style>