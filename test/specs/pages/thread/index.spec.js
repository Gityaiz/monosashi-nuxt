import { shallowMount, createLocalVue} from '@vue/test-utils'
import Index from '../../../../pages/thread/index.vue'
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

	})

	it('Vueインスタンスであること',  () => {
		firebase.firestore.mockReturnValue({
			collection: jest.fn().mockReturnThis(),
			doc: jest.fn().mockReturnThis(),
			get: jest.fn().mockReturnValue( Promise.resolve({
				exists: true
			})),
		})
		wrapper = shallowMount(Index, { router, localVue})

		wrapper.vm.setMessage = jest.fn()
		wrapper.vm.snackOn = jest.fn()
		expect(wrapper.isVueInstance()).toBeTruthy()
	})

	it('addCommentが正常に動作すること', async () => {
		firebase.firestore.mockReturnValue({
			collection: jest.fn().mockReturnThis(),
			doc: jest.fn().mockReturnThis(),
			get: jest.fn().mockReturnValue( Promise.resolve({
				exists: true
			})),
			set: jest.fn().mockReturnValue( Promise.resolve({
        author: 'name',
        authorid: 'authorid',
        profileImage: 'profileImage',
				message: 'message',
				timestamp: 'timestamp'
			}))
		})
		wrapper = shallowMount(Index, { router, localVue})
		wrapper.vm.fireid = 'sample'
		await wrapper.vm.addComment('test')

		expect(firebase.firestore().set.mock.calls.length).toBe(2)
		expect(wrapper.vm.sendMessage).toBe('')
	})

	it('addCommentがmessageがnullのときそのままreturnすること', async () => {
		firebase.firestore.mockReturnValue({
			collection: jest.fn().mockReturnThis(),
			doc: jest.fn().mockReturnThis(),
			get: jest.fn().mockReturnValue( Promise.resolve({
				exists: true
			})),
			set: jest.fn().mockReturnValue( Promise.resolve({
        author: 'name',
        authorid: 'authorid',
        profileImage: 'profileImage',
				message: 'message',
				timestamp: 'timestamp'
			}))
		})
		wrapper = shallowMount(Index, { router, localVue})
		// 引数に空文字を渡す
		await wrapper.vm.addComment('')

		expect(firebase.firestore().set.mock.calls.length).toBe(0)
	})

	it('addCommentがfireidがnullのときそのままreturnすること', async () => {
		firebase.firestore.mockReturnValue({
			collection: jest.fn().mockReturnThis(),
			doc: jest.fn().mockReturnThis(),
			get: jest.fn().mockReturnValue( Promise.resolve({
				exists: true
			})),
			set: jest.fn().mockReturnValue( Promise.resolve({
        author: 'name',
        authorid: 'authorid',
        profileImage: 'profileImage',
				message: 'message',
				timestamp: 'timestamp'
			}))
		})
		wrapper = shallowMount(Index, { router, localVue})
		// 引数に空文字を渡す
		wrapper.vm.fireid = ''
		await wrapper.vm.addComment('test')

		expect(firebase.firestore().set.mock.calls.length).toBe(0)
	})

	it('initInfoが正常に動作すること', async () => {
		firebase.firestore.mockReturnValue({
			collection: jest.fn().mockReturnThis(),
			doc: jest.fn().mockReturnThis(),
			get: jest.fn().mockReturnValue( Promise.resolve({
				exists: true
			})),
			set: jest.fn().mockReturnValue( Promise.resolve({
        author: 'name',
        authorid: 'authorid',
        profileImage: 'profileImage',
				message: 'message',
				timestamp: 'timestamp'
			}))
		})
		wrapper = shallowMount(Index, { router, localVue})
		// 引数に空文字を渡す
		wrapper.vm.threadData = 'threadData'
		wrapper.vm.sendMessage = 'sendMessage'
		wrapper.vm.active = 'active'
		wrapper.vm.initInfo()


		// expect( wrapper.vm.threadData).toBe([])
		expect( wrapper.vm.threadData).toStrictEqual([])
		expect( wrapper.vm.sendMessage).toBeFalsy()
		expect( wrapper.vm.active).toBeFalsy()
	})

	it('openThreadが正常に動作すること', async () => {
		firebase.firestore.mockReturnValue({
			collection: jest.fn().mockReturnThis(),
			doc: jest.fn().mockReturnThis(),
			get: jest.fn().mockReturnValue( Promise.resolve({
				exists: true
			})),
			set: jest.fn().mockReturnValue( Promise.resolve({
        author: 'name',
        authorid: 'authorid',
        profileImage: 'profileImage',
				message: 'message',
				timestamp: 'timestamp'
			})),
			orderBy: jest.fn().mockReturnThis(),
			onSnapshot: jest.fn().mockReturnValue( Promise.resolve(0) ),
		})
		wrapper = shallowMount(Index, { router, localVue})
		wrapper.vm.initInfo = jest.fn()
		wrapper.vm.openThread('openTopic')

		expect( wrapper.vm.openedTopic).toBe('openTopic')
		expect( wrapper.vm.alertColor).toBe('info')
		expect( wrapper.vm.alertIcon).toBe('info')
		expect( wrapper.vm.alertText).toBe('openTopicルームにようこそ！')
		expect( firebase.firestore().orderBy.mock.calls.length).toBe(1)

	})

	it('searchThreadが正常に動作すること', async () => {
		firebase.firestore.mockReturnValue({
			collection: jest.fn().mockReturnThis(),
			doc: jest.fn().mockReturnThis(),
			get: jest.fn().mockReturnValue( Promise.resolve({
				// このケースはtrueを渡す
				exists: true
			})),
			set: jest.fn().mockReturnValue( Promise.resolve({
        author: 'name',
        authorid: 'authorid',
        profileImage: 'profileImage',
				message: 'message',
				timestamp: 'timestamp'
			})),
		})
		wrapper = shallowMount(Index, { router, localVue})
		wrapper.vm.openThread = jest.fn()
		await wrapper.vm.searchThread('keyword')

		// moutedで１回呼ばれるので２回になる
		expect( wrapper.vm.openThread.mock.calls.length).toBe(2)
		expect( wrapper.vm.openThread.mock.calls[1][0]).toBe('keyword')

	})

	it('searchThreadが引数nullで実行されたときは何もせずにそのまま返ること', async () => {
		firebase.firestore.mockReturnValue({
			collection: jest.fn().mockReturnThis(),
			doc: jest.fn().mockReturnThis(),
			get: jest.fn().mockReturnValue( Promise.resolve({
				// このケースはtrueを渡す
				exists: true
			})),
			set: jest.fn().mockReturnValue( Promise.resolve({
        author: 'name',
        authorid: 'authorid',
        profileImage: 'profileImage',
				message: 'message',
				timestamp: 'timestamp'
			})),
		})
		wrapper = shallowMount(Index, { router, localVue})
		wrapper.vm.openThread = jest.fn()
		// 引数nullで呼ぶ
		await wrapper.vm.searchThread('')

		// moutedで１回呼ばれるので１回になる
		expect( wrapper.vm.openThread.mock.calls.length).toBe(1)

	})

	it('searchThreaが未ログイン状態で実行されたときはメッセージを表示して/に遷移すること', async () => {
		firebase.firestore.mockReturnValue({
			collection: jest.fn().mockReturnThis(),
			doc: jest.fn().mockReturnThis(),
			get: jest.fn().mockReturnValue( Promise.resolve({
				// このケースはfalseを渡す
				exists: false
			})),
			orderBy: jest.fn().mockReturnThis(),
			onSnapshot: jest.fn().mockReturnValue( Promise.resolve(0) ),
			set: jest.fn().mockReturnValue( Promise.resolve({
        author: 'name',
        authorid: 'authorid',
        profileImage: 'profileImage',
				message: 'message',
				timestamp: 'timestamp'
			})),
		})

		wrapper = shallowMount(Index, { router, localVue})
		wrapper.vm.openThread = jest.fn()
		wrapper.vm.setMessage = jest.fn()
		wrapper.vm.snackOn = jest.fn()
		wrapper.vm.fireid = ''

		await wrapper.vm.searchThread('test')

		expect( wrapper.vm.openThread.mock.calls.length).toBe(2)
		expect( wrapper.vm.setMessage.mock.calls[0][0]).toBe('新しいスレッドの作成はログイン済みの状態で行なってください')
	})

	it('submitSearchKeywordが正常に動作すること',  () => {
		firebase.firestore.mockReturnValue({
			collection: jest.fn().mockReturnThis(),
			doc: jest.fn().mockReturnThis(),
			get: jest.fn().mockReturnValue( Promise.resolve({
				// このケースはfalseを渡す
				exists: false
			})),
			orderBy: jest.fn().mockReturnThis(),
			onSnapshot: jest.fn().mockReturnValue( Promise.resolve(0) ),
			set: jest.fn().mockReturnValue( Promise.resolve({
        author: 'name',
        authorid: 'authorid',
        profileImage: 'profileImage',
				message: 'message',
				timestamp: 'timestamp'
			})),
		})

		wrapper = shallowMount(Index, { router, localVue})
		
		wrapper.vm.canSubmit = true
		wrapper.vm.addComment = jest.fn()
		wrapper.vm.submitSearchKeyword()

		expect( wrapper.vm.canSubmit).toBeFalsy()
		expect( wrapper.vm.addComment.mock.calls.length).toBe(1)
	})

	it('this.canSubmitがfalseのときsubmitSearchKeywordがそのままreturnすること',  () => {
		firebase.firestore.mockReturnValue({
			collection: jest.fn().mockReturnThis(),
			doc: jest.fn().mockReturnThis(),
			get: jest.fn().mockReturnValue( Promise.resolve({
				// このケースはfalseを渡す
				exists: false
			})),
			orderBy: jest.fn().mockReturnThis(),
			onSnapshot: jest.fn().mockReturnValue( Promise.resolve(0) ),
			set: jest.fn().mockReturnValue( Promise.resolve({
        author: 'name',
        authorid: 'authorid',
        profileImage: 'profileImage',
				message: 'message',
				timestamp: 'timestamp'
			})),
		})

		wrapper = shallowMount(Index, { router, localVue})
		
		wrapper.vm.canSubmit = false
		wrapper.vm.addComment = jest.fn()
		wrapper.vm.submitSearchKeyword()

		// moutedで１回呼ばれるので１回になる
		expect( wrapper.vm.canSubmit).toBeFalsy()
		expect( wrapper.vm.addComment.mock.calls.length).toBe(0)
	})

	it('setCanSubmitが正常に動作すること',  () => {
		firebase.firestore.mockReturnValue({
			collection: jest.fn().mockReturnThis(),
			doc: jest.fn().mockReturnThis(),
			get: jest.fn().mockReturnValue( Promise.resolve({
				// このケースはfalseを渡す
				exists: false
			})),
			orderBy: jest.fn().mockReturnThis(),
			onSnapshot: jest.fn().mockReturnValue( Promise.resolve(0) ),
			set: jest.fn().mockReturnValue( Promise.resolve({
        author: 'name',
        authorid: 'authorid',
        profileImage: 'profileImage',
				message: 'message',
				timestamp: 'timestamp'
			})),
		})

		wrapper = shallowMount(Index, { router, localVue})
		
		wrapper.vm.canSubmit = false
		wrapper.vm.setCanSubmit()

		expect( wrapper.vm.canSubmit).toBeTruthy()
	})
})