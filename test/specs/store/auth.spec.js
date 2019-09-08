require('dotenv').config()
import { createLocalVue } from "@vue/test-utils";
import Vuex from 'vuex'
import * as auth from '@/store/auth'
import cloneDeep from 'lodash.clonedeep'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('store/auth.js', () => {
	let store;

	beforeEach(() => {
		store = new Vuex.Store(cloneDeep(auth))	
	})

	describe('getters', () => {
		it('nameの値がgetterを通して正しく取得できること', async () => {
			await store.dispatch('setName', 'testName')
			expect(store.getters['name']).toBe('testName')
		})
		it('emailの値がgetterを通して正しく取得できること', async () => {
			await store.dispatch('setEmail', 'sample@google.com')
			expect(store.getters['email']).toBe('sample@google.com')
		})
		it('fireidの値がgetterを通して正しく取得できること', async () => {
			await store.dispatch('setFireID', 'asiodfuahfslidf')
			expect(store.getters['fireid']).toBe('asiodfuahfslidf')
		})
		it('emailの値がgetterを通して正しく取得できること', async () => {
			await store.dispatch('setProfileImage', 'path/to/URL')
			expect(store.getters['profileImage']).toBe('path/to/URL')
		})
	})

	describe('actions', () => {
		it('setNameで正しくユーザー名がセットできること', async () =>{
			expect(store.getters['name']).toBeFalthy
			await store.dispatch('setName', 'testName')
			expect(store.getters['name']).toBe('testName')
		})
		it('setEmailでメールアドレスが正しくセットできること', async () =>{
			expect(store.getters['email']).toBeFalthy
			await store.dispatch('setEmail', 'sample@google.com')
			expect(store.getters['email']).toBe('sample@google.com')
		})
		it('setFireIDでfirebaseIDが正しくセットできること', async () =>{
			expect(store.getters['fireid']).toBeFalthy
			await store.dispatch('setFireID', 'asiodfuahfslidf')
			expect(store.getters['fireid']).toBe('asiodfuahfslidf')
		})
		it('setProfileImageでプロフィール画像が正しくセットできること', async () =>{
			expect(store.getters['profileImage']).toBeFalthy
			await store.dispatch('setProfileImage', 'path/to/URL')
			expect(store.getters['profileImage']).toBe('path/to/URL')
		})
		it('initializeStateにより、store値が全て初期化されること', async () => {
			await store.dispatch('setName', 'testName')
			await store.dispatch('setEmail', 'sample@google.com')
			await store.dispatch('setFireID', 'asiodfuahfslidf')
			await store.dispatch('setProfileImage', 'path/to/URL')

			expect(store.getters['name']).toBe('testName')
			expect(store.getters['email']).toBe('sample@google.com')
			expect(store.getters['fireid']).toBe('asiodfuahfslidf')
			expect(store.getters['profileImage']).toBe('path/to/URL')

			await store.dispatch('setLogOut')

			expect(store.getters['name']).toBeFalthy
			expect(store.getters['email']).toBeFalthy
			expect(store.getters['fireid']).toBeFalthy
			expect(store.getters['profileImage']).toBeFalthy
		})
	})

})