// كلمة سر الإدمن
const ADMIN_PASSWORD = "MBL INFO";

// بيانات المنشورات (سيتم تخزينها في localStorage)
let posts = JSON.parse(localStorage.getItem('shadowNetPosts')) || [];

// تحميل المنشورات عند فتح الصفحة
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.endsWith('admin.html')) {
        // إذا كنا في صفحة الإدمن
        const loginContainer = document.getElementById('loginContainer');
        const adminDashboard = document.getElementById('adminDashboard');
        
        // التحقق إذا كان المستخدم مسجل الدخول بالفعل
        if (localStorage.getItem('adminLoggedIn') === 'true') {
            loginContainer.style.display = 'none';
            adminDashboard.style.display = 'block';
            loadAdminPosts();
        }
    } else {
        // إذا كنا في الصفحة الرئيسية
        displayPosts();
    }
});

// عرض المنشورات في الصفحة الرئيسية
function displayPosts() {
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.innerHTML = '';
    
    if (posts.length === 0) {
        postsContainer.innerHTML = '<p class="no-posts">لا توجد منشورات متاحة حالياً.</p>';
        return;
    }
    
    // عرض أحدث المنشورات أولاً
    const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post-card';
        postElement.innerHTML = `
            ${post.image ? `<img src="${post.image}" alt="${post.title}" class="post-image">` : ''}
            <div class="post-content">
                <h3 class="post-title">${post.title}</h3>
                <span class="post-date">${formatDate(post.date)}</span>
                <p>${post.content}</p>
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
}

// تحميل المنشورات في لوحة التحكم
function loadAdminPosts() {
    const adminPostsContainer = document.getElementById('adminPostsContainer');
    adminPostsContainer.innerHTML = '';
    
    if (posts.length === 0) {
        adminPostsContainer.innerHTML = '<p class="no-posts">لا توجد منشورات حتى الآن.</p>';
        return;
    }
    
    posts.forEach((post, index) => {
        const postElement = document.createElement('div');
        postElement.className = 'post-card';
        postElement.innerHTML = `
            ${post.image ? `<img src="${post.image}" alt="${post.title}" class="post-image">` : ''}
            <div class="post-content">
                <h3 class="post-title">${post.title}</h3>
                <span class="post-date">${formatDate(post.date)}</span>
                <p>${post.content}</p>
                <button onclick="deletePost(${index})" class="delete-btn">حذف</button>
            </div>
        `;
        adminPostsContainer.appendChild(postElement);
    });
}

// التحقق من كلمة سر الإدمن
function checkAdminPassword() {
    const password = document.getElementById('adminPassword').value;
    const errorElement = document.getElementById('loginError');
    
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem('adminLoggedIn', 'true');
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        loadAdminPosts();
    } else {
        errorElement.textContent = 'كلمة السر غير صحيحة!';
    }
}

// تسجيل خروج الإدمن
function logout() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'admin.html';
}

// نشر منشور جديد
function publishPost() {
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const imageUrl = document.getElementById('postImage').value.trim();
    
    if (!title || !content) {
        alert('الرجاء إدخال عنوان ومحتوى للمنشور');
        return;
    }
    
    const newPost = {
        title,
        content,
        image: imageUrl || null,
        date: new Date().toISOString()
    };
    
    posts.push(newPost);
    localStorage.setItem('shadowNetPosts', JSON.stringify(posts));
    
    // تحديث العرض
    loadAdminPosts();
    
    // مسح حقول الإدخال
    document.getElementById('postTitle').value = '';
    document.getElementById('postContent').value = '';
    document.getElementById('postImage').value = '';
    document.getElementById('postPreview').innerHTML = '';
    
    alert('تم نشر المنشور بنجاح!');
}

// حذف منشور
function deletePost(index) {
    if (confirm('هل أنت متأكد من حذف هذا المنشور؟')) {
        posts.splice(index, 1);
        localStorage.setItem('shadowNetPosts', JSON.stringify(posts));
        loadAdminPosts();
    }
}

// تنسيق التاريخ
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
}

// معاينة المنشور (يمكن إضافة هذه الوظيفة إذا أردت معاينة قبل النشر)
document.getElementById('postImage').addEventListener('input', function() {
    const imageUrl = this.value.trim();
    const preview = document.getElementById('postPreview');
    
    if (imageUrl) {
        preview.innerHTML = `<img src="${imageUrl}" alt="معاينة الصورة" style="max-width:100%; border-radius:4px;">`;
    } else {
        preview.innerHTML = '';
    }
});