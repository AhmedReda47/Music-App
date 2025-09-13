<template>
  <div>
    <!-- Registration Form -->
    <div
      class="text-white text-center font-bold p-4 rounded mb-4"
      v-if="reg_show_alert"
      :class="reg_alert_variant"
    >
      {{ reg_alert_msg }}
    </div>
    <vee-form :validation-schema="schema" @submit="register" :initial-values="userData">
      <!-- Name -->
      <div class="mb-3">
        <label for="name" class="inline-block mb-2">{{ $t('register.name') }}</label>
        <vee-field
          id="name"
          name="name"
          type="text"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          :placeholder="$t('register.name_placeholder')"
          autocomplete="given-name"
        />
        <ErrorMessage class="text-red-600" name="name" />
      </div>
      <!-- Email -->
      <div class="mb-3">
        <label for="email" class="inline-block mb-2">{{ $t('register.email') }}</label>
        <vee-field
          id="email"
          name="email"
          type="email"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          :placeholder="$t('register.email_placeholder')"
          autocomplete="email"
        />
        <ErrorMessage class="text-red-600" name="email" />
      </div>
      <!-- Age -->
      <div class="mb-3">
        <label for="age" class="inline-block mb-2">{{ $t('register.age') }}</label>
        <vee-field
          id="age"
          name="age"
          type="number"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          autocomplete="age"
        />
      </div>
      <ErrorMessage class="text-red-600" name="age" />
      <!-- Password -->
      <div class="mb-3">
        <label for="password" class="inline-block mb-2">{{ $t('register.password') }}</label>
        <vee-field name="password" :bails="false" v-slot="{ field, errors }">
          <input
            id="password"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            :placeholder="$t('register.password_placeholder')"
            v-bind="field"
            type="password"
            autocomplete="new-password"
          />
          <div class="text-red-600" v-for="error in errors" :key="error">
            {{ error }}
          </div>
        </vee-field>
      </div>
      <!-- <ErrorMessage class="text-red-600" name="password"/> -->
      <!-- Confirm Password -->
      <div class="mb-3">
        <label for="confirm_password" class="inline-block mb-2">{{
          $t('register.confirm_password')
        }}</label>
        <vee-field
          id="confirm_password"
          name="confirm_password"
          type="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          :placeholder="$t('register.confirm_password_placeholder')"
          autocomplete="confirm-password"
        />
      </div>
      <ErrorMessage class="text-red-600" name="confirm_password" />
      <!-- Country -->
      <div class="mb-3">
        <label for="country" class="inline-block mb-2">{{ $t('register.country') }}</label>
        <vee-field
          id="country"
          as="select"
          name="country"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          autocomplete="country"
        >
          <option value="USA">USA</option>
          <option value="Mexico">Mexico</option>
          <option value="Germany">Germany</option>
          <option value="Antarctica">Antarctica</option>
        </vee-field>
      </div>
      <ErrorMessage class="text-red-600" name="country" />
      <!-- TOS -->
      <div class="mb-3 pl-6">
        <vee-field
          id="tos"
          name="tos"
          value="1"
          type="checkbox"
          class="block w-4 h-4 float-left -ml-6 mt-1 rounded"
        />
        <i18n-t keypath="register.accept" tag="label" for="tos" class="inline-block">
          <a href="#">{{ $t('register.tos') }}</a>
        </i18n-t>
        <ErrorMessage class="text-red-600 ml-3" name="tos" />
      </div>
      <button
        type="submit"
        class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
        :disabled="reg_in_submission"
      >
        {{ $t('register.submit') }}
      </button>
    </vee-form>
  </div>
</template>

<script>
import { mapActions } from 'pinia'
import { useUserStore } from '@/stores/user'
export default {
  name: 'RegisterForm',
  data() {
    return {
      tab: 'login',
      schema: {
        name: 'required|min:3|max:100|alpha_spaces',
        email: 'required|min:3|max:100|email',
        age: 'required|min_value:18|max_value:100',
        password: 'required|min:9|max:100|excluded:password',
        confirm_password: 'passwords_mismatch:@password',
        country: 'required|excluded:Antarctica',
        tos: 'required',
      },
      userData: {
        country: 'USA',
      },
      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_variant: 'bg-blue-500',
      reg_alert_msg: '',
    }
  },
  methods: {
    ...mapActions(useUserStore, {
      createUser: 'register',
    }),
    async register(values) {
      this.reg_show_alert = true
      this.reg_in_submission = true
      this.reg_alert_variant = 'bg-blue-500'
      this.reg_alert_msg = this.$t('register.waiting')

      try {
        await this.createUser(values)
      } catch (error) {
        this.reg_in_submission = false
        this.reg_alert_variant = 'bg-red-500'

        // Show more specific error messages
        if (error.code === 'auth/email-already-in-use') {
          this.reg_alert_msg = this.$t('register.email_in_use')
        } else if (error.code === 'auth/weak-password') {
          this.reg_alert_msg = this.$t('register.weak_password')
        } else if (error.code === 'auth/invalid-email') {
          this.reg_alert_msg = this.$t('register.invalid_email')
        } else {
          this.reg_alert_msg = this.$t('register.failed', { message: error.message })
        }
        return
      }

      this.reg_alert_variant = 'bg-green-500'
      this.reg_alert_msg = this.$t('register.success')
      window.location.reload()
    },
  },
}
</script>

<style></style>
