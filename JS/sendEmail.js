
    (function(){emailjs.init("U76eoEH78vDjQq9lT")})(); // Cargamos EmailJS con el Key

    const form = document.getElementById("form")
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Evita el envío del formulario por defecto

        const formData = new FormData(form);
        const datosInputs = Object.fromEntries(formData);
        const provincia = document.getElementById("userProvince").value;
        datosInputs.provincia = provincia; // Agrega la provincia a los datos de entrada
        

        // Cargamos el ServiceId y el TemplateId de EmailJS
        emailjs.send("service_vx78nrt", "template_249jsef", datosInputs)
            .then(function(response) {
                alert("Ya lo tienes, hemos enviado tu solicitud a la academia, nos ponderemos en contacto contigo lo antes posible.");
                console.log("Correo enviado con éxito:", response);
            }, function(error) {
                alert("Lo sentimos a ocurrido un error, por favor vuelve a intentarlo más tarde.");
                console.error("Error al enviar el correo:", error.text);
            });
    });