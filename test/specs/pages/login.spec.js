import Vue from 'vue'
import Vuetify from 'vuetify'
import { shallowMount } from '@vue/test-utils'
import Login from '@/pages/user/login.vue'
import VueRouter from 'vue-router'
import firebase from '../../../plugins/firebase.js'

jest.mock('../../../plugins/firebase.js')

Vue.use(Vuetify)
Vue.use(VueRouter)

describe('Login.vue', () => {
	let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Login)
	})
	
	it('Vueのインスタンスであること', () => {
		expect(wrapper.isVueInstance()).toBeTruthy();
	})

	//it('LoginSuccess - 正常系: storeにユーザー情報をセットしてfirestoreから取得したユーザー情報をvm.user_infosにセット')

})