function loadAllOrders() {
    const container = document.getElementById("ordersContainer");
    container.innerHTML = "";

    const keys = Object.keys(localStorage).filter(key => key.startsWith("order_"));
    const orders = keys.map(key => JSON.parse(localStorage.getItem(key)));

    const searchValue = document.getElementById("searchInput").value.toLowerCase();

    const filteredOrders = orders.filter(order =>
        order.orderId.toLowerCase().includes(searchValue) ||
        order.customer.firstName.toLowerCase().includes(searchValue)
    );

    if (filteredOrders.length === 0) {
        container.innerHTML = "<p>No orders found.</p>";
        return;
    }

    filteredOrders.forEach(order => {
        const div = document.createElement("div");
        div.className = "order-card";

        div.innerHTML = `
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Name:</strong> ${order.customer.firstName} ${order.customer.lastName}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Total:</strong> ₹${order.total}</p>
            <p><strong>Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>

            <div class="order-actions">
                <button onclick="changeStatus('${order.orderId}')">Change Status</button>
                <button onclick="deleteOrder('${order.orderId}')">Delete</button>
                <button onclick="alert(JSON.stringify(${JSON.stringify(order)}, null, 2))">View Details</button>
            </div>
        `;

        container.appendChild(div);
    });
}

function changeStatus(orderId) {
    const key = `order_${orderId}`;
    const order = JSON.parse(localStorage.getItem(key));

    const nextStatus = prompt("Enter new status (e.g., preparing, delivered):", order.status);
    if (nextStatus) {
        order.status = nextStatus.toLowerCase();
        localStorage.setItem(key, JSON.stringify(order));
        loadAllOrders();
    }
}

function deleteOrder(orderId) {
    if (confirm("Are you sure you want to delete this order?")) {
        localStorage.removeItem(`order_${orderId}`);
        loadAllOrders();
    }
}

document.getElementById("searchInput").addEventListener("input", loadAllOrders);
window.onload = loadAllOrders;

