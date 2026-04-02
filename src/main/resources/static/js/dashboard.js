document.addEventListener('DOMContentLoaded', () => {
    const user = Api.getUser();
    if (!user) {
        window.location.href = '/login.html';
        return;
    }

    document.getElementById('user-name').textContent = user.username;
    document.getElementById('user-role').textContent = user.role;

    setupSidebar(user.role);
    loadOverview(user.role);
});

function setupSidebar(role) {
    const nav = document.getElementById('sidebar-nav');
    let items = [];

    if (role === 'CUSTOMER') {
        items = [
            { id: 'overview', icon: 'fa-home', text: 'Overview', action: () => loadOverview(role) },
            { id: 'bookings', icon: 'fa-calendar-alt', text: 'My Bookings', action: loadCustomerBookings },
            { id: 'browse', icon: 'fa-search', text: 'Find Services', action: () => window.location.href='/' }
        ];
    } else if (role === 'PROVIDER') {
        items = [
            { id: 'overview', icon: 'fa-chart-line', text: 'Overview', action: () => loadOverview(role) },
            { id: 'services', icon: 'fa-box', text: 'My Services', action: loadProviderServices },
            { id: 'requests', icon: 'fa-bell', text: 'Booking Requests', action: loadProviderBookings }
        ];
    } else if (role === 'ADMIN') {
        items = [
            { id: 'overview', icon: 'fa-tachometer-alt', text: 'Dashboard', action: () => loadOverview(role) },
            { id: 'providers', icon: 'fa-user-check', text: 'Manage Providers', action: loadAdminProviders },
            { id: 'categories', icon: 'fa-tags', text: 'Categories', action: () => window.showToast('Admin categories management coming soon.', 'info') }
        ];
    }

    let html = '';
    items.forEach(item => {
        html += `<a href="#" data-id="${item.id}" class="sidebar-item flex items-center text-gray-600 hover:text-primary hover:bg-indigo-50 px-6 py-4 font-medium transition">
                    <i class="fa-solid ${item.icon} w-6 text-lg"></i> ${item.text}
                 </a>`;
    });
    nav.innerHTML = html;

    // Attach events
    nav.querySelectorAll('.sidebar-item').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            nav.querySelectorAll('.sidebar-item').forEach(n => n.classList.remove('active'));
            el.classList.add('active');
            const id = el.getAttribute('data-id');
            const target = items.find(i => i.id === id);
            if (target && target.action) {
                target.action();
            }
        });
    });

    // Default active
    nav.querySelector('.sidebar-item').classList.add('active');
}

function updateTitle(title) {
    document.getElementById('page-title').textContent = title;
}

// ----------------------------------------
// VIEWS
// ----------------------------------------

function loadOverview(role) {
    updateTitle('Overview');
    const content = document.getElementById('main-content');
    
    if (role === 'CUSTOMER') {
        content.innerHTML = `
            <div class="bg-white p-8 rounded-2xl shadow-sm mb-6 border border-gray-100">
                <h2 class="text-2xl font-bold mb-2">Welcome, ${Api.getUser().username}!</h2>
                <p class="text-gray-600">Find and book the perfect services for your upcoming events.</p>
                <button onclick="window.location.href='/'" class="mt-4 bg-primary text-white py-2 px-6 rounded-lg font-bold shadow hover:bg-indigo-600 transition">
                    Browse Services
                </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center cursor-pointer hover:shadow-md transition" onclick="document.querySelector('[data-id=\\'bookings\\']').click()">
                    <div class="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mr-4">
                        <i class="fa-solid fa-calendar-check text-2xl"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-800 text-lg">View Bookings</h3>
                        <p class="text-sm text-gray-500">Check your booking statuses</p>
                    </div>
                </div>
            </div>
        `;
    } else if (role === 'PROVIDER') {
        const pStatus = Api.getUser().providerStatus || 'PENDING';
        let alertHtml = '';
        if (pStatus === 'PENDING') {
            alertHtml = `<div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6"><div class="flex"><div class="flex-shrink-0"><i class="fa-solid fa-clock text-yellow-500"></i></div><div class="ml-3"><p class="text-sm text-yellow-700 font-medium">Your account is currently Pending approval by an administrator. You cannot post services yet.</p></div></div></div>`;
        } else if (pStatus === 'REJECTED') {
            alertHtml = `<div class="bg-red-50 border-l-4 border-red-400 p-4 mb-6"><div class="flex"><div class="flex-shrink-0"><i class="fa-solid fa-ban text-red-500"></i></div><div class="ml-3"><p class="text-sm text-red-700 font-medium">Your provider account application was rejected.</p></div></div></div>`;
        }

        content.innerHTML = alertHtml + `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <div class="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mr-4">
                        <i class="fa-solid fa-bell text-2xl"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-800 text-xl">Manage Requests</h3>
                        <p class="text-sm text-gray-500 font-medium">Approve or reject bookings</p>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <div class="w-16 h-16 bg-purple-100 text-purple-500 rounded-full flex items-center justify-center mr-4">
                        <i class="fa-solid fa-box text-2xl"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-800 text-xl">My Services</h3>
                        <p class="text-sm text-gray-500 font-medium">Add and update services</p>
                    </div>
                </div>
            </div>
        `;
    } else {
        content.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center cursor-pointer hover:shadow-md transition" onclick="document.querySelector('[data-id=\\'providers\\']').click()">
                    <div class="w-16 h-16 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center mr-4">
                        <i class="fa-solid fa-user-check text-2xl"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-800 text-xl">Manage Providers</h3>
                        <p class="text-sm text-gray-500 font-medium">Review pending provider applications</p>
                    </div>
                </div>
            </div>
        `;
    }
}

async function loadCustomerBookings() {
    updateTitle('My Bookings');
    const content = document.getElementById('main-content');
    content.innerHTML = '<p class="text-gray-500 animate-pulse text-center mt-10">Loading bookings...</p>';

    try {
        const bookings = await Api.get('/bookings/customer');
        if (bookings.length === 0) {
            content.innerHTML = `
                <div class="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100">
                    <i class="fa-solid fa-folder-open text-gray-300 text-5xl mb-4"></i>
                    <p class="text-gray-500 font-medium text-lg">You haven't made any bookings yet.</p>
                </div>
            `;
            return;
        }

        let html = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">';
        bookings.forEach(b => {
            const statusColor = b.status === 'CONFIRMED' ? 'green' : (b.status === 'PENDING' ? 'yellow' : 'red');
            const pName = (b.service.provider?.name || 'Not Provided').replace(/'/g, "\\'");
            const pEmail = (b.service.provider?.email || 'Not Provided').replace(/'/g, "\\'");
            const pPhone = (b.service.provider?.phoneNumber || 'Not Provided').replace(/'/g, "\\'");
            html += `
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition">
                    <div class="flex justify-between items-start mb-4">
                        <h3 class="font-bold text-lg text-gray-800 line-clamp-1">${b.service.title}</h3>
                        <span class="bg-${statusColor}-100 text-${statusColor}-600 text-xs font-bold px-3 py-1 rounded-full uppercase shrink-0">${b.status}</span>
                    </div>
                    <div class="text-sm text-gray-600 space-y-2 mb-6 flex-grow">
                        <p><i class="fa-solid fa-calendar mr-2 w-4 text-center"></i> ${b.startDate} ${b.endDate ? 'to ' + b.endDate : ''}</p>
                        ${b.startTime ? `<p><i class="fa-solid fa-clock mr-2 w-4 text-center"></i> ${b.startTime} - ${b.endTime}</p>` : ''}
                        <p><i class="fa-solid fa-tag mr-2 w-4 text-center"></i> ₹${b.totalPrice}</p>
                    </div>
                    <div class="mt-auto space-y-2">
                        <button onclick="openVendorModal('${pName}', '${pEmail}', '${pPhone}')" class="w-full bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-primary font-medium py-2 rounded-lg transition duration-200 text-sm border border-gray-100">
                            <i class="fa-solid fa-user-tie mr-1"></i> Provider Details
                        </button>
                        ${b.status === 'PENDING' ? `<button onclick="updateBooking(${b.id}, 'CANCELLED')" class="w-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white font-medium py-2 rounded-lg transition duration-200 text-sm">Cancel Booking</button>` : ''}
                        ${b.status === 'CONFIRMED' ? `<button onclick="showReviewModal(${b.id})" class="w-full bg-indigo-50 text-primary hover:bg-primary hover:text-white font-medium py-2 rounded-lg transition duration-200 text-sm">Add Review</button>` : ''}
                    </div>
                </div>
            `;
        });
        html += '</div>';
        content.innerHTML = html;
    } catch (e) {
        content.innerHTML = `<p class="text-red-500">${e.message}</p>`;
    }
}

async function loadProviderBookings() {
    updateTitle('Booking Requests');
    const content = document.getElementById('main-content');
    content.innerHTML = '<p class="text-gray-500 animate-pulse text-center mt-10">Loading requests...</p>';

    try {
        const bookings = await Api.get('/bookings/provider');
        if (bookings.length === 0) {
            content.innerHTML = `<div class="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100"><p class="text-gray-500 font-medium">No booking requests found.</p></div>`;
            return;
        }

        let html = '<div class="space-y-4">';
        bookings.forEach(b => {
            const statusColor = b.status === 'CONFIRMED' ? 'green' : (b.status === 'PENDING' ? 'yellow' : 'red');
            html += `
                <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center md:items-start gap-4 hover:border-gray-300 transition">
                    <div class="flex-grow text-center md:text-left">
                        <div class="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                             <h3 class="font-bold text-xl text-gray-800">${b.service.title}</h3>
                             <span class="bg-${statusColor}-100 text-${statusColor}-600 text-xs font-bold px-3 py-1 rounded-full uppercase inline-block">${b.status}</span>
                        </div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100 my-3">
                            <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Customer Details</p>
                            <div class="space-y-1.5 text-sm text-gray-700">
                                <p><i class="fa-solid fa-user text-blue-500 w-5 text-center"></i> <span class="font-medium text-gray-800">${b.customer.name}</span></p>
                                <p><i class="fa-solid fa-envelope text-red-500 w-5 text-center"></i> <a href="mailto:${b.customer.email}" class="hover:text-primary transition">${b.customer.email}</a></p>
                                <p><i class="fa-solid fa-phone text-green-500 w-5 text-center"></i> <a href="tel:${b.customer.phoneNumber || ''}" class="hover:text-primary transition">${b.customer.phoneNumber || 'Not provided'}</a></p>
                            </div>
                        </div>
                        <p class="text-sm text-gray-500 font-medium">
                            <i class="fa-solid fa-calendar-day text-indigo-400 mr-2"></i> ${b.startDate} ${b.endDate ? 'to ' + b.endDate : ''} 
                            ${b.startTime ? ` <br class="block md:hidden"> <i class="fa-solid fa-clock text-indigo-400 ml-0 md:ml-3 mr-2"></i> ${b.startTime} - ${b.endTime}` : ''}
                        </p>
                    </div>
                    <div class="flex gap-2 shrink-0">
                        ${b.status === 'PENDING' ? `
                            <button onclick="updateBooking(${b.id}, 'CONFIRMED')" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition"><i class="fa-solid fa-check mr-1"></i> Accept</button>
                            <button onclick="updateBooking(${b.id}, 'REJECTED')" class="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-bold transition">Reject</button>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        html += '</div>';
        content.innerHTML = html;
    } catch (e) {
        content.innerHTML = `<p class="text-red-500">${e.message}</p>`;
    }
}

async function loadProviderServices() {
    updateTitle('My Services');
    const content = document.getElementById('main-content');
    content.innerHTML = '<p class="text-gray-500 animate-pulse text-center mt-10">Loading services...</p>';

    try {
        const services = await Api.get('/services/provider');
        const pStatus = Api.getUser().providerStatus || 'PENDING';
        
        let html = '';
        if (pStatus === 'APPROVED') {
            html += `
                <div class="mb-6 flex justify-end">
                    <button onclick="showAddServiceForm()" class="bg-primary hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition">
                        <i class="fa-solid fa-plus mr-2"></i> Add New Service
                    </button>
                </div>
            `;
        } else {
            html += `<div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6"><p class="text-sm text-yellow-700 font-medium">You must be approved by an administrator to add new services. Your current status is: ${pStatus}</p></div>`;
        }
        
        if (services.length === 0) {
            html += `<div class="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100"><p class="text-gray-500 font-medium">You haven't added any services yet.</p></div>`;
            content.innerHTML = html;
            return;
        }

        html += '<div class="grid grid-cols-1 xl:grid-cols-2 gap-6">';
        services.forEach(s => {
            html += `
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 flex overflow-hidden hover:shadow-md transition">
                    <img src="${s.imageUrl || 'https://via.placeholder.com/150'}" class="w-1/3 object-cover">
                    <div class="p-6 flex flex-col flex-grow">
                        <div class="flex justify-between items-start mb-2">
                             <h3 class="font-bold text-xl text-gray-800">${s.title}</h3>
                             <span class="text-lg font-bold text-gray-600">₹${s.price}</span>
                        </div>
                         <p class="text-xs text-primary font-bold mb-2 uppercase tracking-wide">${s.category.name}</p>
                        <p class="text-sm text-gray-500 mb-4 line-clamp-2">${s.description}</p>
                        <div class="mt-auto flex gap-2 overflow-x-auto">
                             <button onclick="openReviewsListModal(${s.id}, '${s.title.replace(/'/g, "\\'")}')" class="flex-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 text-sm font-bold py-2 px-2 rounded-lg transition whitespace-nowrap"><i class="fa-solid fa-star text-yellow-500 mr-1"></i> Reviews</button>
                             <button onclick="showEditServiceForm(${s.id})" class="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-bold py-2 px-2 rounded-lg transition whitespace-nowrap"><i class="fa-solid fa-edit mr-1"></i> Edit</button>
                             <button onclick="deleteService(${s.id})" class="flex-1 bg-red-50 hover:bg-red-100 text-red-500 text-sm font-bold py-2 px-2 rounded-lg transition whitespace-nowrap"><i class="fa-solid fa-trash mr-1"></i> Delete</button>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        content.innerHTML = html;
    } catch (e) {
        content.innerHTML = `<p class="text-red-500">${e.message}</p>`;
    }
}

async function updateBooking(id, status) {
    const isConfirmed = await showCustomConfirm('Update Booking', `Are you sure you want to mark this booking as ${status}?`);
    if(!isConfirmed) return;
    try {
        await Api.put(`/bookings/${id}/status?status=${status}`);
        // Reload current view
        const activeNav = document.querySelector('.sidebar-item.active').getAttribute('data-id');
        if(activeNav === 'bookings') loadCustomerBookings();
        if(activeNav === 'requests') loadProviderBookings();
    } catch (e) {
        window.showToast("Error: " + e.message, 'error');
    }
}

function showReviewModal(bookingId) {
    document.getElementById('review-booking-id').value = bookingId;
    document.getElementById('review-rating-val').value = '5';
    document.getElementById('review-comment').value = '';
    
    document.querySelectorAll('.star-btn').forEach(s => {
        s.classList.remove('fa-regular', 'text-gray-300');
        s.classList.add('fa-solid', 'text-yellow-400');
    });

    const modal = document.getElementById('review-modal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.add('opacity-100');
        document.getElementById('review-modal-content').classList.remove('scale-95');
        document.getElementById('review-modal-content').classList.add('scale-100');
    }, 10);
}

function closeReviewModal() {
    const modal = document.getElementById('review-modal');
    modal.classList.remove('opacity-100');
    document.getElementById('review-modal-content').classList.remove('scale-100');
    document.getElementById('review-modal-content').classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

document.addEventListener('DOMContentLoaded', () => {
    const starContainer = document.getElementById('star-rating-container');
    if (starContainer) {
        const stars = starContainer.querySelectorAll('.star-btn');
        stars.forEach(star => {
            star.addEventListener('click', (e) => {
                const val = parseInt(e.target.getAttribute('data-val'));
                document.getElementById('review-rating-val').value = val;
                
                stars.forEach(s => {
                    if (parseInt(s.getAttribute('data-val')) <= val) {
                        s.classList.remove('fa-regular', 'text-gray-300');
                        s.classList.add('fa-solid', 'text-yellow-400');
                    } else {
                        s.classList.remove('fa-solid', 'text-yellow-400');
                        s.classList.add('fa-regular', 'text-gray-300');
                    }
                });
            });
        });

        document.getElementById('submit-review-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const bookingId = document.getElementById('review-booking-id').value;
            const rating = parseInt(document.getElementById('review-rating-val').value);
            const comment = document.getElementById('review-comment').value;

            try {
                await Api.post('/reviews', { bookingId, rating, comment });
                window.showToast('Review submitted successfully!', 'success');
                closeReviewModal();
            } catch (err) {
                window.showToast(err.message, 'error');
            }
        });
    }
});

async function deleteService(id) {
    const isConfirmed = await showCustomConfirm('Delete Service', 'Are you sure you want to delete this service? If it has active bookings, deletion may be blocked.');
    if(!isConfirmed) return;
    try {
        await Api.delete(`/services/${id}`);
        loadProviderServices();
    } catch(e) {
        window.showToast("Failed to delete. It might be linked to a customer's booking. " + e.message, 'error');
    }
}

async function showAddServiceForm() {
    updateTitle('Add New Service');
    const content = document.getElementById('main-content');
    
    // Fetch categories to populate dropdowns
    let categories = [];
    try { categories = await Api.get('/categories'); } catch(e){}

    let catOptions = categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

    content.innerHTML = `
        <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl">
            <h3 class="text-xl font-bold mb-6">Service Details</h3>
            <form id="add-service-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input type="text" id="svc-title" required class="w-full px-4 py-2 border rounded-lg focus:ring-primary outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea id="svc-desc" required rows="3" class="w-full px-4 py-2 border rounded-lg focus:ring-primary outline-none"></textarea>
                </div>
                <div class="grid grid-cols-1 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Category (1=Venue, 2=Food, 3=Decor, 4=Music)</label>
                        <input type="number" id="svc-cat" required class="w-full px-4 py-2 border rounded-lg focus:ring-primary outline-none" min="1" max="4" placeholder="1=Venue">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input type="text" id="svc-loc" required class="w-full px-4 py-2 border rounded-lg focus:ring-primary outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <input type="number" id="svc-price" required class="w-full px-4 py-2 border rounded-lg focus:ring-primary outline-none">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Booking Type</label>
                        <select id="svc-book-type" class="w-full px-4 py-2 border rounded-lg focus:ring-primary outline-none">
                            <option value="HOURLY">Hourly</option>
                            <option value="DAILY">Daily</option>
                            <option value="MULTI_DAY">Multi-Day</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input type="text" id="svc-img" class="w-full px-4 py-2 border rounded-lg focus:ring-primary outline-none" placeholder="https://...">
                    </div>
                </div>
                <div class="pt-4 flex gap-4">
                    <button type="submit" class="bg-primary hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg transition">Create Service</button>
                    <button type="button" onclick="loadProviderServices()" class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg transition">Cancel</button>
                </div>
            </form>
        </div>
    `;

    document.getElementById('add-service-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await Api.post('/services', {
                title: document.getElementById('svc-title').value,
                description: document.getElementById('svc-desc').value,
                categoryId: parseInt(document.getElementById('svc-cat').value),
                location: document.getElementById('svc-loc').value,
                price: parseFloat(document.getElementById('svc-price').value),
                bookingType: document.getElementById('svc-book-type').value,
                imageUrl: document.getElementById('svc-img').value
            });
            window.showToast('Service added successfully!', 'success');
            loadProviderServices();
        } catch(err) {
            window.showToast(err.message, 'error');
        }
    });
}

window.currentServicesCache = [];

// Monkeypatch loadProviderServices slightly to cache services for Edit
const originalLoadProviderServices = loadProviderServices;
loadProviderServices = async function() {
    await originalLoadProviderServices();
    try {
        window.currentServicesCache = await Api.get('/services/provider');
    } catch(e) {}
}

async function showEditServiceForm(id) {
    const service = window.currentServicesCache.find(s => s.id === id);
    if (!service) {
        window.showToast("Could not load service data.", 'error');
        return;
    }

    updateTitle('Edit Service');
    const content = document.getElementById('main-content');
    
    content.innerHTML = `
        <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl">
            <h3 class="text-xl font-bold mb-6">Edit Service Details</h3>
            <form id="edit-service-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input type="text" id="edit-svc-title" value="${service.title}" required class="w-full px-4 py-2 border rounded-lg focus:ring-primary outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea id="edit-svc-desc" required rows="3" class="w-full px-4 py-2 border rounded-lg focus:ring-primary outline-none">${service.description}</textarea>
                </div>
                <div class="grid grid-cols-1 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Category ID (1=Venue, 2=Food, 3=Decor, 4=Music)</label>
                        <input type="number" id="edit-svc-cat" value="${service.category.id}" required class="w-full px-4 py-2 border rounded-lg focus:ring-primary outline-none" min="1" max="4">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input type="text" id="edit-svc-loc" value="${service.location}" required class="w-full px-4 py-2 border rounded-lg focus:ring-primary outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <input type="number" id="edit-svc-price" value="${service.price}" required class="w-full px-4 py-2 border rounded-lg focus:ring-primary outline-none">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Booking Type</label>
                        <select id="edit-svc-book-type" class="w-full px-4 py-2 border rounded-lg focus:ring-primary outline-none">
                            <option value="HOURLY" ${service.bookingType === 'HOURLY' ? 'selected' : ''}>Hourly</option>
                            <option value="DAILY" ${service.bookingType === 'DAILY' ? 'selected' : ''}>Daily</option>
                            <option value="MULTI_DAY" ${service.bookingType === 'MULTI_DAY' ? 'selected' : ''}>Multi-Day</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input type="text" id="edit-svc-img" value="${service.imageUrl}" class="w-full px-4 py-2 border rounded-lg focus:ring-primary outline-none">
                    </div>
                </div>
                <div class="pt-4 flex gap-4">
                    <button type="submit" class="bg-primary hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg transition">Update Service</button>
                    <button type="button" onclick="loadProviderServices()" class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg transition">Cancel</button>
                </div>
            </form>
        </div>
    `;

    document.getElementById('edit-service-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await Api.put(`/services/${id}`, {
                title: document.getElementById('edit-svc-title').value,
                description: document.getElementById('edit-svc-desc').value,
                categoryId: parseInt(document.getElementById('edit-svc-cat').value),
                location: document.getElementById('edit-svc-loc').value,
                price: parseFloat(document.getElementById('edit-svc-price').value),
                bookingType: document.getElementById('edit-svc-book-type').value,
                imageUrl: document.getElementById('edit-svc-img').value
            });
            window.showToast('Service updated successfully!', 'success');
            loadProviderServices();
        } catch(err) {
            window.showToast(err.message, 'error');
        }
    });
}

async function openReviewsListModal(serviceId, serviceTitle) {
    document.getElementById('reviews-modal-title').textContent = `${serviceTitle} Reviews`;
    const container = document.getElementById('reviews-list-container');
    container.innerHTML = '<div class="text-center py-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></div>';
    
    const modal = document.getElementById('reviews-list-modal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.add('opacity-100');
        document.getElementById('reviews-list-modal-content').classList.remove('scale-95');
        document.getElementById('reviews-list-modal-content').classList.add('scale-100');
    }, 10);

    try {
        const reviews = await Api.get(`/reviews/service/${serviceId}`);
        if (reviews.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <i class="fa-regular fa-comment-dots text-5xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500 font-medium">No reviews yet.</p>
                </div>
            `;
            return;
        }

        let html = '<div class="space-y-4">';
        reviews.forEach(r => {
            let stars = '';
            for(let i=1; i<=5; i++) {
                stars += `<i class="fa-${i <= r.rating ? 'solid' : 'regular'} fa-star text-yellow-400 text-sm"></i>`;
            }
            html += `
                <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-bold text-gray-800"><i class="fa-solid fa-user-circle text-gray-400 mr-2"></i>${r.booking.customer.name}</span>
                        <div class="flex gap-1">${stars}</div>
                    </div>
                    <p class="text-gray-600 italic">"${r.comment}"</p>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    } catch(err) {
        container.innerHTML = `<p class="text-red-500 text-center py-4">Failed to load reviews.</p>`;
    }
}

function closeReviewsListModal() {
    const modal = document.getElementById('reviews-list-modal');
    modal.classList.remove('opacity-100');
    document.getElementById('reviews-list-modal-content').classList.remove('scale-100');
    document.getElementById('reviews-list-modal-content').classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// Vendor Logic
function openVendorModal(name, email, phone) {
    const modal = document.getElementById('vendor-modal');
    const content = document.getElementById('vendor-modal-content');
    
    content.innerHTML = `
        <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
            <h3 class="text-xl font-bold text-gray-800"><i class="fa-solid fa-user-tie text-primary mr-2"></i>Provider Details</h3>
            <button onclick="closeVendorModal()" class="text-gray-400 hover:text-gray-600 transition">
                <i class="fa-solid fa-times text-xl"></i>
            </button>
        </div>
        <div class="p-6 space-y-4">
            <div class="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <i class="fa-solid fa-user mr-4 text-xl text-blue-500 w-6 text-center"></i>
                <div>
                    <p class="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Company / Name</p>
                    <p class="font-medium text-lg">${name}</p>
                </div>
            </div>
            <div class="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <i class="fa-solid fa-phone mr-4 text-xl text-green-500 w-6 text-center"></i>
                <div>
                    <p class="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Phone Number</p>
                    <p class="font-medium text-lg"><a href="tel:${phone}" class="hover:text-primary transition">${phone}</a></p>
                </div>
            </div>
            <div class="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <i class="fa-solid fa-envelope mr-4 text-xl text-red-500 w-6 text-center"></i>
                <div>
                    <p class="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Email Address</p>
                    <p class="font-medium text-lg"><a href="mailto:${email}" class="hover:text-primary transition">${email}</a></p>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
    // small delay to allow transition
    setTimeout(() => {
        modal.classList.add('opacity-100');
        content.classList.remove('scale-95');
        content.classList.add('scale-100');
    }, 10);
}

function closeVendorModal() {
    const modal = document.getElementById('vendor-modal');
    const content = document.getElementById('vendor-modal-content');
    
    modal.classList.remove('opacity-100');
    content.classList.remove('scale-100');
    content.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// Custom Confirm UI
function showCustomConfirm(title, message) {
    return new Promise((resolve) => {
        const modal = document.getElementById('confirm-modal');
        const content = modal.querySelector('div.bg-white');
        
        document.getElementById('confirm-modal-title').textContent = title;
        document.getElementById('confirm-modal-message').textContent = message;
        
        const okBtn = document.getElementById('confirm-modal-ok');
        const cancelBtn = document.getElementById('confirm-modal-cancel');
        
        const newOkBtn = okBtn.cloneNode(true);
        const newCancelBtn = cancelBtn.cloneNode(true);
        okBtn.parentNode.replaceChild(newOkBtn, okBtn);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
        
        const cleanupAndResolve = (result) => {
            modal.classList.remove('opacity-100');
            content.classList.remove('scale-100');
            content.classList.add('scale-95');
            setTimeout(() => {
                modal.classList.add('hidden');
                resolve(result);
            }, 300);
        };
        
        newOkBtn.addEventListener('click', () => cleanupAndResolve(true));
        newCancelBtn.addEventListener('click', () => cleanupAndResolve(false));
        
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.add('opacity-100');
            content.classList.remove('scale-95');
            content.classList.add('scale-100');
        }, 10);
    });
}

// ----------------------------------------
// ADMIN FUNCTIONS
// ----------------------------------------

async function loadAdminProviders() {
    updateTitle('Manage Providers');
    const content = document.getElementById('main-content');
    content.innerHTML = '<p class="text-gray-500 animate-pulse text-center mt-10">Loading providers...</p>';

    try {
        const providers = await Api.get('/admin/providers');
        if (providers.length === 0) {
            content.innerHTML = `<div class="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100"><p class="text-gray-500 font-medium">No service providers found.</p></div>`;
            return;
        }

        let html = '<div class="overflow-x-auto"><table class="w-full bg-white rounded-xl shadow-sm border border-gray-100">';
        html += '<thead class="bg-gray-50 text-gray-500 text-sm text-left"><tr class="border-b"><th class="py-3 px-4 font-bold uppercase tracking-wider">Provider</th><th class="py-3 px-4 font-bold uppercase tracking-wider">Contact</th><th class="py-3 px-4 font-bold uppercase tracking-wider">Portfolio</th><th class="py-3 px-4 font-bold uppercase tracking-wider">Status</th><th class="py-3 px-4 font-bold uppercase tracking-wider text-right">Actions</th></tr></thead><tbody class="divide-y divide-gray-100">';
        
        providers.forEach(p => {
            let statusColor = p.providerStatus === 'APPROVED' ? 'green' : (p.providerStatus === 'PENDING' ? 'yellow' : 'red');
            let actions = '';
            if (p.providerStatus === 'PENDING') {
                actions = `
                    <button onclick="updateProviderStatus(${p.id}, 'approve')" class="text-green-600 hover:text-green-800 font-bold px-2 py-1 rounded transition"><i class="fa-solid fa-check"></i> Approve</button>
                    <button onclick="updateProviderStatus(${p.id}, 'reject')" class="text-red-600 hover:text-red-800 font-bold px-2 py-1 rounded transition"><i class="fa-solid fa-times"></i> Reject</button>
                `;
            } else if (p.providerStatus === 'REJECTED') {
                 actions = `<button onclick="updateProviderStatus(${p.id}, 'approve')" class="text-green-600 hover:text-green-800 font-bold px-2 py-1 rounded transition"><i class="fa-solid fa-check"></i> Approve</button>`;
            } else if (p.providerStatus === 'APPROVED') {
                actions = `<button onclick="updateProviderStatus(${p.id}, 'reject')" class="text-red-600 hover:text-red-800 font-bold px-2 py-1 rounded transition"><i class="fa-solid fa-times"></i> Revoke</button>`;
            }

            let portfolioLink = p.portfolioUrl ? `<a href="${p.portfolioUrl}" target="_blank" class="text-primary hover:underline"><i class="fa-solid fa-external-link-alt"></i> View</a>` : '<span class="text-gray-400">Not provided</span>';

            html += `
                <tr class="hover:bg-gray-50 transition">
                    <td class="py-4 px-4">
                        <div class="font-bold text-gray-800">${p.name}</div>
                        <div class="text-sm text-gray-500">@${p.username}</div>
                    </td>
                    <td class="py-4 px-4 text-sm text-gray-600">
                        <div>${p.email}</div>
                        <div>${p.phoneNumber || ''}</div>
                    </td>
                    <td class="py-4 px-4 text-sm">${portfolioLink}</td>
                    <td class="py-4 px-4">
                        <span class="bg-${statusColor}-100 text-${statusColor}-600 text-xs font-bold px-3 py-1 rounded-full uppercase inline-block">${p.providerStatus || 'PENDING'}</span>
                    </td>
                    <td class="py-4 px-4 text-right space-x-2">
                        ${actions}
                    </td>
                </tr>
            `;
        });
        html += '</tbody></table></div>';
        content.innerHTML = html;
    } catch (e) {
        content.innerHTML = `<p class="text-red-500 text-center">${e.message}</p>`;
    }
}

async function updateProviderStatus(id, action) {
    if (!await showCustomConfirm('Update Provider', `Are you sure you want to ${action} this provider?`)) return;
    try {
        await Api.put(`/admin/providers/${id}/${action}`);
        window.showToast('Provider status updated!', 'success');
        loadAdminProviders();
    } catch(e) {
        window.showToast(e.message, 'error');
    }
}
