<template>
<app>
  <LoginForm v-on:LoginFormEvent="LoginEvent"></LoginForm>
  <p> {{ message}} </p>
</app>
</template>
<script>
import LoginForm from '../../components/LoginForm'

export default {
  data () {
    return {
      // この値はコンポーネントLoginFormの実行によりセットされる
      LoginFormReturnData: '',
      message: ''
    }
  },
  components: {
    LoginForm
  },
  methods: {
    LoginEvent (errorCode) {
      alert (errorCode)
    }
  }
}
</script>