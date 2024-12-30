// Referencias al formulario de inicio de sesión
const loginForm = document.getElementById('login-form');

// Manejar el evento de envío del formulario
loginForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Evitar que el formulario recargue la página

  // Obtener valores ingresados por el usuario
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Verificar credenciales guardadas en localStorage
  const storedEmail = localStorage.getItem('email');
  const storedPassword = localStorage.getItem('password');

  if (email === storedEmail && password === storedPassword) {
    // Redirigir al main si las credenciales son correctas
    window.location.href = 'main.html';
  } else {
    // Mostrar un mensaje de error
    alert('Correo o contraseña incorrectos. Por favor, intenta de nuevo.');
  }
});
