const form = document.getElementById("form");

if (form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const status = document.getElementById("form-status");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!submitBtn || !status) {
            throw new Error("The contact form is missing its submit button or status message.");
        }

        const fields = [...form.querySelectorAll("input, textarea")];
        const emptyField = fields.find((field) => !field.value.trim());

        if (emptyField) {
            status.textContent = "Please fill in all fields before sending.";
            emptyField.focus();
            return;
        }

        const email = form.querySelector('input[type="email"]');
        if (email && !email.validity.valid) {
            status.textContent = "Please enter a valid email address.";
            email.focus();
            return;
        }

        const formData = new FormData(form);
        formData.append("access_key", "d10de4fa-7750-445e-bfb6-7fb7b934154f");

        const originalText = submitBtn.textContent;
        status.textContent = "";
        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Your message could not be sent. Please try again.");
            }

            status.textContent = "Your message has been sent. Thank you!";
            form.reset();
        } catch (error) {
            status.textContent = error instanceof Error
                ? error.message
                : "Something went wrong. Please try again.";
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}
