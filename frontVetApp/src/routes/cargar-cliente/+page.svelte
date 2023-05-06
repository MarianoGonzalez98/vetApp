<script lang="ts">
    let nombre= '';
    let apellido = '';
    let email = '';
    let dni = '';
    let direccion = '';
    let telefono = '';
    let fechaNacimiento: string = new Date().toJSON().slice(0,10);

    const handleCarga = () => {

    }
</script>



<div class="container mt-2 mb-10 h-full mx-auto flex justify-center items-center ">
    <form on:submit|preventDefault={handleCarga} class="space-y-2 ">
        <label class="label" for="nombre">Nombre:</label>
        <input bind:value={nombre} class="input" type="text" placeholder="Ingrese nombre del cliente" name="nombre" required>

        <label class="label" for="apellido">Apellido:</label>
        <input bind:value={apellido} class="input" type="text" placeholder="Ingrese apellido del cliente" name="apellido" required>

        <label class="label" for="email">Email:</label>
        <input bind:value={email} class="input" type="text" placeholder="Ingrese email del cliente" name="email" required>

        <label class="label" for="dni">DNI:</label>
        <input bind:value={dni} class="input" type="text" placeholder="Ingrese dni del cliente" name="dni" required>

        <label class="label" for="fechaNacimiento">Fecha de nacimiento:</label>
        <input bind:value={fechaNacimiento}  class="input" type="date" placeholder="Ingrese fecha de nacimiento del cliente" name="fechaNacimiento" required>

        <label class="label" for="direccion">Dirección:</label>
        <input bind:value={direccion} class="input" type="text" placeholder="Ingrese dirección del cliente" name="direccion" required>

        <label class="label" for="dni">Teléfono:</label>
        <input bind:value={telefono} class="input" type="text" placeholder="Ingrese teléfono del cliente" name="telefono" required>

        <button class="btn rounded-lg variant-filled-primary    " type="submit">Login</button>
    </form>
</div>