import { shallowMount, createLocalVue } from '@vue/test-utils'
import Signup from '../../../../pages/user/Signup.vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'

jest.mock('vuex')

const localVue = createLocalVue();
localVue.use(Vuex)
localVue.use(VueRouter)

describe('Signup.vue', () => {
	let wrapper
	let router

	let data

	beforeEach(() => {
		router = new VueRouter()
		wrapper = shallowMount(Signup, {router, localVue })
		wrapper.vm.setMessage = jest.fn()
		wrapper.vm.snackOn = jest.fn()
	})

	it('Vueのインスタンスであること', () => {
		expect(wrapper.isVueInstance()).toBeTruthy();
	})

	it('SignupSuccessが正常に動作すること', async () => {
		data = 'success'
		await wrapper.vm.SignupSuccess( data )

		expect(wrapper.vm.setMessage.mock.calls.length).toBe(1)
		expect(wrapper.vm.setMessage.mock.calls[0][0]).toBe('ユーザーの作成に成功しました')

		expect(wrapper.vm.snackOn.mock.calls.length).toBe(1)
		expect(wrapper.vm.snackOn.mock.calls[0][0]).toBeFalsy()
	})

	it('SignupFailedが正常に動作すること - data: any is blank', async () => {
		data = 'any is blank'
		await wrapper.vm.SignupFailed( data )

		expect(wrapper.vm.setMessage.mock.calls.length).toBe(1)
		expect(wrapper.vm.setMessage.mock.calls[0][0]).toBe('必要事項を埋めてください')

		expect(wrapper.vm.snackOn.mock.calls.length).toBe(1)
		expect(wrapper.vm.snackOn.mock.calls[0][0]).toBeFalsy()
	})

	it('SignupFailedが正常に動作すること - data: password differs from confirm', async () => {
		data = 'password differs from confirm'
		await wrapper.vm.SignupFailed( data )

		expect(wrapper.vm.setMessage.mock.calls.length).toBe(1)
		expect(wrapper.vm.setMessage.mock.calls[0][0]).toBe('パスワードと確認パスワードが異なります')

		expect(wrapper.vm.snackOn.mock.calls.length).toBe(1)
		expect(wrapper.vm.snackOn.mock.calls[0][0]).toBeFalsy()
	})
})