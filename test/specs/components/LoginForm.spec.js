import Vue from "vue";
import Vuetify from 'vuetify'
import { shallowMount } from '@vue/test-utils'
import Login from '@/components/LoginForm.vue'
import VueRouter from 'vue-router'
import firebase from '../../../plugins/firebase.js'

jest.mock('../../../plugins/firebase.js')


// localVueを使用するとVuetifyのバグでwarningが出るのでVueを使用する
// let wrapper;
// const localVue = createLocalVue()
// localVue.use(Vuetify)
// wrapper = shallowMount(Login, { localVue })

Vue.use(Vuetify)
Vue.use(VueRouter)

describe('LoginForm.vue', () => {
  let wrapper;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    wrapper = shallowMount(Login)
  })

  it('Vue のインスタンスであること', () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it('正常系: ユーザ名とパスワードが正しいとき - successイベントを発行', async () => {
    // firebase.authのmockを作成
    firebase.auth.mockReturnValue({
      signInWithEmailAndPassword: (username, password) => Promise.resolve({
        username: username,
        password: password
      })
    });

    await wrapper.vm.loginAction('valid_username', 'valid_password')
    console.log(wrapper.emitted().success)
    expect(wrapper.emitted().success[0]).toEqual([
      { username: 'valid_username', password: 'valid_password' }
    ])
  })

  it('異常系: ユーザ名とパスワードが正しくないとき - failedイベントを発行', async () => {
    // firebase.authのmockを作成
    firebase.auth.mockReturnValue({
      signInWithEmailAndPassword: (username, password) => Promise.reject({
        username: username,
        password: password
      })
    });

    await wrapper.vm.loginAction('invalid_username', 'invalid_password');
    console.log(wrapper.emitted().failed)
    expect(wrapper.emitted().failed[0]).toEqual([
      {username: 'invalid_username', password: 'invalid_password'}
    ])
  })
  it('異常系: ユーザ名が空のとき - failedイベントを発行(data: username or password is blank)', () => {
		let callTime = firebase.auth.mock.calls.length;
    wrapper.vm.loginAction('', 'valid_password');
    
    // 認証が実行されていないことを検証
		expect(firebase.auth.mock.calls.length).toBe(callTime);	
		expect(wrapper.emitted().failed[0]).toEqual( [ 'username or password is blank' ] )
  })

  it('異常系: パスワードが空のとき - failedイベントを発行(data: username or password is blank)', () => {
		let callTime = firebase.auth.mock.calls.length;
    wrapper.vm.loginAction('valid_username', '');
    // 認証が実行されていないことを検証
		expect(firebase.auth.mock.calls.length).toBe(callTime);	
		expect(wrapper.emitted().failed[0]).toEqual( [ 'username or password is blank' ] )
  })
})

