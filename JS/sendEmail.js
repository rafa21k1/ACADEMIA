
    (function(){emailjs.init("U76eoEH78vDjQq9lT")})(); // Cargamos EmailJS con el Key

    function validarEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    return regex.test(email);
    }

    function validarTelefono(telefono) {
    const regex = /^(?:\+34|0034)?[6789]\d{8}$/;
    return regex.test(telefono);
    }

    function validarNombre(nombre) {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/;
    return regex.test(nombre);
    }

    const form = document.getElementById("form")
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Evita el envío del formulario por defecto

        // Validar los campos del formulario
        const email = document.getElementById("userEmail").value.trim();
        const contactphone = document.getElementById("userContact").value.trim();
        const nombres = document.getElementById("firstname").value.trim();
        const apellidos = document.getElementById("lastname").value.trim();

        if (!nombres || !validarNombre(nombres)) {
            const nameInput = document.getElementById("firstname");
            nameInput.setAttribute("style", "border: 2px solid red; background-color: #ffe6e6;");
            nameInput.setAttribute("placeholder", "Por favor, ingresa un nombre válido");
            nameInput.value = ""; // Limpia el valor actual del campo
            return;
        }

        if (!apellidos || !validarNombre(apellidos)) {
            const lastNameInput = document.getElementById("lastname");
            lastNameInput.setAttribute("style", "border: 2px solid red; background-color: #ffe6e6;");
            lastNameInput.setAttribute("placeholder", "Por favor, ingresa un apellido válido");
            lastNameInput.value = ""; // Limpia el valor actual del campo
            return;
        }

        if (!email || !validarEmail(email)) {
            const emailInput = document.getElementById("userEmail");
            emailInput.setAttribute("style", "border: 2px solid red; background-color: #ffe6e6;");
            emailInput.setAttribute("placeholder", "Por favor, ingresa un correo válido");
            emailInput.value = ""; // Limpia el valor actual del campo
            return;
        }
        if (!contactphone || !validarTelefono(contactphone)) {
            const contactInput = document.getElementById("userContact");
            contactInput.setAttribute("style", "border: 2px solid red; background-color: #ffe6e6;");
            contactInput.setAttribute("placeholder", "Por favor, ingresa un número de contacto válido");
            contactInput.value = ""; // Limpia el valor actual del campo
            return;
        }
        

        const formData = new FormData(form);
        const datosInputs = Object.fromEntries(formData);
        const provincia = document.getElementById("userProvince").value;
        datosInputs.provincia = provincia; // Agrega la provincia a los datos de entrada
        

        // Cargamos el ServiceId y el TemplateId de EmailJS
        emailjs.send("service_vx78nrt", "template_249jsef", datosInputs)
            .then(function(response) {
                alert("Ya lo tienes, hemos enviado tu solicitud a la academia, nos ponderemos en contacto contigo lo antes posible.");
                console.log("Correo enviado con éxito:", response);
                form.reset(); // Limpia el formulario después de enviar
            }, function(error) {
                alert("Lo sentimos a ocurrido un error, por favor vuelve a intentarlo más tarde.");
                console.error("Error al enviar el correo:", error.text);
            });
    });
    