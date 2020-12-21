<template>
    <div class="cent">
        <div style="top: 35%">

            <h1>Error 404:</h1>
            <h2>Page does not exist</h2>
            <button class="button" @click="$router.push({ path: '/' })">
                Go Back
            </button>
            
        </div>
    </div>
</template>
<script>
export default {
  name: "NotFound",
}
</script>

<style>
.button {
  cursor: pointer;
}
.cent {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
</style>