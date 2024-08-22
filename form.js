document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');
    const result = document.getElementById('result');

    function initForm() {
        if (form && result) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const formData = new FormData(form);
                const object = Object.fromEntries(formData);
                const json = JSON.stringify(object);
                
                result.innerHTML = "Un momento...";
                result.className = ""; 
                result.style.display = "block";
                
                setTimeout(() => {
                    result.classList.add("show");
                }, 10); 
                
                fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                })
                .then(async (response) => {
                    let json = await response.json();
                    if (response.status == 200) {
                        result.innerHTML = "Formulario enviado correctamente";
                        result.className = "success show";
                    } else {
                        console.log(response);
                        result.innerHTML = json.message;
                        result.className = "error show";
                    }
                })
                .catch(error => {
                    console.log(error);
                    result.innerHTML = "¡Algo fue mal! Inténtelo otra vez";
                    result.className = "error show";
                })
                .then(function() {
                    form.reset();
                    setTimeout(() => {
                        result.classList.remove("show");
                    }, 3000);
                });
            });
        } else {
            console.error('Formulario o elemento de resultado no encontrado');
        }
    }

    initForm();
});