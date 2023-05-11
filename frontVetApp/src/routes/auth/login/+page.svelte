<script lang="ts">
    import { user } from "$lib/stores/user";
    import { onMount } from "svelte";
    import LoginForm from "./LoginForm.svelte";
    import { goto } from "$app/navigation";

onMount( ()=> {
    if($user){
        goto('/');
    }
})

</script>


<LoginForm></LoginForm>
