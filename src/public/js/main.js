/**
 * Main JavaScript
 * @file main.js
 * @description Funcionalidades principales del cliente
 */

document.addEventListener('DOMContentLoaded', () => {
    // Auto-ocultar alertas después de 5 segundos
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });

    // Confirmación para acciones destructivas
    const deleteButtons = document.querySelectorAll('[data-delete-confirm]');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (!confirm('¿Estás seguro de que deseas eliminar este elemento?')) {
                e.preventDefault();
            }
        });
    });

    // Validación de URL en tiempo real
    const urlInputs = document.querySelectorAll('input[type="url"]');
    urlInputs.forEach(input => {
        input.addEventListener('blur', (e) => {
            const url = e.target.value;
            if (url && !url.match(/^https?:\/\//)) {
                e.target.value = 'https://' + url;
            }
        });
    });

    console.log('Favorites Links App initialized');
});
