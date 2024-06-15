document.addEventListener('DOMContentLoaded', function() {
    // Variables globales para almacenar los usuarios registrados
    let usuariosRegistrados = [];

    // Selección de elementos del DOM
    const formRegistro = document.getElementById('formRegistro');
    const modalConfirmacion = document.getElementById('modal-confirmacion');
    const btnAgregar = document.getElementById('confirmar-agregar');
    const btnLimpiar = document.getElementById('limpiarFormulario');
    const usuariosGrid = document.getElementById('usuarios-grid');

    // Función para validar todos los campos del formulario
    function validarFormulario() {
        const nombre = formRegistro.nombre.value.trim();
        const apellido = formRegistro.apellido.value.trim();
        const fechaNacimiento = new Date(formRegistro.fecha_nacimiento.value);
        const email = formRegistro.email.value.trim();
        const cargo = formRegistro.cargo.value;
        const fechaIngreso = new Date(formRegistro.fecha_ingreso.value);

        // Validación de campos vacíos
        if (nombre === '' || apellido === '' || email === '' || cargo === '' ||
            isNaN(fechaNacimiento.getTime()) || isNaN(fechaIngreso.getTime())) {
            alert('Por favor, completa todos los campos correctamente.');
            return false;
        }

        // Validación de correo único
        const correoExistente = usuariosRegistrados.find(usuario => usuario.email === email);
        if (correoExistente) {
            alert('Este correo electrónico ya está registrado.');
            return false;
        }

        // Validación de edad mínima de ingreso (más de 18 años)
        const edadMinima = new Date();
        edadMinima.setFullYear(edadMinima.getFullYear() - 18);
        if (fechaNacimiento > edadMinima) {
            alert('Debes tener al menos 18 años para registrarte.');
            return false;
        }

        return true;
    }

    // Evento al enviar el formulario
    formRegistro.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar envío automático del formulario

        // Validar formulario antes de proceder
        if (validarFormulario()) {
            // Llenar datos de confirmación en el modal
            const nombre = formRegistro.nombre.value.trim();
            const apellido = formRegistro.apellido.value.trim();
            const email = formRegistro.email.value.trim();
            const cargoSeleccionado = formRegistro.cargo.options[formRegistro.cargo.selectedIndex].text;
            const fechaIngreso = formRegistro.fecha_ingreso.value;

            const listaConfirmacion = `
                <li><strong>Nombre:</strong> ${nombre} ${apellido}</li>
                <li><strong>Correo electrónico:</strong> ${email}</li>
                <li><strong>Cargo:</strong> ${cargoSeleccionado}</li>
                <li><strong>Fecha de Ingreso:</strong> ${fechaIngreso}</li>
            `;

            document.getElementById('datos-confirmacion').innerHTML = listaConfirmacion;

            
            $('#modal-confirmacion').modal('show');
        }
    });

    // Evento al confirmar la inserción de usuario desde el modal
    btnAgregar.addEventListener('click', function() {
        // Obtener datos del formulario
        const nombre = formRegistro.nombre.value.trim();
        const apellido = formRegistro.apellido.value.trim();
        const email = formRegistro.email.value.trim();
        const cargo = formRegistro.cargo.value;
        const fechaIngreso = formRegistro.fecha_ingreso.value;

        
        const nuevoUsuario = { nombre, apellido, email, cargo, fechaIngreso };
        usuariosRegistrados.push(nuevoUsuario);

        
        actualizarUsuariosGrid();

        
        formRegistro.reset();

        
        $('#modal-confirmacion').modal('hide');
    });

    // Evento para limpiar el formulario
    btnLimpiar.addEventListener('click', function() {
        formRegistro.reset();
    });

    // Función para actualizar la cuadrícula de usuarios
    function actualizarUsuariosGrid() {
        usuariosGrid.innerHTML = ''; 

        usuariosRegistrados.forEach(usuario => {
            const cardUsuario = document.createElement('div');
            cardUsuario.classList.add('card', 'col-md-3', 'mb-4');

            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');

            const nombreApellido = document.createElement('h5');
            nombreApellido.classList.add('card-title');
            nombreApellido.textContent = `${usuario.nombre} ${usuario.apellido}`;

            const correo = document.createElement('p');
            correo.classList.add('card-text');
            correo.textContent = `Correo: ${usuario.email}`;

            const cargo = document.createElement('p');
            cargo.classList.add('card-text');
            cargo.textContent = `Cargo: ${usuario.cargo}`;

            const fechaIngreso = document.createElement('p');
            fechaIngreso.classList.add('card-text');
            fechaIngreso.textContent = `Fecha de Ingreso: ${usuario.fechaIngreso}`;

            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'btn-sm', 'mt-2');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.addEventListener('click', function() {
                eliminarUsuario(usuario);
            });

            cardBody.appendChild(nombreApellido);
            cardBody.appendChild(correo);
            cardBody.appendChild(cargo);
            cardBody.appendChild(fechaIngreso);
            cardBody.appendChild(btnEliminar);

            cardUsuario.appendChild(cardBody);
            usuariosGrid.appendChild(cardUsuario);
        });
    }

    // Función para eliminar un usuario de la cuadrícula
    function eliminarUsuario(usuario) {
        const indice = usuariosRegistrados.findIndex(u => u.email === usuario.email);
        if (indice !== -1) {
            usuariosRegistrados.splice(indice, 1);
            actualizarUsuariosGrid();
        }
    }
});