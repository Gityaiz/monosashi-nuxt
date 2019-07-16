export default function ({ store, redirect }) {
  // ユーザーが認証されているときはユーザページに飛ばす
  if (store.state.loggedIn) {
    return redirect('/user')
  }
}
