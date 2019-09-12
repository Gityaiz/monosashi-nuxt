import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Index from '@/pages/index.vue'
import firebase from '../../../plugins/firebase.js'
import Vuex from 'vuex'
import VueRouter from 'vue-router'

jest.mock('../../../plugins/firebase.js')
jest.mock('vuex')
// router-linkはモックできない

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)
localVue.use(Vuetify)

describe('index.vue', () => {
	let wrapper
	let router
	let queryMock = jest.fn()
	let referenceMock

	beforeEach(() => {
		router = new VueRouter()
	})

	it('Vueインスタンスであること', () => {
		
		firebase.storage.mockReturnValue({
			ref: jest.fn().mockReturnThis(),
			child: jest.fn().mockReturnThis(),
			getDownloadURL: jest.fn().mockReturnValue( Promise.resolve('returned URL') ),
		})

		firebase.firestore.mockReturnValue({
			collection: jest.fn().mockReturnThis(),
			orderBy: jest.fn().mockReturnThis(),
			limit: jest.fn().mockReturnThis(),
			get: jest.fn(() => Promise.resolve({
					querySnapshot: {
						doc1: {
							id: 123
						},
						doc2: {
							id: 234
						},
					}
				})
			)
		})
		wrapper = shallowMount( Index, {router, localVue} )
		expect(wrapper.isVueInstance()).toBeTruthy()
	})

	it('ページロード時にトップ画像と最新更新スレッドタイトルが取得されていること', () => {
		
		firebase.storage.mockReturnValue({
			ref: jest.fn().mockReturnThis(),
			child: jest.fn().mockReturnThis(),
			getDownloadURL: jest.fn().mockReturnValue( Promise.resolve('returned URL') ),
		})

		firebase.firestore.mockReturnValue({
			collection: jest.fn().mockReturnThis(),
			orderBy: jest.fn().mockReturnThis(),
			limit: jest.fn().mockReturnThis(),
			get: jest.fn(() => Promise.resolve({
					querySnapshot: {
						doc1: {
							id: 123
						},
						doc2: {
							id: 234
						},
					}
				})
			)
		})

		wrapper = shallowMount( Index, {router, localVue} )
		console.log(firebase.firestore().get.mock.calls.length)
		expect(firebase.firestore().get.mock.calls.length).toBe(1)
		expect(firebase.storage().getDownloadURL.mock.calls.length).toBe(1)

		expect(firebase.storage().child.mock.calls[0][0]).toBe('public/plane.png')
		expect(firebase.firestore().collection.mock.calls[0][0]).toBe('chat-room')
		expect(firebase.firestore().orderBy.mock.calls[0][0]).toBe('updated')
		expect(firebase.firestore().orderBy.mock.calls[0][1]).toBe('desc')
		expect(firebase.firestore().limit.mock.calls[0][0]).toBe(6)

	})

	
	it('jumpToThreadPageが正しく動作すること', () => {
		
		firebase.storage.mockReturnValue({
			ref: jest.fn().mockReturnThis(),
			child: jest.fn().mockReturnThis(),
			getDownloadURL: jest.fn().mockReturnValue( Promise.resolve('returned URL') ),
		})

		firebase.firestore.mockReturnValue({
			collection: jest.fn().mockReturnThis(),
			orderBy: jest.fn().mockReturnThis(),
			limit: jest.fn().mockReturnThis(),
			get: jest.fn(() => Promise.resolve({
					querySnapshot: {
						doc1: {
							id: 123
						},
						doc2: {
							id: 234
						},
					}
				})
			)
		})

		wrapper = shallowMount( Index, {router, localVue} )
		wrapper.vm.setTopic = jest.fn()

		wrapper.vm.jumpToThreadPage('test')
		console.log(firebase.firestore().get.mock.calls.length)
		expect(wrapper.vm.setTopic.mock.calls.length).toBe(1)
		expect(wrapper.vm.setTopic.mock.calls[0][0]).toBe('test')

		expect(wrapper.vm.searchKeyword).toBe('')
	})

	it('submitSearchKeywordが正しく動作すること', () => {
		
		firebase.storage.mockReturnValue({
			ref: jest.fn().mockReturnThis(),
			child: jest.fn().mockReturnThis(),
			getDownloadURL: jest.fn().mockReturnValue( Promise.resolve('returned URL') ),
		})

		firebase.firestore.mockReturnValue({
			collection: jest.fn().mockReturnThis(),
			orderBy: jest.fn().mockReturnThis(),
			limit: jest.fn().mockReturnThis(),
			get: jest.fn(() => Promise.resolve({
					querySnapshot: {
						doc1: {
							id: 123
						},
						doc2: {
							id: 234
						},
					}
				})
			)
		})

		wrapper = shallowMount( Index, {router, localVue} )
		wrapper.vm.jumpToThreadPage = jest.fn(() => {return 0})
		wrapper.vm.canSubmit = true
		wrapper.vm.searchKeyword = 'test'
		wrapper.vm.submitSearchKeyword()
		expect(wrapper.vm.canSubmit).toBe(false)
		expect(wrapper.vm.jumpToThreadPage.mock.calls.length).toBe(1)
		expect(wrapper.vm.jumpToThreadPage.mock.calls[0][0]).toBe('test')

	})

	it('canSubmit がfalseのときsubmitSearchKeywordがreturn すること', () => {
		
		firebase.storage.mockReturnValue({
			ref: jest.fn().mockReturnThis(),
			child: jest.fn().mockReturnThis(),
			getDownloadURL: jest.fn().mockReturnValue( Promise.resolve('returned URL') ),
		})

		firebase.firestore.mockReturnValue({
			collection: jest.fn().mockReturnThis(),
			orderBy: jest.fn().mockReturnThis(),
			limit: jest.fn().mockReturnThis(),
			get: jest.fn(() => Promise.resolve({
					querySnapshot: {
						doc1: {
							id: 123
						},
						doc2: {
							id: 234
						},
					}
				})
			)
		})

		wrapper = shallowMount( Index, {router, localVue} )
		wrapper.vm.jumpToThreadPage = jest.fn(() => {return 0})
		wrapper.vm.canSubmit = false
		wrapper.vm.submitSearchKeyword()
		expect(wrapper.vm.jumpToThreadPage.mock.calls.length).toBe(0)

	})

	it('searchKeyword が空文字のときsubmitSearchKeywordがreturn すること', () => {
		
		firebase.storage.mockReturnValue({
			ref: jest.fn().mockReturnThis(),
			child: jest.fn().mockReturnThis(),
			getDownloadURL: jest.fn().mockReturnValue( Promise.resolve('returned URL') ),
		})

		firebase.firestore.mockReturnValue({
			collection: jest.fn().mockReturnThis(),
			orderBy: jest.fn().mockReturnThis(),
			limit: jest.fn().mockReturnThis(),
			get: jest.fn(() => Promise.resolve({
					querySnapshot: {
						doc1: {
							id: 123
						},
						doc2: {
							id: 234
						},
					}
				})
			)
		})

		wrapper = shallowMount( Index, {router, localVue} )
		wrapper.vm.jumpToThreadPage = jest.fn(() => {return 0})
		wrapper.vm.searchKeyword = ''
		wrapper.vm.submitSearchKeyword()
		expect(wrapper.vm.jumpToThreadPage.mock.calls.length).toBe(0)

	})

	it('setCanSubmit が空文字のときsubmitSearchKeywordがreturn すること', () => {
		
		firebase.storage.mockReturnValue({
			ref: jest.fn().mockReturnThis(),
			child: jest.fn().mockReturnThis(),
			getDownloadURL: jest.fn().mockReturnValue( Promise.resolve('returned URL') ),
		})

		firebase.firestore.mockReturnValue({
			collection: jest.fn().mockReturnThis(),
			orderBy: jest.fn().mockReturnThis(),
			limit: jest.fn().mockReturnThis(),
			get: jest.fn(() => Promise.resolve({
					querySnapshot: {
						doc1: {
							id: 123
						},
						doc2: {
							id: 234
						},
					}
				})
			)
		})

		wrapper = shallowMount( Index, {router, localVue} )
		wrapper.vm.canSubmit = false
		wrapper.vm.setCanSubmit()
		expect(wrapper.vm.canSubmit).toBeTruthy()
	})
})