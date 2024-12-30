// Referencias al formulario de registro
const registerForm = document.getElementById('register-form');

// Manejar el evento de envío del formulario
registerForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Evitar que el formulario recargue la página

  // Obtener los valores ingresados
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  // Verificar si las contraseñas coinciden
  if (password !== confirmPassword) {
    alert('Las contraseñas no coinciden. Intenta de nuevo.');
    return;
  }

  // Guardar las credenciales en localStorage
  localStorage.setItem('email', email);
  localStorage.setItem('password', password);

  // Redirigir al formulario de inicio de sesión
 
  window.location.href = 'login.html';
});
