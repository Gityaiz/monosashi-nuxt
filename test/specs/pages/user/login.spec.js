import { shallowMount, createLocalVue } from '@vue/test-utils'
import Login from '../../../../pages/user/login.vue'
import firebase from '../../../../plugins/firebase.js'
import Vuex from 'vuex'
import VueRouter from 'vue-router'

jest.mock('../../../../plugins/firebase.js')
jest.mock('vuex')

const localVue = createLocalVue();
localVue.use(Vuex)
localVue.use(VueRouter)

describe('Login.vue', () => {
	let wrapper
	let router

	// loginSuccessが引数に受け取るdataのダミーデータを作成
	const data = {
		user: {
			email: 'received argument: user.email in data',
			uid: 'received argument: user.uid in data'
		}
	}

	firebase.firestore.mockReturnValue({
		collection: jest.fn().mockReturnThis(),
		doc: jest.fn().mockReturnThis(),
		get: jest.fn().mockReturnValue( Promise.resolve('returned URL') ),
	})

	beforeEach(() => {

		router = new VueRouter()

		wrapper = shallowMount(Login, { router, localVue })

		wrapper.vm.setName = jest.fn()
		wrapper.vm.setEmail = jest.fn()
		wrapper.vm.setFireID = jest.fn()
		wrapper.vm.setProfileImage = jest.fn()
		wrapper.vm.setMessage = jest.fn()
		wrapper.vm.snackOn = jest.fn()

	})


	it('Vueのインスタンスであること', () => {
		expect(wrapper.isVueInstance()).toBeTruthy();
	})

	it('successイベントが発生。LoginSuccessが正常に動作すること', async () => {

		// firebaseをmock化
		firebase.firestore.mockReturnValue({
			collection: jest.fn().mockReturnThis(),
			doc: jest.fn().mockReturnThis(),
			get: jest.fn().mockReturnValue( Promise.resolve({
				exists: true,
				data: function () {
					return {
						name: 'returned name',
						profileImage: 'returned profileImage'
					}
				}
			})),
		})

		await wrapper.vm.LoginSuccess(data)

		expect(wrapper.vm.setName.mock.calls.length).toBe(2)
		expect(wrapper.vm.setName.mock.calls[0][0]).toBe('名無し')
		expect(wrapper.vm.setName.mock.calls[1][0]).toBe('returned name')

		expect(wrapper.vm.setEmail.mock.calls.length).toBe(1)
		expect(wrapper.vm.setEmail.mock.calls[0][0]).toBe('received argument: user.email in data')

		expect(wrapper.vm.setFireID.mock.calls.length).toBe(1)
		expect(wrapper.vm.setFireID.mock.calls[0][0]).toBe('received argument: user.uid in data')

		expect(wrapper.vm.setProfileImage.mock.calls.length).toBe(1)
		expect(wrapper.vm.setProfileImage.mock.calls[0][0]).toBe('returned profileImage')

		expect(wrapper.vm.setMessage.mock.calls.length).toBe(1)
		expect(wrapper.vm.setMessage.mock.calls[0][0]).toBe('ログインに成功しました')

		expect(wrapper.vm.snackOn.mock.calls.length).toBe(1)
		expect(wrapper.vm.snackOn.mock.calls[0][0]).toBeFalsy()
	})

	it('successイベントが発生。firebase上にユーザー情報が存在しなかったときエラーを表示すること', async () => {
		// firebaseをmock化
		firebase.firestore.mockReturnValue({
			collection: jest.fn().mockReturnThis(),
			doc: jest.fn().mockReturnThis(),
			get: jest.fn().mockReturnValue( Promise.resolve({
				exists: false
			})),
		})

		await wrapper.vm.LoginSuccess(data)
		expect(firebase.firestore().get.mock.calls.length).toBe(1)

		expect(wrapper.vm.setName.mock.calls.length).toBe(1)
		expect(wrapper.vm.setName.mock.calls[0][0]).toBe('名無し')

		expect(wrapper.vm.setEmail.mock.calls.length).toBe(1)
		expect(wrapper.vm.setEmail.mock.calls[0][0]).toBe('received argument: user.email in data')

		expect(wrapper.vm.setFireID.mock.calls.length).toBe(1)
		expect(wrapper.vm.setFireID.mock.calls[0][0]).toBe('received argument: user.uid in data')

		expect(wrapper.vm.setProfileImage.mock.calls.length).toBe(0)

		expect(wrapper.vm.setMessage.mock.calls.length).toBe(1)
		expect(wrapper.vm.setMessage.mock.calls[0][0]).toBe('ユーザーが存在しませんでした')

		expect(wrapper.vm.snackOn.mock.calls.length).toBe(1)
		expect(wrapper.vm.snackOn.mock.calls[0][0]).toBeFalsy()
	})

	it('failedイベントが発生してLoginFailedが実行', async () => {
		await wrapper.vm.LoginFailed(data)

		expect(wrapper.vm.setName.mock.calls.length).toBe(0)

		expect(wrapper.vm.setEmail.mock.calls.length).toBe(0)

		expect(wrapper.vm.setFireID.mock.calls.length).toBe(0)

		expect(wrapper.vm.setProfileImage.mock.calls.length).toBe(0)

		expect(wrapper.vm.setMessage.mock.calls.length).toBe(1)
		expect(wrapper.vm.setMessage.mock.calls[0][0]).toBe('エラーが発生しました')

		expect(wrapper.vm.snackOn.mock.calls.length).toBe(1)
		expect(wrapper.vm.snackOn.mock.calls[0][0]).toBeFalsy()
	})
})