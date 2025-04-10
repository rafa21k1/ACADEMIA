
    (function(){emailjs.init("6TF1Tug42cmB_gT-r")})(); // Cargamos EmailJS con el Key


    const form = document.getElementById("form")
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Evita el envío del formulario por defecto

        const formData = new FormData(form);
        const datosInputs = Object.fromEntries(formData);
        const provincia = document.getElementById("userProvince").value;

        datosInputs.provincia = provincia; // Agrega la provincia a los datos de entrada
        

        // Cargamos el ServiceId y el TemplateId de EmailJS
        emailjs.send("service_suzf1qp", "template_ks9915v", datosInputs)
            .then(function(response) {
                console.log("Correo enviado con éxito:", response);
            }, function(error) {
                console.error("Error al enviar el correo:", error.text);
            });
    });