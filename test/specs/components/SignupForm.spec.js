import Vue from "vue";
import Vuetify from 'vuetify'
import { shallowMount } from '@vue/test-utils'
import Signup from '@/components/SignupForm.vue'
import VueRouter from 'vue-router'
import firebase from '../../../plugins/firebase.js'

jest.mock('../../../plugins/firebase.js')

Vue.use(Vuetify)
Vue.use(VueRouter)

describe('SignupForm.vue', () => {
	let wrapper;
	afterEach(() => {
			jest.clearAllMocks();
	})

	beforeEach(() => {
		wrapper = shallowMount(Signup)
	})

	it('Vue のインスタンスであること', () => {
		expect(wrapper.isVueInstance()).toBeTruthy();
	})

	it('正常系 :ユーザー名、パスワード、パスワード確認の項目が全てルールを満たす時 - successイベントを発行', async () => {
		firebase.auth.mockReturnValue({
			createUserWithEmailAndPassword: ( username, password ) => Promise.resolve({
				username: username,
				password: password
			})
		});

		await wrapper.vm.signupWithEmail( 'valid_username', 'valid_password', 'valid_password' )
		expect(wrapper.emitted().success[0]).toEqual(
			[ { username: 'valid_username', password: 'valid_password' } ]
		)
	})

	it('異常系 :usernameがnullの時 -  failedイベントが発行(data: "any is blank") firebaseapiのコールが実行されない', async () => {
		firebase.auth.mockReturnValue({
			createUserWithEmailAndPassword: ( username, password ) => Promise.reject(123)
		});

		let callTime = firebase.auth.mock.calls.length;
		await wrapper.vm.signupWithEmail( '', 'valid_password', 'valid_password')
		expect(firebase.auth.mock.calls.length).toBe(callTime);	
		expect(wrapper.emitted().failed[0]).toEqual( [ 'any is blank' ] )
	})

	it('異常系 :passwordがnullの時 -  failedイベントが発行(data: "any is blank") firebaseapiのコールが実行されない', async () => {
		firebase.auth.mockReturnValue({
			createUserWithEmailAndPassword: ( username, password ) => Promise.reject(123)
		});

		let callTime = firebase.auth.mock.calls.length;
		await wrapper.vm.signupWithEmail( 'valid_username', '', 'valid_password')
		expect(firebase.auth.mock.calls.length).toBe(callTime);	
		expect(wrapper.emitted().failed[0]).toEqual( [ 'any is blank' ] )
	})

	it('異常系 :confirm_passwordがnullの時 - failedイベントが発行(data: "any is blank") firebaseapiのコールが実行されない', async () => {
		firebase.auth.mockReturnValue({
			createUserWithEmailAndPassword: ( username, password ) => Promise.reject(123)
		});

		let callTime = firebase.auth.mock.calls.length;
		await wrapper.vm.signupWithEmail( 'valid_username', 'valid_password', '')
		expect(firebase.auth.mock.calls.length).toBe(callTime);	
		expect(wrapper.emitted().failed[0]).toEqual( [ 'any is blank' ] )
	})

	it('異常系 :confirm_passwordがpasswordと異なる時 - failedイベントが発行(data: "password differs from confirm") firebaseapiのコールが実行されない', async () => {
		firebase.auth.mockReturnValue({
			createUserWithEmailAndPassword: ( username, password ) => Promise.reject(123)
		});

		let callTime = firebase.auth.mock.calls.length;
		await wrapper.vm.signupWithEmail( 'valid_username', 'valid_password', 'wrong_password')
		expect(firebase.auth.mock.calls.length).toBe(callTime);	
		expect(wrapper.emitted().failed[0]).toEqual( [ 'password differs from confirm' ] )

	})
	
	it('異常系 :firebase側で何か異常が発生した場合 - failedイベントを発行(data: firebaseのエラー情報)', async () => {
		firebase.auth.mockReturnValue({
			createUserWithEmailAndPassword: ( username, password ) => Promise.reject(123) 
		})

		await wrapper.vm.signupWithEmail( 'valid_username', 'valid_password', 'valid_password')
		expect(wrapper.emitted().failed[0]).toEqual( [ 123 ] )		
	})
})