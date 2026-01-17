<script lang="ts">
import { enhance } from '$app/forms'
</script>

<h1>Login</h1>

<form use:enhance action="?/login" method="post">
  <label>
    Email
    <input type="email" name="email" />
  </label>

  <button type="submit">Login</button>
</form>
