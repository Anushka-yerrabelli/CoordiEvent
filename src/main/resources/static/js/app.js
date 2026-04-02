document.addEventListener('DOMContentLoaded', async () => {
    setupNavigation();
    
    if (document.getElementById('categories-container')) {
        await loadCategories();
        await loadServices();
        setupSearch();
    }
});

function setupNavigation() {
    const authButtons = document.getElementById('auth-buttons');
    if (!authButtons) return;

    const user = Api.getUser();
    if (user) {
        authButtons.innerHTML = `
            <a href="/dashboard.html" class="bg-gray-100 text-gray-800 hover:bg-gray-200 font-semibold py-2 px-4 rounded-lg transition duration-300">
                <i class="fa-solid fa-user-circle mr-1"></i> Dashboard
            </a>
            <button onclick="Api.logout()" class="text-red-500 hover:text-red-700 font-medium py-2 px-2 transition">
                Logout
            </button>
        `;
    } else {
        authButtons.innerHTML = `
            <a href="/login.html" class="text-gray-600 hover:text-primary font-medium py-2 px-2 transition">Sign In</a>
            <a href="/login.html" class="bg-primary hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 shadow-sm">Get Started</a>
        `;
    }
}

async function loadCategories() {
    try {
        const categories = await Api.get('/categories');
        const container = document.getElementById('categories-container');
        const select = document.getElementById('search-category');
        
        let html = '';
        categories.forEach(cat => {
            html += `
                <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden border border-gray-100 group" onclick="filterByCategory(${cat.id}, '${cat.name}')">
                    <div class="h-24 overflow-hidden relative">
                        <img src="${cat.imageUrl || 'https://via.placeholder.com/400x200?text=Category'}" alt="${cat.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                        <div class="absolute inset-0 bg-black bg-opacity-30"></div>
                        <h3 class="absolute inset-0 flex items-center justify-center text-xl font-bold text-white tracking-wide">${cat.name}</h3>
                    </div>
                </div>
            `;
            
            // Add to search dropdown
            if (select) {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                select.appendChild(option);
            }
        });
        
        container.innerHTML = html;
    } catch (e) {
        console.error(e);
        document.getElementById('categories-container').innerHTML = '<p class="text-red-500 col-span-full">Failed to load categories.</p>';
    }
}

async function loadServices(query = '') {
    try {
        const container = document.getElementById('services-container');
        container.innerHTML = '<div class="col-span-full py-12 text-center text-gray-500">Searching...</div>';
        
        const services = await Api.get(`/services${query}`);
        
        if (services.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <i class="fa-solid fa-box-open text-4xl text-gray-300 mb-3"></i>
                    <p class="text-gray-500 font-medium">No services found matching your criteria.</p>
                </div>
            `;
            return;
        }

        let html = '';
        services.forEach(serv => {
            const price = parseFloat(serv.price).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
            const pName = (serv.provider?.name || 'Not Provided').replace(/'/g, "\\'");
            const pEmail = (serv.provider?.email || 'Not Provided').replace(/'/g, "\\'");
            const pPhone = (serv.provider?.phoneNumber || 'Not Provided').replace(/'/g, "\\'");

            html += `
                <div class="bg-white rounded-2xl shadow-sm hover:shadow-lg transition duration-300 border border-gray-100 flex flex-col overflow-hidden">
                    <div class="h-48 overflow-hidden relative">
                        <img src="${serv.imageUrl || 'https://via.placeholder.com/400x300'}" class="w-full h-full object-cover">
                        <span class="absolute top-3 right-3 bg-white text-primary text-xs font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
                            ${serv.category.name}
                        </span>
                    </div>
                    <div class="p-6 flex-grow flex flex-col">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="text-xl font-bold text-gray-800 line-clamp-1">${serv.title}</h3>
                            <span class="text-lg font-bold text-primary">${price}</span>
                        </div>
                        <p class="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">${serv.description}</p>
                        <div class="flex flex-col gap-2 mb-4">
                            <div class="flex items-center text-sm text-gray-500">
                                <i class="fa-solid fa-map-marker-alt mr-2 w-4 text-center text-gray-400"></i> ${serv.location}
                            </div>
                            <div class="flex items-center text-sm text-gray-500">
                                <i class="fa-solid fa-phone mr-2 w-4 text-center text-gray-400"></i> ${serv.provider?.phoneNumber || 'Not Provided'}
                            </div>
                        </div>
                        <hr class="border-gray-100 mb-4">
                        <div class="flex justify-between items-center">
                            <button onclick="openVendorModal('${pName}', '${pEmail}', '${pPhone}')" class="text-xs font-medium text-primary bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded cursor-pointer transition hidden sm:inline-block border border-indigo-100">
                                <i class="fa-solid fa-user-tie mr-1"></i> ${serv.category.name} Provider
                            </button>
                            <div class="flex flex-wrap gap-2 justify-end mt-2 md:mt-0">
                                <button onclick="openReviewsListModal(${serv.id}, '${serv.title.replace(/'/g, "\\'")}')" class="bg-white border text-gray-600 hover:text-primary hover:bg-gray-50 font-semibold py-2 px-3 rounded-lg transition duration-300 text-sm flex items-center">
                                    <i class="fa-solid fa-star text-yellow-400 mr-1"></i> Reviews
                                </button>
                                <button onclick="openBookingModal(${serv.id}, '${serv.title.replace(/'/g, "\\'")}', '${serv.bookingType}')" class="bg-indigo-50 text-primary hover:bg-primary hover:text-white font-semibold py-2 px-4 rounded-lg transition duration-300 text-sm">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    } catch (e) {
        console.error(e);
        document.getElementById('services-container').innerHTML = '<p class="text-red-500 col-span-full">Failed to load services.</p>';
    }
}

// Search Logic
function setupSearch() {
    const searchBtn = document.getElementById('search-btn');
    if (!searchBtn) return;

    searchBtn.addEventListener('click', () => {
        const keyword = document.getElementById('search-keyword')?.value;
        const location = document.getElementById('search-location')?.value;
        const categoryId = document.getElementById('search-category')?.value;
        const minPrice = document.getElementById('search-min-price')?.value;
        const maxPrice = document.getElementById('search-max-price')?.value;
        
        let params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (location) params.append('location', location);
        if (categoryId) params.append('categoryId', categoryId);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        
        let query = params.toString() ? `?${params.toString()}` : '';
        
        document.getElementById('services-title').textContent = 'Search Results';
        document.getElementById('clear-filters').classList.remove('hidden');
        
        loadServices(query);
        // Scroll to services
        document.getElementById('services-title').scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('clear-filters').addEventListener('click', () => {
        document.getElementById('search-keyword').value = '';
        document.getElementById('search-location').value = '';
        document.getElementById('search-category').value = '';
        document.getElementById('services-title').textContent = 'Featured Services';
        document.getElementById('clear-filters').classList.add('hidden');
        loadServices('');
    });
}

function filterByCategory(categoryId, name) {
    document.getElementById('search-category').value = categoryId;
    document.getElementById('search-btn').click();
}

// Booking Logic
function openBookingModal(serviceId, serviceTitle, bookingType) {
    const user = Api.getUser();
    if (!user) {
        window.location.href = '/login.html';
        return;
    }

    if (user.role !== 'CUSTOMER') {
        window.showToast("Only customers can book services.", 'error');
        return;
    }

    const modal = document.getElementById('booking-modal');
    const content = document.getElementById('booking-modal-content');
    
    // Build form based on bookingType (HOURLY, DAILY, MULTI_DAY)
    let datesHtml = '';
    
    // Always provide time selectors for all booking types as requested by user
    const timeSelectors = `
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input type="time" id="book-start-time" required class="w-full px-4 py-2 border rounded-lg focus:ring-primary outline-none">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input type="time" id="book-end-time" required class="w-full px-4 py-2 border rounded-lg focus:ring-primary outline-none">
            </div>
        </div>
    `;

    if (bookingType === 'MULTI_DAY') {
        datesHtml = `
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input type="date" id="book-start-date" required class="w-full px-4 py-2 border rounded-lg focus:ring-primary outline-none" min="${new Date().toISOString().split('T')[0]}">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input type="date" id="book-end-date" required class="w-full px-4 py-2 border rounded-lg focus:ring-primary outline-none" min="${new Date().toISOString().split('T')[0]}">
                </div>
            </div>
        ` + timeSelectors;
    } else {
        // HOURLY and DAILY can both use a single Date selector + Time selectors
        datesHtml = `
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" id="book-start-date" required class="w-full px-4 py-2 border rounded-lg focus:ring-primary outline-none" min="${new Date().toISOString().split('T')[0]}">
            </div>
        ` + timeSelectors;
    }

    content.innerHTML = `
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 class="text-xl font-bold text-gray-800">Book Service</h3>
            <button onclick="closeBookingModal()" class="text-gray-400 hover:text-gray-600 transition">
                <i class="fa-solid fa-times text-xl"></i>
            </button>
        </div>
        <div class="p-6">
            <p class="text-gray-600 mb-4">You are requesting to book: <strong class="text-gray-800">${serviceTitle}</strong></p>
            <form id="submit-booking-form">
                <input type="hidden" id="book-service-id" value="${serviceId}">
                <input type="hidden" id="book-type" value="${bookingType}">
                ${datesHtml}
                <div id="booking-error" class="hidden text-red-500 text-sm mb-4 bg-red-50 p-3 rounded border border-red-100"></div>
                <button type="submit" class="w-full bg-primary hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300">
                    Send Request to Provider
                </button>
            </form>
        </div>
    `;

    modal.classList.remove('hidden');
    // small delay to allow transition
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);

    // Setup submit logic
    document.getElementById('submit-booking-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const sid = document.getElementById('book-service-id').value;
        const sType = document.getElementById('book-type').value;
        const err = document.getElementById('booking-error');
        err.classList.add('hidden');

        try {
            const payload = { serviceId: sid };
            payload.startDate = document.getElementById('book-start-date')?.value;
            
            if (sType === 'MULTI_DAY') {
                payload.endDate = document.getElementById('book-end-date')?.value;
            } else {
                payload.endDate = payload.startDate; // Hourly/Daily logic matches end to start identically
            }
            
            // Extract time unconditionally since all forms now possess it
            const st = document.getElementById('book-start-time')?.value;
            const et = document.getElementById('book-end-time')?.value;
            if(st && et) {
                payload.startTime = st + ':00';
                payload.endTime = et + ':00';
            }

            await Api.post('/bookings', payload);
            
            // Success
            content.innerHTML = `
                <div class="p-8 text-center">
                    <div class="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fa-solid fa-check text-3xl"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-800 mb-2">Request Sent!</h3>
                    <p class="text-gray-600 mb-6">The provider will review your request. You can track it in your dashboard.</p>
                    <button onclick="window.location.href='/dashboard.html'" class="bg-primary hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
                        Go to Dashboard
                    </button>
                </div>
            `;
        } catch (error) {
            err.textContent = error.message;
            err.classList.remove('hidden');
        }
    });
}

function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

async function openReviewsListModal(serviceId, serviceTitle) {
    document.getElementById('reviews-modal-title').textContent = `${serviceTitle} Reviews`;
    const container = document.getElementById('reviews-list-container');
    container.innerHTML = '<div class="text-center py-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></div>';
    
    const modal = document.getElementById('reviews-list-modal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.add('show', 'opacity-100');
        document.getElementById('reviews-list-modal-content').classList.remove('scale-95');
        document.getElementById('reviews-list-modal-content').classList.add('scale-100');
    }, 10);

    try {
        const reviews = await Api.get(`/reviews/service/${serviceId}`);
        if (reviews.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <i class="fa-regular fa-comment-dots text-5xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500 font-medium">No reviews yet. Be the first to book and review!</p>
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
    modal.classList.remove('show', 'opacity-100');
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
            <h3 class="text-xl font-bold text-gray-800"><i class="fa-solid fa-user-tie text-primary mr-2"></i>Vendor Details</h3>
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
        modal.classList.add('show', 'opacity-100');
        content.classList.remove('scale-95');
        content.classList.add('scale-100');
    }, 10);
}

function closeVendorModal() {
    const modal = document.getElementById('vendor-modal');
    const content = document.getElementById('vendor-modal-content');
    
    modal.classList.remove('show', 'opacity-100');
    content.classList.remove('scale-100');
    content.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}
