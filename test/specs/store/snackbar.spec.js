require('dotenv').config()
import { createLocalVue } from "@vue/test-utils";
import Vuex from 'vuex'
import * as snackbar from '@/store/snackbar'
import cloneDeep from 'lodash.clonedeep'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('store/auth.js', () => {
	let store;

	beforeEach(() => {
		store = new Vuex.Store(cloneDeep(snackbar))	
	})

	describe('getters', () => {
		it('isEnableの値がgetterを通して正しく取得できること', async () => {
			await store.dispatch('snackOn')
			expect(store.getters['status']).toBeTruthy()
		})
		it('messageの値がgetterを通して正しく取得できること', async () => {
			await store.dispatch('setMessage', 'testMessage')
			expect(store.getters['message']).toBe('testMessage')
		})
	})

	describe('actions', () => {
		it('snackOnで正しくユーザー名がセットできること', async () =>{
			expect(store.getters['status']).toBeFalsy()
			await store.dispatch('snackOn')
			expect(store.getters['status']).toBeTruthy()
		})
		it('setEmailでメールアドレスが正しくセットできること', async () =>{
			expect(store.getters['status']).toBeFalsy()
			await store.dispatch('snackOff')
			console.log(store.getters['status'])
			expect(store.getters['status']).toBeFalsy()
		})
		it('setMessageで正しくスナックバーに表示するメッセージをセットできること', async () =>{
			expect(store.getters['message']).toBeFalsy()
			await store.dispatch('setMessage', 'テスト用スナックバーメッセージ')
			expect(store.getters['message']).toBe('テスト用スナックバーメッセージ')
		})
	})
})
