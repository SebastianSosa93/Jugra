const Auth = (() => {
    let accessToken = null;

    return {
        setToken: (token) => {
            accessToken = token;
        },
        getToken: () => accessToken,
        clearToken: () => {
            accessToken = null;
        },

        async refreshToken(){
            try{
                const response = await fetch('http://localhost:3000/refresh-token',{
                method:'POST',
                credentials: 'include', //importante para enviar cookies httpOnly.
                });
                alert(`response reftoken: ${response}`);
                if(!response.ok){
                    alert('error');
                    throw new Error('No se pudo refrescar el token');
                }

                const data = await response.json();
                this.setToken(data.accessToken); //guardamos el nuevo accessToken en memoria.
                alert('se guardó el nuevo accessToken',data.accessToken);
                return data.accessToken;
            }catch (error){
                alert('error al refrescar');
                console.error('Error al refrescar el token', error);
                return null;
            }
        },

    };
})();


export default Auth;