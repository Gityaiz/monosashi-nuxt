import { shallowMount, createLocalVue} from '@vue/test-utils'
import Index from '../../../../pages/user/index.vue'
import firebase from '../../../../plugins/firebase.js'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'

jest.mock('../../../../plugins/firebase.js')
jest.mock('vuex')

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)
localVue.use(Vuetify)

describe('index.vue', () => {
	let wrapper
	let router

	beforeEach(() => {
			router = new VueRouter()

			wrapper = shallowMount(Index, { router, localVue})

			wrapper.vm.setName = jest.fn()
			wrapper.vm.setMessage = jest.fn()
			wrapper.vm.snackOn = jest.fn()
	})

	it('Vueインスタンスであること', () => {
		expect(wrapper.isVueInstance()).toBeTruthy()
	})

	it('getstatus初回実行時に正常に動作すること', async () => {
		firebase.firestore.mockReturnValue({
			collection: jest.fn().mockReturnThis(),
			doc: jest.fn().mockReturnThis(),
			get: jest.fn().mockReturnValue( Promise.resolve({
				exists: true,
				data: () => 'firebase.firestore.collection.doc.get.data'
			})
			)
		})
		await wrapper.vm.getStatus()
		expect(wrapper.vm.user_infos).toBe('firebase.firestore.collection.doc.get.data')
		expect(wrapper.vm.isVisible).toBeTruthy()
		expect(wrapper.vm.isfirst).toBeFalsy()
	})

	it('getstatus初回実行時にfirebase上にユーザー情報が存在しなかった場合に正しくエラーを表示すること', async () => {
		firebase.firestore.mockReturnValue({
			collection: jest.fn().mockReturnThis(),
			doc: jest.fn().mockReturnThis(),
			get: jest.fn().mockReturnValue( Promise.resolve({
				exists: false
			})
			)
		})
		await wrapper.vm.getStatus()
		expect(wrapper.vm.setMessage.mock.calls.length).toBe(1)
		expect(wrapper.vm.setMessage.mock.calls[0][0]).toBe('エラーが発生しました')
		expect(wrapper.vm.snackOn.mock.calls.length).toBe(1)
	})

	it('getstatus2回目以降実行時にisVisibleの変更のみ動作すること', () => {
		firebase.firestore.mockReturnValue({
			collection: jest.fn().mockReturnThis(),
			doc: jest.fn().mockReturnThis(),
			get: jest.fn().mockReturnValue( Promise.resolve({
				data: () => 'firebase.firestore.collection.doc.get.data'
			})
			)
		})
		let initialVisible = wrapper.vm.isVisible
		wrapper.vm.isfirst = false
		wrapper.vm.getStatus()
		expect(wrapper.vm.isVisible).toBe(!initialVisible)
		expect(firebase.firestore().get.mock.calls.length).toBe(0)
	})
})