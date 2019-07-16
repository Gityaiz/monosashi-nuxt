export default function ({ store, redirect }) {
  // ユーザーが認証されていないときはログインページに飛ばす
  if (!store.state.loggedIn) {
    console.log(store.state.loggedIn)
    console.log('ユーザが認証されていないためログインページに飛びます')
    return redirect('/user/login')
  }
}
