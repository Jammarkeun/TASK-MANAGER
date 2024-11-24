document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    Toastify({
                        text: "Account created successfully!",
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        backgroundColor: "var(--orange)"
                    }).showToast();

                    setTimeout(() => {
                        window.location.href = '/pages/dashboard.html';
                    }, 1500);
                } else {
                    throw new Error(data.message);
                }
            } catch (error) {
                Toastify({
                    text: error.message || "An error occurred",
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "#ff3333"
                }).showToast();
            }
        });
    }
});
