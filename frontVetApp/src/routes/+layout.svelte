<script lang='ts'>
	// The ordering of these imports is critical to your app working properly
	import '../theme.postcss';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/all.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';
	import NavBar from './NavBar.svelte';
    import { AppShell } from '@skeletonlabs/skeleton';
    import { beforeUpdate, onMount } from 'svelte';
    import { user } from '$lib/stores/user';
    import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
    import { page } from '$app/stores';

	afterNavigate(()=> {
		if ($page.url.pathname!=='/auth/cambiar-password/'){
			if($user && (!$user.seCambioPassword)){
				goto('/auth/cambiar-password');
			}
		}
	})
</script>


<AppShell>
	<svelte:fragment slot="header">
		<NavBar></NavBar>
	</svelte:fragment>
	<slot />
	<svelte:fragment slot="pageFooter">Hecho por FJM Software factory</svelte:fragment>
	
</AppShell>
