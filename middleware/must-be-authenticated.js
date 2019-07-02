export default function ({ store, redirect }) {
  // ユーザーが認証されていないときはログインページに飛ばす
  if (!store.getters['auth/email']) {
    return redirect('/user/login')
  }
}
