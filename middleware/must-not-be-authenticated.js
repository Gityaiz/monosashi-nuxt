export default function ({ store, redirect }) {
  // ユーザーが認証されているときはユーザページに飛ばす
  if (store.getters['auth/email']) {
    return redirect('/user')
  }
}
