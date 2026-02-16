
export const FormValidator = {
    validateRequired(form) {
        let valid = true;

        form.querySelectorAll('[required]').forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('is-invalid');
                valid = false;
            } else {
                input.classList.remove('is-invalid');
            }
        });

        return valid;
    },

    validateEmail(emailField) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = regex.test(emailField.value);

        emailField.classList.toggle('is-invalid', !isValid);
        return isValid;
    }
};
