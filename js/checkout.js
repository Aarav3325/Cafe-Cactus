document.addEventListener("DOMContentLoaded", () => {
    // Get elements
    const orderItemsContainer = document.getElementById("orderItems");
    const orderSummaryContainer = document.getElementById("orderSummary");
    const paymentMethods = document.querySelectorAll(".payment-method");
    const paymentMethodInput = document.getElementById("paymentMethod");
    const checkoutForm = document.getElementById("checkoutForm");
    const usernameElement = document.getElementById("username");
    
    // Get cart data from localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const username = localStorage.getItem("username") || "Aarav";

    
    // Update username display
    if (usernameElement) {
        usernameElement.textContent = username;
    }
    
    // Update cart count
    updateCartCount();
    
    // Render order summary
    renderOrderSummary();
    
    // Set up payment method selection
    paymentMethods.forEach(method => {
        method.addEventListener("click", () => {
            // Remove selected class from all methods
            paymentMethods.forEach(m => m.classList.remove("selected"));
            
            // Add selected class to clicked method
            method.classList.add("selected");
            
            // Update hidden input value
            paymentMethodInput.value = method.getAttribute("data-method");
        });
    });
    
    // Handle form submission
    checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Show loading state
        const submitButton = checkoutForm.querySelector("button[type='submit']");
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = "Processing...";
        submitButton.disabled = true;
        
        // Collect form data
        const formData = new FormData(checkoutForm);
        
        // Create order object
        const order = {
            customer: {
                firstName: formData.get("firstName"),
                lastName: formData.get("lastName"),
                email: formData.get("email"),
                phone: formData.get("phone")
            },
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: parseFloat(item.price.replace(/[^\d.]/g, '')),
                quantity: item.quantity
            })),
            instructions: formData.get("instructions"),
            paymentMethod: formData.get("paymentMethod"),
            subtotal: calculateSubtotal(),
            tax: calculateSubtotal() * 0.05,
            total: calculateTotal(),
            status: "pending",
            username: username,
            orderId: generateOrderId(),
            orderDate: new Date().toISOString()
        };

        console.log(order.username)
        
        // Send order to backend
        fetch('http://localhost:5000/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Clear cart
            localStorage.removeItem("cart");
            
            // Show success message
            showToast("Order placed successfully!");
            
            // Redirect to confirmation page
            setTimeout(() => {
                window.location.href = `/order-confirmation.html?orderId=${data.orderId}`;
            }, 1500);
        })
        .catch(error => {
            console.error('Error:', error);
            showToast("Failed to place order. Please try again.", "error");
            
            // Reset button
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        });
    });
    
    // Function to render order summary
    function renderOrderSummary() {
        if (cart.length === 0) {
            // Redirect to cart if empty
            window.location.href = "/cart.html";
            return;
        }
        
        // Calculate totals
        const subtotal = calculateSubtotal();
        const tax = subtotal * 0.05; // 5% tax
        const total = calculateTotal();
        
        // Render order items
        orderItemsContainer.innerHTML = cart.map(item => `
            <div class="order-item">
                <div class="order-item-quantity">${item.quantity}x</div>
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-price">₹${(parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');
        
        // Render order summary
        orderSummaryContainer.innerHTML = `
            <div class="summary-item">
                <span>Subtotal</span>
                <span>₹${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-item">
                <span>Tax (5%)</span>
                <span>₹${tax.toFixed(2)}</span>
            </div>
            <div class="summary-item summary-total">
                <span>Total</span>
                <span>₹${total.toFixed(2)}</span>
            </div>
        `;
    }
    
    // Helper functions
    function calculateSubtotal() {
        return cart.reduce((total, item) => {
            const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
            return total + (price * item.quantity);
        }, 0);
    }
    
    function calculateTotal() {
        const subtotal = calculateSubtotal();
        
        const tax = subtotal * 0.05; // 5% tax
        return subtotal + tax;
    }
    
    function updateCartCount() {
        let cartCount = document.querySelector(".cart-count");
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        if (cartCount) {
            if (totalItems > 0) {
                cartCount.textContent = totalItems;
                cartCount.style.display = "flex";
            } else {
                cartCount.style.display = "none";
            }
        }
    }
    
    function generateOrderId() {
        // Generate a simple order ID: CC-TIMESTAMP-RANDOM
        return `CC-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    }

    function showToast(message, type = "success") {
        // Create toast if it doesn't exist
        let toast = document.getElementById("toast-notification");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "toast-notification";
            document.body.appendChild(toast);
            
            // Add styles for toast
            toast.style.position = "fixed";
            toast.style.bottom = "20px";
            toast.style.right = "20px";
            toast.style.padding = "12px 24px";
            toast.style.borderRadius = "4px";
            toast.style.zIndex = "1000";
            toast.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
            toast.style.transition = "opacity 0.3s ease-in-out";
            toast.style.opacity = "0";
        }
        
        // Set color based on type
        toast.style.backgroundColor = type === "success" ? "#4CAF50" : "#F44336";
        toast.style.color = "white";
        
        // Set message and show toast
        toast.textContent = message;
        toast.style.opacity = "1";
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.style.opacity = "0";
        }, 3000);
    }
});